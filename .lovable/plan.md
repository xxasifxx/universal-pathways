# Make the reading score reflect real reading

I walked the site the way a visitor would: about ten seconds on the home page, then the platform page, opening promise panels one at a time. The score works, but it rewards the wrong thing.

What the walk showed (values read from the live session record):

```text
home, ~10s               active 8s   expands 0   pages 1   -> no nudge
platform, panel 1 open   active 12s  expands 1   pages 2   -> no nudge
platform, panel 2 open   active 14s  expands 2   pages 2   -> no nudge
platform, panel 3 open   active 18s  expands 3   pages 2   -> no nudge
platform, panel 4 open   active 20s  expands 4   pages 2   -> nudge appears
```

The timing is fine — someone twenty seconds in who has opened panels is interested, and that is exactly who we want to catch. The problem is what earns the credit: opening four panels counts for as much as forty seconds of reading, and scroll credit restarts on every page, so someone who reads three pages halfway gets less credit than someone who jumps to the bottom of one.

## What changes

Keep the bar where it is — reachable in well under a minute — and make it measure time spent below the top of the page, added up across the whole visit, so a few browsing patterns all get there rather than just the one.

- Track "engaged time": the clock runs while the tab is visible and the page is scrolled past the first screen. Time parked on a hero counts for little; time down in the content counts.
- Carry engaged time, scroll credit, and panel opens across page changes, so following links keeps adding up instead of restarting.
- Total scroll credit across pages rather than per page — reading half of three pages should beat skimming the bottom of one.
- Keep panel opens worth something but cap them lower, so opening everything is one route to the nudge and not the fastest one.
- Keep the 20-second minimum and the roughly-30-second practical arrival. A referred visitor who reads a bit of one page should still see it.

Then make the offer worth showing. The pill currently says "Want to help? Two hours is enough." — that asks for labour first. Lead with the free yard sign, then the volunteer ask: something like "Want a free yard sign? We'll drop one off — and there's a spot on the team if you want it." Opening it lands on the same signup form with the yard-sign option already checked.

Expected result from the same walk: the nudge still lands around the 20-30 second mark, but a visitor who quietly reads two pages without clicking anything now gets there too.

## Technical notes

- `src/hooks/use-reading-intent.ts` — add an `engagedMs` accumulator (ticks only when `visibilityState === "visible"` and `window.scrollY > innerHeight * 0.4`), persist `engagedMs` plus a per-path scroll map in the `lv_reading_state` session record, rebalance weights (engaged time ~2 pts/sec capped at 55, summed scroll depth capped at 30, expands 6 pts each capped at 18, extra pages 12 each capped at 24). `THRESHOLD` stays 70, `MIN_SESSION_MS` stays 20s.
- `src/components/volunteer-prompt.tsx` — new copy leading with the yard sign; open the modal with the yard-sign option preselected (`openVolunteer({ source: "prompt", defaultHelp: ["yard-sign"] })`, already supported by the modal's preset prop).
- The `reading_intent_reached` signal keeps its shape; `meta` gains `engaged_ms` so the admin intent view can be checked against real visits.
- Re-run the same scripted walk afterwards and report the observed timings.
- Separately: the district dashboard logs a hydration mismatch (`$15M` vs `$15.0M`) from the compact currency formatter rendering differently on server and client. Fix by formatting that figure deterministically instead of through `Intl` compact notation.