# Update Saqeeb's Platform Promises

## Goal
Replace the current broad platform language with the candidate's specific promises, using his direct wording and keeping the site easy to scan.

## User-visible changes
1. **Update the shared campaign content** in `src/lib/campaign.ts`:
   - Replace the current five priority entries with the three provided sections:
     - Affordable for All
     - Students First
     - Reduce Our Costs
   - Preserve each promise as its own bullet so visitors can quickly find concrete commitments.
   - Update homepage platform highlights to reflect the same three sections rather than introducing different or unsupported promises.
2. **Update the platform page** in `src/routes/priorities.tsx`:
   - Change the page title, description, heading, and introductory copy to match the three-section platform.
   - Render the new sections and promises from the shared data.
   - Keep the existing anchor navigation so each section can be linked directly.
3. **Update related navigation and copy** only where it still says “five priorities” or references the old platform categories, including translation strings used by the header/footer and homepage link text where needed.
4. **Refresh route metadata** for the platform page and homepage so search/social descriptions accurately describe the new platform.

## Content handling
- Use the supplied promises as the source of truth; do not add new policy claims, statistics, or explanatory storytelling.
- Preserve sensitive or politically explicit wording as provided, including the commitments about ICE, police/SROs, racism, sexism, Islamophobia, antisemitism, and lunch debt.
- Normalize only capitalization, punctuation, and minor grammar needed for consistent display (for example, “Reduce Our Costs” as a section heading).

## Technical details
- Keep the existing TanStack Start route structure and shared `PRIORITIES` data model.
- Do not change backend, forms, analytics, donation flow, or visual theme.
- After implementation, verify the platform page renders all three sections, all promises are visible on mobile and desktop, anchors work, and no old five-priority copy remains in public-facing platform UI.
- Confirm each affected content route retains complete title, description, Open Graph, and Twitter metadata.