# Performance and accessibility - Phase 5

Method: Lighthouse (current npm release) against the local production build in headless Chromium, lab conditions (mobile = simulated 4x CPU + slow 4G; desktop preset). Mobile was run 3 times because scores vary run to run. axe-style checks come from Lighthouse's accessibility audits. These are LAB numbers on a sandbox machine, not real-user (field) data, and fonts were mocked, so re-run on a deployed preview.

| | Before | After |
|---|---|---|
| Mobile performance | 81 (later runs 76-83) | 86, 87, 86 |
| Mobile LCP / TBT / CLS | 2.6 s / 610 ms / 0 | 2.4-2.5 s / 420-460 ms / 0 |
| Desktop performance | 100 | 100 |
| Accessibility (mobile + desktop) | 95 | 100 |
| Best practices / SEO | 100 / 100 | 100 / 100 |

## What changed
- `Reveal` has an `immediate` mode (CSS-only entrance) used for the hero: content is in the first paint, visible with JavaScript disabled, and instant under `prefers-reduced-motion`. Previously every reveal started at `opacity: 0` in the server HTML and waited for hydration.
- Removed `backdrop-blur` from static cards sitting on near-solid backgrounds (no visible effect). No measurable score change; kept because it is harmless.
- Footer text contrast raised (11px text was 3.9:1); false "all verified facts" footer sentence replaced with a plain copyright line.
- Heading order fixed (category labels and timeline titles in Skills & Experience are now h3 under the section h2).

## Not done / limits
- Mobile TBT is still ~430 ms in the lab. Main-thread time is dominated by non-script work in this software-rendered sandbox, so further tuning needs a real device or a deployed Vercel preview.
- Automated checks catch only part of accessibility problems. A screen-reader pass (NVDA/VoiceOver) and keyboard walkthrough have not been done.

---

# Phase 6 addendum - mobile performance work (honest measurement notes)

**Target "100/100 mobile" was NOT verified.** The sandbox has a single CPU core that must run the Next.js server, Chrome and Lighthouse at the same time. Identical code scored 86-87 in one session and 69-78 in another (the phase 5 source was re-measured as a control), and desktop scored 100 in one run and 79 in another. Lab scores here therefore swing by 10+ points for reasons unrelated to the code. Treat the earlier before/after numbers in this file as indicative only.

Measure for real: deploy to Vercel, then run https://pagespeed.web.dev on the preview URL (Google's servers, not this sandbox), 3-5 runs, and use the median.

## Changes made (judged by deterministic measures, not by noisy scores)
| Change | Evidence |
|---|---|
| Hero h1 + intro paragraph (the LCP element) no longer sit inside a fade-in animation | Lighthouse showed 1.26 s of the LCP as "element render delay"; TTFB was only 49 ms |
| `experimental.inlineCss` | render-blocking stylesheet requests: 2 -> 0 |
| Chat, cookie notice and back-to-top load after hydration (`components/LazyWidgets.tsx`) | removes the 482-line chat component from the initial bundle |
| Capabilities, Education, SkillsExperience are now server components | route JS 29.1 kB -> 27.5 kB, first-load 132 kB -> 130 kB |
| Cookie notice no longer covers the chat launcher on phones | found by an automated tap test; fixed and re-tested at 280, 375 and 412 px |

Median mobile score in the same sandbox window: 74 (control, phase 5 source) -> 78 (final source, 4 runs). Treat any difference as within noise.

## If PageSpeed Insights still shows < 90 on mobile, the next levers are
1. Replace Lenis smooth-scroll (extra JS + a permanent animation loop) with native scroll.
2. Split About, Projects, AIIntro and Footer so only their small interactive parts are client components (their analytics click handlers currently force the whole component client-side).
3. Self-host a single Inter variable font subset and preload it.
4. Reduce total hydrated DOM (accordion/"show more" for long sections).

---

# Phase 7 addendum - less JavaScript, native scrolling

Deterministic measures (these do not drift with sandbox load):

| Metric | Original | Phase 6 | Phase 7 |
|---|---|---|---|
| Home route JS | 29.5 kB | 25.5 kB | **18.9 kB** |
| First-load JS | 132 kB | 128 kB | **121 kB** |
| Render-blocking requests | 2 | 0 | 0 |
| Total page weight (Lighthouse) | - | - | 182 KiB |

Changes:
- **Lenis removed** (dependency uninstalled, `package.json`/lockfile updated). `SmoothScrollProvider` is now ~60 lines of native `scrollTo({behavior:"smooth"})` with the same `useSmoothScroll().scrollTo` API, a 76px sticky-header offset, and instant jumps under `prefers-reduced-motion`. There is no permanent requestAnimationFrame loop any more.
- **About and AIIntro are server components.** Their analytics links and "open chat" buttons moved into two tiny client islands: `components/ui/TrackedLink.tsx` and `components/ui/OpenChatButton.tsx`.
- **Back-to-top moved to the right (above the chat launcher)** because the cookie notice covered it at bottom-left. An automated check confirms no fixed control (chat launcher, back-to-top, cookie "Got it", menu button) is covered at 280, 375, 412 and 1440 px.

Lab Lighthouse mobile in this sandbox, 4 runs: 82, 86, 81, 83 (median 82). LCP about 2.6 s, TBT 430-630 ms. As noted above these scores are noisy; the real check is PageSpeed Insights on the deployed URL.

Still not done: self-hosted font subset, splitting Projects (needs client state for its filter) and Footer (uses scroll context), collapsing long sections.


---

# Correction (2026-10-04) - what was actually measured

From phase 4 to phase 11 the test build contained a **placeholder portrait image** (a grey rectangle added only to exercise the portrait slot) that the delivered zips do not contain, so the hero had an extra column in every measurement. Source files were compared before each delivery, but `public/` was not. On 2026-10-04 the audits were redone against a build whose `public/` is identical to the zip:
- 16-viewport audit: no overflow, no console errors, one h1 (the hidden skip link is the only "small target").
- axe-core, 15 states: 0 violations. Keyboard walk: 86 tab stops, all with visible focus.
- Device matrix: 46 of 46 viewport sets pass.
- Lighthouse mobile, 3 runs: performance 85 / 80 / 87, accessibility 100, best practices 100, SEO 100; LCP 2.6 s, TBT 390-640 ms, CLS 0, page weight 182 KiB. (Lab, noisy sandbox: use PageSpeed Insights on the deployed site.)
