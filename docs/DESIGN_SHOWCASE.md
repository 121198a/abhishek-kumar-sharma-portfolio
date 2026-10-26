# Design Showcase

Categories -> project cards -> each project opens as its own working app in a new tab.

## How it fits together
- `data/designs.ts` is the single source of truth (categories, titles, descriptions, tags, status).
- `design-projects-src/<category>/<slug>/` holds each project's untouched source (not served, excluded from tsconfig).
- `npm run design:build` compiles each into `public/design-projects/<category>/<slug>/` with
  `--base=/design-projects/<category>/<slug>/` so asset URLs are absolute. Static projects get relative URLs rewritten.
  Output is verified in staging and only then swapped in.
- `next.config.mjs` rewrites `/design-projects/:category/:slug` to that folder's `index.html`.
- Cards are plain `<a target="_blank">` links: no project code loads until a visitor clicks.

## First-time setup (needs network)
```bash
npm run design:build                      # builds all 7 Vite projects (installs each one's own deps)
npm i --no-save playwright && npx playwright install chromium
npm run design:screenshots                # real screenshots of the BUILT output -> public/design-previews
npm run design:verify -- --strict         # must pass before deploying
git add public/design-projects public/design-previews && git commit
```
Commit the built output; Vercel then just serves it and its build is unchanged.

## Add a design
1. Copy its folder to `design-projects-src/<category>/<slug>/`.
2. Add one entry to `data/designs.ts` (new category: add a `DesignCategory`).
3. `npm run design:build -- <category>/<slug>` then `npm run design:screenshots -- <category>/<slug>`.

## Notes
- Company Navbar's `index.html` pointed at `/src/main.tsx` but the file is `src/Main.tsx`; fixed in this copy. Apply the same
  one-line fix to your original (it works on Windows/macOS, fails on Linux/CI).
- Runway Auth has no source (empty folder) so it shows as "Coming soon". Add `design-projects-src/auth/runway-auth/`
  and set its `status` to `"live"`.
- Slider's `login.jsx` is not loaded by its `index.html`, so it is not published.
- All projects share the portfolio's origin (localStorage is shared); their keys are namespaced and do not collide.
- `/design-projects/*` has its own report-only CSP so Lamp's Google Fonts keep working if you enforce the global one.
