# Phases 4-13 Report

Method: the repository already held earlier work for characters, navigation, chat, voice, tour and security. Each phase was audited against the master prompt, gaps were fixed, and results were measured. Items not done are listed as not done.

## Phase 4 - Characters
- State: six named people (Umesh, Abhishek, Priya, Ankita, Bhavishya, Dravya Sharma) are original procedural figures with an articulated rig (`src/characters/Person.tsx`), role-based outfits, hair, accessories and per-character scale; name tags and titles shown. Only Umesh (Managing Director) and Abhishek (Head of IT) have supplied titles; the others show "Title to be confirmed" on purpose (no invented roles). `data.test.ts` checks names/roles.
- Phase 3 aligned every seated character to its chair.
- No licensed external models were used (none available; see ASSETS_AND_LICENSES.md). Limitation: stylised, not photoreal.

## Phase 5 - Animation, navigation, camera
- State: waypoint navigation graph with wall/furniture collision, stall detection, re-routing and snap-to-destination recovery; camera rig with orbit, zoom, follow, free explore and touch controls.
- Added `src/tests/movement.test.ts`: the real state machine and simulation visit every destination repeatedly (several laps of the full site) and require arrival, an interactive app afterwards and no position inside a wall or furniture; invalid and duplicate destinations leave the app usable; a 10-minute soak checks no character enters a blocker or leaves the site, no teleport jumps, no endless walking.
- Browser E2E travels to all 11 directory destinations and confirms the app is interactive again after each.

## Phase 6 - Office activity
- State: behaviour cycles for working/typing, meeting, kitchen, patrol, visitor arrival, greeting (`WorldSimulation.ts`). The soak test above covers stability. Not measured: subjective "believability", which needs a human.

## Phase 7 - Chat
- State: shared pathway for suggested and typed questions (`DialoguePanel` -> `ConversationApi` -> `/api/conversations/message`), allow-listed actions, retry, fallback text, honest error bubbles.
- Added `src/tests/chat.test.ts` against the real Express app over a real socket: real answer, navigate action, one retry then success, persistent failure -> clear fallback (never a fake answer), 400 not retried, empty/aborted input. Authored Bhavishya conversation: exact greeting, the four suggested questions, continuation, close and reopen.
- Browser E2E: typed question answered; injected HTTP 500 -> error bubble -> Retry succeeds.
- Provider default is the local knowledge base. An external AI provider was not exercised (no key supplied).

## Phase 8 - Voice
- Cause of "silent audio" risk: the old manager reported nothing when the browser refused or never started speech, and offered only a toggle.
- Rewrote `VoiceManager`: status (`unsupported/idle/loading/speaking/paused/blocked/error`), explicit Play/Pause/Resume/Stop, 2.5 s start watchdog -> "blocked" with a visible message, stale-event protection when replies replace each other, stop on close/character change, respects the Sound-off and volume settings, never relies on autoplay (speech starts from a user click or reply to one). The talking animation follows real `speaking` state only. No lip-sync is claimed.
- `src/tests/voice.test.ts` (8 tests) drives the real manager with a scripted speech engine: success, pause/resume, blocked, not-allowed, error, interruption, stop, muted, unsupported.
- Not verified: audible output (headless Chromium has no speech voices and no speakers). A person must listen on real browsers.

## Phase 9 - Rooms and tours
- State: clickable people, Directory, Team panel, 11-stop guided tour (Next/Previous/Exit), manager door sequence, gate toggle. Browser E2E exercises tour Next/Previous/Exit and the directory. Every stop is a real destination (tests in `data.test.ts`).

## Phase 10 - VR
- Not implemented. See `VR_DECISION.md`. No VR control is shown.

## Phase 11 - Security, privacy, accessibility
- See `SECURITY_AUDIT.md`. Fix: production Content-Security-Policy added and verified.

## Phase 12 - Performance and QA
- Automated: see TEST_RESULTS.md. Production build sizes: `r3f` 1,206.79 kB (335.18 kB gzip), `Scene` 86.02 kB (23.52 kB gzip), `index` 126.41 kB (39.48 kB gzip), CSS 18.68 kB. No image, model or audio files, so no asset compression is needed.
- Draw calls: interior meshes are merged (`Baked`); measured about 2,130 before Phase 3 and about 1,100-2,070 after, depending on view, with triangles 172K-264K. Measured on a software renderer: **real-GPU frame rate, memory over long sessions and phone performance were not measured.**
- Chat latency: about 3 ms server time locally for the local provider (server log); real network latency not measured.
- Mobile: layout checked at 390x844 for horizontal overflow and panel bounds; not tested on a physical phone.

## Phase 13 - Release
- See `RELEASE.md`.

## Known issues
- A React dev-mode warning ("Attempted to synchronously unmount a root...") comes from the drei `<Html>` labels under StrictMode. It appears identically in the pre-Phase-3 code (37 occurrences at load), is not emitted by production builds, and was left alone.
- E2E timing is slow under software rendering, so the script uses long timeouts.
