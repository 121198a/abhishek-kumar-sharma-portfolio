# Changelog

## Unreleased --- Blueprint

-   Added PRD, TRD, architecture, data model, source governance, API,
    UI, error handling, security, CI, testing, production checklist and
    one-week microtasks.
-   Marked scraping and AdMob out of MVP.
-   This package documents the plan; it does not mean the application
    has been implemented or tested.

## Master enhancement (exterior, six named characters, orbit, tour)
- Added compound, sliding vehicle gate (interactive), pedestrian entry, guard cabin, driveways, car/visitor/accessible/two-wheeler parking, paths, landscaping, lamps, facade pilasters and entrance canopy.
- Replaced roster with six named characters (two verified titles, four "Title to be confirmed") plus unnamed extras.
- Added orbit view, fullscreen, 11-stop guided tour, interior equipment props.
- Tests: 50 -> 62. No browser verification.

## Phase 0 — Source Code Audit and Baseline
- Audited complete project stack: React 19, Vite 8, Three.js 0.186, React Three Fiber 9.8, Express 5 backend.
- Initialized Git baseline repository and created branch `feature/virtual-office-upgrade`.
- Reproduced and documented all 8 reported bug classes with confirmed root causes.
- Executed and validated all baseline test suites (62/62 tests passing, typecheck clean, lint clean).
- Produced dependency map, bug register, asset inventory, baseline metrics, rollback plan, and Phase 1 roadmap.

## Phase 2 — Professional Employee Characters
- Engineered a high-detail procedural humanoid character mesh rig in `Person.tsx` replacing bare primitive capsules:
  - Anatomical head sculpt with defined jawline, nose bridge, ears, eyes (sclera + iris), eyebrows, and styled hair.
  - Segmented articulated limbs: thighs, articulating knee joints, calves, and leather oxford shoes with soles; shoulders, upper arms, elbows, forearms with shirt cuff reveals, and detailed hands.
  - Tailored business attire: notch lapels, button detailing, pocket squares, collared shirts, silk ties, belts with metal buckles, and corporate ID lanyards with badges.
  - Ground contact shadow decals underneath character feet for natural grounding.
- Configured visual styling and role presentation for all six named employees in `characters.ts`:
  1. Umesh Sharma — Managing Director: executive navy tailored suit, silk golden tie, titanium glasses, and classic hair in executive cabin.
  2. Abhishek Sharma — Head of IT Department: tech-lead tailored blazer, designer glasses, at IT workstation.
  3. Priya Sharma: polished emerald corporate blazer, ID lanyard, guiding visitors at Reception.
  4. Ankita Sharma: deep plum structured blazer, ivory blouse, chignon updo, and executive tablet in Conference Hall.
  5. Bhavishya Sharma: smart navy knit blazer and ceramic coffee mug in Cafeteria/Kitchen.
  6. Dravya Sharma: contemporary taupe blazer and digital tablet in Visitor Waiting Lounge.
- Enhanced natural animation kinematics in `Person.tsx`:
  - Idle breathing expansion on chest and subtle organic weight shifts.
  - Stride mechanics with hip pitch and knee flexion during walk cycles.
  - Desk typing motions with forearms resting at desk height and fingers moving across keyboards.
  - Conversational head nods and expressive gesturing during dialogue.
  - Greeting wave acknowledging visitors within proximity.
- Upgraded `WorldSimulation.ts` patrol behavior to prevent characters getting permanently paused by nearby visitors.
- Styled character name tags in `app.css` with frosted glass backdrop blur and crisp typography.
- Verified 62/62 automated tests passing, clean TypeScript typecheck, clean linting, and interactive browser verification.

## Phase 3 — Reliable Navigation, Obstacle Recovery, Camera and Controls
- Built a 7-step robust navigation pipeline in `WorldSimulation.ts`:
  1. Valid destination selection via directory or character selection.
  2. Reachable path calculation using Dijkstra shortest path on waypoint graph.
  3. Progress tracking along waypoints at calculated speeds.
  4. Stall detection: monitors unexpected stoppage ($> 2.2$s) during travel.
  5. Automatic obstacle recovery: recalculates path around obstruction using `routeFrom()`.
  6. Clean fallback to safe idle state after 4.5s without infinite loops, repeated teleportation, or wall walking.
  7. Non-blocking user toast notifications informing if a requested location is obstructed or rerouting.
