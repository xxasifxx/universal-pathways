# Growth without choking: one synthesis, written as an argument

The last pass filed the research as a checklist of what is verified and what is missing. That is a work log, not a piece of writing. This rewrite turns the same material into a single continuous argument: here is what East Brunswick has built, here is what it did and did not do to our schools, here is where the money actually goes, and here is what the board should change so the town keeps growing without the schools absorbing the cost of it.

It stays in the review room for now, keyed `growth:apartments-enrollment`, same as the existing draft. Reviewers see the argument first; a public page gets planned once they clear it.

## The through-line

The synthesis rests on a tension the sources actually carry, rather than on the assumption we started with:

- The town has been converting tired corridor property into apartments under redevelopment and long-term tax exemption law, and it has been doing that deliberately.
- Enrollment across nine years of district filings is flat — roughly 8,200 to 8,560, no sustained climb. The feared surge has not shown up in the record yet.
- Meanwhile 76.4% of a $209 million school budget is raised locally, and a payment in lieu of taxes is distributed by a formula that does not run through the school levy the way an ordinary tax bill does.

So the honest argument is not "apartments are flooding our schools." It is that the town has taken on long-dated financial commitments whose school-side consequences arrive later than the buildings do, and nobody has published the numbers that would let a board member see them coming.

## Structure of the rewritten section

1. **Where we actually are** — the growth story and the flat enrollment record side by side, with the years named. States plainly that the alarm version of this argument is not supported by the data we have.
2. **Why flat enrollment is not the end of the argument** — the buildings are recent, occupancy dates are unpublished, bedroom mix drives student generation far more than unit count, and the Rutgers multiplier work shows rates falling but not to zero. What is coming is a question of timing, not of whether.
3. **Where the money goes** — the statutory service charge under the Long Term Tax Exemption Law against the ordinary levy split, plus the township's own position on the record (Hughes: the program "does not impact the funds the school district... receive[s] from taxes") and the genuine counterargument that keeping exempt improvements out of the equalization tables protects state aid. Both sides stated; neither resolved by assertion.
4. **What the board should change** — the reform section, and the point of the whole page. Concrete, board-level, and none of it requires a promise the board cannot keep:
   - An annual enrollment-and-development report the board publishes itself: units approved, units occupied, bedroom mix, and enrollment by grade in the same document.
   - A standing seat at the table before a financial agreement is signed, so the board comments on school impact while terms are still open rather than after.
   - Refreshed demographic projections tied to actual occupancy dates, updated on a cycle rather than once a decade.
   - Capacity reported by building, not district-wide, since "not at capacity" as a district average can hide a full elementary school.
   - Every PILOT's term, escalator, and expiration published in one place a resident can read.
5. **What still has to be nailed down before this is public** — kept, but short and at the end, where a reader who wants it can find it: the statutory distribution read from the statute itself, the unit inventory, the multipliers by bedroom count, the minutes citation for the capacity remark, the 2022 forecasting study.

## Rules held from the PILOT explainer

No projected enrollment figures. No per-pupil cost multiplied into a scary total. No attributing a trend to a cause the record does not establish. No opponent framing — the township acted lawfully and says so publicly; the disagreement is about what gets measured and published.

## Technical notes

- `src/lib/drafts.ts`: rewrite the blocks of the `growth:apartments-enrollment` section into the five headings above. The `sources` array added last pass stays as is.
- `src/lib/sources.ts`: unchanged — the six verified sources are already in `SOURCES`.
- No route, navbar, sitemap, or public-page changes. `/pilot`, `/dashboard`, and `/priorities` are untouched.
