# Architecture Decisions

## ADR-001 --- Desktop first

**Status:** Accepted. Ship a desktop/laptop vertical slice first; mobile
optimization follows acceptance.

## ADR-002 --- Guided + free navigation

**Status:** Accepted. Both modes use one Experience Director and shared
navigation system.

## ADR-003 --- Authored + AI dialogue

**Status:** Accepted. Authored dialogue is baseline; optional AI runs
through a secure backend using approved company knowledge.

## ADR-004 --- Data-driven character runtime

**Status:** Accepted. Shared controller/animation interfaces;
role-specific models, routes and conversations are configuration.

## ADR-005 --- Waypoints before navmesh

**Status:** Accepted for MVP. Reassess after the office blockout.

## ADR-006 --- No scraping or AdMob

**Status:** Accepted. Neither is required by the core corporate
experience.

## ADR-007 --- No database by default

**Status:** Accepted. Add persistence only for an approved product
requirement.

## ADR-008 --- Existing repository wins

**Status:** Accepted. Inspect and reuse healthy existing architecture
rather than replacing it blindly.

## ADR-009 --- Dual process orchestration & Voice Architecture

**Status:** Accepted.
1. Run concurrent or proxy orchestration so client dev (`vite` :5173) and backend API (`server` :8787) start together, resolving the unavailable assistant bug.
2. Web Speech API (SpeechSynthesis and SpeechRecognition) will be integrated directly into DialogueManager and DialoguePanel with browser support detection and graceful audio fallback.
3. 3D Camera Rig will be re-tuned to third-person eye-level perspective (offset ~3-5m, height 1.8-2.2m) instead of high-altitude isometric view (~15-78m).
4. Procedural office will be upgraded towards the reference architecture (carpet texture zoning, glass pod partitions, acoustic desk screens, biophilic plants, and ergonomic task furniture).
