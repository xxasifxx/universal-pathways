# Muhammad Saqeeb for East Brunswick BOE

A five-page interactive campaign site. The through-line: every page proves the platform rather than describing it — the budget dashboard demonstrates transparency, the timeline demonstrates lived insight, the pathways visualizer demonstrates the policy argument.

## Design system

- **Terracotta** `#b84d28` — primary actions, active states, heavy headers
- **Deep chocolate** `#3a2016` — footer, high-contrast text, UI accents
- **Warm cream** `#f5f0e6` — base background (no stark white anywhere)
- Headings: Montserrat (bold, assertive). Body: Inter.
- Mobile-first: charts, flowcharts, and the map all stack/scroll cleanly at 390px.
- All colors as semantic tokens in `src/styles.css`; WCAG 2.1 AA contrast, ARIA labels on every interactive element, keyboard operability on the timeline, map, and toggles.

## Global chrome

- Sticky header: name/wordmark left; Home, About, Priorities, Volunteer, Contact right; persistent terracotta **Donate** button linking to your ActBlue URL (placeholder constant until you provide it).
- Language dropdown (EN / ES / HI / UR / ZH) wired to a real i18n context with a string-catalog structure. English copy ships complete; the other locales fall back to English until copy is written, so adding them later is a data edit, not a rebuild.
- Footer: chocolate background, voter registration reminder ("Register by October 13th"), contact links.

## Pages

**Home (`/`)** — Hero with your uploaded campaign photo, headline "Data-Driven Transparency. Grassroots Equity." and the subheadline. Then the **Follow the Money** dashboard: a Recharts breakdown of the mock $229M budget with a "Translate to Plain English" toggle that swaps every category label from bureaucratic jargon to plain language ("Instructional Support Services" → "Counselors, Nurses, & Classroom Aides") with an animated transition. Below: 4-card priorities grid.

**About (`/about`)** — "From Personal Friction to Systemic Insight" plus the **Student Journey** timeline: 4 nodes (The Behavioral Label → The Administrative Gate → The Insight → The Bridge), vertical and tap-to-expand on mobile, horizontal with scroll-driven reveal on desktop. Copy uses the PRD text verbatim, framed as systemic failure — never as an attack on teachers.

**Priorities (`/priorities`)** — "Solutions for a Student-First District" with the **Personalized Pathways** visualizer: two side-by-side flows the user triggers from one button. Flow A animates red through the current trap (Special Ed silo → ostracized → blocked from AP → stagnant growth); Flow B animates green through the solution (targeted counseling → retains agency → self-selects advanced track → high growth). Stacks vertically on mobile. Below: accordion breakdowns of the four platform planks.

**Volunteer (`/volunteer`)** — "Powered by Neighbors" with the **EB Neighborhood Action Map**: a hand-built SVG of East Brunswick divided into school zones (Churchill, Hammarskjold, Warnsdorfer, Frost, Irwin, Bowne-Munro). Clicking a zone reveals a contextual signup ("Join the Churchill Canvass Team") with Name, Email, Zip, Mobile, and help-type checkboxes. A plain zone-selector dropdown is the accessible/mobile equivalent path.

**Contact (`/contact`)** — "The Solutions Inbox" with the directive copy, and a form: Name, Email, role radio (Parent / Student / Teacher / Resident), Message.

## Backend

Enable Lovable Cloud and create two tables — `volunteer_signups` and `contact_messages` — with row-level security that lets anyone submit but only you read. Submissions go through server functions with Zod validation (length limits, email format, trimming) on both the client and the server. You'll be able to view submissions in the backend dashboard.

## Technical notes

- TanStack Start with file-based routes; each page gets its own `head()` with unique title/description/OG tags.
- Recharts for the budget chart; SVG + CSS/Motion for the timeline, flowchart, and map (no heavy map library needed).
- Hero photo goes through the CDN asset pipeline rather than into the repo.
- Structured data (JSON-LD Person/Organization) on the home page.

## Deferred

- ActBlue URL swapped in once you send it (single constant).
- CRM webhook (Action Network / Mailchimp) — data is captured in Cloud now; forwarding is a small add later.
- GA4 / Meta Pixel — needs your measurement IDs.
- Translated copy for ES/HI/UR/ZH.
