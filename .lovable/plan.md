## Goal

Bring the live site in line with the campaign brand kit in the uploaded sheet: **Burgundy #5A0B00**, **Gold #F28705**, **White**, with the "MUHAMMAD SAQEEB / EB BOARD OF EDUCATION" lockup and its typography.

## What changes

**1. Palette swap in `src/styles.css` (the single source of truth)**

All colors are already semantic tokens, so the recolor happens in one place and every page follows.

| Token | Now | New |
| --- | --- | --- |
| `--primary` | terracotta | burgundy #5A0B00 |
| `--accent` / highlight | warm tan | gold #F28705 |
| `--ink` (footer, dark panels) | deep chocolate | burgundy #5A0B00 |
| `--background` | warm cream | soft cream-white matching the sheet's off-white field |
| `--card` | near-white | white |
| chart-1…6 | terracotta ramp | burgundy → gold ramp so the budget dashboard, calculator and scenario lab reread on-brand |

Gold becomes the call-to-action / emphasis color (Donate button, deadline highlight, active states), burgundy the structural color (header lockup, footer, headings, section rules) — same relationship the yard signs and flyer use.

**2. Header lockup**

Rework the "MS" square into the brand lockup: burgundy-on-gold wordmark with the star divider and "EB BOARD OF EDUCATION" subline, sized down for the nav bar. Mobile keeps the compact mark.

**3. Kill the hardcoded color**

`src/components/site-footer.tsx` hardcodes `oklch(0.75 0.13 45)` in nine places for hover/highlight. Those get replaced with the gold accent token so the footer themes properly.

**4. Typography to match the brand kit**

The sheet specifies **Bebas Neue** (headlines + sublines, all caps) and **Lato** (body), replacing the current Montserrat/Inter. Loaded via a `<link>` in the root route, wired through `--font-display` / `--font-sans`. Headline sizing gets adjusted since Bebas is a condensed all-caps face and runs narrower than Montserrat.

**5. Contrast pass**

Burgundy on gold and gold on burgundy both need checking against WCAG 2.1 AA, which the site currently meets. Gold #F28705 fails as small text on white, so it stays a background/large-text accent and body links stay burgundy. I'll verify each page at desktop and mobile widths with screenshots after the swap.

## Out of scope

No content, layout, or functionality changes — this is purely visual reskinning. The uploaded brand sheet is used as reference only, not embedded on the site.

## Technical notes

Touches `src/styles.css` (tokens), `src/routes/__root.tsx` (font link), `src/components/site-header.tsx`, `src/components/site-footer.tsx`, and small class adjustments wherever headline sizing needs to account for the condensed display face. Chart palettes read from the CSS tokens already, so Recharts follows automatically.
