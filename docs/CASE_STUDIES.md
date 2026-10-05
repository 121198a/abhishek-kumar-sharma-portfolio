# Project case-study pages - Phase 8

Pages: `/projects/<slug>` for six projects, generated statically (`app/projects/[slug]/page.tsx`). Slugs: bank-management-system, ventureflow-web, unboundx-admin-dashboard, noc-monitoring-lab, fir-management-system, sharma-kitchen. Any other slug returns 404 (`dynamicParams = false`).

## Where the content comes from
`data/case-studies.ts` - every line was checked against the repository source (line counts, route counts, model counts, test counts, security controls). Nothing is stated about your role, timeline, users, metrics or lessons learned.

## Deliberately NOT included
- **WAGAN SHOP, steganography, STM32 ramp**: their source code is not in the repositories (empty files / client only), so there is nothing to verify. They keep their cards on the home page but have no detail page.
- **Screenshots, demo video, live demo links**: none exist yet.

## TODO - USER INPUT REQUIRED (add to `data/case-studies.ts` once confirmed)
For each project: your role, timeline, the problem it solved, what was hardest, what you learned, screenshots (put files in `public/images/projects/<slug>/`), live demo URL. Add optional fields to the `CaseStudy` type and render them in the page only when present.

## Adding or changing a page
1. Add the entry in `data/case-studies.ts` and the slug in `data/case-study-slugs.ts` (kept separate so the home page does not bundle the full text).
2. The project must already exist in `data/projects.ts`.
3. Run `npm run test:content`: it fails on slug mismatches, non-GitHub repo URLs, empty sections, and on claims that were found to be unverified (Spring Boot, AWS/S3/Lambda, .NET, Infopulse, CoCoLe, "published", etc.). Extend the blocklist in `tests/case-studies.ts` if you find more.

## SEO
Each page has its own title, description, canonical URL, Open Graph tags, a `SoftwareSourceCode` JSON-LD block (name, description, repository, language, author) and a sitemap entry (7 URLs in total).

## Measured
Lighthouse on `/projects/noc-monitoring-lab` (lab, noisy sandbox): mobile 92 / 100 / 100 / 100, desktop 100 / 100 / 100 / 100 (performance / accessibility / best practices / SEO). All six pages: no horizontal overflow at 280, 375, 768 and 1440 px, one h1, no console errors, no touch targets under 24px.

Home bundle: route JS 18.9 kB, first-load 125 kB (+4 kB vs phase 7 for client-side navigation to the new pages).
