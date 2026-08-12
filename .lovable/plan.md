# Question form email — what the delivery records show

## Finding

The question email was not dropped by the site. Your test question from Asif Muhammad was saved at 17:35:24 UTC today, and one second later two emails were accepted and sent:

- the alert to saqeebforeb@gmail.com
- the confirmation to the asker (ooasifoo@gmail.com)

The volunteer test 22 seconds later produced the same pair. All four are recorded as sent, with no bounce, no rejection, and no suppression on any address.

So the send path works for both forms. The question alert was handed to Gmail and then didn't show up where you looked — that's an inbox-side placement issue (Spam, Promotions, a filter, or the message collapsed into an existing thread), not a code failure.

## What to check first (no code change)

1. Search the Gmail account for `from:notify.saqeeb.org` including Spam and All Mail — the 17:35:25 message will be there.
2. If it's in Spam, mark "Not spam" and add a filter: from `notify.saqeeb.org` → never send to Spam, apply a "Campaign" label.

If that search turns up nothing at all, tell me and I'll dig further with the message ID.

## Changes worth making anyway

These reduce the chance of a question alert being missed again:

- **Distinct, scannable subject.** Question alerts become `[Question] <name> — Saqeeb for EB` so they never thread with volunteer alerts or older replies, and are easy to filter on.
- **Fail loudly, not silently.** Right now an email error is only written to the server console. Record the send outcome (sent / suppressed / failed) on the saved submission so the admin area can show which submissions were emailed and which weren't.
- **Admin visibility.** Add an "Emailed" column/badge to the submissions view in the admin area, so a missed alert is visible in the app itself rather than depending on the inbox.
- **Optional second recipient.** If you want alerts to also reach ask@saqeeb.org as a backup copy, I'll add it as a second notification address.

## Technical notes

- `src/lib/email-templates/question-notification.tsx`: change the `subject` function to the prefixed format.
- Migration: add `notified_at timestamptz` and `notify_status text` to `contact_messages` and `volunteer_signups` (nullable, no RLS/policy change — both tables are written server-side with the admin client).
- `src/lib/submissions.functions.ts`: after `notifyQuestion` / `notifyVolunteer` resolve or throw, write the outcome back to the row; keep the existing behavior where a mail failure never loses the submission.
- Admin submissions list: render the new status.

## Not included

Nothing about DNS or domain setup changes — `notify.saqeeb.org` is verified and delivering. Publishing is needed for the subject change to apply to the live site.