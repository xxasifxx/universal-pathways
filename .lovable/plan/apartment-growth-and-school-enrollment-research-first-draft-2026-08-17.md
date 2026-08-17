# Apartment growth and school enrollment — research first, draft in the review room

East Brunswick has added a lot of apartments through redevelopment, and apartments attract young families. The claim that matters is whether those units are putting students into schools faster than the revenue that follows them. That is an empirical question, and right now we do not have the numbers. So this goes into the review room as a draft, not onto the public site, and it is built the same way the PILOT explainer was: nothing asserted that a fetched public source does not carry.

## 1. New internal draft section in the review room

Add one `internal` section to the review-room material, keyed `growth:apartments-enrollment`, sitting alongside the debate-prep section at `/review`.

It holds:

- **The question** — one paragraph stating what the page would have to prove: how many units have been approved or built, how many school-age children they generate, what the district's enrollment has actually done, and what revenue arrives alongside those students.
- **What we already have** — only the facts already sourced on the site: the FY2027 general fund total, enrollment on roll (8,559 estimated for 10/15/2026 against 8,393 actual the prior year), the local levy share (76.4%), the per-pupil cost, and the PILOT split as township officials describe it. Each carries the source already listed in `src/lib/sources.ts`.
- **What is unverified** — the gaps, written as a list a reviewer can check off: unit counts by project, occupancy dates, student-generation rates for the specific unit mixes, whether enrollment growth to date tracks the new buildings or something else, and which of those buildings sit under a PILOT.
- **Rules for this page** — no projected enrollment, no per-student cost multiplied out into a scary number, no attribution of a trend to a cause the data does not establish, no opponent framing.
- **Sources to start from** — the EB Redevelopment Agency agenda archive, the planning board and township council minutes, the TAPinto PILOT coverage already cited, Eyes on EB, the district's FY2027 filing, NJDOE enrollment reporting, and the NJ Rutgers/Bloustein-type residential demographic multiplier literature for student-generation rates.

No public route, no navbar entry, no sitemap change. Nothing changes on `/pilot` or `/dashboard`.

## 2. The research prompt

Delivered in chat, not saved in the repo, ready to paste into an AI web researcher. It will ask for:

- Every multifamily/redevelopment project in East Brunswick since roughly 2015: name, location, unit count, bedroom mix, approval date, occupancy date, and whether it carries a PILOT or tax abatement — each row with a URL.
- District enrollment by year and by grade over the same period from NJDOE and district filings, so growth can be looked at against the buildings rather than asserted.
- Published student-generation rates for New Jersey multifamily housing by bedroom count, with the study and its date.
- What revenue actually follows a new apartment unit: the ordinary property tax split, what a PILOT changes, and how state aid responds to enrollment growth under the current funding formula.
- Any East Brunswick board or council discussion tying development to school capacity, with dates and quotes.
- An explicit "what could not be found" list.

The prompt will insist on: fetched URLs only, no reconstructed links, no estimates presented as findings, and a plain statement wherever the record is silent.

## 3. Then a review pass

Once the researcher comes back, the findings get checked, verified sources get added to `SOURCES`, and the draft in the review room gets written from what survives. Only after reviewers clear it does a public page get planned.

## Technical notes

- `src/lib/drafts.ts`: one new entry in `DRAFT_SECTIONS` (kind `internal`), with blocks and a `sources` array.
- No new routes, no changes to `src/routes/pilot.tsx`, `src/routes/dashboard.tsx`, the header, the footer, or the sitemap.
- The research prompt is chat output only.
