# Take the site down to a 404 page

Every URL on the site returns a plain 404 page. Nothing else is reachable: no home page, no priorities, no volunteer form, no admin panel, no canvassing app, no review room. The site stays published, so saqeeb.org and saqeebforeb.com keep loading — visitors just get a "Page not found" page.

All existing code, content, and data stay in place. Turning the site back on later is a one-line change.

## What visitors see

A minimal page: "404 — Page not found." No campaign branding, no navigation, no links back into the site.

## How it works

- Add a single gate in the root route (`src/routes/__root.tsx`) that renders the 404 page instead of `<Outlet />`, controlled by one flag in a small `src/lib/site-status.ts` file.
- Drop the header, footer, tracking, and volunteer prompts from the render path while the gate is on, so nothing else loads or fires.
- Point the sitemap (`src/routes/sitemap[.]xml.ts`) at an empty list and set `public/robots.txt` to disallow everything, so search engines stop surfacing pages.
- Leave route files, campaign copy, database, and the API routes untouched.

## Not included

- No unpublishing and no domain changes.
- No deletion of pages or content.
