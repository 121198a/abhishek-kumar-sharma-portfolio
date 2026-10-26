# Recorded Test Results (final run)

| Check | Command | Result |
|---|---|---|
| Type check | `npx tsc --noEmit` | clean |
| Lint | `npx eslint .` | clean |
| Unit/integration | `npx vitest run` | 9 files, 95/95 passed (data 18, machine 14, navigation 6, simulation 13, interior 13, movement 3, voice 8, chat 9, server 11) |
| Production build | `npm run build` | OK |
| Dependency audit | `npm audit --omit=dev` | 0 vulnerabilities |
| Browser E2E | `node scripts/e2e.mjs` (Chromium, software GL, dev server) | 13/13 passed, 0 unexpected console/page errors |
| Production build under CSP | `vite preview` + Chromium | scene renders, 0 console errors |

E2E steps: welcome load; enter and reach receptionist chat (name, greeting); voice UI/fallback note; typed question answered; injected HTTP 500 -> error bubble -> Retry succeeds; keyboard focus ring; suggested choice -> travel -> IT conversation -> Close; no stale panel; guided tour Next/Previous/Exit; travel to all 11 directory destinations without a stuck state; Escape pause/resume; reduced-motion setting; 390x844 mobile layout without horizontal overflow.

Not tested: real GPU frame rate, long-session memory, physical phones, audible speech, screen readers, WebXR, external AI provider, load with many users. The E2E injects the HTTP failure with a network route; everything else uses the real app and API.
