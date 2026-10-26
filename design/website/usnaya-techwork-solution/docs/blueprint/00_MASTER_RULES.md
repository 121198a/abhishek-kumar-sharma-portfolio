# USNAYA Techworks Solution 3D Project --- Master Rules

## Product

Build a premium browser-based interactive 3D office for **USNAYA
Techworks Solutions**. Visual direction: premium realistic architecture
with optimized human characters. Navigation: guided tour plus free
exploration. Conversations: authored dialogue plus optional AI text
chat. Desktop/laptop first; mobile optimization after desktop
acceptance.

## Required spaces

Entrance, reception, IT, HR, Sales, conference/meeting hall, visitor
waiting area, kitchen/break area, manager's cabin.

## Non-negotiable rules

1.  Inspect the existing repository, framework, routes, scripts, API
    integrations, styles, deployment, and git status before editing.
2.  Preserve working functionality. Do not overwrite or redesign the
    whole project without approval.
3.  Build a small end-to-end vertical slice first; expand one phase at a
    time.
4.  Do not invent company services, staff, credentials, policies, APIs,
    test results, or deployment status.
5.  Use licensed/approved 3D models, textures, fonts, animations, and
    audio; track provenance and licence.
6.  Keep AI secrets server-side. Treat user and AI content as untrusted.
    AI cannot directly execute code or manipulate the 3D scene.
7.  Every AI-suggested action must be typed, allow-listed, and
    revalidated by the Experience Director.
8.  Authored dialogue must continue to work when AI is unavailable.
9.  No scraping or AdMob in the MVP; neither is needed for this product.
10. Do not add a database until a real approved persistence requirement
    exists.
11. Add loading, empty, error, retry, and fallback states.
12. Respect keyboard access, readable dialogue, visible focus, reduced
    motion, and audio controls.
13. Run actual checks and report exact results. Never claim unexecuted
    tests passed.
14. After each phase, inspect the diff and update `15_MICROTASKS.md` and
    `16_CHANGELOG.md`. Record material architecture decisions in
    `17_DECISIONS.md`.

## MVP scope

A tested reception-to-IT vertical slice: branded welcome, reception,
visitor movement, receptionist, IT room/character, guided route, limited
free exploration, dialogue choices, camera transitions, loading/error
states, and an AI chat integration only if provider access and approved
company knowledge are available. If not, label the AI integration as a
stub.

## One-week expectation

One week targets a reviewable MVP, not guaranteed fully photorealistic
simulation with all rooms, fully voiced characters, lip-sync, production
AI, and complete mobile support. If behind schedule, reduce visual
detail and ambient NPC count before sacrificing security, reliable
navigation, or testing.

## Definition of done

Acceptance criteria met; checks actually run; no unrelated changes;
errors handled; documentation updated; final report includes changed
files, checks/results, blockers, and next task.
