# Donations: real bank details, US region, card processing

## 1. Bank + committee details (immediate)

Update the donation constants with the real committee info:

- Bank: Provident Bank
- Routing: 221272303
- Account: 103601292
- Account name / check payable to: Saqeeb for East Brunswick BOE
- Mailing address for checks: 406 Ryders Lane, East Brunswick, NJ 08816
- Remove Zelle entirely (not used) — donation methods become **Bank transfer (ACH)** and **Check by mail**

Account and routing numbers stay off the public page. The Donate page says "we'll email you the transfer details"; the numbers appear only in the confirmation email to the person who pledged. A routing/account pair printed publicly invites fraudulent ACH debits against the committee account.

## 2. Region = USA

The backend region is set when the project's database is created and can't be moved in place. First step is to read the actual region and report it. If it is already US, nothing to do. If it isn't, the choices are leave it (same data, only latency differs) or rebuild on a US project and migrate the tables — no silent switch either way.

Alongside that, pin all user-visible formatting to US regardless of where the site is being developed or viewed: USD/`en-US` currency, `America/New_York` dates in the admin views.

## 3. Card payments

Card giving needs a processor that accepts political committees. Two viable routes:

**A. Stripe with the committee's own account (recommended)** — Stripe permits US political campaign fundraising. You create a Stripe account for the committee; the site gets a real card checkout: amount, ELEC contributor fields, then Stripe Checkout. Contributions land in the same table with `status = 'paid'` and the same notification/confirmation emails fire from the webhook. Requires Stripe onboarding with the committee EIN and the Provident account for payouts.

**B. Campaign-specific processor (Anedot / Numero / WinRed-style)** — hosted form, compliance reporting built in, higher fee. The site links out; we lose the in-site form and the in-database record.

Lovable's built-in seamless payments can't be used — political committees are a restricted category there.

Recommendation: A. Bank/check stays live either way as the zero-fee option.

## Technical notes

- `src/lib/campaign.ts`: replace `DONATION.bank` placeholders, drop `zelle`, set `mailingAddress`, trim `DONATION_METHODS` to two entries.
- `src/components/donate-form.tsx`: method union narrows to `bank_transfer | check`; `card` added when step 3 lands.
- `src/lib/email-templates/contribution-confirmation.tsx`: render real ACH numbers for the transfer path, mailing address for checks.
- Stripe path adds a checkout server function plus `src/routes/api/public/stripe-webhook.ts` with signature verification, and `stripe_session_id` / `status` columns on `contributions`.