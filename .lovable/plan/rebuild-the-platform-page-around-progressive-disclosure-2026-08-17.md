# Rebuild the platform page around progressive disclosure

## The problem

The page currently reads as three layers stacked in the wrong order:

1. Three priorities, each a summary plus a bullet list.
2. A long explainer block hanging off priority 01 and another off priority 03, at full weight, in the middle of the list.
3. A separate "What it would cost" section at the bottom holding seven cards that each belong to a specific promise several screens above.

So a reader who wants the healthcare detail gets it forced on them, and a reader who wants to know what "end lunch debt" touches has to scroll past everything and then re-match the card to the bullet from memory. Nothing is progressive: it's all expanded, and the associations are broken by distance.

## What progressive disclosure looks like here

One object per promise, two depths, and nothing else.

```text
Priority 01  Affordable for All
  short summary (always visible)
  - Universally paid public full-day Pre-K            [what this touches v]
  - Zero fees on clubs & activities                   [what this touches v]
  - Better healthcare for staff                       [what this touches v]
  ...
      expanded:  how it actually works, in a few sentences, with the
                 budget line and the figure the filing prints, each
                 fact linked to the document it came from, ending
                 with what nobody can answer yet
```

- **Depth 1 — the promise.** The bullet, as now. Every bullet stays visible; nothing important hides.
- **Depth 2 — what it touches.** One panel per bullet, closed by default, opening in place. It carries the mechanism, the budget line and figure, and the open question. Bullets with nothing behind them stay plain, so a disclosure arrow always means something is there.

There is no third layer. The healthcare and construction explainers only became separate blocks because the healthcare one was written as a defense of the promise instead of an explanation of it, and it grew until it needed its own room; the construction one was then built to match. Strip the defensive framing and each is three or four sentences of mechanism — which is exactly what depth 2 holds. So they get absorbed: the healthcare material into the "better healthcare for staff" bullet, the financing material into the new high school and state-construction-bonds bullets. The standalone explainer blocks disappear entirely.

Section order becomes: hero → three priorities with inline disclosure → "Why there is no price tag" note with the donate and dashboard actions → sources.

## Sourcing

You are right that the sourcing is uneven. Every factual sentence inside a panel gets an inline link on the sentence itself, rather than a list of links parked at the bottom of a block. The rule stays: only URLs fetched and read in the session get cited, and any sentence that cannot carry one gets cut rather than softened.

Currently verified and usable: P.L. 2020 c.44 (plan menu, salary-percentage contributions), the SHBP/SEHBP employer administration manual (join or leave by resolution, medical vs. prescription vs. dental elected separately), the Comptroller's September 9 2025 report (conflicts, the $36M figure), the NJDOE notice on State-paid TPAF contributions, and the NJDOE ROD page (at least 40 percent of eligible costs). Everything else either traces to the FY2027 filing already cited on the dashboard, or comes out.

If you want firmer ground before the rewrite — East Brunswick's own board minutes on the benefits renewal, the district's long-range facilities plan — say so and I will fetch those first and build the panels around them instead.

&nbsp;

user responds: please do so.

## Technical notes

- `src/lib/campaign.ts`: each priority's `points` becomes objects (`text`, optional `budgetLine`, `filingSays`, `filingDoesNotSay`, `mechanism`, `links`). `PROMISE_COST_LENS` folds into those bullets and is deleted; the `detail` field on `Priority` is deleted and its prose redistributed, shortened, into the bullets it belongs to.
- `src/routes/priorities.tsx`: bullets become `<details>`/`<summary>` (native, keyboard-accessible, works without JS, prints expanded) styled to match the page. The standalone cost-lens grid and the inline detail blocks both come out.
- Check the other importers of `PRIORITIES` (home page highlights) against the new bullet shape.
- Keep `COST_STUDY_NOTE`, the ActBlue button, and the dashboard link; they move up to sit directly under the priorities.
- No new dependencies, no data changes, no dollar estimates added.