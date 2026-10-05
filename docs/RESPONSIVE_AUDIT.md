# Responsive audit - Phase 3

Method: production build served locally, loaded in headless Chromium 141 (Playwright) at 16 viewport sizes, scrolled end to end. Checks: horizontal overflow (scrollWidth > viewport), off-screen elements, interactive elements under 24x24 CSS px, console/page errors, images without `alt`, `<h1>` count. Real-device Safari/iOS behavior (address bar, safe areas, notches) is NOT covered by this method.

Viewports: 240x320 (JioPhone 2 class), 280x653 (Galaxy Fold folded), 360x640 (Moto G4), 375x667 (iPhone SE), 390x844 (iPhone 14), 430x932 (14 Pro Max), 412x915 (Pixel 7 / S20 Ultra), 540x720 (Surface Duo), 882x1104 (Z Fold unfolded), 768x1024 (iPad Mini), 912x1368 (Surface Pro 7), 1032x1376 (iPad Pro 13), 1440x900, 1920x1080, 667x375 (landscape).

## Before -> after
| Issue | Before | After |
|---|---|---|
| Horizontal overflow at <=280px (section headings "Implementations", "Qualifications") | 2 viewports failed (scrollWidth 349) | 0 |
| Interactive elements under 24px tall (text links in hero, nav drawer, projects, footer) | 20-22 per viewport | 0 |
| Console errors / missing alt / h1 count | 0 / 0 / 1 | 0 / 0 / 1 |

Fixes: fluid heading minimums plus `break-words` (Hero, SectionHeading, About); `min-h-11` (44px) on text links.

## Known, not fixed
- The cookie banner covers the hero buttons on first load at 375x667 and smaller.
- The 24px check is the WCAG 2.2 minimum; 44px was applied where changed, but other controls were only checked against 24px.
- Fonts were mocked in the sandbox build, so text widths use the fallback font. Re-check heading wrap with real Inter on a deployed preview.
