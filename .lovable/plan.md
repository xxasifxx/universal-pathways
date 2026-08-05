# Admin Voter Targeting: district lists, impact ranking, matched voters, household map

## What you get

A new **Voters** section in the admin area (alongside Intent, Heatmaps, Export) with two linked views.

**1. District lists**
- Pick a district (1-40) or view all.
- Each list sorts by an **impact score** — highest impact at the top, with a one-click flip to lowest impact.
- Impact = past general-election turnout percentage combined with household size, so a reliable voter in a 4-voter household outranks a lone irregular voter.
- Every row shows name, address, party, turnout %, household size, phone (when present), a **matched-voter badge** for the 3,560 people on the matched list, and a petition-signer badge.
- Filters: district, matched only, turnout threshold (e.g. 75%+), party, has phone.
- Export the filtered list to CSV for walk and phone packets.

**2. Household map**
- Google map of East Brunswick with one **bubble per household**; the number inside the bubble is the count of voters at that address.
- Bubble size scales with household size; color reflects impact tier (or matched status).
- The map obeys the same filter bar, so "75%+ turnout, matched voters, district 1" shows exactly those households and nothing else.
- Clicking a bubble opens that household's voters with their turnout history.

**Turnout tab**: the town-wide 2018-2025 turnout figures from your workbook as a small reference chart.

## Data import

The three sheets load once into the database:
- 29,237 EB voters (full list), with the 3,560 matched voters flagged
- Petition signers, matched to voters by name and address
- Town-wide turnout history

## Addresses to map points

Google Maps geocoding (Lovable-managed) runs once over the **12,812 unique household addresses**, not per voter, and results are cached in the database. It runs as a batched admin job with a progress readout, so it can be started, paused, and resumed. After the first run the map costs nothing extra to load.

## Access

Admin-only, behind the existing admin login and admin-role check. Voter data is never exposed on the public site or to anonymous visitors.

## Technical notes

- New tables: `voters` (district, party, turnout flags 2018-2025, turnout_pct, matched flag, phone, household key), `households` (address key, district, voter_count, lat/lng, geocode status), `petition_signers`, `turnout_history`. RLS: admin-read only via `has_role(auth.uid(),'admin')`, with GRANTs to `authenticated` and `service_role`.
- Impact score stored as a maintained column: `turnout_pct * 0.7 + least(household_size,5)/5.0 * 0.3`, indexed on `(district, impact_score desc)` for fast paging.
- Household key derived from `street_num + street_name + zip`; the matched sheet's `household_id` is used where present.
- Import runs in the sandbox: parse the workbook, bulk-load with `COPY` into the new tables.
- Geocoding via the Google Maps connector gateway (`/maps/api/geocode/json`) inside an admin-only server function that processes a batch of addresses per call and writes lat/lng back; the UI loops until complete.
- Reads via `createServerFn` with `requireSupabaseAuth` plus an admin role check — paged for the list, aggregated for the map (returns households, not raw voters).
- Map uses the Maps JS API browser key with `google.maps.Marker` (scaled symbol + label for the count). No `mapId`, no AdvancedMarkerElement.
- New files: `src/routes/admin/voters.tsx`, `src/routes/admin/voter-map.tsx`, `src/components/admin/voter-filters.tsx`, `src/components/admin/household-map.tsx`, `src/lib/voters.functions.ts`, `src/lib/voters.server.ts`; tabs added in `admin-shell.tsx`.

## Order of work
1. Migration for the four tables, indexes, and policies.
2. Import the workbook data.
3. Connect Google Maps and run the geocoding job.
4. District list view with impact sort, filters, badges, CSV export.
5. Household map wired to the same filters.
6. Turnout reference tab.