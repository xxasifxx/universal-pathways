# Lower the volume in public, build a review room behind it

Two separate problems, and they have to be solved together.

The public site has gotten ahead of the candidate. Twenty-two promises with lever panels, budget mechanics and a per-pupil figure read as a first-time candidate who has already decided how the district should be run. An opponent can feed those pages to a model and get twenty attack lines by lunch, and any one of them only has to be half-true to hurt. That isn't an argument for hiding what he thinks — it's an argument for saying it at the volume a first-time candidate can actually stand behind.

The second problem is that the drafted material is genuinely good and genuinely extensive, and nobody has read it but us. Long-form policy writing published without review is exactly what gets weaponized — a clumsy sentence quoted back at him, a number he can't defend from memory at a podium, or a well-researched framing lifted wholesale by a competitor before he's said it out loud himself. That material needs a small circle of trusted readers before it goes public, and recruiting those readers is a campaign job in its own right.

## 1. The why, said once and said properly

Saqeeb was placed in Special Education as a kid in this district — not because he couldn't do the work, but because he was difficult at times, and the label followed him for nearly six years and shaped what was offered to him afterward. He got out of it by learning to advocate for himself alongside his immigrant parents, went to independent study to get ahead, and finished summa cum laude in Psychology before a Master's in Data Science.

That is the reason he cares about how this district sorts children, why placement criteria and early intervention keep showing up in what he wants to pursue, and why he is careful about claiming certainty. Right now the site doesn't say any of it, so the priorities read as opinions from nowhere.

- Short version on the home page, under the hero, in his own voice and first person.
- Fuller version opening the priorities page, so everything below it is visibly connected to something he lived.

He doesn't blame educators for it, and the copy shouldn't either — his line is that systems make decisions about children before anyone understands who they are. That sentence does more work than any promise on the page.

## 2. Priorities: things he intends to pursue

The three sections stay — Affordability, Students First, Reduce Costs — and the specific items stay. What changes is certainty, not substance.

- The page opens with the why, then says plainly: he's a first-time candidate, these are the things he intends to pursue, and how far each goes depends on what a board actually controls and what he learns once he's in the room. That framing is a shield and it's also true.
- Wording shifts from "we would" to what he'll push for and look into. Full-day Pre-K stays a goal; it stops being a guarantee he can personally deliver.
- The disclosure panels stay — they're the most defensible thing on the site, because they already say what nobody can answer yet. Their tone shifts from "here's the lever we'll pull" to "here's the constraint, and here's what I'd need to find out." Verified facts and source links are untouched.
- The cost section stops soliciting money to prove a point and simply explains why he won't put price tags on things he hasn't costed.

## 3. Explainers: facts without the verdict

`/dashboard` and `/pilot` keep every figure, chart and source. What comes out is the closing inference on each — the sentences that take a budget line and convert it into a position, and the CTA blocks that funnel a reader from an explainer into the platform. A resident should be able to read both, disagree with Saqeeb entirely, and still find them useful. That is also the version that survives being quoted back at him.

## 4. The debate, framed honestly

The first debate is September 30. He has fifteen questions he's preparing for — on healthcare costs, Pre-K, budget triage, retention, outsourcing, facilities and the high school, activity fees, special education, teacher discretion, Trenton advocacy, staff voice, compensation versus taxes, early intervention, contract oversight, and access to advanced courses. Those are prep material, not a public promise sheet, so they do not go on the site as "questions he will answer."

What goes public is one short line on the priorities page: the debate is September 30, his positions will be sharper once he's answered in front of people, and if you want him to address something specific, send it through the contact form. Nothing is gated behind the date and nothing is withheld.

The fifteen questions and his working answers live in the review room.

## 5. The review room, and the researchers who staff it

A private drafting area at `/admin/drafts` holding the material that shouldn't be public in its current form: the full priorities content with all lever panels and sources, the passages pulled out of the two explainers, and the fifteen debate questions with draft answers as they develop.

Two doors, as you asked:
- **Reviewer accounts.** A `reviewer` role on the existing login. Reviewers see drafts only — never voters, intent, replays or exports. Admins keep everything.
- **Passcode link.** A private URL plus a rotatable passcode for someone you want reading tonight without an account. Read-only; only signed-in reviewers can comment.

What reviewers actually do, and what the UI should make obvious: read a draft and flag the sentence that could be clipped and used against him, the claim that isn't sourced well enough to survive a challenge, and the place where he sounds more certain than a first-time candidate should. Each section takes an inline comment; comments show author and time, and a draft carries a status — drafting, in review, cleared — so you can see at a glance what's ready.

Because the material is unpublished, the area is also where competitor copying is managed: nothing leaves it until it's cleared, and access is granted person by person.

**Recruiting the reviewers** is why this is a volunteer option. The volunteer form gains "Help review the platform (research)" alongside yard sign, canvassing and phone bank, with a short "what background do you bring?" field — a teacher, an ex-board member, a budget person, a lawyer, a parent who's been through the special-education process. It's a real ask with a low time cost, it recruits exactly the people whose judgment is worth having, and it gives you something to vet against before handing out access. The request lands in the same submissions table and the same notification email as every other signup.

## 6. Home page

The priorities block talks too much for a home page. It keeps the three headings and one line each and links through for the rest. The "Saqeeb will fight for" band keeps its three flyer items with a softer verb. The story block goes in under the hero.

## Technical notes

- `src/lib/campaign.ts`: rewrite copy inside `PRIORITIES` (summaries, point text, panel `mechanism` and `openQuestion`) — structure, `LeverKind` tags and every source URL unchanged. Add `CANDIDATE_STORY` (short and long form), `DEBATE` (date + one-line public note), and `DEBATE_QUESTIONS` (the fifteen, imported only by the drafts route).
- `src/routes/priorities.tsx`: new intro (story, first-time framing, debate line); existing sticky nav, two-column layout and `<details>` panels unchanged.
- `src/routes/index.tsx`: story block under the hero; trim `PLATFORM_HIGHLIGHTS` to heading plus one line; soften `FIGHT_FOR` verb.
- `src/routes/dashboard.tsx`, `src/routes/pilot.tsx`, `src/components/budget-insights.tsx`: drop closing inference sections and platform CTAs; figures, charts and sources unchanged.
- Navigation, footer and sitemap unchanged — nothing is removed or redirected.
- Migration: add `reviewer` to the `app_role` enum; `platform_drafts` (slug, title, body, status) and `draft_comments` (draft, section anchor, author, body) with grants and RLS through `has_role`; a hashed passcode row checked by a server function that sets a short-lived read-only cookie. Passcode readers read; reviewers comment; admins write.
- `src/routes/admin/drafts.tsx` plus role-aware nav in `src/components/admin/admin-shell.tsx`, and `useAdminSession` extended to return the role rather than a boolean `isAdmin`.
- Volunteer form: `researcher` entry in `HELP_OPTIONS` and a zod-validated, length-capped background field stored in the existing `help_details` jsonb column and included in the notification email.
- `head()` descriptions updated on the pages whose framing changes.
