# Hero: "Hi, I'm Saqeeb. Nice to meet you!"

## What the hero says

Headline stays personal and plain:

```text
Hi, I'm Saqeeb.
Nice to meet you!
```

Under it, short snippets about him — not sentences I wrote, but the descriptors from his own original site, kept as fragments:

- Raised in East Brunswick, working-class immigrant family
- East Brunswick Public Schools graduate
- Community organizer
- Data scientist
- Brings students, parents, and educators into the decisions

No story paragraph, no slogans, no "here's why I'm running" framing.

## Layout (Wilbur's format)

```text
        [portrait]

     Hi, I'm Saqeeb.
     Nice to meet you!

  · Raised in East Brunswick, working-class immigrant family
  · East Brunswick Public Schools graduate
  · Community organizer
  · Data scientist
  · Brings students, parents, and educators into the decisions

        ask@saqeeb.org

     [ Ask me a question ]
```

Single centered column, portrait first, plain bullet dots instead of checkmark icons, one button that scrolls to the existing question box. The badge chip and the secondary Volunteer button come out of the hero. Campaign yellow and burgundy tokens unchanged.

Everything below the hero — the question box and the quiet link row — stays exactly as it is.

## Navbar

Remove the star-and-rules divider and text below it from the logo lockup, so it reads Muhammad / Saqeeb with no ornament.

## Technical notes

- `src/lib/campaign.ts` — replace `WHY_SAQEEB` contents with the five snippet fragments above.
- `src/lib/i18n.tsx` — drop the bio paragraph in `home.hero.sub`; headline strings become "Hi, I'm Saqeeb." / "Nice to meet you!".
- `src/routes/index.tsx` — restructure the hero section to one centered column: portrait, headline, snippet list (no `Check` icon), email line, single `#ask` CTA. Remove the badge `<p>` and the `/volunteer` button.
- `src/components/site-header.tsx` — delete the `aria-hidden` star divider span (lines 53-60).