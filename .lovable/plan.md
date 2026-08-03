# Hero: stop authoring words for him

## The actual fault

The hero doesn't have a tone problem, it has a source problem. The four bullets under the headline (`WHY_SAQEEB`) and the bio paragraph (`home.hero.sub`) are text written for him, not by him. Any rewrite of that text is still invented. The five priorities in `PRIORITIES` are the only campaign copy that came from the candidate.

## What changes

**1. Delete the invented hero copy**

- Remove the `WHY_SAQEEB` array and its checkmark list from the hero.
- Remove the `home.hero.sub` bio paragraph.

**2. Hero shows his real priorities, verbatim**

Under "Hi, I'm Muhammad Saqeeb. Nice to meet you!", one plain line:

`I'm running for the East Brunswick Board of Education because of these priorities.`

Then the five priority titles exactly as they already exist in `PRIORITIES` — titles only, no summaries, no icons, no links per item:

1. Students First
2. Mental Health, Special Education & Early Learning
3. Safe, Inclusive & Welcoming Schools
4. Transparent, Responsible & Community-Focused Leadership
5. Strong Facilities & Long-Term Investment

Nothing on the home page is authored copy anymore — it's his headline, his priorities, then the question box.

**3. Remove the star from the navbar logo**

Delete the star-and-rules divider row between "Saqeeb" and "EB Board of Education" in the header lockup.

## Technical notes

- `src/lib/campaign.ts` — delete `WHY_SAQEEB`.
- `src/lib/i18n.tsx` — replace `home.hero.sub` with the single lead-in line.
- `src/routes/index.tsx` — hero renders `PRIORITIES.map(p => p.title)`; drop the `WHY_SAQEEB` import and list.
- `src/components/site-header.tsx` — remove the `aria-hidden` star divider span (lines 53-60).
