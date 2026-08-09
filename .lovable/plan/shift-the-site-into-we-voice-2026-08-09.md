# Shift the site into "we" voice

The site still talks about the campaign in third person — "Saqeeb's platform", "his promises", "he answers". The candidate wants it to read as a shared, community campaign: our platform, our promises, our schools. His personal bio and the "ask him a question" flow stay personal, because those really are about him.

## What changes

**Platform language (everywhere it appears)**
- "Saqeeb's platform" / "Saqeeb's platform for East Brunswick schools" becomes "Our platform" / "Our platform for East Brunswick schools".
- Home link "See all of Saqeeb's promises" becomes "See all of our promises".
- Platform page heading and intro rewritten in we-voice, same three sections and same promises — no policy wording changes.

**Page descriptions and social previews**
- Platform page: "Muhammad Saqeeb's platform: …" becomes "Our platform for East Brunswick schools: …".
- Home page: "Muhammad Saqeeb's campaign platform: …" becomes our-voice equivalent.
- Titles keep his name so search still matches the candidate.

**Campaign-wide copy**
- Donate pages: "Support Muhammad Saqeeb's campaign" becomes "Support our grassroots campaign for the East Brunswick Board of Education"; thank-you page shifts "the campaign" to "our campaign".
- Volunteer page: "help the campaign" becomes "help our campaign".
- Footer/root tagline: "An independent campaign…" becomes "An independent, community-run campaign… No party line, no consultants."
- Budget/dashboard intro: "the district budget" framing gains "our schools" where it reads naturally; the budget note keeps its plain-language tone but drops the stray "I'd like it to." first-person aside in favor of "We'd like it to."

**Stays personal on purpose**
- Hero snippets and portrait bio (who he is).
- "Ask Muhammad a question" section and confirmation copy ("He answers these himself") — the question goes to one person.
- Structured data / author metadata naming Muhammad Saqeeb.

## Technical notes

Files touched: `src/lib/i18n.tsx` (priorities.eyebrow, priorities.title, footer tagline, budget note), `src/routes/priorities.tsx` (TITLE, DESCRIPTION, h1, intro), `src/routes/index.tsx` (DESCRIPTION, promises link text), `src/routes/donate.index.tsx`, `src/routes/donate.thanks.tsx`, `src/routes/volunteer.tsx`, `src/routes/dashboard.tsx`, and `src/lib/campaign.ts` comments/intro line where third-person platform framing appears.

Copy only — no data model, routing, form, or styling changes. Each affected route keeps its full title/description/OG/Twitter metadata. Afterwards, a repo-wide search confirms no remaining "Saqeeb's platform" or "his promises" phrasing in public UI.
