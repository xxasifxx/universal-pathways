# Send all form alerts to ask@saqeeb.org

## What the records show

Both of today's tests were accepted and sent — the question test at 17:35:25 and the volunteer test at 17:35:47, each producing an alert plus a confirmation to the submitter. Neither went to ask@saqeeb.org; both alerts went to the Gmail address, because notifications were switched to Gmail on Aug 9. No bounce, rejection, or suppression is recorded for any of them.

You want alerts back on ask@saqeeb.org, so that's the change. The plan also makes a missed alert visible inside the app instead of depending on an inbox.

## Changes

1. **Alerts go to ask@saqeeb.org.** Question and volunteer notifications are delivered to the campaign address. Confirmations to the submitter stay as they are, with replies pointing at ask@saqeeb.org.

2. **Distinct subject lines.** Question alerts become `[Question] <name>` and volunteer alerts `[Volunteer] <name>`, so they can't collapse into one another's threads and are easy to filter or search.

3. **Record the send outcome.** Today a mail failure is only written to a server log, so a submission can look fine while no alert went out. Each saved submission gets the delivery outcome written back to it — sent, suppressed, or failed with the reason.

4. **Show it in the admin area.** The submissions view gets an "Alert" status badge, so you can tell at a glance whether each question or signup was emailed out.

## One thing to confirm on your side

ask@saqeeb.org has to be a real, monitored mailbox at your mail provider — the site can send to it, but it can't create it. If it's an alias that forwards nowhere, alerts will vanish again. Once this ships, submit one test question and confirm it lands there.

## Technical notes

- `src/lib/question-email.server.ts`: change `NOTIFICATION_EMAIL` to `ask@saqeeb.org`.
- `src/lib/email-templates/question-notification.tsx` and `volunteer-notification.tsx`: update the fixed `to` in template metadata and the `subject` functions to the prefixed format.
- Migration: add nullable `notified_at timestamptz` and `notify_status text` to `contact_messages` and `volunteer_signups`. No RLS or grant changes — both tables are written server-side with the admin client.
- `src/lib/submissions.functions.ts`: after `notifyQuestion` / `notifyVolunteer` resolves or throws, write the outcome back to the inserted row. A mail failure must still never fail or lose the submission.
- Admin submissions list: render the new status.
- Publish is required for the change to take effect on the live site; verify with one real submission afterward.