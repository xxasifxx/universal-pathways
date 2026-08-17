# Tone pass on the explainer blocks

The healthcare block stood out because it argues with an imaginary opponent ("a candidate who promises... is promising something the board cannot deliver"). Nobody made that promise, so the paragraph reads like the site defending itself. But the register is the real problem, and it runs through all the long-form blocks: statute names, filing vocabulary, and clause-stacked sentences aimed at a reader who has already read the budget PDF. Rewrite them the way Saqeeb would say it out loud to a parent, keeping every specific fact and figure.

## What gets rewritten

**1. "How better healthcare for staff is possible" (Affordable for All)**
- Cut the strawman sentence entirely.
- Keep the substance in plain terms: the pension piece and what comes out of a teacher's paycheck are set in Trenton, not here. What East Brunswick decides is who we buy coverage from — the state program, an outside carrier, or a pool of districts — and we can bid the prescription-drug piece separately even if the medical side stays with the state.
- Keep the ask: those options get priced and discussed in public before the board votes, instead of a renewal sliding through on the agenda.
- Drop the Comptroller-report sentence and the Chapter 78/44 citation from the body; the point survives without the statute numbers.
- New heading in the same voice, e.g. "What the board can actually change about staff healthcare."

**2. "How building can lower a cost the district is already paying" (Reduce Our Costs)**
- Same treatment. Lead with the thing people get wrong: a new building isn't paid for out of the budget on the dashboard — voters approve bonds, the state chips in on the payments, and it shows up on the tax bill as debt service.
- Keep every figure: $209,216,947 general fund, capital outlay down 28.3%, capital reserve at $256,697, operations and maintenance at $21.1 million.
- Keep the honest ending, said plainly: we don't know how much a new building would take off the maintenance bill, that takes a facilities study, and we're not going to make a number up.

**3. "What it would cost" section intro and the eight cost-lens entries**
- Same conversational pass. "The filing does not say" phrasing becomes ordinary speech; "appropriation," "enterprise fund," "miscellaneous revenue" get a few words of plain explanation where they carry weight. Figures unchanged.
- The "Why there is no price tag on this page" note gets the same treatment.

**4. Priority bullet**
- "Better healthcare for school staff, through the choices the district actually makes." goes back to the flyer's "Better healthcare for school staff." The hedge belongs in the explainer, not the promise.

**5. Consistency check on the neighbours**
- Read the dashboard section paragraphs and the PILOT explainer for the same tics (filing-speak, self-defending asides) and fix any that clash with the new register. No figures change on either page.

## Rules for the rewrite

- Nothing invented, nothing dropped: every dollar amount, percentage, and factual claim survives.
- No slogans, no punchy fragments, no "not X, but Y" cadence — the failure mode of the last tone pass.
- Contractions and ordinary words. Statute names only where a reader would go look it up.
- No dollar estimate of any promise anywhere.

## Technical notes

- `src/lib/campaign.ts`: rewrite both `detail` blocks, the `PRIORITIES[0].points` healthcare bullet, and the `PROMISE_COST_LENS` strings plus `COST_STUDY_NOTE`.
- `src/routes/priorities.tsx`: the "What it would cost" intro paragraph is inline in the component.
- `src/components/budget-insights.tsx` and `src/routes/pilot.tsx`: prose-only edits if the consistency check turns up clashes.
