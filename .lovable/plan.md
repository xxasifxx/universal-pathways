# Hero: plain notes from a local resident

## What changes

**1. Hero bio becomes short, plain snippet notes**

Drop the paragraph under the headline. Replace with one plain lead-in line and a short list written the way a neighbor jots notes — lowercase-feeling, concrete, no slogan phrasing, no em-dash taglines.

Lead-in: `I'm running for the Board of Education. A few things I want to work on:`

Notes list (replacing the current `WHY_SAQEEB` items):
- Kids should have a say in decisions about their own schooling
- Keep counselors, special ed staff, and early learning funded
- Schools where every kid feels safe showing up
- Budget numbers people can actually read
- Honest math on the buildings before anyone votes on them

No campaign-speak, no "first," no capitalized program names. If you'd rather these be in his exact words, send me his notes verbatim and I'll use those instead of my wording.

**2. Remove the star from the navbar logo**

Delete the star-and-rules divider row between "Saqeeb" and "EB Board of Education" in the header lockup. Keeps the yellow block, name, and office line, just tighter.

## Technical notes

- `src/lib/i18n.tsx` — shorten `home.hero.sub` to the single lead-in line.
- `src/lib/campaign.ts` — rewrite `WHY_SAQEEB` entries as the five plain notes.
- `src/components/site-header.tsx` — remove the `aria-hidden` star divider span (lines 53-60).
