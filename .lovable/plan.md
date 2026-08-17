# Rebuild the platform page around progressive disclosure

## The problem

The page currently reads as three layers stacked in the wrong order:

1. Three priorities, each a summary plus a bullet list.
2. A long explainer block hanging off priority 01 and another off priority 03, at full weight, in the middle of the list.
3. A separate "What it would cost" section at the bottom holding seven cards that each belong to a specific promise several screens above.

So a reader who wants the healthcare detail gets it forced on them, and a reader who wants to know what "end lunch debt" touches has to scroll past everything and then re-match the card to the bullet from memory. Nothing is progressive: it's all expanded, and the associations are broken by distance.

## What progressive disclosure looks like here

One object per promise, three depths, reader chooses the depth.

```text
Priority 01  Affordable for All
  short summary (always visible)
  - Universally paid public full-day Pre-K            [what this touches v]
  - Zero fees on clubs & activities                   [what this touches v]
  - Better healthcare for staff                       [what this touches v]
  ...
      expanded:  budget line + the figure the filing prints
                 what the filing cannot answer
                 [read the full explanation ->]  (only where one exists)
```

- **Depth 1 — the promise.** The bullet, as now. Every bullet stays visible; nothing important hides.
- **Depth 2 — what it touches.** The cost-lens content moves out of the bottom section and becomes a collapsible panel on the bullet it belongs to. Closed by default, opens in place. Bullets with no lens entry stay plain bullets and get no affordance, so a disclosure arrow always means there is something behind it.
- **Depth 3 — the argument.** The two long explainers (staff healthcare, how construction is financed) stop sitting inline. They become their own anchored sections after all three priorities, reached from a link inside the relevant depth-2 panel. The reader gets there by asking for it.

Section order becomes: hero → three priorities with inline disclosure → "Why there is no price tag" note and the donate/dashboard actions → the two long explainers → sources.

## Sourcing

You are right that the sourcing is uneven. Every factual sentence in the two explainers gets an inline link to the specific document, at the sentence, rather than a list of four links parked at the bottom of the block. The rule stays: only URLs fetched and read in the session get cited, and any sentence that cannot carry one gets cut rather than softened.

Currently verified and usable: P.L. 2020 c.44 (plan menu, salary-percentage contributions), the SHBP/SEHBP employer administration manual (join/leave by resolution, medical vs. prescription vs. dental elected separately), the Comptroller's September 9 2025 report (conflicts, the $36M figure), the NJDOE notice on State-paid TPAF contributions, and the NJDOE ROD page (at least 40 percent of eligible costs). Everything else in those blocks either traces to the FY2027 filing already cited on the dashboard, or comes out.

If you want more verified ground before the rewrite — East Brunswick's own board minutes on the benefits renewal, the district's long-range facilities plan — say so and I will fetch those first and build the depth-3 sections around them instead.

## Technical notes

- `src/lib/campaign.ts`: give each `PromiseCostLens` entry a `priorityId` and a `promiseIndex` (or match on the bullet text) so the lens attaches to a bullet instead of living in a flat list. Promote the two `detail` blocks to standalone exported explainers with an `id` and a `sourceLinks` array, keyed back from the lens entries.
- `src/routes/priorities.tsx`: bullets become `<details>`/`<summary>` (native, keyboard-accessible, works without JS, prints expanded) styled to match the page. Drop the standalone `PROMISE_COST_LENS` grid. Render the explainers as anchored sections below the priorities, with `scroll-mt-24` so deep links land correctly.
- Keep `COST_STUDY_NOTE`, the ActBlue button, and the dashboard link; they move up to sit directly under the priorities.
- No new dependencies, no data changes, no dollar estimates added.
