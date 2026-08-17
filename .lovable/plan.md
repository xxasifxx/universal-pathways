# Cut the healthcare self-rebuttal

The detail block under "Affordable for All" reads like the campaign arguing with an accusation nobody made. The first paragraph literally says "a candidate who promises to lower what a teacher pays out of their check by a board vote is promising something the board cannot deliver" — a hypothetical straw candidate, in Saqeeb's own platform. That goes.

## What changes

1. **Bullet** returns to the flyer wording: "Better healthcare for school staff." Drop the trailing "through the choices the district actually makes" hedge.
2. **Remove the three-paragraph "How better healthcare for staff is possible" detail block** entirely. No pension-law caveats, no Chapter 78/44 explainer, no Comptroller citation on a platform page.
3. **Replace it with nothing, or one short forward statement** — the plan's default is one sentence in Saqeeb's voice inside the existing bullet list, e.g. that he will put every health plan option, its cost, and its coverage in front of the board and the public before a renewal vote instead of letting it pass on the consent agenda. Stated as what he will do, not as a defense of whether he can.
4. **Home page** "Affordable for All" highlight: keep the healthcare mention but drop the "that staff can afford to use" qualifier if it reads as hedging; plain "better healthcare for staff."
5. **Dashboard benefits note** stays factual about where the money goes; no cross-reference to the promise, no "board cannot" framing either way.
6. **Cost-lens entry** for the healthcare promise stays — that section is about the budget line, not about defending the promise.

## Technical notes

- `src/lib/campaign.ts`: edit `PRIORITIES[0].points`, delete `PRIORITIES[0].detail`, adjust the `affordable-for-all` highlight text and the `benefits` note.
- `src/routes/priorities.tsx`: the optional `detail` renderer stays (priority 03 still uses it); no component change needed.
