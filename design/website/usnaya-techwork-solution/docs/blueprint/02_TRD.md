# Technical Requirements

## Preferred stack for a new project

React + TypeScript + Vite; Three.js + React Three Fiber + Drei; Zustand
for local shared UI state; XState or a typed explicit state machine;
GSAP or dedicated camera controller; Blender and GLB/GLTF assets;
optional Node.js/TypeScript backend for AI; Vitest and Playwright where
feasible.

**If an existing repository is present, inspect and reuse its healthy
stack. Do not add duplicate frameworks or state managers.**

## Runtime requirements

-   One primary 3D canvas; ordinary dialogue/menu UI stays in accessible
    HTML/CSS.
-   Cap renderer pixel ratio; use adaptive quality.
-   Prefer baked lighting for static geometry; limit dynamic shadows.
-   Reuse materials and repeated furniture; compress textures/geometry
    when supported.
-   Dispose of owned GPU resources, subscriptions and event listeners.
-   Waypoints first; navmesh only if required by the blockout.
-   Async requests need timeout/cancellation/stale-response guards.

## Controls

Suggested desktop defaults: WASD/arrows to move, mouse for camera/look,
E or click to interact, Esc to close/pause. Display controls and avoid
conflicts while a blocking dialogue is active.

## Asset loading

Use an asset manifest with ID, path, type, required/optional flag,
source and licence. Load entrance/reception/player/receptionist first;
progressively load other spaces. Failed optional assets should not crash
the experience.

## AI service

Validate input length and IDs, rate-limit, use server-side credentials,
validate output against a strict schema, allow-list actions, and provide
timeout/offline fallback. Never execute model text as code.

## Quality gates

Use the actual repo scripts. Run lint, typecheck, unit tests, build,
desktop browser smoke test, destination-cancellation test, missing-asset
test, AI-timeout test where AI is configured, and a
frame-rate/asset-size check.
