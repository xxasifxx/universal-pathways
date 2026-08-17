# Reading-intent volunteer prompt + volunteer modal

Turn engaged reading into a soft recruitment moment, without nagging.

## 1. A "reading engagement" score
Extend the existing intent tracking with a small client-side score that grows from signals we already collect:
- active time on page (not just elapsed time)
- scroll depth past 50% / 75%
- number of priority/explainer sections dwelled on
- expanding a disclosure panel on the platform page
- visiting 2+ substantive pages in one session

When the score crosses a "deep reader" threshold, we fire an analytics signal (`volunteer_prompt_eligible`) and show the pill.

## 2. The volunteer pill
- Small dismissible pill anchored bottom-center (bottom-right on desktop), above the fold-safe area, respects safe-area insets on mobile.
- Copy stays low-pressure, e.g. "Want to help? Two hours is enough." with a "Get involved" action and an X to close.
- Rules so it never feels pushy:
  - never on the volunteer page, admin routes, or after a successful signup
  - once per session; if dismissed, suppressed for 30 days (localStorage)
  - never during the first 20 seconds of a session
  - hidden entirely when tracking consent is off / reduced-motion respected for the entrance animation
- Signals logged: shown, dismissed, opened.

## 3. Volunteer form as a modal anywhere
- Extract the signup card from `/volunteer` into a reusable dialog that renders the existing `VolunteerForm` unchanged (same validation, same submission, same emails).
- Mounted once at the root so any page can open it: the pill, header "Volunteer" link, and home-page CTAs open the modal instead of navigating; the `/volunteer` route stays as-is for direct links and SEO.
- Accessible dialog: focus trap, Escape to close, scroll lock, labelled title; on success it shows the same confirmation and can be closed.

## Technical notes
- New `src/hooks/use-reading-intent.ts` — derives the score from the signals emitted by `use-page-engagement` / `use-campaign-intent`, no extra network traffic.
- New `src/components/volunteer-prompt.tsx` (pill) and `src/components/volunteer-modal.tsx` (dialog + a tiny context/store to open it from anywhere), both mounted in `src/routes/__root.tsx` alongside `<Tracking />`, client-only so SSR is unaffected.
- `src/routes/volunteer.tsx` and `src/components/volunteer-form.tsx` reuse the same form component; no change to submission logic or backend.
- Dismiss state in localStorage under a `lv_volunteer_prompt` key; all new events go through the existing `logSignal` pipeline so they show up in the admin intent view.
