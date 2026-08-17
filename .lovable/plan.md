# Passcode-gated review room (no accounts)

Replace the reviewer-login idea with a single shared passcode. You get the passcode, you share it with people you trust, they open one link, type it once, and can read the drafts and leave notes under whatever name they type.

## What changes

### 1. Review room moves out from behind the admin login
- New route `/review` (noindex), server-gated by passcode. It holds exactly what `/admin/drafts` holds today: every long policy panel, the debate prep questions, status chips, and threaded notes.
- `/review/unlock` — one password box. On success the browser keeps an encrypted, HTTP-only session cookie for 30 days, so reviewers don't retype it every visit. A "Lock" button clears it.
- Wrong passcode gives a generic "that's not it" — no hints, no lockout of the URL itself.

### 2. Reviewers assert their own identity
- On first note, the reviewer types a display name ("Dana, EB teacher"). It's remembered on their device and shown on every note they leave.
- Notes and status changes are written through the server, never straight from the browser, so nobody with the passcode can touch anything else in the database.
- Draft content itself is returned only after the passcode check, so it never ships in the page bundle to a locked visitor.

### 3. Admin gets locked down properly
- `/admin/*` goes back to admin-only. The `reviewer` allowance in the admin shell and the "Review room" tab are removed; the admin shell no longer has a half-privileged mode.
- Admins get one extra thing on the review page: the ability to delete a note and see who is participating. Nobody with only the passcode can delete.

### 4. Volunteer flow points at it
- The "Researcher" volunteer option's confirmation text stops promising an account and instead says you'll send them a link and passcode once you've read their background.

## Passcode handling
- Two secrets are stored server-side: the review passcode and a session-signing key. Neither ever reaches the browser.
- I'll generate the passcode and print it in chat for you, and you can hand me a different one any time to swap it. Changing it instantly locks out everyone holding the old one.

## Trade-off worth saying plainly
A shared passcode is a gate, not authentication: everyone uses the same secret, and you can't revoke one person without rotating for all. That's the right call for a handful of trusted readers; if the group grows past that, real accounts make sense.

## Technical notes
- `src/lib/review-gate.functions.ts`: `unlockReview`, `lockReview`, `getReviewContent` (gate + drafts), `postReviewComment`, `setReviewStatus`, all using `useSession` from `@tanstack/react-start/server` and a timing-safe hash comparison; writes go through the admin client after the gate passes.
- Migration on `draft_comments`: make `author_id` nullable and add `reviewer_name text`; add a `source` column (`reviewer` vs `admin`) so it's clear where a note came from. No new anon RLS grants — the table stays admin/reviewer-role only and the server writes with service role after gating.
- `src/routes/review.tsx` + `src/routes/review/unlock.tsx`; `/admin/drafts` redirects to `/review`.
- `admin-shell.tsx`: drop the `allow="reviewer"` prop path; `use-admin-session.ts` keeps `isReviewer` only if still used elsewhere, otherwise it's removed.
