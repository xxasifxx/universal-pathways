## What the data actually shows

I queried the live tracking tables before writing this. 85 signals, 5 "visitors", and the problems are concrete:

- **You are split across two rows.** Two visitor records share fingerprint `59066a14…`, IP `39.42.167.153`, and the same iPhone user-agent, but different `anon_id` — so they never merged. The merge logic only adopts a fingerprint row when its `anon_id` is empty; once a row has an id, a fresh browser id (private tab, storage clear, new build) starts a brand-new "person" forever.
- **19 of 85 signals have no fingerprint at all.** The fingerprint is cached in `sessionStorage`, so it recomputes every session, and everything emitted before it resolves goes out unfingerprinted. Those signals can never be re-linked later.
- **Admin browsing is tracked as lead activity.** `/admin/login` and `/admin/intent` page views and sessions are in the dataset. Your own admin traffic is inflating the numbers.
- **24 of 85 signals — the single largest event type — are junk hovers.** The hover selector matches `[tabindex]`, which catches the whole `<main>` element, so the label recorded is `"Campaign adminStaff only. This dashboard shows visitor..."` with `tag: main`, fired repeatedly. It measures nothing.
- **Only 8 event types ever fired**, all mechanical (page_view, scroll, exit). None of the campaign-intent events (priority plank read, calculator run, budget scenario, volunteer abandon) show up, because the emitters only listen for `data-intent` attributes and almost nothing on the site carries them.

Net: it's a firehose of anonymous mechanics, not a record of who cared about what.

## What I'll change

### 1. Identity that survives a new browser id
- Fingerprint moves to `localStorage` and resolves before the first signal is sent (short await with a timeout, so page speed isn't affected), so no signal ships unfingerprinted.
- Server-side resolution becomes: match on `anon_id` → else match on `fp_hash` **regardless of whether that row already has an anon_id** → else insert. When a fingerprint match has a different `anon_id`, both are recorded as aliases of one person.
- New `visitor_aliases` table (visitor_id, anon_id, fp_hash) so one person can own many device ids, plus a `merged_into` column on `visitors` so old rows fold into the survivor without deleting history.
- A backfill migration that merges the existing duplicate pair and re-points its signals.
- Identity is sticky: once you fill a form, name/email/phone propagate across every alias, past and future.

### 2. Stop polluting the dataset
- Suppress all tracking on `/admin/*` and for any signed-in admin session (the self-record toggle stays for deliberate testing).
- Delete the `[tabindex]` hover rule; hover only fires for real links/buttons with a real label, deduped per element per page view, and only above a meaningful dwell.
- Purge the existing junk `cta_hover` and admin-path rows so the dashboard starts honest.

### 3. Signals that mean something for a campaign
- Tag the real surfaces with intent markers: each priority plank, the budget dashboard, the per-child calculator, the board-meeting scenario lab, the journey timeline, the zone map, donate/volunteer/contact CTAs.
- Add outcome-level events: calculator completed (with grade + services chosen), scenario copied for public comment, zone selected, volunteer form started vs. abandoned vs. submitted, priority read to the end.
- Roll them into a per-person **intent profile**: top issues by attention, whether they ran their own numbers, whether they're map-adjacent to a zone, and a lead stage (browsing → engaged → ready to ask).

### 4. Admin that shows people, not hashes
- Person row shows a resolved label (name → email → phone → device summary like "iPhone · East Brunswick · 3 visits") instead of `anon 4cbb7258`.
- Manual **Merge** and **Rename / tag as me** actions, and a "this is staff, exclude" flag.
- Detail view leads with the intent profile and a plain-English story of the visit, with the raw signal feed demoted to a tab.

## Technical notes

Migration adds `visitor_aliases`, `visitors.merged_into`, `visitors.is_staff`, with GRANTs and admin-only read policies; writes stay server-side through the service role. Resolution logic lives in `src/lib/visitors.server.ts`; the ingest routes under `src/routes/api/public/*` keep their current shape. Emitters change in `src/hooks/use-click-tracking.ts`, `use-campaign-intent.ts`, and `src/lib/tracking-consent.ts`; admin aggregation in `src/lib/admin.server.ts` plus new merge/label server functions in `src/lib/admin.functions.ts`.