- Integrated direct 3D character tap/click selection in `Characters.tsx` and `Person.tsx`: clicking any character opens dialogue if within range, or approaches them smoothly if distant.
- Built on-screen mobile touch D-Pad controls in `Hud.tsx` and `useInput.ts` with dedicated forward, backward, left, right buttons and frosted glass styling.
- Upgraded `OrbitControls` in `Scene.tsx` with dynamic target tracking, bounded distances (2.5m - 65m) and polar angle clamping to prevent clipping through floor and geometry.
- Verified all 62 automated tests passing, clean TypeScript check, clean lint, and production build.

## Phase 4 — Working Chat, Dialogue and Voice
- Diagnosed and resolved the root cause of "The assistant isn't available right now":
  - Mounted the Express conversation API directly in Vite dev middleware via `vite.config.ts`, ensuring `/api/conversations/message` is always available in development without external proxy failure.
  - Populated verified office knowledge in `server/knowledge/companyKnowledge.ts` covering office overview, IT infrastructure, management, break area facilities, conference hall, and parking.
- Built a unified conversational chat interface in `DialoguePanel.tsx`:
  - Chronological message transcript feed with employee avatar, title, speech timestamps, and distinct message bubbles.
  - Preset question options and custom typed questions process through the same unified conversation feed.
  - Auto-scrolling to the latest message on new responses.
  - Duplicate submission protection, character counter, and loading state on Send button.
  - Clear, recoverable error state with a working "Retry question" action.
- Added comprehensive break area questions for Bhavishya Sharma in `dialogue/conversations/index.ts`:
  - "Hello, I'm Bhavishya. Welcome to the break area. Can I get you a coffee?"
  - Questions: "Do people eat lunch here?", "What can I find in the break area?", "Can you tell me about this office?", and "Thank you, that's all."
- Integrated full Web Speech API voice synthesis in `VoiceManager.ts`:
  - Natural English voice selection tailored for male and female characters.
  - In-dialogue voice playback controls with audio speaking indicator ("🔊 Speaking…").
  - Clean utterance termination on character switch or dialogue closure.
  - Synchronized character speaking animation (`c.anim = "talk"`) with voice playback state.
- Verified 62/62 client unit tests, 11/11 server integration tests, clean ESLint, clean TypeScript typecheck, and production build.

## Phase 5 — Office Population and Realistic Activity
- Populated empty functional areas with purposeful role-based employees and visitors in `characters.ts`:
  - `kitchen-colleague`: Team member seated at the cafeteria dining table enjoying a meal and coffee break.
  - `sales-rep`: Sales specialist working at the secondary Sales workstation.
  - `reception-visitor`: Visiting guest seated comfortably on the Reception lobby lounge sofa reviewing a tablet.
- Implemented lightweight behavior scheduling in `WorldSimulation.ts`:
  - **Collaborative Meeting Discussions:** Conference room members (`ankita`, `meeting-attendee-1`, `meeting-attendee-2`) smoothly take turns presenting with hand gestures (`talk`) while others listen attentively (`sit`).
  - **Natural Workstation Typing Rhythms:** Developers and sales reps alternate between 13s of active keyboard typing (`type`) and 5s of reviewing monitors / resting hands (`sit`), eliminating robotic perpetual loops.
  - **Break Area Activity:** Bhavishya Sharma patrols and welcomes guests while colleagues take lunch breaks at dining tables.
  - **Reception & Lounge:** Guests sit naturally in armchairs, and Priya Sharma actively guides and greets visitors.
- Validated performance: lightweight time-based phase cycling without per-frame pathfinding overhead.
- Passed 62/62 client tests, 11/11 server tests, clean ESLint, and production build.

## Phase 6 — Premium User Experience and Visual Polish
- Polished the corporate design system in `tokens.css` and `app.css`:
  - Consistent typography using `Familjen Grotesk` (display) and `Instrument Sans` (text).
  - Restrained shadows, architectural neutral surfaces, and WCAG AA+ high contrast.
  - Visible keyboard focus rings (`:focus-visible` with corporate brass accent outline).
- Built interactive guided tour controller (`TourBanner` in `Hud.tsx`, `tourStore.ts`):
  - Stop indicator (`Stop X of 11`), stop title, and concise objective description.
  - Working `◀ Prev`, `Next ▶`, and `✕ Exit` controls.
  - Automatic guided progression synchronized with the ExperienceDirector.
- Enhanced responsive mobile experience:
  - Dialogue panel adapts cleanly to mobile screens (`width: calc(100% - 16px)`, `bottom: 8px`), keeping chat input accessible.
  - Touch D-Pad buttons meet mobile accessibility touch target standards ($\ge 44$px).
  - Tour controller stacks cleanly on small viewports without obscuring 3D interactions.
  - Ensured reliable loading fallback in `Scene.tsx` preventing stuck 0% progress screens.
