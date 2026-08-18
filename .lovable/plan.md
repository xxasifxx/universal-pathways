# Growth in East Brunswick: what the township record actually says

Going back to the township's own documents changed the argument. This is no longer a page about whether apartments are coming. The record shows the town negotiated the apartment count *down*, and that the growth still ahead of us is largely fixed by state law through 2035 — in the unit type that puts the most children in schools. The school board is the one body with no seat at that table and no capital left to absorb it.

That is the synthesis to write. It goes into the review room first, rewriting `growth:apartments-enrollment`.

## What the record shows

**The town cut the apartment count itself.** The mayor's March 28, 2024 press release on the Vermella-East Brunswick redevelopment plan revisions: the original 1,280 proposed apartments were reduced to 535, a cut of 745 units, with 218 for-sale townhouses, a hotel in place of a third parking garage, and several acres of dedicated public space. The project runs 44 acres from Ruth Street to Lake Avenue along Route 18 South, is reported at roughly $500 million, and the designated redeveloper is EB Development Urban Renewal, LLC, a Russo Development and River Development Equities venture.

**The bedroom mix is public, and it is small.** Phase 2, before the planning board in 2024: 240 apartments in a five-story building replacing retail — 8 studios, 101 one-bedroom, 24 one-bedroom-and-den, 70 two-bedroom, 7 two-bedroom-and-den, 15 three-bedroom, and 15 affordable units across those sizes. Eighteen three-bedroom units out of 240. Under the Rutgers CUPR multipliers, that mix is near the bottom of the student-generation range. This is the part of the growth that generates the fewest students.

**The part that will generate students is the part nobody voted for.** P.L. 2024, c.2 rewrote the Fair Housing Act. DCA's October 2024 report set East Brunswick's non-binding Fourth Round obligation at 170 present need and 314 prospective need; the council adopted Resolution 25-63 on January 6, 2025 accepting 170 and seeking a reduction to 265, and the Superior Court fixed the obligations in April 2025. The planning board adopted a Fourth Round Housing Element and Fair Share Plan on June 18, 2025, and in March 2026 the council passed Ordinance 26-07 creating a townhouse inclusionary TH-3 zoning district to comply. Townhouses with three bedrooms are the highest-yield residential type in the multiplier tables. The obligation runs to 2035, it is court-supervised, and no board of education vote touches it.

**The schools are meeting it with nothing in reserve.** Capital outlay is down 28.3% in two years, maintenance is down 3.9%, the capital reserve is projected at $256,697 against $3.1 million not long ago, and 76.4% of the $209 million budget is raised on the local levy. Meanwhile the board is choosing among an $11 million classroom move, a $45–49 million ninth-grade academy, and a $325–350 million high school, and any of those goes to voters as a referendum. Enrollment across nine years of filings has stayed between roughly 8,200 and 8,560 — which is the reason the district can still size a building correctly if it starts now, and the reason it will not be able to if it waits until the TH-3 units are occupied.

## The reforms this argues for

Existing platform commitments, now with the evidence behind them:

- **Size the high school against the housing plan, not last year's enrollment.** The Fair Share Plan names the districts and the unit types. That is a planning input, and it should be in the referendum case.
- **Audit the master plan, with public dashboards.** One document a year: units approved, units occupied, bedroom mix, enrollment by grade, alongside the Fourth Round compliance schedule.
- **A board voice on the record before a financial agreement is signed**, so school impact is discussed while terms are open.
- **Public full-day Pre-K**, since inclusionary family housing arrives with children below kindergarten age and the budget carries no preschool appropriation and no preschool aid.

## Tone rules held

The township is not the antagonist here: it negotiated 745 apartments away and is complying with a state mandate it did not write. No projected enrollment figures, no per-pupil cost multiplied into a total, no attributing a trend to a cause the record does not establish.

## Technical notes

- `src/lib/drafts.ts`: rewrite `growth:apartments-enrollment` into the sections above, with the checklist of remaining unknowns cut down to what is genuinely still open (occupancy dates, the statutory service-charge distribution, the 2022 forecasting study).
- `src/lib/sources.ts`: add the township and court records — the March 2024 mayor's press release, the Route 18 Corridor Redevelopment Plan (amended November 2023), Resolution 25-63, the April 2025 Superior Court order, Ordinance 26-07, and the MyCentralJersey Phase 2 coverage. Each verified by fetch before it is added.
- No route, navbar, or sitemap changes; nothing public until reviewers clear it.
