# New portrait and the candidate's own statement

## Photo

Use the uploaded headshot, cropped to remove the dark file-viewer bar at the top and the two round arrow buttons at the sides. Crop to a clean portrait (roughly the image area below the bar, trimmed at left and right past the arrows), upload it as a CDN asset, and use it as the home page hero portrait in place of the current campaign graphic. The old hero asset pointer is removed once nothing references it.

## The statement

The text supplied is used verbatim, no edits, no reordering, no added headings. It becomes the single source for both "About" and "Why I'm running".

- Home page "About Saqeeb" section: shows the opening paragraphs (through "All I know is East Brunswick.") followed by a link, "Read why I'm running", to the priorities page. The short bullet row under it (raised in East Brunswick, EBPS graduate, data scientist, etc.) is removed, since the statement now says this in his own words.
- Priorities page header: heading becomes "Why I'm running" and the full statement runs there, every paragraph, in order.

The current invented bio lines and the earlier special-education narrative are deleted, not kept alongside.

## Technical notes

- `src/lib/campaign.ts`: replace `CANDIDATE_STORY` and `ABOUT_SAQEEB` with one exported `CANDIDATE_STATEMENT: string[]` holding the paragraphs verbatim; delete `WHY_SAQEEB`.
- `src/routes/index.tsx`: About section renders the first three paragraphs plus the link; drop the `WHY_SAQEEB` list; swap the hero image import to the new asset.
- `src/routes/priorities.tsx`: header renders the whole statement; heading and eyebrow updated.
- New `src/assets/saqeeb-portrait-2026.jpg.asset.json`; delete `saqeeb-campaign-hero.jpg.asset.json`.
- Check other references to the removed exports before building.
