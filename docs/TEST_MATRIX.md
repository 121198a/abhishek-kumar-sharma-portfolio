# Responsive device test matrix

Date: 2026-10-03; fully re-run 2026-10-04 against the build exactly as shipped (no portrait, no video) - 46 of 46 still pass. Tool: headless Chromium (Playwright) against the production build.

**What this is:** each device from the project brief was emulated by its approximate CSS viewport size. For every one, three pages were loaded: home (portrait), home (landscape = width and height swapped) and a case-study page (portrait). A device "passes" only if all three have: no horizontal overflow, no element extending past the right edge, no interactive element smaller than 24x24 CSS px, exactly one `<h1>`, and no console/page errors.

**What this is NOT:** real hardware testing. Viewport sizes are approximate values from common device presets and published specs (foldable sizes especially), not measured. It does not exercise iOS Safari (address-bar resizing, safe areas/notch, 100vh behaviour), Samsung Internet, or the Facebook in-app browser on Android, which was not tested at all. Re-check on real devices or BrowserStack/Sauce free trials before claiming device support.

**Result: 46 of 46 viewport sets pass all checks.**

| Device (approx. CSS viewport) | Size (w x h) | Result |
|---|---|---|
| JioPhone 2 | 240x320 | pass |
| Moto G4 | 360x640 | pass |
| Moto G Power | 412x892 | pass |
| iPhone SE | 375x667 | pass |
| iPhone XR | 414x896 | pass |
| iPhone 12 Pro | 390x844 | pass |
| iPhone 14 | 390x844 | pass |
| iPhone 14 Plus | 428x926 | pass |
| iPhone 14 Pro | 393x852 | pass |
| iPhone 14 Pro Max | 430x932 | pass |
| iPhone 15 | 393x852 | pass |
| iPhone 15 Plus | 430x932 | pass |
| iPhone 15 Pro | 393x852 | pass |
| iPhone 15 Pro Max | 430x932 | pass |
| iPhone 16e | 390x844 | pass |
| iPhone 16 | 393x852 | pass |
| iPhone 16 Plus | 430x932 | pass |
| iPhone 16 Pro | 402x874 | pass |
| iPhone 16 Pro Max | 440x956 | pass |
| Pixel 7 | 412x915 | pass |
| Pixel 8 | 412x915 | pass |
| Pixel 8 Pro | 448x998 | pass |
| Pixel 9 | 412x923 | pass |
| Pixel 9 Pro | 412x923 | pass |
| Pixel 9 Pro XL | 448x998 | pass |
| Pixel 10 | 412x923 | pass |
| Galaxy A55 | 412x915 | pass |
| Galaxy S8+ | 360x740 | pass |
| Galaxy S20 Ultra | 412x915 | pass |
| Galaxy A51/A71 | 412x914 | pass |
| Surface Duo | 540x720 | pass |
| Pixel 9 Pro Fold (outer) | 408x918 | pass |
| Pixel 9 Pro Fold (inner) | 841x701 | pass |
| Galaxy Z Fold 5 (folded) | 344x882 | pass |
| Galaxy Z Fold 5 (unfolded) | 882x1104 | pass |
| Galaxy Z Fold 6 (folded) | 360x882 | pass |
| Galaxy Z Fold 6 (unfolded) | 884x1104 | pass |
| Asus Zenbook Fold | 1280x960 | pass |
| Galaxy Tab S4 | 712x1138 | pass |
| iPad Mini | 768x1024 | pass |
| iPad Pro 13 | 1032x1376 | pass |
| Surface Pro 10 | 912x1368 | pass |
| Surface Pro 7 | 912x1368 | pass |
| Laptop 1440 | 1440x900 | pass |
| Desktop 1920 | 1920x1080 | pass |
| Large desktop 2560 | 2560x1440 | pass |

## Viewport classes covered
Very small mobile (240-360 px), small mobile (375-390), modern mobile (393-414), large mobile (428-448), foldable folded and unfolded (344-884), small tablet (712-768), large tablet / Surface (912-1032), laptop (1280-1440), desktop (1920), large desktop (2560).

## Not covered
Facebook in-app browser on Android; real iOS Safari; text-size/zoom settings (200% browser zoom); high-contrast mode; screen readers; slow real networks.
