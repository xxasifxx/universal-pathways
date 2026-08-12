# CTA cleanup, volunteer form rebuild, and disclaimer fix

## What's wrong today (verified in the code)

**Hero CTAs contradict each other.** The hero has two equal-weight buttons: "Get Involved" (jumps to the ask-a-question form) and "Request a Sign" (goes to /volunteer). Neither says what it actually does — "Get Involved" lands on a question box, not a sign-up — and the biggest ask of a campaign site, donate, is missing from the hero entirely.

**Too many competing asks, no hierarchy.** The home page asks, in order: get involved, request a sign, read all promises, ask a question, donate (5 buttons), register to vote. The footer then repeats register-to-vote and donate. Everything is styled at similar weight, so nothing reads as the primary action.

**Volunteer page is muddled.** /volunteer is titled "Powered by Neighbors" with a card headed "Sign up" and the note "One form for volunteering and sign requests" — one generic form doing three unrelated jobs (yard sign, canvassing, phone bank) with no explanation of what each commitment involves.

**The three "how you can help" choices are pill toggle buttons**, which read as filters rather than selections, are easy to skip, and can be submitted blank — someone can sign up without saying what they want to do.

**Footer disclaimer says "Paid for by Saqeeb for East Brunswick."** — it must read "Paid for by Friends of Saqeeb."

## The fix

### 1. One clear CTA ladder
Each section gets a single primary action; everything else is visually secondary.

- Hero: primary "Volunteer" (to /volunteer), secondary "Donate" (ActBlue). Drop the misleading "Get Involved" jump.
- Platform section: keep the text link to all promises as a secondary link.
- Ask section: unchanged — it is its own conversion.
- Donate section: keep the amount buttons as the primary donate ask.
- Register to vote: keep once on the home page, remove the duplicate register block from the footer so the footer is navigation and disclaimer only.

Every button gets literal, outcome-based text: "Volunteer", "Donate", "Request a yard sign", "Register to vote", "Send question".

### 2. Rebuild the volunteer page around three real choices
Lead with what you can sign up for, each with a one-line description of the actual commitment:

```text
1. Request a yard sign   - we drop one at your address
2. Join a canvassing day - weekend door-knocking, ~2 hours, we pair you up
3. Phone / text bank     - from home, on your own schedule
```

Picking a card scrolls to the form with that option pre-selected.

### 3. Rebuild the form itself
- Replace pill toggles with real checkboxes plus their descriptions, so choices are unmissable and screen-reader correct.
- Require at least one choice, with a clear error if none is picked.
- Show the street-address field only when yard sign is selected, and require it then.
- Tighten copy: heading "Sign up to help", submit button "Count me in".
- Keep the existing submit path, database write, and email notification exactly as they are.

### 4. Disclaimer
Change the footer disclaimer to "Paid for by Friends of Saqeeb." across all language files.

## Technical notes
- Files touched: `src/routes/index.tsx` (hero CTAs), `src/routes/volunteer.tsx` (choice cards + layout), `src/components/volunteer-form.tsx` (checkboxes, validation, conditional address), `src/components/site-footer.tsx` (drop duplicate register block), `src/lib/i18n.tsx` (disclaimer + new copy strings, all languages), `src/lib/campaign.ts` (description line per HELP_OPTION).
- No database, server-function, or email changes; the submission payload shape stays identical.
- Donate links keep using `actblueUrl()` so UTM tracking stays intact; the new hero donate button gets its own medium tag.