# Donations via Givebutter (embed) + bank/check

## What changes

`/donate` becomes two clear paths:

1. **Card / Apple Pay / Google Pay — Givebutter widget**, embedded directly on the page. Donors stay on saqeeb.org. Givebutter collects the card, the donor's name, address, employer and occupation, and keeps its own contribution record for ELEC reporting.
2. **Bank transfer or check — zero fee**, handled by the existing on-site pledge form. That form and the `contributions` table stay exactly as they are, minus the card ambition; it now serves only people sending ACH or mailing a check.

Zelle is dropped (not used by the committee).

## Real committee details

The pledge form's confirmation email gets the actual account info:

- Bank: Provident Bank
- Routing: 221272303
- Account: 103601292
- Account name / check payable to: Saqeeb for East Brunswick BOE
- Mailing address for checks: 406 Ryders Lane, East Brunswick, NJ 08816

The routing and account numbers stay **off the public page** — they appear only in the confirmation email to the person who pledged. A routing/account pair printed publicly invites fraudulent ACH debits against the committee account. The public page says "we'll email you the transfer details."

## Givebutter campaign ID

No campaign URL was given yet, so the embed goes in behind a single constant (`GIVEBUTTER_CAMPAIGN`). While it's blank the page shows the bank/check path only — no broken widget. Once you create the campaign at givebutter.com and send the slug, it's a one-line change to switch the widget on.

Givebutter fees for reference: 2.9% + 30 cents card processing, with their platform fee covered by an optional donor tip. No monthly cost, and they accept political committees without the review queue Stripe puts campaigns through.

## Page layout

```text
Every dollar goes straight to the campaign.
--------------------------------------------
[ Give by card ]              [ The rules, plainly ]
  Givebutter embed              $3,000 max per person
                                no corporate/union money
[ Prefer zero fees? ]           $300+ is publicly reported
  Bank transfer or check        not tax deductible
  -> pledge form
```

## Technical notes

- `src/lib/campaign.ts`: real `DONATION.bank` values, drop `zelle`, set `mailingAddress`, trim `DONATION_METHODS` to `bank_transfer` and `check`; add `GIVEBUTTER_CAMPAIGN` (empty until the slug arrives).
- New `src/components/givebutter-embed.tsx`: loads `https://js.givebutter.com/elements/widget.js` once via a `useEffect` script tag guard, renders `<givebutter-widget id="...">`. Client-only, returns null when the campaign constant is empty. Script tag goes through the component, not `__root.tsx`, so it isn't loaded on every page.
- `src/routes/donate.tsx`: two-column restructure above; "Ways to give" loses Zelle and stops printing account numbers.
- `src/components/donate-form.tsx`: method union narrows to `bank_transfer | check`; submit copy becomes "Get sending instructions".
- `src/lib/email-templates/contribution-confirmation.tsx`: remove the Zelle branch, render the real ACH numbers for transfers and the mailing address for checks.
- No database migration needed — `contributions` already has the right columns; Givebutter gifts live in Givebutter, not this table.
- US formatting stays pinned to `en-US` / USD and `America/New_York` in the admin views regardless of where the site is edited from.
