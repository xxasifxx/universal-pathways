# Growth without choking: one synthesis, written as an argument

The last pass filed the research as a checklist of verified and missing items. That is a work log, not a piece of writing. This rewrite turns the same material into a single continuous argument, written from where the campaign actually stands: East Brunswick is growing on purpose, that growth is worth having, and the schools are the part of the arrangement nobody has built a planning process around.

It stays in the review room, keyed `growth:apartments-enrollment`. A public page gets planned once reviewers clear it.

## The through-line

The town converted tired corridor property into housing under redevelopment and long-term tax exemption law, and it did that deliberately and lawfully. New residents are how a community stays alive. The problem is not that they are coming.

The problem is that the schools carry 76.4% of a $209 million budget on the local levy, the district plans against enrollment counts published once a year, and the financial agreements that shape the next twenty years of the tax base are negotiated on a track the board does not sit on. Housing decisions are made in one building with a twenty-year horizon; school capacity is managed in another with a one-year horizon. That gap is the subject.

## Structure of the rewritten section

1. **What the town built, and why** — redevelopment on the corridor, the projects the record names, the revenue case the township makes for them, in its own words. Written as a description of a strategy, not a complaint about one.
2. **What the schools know, and when they know it** — nine years of on-roll counts from district filings, the two incompatible NJDOE and budget-filing series, the once-a-year snapshot, the 2022 forecasting study nobody has updated publicly. The point: the district's picture of its own future arrives late, in pieces, and after occupancy rather than before approval.
3. **What actually determines the school-age children in a building** — bedroom mix over unit count, the Rutgers CUPR multiplier work and its declining rates, and the fact that East Brunswick's mix is unpublished. Establishes that this is knowable in advance and simply is not being calculated here.
4. **How the money arrives, and on what schedule** — the annual service charge under the Long Term Tax Exemption Law against the ordinary levy split, the township's stated position that the program does not affect school funding, and the real countervailing point that exempt improvements stay out of the equalization tables, which protects state aid. Both positions stated as they are held.
5. **What the board should change** — the point of the page:
   - An annual enrollment-and-development report the board publishes itself: units approved, units occupied, bedroom mix, enrollment by grade, one document.
   - Board comment on school impact entered into the record before a financial agreement is signed, while terms are still open.
   - Demographic projections refreshed on a cycle and tied to actual occupancy dates.
   - Capacity reported building by building, since a district-wide average hides a full elementary school.
   - Every agreement's term, escalator, and expiration published somewhere a resident can read in one sitting.
6. **What still has to be nailed down** — short, at the end: the statutory distribution read from the statute, the unit inventory, multipliers by bedroom count, a minutes citation for the capacity remark, the 2022 study.

## Rules held from the PILOT explainer

No projected enrollment figures. No per-pupil cost multiplied into a total. No attributing a trend to a cause the record does not establish. No arguing against a position nobody holds — the township's case for redevelopment is stated as the township states it, and the disagreement is about what gets measured, published, and asked before signing.

## Technical notes

- `src/lib/drafts.ts`: rewrite the blocks of the `growth:apartments-enrollment` section into the six headings above. The `sources` array added last pass stays as is.
- `src/lib/sources.ts`: unchanged — the six verified sources are already in `SOURCES`.
- No route, navbar, sitemap, or public-page changes. `/pilot`, `/dashboard`, and `/priorities` are untouched.
