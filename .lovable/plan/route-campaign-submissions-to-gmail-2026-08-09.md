# Route campaign submissions to Gmail

## Goal
Deliver new question and volunteer notification emails to `saqeebforeb@gmail.com`, while keeping the public campaign contact address and submitter confirmation replies on `ask@saqeeb.org`.

## Current behavior
- Question and volunteer notifications are sent to `ask@saqeeb.org`.
- Confirmation emails are sent to the person who submitted the form.
- Confirmation replies currently point back to `ask@saqeeb.org`.
- The notification templates also identify `ask@saqeeb.org` as their preview recipient.

## Implementation
1. Add one shared internal notification recipient constant for `saqeebforeb@gmail.com`.
2. Update the question and volunteer notification send paths to use that recipient.
3. Update notification template metadata so previews and template configuration match the live destination.
4. Keep `CONTACT_EMAIL`, public-facing links, sender identity, and confirmation `replyTo` behavior unchanged.
5. Verify there are no remaining notification paths targeting the old inbox and test both submission flows without exposing the Gmail address in public UI.

## Technical details
- No Gmail connector or user OAuth is needed: this is app-generated email delivered to a Gmail address.
- The existing managed email delivery remains the sender and handles delivery status; the Gmail inbox must accept mail from the campaign sender domain.
- If the intent is literal mailbox forwarding from `ask@saqeeb.org` rather than app notifications, that is a separate mail-provider setting and cannot be implemented by changing the site alone.