# Tone pass: strip the AI-sounding copy

The site's writing keeps slipping into a cadence that reads as promotional and self-satisfied — three-beat fragments ("No speculation. No opponent attacks. Just..."), knowing asides ("technically", "actually"), and slogan-shaped lines that assert instead of inform. This pass rewrites that copy into plain declarative sentences that sound like a person explaining something to a neighbor.

## The rules applied

- No "No X. No Y. Just Z." constructions, and no stacked sentence fragments for rhythm.
- No punchy one-word sentences, no "Here's the thing", no em-dash zingers.
- Drop knowing sneers ("technically", "actually", "wasting your time") — state the fact and let it stand.
- Full sentences, ordinary verbs, specific nouns. Where a claim is made, the sentence says who does what.
- Let length vary with how much there is to say. Uneven depth is the point: the PILOT mechanics, the benefits line, and what the board can actually do get real paragraphs, because they are the parts where a reader's objection lives. Things everyone already accepts — the footer line, the volunteer intro, most slice notes — get one short sentence and no elaboration. Where a section shrinks or grows enough to affect a layout, the surrounding markup is adjusted so it still sits well rather than padding the copy to fit.

## Specific rewrites

**PILOT page** (`src/routes/pilot.tsx`)

- The closing line "No speculation. No opponent attacks. Just the transparency and clear questions the board is entitled to ask." is deleted outright, not rewritten. Announcing that you aren't speculating or attacking is itself a claim about your own virtue, and it invites the reader to wonder who you're denying. The action list ends on the last action.
- Hero paragraph: keep the facts, remove the "legal — but" pivot styling in favor of a normal sentence.
- The "$1.2 million in reserve could be helping schools" badge becomes a factual label rather than a slogan.
- Section headings "Two ways to read the same deal" / "How a PILOT works, in plain English" are kept but the sub-copy loses the rhetorical framing.

**Footer tagline** (`src/lib/i18n.tsx`)

- "An independent, community-run campaign… No party line, no consultants." → drops the two-fragment ending; states independence in one sentence.

**Budget dashboard copy** (`src/lib/i18n.tsx`, `src/lib/campaign.ts`)

- "The district publishes these numbers, technically… Flip the toggle." → straightforward explanation of what the toggle does.
- correct the toggle which currently is greyed out and active state but when blocked becomes colored in and the toggle shifts further to the right breaking out of the toggle background. the toggle doesn't have a proper inactive state and this caused the active state to bug out.
- "Where East Brunswick's $229 million actually goes" → drops "actually".
- Eyebrow "Follow the money" → a neutral label.
- Slice notes: "anyone campaigning on finding savings here is wasting your time" → explains that these costs are set by contract and can't be cut by the board; "where most policy decisions actually get made" → drops "actually".
- Disclaimer keeps its plain tone but loses the clipped "We'd like it to." trailer.

**Home page** (`src/routes/index.tsx`, pitch copy in `src/lib/campaign.ts` / `i18n.tsx`)

- "East Brunswick deserves a different path." → a sentence about what the board can do differently.
- The ask line ("We need an advocate willing to take on corruption…") is rewritten as a normal sentence rather than a rallying triad.
- Platform highlight blurbs are checked for comma-stacked slogan lists and given verbs where they read as fragments.

**Volunteer / donate / thanks pages**

- Scan for the same patterns (fragment triads, "Pick how you want to help — you can choose more than one" reads fine and stays) and fix only lines that use the punchy cadence.

## Technical notes

Copy-only edits in `src/lib/i18n.tsx`, `src/lib/campaign.ts`, `src/routes/pilot.tsx`, `src/routes/index.tsx`, `src/routes/dashboard.tsx`, `src/routes/priorities.tsx`, `src/routes/volunteer.tsx`, `src/routes/donate.index.tsx`, `src/routes/donate.thanks.tsx`. No layout, data, routing, or component-structure changes; each route keeps its existing title/description/OG metadata (metadata text itself is reviewed for the same tone). Afterwards a repo-wide search confirms no remaining "No … No … Just …" constructions or "actually/technically" asides in public copy.