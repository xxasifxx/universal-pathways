# Ask Saqeeb, a PILOT explainer, and a home-page aesthetic pass

## 1. "Ask Saqeeb a question"

Rename every "Ask Muhammad" label to "Ask Saqeeb" (home page section heading, the thank-you page card and its button). Form placeholder stays first-person. No logic changes.

## 2. Home page aesthetic pass

The page currently reads as a stack of similar full-width bands. Tighten it without changing content:

- Alternate section backgrounds deliberately: cream -> green -> cream -> green, and reduce the number of consecutive dark bands so the "fight for" band and the donate band don't blur together.
- Consistent section rhythm: one shared eyebrow + heading pattern, same max width, same vertical spacing scale for every section.
- Platform highlights: shrink the oversized 6xl titles to a heading size that sits in the layout, put the three items in a card grid instead of a long stacked list with divider rules.
- Credentials: 2-column card grid on desktop, gold accent rule instead of the heavy 8px left border, drop the stray bullet dot.
- Donation grid: amounts as a compact 3-across pill row rather than a tall 2-column list.
- Hero: keep the two-column layout, add a subtle gold rule/texture behind the portrait so it doesn't float, tighten mobile heading sizes.
- Ask section: give the form card more presence (gold top accent, slightly wider) since it is the main engagement point.

Only Tailwind classes and existing semantic tokens (primary, gold, ink, secondary) — no new colors.

## 3. PILOT programs explainer

Add a short, sourced section people can point to when PILOT comes up.

What the research shows:
- PILOT (payment in lieu of taxes) agreements let redevelopers pay the township a negotiated annual payment instead of conventional property taxes.
- Under NJ law the school district does not share in that payment the way it shares in a normal tax levy; it keeps only the land-value portion. Township officials argue the district still gets its approved budget through the levy, and that PILOT money can fund school-related capital work (Warnsdorfer improvements are cited as an example).
- Residents' objection: capital dollars can't pay for staffing, programs, or recurring operating costs, and new residential development brings more students without proportional operating revenue.
- Sources: TAPinto East Brunswick's PILOT breakdown, Eyes on EB's coverage of the Town Council PILOT discussion, township Redevelopment Agency minutes.

Deliverable: a new `/pilot` page ("What PILOT agreements mean for our schools") with a plain-English explainer, a "what supporters say / what critics say" contrast, and Saqeeb's position — the board should have a seat at the table, publish what each agreement costs the district in projected operating revenue, and push for agreements that fund school operating needs, not just capital projects. Linked from the priorities page and the "Reduce Our Costs" highlight. Every factual claim links to its source; nothing is asserted beyond what the reporting supports.

Before writing, you'll get one review pass on the position language so it's exactly what Saqeeb wants to say publicly.

## 4. Content calendar

Noted as internal-only, not published to the site. It informs the order of future content (Pre-K explainer, students-first, modern schools, inclusion, board role, affordability). The PILOT page fits the affordability/reduce-costs track.

## Technical notes

Files: `src/routes/index.tsx`, `src/routes/donate.thanks.tsx`, `src/routes/priorities.tsx`, new `src/routes/pilot.tsx`, PILOT content added to `src/lib/campaign.ts`, sitemap route updated. New route gets its own head() with unique title/description/OG tags.
