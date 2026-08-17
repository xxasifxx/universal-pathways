# Lower the volume, keep the substance

The problem isn't that the site says what Saqeeb cares about — it's the register. Twenty-two promises with lever panels and budget mechanics read as a first-time candidate who has already decided how the district should run. The fix is to keep the priorities page, keep the why, and change how certain it sounds. Nothing gets hidden and nothing gets swapped out from under a reader.

## The why, stated once and stated well

Saqeeb's background — Special Education placement that followed him for six years, self-advocacy alongside his immigrant parents, summa cum laude in Psychology, Master's in Data Science — is the reason he's interested in how this district sorts kids. Right now the site doesn't say it, and without it the priorities float free.

It goes in two places, written as his own account rather than a story about him:
- A short version on the home page, immediately under the hero, in his voice.
- The fuller version opening the priorities page, so every priority below it reads as something that came from somewhere.

## Priorities: interests, not commitments

The three sections stay — Affordability, Students First, Reduce Costs — and so do the specific things he's interested in. What changes is the frame and the volume.

- The page opens with the why, then a plain statement: he's running for the first time, these are the things he intends to pursue, and how far each can go depends on what a board actually controls and what he learns in the seat.
- Promise wording moves from "we would" to what he wants to look at and push for. "Universally paid full-day Pre-K" becomes his goal, not a guarantee he can deliver it.
- The disclosure panels stay, because they're the honest part — they show the budget line or state rule involved and say what nobody can answer yet. Their tone shifts from "here's the lever we'll pull" to "here's what constrains this, and here's what I'd need to find out." The verified facts and sources stay exactly as they are.
- The "what it would cost / fund the study" section stays but stops asking for money to prove a point; it explains why he isn't putting price tags on things he hasn't costed.

## Explainers: facts, no conclusions

`/dashboard` and `/pilot` keep every verified figure, chart and source. What comes out is the inference at the end of each — the sentences that take a budget line and turn it into a position. A resident should be able to read both, disagree with Saqeeb, and still find them useful. The CTA blocks that push from an explainer into the platform come out too.

## The debate

The first debate is September 30. Rather than gating anything, a small line on the priorities page notes that he's answering fifteen specific questions there and invites people to send their own through the contact form — which is already on the home page. It sets the expectation that his positions get sharper after he's answered publicly, without withholding what he thinks now.

## Reviewer drafts

The material that shouldn't be public yet — full answers to the fifteen debate questions, and any promise language still being worked out — lives in a private drafting area at `/admin/drafts`, reachable two ways: a `reviewer` role for accounts, and a passcode link for outside readers. Reviewers see only the drafts, never voters or intent data, and can comment per section.

The volunteer form gains a "Help review the platform (research)" option with a short "what background do you bring?" field so you can vet requests before handing out access.

## Home page

The priorities block is doing too much talking. It keeps the three headings and one line each, drops the paragraph-length elaboration, and links through to the priorities page for the rest. The "Saqeeb will fight for" band keeps its three flyer items; the verb softens.

## Technical notes

- `src/lib/campaign.ts`: rewrite the copy in `PRIORITIES` (summaries, point text, panel `mechanism` and `openQuestion` prose) — the structure, `LeverKind` tags, and every source URL stay untouched. Add a `CANDIDATE_STORY` export for the background, short and long form, and a `DEBATE` constant.
- `src/routes/priorities.tsx`: new intro block (story + first-time framing + debate note); existing sticky nav, two-column layout and `<details>` panels unchanged.
- `src/routes/index.tsx`: story block under the hero; trim `PLATFORM_HIGHLIGHTS` rendering to heading + one line; soften `FIGHT_FOR` verb.
- `src/routes/dashboard.tsx`, `src/routes/pilot.tsx`, `src/components/budget-insights.tsx`: remove closing inference sections and platform CTAs; figures, charts and sources unchanged.
- Navigation stays as it is — nothing is removed from the header, footer or sitemap.
- Migration: add `reviewer` to the `app_role` enum; `platform_drafts` and `draft_comments` tables with grants and RLS via `has_role`; hashed passcode checked by a server function issuing a short-lived read-only cookie. `src/components/admin/admin-shell.tsx` gets role-aware nav.
- Volunteer form: add a `researcher` entry to `HELP_OPTIONS` plus a zod-validated, length-capped free-text field, included in the notification email.
- Update `head()` descriptions on the pages whose framing changes.
