# Home page: ask Muhammad a question

The point of Wilbur's page isn't the bullet list — it's that the page gives you one obvious thing to do. Right now the home page ends in a list of five priorities nobody scrolls. It should end in a question box that reaches Muhammad directly.

## What changes on the home page

Order, top to bottom:

1. Portrait + "Hi, I'm Muhammad Saqeeb. Here's why I'm running." (unchanged)
2. The short first-person story and four reasons (unchanged)
3. **Ask Muhammad a question** — the main event, directly under the intro. Name, email, one question box, Send. Nothing else.
4. A single quiet line of links underneath: Priorities, District dashboard, Volunteer, and social links when provided.

The five-priority list block is removed from the home page. The `/priorities` page stays exactly as it is for the people who do want it — it's just a link now, not the finish line.

Buttons at the top change to match: the primary button scrolls to the question box ("Ask me a question"), the secondary stays "Volunteer".

## Where the question goes

Two places, so nothing is lost:

- Saved to the campaign inbox in the backend (the existing contact-message store, already visible in the admin area).
- Emailed to `ask@saqeeb.org` the moment it's submitted, with the asker's name, email, and question, and reply-to set to the asker so Muhammad can just hit Reply.
- The person asking gets a short confirmation email back: "Muhammad got your question."

Sending email requires one setup step: the campaign's email domain has to be connected once (a DNS record at the domain registrar for saqeeb.org). Until that's verified, questions still save to the campaign inbox and nothing breaks — the emails start flowing the moment DNS clears.

## After submitting

The form is replaced in place by a clear confirmation, scrolled into view, with a note that he answers personally, usually within a couple of days.

## Technical notes

- `src/routes/index.tsx`: remove the priorities-list section; add an `#ask` section rendering a new `AskQuestionForm`; retarget the hero primary CTA to `#ask`; add a compact link row.
- New `src/components/ask-question-form.tsx`: name / email / question, Zod-matched client validation, inline errors, error toast on invalid, disabled+pending state, success state replacing the form.
- `src/lib/submissions.functions.ts`: reuse `submitContact`, dropping the required `role` enum (it becomes optional) so the form stays three fields; add the email dispatch inside the handler after the insert, wrapped so a mail failure never fails the save.
- Email: run the Lovable email domain setup for `saqeeb.org`, scaffold the app-email templates, and add two templates — a notification to `ask@saqeeb.org` and a confirmation to the asker — both styled in campaign burgundy/gold.
- Keep the existing intent tracking hook-ups (`useCampaignIntent`) on the new form so a question counts as a high-intent signal.
- Verify on mobile (390px) with a real submit before handing back.
