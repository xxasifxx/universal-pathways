# Sitewide color change: yard-sign green

Move the whole site from burgundy + yellow to the deep green and warm cream of the yard sign. No yellow anywhere.

## New palette

- Sign Green `#0E351A` — primary: buttons, header, footer, headings, links
- Deep Green `#092414` — hover/pressed states, dark surfaces
- Warm Cream `#F5F0E6` — page background and text on green
- White — cards
- Muted green-grey borders and secondary surfaces derived from the green hue

## What changes

1. **Design tokens** (`src/styles.css`) — replace burgundy/gold OKLCH values with the green set. The `gold` token is repurposed to cream so nothing breaks, and every usage is then swapped to the correct semantic token. Chart ramp 1–6 becomes a green ramp (deep green to pale sage) instead of burgundy-to-yellow.
2. **Buttons and CTAs** — every `bg-gold` CTA on Home, Donate, Volunteer, and the nav Donate button becomes solid green with cream text; secondary buttons become outlined green.
3. **Header and footer** — logo mark, nav, and footer band recolored; the "EB" mark becomes cream on green.
4. **Forms** — ask-question, volunteer, and donate forms: focus rings, checkboxes, and submit buttons move to green.
5. **Favicon** — regenerate as cream "EB" on sign green to match the sign.
6. **Email templates** — the shared `brand.ts` colors plus all six templates (question, volunteer, contribution notifications and confirmations) switch to green/cream headers and buttons.

## Verification

Screenshot Home, Donate, and Volunteer at desktop and mobile widths, confirm no burgundy or yellow pixels remain, and check cream-on-green text still clears WCAG AA contrast.

## Not changing

Copy, layout, structure, forms behavior, and email logic stay exactly as they are — this is color only.
