Volunteer form clarity pass

Goal: Make the volunteer page immediately explain the three ways someone can help the campaign, and let them pick one or more in the form.

What will change
- Replace the current five toggle options with the three Saqeeb asked for:
  1. Sign up to help
  2. Join a canvassing day
  3. Phone or text bank
- Update the volunteer page intro copy so the three choices are visible before the form.
- Keep yard-sign requests possible by treating the street-address field as the yard-sign path (already present; the page will keep that note).
- Keep all existing analytics, submission storage, and email alerts unchanged.

Files to edit
- src/lib/campaign.ts — HELP_OPTIONS list.
- src/routes/volunteer.tsx — page headline and supporting copy.
- src/lib/i18n.tsx — add/update translation keys for the new option labels and page copy.
- src/components/volunteer-form.tsx — fieldset legend text and default toggle labels.