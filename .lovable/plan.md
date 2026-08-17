# Pull back the public platform until the September 30 debate

The detailed pages read as fixed positions this early in the race. This moves the position-taking behind a review wall, keeps the factual material public, and turns the debate date into the reason for the pause.

## 1. Public site changes

**/priorities becomes a holding page.** Countdown to the September 30 debate, a short note that the full platform is published at the conclusion of the debate, the candidate's own background in his words, and the existing question form inline ("ask a question and he'll answer it"). No promises, no lever panels.

**/pilot and /dashboard stay, stripped of advocacy.** Same verified figures and sources, same charts. Removed: every "what we would do", "Saqeeb will fight for" framing, the CTA blocks that push toward the platform page, and any sentence that infers a policy conclusion from a budget line. They read as explainers a resident wrote, not a manifesto.

**Navigation.** Priorities, District dashboard and PILOT deals come out of the header nav. The footer keeps the dashboard and PILOT links; priorities points at the countdown page. Home page loses its "read the platform" CTA and instead points at the question form and the countdown. All three URLs stay live and stay in the sitemap so nothing already shared breaks.

**Home page.** The "Saqeeb will fight for" band softens into three topics he's focused on, without commitments. Add the background story from the candidate's own words.

## 2. Draft platform area for reviewers

The full current content — the three priorities with their lever panels, sources and open questions, plus the advocacy passages pulled out of the two explainers, plus the fifteen debate questions as a working answer sheet — moves into a private drafting area at `/admin/drafts`.

Two ways in, as you asked:
- **Reviewer accounts.** A new `reviewer` role. Reviewers see the drafts area only — never voters, intent, replays or exports. Existing admins see everything as today.
- **Passcode link.** A private URL plus a shared passcode for outside readers, verified server-side, rotatable, read-only.

Reviewers can read every draft and leave a comment per section. Comments show up in the drafts view with who left them and when.

## 3. Researcher as a volunteer option

A fourth option in the volunteer form: "Help review the platform (research)", with a short "what background do you bring?" field so you can vet requests before handing out access. It flows through the existing submission and email path.

## Technical notes

- New `src/routes/priorities.tsx` holding page; the current page body and its data move to a draft-only component. Countdown is client-side against a `DEBATE_DATE` constant in `src/lib/campaign.ts`, with an SSR-safe static fallback.
- `src/lib/campaign.ts` keeps `PRIORITIES` and `PROMISE_COST_LENS` but they are imported only by the admin drafts route, so they no longer reach public pages.
- Migration: add `reviewer` to the `app_role` enum; new `platform_drafts` and `draft_comments` tables with grants and RLS scoped through `has_role`; a hashed passcode row checked by a server function that issues a short-lived read-only cookie. Passcode readers get read-only access; only signed-in reviewers can comment.
- `src/components/admin/admin-shell.tsx` gains role-aware nav so reviewers see one item.
- Volunteer form: extend `HELP_OPTIONS` with `researcher` plus a zod-validated, length-capped free-text field; notification email includes it.
- Head metadata updated on all three public pages so the countdown page describes itself accurately and the explainers no longer advertise a platform.
