# Make the canvassing app actually usable end to end

The code for canvassing is all there — walk deck, offline outbox, sync endpoint, organizer studio, field guide — but the system is empty and cannot produce a single turf. Here is the current state, checked against the live database:

- 29,237 voters and 11,862 households loaded.
- 0 households have map coordinates. 11,862 are still pending, 950 failed.
- Every failure has the same error, from the browser geocoder: `undefined is not an object (evaluating '(await e.geocode({address:t})).results')`.
- 0 turfs, 0 turf stops, 0 volunteers, 0 recorded visits.

Turf cutting only considers households that have coordinates, so "Create turfs" can only ever produce zero turfs today. With no turfs there are no walk lists, no share links, and no telemetry — which is exactly the "nothing is complete" feeling.

## What gets fixed

### 1. Replace the broken geocoder with a reliable server-side one
The browser Google Maps path is failing on every single address and is rate-limited besides. Switch address mapping to the free US Census Bureau batch geocoder, which is built for exactly this: bulk residential addresses, no API key, thousands per request.

- New server function that pulls pending households, submits them in batches, and writes back coordinates.
- Addresses that the Census cannot match fall back to a ZIP-centroid position so they still appear and are still walkable, flagged as approximate.
- Admin panel shows real progress (mapped / pending / approximate / failed) and can be re-run safely.
- Reset the 950 rows currently marked failed so they are retried.

### 2. Let turf cutting work even before every address is mapped
Turf cutting currently requires coordinates. It will instead group by street name and house number — the order that actually matters for walking — and use coordinates only for the Navigate link when present. A volunteer can be sent out even if a few houses lack a pin.

### 3. Get the first real turfs and volunteers in place
Cut a starter set of turfs across the districts so the studio, the walk deck, and the dashboard all have live data the moment you open them, rather than empty states.

### 4. Walk the whole flow and fix what breaks
End-to-end pass on a phone-sized browser: organizer cuts a turf, assigns it, copies the share link and passcode; volunteer opens the link, enters the passcode, records quick outcomes and one full "Spoke to voter" conversation; the doors sync back and show up in the studio totals and the CSV export. Anything broken on that path gets fixed in this same pass.

## Technical notes

- Census batch geocoding endpoint accepts up to 10,000 records per POST; batches run inside a server function with progress persisted per household, so it can resume.
- `autoClusterTurfs` drops the `lat is not null` filter and sorts by parsed house number within each street run; the serpentine order stays.
- Nothing changes in the public-facing site, and voter/household access rules stay as they are.

## Order of work

1. Census geocoder server function, admin progress panel, retry the failed rows.
2. Turf cutting without a coordinate requirement.
3. Seed the first turfs and volunteer records.
4. Full flow test: cut, assign, walk, sync, export.
