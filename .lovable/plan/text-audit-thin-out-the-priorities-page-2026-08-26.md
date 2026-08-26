# Text audit + thin out the priorities page

Two jobs: strip the remaining marketing voice from public copy, and cut the priorities page down to the promises themselves. The mechanisms, open questions, and source links move into the review room.

## Priorities page (public)

Today each promise opens into a panel with a lever tag ("Budget line", "State rule"), two or three paragraphs of mechanism, a "What nobody can answer yet" note, and source links. That is research, not a platform.

After the change the page is:

- Three sections: Affordable for All, Students First, Reduce Our Costs.
- Under each, the promises as a plain list. Same wording, nothing expandable, no tags, no sources, no open questions.
- A short "why I'm running" opening kept from his own account, trimmed to two paragraphs.
- One line at the bottom saying figures aren't published for most of this, plus the existing volunteer and donate buttons.

The sticky section nav stays, since three anchors on a long page still help.

## Review room

A new tab, "Priorities detail". It lists every promise with the full panel that used to be public: lever, mechanism paragraphs, open question, sources. Reviewers can leave notes on it like the other research pages.

## Copy audit

Sweep every public string for:

- Claims about the campaign's character: independent, grassroots, data-driven, community-run, transparent, accountable, no consultants.
- Mission-statement lines that say nothing checkable ("a voice for", "every family deserves", "putting students first" used as a slogan rather than a promise).
- Credential cards on the home page — "Excellence in Community Leadership and Transparency", "Innovative and Future-Oriented" — which are awards-style phrases with no content behind them. These get rewritten as facts or dropped.
- Adjective stacking and three-beat rhythm in headings and blurbs.

Files with public copy: `src/lib/i18n.tsx`, `src/lib/campaign.ts`, `src/routes/index.tsx`, `src/routes/priorities.tsx`, `src/routes/volunteer.tsx`, `src/routes/donate.index.tsx`, `src/routes/donate.thanks.tsx`, `src/components/site-footer.tsx`, `src/routes/__root.tsx`, plus every route's title and description.

The rule for rewrites: say who does what, or cut the sentence. No line survives just because it sounds good.

## Technical notes

- `src/lib/campaign.ts`: `PRIORITIES` keeps `id`, `number`, `title`, `summary`, and promise text. The `PromiseDetail` bodies move to `src/lib/review-content/priorities.server.ts`, keyed to the promise, so the detail text is not in the public bundle at all.
- `src/routes/priorities.tsx`: drops the `<details>` panels, `LEVER_TAG`, and the sources block.
- New `src/routes/review.priorities.tsx` plus a server function beside the existing budget/PILOT ones, gated by the same passcode check, with the shared notes component.
- Review nav and the research-pages grid in `src/routes/review.index.tsx` gain the new tab.
- Route metadata stays complete on every page; no data model, form, or styling changes beyond removing the panel markup.
