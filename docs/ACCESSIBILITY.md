# Accessibility audit - Phase 11

Date: 2026-10-03. Tools: axe-core (current npm release; rule sets WCAG 2.0/2.1/2.2 A and AA plus best-practice), Lighthouse, and scripted keyboard tests in headless Chromium. **Automated tools find only part of real accessibility problems, and no real screen reader (NVDA, JAWS, VoiceOver, TalkBack) was used.** Treat this as a strong baseline, not a certification.

## Results
| Check | Result |
|---|---|
| axe-core, 12 page states (home at 1440/375/280/768 px, with the "Full Stack" filter selected and with the chat dialog open) | 0 violations |
| Lighthouse accessibility (home, mobile) | 100 |
| Keyboard: 86 tab stops on the home page (one full cycle) | every stop has a visible focus indicator; none hidden or zero-size; no positive `tabindex` |
| Landmarks / language | one `<main>`, one `<nav>`, `lang="en"` |
| Skip link | "Skip to main content" is the first Tab stop, appears on focus, moves focus into `<main>`; next Tab reaches the first control in the page |
| In-page navigation (nav links, anchors) | scroll lands 76 px below the sticky header and keyboard focus moves to the target section |
| Mobile menu | opens with Enter, closes with Escape, focus returns to the menu button |
| Chat assistant | keyboard open moves focus to the message input; Escape closes and returns focus to the launcher; mouse/touch open does NOT steal focus (so the on-screen keyboard does not cover the chat) |
| Reduced motion | hero is visible without JavaScript and instantly under `prefers-reduced-motion`; smooth scroll becomes an instant jump |
| Reflow | no horizontal scroll down to 240 px wide (covers WCAG 1.4.10 reflow at 320 px / 400% zoom) |

## Fixed in this phase
- Skip link added (`app/layout.tsx`), `<main id="main" tabIndex={-1}>`.
- Focus follows in-page anchor navigation (`SmoothScrollProvider`).
- Chat: keyboard focus management described above.
- Secondary text that was set to 60-90% opacity (3.4:1 on cards) now uses the full `text-muted` colour (7:1+): 9 occurrences.
- "(n)" counts on the selected filter chip raised from 4.4:1 to a lighter accent.

- Project filter chips had no explicit focus style and used `transition-all`, so the browser focus outline could animate in from zero width (caught by the 2026-10-04 re-run): now an explicit instant focus ring and a colour-only transition.

## Notes on measuring
- axe must be run with animations finished. Scanning while cards are mid fade-in reports false contrast failures (ratios as low as 1.5:1 on text that is fully legible a moment later). The final scan used `prefers-reduced-motion: reduce`, which makes reveals instant.
- The "interactive element under 24 px" check in `docs/RESPONSIVE_AUDIT.md` counts the skip link (1x1 px while hidden, 197x44 px when focused). That is intended.

## Not tested - do before you call the site accessible
- Real screen readers on desktop and mobile (heading navigation, link lists, reading order of the project cards, the chat dialog announcements - new replies are now inside a labelled `role=log` live region (verified in the DOM, including the 'analyzing' status text), but how real screen readers announce them was not tested).
- 200% browser zoom and user text-spacing overrides; Windows High Contrast / forced-colors mode.
- Voice control and switch access.
- Colour use: the language bar on the GitHub section also has a text legend and an `aria-label`, but a colour-blind check was not done.


---

## Update (2026-10-04, Phase 14)
- Chat conversation is a labelled `role="log"` region (`aria-relevant="additions text"`), keyboard-focusable with a visible focus ring so history can be scrolled; the bouncing dots are `aria-hidden`; the suggested-question chips are `aria-live="off"` so they are not re-announced. Verified in a browser: the reply and the "Analyzing verified knowledge" status appear inside the region, axe reports 0 violations with a conversation open, and the log is reachable with Shift+Tab from the input.
- The site's "Resume" button now serves the verified ATS resume (`public/resume.pdf` = `Abhishek_Kumar_Sharma_Resume.pdf`, 2 pages, single column, selectable text). The previous file had two columns and 8 lines naming Spring Boot / AWS S3 / Lambda that no repository supports.
