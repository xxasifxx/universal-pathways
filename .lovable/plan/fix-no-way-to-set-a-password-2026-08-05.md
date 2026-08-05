# Fix: no way to set a password

## What went wrong
The admin sign-in page has an "Email me a password reset link" button. It sends the user to `/reset-password`, but that page does not exist in the app. So when saqeeb1998 clicked the emailed link, the recovery token signed them in and dropped them on a page with no password field (or a not-found screen) — there was never an option to set a password.

The same gap affects invited/new accounts: the invite and recovery emails both rely on that missing page.

## The fix
1. Add a public `/reset-password` page:
   - Reads the recovery/invite token from the URL and waits for the session to be established.
   - Shows "New password" + "Confirm password" fields with a minimum-length check and a show/hide toggle.
   - Saves via the auth client's password update, shows a success message, then sends the user to the admin dashboard.
   - Handles expired/used links with a clear message plus a "send me a new link" action.
   - Styled to match the campaign theme; `noindex` meta.
2. Keep the existing reset button on the admin login page, and make its success toast clearer ("Check your email — the link lets you set a new password").
3. Verify the recovery email template's button points at the same path, and that the invite template lands there too so first-time accounts can set their own password.
4. Test end-to-end in the browser: request a reset, open the link, set a password, confirm sign-in with the new password works.

## Technical notes
- New route file `src/routes/reset-password.tsx` (top-level, public — not under any auth gate, since the user is mid-recovery).
- Listen for the `PASSWORD_RECOVERY` auth event / existing session before rendering the form to avoid a flash of "invalid link".
- No database or schema changes.
