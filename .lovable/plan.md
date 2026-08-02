## Goal

Add the full person-level intent-tracking stack and authenticated admin area to the campaign site, adapted from the PRD's react-router + Edge Function architecture to this project's TanStack Start stack.

Confirmed current state: the project has no auth, no admin routes, no `user_roles` table (only `contact_messages` and `volunteer_signups`), and no tracking code. Everything below is new.

## Stack translation

| PRD | Here |
|---|---|
| Supabase Edge Functions (`log-signal`, `ingest-*`) | TanStack server routes under `src/routes/api/public/*` (no auth, service-role writes, CORS + OPTIONS) |
| Admin read edge functions | Authenticated `createServerFn` with `requireSupabaseAuth` + an admin role check |
| `requireAdmin(req)` guard | `has_role(auth.uid(),'admin')` checked through the caller's own client before any admin client use |
| react-router `<AdminRoute>` | `src/routes/_authenticated/` gate + an admin-role check inside the admin layout |
| Hardcoded `SIGNAL_URL` | Same-origin `/api/public/...` paths, no env needed |

## Phase 1 — Database

One migration: `app_role` enum, `user_roles` + `has_role()` (security definer), `visitors`, `lead_signals`, `pointer_samples`, `replay_events`, all indexes from §6, GRANTs before RLS, admin-only SELECT policies, no anon insert policies (ingest is service-role). Adds `visitor_id` FK to the existing `contact_messages` and `volunteer_signups` tables. Then an insert granting the owner's account the `admin` role.

## Phase 2 — Client identity + consent

- `src/lib/visitor.ts` — `anon_id` (localStorage `lv_anon_id`), `session_id` (sessionStorage).
- `src/lib/fingerprint.ts` — lazy FingerprintJS, cached, `getFingerprintSync()` returns null until resolved.
- `src/lib/tracking-consent.ts` — DNT, `lv_no_track` cookie/localStorage, `?heatmap=1` preview suppression. Every emitter checks it first.
- `src/lib/preview.ts` — heatmap-iframe detection.
- All of this is browser-only and mounted client-side so SSR is unaffected.

## Phase 3 — Emitters

`src/lib/analytics.ts` with the full event enum, enriching each signal and sending it as a `text/plain` blob via `sendBeacon` with a `fetch(keepalive)` fallback.

Hooks in `src/hooks/`: `usePageView`, `usePageEngagement` (scroll depth, active-only time, `page_exit` with `dwell_ms`), `useClickTracking` (delegated capture listeners, rage/dead click, hover dwell), `usePointerTracking` (~10 Hz, document-percent coords, ≤200-sample batches), `useSessionReplay` (rrweb, `maskAllInputs`, ~150 KB chunks, monotonic `seq`, hover annotations). Mounted once in `__root.tsx` inside a client-only wrapper. `useServiceIntent` is adapted to campaign content: priority planks, calculator interactions, donate/volunteer CTAs.

## Phase 4 — Ingest routes

`src/routes/api/public/log-signal.ts`, `ingest-pointer.ts`, `ingest-replay.ts`. Each: OPTIONS short-circuit, permissive CORS, zod validation, size caps (256 KB / 2 MB), server-derived IP and UA, `supabaseAdmin` loaded inside the handler, never throws to the client. `log-signal` implements the three-step visitor resolution (anon_id → orphan fp_hash adoption → insert) in `src/lib/visitors.server.ts`.

Identity attachment: `submitVolunteer` / `submitContact` gain optional `anon_id` + `fp_hash`, resolve the visitor, stamp name/email/phone + `identified_at`, and store `visitor_id` on the lead row.

## Phase 5 — Admin area

- `src/routes/_authenticated/route.tsx` (integration-managed gate) + `src/routes/auth.tsx` login page: email/password plus Google (configured the same turn).
- `src/routes/_authenticated/admin/` — layout with pill tabs, recording on/off toggle, sign out; children `intent`, `heatmaps`, `export`. Non-admin authenticated users get an explicit "Access denied" screen, not a redirect loop. Admin session arms `setTrackingDisabled(true)`.
- Admin data via `src/lib/admin.functions.ts`: `readVisitors` (with session grouping by `session_id`, 30-min fallback gap, per-session span/active/pages/clicks; visitor-level active time labelled as a total across N sessions), `readVisitorDetail`, `readSignals`, `readHeatmap`, `readReplays`, `exportEngagement`.
- **Intent tab**: People table → detail side panel (identity, sessions block, per-page table, hover→click conversion, replay, raw timeline); Signals feed with filters; Leads tab showing volunteer + contact submissions joined to their visitor.
- **Replay tab**: chunks sorted by `seq`, segmented at every type-4 meta / type-2 full snapshot with one chip per page-load segment, idle gaps >3 s rewritten to 1 s with a "skipped Xm idle" note, hover annotation overlays.
- **Heatmaps tab**: same-origin iframe at true device viewport (390×844 / 1280×900) with `?heatmap=1`, scrolled via `contentWindow.scrollTo`, heat canvas drawn at viewport size with document-percent points translated by the scroll offset, mini document map, path/viewport/mode/date/intensity controls.
- **Export tab**: date range + path + grouping → CSV downloaded client-side.

## Phase 6 — Defects from §10, fixed up front

Env-free same-origin signal URL; no gtag mirror; replay sampling (configurable %, default 25%); a retention purge (`pg_cron` deleting replay/pointer >30 days, `lead_signals` >180 days); `cta_hover` aggregated rather than persisted per event; a note in the admin UI that a closed tab starts a new session.

## Technical notes

- New dependencies: `@fingerprintjs/fingerprintjs`, `rrweb`, `rrweb-player`. All are loaded dynamically after hydration so they never enter the SSR graph.
- `src/start.ts` already registers `attachSupabaseAuth`, so admin server fns get bearer tokens automatically.
- Admin server fns verify the admin role through the caller's own RLS-scoped client before touching the service-role client.
- Public-site routes stay SSR and unauthenticated; the tracking hooks are strictly client-side.
- Per your note, no separate privacy disclosure page will be added; DNT and the opt-out toggle still ship since the heatmap preview depends on them.

## Scale caveat

This is a large build — roughly 30 new files across DB, tracking, ingest, and a four-tab admin SPA. I'd suggest doing it in the phase order above so each layer is verifiable (DB → tracking fires → ingest rows land → admin reads them) rather than all at once.
