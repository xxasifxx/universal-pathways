# Cut the consultant voice, fix the year labels

Two problems, both fair.

## 1. The "independent, no party" line goes

The site says it in two places, and neither earns its keep. School board races in New Jersey are nonpartisan by law, so announcing independence is either filler or a defensive claim nobody asked about.

- Footer tagline (`src/lib/i18n.tsx`): "An independent, community-run campaign for the East Brunswick Board of Education." becomes a plain statement of what the campaign is — run by neighbors in East Brunswick — with no independence claim.
- Root meta description (`src/routes/__root.tsx`): "An independent, data-driven campaign…" becomes a description of the candidate and the office. "Data-driven" also goes; it is a pitch deck word.

## 2. The rest of the consultant voice

A pass over the public pages — home, priorities, volunteer, donate, thanks — removing:

- Self-describing adjectives: independent, data-driven, grassroots, community-run, transparent. State what happens, not what it should be called.
- Mission-statement sentences that assert virtue instead of saying something. Where a line only exists to sound good, it is deleted, not rewritten.
- Hero line "Fighting to put students first." — a slogan sitting under a slogan. Replaced with one concrete sentence about what he is running to do, or cut so the headline and the three fights carry the page.
- The pitch paragraph on the home page keeps its facts and loses the throat-clearing wind-up.

Nothing about the three fights (public full-day Pre-K, modern 9-12 high school, better healthcare for staff) changes.

## 3. The 2024 numbers

Every 2023-24 and 2024-25 figure on the budget pages does come out of the FY2027 User Friendly Budget — those are the filing's own prior-year actual and audited columns. But the pages present them without saying so, so a reader sees "source: new budget" over a 2024 number and reasonably concludes the data is stale. That is a labeling failure, and in one place a baseline choice failure.

Fixes on the review budget pages (`src/components/budget-insights.tsx`, `src/lib/review-content/budget.server.ts`):

- Every comparison states which two columns of the FY2027 filing it is comparing, in the heading area rather than buried in body copy. "2024-25 actual → 2026-27 proposed, both from the FY2027 filing."
- The reserves table header row gets a caption line saying all four columns come from that same filing's recapitulation of balances; the audited columns are labeled as audited actuals, not as budget figures.
- The per-pupil section currently baselines against 2023-24 actual while the movement section baselines against 2024-25. Both move to the most recent prior column the filing publishes, so the page uses one baseline throughout. If the filing only publishes 2023-24 actual for per-pupil, the page says that explicitly instead of leaving the year unexplained.
- Any narrative sentence that quotes a year figure ("up from 30.16% in 2023-24", "$19,096 in 2023-24 actual costs") gets the column named in the same sentence.
- Before editing, the FY2027 filing figures already in `budget.server.ts` are re-checked against the source line so no number is carried over that the filing does not contain.

## Technical notes

Files touched: `src/lib/i18n.tsx`, `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/routes/priorities.tsx`, `src/routes/volunteer.tsx`, `src/routes/donate.index.tsx`, `src/routes/donate.thanks.tsx`, `src/lib/campaign.ts` (pitch and highlight copy), `src/components/budget-insights.tsx`, `src/lib/review-content/budget.server.ts`.

Copy and labeling only — no data model, routing, or component structure changes. Route titles/descriptions keep their full metadata; the text inside them gets the same pass. Afterwards a repo-wide search confirms no remaining "independent", "data-driven", or "grassroots" in public copy, and no year figure on the budget pages without its column named.
