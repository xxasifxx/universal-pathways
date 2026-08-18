# Make the canvassing app functional, and ingest the new target list

## Why it feels incomplete right now

Checked against the live database:

- 29,237 voters and 11,862 households are loaded.
- 0 households have map coordinates. 11,862 pending, 950 failed — every failure with the same browser-geocoder error.
- Turf cutting only considers households that have coordinates, so "Create turfs" can only ever produce zero turfs.
- Result: 0 turfs, 0 stops, 0 volunteers, 0 recorded doors. Every canvassing screen is an empty shell even though the code behind it is built.

## What gets built

### 1. Ingest the uploaded walk list

The PDF is a 24-page Google Sheets export with two parts: the same base voter export already loaded, plus a second, larger target list of roughly 3,350 people carrying campaign-specific columns — district, phone, the eight general-election vote flags, a turnout percentage, and a Canvassed marker.

- Parse the second list, match each person to the existing voter records by name plus address plus date of birth, and report how many matched, how many are new, and how many are ambiguous.
- Add a target-list flag and a canvassed flag to voters so this universe can be filtered and cut into turfs on its own.
- Rows that do not match an existing voter are inserted so nobody on the list is lost, with the household record created alongside.
- Pre-marked canvassed rows are recorded as already-worked so volunteers are not sent back to those doors.

### 2. Fix address mapping

Replace the failing browser Google Maps geocoder with the free US Census Bureau batch geocoder, which is built for bulk residential addresses and needs no key or quota juggling.

- Server function that pulls pending households in batches, writes coordinates back, and can resume.
- Unmatched addresses fall back to a ZIP-area position so they still appear and are still walkable, flagged as approximate.
- Admin panel shows honest progress and re-runs safely; the 950 failed rows are reset and retried.

### 3. Let turf cutting work without waiting on the map

Turf cutting drops the coordinates requirement and groups by street name and house number — the order that actually matters for walking. Coordinates are used only for the Navigate button when present.

### 4. Cut the first real turfs

Generate a starter set of turfs from the newly ingested target list so the studio, walk deck, dashboard, and CSV export all show live data instead of empty states.

### 5. Walk the whole flow and fix what breaks

Phone-sized end-to-end pass: organizer cuts a turf, assigns it, copies the share link and passcode; volunteer opens the link, enters the passcode, logs quick outcomes plus one full "Spoke to voter" conversation; doors sync back and appear in the studio totals and the export. Anything broken on that path is fixed in the same pass.

## Technical notes

- PDF parsing runs offline in the sandbox; rows go in through the insert path in batches, not through page-load code.
- Two new voter columns (target-list membership, prior canvass) plus the household rows come in one migration with grants and policies matching the existing organizer-only access on voters and households.
- Census batch geocoding accepts large batches per request; progress is stored per household so it resumes.
- `autoClusterTurfs` loses the `lat is not null` filter and sorts by parsed house number within each street run; serpentine order stays.
- No change to the public site or to the voter/household access rules.

## Order of work

1. Parse and ingest the target list; report matched / new / ambiguous.
2. Census geocoder plus admin progress; retry failed rows.
3. Turf cutting without the coordinate requirement.
4. Cut starter turfs and add volunteer records.
5. Full flow test: cut, assign, walk, sync, export.
