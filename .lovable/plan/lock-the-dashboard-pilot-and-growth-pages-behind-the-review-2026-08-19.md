# Lock the dashboard, PILOT and growth pages behind the review room

The three research pages become reviewer-only. Nothing about them is reachable by guessing a URL, and the review room grows into a proper workspace instead of a single scrolling list.

## 1. Real server-side gating (not just hidden links)

The current review room already does the right thing: the passcode session lives in an httpOnly cookie and the draft text only leaves the server after the cookie checks out. The three pages get the same treatment.

- The budget figures, PILOT explainer copy and growth research move into server-only content modules. They are returned by a gated server function, so a signed-out visitor's browser never downloads them — not in the page, not in the JS bundle.
- New routes `/review/dashboard`, `/review/pilot`, `/review/growth` render client-side only and fetch through that gated function.
- Locked visitor at any of those URLs: the server returns nothing, the page renders a 404 "Page not found" screen (same one the rest of the site uses), with no hint that the page exists. Reviewers who are simply signed out get sent to the passcode screen instead.
- The old public `/dashboard` and `/pilot` URLs stay gone (404), and all three stay out of the sitemap with `noindex, nofollow`.

## 2. What lives on each reviewer page

- **District dashboard** — the FY2027 budget breakdown, revenue, movement, reserves and per-pupil views, restored exactly as they were.
- **PILOT explainer** — the full sourced explainer, restored as it was, with its source list intact.
- **Township growth** — a real page built from the apartments-and-enrollment research currently sitting in the review room as a text block: what was built, what happened to enrollment, and what it means for the schools, with sources.

## 3. Reviewer UI/UX pass

Step by step, what a reviewer actually does: get in, see what needs attention, read a piece, leave a note, mark it, move to the next.

- **A shared review layout.** One sticky top bar across every review page: workspace name, tabs (Drafts, Dashboard, PILOT, Growth), reviewer name, "Lock this device". Your name is asked once and follows you everywhere.
- **A landing summary.** At the top of the drafts list: counts by status and total open notes, each one clickable as a filter, so "what still needs me" is the first thing on screen.
- **Open items first.** Sections with unresolved notes sort to the top, and the open-note badge is legible at a glance.
- **Read, then react.** Inside an expanded section the reading copy comes first, then status buttons, then the note box — instead of today's status row interrupting the read.
- **Notes on the new pages too.** Each of the three pages carries the same note box and status control, keyed to its own draft entry, so feedback lands in one place.
- **Saving feedback that is honest.** Buttons show a pending state and a confirmation; an expired session says so and sends you to the passcode screen rather than silently failing.
- **Mobile-first.** These get read on phones: single column, large tap targets, tabs scroll horizontally, no hover-only affordances.

## 4. Notes

No public-facing page changes. Nothing new is exposed to search engines.

## Technical notes

- New `src/routes/review.tsx` pathless-free layout route rendering the shared shell + `<Outlet />`, with `review.index.tsx`, `review.dashboard.tsx`, `review.pilot.tsx`, `review.growth.tsx` as children (`ssr: false`).
- `src/lib/review-gate.functions.ts` gains a `getReviewPage` server function taking a page key; it re-uses `isUnlocked()` and dynamically imports server-only content modules (`src/lib/review-content/*.server.ts`). Locked → `{ locked: true }`, and the route renders the 404 component.
- Budget/PILOT/growth content and the previously deleted `dashboard.tsx` / `pilot.tsx` markup are recovered from git history and re-homed under the review routes; `budget-dashboard.tsx` and `budget-insights.tsx` are refactored to take their data as props from the gated fetch rather than importing constants at module scope.
- Three new draft keys registered in `src/lib/drafts.ts` so status and comments work on the new pages.
