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

Twenty seconds and four clicks is not a reader. Opening four panels counts for as much as forty seconds of reading, and scroll credit restarts on every page, so someone who reads three pages halfway gets less credit than someone who jumps to the bottom of one.

## What changes

Score the thing that actually signals interest: time spent below the top of the page, added up across the whole visit.

- Track "engaged time" separately from raw active time — the clock only runs while the page is scrolled past the first screen and the tab is visible. That becomes the main input.
- Carry engaged time, scroll credit, and panel opens across page changes in the existing session record, so following links keeps adding up instead of starting over.
- Give scroll credit per page and total it across the visit (reading half of three pages should beat skimming the bottom of one), with a cap so no single page dominates.
- Cut what a panel click is worth and cap it lower. Opening panels should nudge the score, never carry it.
- Raise the floor: a nudge needs roughly a minute of engaged time across the visit, or somewhat less when spread over more than one page. Minimum session length goes from 20 seconds to 45.

Expected result from the same walk: nothing at 20 seconds; the nudge lands once the visitor has spent around a minute below the fold, whether that came from one long page or three shorter ones.

## Technical notes

- `src/hooks/use-reading-intent.ts` — add an `engagedMs` accumulator (ticks only when `visibilityState === "visible"` and `window.scrollY > innerHeight * 0.4`), persist `engagedMs` plus a per-path scroll map in the `lv_reading_state` session record, rebalance weights (engaged time up to ~60 pts, summed scroll depth up to ~25, expands 6 pts each capped at 18, extra pages 10 each capped at 20), `THRESHOLD` 90, `MIN_SESSION_MS` 45s.
- The `reading_intent_reached` signal keeps its shape; `meta` gains `engaged_ms` so the admin intent view can be checked against real visits.
- Re-run the same scripted walk afterwards and report the observed timings.
- Separately: the district dashboard logs a hydration mismatch (`$15M` vs `$15.0M`) from the compact currency formatter rendering differently on server and client. Fix by formatting that figure deterministically instead of through `Intl` compact notation.