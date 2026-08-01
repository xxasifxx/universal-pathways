## What we're building

Two things, tied together:

1. **A working tool** at a new page, `/cost-calculator` — "What does the district spend on my kid?"
2. **A new priority plank** in the platform promising to make the district publish this officially, linking to the working demo as proof it's buildable.

## Page 1 — Parent mode

A parent lands on the page and either picks a ready-made scenario or fills in their own child.

**Inputs (all optional, all client-side — nothing is stored or sent anywhere):**
- Grade level / school — elementary, middle, high (per-pupil cost differs by level)
- Services used — checkboxes: special education, ESL / multilingual support, busing, free or reduced lunch, athletics & activities
- Annual property tax bill — optional single field
- Or skip all of it: three preset kids ("4th grader, walks to school", "7th grader with an IEP and a bus", "11th grader, three APs and a sport")

**Output:**
- One big number: total district spending on this child this year
- A stacked breakdown of that number against the same six budget lines already used on the home page (teachers, support staff, special ed, benefits, buildings, admin) so the two dashboards speak the same language
- If a tax bill was entered: "About $X of your $Y tax bill goes to the schools, and roughly $Z of that follows your child." Includes a plain-English note that schools are funded collectively — one household's bill never covers one child, and that's the point.

## Page 2 — Board-meeting mode

Same page, second section, designed to be usable on a phone in the back row of a board meeting.

**Presets** — one tap loads a live proposal, e.g.:
- Cut 10 classroom aides
- Add 5 counselors
- Trim busing by one tier
- 2% across-the-board staff raise
- Flat-fund next year (inflation-only cut in real terms)

**Sliders** — after loading a preset (or from scratch), adjust the underlying lines: classroom aides, counselors, busing routes, staff pay, supplies. Each change updates, in real time:
- The dollar change **per child** — for the child configured above, not an abstract average
- The change to the **total budget** and to a typical tax bill
- A **plain-English consequence line** for each moved slider — what it actually means in the room, e.g. "10 fewer aides means ~28 classrooms lose their second adult; the kids who need someone sitting next to them lose them first." That's the qualitative half you asked for.

A "reset to current budget" button, and a share/copy-summary button so an attendee can paste their numbers into a comment.

## Priority plank

New sixth plank in the platform, in the same voice as the others: the district should publish this itself. Written to be honest about the limits — the site's numbers are modeled from the public budget, and only the district has the real per-pupil detail, which is exactly why they should be the ones publishing it. Cross-linked from the priorities page and the home page budget section.

## Honesty guardrails

Every number is modeled from the public $229M budget already on the site, not district-supplied. Every screen carries that disclaimer, in plain language, not buried fine print. The calculator never asks for a child's name, school, or any identifying detail, and stores nothing.

## Technical notes

- New route `src/routes/cost-calculator.tsx` with its own head metadata, plus two components (`per-child-calculator.tsx`, `budget-scenario-lab.tsx`).
- All math lives in a new `src/lib/cost-model.ts`: per-pupil base derived from the existing `BUDGET_TOTAL` and 8,100 students, level weights, service add-ons, and the slider line-items with their per-unit cost and consequence copy. Deriving from the existing constants keeps the two dashboards consistent.
- Pure client-side state — no database, no server functions, no new backend.
- Reuses existing Recharts setup, design tokens, i18n catalog, and the accessibility patterns already established (keyboard-operable sliders with visible text values, `aria-live` on results, labelled inputs, error text linked via `aria-describedby`).
- New plank appended to `PRIORITIES` in `src/lib/campaign.ts`; nav link added in the header and footer.
