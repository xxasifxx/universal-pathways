# Newsletter + Campaign News

Add two connected things: a place to read campaign news, and a way for supporters to get it by email.

## 1. News section

- New `/news` index page listing articles newest-first (date, headline, one-line summary).
- New `/news/$slug` article page with full text, date, and share/donate/volunteer CTAs.
- Articles are stored as typed content in code (`src/lib/news.ts`) — no database needed, fast, easy to add to.
- First article: the August 10, 2026 press release, "Muhammad Saqeeb Draws No. 1 Ballot Position in East Brunswick Board of Education Race", published verbatim with a "FOR IMMEDIATE RELEASE" treatment.
- Home page gets a compact "Latest news" block above the question form linking to the release.
- Header and footer get a "News" link.
- Sitemap includes `/news` and every article URL.

## 2. Newsletter signup

- Reusable signup form (email required, name optional) on the home page, the news index, and the footer.
- Submissions save to a new `newsletter_subscribers` table (unique email, source page, timestamp, visitor link like the existing forms).
- On signup: a branded welcome email to the subscriber plus an internal notification to the campaign inbox — same pattern the question and volunteer forms already use.
- Duplicate emails are treated as success (no error shown, no duplicate email sent).
- Validation matches the existing forms: trimmed, length-capped, validated on the server.

## Technical notes

- Routes: `src/routes/news.index.tsx`, `src/routes/news.$slug.tsx`; content and slugs in `src/lib/news.ts`.
- Each route gets its own `head()` with unique title/description/og tags; articles emit `NewsArticle` JSON-LD.
- Server function `subscribeNewsletter` in `src/lib/submissions.functions.ts`, using `supabaseAdmin` + `attachIdentity`, mirroring `submitContact`.
- Migration creates `public.newsletter_subscribers` with GRANTs (`service_role` full; no anon read), RLS enabled, no public policies — writes happen server-side only.
- Two new email templates registered in `src/lib/email-templates/registry.ts`: `newsletter-confirmation` (subscriber) and `newsletter-notification` (campaign inbox), styled with existing brand tokens.
- No new dependencies.

## Not included

Blasting the list with a mass newsletter is not part of this — the built-in email system is for one-to-one app emails. This builds the list and publishes articles; mass sends would need a dedicated marketing tool later.