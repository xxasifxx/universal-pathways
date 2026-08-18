# Canvassing App: Turf Planning, Field Walk Deck, Offline Sync

A field-operations layer on top of the existing 29k voter / household data. Voters and households stay read-only; everything canvassers do is written to new event tables.

## What gets built

### 1. Data layer (operational overlay)

New tables, all referencing existing `voters.id` / `households.hh_key` without changing them:

- `turfs` — name, district, status (open / assigned / in_progress / completed), assigned volunteer, target door count, access passcode hash, created_by.
- `turf_households` — turf to household link plus `sequence` (walk order) and a frozen address/lat/lng snapshot.
- `canvass_visits` — append-only door events: turf, household, outcome (not_home / moved / refused / inaccessible / spoke), visited_at from the device clock, canvasser identity, free-text note, client-generated id for dedupe on retry.
- `canvass_responses` — per-voter results tied to a visit: support 1-5, issue tags, flags for lawn sign / volunteer lead / vote-by-mail / do-not-contact.
- `canvass_volunteers` — volunteer roster (name, email, phone, active), linked to an auth user when they have one.

Access rules:
- New `canvasser` role added to the existing role enum. Organizers (admin) see everything; canvassers reach only households in a turf assigned to them.
- Walk-up volunteers use a per-turf link plus passcode, verified server-side the same way the review room works. That grants a short-lived turf session — never a general voter search.
- Every field read goes through a scoped server function that returns only the assigned turf's rows. No client-side voter querying from the walk deck.
- Field payloads are masked by campaign-phase settings: party can be hidden, turnout becomes a badge (Super Voter / Reliable / Occasional) instead of a raw percentage, and phone/email are withheld unless the turf is flagged for contact validation.

### 2. Canvasser walk deck — `/canvass/walk/$turfId`

Its own bare shell: no site nav, no campaign footer, no tracking. One screen, one household.

```text
+---------------------------------------------------+
| Turf name        Stop 12 / 58        Synced/3 left |
+---------------------------------------------------+
| 24 Cranbury Rd                       [ Navigate ]  |
| Ana Rivera   40s   Reliable                        |
| Luis Rivera  40s   Occasional                      |
+---------------------------------------------------+
| [ Not home ] [ Moved ] [ Refused ] [ No access ]   |
+---------------------------------------------------+
|            [   Spoke to voter   ]                  |
+---------------------------------------------------+
| [ < Prev ]                            [ Skip > ]   |
+---------------------------------------------------+
```

- Fast path: the four quick outcomes record the visit and advance instantly.
- Deep path: "Spoke to voter" opens a bottom sheet with one block per resident — a 1-5 support scale, issue pills, the four action checkboxes, and an optional note. Two taps to finish a typical door.
- Navigate opens the device's own maps app with the household coordinates.
- Every tap target is at least 48x48px, addresses and names use full-strength contrast, no gray-on-gray.

Walk order is generated as a serpentine street route: one side of a street in ascending house numbers, then back down the other side, so volunteers never cross the road twice.

### 3. Offline outbox

- Opening a turf downloads the whole bundle — households, residents, sequence — in one request and caches it locally.
- Outcomes write to a local IndexedDB outbox first and the UI advances immediately; nothing waits on the network.
- A background flush posts batches to a sync endpoint when online, on reconnect, and on a timer. The header shows "All changes synced" or "3 doors pending".
- Visits are append-only and deduped by client id. Voter-level attributes take last write wins by device timestamp.

### 4. Organizer studio — `/canvass/admin`

Lives inside the existing desktop admin shell, as a new tab.

- Map of geocoded households with the current district / turnout / matched filters.
- Auto-cluster turf cutting: pick filters, set a target size (e.g. 55 doors), and the system groups contiguous street runs into turfs, shows the proposed split on the map, and saves on confirm.
- Assignment controls: assign a turf to a volunteer or leave it open, copy its share link and passcode, move it through open to completed.
- Telemetry: doors knocked, contact rate, support distribution, lawn-sign and volunteer leads, per turf and campaign-wide, with CSV export.

## Technical notes

- Schema arrives as one migration with GRANTs, RLS, and role-scoped policies; canvasser-facing reads run through server functions rather than direct table access.
- Batch sync is a server route so the client can use `keepalive` and retry semantics; it authenticates either the bearer token or the turf session token before writing.
- The walk route is `ssr: false` and noindex; the turf bundle and outbox live in IndexedDB keyed by turf id.
- Reuses the existing Google Maps loader for the organizer map; the walk deck ships no map engine at all.

## Order of work

1. Migration, roles, scoped read/write server functions.
2. Walk deck UI with bundle caching and the outcome sheet.
3. Outbox queue, batch sync endpoint, status indicator.
4. Organizer studio: map, auto-cluster turf creation, assignment, dashboard.
