# Real FY2026-27 budget numbers and real sources

Every figure below was read out of the adopted FY2027 User Friendly Budget PDF you attached (generated May 12, 2026). Nothing is estimated or predicted.

## 1. Replace the $229M snapshot with the adopted FY2026-27 figures

The current dashboard uses a $229,000,000 total and six invented category amounts. Replace them with the General Fund Grand Total of **$209,216,947** and nine categories that add up to it exactly, each built by summing named lines from the Advertised Appropriations pages:

| Category | 2026-27 Proposed |
|---|---|
| Classroom instruction (regular, special ed, basic skills, bilingual, cocurricular, athletics, alternative ed) | $73,035,382 |
| Employee benefits | $40,357,120 |
| Student support services (health, guidance, child study teams, speech/OT/PT, extraordinary services, attendance and social work, instructional improvement, library, staff training) | $23,152,279 |
| Operations and maintenance of plant | $21,131,868 |
| Student transportation | $16,278,808 |
| Administration (general, school, central services, administrative IT) | $12,738,760 |
| Out-of-district tuition | $6,612,503 |
| Transfer of funds to charter schools | $7,462,691 |
| Capital outlay (equipment, facilities acquisition and construction) | $8,447,536 |

The first six plus tuition sum to $193,306,720, which is the PDF's own "Total General Current Expense" line — a built-in check that the grouping is right.

Other real figures from the same document to use where the site currently guesses:
- Enrollment on roll, 10/15/2026 estimate: 8,559 (7,193 regular, 1,365 special education, 1 shared-time)
- Total budgetary comparative per pupil cost, 2026-27 proposed: $20,731
- Total tax levy, general fund, 2026-27: $159,811,059
- Total school levy including debt: $159,983,631; estimated total school tax rate 8.2709 per $100 of net taxable valuation
- Employee benefits as a share of salaries, 2026-27: 38.43%
- All-funds total (general + grants + debt service): $218,172,894

Every place currently saying "$229 million" / "$229M" gets updated: dashboard headline and meta description, the budget section heading and chart center label, the PILOT page closing section, and the district stat block (students 8,100 -> 8,559, budget -> $209M).

## 2. One disclaimer instead of two

The dashboard currently stacks a generic disclaimer and a separate source line. Both go, replaced by a single paragraph that says plainly what was done: the categories were assembled by adding up individual appropriation lines from the district's adopted 2026-27 User Friendly Budget, the groupings are this site's, not the district's, and the state-filed PDF is the authority if the two disagree. It will name the document and link to the district page it is posted on.

## 3. Real sources

Replace the placeholder links with the pages you gave, plus the state page the PDF itself cites:

- East Brunswick Public Schools, FY2027 User Friendly Budget: https://www.ebnet.org/departments/financial-services/budget-information/fy2027-user-friendly-budget (the 64-page adopted PDF, the source of every number above)
- TAPinto East Brunswick, "Break Down of PILOT Agreements: Explaining How Redevelopment is Financed": https://www.tapinto.net/towns/east-brunswick/sections/business-and-finance/articles/break-down-of-pilot-agreements-explaining-how-redevelopment-is-financed
- East Brunswick Township Redevelopment Agency, full agenda and minutes archive: https://www.eastbrunswick.org/AgendaCenter/Redevelopment-Agency-2 — cited as the complete directory, since no single meeting has been identified yet
- NJDOE Taxpayers' Guide to Education Spending: http://www.nj.gov/education/guide/ (the source the PDF names for the per-pupil comparison figures)

The assumptions list in the sources file drops the entries that supported the removed calculator-style estimates (grade weights, service add-ons, sliders) and keeps only what the current site actually relies on, restated against real values: enrollment 8,559 and the local tax levy share, which is now computable from the PDF rather than assumed.

## Technical notes

- `src/lib/campaign.ts`: new `BUDGET_TOTAL`, rewritten `BUDGET_SLICES` (nine entries, plain/jargon labels and notes rewritten to describe the actual line items), updated `DISTRICT_STATS`.
- `src/lib/sources.ts`: real `SOURCES` with working hrefs, trimmed `ASSUMPTIONS`, `BUDGET_YEAR` -> "2026–2027", `SOURCE_LINE` replaced by the single combined disclaimer.
- `src/components/budget-dashboard.tsx`: render one disclaimer block instead of two; chart center total reads from `BUDGET_TOTAL` rather than the hardcoded "$229M".
- `src/lib/i18n.tsx`: update `budget.title` and remove the now-unused `budget.disclaimer` key across all five locales.
- `src/routes/dashboard.tsx` and `src/routes/pilot.tsx`: copy and meta updates; PILOT source list replaced with the real URLs.

## Not doing without your say-so

I have not opened the TAPinto article or the Redevelopment Agency archive to verify the $1.2 million PILOT reserve claim currently on the site — that figure came from a Facebook comment. Say the word and I will fetch both and either source it properly or pull it.
