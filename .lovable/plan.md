# Hero: snippet notes, not storytelling

## What changes

**1. Hero bio becomes short snippet lines**

Drop the paragraph under the headline. Replace with one tight lead-in line plus the existing checkmark list, rewritten as clipped note-style fragments (no full sentences, no narrative).

Lead-in: `I'm running for the East Brunswick Board of Education because of these priorities:`

Snippet list (replacing the current `WHY_SAQEEB` reasons):
- Students first — real voice in decisions
- Mental health, special education, early learning
- Safe, inclusive, welcoming schools
- Transparent budgets and Board decisions
- Facilities built for the long term

These mirror the five platform priorities, so the hero states why he's running rather than telling a story.

**2. Remove the star from the navbar logo**

Delete the star-and-rules divider row between "Saqeeb" and "EB Board of Education" in the header lockup. Keeps the yellow block, name, and office line, just tighter.

## Technical notes

- `src/lib/i18n.tsx` — shorten `home.hero.sub` to the single lead-in line.
- `src/lib/campaign.ts` — rewrite `WHY_SAQEEB` entries as the five priority snippets.
- `src/components/site-header.tsx` — remove the `aria-hidden` star divider span (lines 53-60).
