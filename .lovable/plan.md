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

### 2. Make the volunteer form progressive — each choice unlocks the fields it actually needs

Pick one or more ways to help. Every choice you check adds its own small block of questions to the same form, and it all submits together as one signup.

```text
Step 1 - shared, always shown
  Name, email, zip code

Step 2 - check what you want to do (one or more)

  [x] Request a yard sign
        -> Street address (required)
        -> Any placement notes (optional)

  [x] Join a canvassing day
        -> Which days work: Sat morning / Sat afternoon /
           Sun morning / Sun afternoon / Weekday evening
        -> Can you drive to a turf? yes / no

  [x] Phone or text bank
        -> Mobile number (required)
        -> Best times to reach you: weekday day / weekday evening / weekend
        -> Prefer calls or texting?

Step 3
  Anything else you want us to know (optional)
  Submit -> "Count me in"
```

Rules:
- Nothing extra is shown until its box is checked; the form starts short and grows only as much as the person opted into.
- Fields required only when their block is open — address is required for yard signs, mobile for phone banking, at least one day for canvassing.
- Checking nothing blocks submit with a clear message: "Pick at least one way to help."
- Blocks animate open in place, under the checkbox, so it stays one form and one submit button.
- The volunteer page above the form lists the three options as short cards with the real commitment (yard sign: we drop one off; canvassing: weekend door-knocking, about 2 hours, we pair you up; phone/text bank: from home, your own schedule). Clicking a card checks that box and scrolls to the form.

### 3. Store and email the extra detail
- Checkboxes replace the pill toggles, so the choices are unmissable and screen-reader correct.
- The per-option answers are saved with the signup and included in the alert email, grouped by option, so Saqeeb sees "Canvassing - Sat AM, Sun AM, has a car" instead of just a label.
- Storage uses a JSON detail column on the existing signups table; the existing insert, notification, and admin list keep working unchanged.

### 4. Disclaimer
Change the footer disclaimer to "Paid for by Friends of Saqeeb." across all language files.

## Technical notes
- Files touched: `src/routes/index.tsx` (hero CTAs), `src/routes/volunteer.tsx` (choice cards + layout), `src/components/volunteer-form.tsx` (checkbox blocks, conditional fields, per-block validation), `src/components/site-footer.tsx` (drop duplicate register block), `src/lib/i18n.tsx` (disclaimer + new copy strings, all languages), `src/lib/campaign.ts` (per-option description and field spec), `src/lib/submissions.functions.ts` + `src/lib/email-templates/volunteer-notification.tsx` (accept and render the detail payload).
- One migration adds a nullable `help_details jsonb` column to `volunteer_signups`; existing rows and queries are unaffected.
- The server function gets a zod schema for the detail object (per-option keys, string/array values, length-capped) and validates it alongside the current fields.
- Donate links keep using `actblueUrl()` so UTM tracking stays intact; the new hero donate button gets its own medium tag.