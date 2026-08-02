## Goal

Two deliverables: (1) the site is genuinely launch-ready so the candidate can publish without hitting anything broken, and (2) a defensible fair-market-value document for the work done.

## What I verified before writing this

- `lead_signals` is healthy: 206 rows, most recent 17:20 today. Page views, clicks, calculator/scenario outcomes are all landing.
- `replay_events` has **0 rows**. `pointer_samples` has **4 rows**, last written 16:04. So heatmaps and session replay in the admin area currently show nothing.
- Likely causes, to confirm during the fix: pointer batches only flush on `pagehide`, `visibilitychange`, or after 200 samples — an SPA route change never flushes, and touch devices barely fire `pointermove`. Replay is gated behind a 25% session sample and 150 KB chunks, so with low traffic and `sendBeacon`'s ~64 KB per-payload ceiling the chunks may never make it.
- Forms (`contact_messages`, `volunteer_signups`) were confirmed writing correctly in earlier testing; they'll be re-tested as part of the launch pass.

## Part 1 — Make it work

**Fix the tracking pipeline (the only actually broken subsystem)**
- Flush pointer batches on route change and on a short timer, not just on page unload; record touch/tap points so mobile visitors register at all.
- Drop replay chunk size below the beacon ceiling and raise the sample rate temporarily to confirm end-to-end writes, then set it back down.
- Verify in the browser that a real session produces rows in both tables, and that the admin Heatmaps and Replay tabs render them.

**Cost control, so a live campaign site doesn't run up credits**
- Lower pointer sampling from 10 Hz to ~4 Hz and cap samples per page.
- Keep replay at a low session sample rate and shorten retention (replay 14 days, pointer 14 days) via the existing purge function.
- These land with the fix, so the pipeline goes live already tuned.

**Launch readiness pass across all 10 public routes and 5 admin routes**
- Click through every page and every interactive tool at desktop and mobile widths, capture anything visually broken or dead.
- Submit both forms live and confirm the rows arrive.
- Confirm admin sign-in works for both admin accounts and each tab loads data.
- Check every page has its own title/description, `robots.txt` still blocks `/admin`, and no console errors on any route.
- Run the security scan and resolve anything critical before publishing.
- Publish, then load the live URL and re-verify the homepage, one form, and one tracking write against production.

## Part 2 — Fair market value document

A PDF written to survive scrutiny (including ELEC review), containing:
- Scope inventory: routes, components, database tables, migrations, lines of code — measured, not estimated.
- Named deliverables: budget dashboard, per-child cost calculator, board-meeting scenario lab, journey timeline, policy flowchart, zone map, methodology/sources page, WCAG 2.1 AA accessibility work, five-language i18n scaffolding, and the admin intent-tracking platform.
- FMV benchmarked two ways: (a) comparable US agency/freelance market rate for equivalent scope, showing what this would ordinarily cost, and (b) actual cost basis at the $30/hr solo-operator rate plus pass-through infrastructure.
- Ongoing retainer line for hosting, monitoring, and content updates.
- A short assumptions-and-sources note, matching the transparency standard already set on the `/methodology` page.

## Technical notes

The tracking fix touches `src/hooks/use-pointer-tracking.ts`, `src/hooks/use-session-replay.ts`, and a retention migration on `purge_tracking_data()`. No schema changes, no changes to the public-facing pages. The FMV document is generated as a downloadable PDF artifact, not a site page.
