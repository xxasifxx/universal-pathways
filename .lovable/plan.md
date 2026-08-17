# Tone pass on the explainer blocks

The healthcare block stood out because it argues with an imaginary opponent ("a candidate who promises... is promising something the board cannot deliver"). Nobody made that promise, so the paragraph reads like the site defending itself. But the register is the real problem, and it runs through all the long-form blocks: statute names, filing vocabulary, and clause-stacked sentences aimed at a reader who has already read the budget PDF. Rewrite them the way Saqeeb would say it out loud to a parent, keeping every specific fact and figure.

## What gets rewritten

**1. "How better healthcare for staff is possible" (Affordable for All)**
- Cut the strawman sentence entirely.
- Keep the substance in plain terms: the pension piece and what comes out of a teacher's paycheck are set in Trenton, not here. What East Brunswick decides is who we buy coverage from — the state program, an outside carrier, or a pool of districts — and we can bid the prescription-drug piece separately even if the medical side stays with the state.
- Keep the ask: those options get priced and discussed in public before the board votes, instead of a renewal sliding through on the agenda.
- Keep the sourced facts and state them outright instead of only describing what they prevent: the State pays the employer pension contribution to the Teachers' Pension and Annuity Fund; the employee premium share follows the salary-tiered schedule in Chapter 78 as carried forward by Chapter 44; districts may join the state School Employees' Health Benefits Program, buy outside it, or join a school-board joint insurance fund; prescription and dental coverage can be bid separately from medical; brokers and third-party administrators are procured under the Public School Contracts Law; the State Comptroller reported on school health insurance funds in September 2025. Statute names stay, in plain sentences, each tied to a link a reader can open.
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
- Contractions and ordinary words, but the facts lead. Where a source establishes something, state the fact first and its consequence second, rather than only narrating the constraint.
- Every factual claim traces to a verifiable public page. Nothing is predicted, inferred, or rounded into existence; if a source can't be produced for a sentence, the sentence goes.
- No dollar estimate of any promise anywhere.

## Sourcing: research happens first, and no URL is ever typed from memory

No link goes on the site unless this session actually fetched it and read the claim in the returned text. The order is fixed:

1. **Fetch, then write.** Search and fetch the pages first, and keep a working note of every URL that was actually retrieved along with the sentence it supports. A URL that was not fetched in this session does not exist for the purposes of this rewrite — not from memory, not "the obvious nj.gov path", not reconstructed from a search snippet without opening the page.
2. **The note drives the copy.** Each claim in the rewritten blocks is written from the fetched text and carries the URL that was fetched. If a claim ends up with no fetched page behind it, the claim is cut. The block gets shorter; nothing gets softened into a vague version to survive.
3. **Expected topics, not promised links.** The things worth checking are the employer pension contribution to TPAF, the Chapter 78 / Chapter 44 employee premium schedule, SEHBP participation and the alternatives (outside carrier, school-board joint insurance fund), separate bidding of prescription and dental, procurement of brokers and administrators, the Comptroller's 2025 report on school health insurance funds, and how New Jersey school construction is financed through voter-approved bonds with state debt service aid. Some of these may not turn up a citable public page. That outcome is acceptable and gets reported plainly — the corresponding sentence is dropped rather than backed by a guessed link.
4. **Report before editing.** Before any file is touched, list what was found and what was not, with the retrieved URLs, so the drop list is visible rather than silently applied.

Verified sources get added to `SOURCES` in `src/lib/sources.ts`, each entry holding the URL as fetched. Budget figures keep citing the FY2027 filing already listed there.

## Technical notes

- `src/lib/campaign.ts`: rewrite both `detail` blocks, the `PRIORITIES[0].points` healthcare bullet, and the `PROMISE_COST_LENS` strings plus `COST_STUDY_NOTE`.
- `src/routes/priorities.tsx`: the "What it would cost" intro paragraph is inline in the component; the detail blocks gain a short line of source links under the paragraphs.
- `src/lib/sources.ts`: add the verified healthcare and construction-financing sources.
- `src/components/budget-insights.tsx` and `src/routes/pilot.tsx`: prose-only edits if the consistency check turns up clashes.
