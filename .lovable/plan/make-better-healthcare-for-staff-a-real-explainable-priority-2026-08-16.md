# Make "better healthcare for staff" a real, explainable priority

Right now the flyer promise ("Better healthcare for school staff") appears on the home page with no explanation, while the budget dashboard says the benefits line is "set by contract and by the state pension system, so a board cannot reduce this line on its own." Read together that sounds like a promise the board cannot keep. The fix is to say plainly which parts a board actually controls, and put the promise where it belongs in the platform.

## What changes for a visitor

1. **Priorities page, under "Affordable for All"** gains a healthcare promise plus a short explanation of how it gets done — the only place on the site where the mechanics are spelled out. Draft framing:
   - What the board does not control: the state pension contribution and the statutory employee contribution schedule.
   - What the board does control and negotiates: which health plan the district offers (state School Employees' Health Benefits Program vs. a private or self-insured plan), the plan designs put on the table in bargaining, whether the district buys through a school insurance pool, prescription-drug purchasing and the pharmacy-benefit contract, and preventive/wellness offerings.
   - The commitment: use those levers so staff pay less out of pocket for care with fewer coverage gaps, and publish what each plan option costs the district before the board votes on it, rather than treating renewal as a formality.
2. **Home page** "Saqeeb will fight for" band keeps the three flyer items unchanged; the "Affordable for All" highlight text picks up healthcare so the promise has a visible thread from the flyer to the platform page.
3. **Budget dashboard** benefits note is reworded from "a board cannot reduce this line on its own" to a split statement: the pension and statutory contribution shares are fixed by the state, plan design and purchasing are negotiated and are where a board has room. Same figures, no contradiction.
4. **PILOT page** — no factual change; only a check that nothing there implies benefits are entirely outside board authority.

## Accuracy step first

Before writing the copy, confirm against New Jersey sources what a local board of education actually controls on health benefits (SEHBP participation and withdrawal rules, Chapter 44 plan-offering requirements, employee contribution tiers, school insurance pools/JIFs). Anything that cannot be sourced does not go on the page. No dollar savings figure will be claimed, since none can be verified from the FY2027 filing.

## Technical notes

- `src/lib/campaign.ts`: add the healthcare promise to `PRIORITIES[0].points`, adjust the `affordable-for-all` entry in `PLATFORM_HIGHLIGHTS`, and reword the `benefits` note in the budget slices.
- `src/routes/priorities.tsx`: render an optional short "how" paragraph for a priority so the healthcare mechanics can sit inside the Affordable for All section without turning the bullet list into an essay.
- `src/lib/i18n.tsx`: add matching strings if the new copy goes through the translation layer.
- No backend, form, chart data, or theme changes.
