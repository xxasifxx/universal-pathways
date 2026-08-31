# New portrait and the candidate's own statement

## Photo

Keep the full frame — no cropping. Edit the uploaded image to remove the file-viewer chrome: the dark bar with the filename and Share/close buttons at the top, and the two round arrow buttons at the left and right edges. The removed areas are filled in to match the surrounding studio backdrop so the portrait reads as a clean photo at its original framing. The result is uploaded as a CDN asset and used as the home page hero portrait in place of the current campaign graphic; the old hero asset pointer is deleted once nothing references it.

## The statement

The supplied text is used verbatim — no edits, no reordering, no added headings — and it goes on the priorities page only.

- Priorities page header: eyebrow and heading become "Why I'm running", and every paragraph of the statement runs there in order, replacing the current two-paragraph excerpt and the "I went through these schools..." headline.
- The home page is left alone apart from the hero photo. Its About section, bullet row, and links stay as they are.

The earlier special-education narrative currently feeding the priorities header is removed.

## Technical notes

- `src/lib/campaign.ts`: add `CANDIDATE_STATEMENT: string[]` with the paragraphs verbatim; remove `CANDIDATE_STORY.long` usage from the priorities page. Keep `ABOUT_SAQEEB` and `WHY_SAQEEB` since the home page still uses them.
- `src/routes/priorities.tsx`: header renders the full statement.
- `src/routes/index.tsx`: only the hero image import changes.
- New `src/assets/saqeeb-portrait-2026.jpg.asset.json`; delete `saqeeb-campaign-hero.jpg.asset.json`.
