# USNAYA Techworks Solution 3D Project: Interactive 3D Virtual Office

> Latest: exterior upgrade (gate, security, parking, driveway, landscaping), six named characters, orbit/tour. See `docs/UPGRADE_REPORT.md` for what is done, unverified and not done.

A desktop-first, browser-based guided 3D office. A visitor enters, walks to reception, talks to a receptionist, picks a department, is led there, talks to colleagues through a pop-up dialogue panel (authored choices plus an optional typed-question assistant), explores freely, and can knock on the manager's door.

Stack: React 19, TypeScript, Vite, Three.js with React Three Fiber and Drei, XState (the "Experience Director"), Zustand, Node + Express (assistant API).

## Run it
```bash
npm install
npm run dev            # http://localhost:5173
npm run dev:server     # second terminal, optional: the typed-question assistant on :8787
npm test               # 62 tests
npm run lint && npm run typecheck && npm run build
```
Copy `.env.example` to `.env` for the server. The default `AI_PROVIDER=local` needs no key.

## How to use the office
Press **Enter the office**. After the walk to reception, choose a destination in the dialogue. Use **Directory** any time, **Guided tour / Free explore** to switch modes, **WASD or arrow keys** to walk, **E** to talk, knock, or operate the vehicle gate, **Orbit view** to rotate 360 degrees, **Start the full tour** in the Directory, **Esc** to pause.

## Architecture (short)
- `src/experience/`: the Director, a typed state machine. It owns progression. Everything talks to it through typed events.
- `src/engine/WorldSimulation.ts`: movement, guide-follows-visitor, collision, nearby detection. Rendering-free, so it is tested headlessly.
- `src/data/`: all content as typed config (zones, nav graph, destinations, characters). Add a character or room by editing data.
- `src/dialogue/`: conversation graphs plus a validator that runs in tests.
- `src/world/`, `src/characters/`: the 3D scene. People and furniture are primitive-built placeholders.
- `server/`: validated, rate-limited, capped conversation API. AI output is untrusted: schema-checked, actions allow-listed, never executed.
- `docs/`: the original blueprint pack, project brief, guardrails and step prompts.

## Status (honest)
Verified here: TypeScript, ESLint, production build, 62 automated tests (data integrity, graph and wall checks, dialogue validator, state machine, a headless run of the full journey including guide-follow, door sequence and collision, and the API including rate limit, daily cap, timeout and action allow-list), and the API and dev server answered real requests.

**Not verified: how it looks.** No browser was available where this was built, so the 3D scene was never rendered or visually checked. Expect to adjust camera framing, colours, label sizes, and character proportions after your first look. Not tested: Safari/Firefox/Edge, frame rate on any device, touch input, the Anthropic provider against the live API.

## What is placeholder
- Characters and furniture are simple shapes, not rigged models. This is the biggest gap to the "premium realistic" goal. Replace them with licensed GLB assets (docs/steps/step-11.md) and record licences.
- All dialogue is neutral demo wording flagged `status: "placeholder"`. Character names are role labels.
- `server/knowledge/companyKnowledge.ts` is empty on purpose. The assistant never states company facts you have not approved there.
- Colours and fonts (Familjen Grotesk, Instrument Sans, loaded locally) are proposed defaults in `src/styles/tokens.css`.
- Sounds are synthesised (no audio files) so there is no licensing question. Howler and GSAP from the plan are not used.

## Before going public (docs/21_LAUNCH_READINESS.md)
Privacy Policy and Terms (need your input and legal review), real contact details, Open Graph image, sitemap, security headers and CSP at your host, HTTPS, monitoring, a provider-side spending cap if you enable an external AI provider, and mobile optimisation (not started: no touch controls yet).
