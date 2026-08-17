# Platform page: even depth, real page of its own

Three problems, one fix each.

## 1. Priority 02 has nothing behind it

Every disclosure so far answers one question: which budget line does this move? That framework only fits money promises, so "Students First" — placement, grading, AI literacy, staff training, ICE and SROs, student oversight — came out with nothing behind it. It reads as the fluffy priority when it is actually the one made of board policy rather than dollars.

Widen the disclosure model so a promise can open onto whatever lever actually governs it:

- **Budget** — the appropriation it moves (what exists today)
- **Board policy** — the specific policy or regulation the board votes on
- **State rule** — where Trenton, not East Brunswick, sets the limit
- **Practice** — where nothing is written down and the change is administrative

Each panel keeps the same three parts as today: the lever, how the change actually happens, and the honest open question. Priority 02 gets a panel on the placement matrix and course access, grading and homework policy, AI use, staff training, police and immigration enforcement in schools, and student seats on committees. Priority 01 and 03 bullets that are still bare get panels too — "fully funded schools", "special education, mental health, early intervention", "state-of-the-art schools", "audit the master plan".

Sourcing rule stays what it was: a link only goes in if it is fetched and verified in the working session. For policy items that means the district's own policy manual, board agendas, and NJ Department of Education or Attorney General material. Where nothing verifies, the panel describes the local lever plainly and carries no citation — no invented links, no borrowed authority.

## 2. Repeating the home page hero

Drop the reused pitch block. The platform page opens on its own terms: the page title, one line on what this list is and how to read it, and the three priorities as an immediate index. Nobody arriving here needs the introduction they already scrolled past.

## 3. The page design

Restructure so depth reads as depth:

```text
Platform header + how to read this page
Sticky priority index (01 / 02 / 03)
--------------------------------------
01 Affordable for All
   summary
   promise ......................... lever tag  >
   promise ......................... lever tag  >
02 Students First     (same treatment)
03 Reduce Our Costs   (same treatment)
--------------------------------------
Why there is no price tag + donate / dashboard
```

Detail work: colour-coded lever tags so a reader can see at a glance which promises are money and which are policy; open and closed rows visually distinct beyond an arrow; each priority band separated by real space rather than a hairline; the index sticks while scrolling so position is never lost; mobile rows stack the tag under the promise instead of squeezing it.

## Technical notes

- `src/lib/campaign.ts`: rename `PromiseDetail.budgetLine` to a general `lever` with a `leverKind` union (`budget | policy | state-rule | practice`); add detail objects to the bare points in all three priorities.
- `src/routes/priorities.tsx`: remove the `PITCH` hero, add the sticky index, render lever tags off `leverKind`, keep native `<details>` for disclosure and keyboard behaviour.
- Verify every new source URL with a live fetch before it ships; drop any claim that cannot be verified.
