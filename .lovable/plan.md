# Ask Saqeeb, a PILOT explainer, a district dashboard, and a home-page aesthetic pass

The reference site (vs24corruption.com) is ugly but works because of *structure*: a single clear claim up top, then a sticky in-page nav, then receipts — side-by-side comparisons, plain-language tables, numbered allegations, and a "here's what to do about it" block. We take that information architecture and put it in the campaign's green/gold design system.

## 1. "Ask Saqeeb a question"

Rename every "Ask Muhammad" label to "Ask Saqeeb" (home section heading, thank-you page card and button). No logic changes.

## 2. Home page aesthetic pass

The page reads as a stack of similar full-width bands. Tighten without changing content:

- Deliberate background alternation (cream / green / cream / green) so the "fight for" band and the donate band don't blur together.
- One shared section pattern: same eyebrow + heading treatment, max width, and vertical spacing scale everywhere.
- Platform highlights: drop the 6xl titles to a sane heading size and lay them out as a 3-card grid instead of a long stacked list with rules.
- Credentials: 2-column card grid, gold accent rule instead of the heavy 8px left border, remove the stray bullet dot.
- Donation amounts: compact 3-across pill row instead of a tall 2-column list.
- Hero: keep two columns, add a subtle gold rule behind the portrait, tighten mobile heading sizes.
- Ask section: give the form card more presence (gold top accent) since it's the main engagement point.

Tailwind + existing tokens only, no new colors.

## 3. `/pilot` — "What PILOT deals mean for our schools"

Built in the reference site's receipts style:

- **Top claim block**: one sentence on what's at stake, plus the key number ($1.2M sitting in municipal reserve while the school budget is squeezed).
- **Plain-English explainer**: what a PILOT agreement is, in four short steps — developer builds, township negotiates an annual payment instead of normal property taxes, the township keeps the bulk of it, the school district only shares in the small land-value portion.
- **Side-by-side "What the township says / What residents see"** — the exact structural move from the reference site, two columns, checkmarks vs. X's:
  - Township: schools get their approved budget; PILOT money has funded school capital work (Warnsdorfer improvements cited).
  - Residents: capital dollars can't pay teachers, aides, or programs; new apartments bring more students without matching operating revenue; the money sits in reserve.
- **What Saqeeb will do**: the board gets a seat at the table before agreements are signed; every PILOT agreement is published with a projected dollar impact on district operating revenue; push for terms that fund operations, not just capital.
- **Sources** listed at the bottom with links (TAPinto East Brunswick PILOT coverage, township council/redevelopment agency minutes, Eyes on EB).

Every factual claim links to a source; nothing asserted beyond what the reporting supports. You get one review pass on the "What Saqeeb will do" language before it goes public.

## 4. `/dashboard` — district numbers in plain English

A public, non-technical dashboard page in the same explainer style. Uses the budget data already in the codebase (`BUDGET_SLICES`, `$229M` total, district stats):

- Where the $229M goes — the six budget lines, each with the official jargon, a plain-English translation, the dollar amount, and a one-line "what this actually means" note.
- A share-of-budget bar so people can see instantly that teachers + support staff are most of it and "cut the fat" isn't a real plan.
- District context strip: 8,100 students, 11 schools, 90+ languages.
- A short "what a dashboard should show but doesn't yet" section — the transparency ask that ties back to the PILOT page.

## 5. Why Saqeeb — sharpened, not attack-style

We do **not** copy the reference site's opponent-attack format. Instead the same clarity gets pointed at qualifications: a compact credentials block on the home page and the about page stating, in short plain claims, what Saqeeb brings (EB graduate, working-class immigrant family, data scientist, community organizer, attends board meetings) — with the platform promises as the receipts.

## 6. Wiring

Both new pages linked from the header nav and footer, cross-linked to each other and to `/priorities`, and added to the sitemap. Each gets its own head() with a unique title, description, and OG tags.

## Content calendar

Internal-only, not published. The PILOT page and dashboard fit the affordability / reduce-costs track in that schedule.

## Technical notes

Files touched: `src/routes/index.tsx`, `src/routes/donate.thanks.tsx`, `src/routes/priorities.tsx`, `src/components/site-header.tsx`, `src/components/site-footer.tsx`, `src/routes/sitemap[.]xml.ts`; new `src/routes/pilot.tsx` and a public district dashboard route; PILOT + dashboard content added to `src/lib/campaign.ts`. Note there is an existing authenticated `src/routes/dashboard.tsx` — the public page will use a distinct path so it doesn't collide.
