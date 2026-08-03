# Hero: his original wording, Wilbur's format

## The fault

The hero bullets are copy I wrote. His own site already had the words — short priority labels with one plain line each. Wilbur's page proves the format: greeting, portrait, name and office, a bulleted list of short phrases, email. Nothing authored on top.

## What changes

**1. Hero content comes from his original site, verbatim**

Replace the invented `WHY_SAQEEB` bullets and the `home.hero.sub` bio paragraph with the five labels from his own site:

- Empowered Students
- Clear Dashboards
- Better Staff Benefits
- Safe & Inclusive Schools
- Students First

Each rendered as a plain bullet line, no checkmark icons, no card, no summary sentence. Just the list, the way Wilbur's page does it.

**2. Hero structure follows Wilbur's page**

```text
Hi! My name's Muhammad.
I'm running for the East Brunswick Board of Education.

        [portrait]

Muhammad Saqeeb for East Brunswick
Board of Education

   • Empowered Students •
   • Clear Dashboards •
   • Better Staff Benefits •
   • Safe & Inclusive Schools •
   • Students First •
        ask@saqeeb.org

     Ask me a question
```

Centered, one column, campaign yellow and burgundy tokens kept. No badge chip, no two-button row — the single "Ask me a question" action scrolls to the existing question box below.

**3. Remove the star from the navbar logo**

Delete the star-and-rules divider row between "Saqeeb" and "EB Board of Education" in the header lockup.

## Technical notes

- `src/lib/campaign.ts` — replace `WHY_SAQEEB` with the five original priority labels.
- `src/lib/i18n.tsx` — `home.hero.sub` becomes "I'm running for the East Brunswick Board of Education."; headline becomes "Hi! My name's Muhammad."
- `src/routes/index.tsx` — restructure hero to single centered column: greeting, portrait, name/office line, bullet list, email, one CTA. Drop the badge chip, the checkmark list, and the secondary Volunteer button.
- `src/components/site-header.tsx` — remove the `aria-hidden` star divider span (lines 53-60).
