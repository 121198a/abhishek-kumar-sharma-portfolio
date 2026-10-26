# Phase 10: Optional VR - Decision

Status: **not implemented.**

Feasibility: the engine (three.js with React Three Fiber) supports WebXR through `@react-three/xr`, so a future implementation is realistic.

Why it was not built: the phase requires testing on compatible hardware, and none was available. The master prompt says an immersive mode must not be shipped on the strength of a desktop simulation. A VR button, teleport and controller picking added untested would be a nonfunctional control, which the engineering rules forbid. No VR control is shown anywhere in the UI.

What a future VR phase needs: a WebXR headset (e.g. Meta Quest browser) for testing; a new dependency (`@react-three/xr`, MIT) needing owner approval; headset-height camera and 1:1 scale (the world is already in metres); teleport restricted to the navigation graph (`src/navigation/graph.ts`) and wall collision (`src/world/walls.ts`); the DOM-based HUD and chat would need in-world panels; the many drei `<Html>` labels do not render in an XR session.

The standard desktop and mobile experience is unaffected.
