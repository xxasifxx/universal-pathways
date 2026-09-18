# Replace the priorities with the six new ones

The priorities page (`/priorities`) currently lists three priorities (Affordable for All, Students First, Reduce Our Costs) as bullet-point promises. Replace all of them with six new priorities, written as short paragraphs, using the candidate's text verbatim.

The home page stays as it is — no changes to the "Our platform" section or the "Saqeeb will fight for" band.

## The six new priorities (verbatim)

1. **Free, Universal Full-Day Pre-K** — 2 paragraphs (sister homeschooled because the district only offered half-day; NJ already provides a path through district classrooms, qualified providers, Head Start, and State funding).
2. **Move the 9–12 High School Capital Project Forward** — 2 paragraphs (built in 1957, temporary fixes since before 2016 graduation; move the capital project forward, scrutinize change orders, design for decades ahead).
3. **No Fees for Student Clubs & Activities** — 2 paragraphs (clubs, athletics, music, trips are where students belong, not extras; hundreds of dollars in participation costs before equipment, clothing, trips).
4. **Better Healthcare for Students & Staff** — 2 paragraphs (struggling students affect attendance and learning; partner with healthcare and mental-health providers, services on school property, review insurance/pharmacy/prescription contracts).
5. **Expand Special Education in East Brunswick** — 2 paragraphs (kindness learned alongside students with very different needs; phases — use existing space, add specialists and programs, design future facilities with in-district special-ed space).
6. **Responsible AI + Technology** — 2 paragraphs (reading, writing, creativity, research, critical thinking before generative AI; understand existing technology and privacy before a district-wide policy, phone ban won't stop AI use).

## Changes

- `src/lib/campaign.ts`:
  - Change the `Priority` type from `{ summary, points }` to `{ paragraphs: string[] }`.
  - Replace `PRIORITIES` with the six entries above, `number` 01–06, ids like `full-day-pre-k`, `high-school-capital-project`, `no-activity-fees`, `healthcare-students-staff`, `expand-special-education`, `responsible-ai`.
  - Text is verbatim from the candidate — no rewording. Keep the en dash in "9–12".
- `src/routes/priorities.tsx`:
  - Render each priority's two paragraphs in place of the bullet list (readable paragraph spacing, same gold left-column layout with the number and title).
  - The sticky hash-link nav stays and now shows the six new titles.
  - Keep the "Why I'm running" statement header as is.
  - Update the page's meta description to reflect the new priorities.
- No changes to the home page, the review room, or any other page. The Review Room keeps its own private research data, untouched.
