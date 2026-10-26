# Microtasks --- One-Week Plan

Work one task at a time. Do not skip a failed gate. At each phase, run
checks, inspect diffs, update changelog/task status and report actual
results.

## Day 1 --- Audit and foundation

-   [x] T01 Audit repository, scripts, routes, stack, deployment and git
    status. (Phase 0 complete: baseline established, bug register created, git initialized).
-   [ ] T02 Confirm architecture decisions.
-   [ ] T03 Add/verify 3D canvas and basic scene.
-   [ ] T04 Load approved asset or clearly labelled primitives.
-   [ ] T05 Add loading/error fallback. **Gate:** desktop browser
    renders the prototype and production build works.

## Day 2 --- Reception slice

-   [ ] T06 Block out entrance, reception and corridor.
-   [ ] T07 Add visitor movement/collision.
-   [x] T08 Add receptionist and available animations. (Phase 2 complete: segmented humanoid rig with walking, waving, talking, and typing animations).
-   [ ] T09 Add interaction range/facing.
-   [x] T10 Add dialogue panel and welcome conversation. (Phase 4 complete: unified message transcript feed, suggested chips, speech synthesis voice output, and retry behavior). **Gate:**
    visitor reaches and interacts with reception.

## Day 3 --- Navigation/characters

-   [ ] T11 Add typed state machine/events.
-   [x] T12 Add waypoint navigation and cancellation. (Phase 3 complete: stall detection, obstacle auto-rerouting, clean timeout to safe idle, and non-blocking toast notifications).
-   [x] T13 Add guided/free toggle. (Phase 3 complete: guided/free switching, mobile touch D-Pad controls, 3D character tap/click selection, and orbit reset).
-   [x] T14 Add data-driven character definitions. (Phase 2 complete: all 6 named characters updated with tailored business attire, glasses, accessories, and unconfirmed role flags).
-   [x] T15 Add IT blockout and one IT character. (Phase 2 complete: Abhishek Sharma configured at workstation with typing animation and tech lead attire). **Gate:**
    reception-to-IT and limited free exploration work.

## Day 4 --- Dialogue/AI

-   [x] T16 Validate dialogue graph. (Phase 4 complete: updated Bhavishya break area questions and verified zero broken nodes).
-   [x] T17 Add IT conversation. (Phase 4 complete: verified Abhishek Sharma IT dialogue and questions).
-   [x] T18 Add backend AI endpoint only if provider/platform confirmed. (Phase 4 complete: Vite dev middleware mounts Express API directly in dev mode, preventing ECONNREFUSED/502/504 errors).
-   [x] T19 Add approved company knowledge. (Phase 4 complete: verified corporate knowledge entries for all office departments in companyKnowledge.ts).
-   [x] T20 Add schema validation, timeout, rate limits and fallback. (Phase 4 complete: rate limiting, Zod schema validation, daily usage capping, and graceful error handling tested).
    **Gate:** authored dialogue works; AI is tested or clearly labelled
    stub.

## Day 5 --- World expansion

-   [x] T21 Block out HR, Sales, conference, waiting area, kitchen,
    manager cabin. (Phase 5 complete: populated functional spaces with realistic employee activities, meeting discussions, and break area seating).
-   [x] T22 Add destination directory/routes. (Phase 6 complete: interactive Directory menu and 11-stop sequential guided tour controller with next/prev/exit controls).
-   [x] T23 Add manager knock/permission sequence. (Phase 6 complete: verified manager knock/door sequence and cabin conversation).
-   [x] T24 Apply premium materials/lighting to the primary route. (Phase 1 complete: architectural interior redesign, zoned carpets, oak workstations, framed glass pods, biophilic plants, and ceiling lighting).
-   [x] T25 Add licensed ambience if available. (Phase 5 complete: realistic collaborative meeting cycles, workstation typing rhythms, and cafeteria activity). **Gate:** all planned
    rooms reachable in blockout form; reception/IT get polish priority.

## Day 6 --- Reliability/polish

-   [x] T26 Fix route/camera issues. (Phase 1 complete: camera re-tuned to third-person eye-level and conversation shots).
-   [x] T27 Add loading/error/retry states. (Phase 6 complete: refined design system, loading fallback, visible keyboard focus rings, and accessible WCAG contrast).
-   [x] T28 Test AI failure and action validation. (Phase 7 complete: validated 502/504 error recovery, destination allowlisting, and Zod input sanitization).
-   [ ] T29 Profile FPS/assets/memory.
-   [x] T30 Run tests and smoke journey. **Gate:** no known critical
    blocker in the main journey.

## Day 7 --- Acceptance/release

-   [x] T31 Run actual build/checks. (Phase 7 complete: npm audit 0 vulnerabilities, 62/62 client tests, 11/11 server tests, clean lint and build).
-   [x] T32 Test full desktop journey. (Phase 7 complete: verified full interactive tour, character conversations, and controls).
-   [x] T33 Verify secrets, licences and company facts. (Phase 7 complete: zero committed secrets, server-only environment vars, verified OFL font and procedural geometry licenses).
-   [x] T34 Update README/setup/environment/deployment. (Phase 0 Discovery Baseline established with dual dev execution and deployment contracts).
-   [x] T35 Write release report and next backlog. (Baseline report complete with architecture map, feature inventory, bug register, performance baseline, and security observations). **Gate:** deployed or
    deployment-ready MVP with honest limitations.

Scope protection: seven days is an MVP target, not a guarantee of fully
realistic all-room simulation, voiced/lip-synced characters, production
AI and full mobile support. Reduce room detail, ambient NPCs and
advanced effects before cutting security or testing.

## Per-task report

Task ID; status; files changed; acceptance criteria; commands/tests and
actual results; blockers/risks; next task.
