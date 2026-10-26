# Audit notes (semantic HTML/SEO, div soup, Tailwind density)

Method: read every source file. Not run: `npm install`, build, lint, a browser, or any Div Soup / Tailwind scoring tool (none were available), so no scores are reported.

## Semantics, SEO, accessibility
- Tabs now follow the ARIA tabs pattern: `aria-controls`, a `tabpanel` linked to the active tab, roving `tabIndex`, Arrow/Home/End keys.
- Removed `aria-pressed` from controls whose label already changes with state (password toggle, sound, theme); it caused double announcements.
- Password-rule list no longer relies on colour alone: unmet rules use an empty circle and hidden "(met)/(not met)" text.
- Status messages (notice, light-dimmed) live in persistent `role="status"` regions so they are announced reliably; errors keep `role="alert"`.
- `document.title` now follows the state (Log in / Create account / Signed in); `index.html` has one description plus minimal Open Graph title/description.
- Removed `viewport-fit=cover` (there is no safe-area padding, so it could place content under a notch).
- Dark-theme placeholder lightened for contrast (stone-400).
- Not added on purpose: canonical URL and robots rules (domain and indexing policy are unknown), structured data, social image.

## Div soup
Removed 4 wrapper elements with no layout role: card content wrapper (glows now `-z-10` inside the card's stacking context), the password-field wrapper, the Chandelier wrapper in HeroPanel (now a `className` prop), the AuthCard wrapper in App (classes moved onto the sections).
Kept: the decorative chandelier shapes (aria-hidden; their exact geometry is the design) and the layout/positioning divs.

## Tailwind density
- Shared roles added in `src/index.css`: `.text-accent`, `.text-body`, `.text-muted`, `.surface-chip`, `.alert-error`, `.ctrl` (renamed from `.ctrl-btn`, it is not only a button).
- Tab buttons generated from one array instead of two near-identical ternaries.
- Removed duplicate focus utilities on inputs (the global `:focus-visible` rule already covers them).
- Small intended visual shifts: some secondary text moved from stone-600 to stone-700 in light mode and the badge border from white/15 to white/10 in dark mode (shared classes). "Forgot password?" moved onto the Remember-me row, as in the reference video.

## Round 2 (copy, button styles, layout, social login)
Not run: `npm install`/build/browser (no network in the authoring environment), so none of this is visually verified. Run `npm install && npm run build` first.

- **Copy (grade ~12 → ~5, own estimate with a Flesch-Kincaid script, not the audit tool):** hero body rewritten in plain words, two short sentences.
- **Button styles (7 → 4 shared styles):** `.btn-primary` (submit, sign out), `.ctrl` (sound, theme, Google, Facebook), `.btn-tab` (tabs), `.btn-ghost` (show/hide password, Forgot password?, light cord). The audit tool was not available, so the count is by design, not measured.
- **Fixed header:** the page is a fixed-height column (`h-dvh`); header and footer never move, only `<main>` scrolls, and only if the content is taller than the screen. No magic top padding.
- **No scroll on desktop:** spacing tightened; the three feature chips are hidden on short desktop screens (`short` screen in tailwind.config.js). Signup is taller than login, so on small laptops its card can still scroll inside `<main>` rather than being cut off.
- **Google and Facebook buttons:** added under the form (inline SVG marks, group labelled "Or continue with"). Demo sign-in by default (no on-screen developer message); redirect to backend OAuth routes when `VITE_AUTH_BASE_URL` is set.
- **Heading:** removed the clipped text gradient (transparent text disappears in forced-colors mode); now solid colour.
- **Tailwind density:** long class chains moved into `.hero-title`, `.field-input`, `.panel-inset`, `.btn-tab`, `.btn-ghost`.
- New messages scroll into view inside the card (errors would otherwise sit off-screen above a long form).

## Round 3 (24 axe colour-contrast "Suggestion" items)
All 24 had the same cause: axe could not work out the background behind the text because the root element painted a gradient (the starfield) and the tab indicator was a gradient. Severity "Suggestion" means "needs review", not "fails".
- Starfield moved from the root to its own `aria-hidden` layer; the root is now a plain colour.
- Tab indicator is now solid `bg-amber-400` (was a gradient behind the tab text).
- Contrast calculated by hand (WCAG formula) against the page colours, all above 4.5:1: body text 9.4 light / 13.6 dark, muted 7.0 / 8.0, accent 6.5 / 12.1, selected tab 11.8, unselected tab 8.2.
- Not verified: item 7 (`#hero-title`, "partially overlaps other elements"). The soft chandelier glow sits behind the heading. If axe still lists it, the next step is to move `Atmosphere` out of the hero section to a page-level layer.

## Round 4 (colour-contrast "background gradient" / "partially overlaps", Login and Signup)
Moving the starfield to its own layer did not help: axe still looks at every decorative layer under the text, even with `pointer-events-none`. So every gradient and every partly-overlapping glow behind text was removed:
- Starfield is now one 1px element whose `box-shadow`s are the stars (dark theme only). No `background-image` anywhere behind text.
- `Atmosphere` (conic and radial gradients behind the heading) was deleted. The chandelier shade now casts the light with a large `box-shadow` instead.
- The violet and cyan glow blobs inside the card became outer `box-shadow`s on `.glass-card`, so nothing overlaps the form text.
- `.btn-primary` is a solid amber button (it had its own gradient behind its label).
Visual changes to expect: softer light cast from the chandelier, no straight light cone, card glow only outside the card edge. Remaining gradients (logo tile, "access granted" icon tile) hold only decorative icons, no text.
Not verified: no browser or axe run was possible here.

## Round 5 (social buttons)
The "not connected yet" notice was removed from the UI because it broke the layout. Google and Facebook now run a demo sign-in (disabled while busy), or redirect to `VITE_AUTH_BASE_URL/<provider>` when set. Real OAuth still needs your own provider apps and a backend.

## Round 6 (mobile header, Lumen)
Removed the Lumen slider and its percentage; brightness is a fixed constant (`BRIGHTNESS = 88` in App.jsx). On phones the header shows only the logo and two icon buttons (sound, theme); the theme button keeps its text label from `sm` up and an `aria-label` always.
