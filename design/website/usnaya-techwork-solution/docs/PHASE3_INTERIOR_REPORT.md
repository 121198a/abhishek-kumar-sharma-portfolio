# Phase 3 Report - Realistic Interior Architecture

## Files changed
- New: `src/world/textures.ts`, `src/world/materials.ts`, `src/world/props/{shared,workplace,lounge,storage,kitchen,technical,wall,reception}.tsx`, `src/tests/interior.test.ts`.
- Rewritten: `src/world/Props.tsx`, `src/world/OfficeWorld.tsx`, `src/data/departments.ts` (props).
- Modified: `src/data/types.ts`, `src/world/propBoxes.ts`, `src/world/walls.ts`, `src/data/characters.ts` (seat positions), `src/engine/Scene.tsx` (environment lighting).

## Features
Furnished reception, workstations, IT, MD cabin, conference, lounge/kitchen, HR, sales and corridors; per-room floor finishes; procedural wood/fabric/carpet/terrazzo textures; ceiling and downlights; windows; door frames; contact shadows; wall-mounted displays, whiteboards, art, signage.

## Bugs fixed
Floating printer, extinguisher, first-aid, wall screens, exit sign and reception sign; seated characters misaligned with chairs; empty wings; bare door openings.

## Tests run
tsc clean; eslint clean; vitest 75/75 (13 new interior rules: no overlap, in-room, door clearance, seats, wall mounts); `npm run build` OK; `npm audit --omit=dev` 0.

## Assets / licences
All geometry and textures are generated in code. No third-party assets.

## Remaining issues
- Visuals checked only through headless software-rendered screenshots. Real-GPU FPS and mobile not measured.
- Draw calls remain high in exterior/character views; triangle count rose (about 172K-264K).
- In-world brand spelling unchanged (see brief).

## Manual verification
`npm run dev`; visit each room and the overview cameras; check no furniture blocks doors and seated characters sit on chairs; watch FPS on target hardware.

## Rollback
Revert the Phase 3 commit with `git revert <sha>` (or reset to the previous checkpoint ZIP).