- Verified 62/62 client unit tests, 11/11 server tests, clean ESLint, clean TypeScript check, and production build.

## Phase 7 — Security, Privacy and Asset Management
- Executed comprehensive security and privacy audit:
  - Secrets & Credentials: Zero hardcoded secrets, `.env` git-ignored, server-only secret usage.
  - Vulnerability Scan: `npm audit` returned 0 vulnerabilities.
  - Security Headers: Added `X-Frame-Options: SAMEORIGIN` and `Referrer-Policy: strict-origin-when-cross-origin` to Express backend alongside existing `X-Content-Type-Options: nosniff` and `Cache-Control: no-store`.
  - Input Validation & Rate Limiting: Verified Zod schema validation, 4kb JSON body limit, 300-char message limit, 20 req/min client rate limit, and 500 req/day cap.
  - Authorization Boundaries: Action allowlisting strictly limits navigation targets to configured `DESTINATION_IDS`; unauthorized actions dropped to null.
  - Privacy & Data Governance: Zero conversation or voice recordings stored, no analytics trackers, no database persistence.
  - Asset Governance: 100% procedural 3D models and local OFL-licensed fonts.
- All 62 client tests, 11 server tests, clean ESLint, and production build verified.

## Master Transformation Discovery & Safe Baseline
- Completed full project discovery and safe baseline audit for the Complete Virtual Office Transformation:
  - Architecture and dependency map established across React 19, R3F, XState Director, and Express 5 backend.
  - Full existing feature inventory documented across 11 destinations, 6 named characters, voice engine, and touch controls.
  - Asset and licensing inventory compiled: 100% procedural 3D geometries, OFL fonts, 0 external copyright encumbrances.
  - Reproducible bug register and confirmed root causes documented.
  - Performance baseline measured (bundle sizes, draw calls, memory, and FPS targets).
  - Security and privacy audit confirmed (zero vulnerabilities, zero stored personal chats, strict security headers).
  - Created Git checkpoint on `feature/virtual-office-upgrade` preserving all work.









## Project rename and cleanup
- Project title changed to "USNAYA Techworks Solution 3D Project" (package name, README, AGENTS, index.html title/OG, welcome and loading screens via `src/data/project.ts`, `.env.example`, blueprint headings). The in-world company brand "USNAYA Techworks Solutions" (signage, dialogue, knowledge base, AI prompt) is intentionally unchanged.
- Fixed unused `destinations` import in `Hud.tsx` that failed `tsc`, `eslint` and `npm run build`.
- `Hud.tsx`: single `INTERACTIVE_STATES` list, shared `PanelHead`, data-driven touch D-pad, merged imports, plain-text tour button labels. No behaviour change.
- Checks: tsc clean, eslint clean, vitest 62/62, `npm run build` passes, `npm audit --omit=dev` 0 vulnerabilities. Not run: any browser/visual check.

## Phase 3 - realistic interior architecture
- Every room furnished with procedural props (new `src/world/props/*`, `materials.ts`, `textures.ts`): reception brand wall and desk, open-plan workstations with monitors/peripherals/cable trays, IT racks, MD office, conference, lounge and kitchen with coffee station, fridge, microwave, sink.
- Ceiling with downlights, windows in the north wall, door frames and lintels, contact-shadow decals, environment lighting, per-room floor finishes.
- Fixed floating objects (printer, extinguisher, first-aid, wall screens, exit sign, reception sign); seated characters aligned to chairs; corridors and landings furnished.
- Merged static meshes (`Baked`) to cut draw calls. All assets procedural, no third-party licences.
- Tests: `src/tests/interior.test.ts` (13 scene-rule tests). Totals: tsc, eslint clean; vitest 75/75; build OK; audit 0.

## Phases 4-13
- Voice: `VoiceManager` rewritten (status, pause/resume/stop, blocked/unsupported detection, stale-event guard); chat panel shows controls and text fallbacks.
- Production CSP added; security audit, asset/licence record, VR decision, test results and release notes added under `docs/`.
- Tests added: voice (8), chat over a real server (9), movement/soak (3); browser E2E script `scripts/e2e.mjs` (13/13). Totals: vitest 95/95, tsc/eslint clean, build OK, audit 0.
- Phase 10 (VR) not implemented (no hardware to test).

## Bug fix: one active guided task
- `WorldSimulation`: single authoritative task (cancel-then-start), guide owns the route, visitor follows via `src/navigation/follow.ts`, stale arrivals ignored, `sim.trace` + `window.__NAV_DEBUG`. Tests: `taskSwitching.test.ts`. Details: `docs/BUGFIX_TASK_SWITCHING.md`.
