# Lead with the flyer's core pitch

The mailer copy is the strongest version of the message. The site should say the same thing, in the same order, so the flyer, the QR code landing, and the homepage all read as one campaign.

## The pitch (verbatim from the flyer)

Headline: **A Voice for Excellence**

Problem: "Across the country, schools are being squeezed by rising healthcare premiums, growing special education costs, and aging facilities. Too many boards respond by cutting programs, reducing staff, and adding new fees, leaving families to pay more out of pocket. East Brunswick deserves a different path."

Ask: "We need an advocate willing to take on corruption, put students first, and make our schools affordable for every family."

Saqeeb will fight for:
- Free full-day Pre-K
- Modern 9-12 high school
- Better healthcare for school staff

## Home page changes

1. Hero: headline becomes "A Voice for Excellence" with "Muhammad Saqeeb for East Brunswick Board of Education" above it and "Column #1" as a badge. Keeps the campaign graphic, Volunteer + Donate buttons, and social links as they are.
2. New pitch section directly under the hero: the two problem/ask paragraphs, the ask sentence set larger and bolder. This replaces the current one-line intro.
3. "Saqeeb will fight for" band on the dark green background: the three items as three columns with gold circular icons (family, school building, dollar coin), matching the flyer.
4. Existing "OUR platform" section stays as the deeper detail, now framed as what's behind those three.
5. Credential cards move below the platform section (supporting, not leading).

## Elsewhere

- Priorities page gains the same problem/ask framing at the top so the flyer's argument is present wherever people land.
- Meta title/description on the home page updated to the "A Voice for Excellence" pitch.
- The three fight-for items are added to `src/lib/campaign.ts` as a single exported list so the home page, priorities page, and any future mailer copy stay in sync.

## Technical notes

- `src/lib/campaign.ts`: add `PITCH` (headline, problem, ask) and `FIGHT_FOR` (three items with lucide icon names); keep `PLATFORM_HIGHLIGHTS` and `CREDENTIALS`.
- `src/routes/index.tsx`: restructure hero + new pitch and fight-for sections; reorder credentials.
- `src/routes/priorities.tsx`: add the pitch intro.
- `src/lib/i18n.tsx`: add strings for the new headings so the five-language switcher does not fall back to English mid-page.
- No backend, form, or donation-flow changes.
