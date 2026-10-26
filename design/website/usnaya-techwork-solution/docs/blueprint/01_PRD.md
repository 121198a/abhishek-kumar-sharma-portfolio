# Product Requirements Document

## Vision

A connected virtual corporate office where visitors explore departments,
meet human-like characters, and learn approved company information
through guided dialogue and optional AI chat.

## Users

Prospective customers, candidates, partners, and general visitors.

## Journeys

1.  Welcome → reception → choose purpose → guided tour → department
    interaction → continue or finish.
2.  Welcome → free exploration → approach character → interact → resume
    exploration.
3.  Request manager → executive zone → knock → permission/entry →
    manager conversation.
4.  Type a question → secure conversation API → approved company
    knowledge → validated response or safe fallback.

## Functional requirements

-   Exact branding: USNAYA Techworks Solutions.
-   Loading/progress screen and safe no-WebGL/error fallback.
-   Guided and free-exploration modes.
-   Desktop keyboard/mouse controls with visible help.
-   Data-driven departments, destinations, characters, conversations,
    and assets.
-   Character facing, idle/walk/greet/talk/listen animations when assets
    support them.
-   HTML/CSS dialogue panel with speaker, message, choices, and AI
    input.
-   Typed, validated dialogue actions.
-   AI backend optional; secrets never in browser.
-   Route cancellation and destination switching without deadlocks.
-   Smooth camera modes and basic collision boundaries.
-   Pause, audio toggle, reduced-motion setting.
-   Graceful asset/network/AI failure handling.
-   Manager knock/permission sequence in full scope.

## Non-functional requirements

Desktop first; target 60 FPS on a defined reference device, with quality
fallback. Load critical assets first. Keep render loop independent of
network calls. Avoid unapproved personal-data collection. Track asset
licences.

## MVP acceptance

Reception-to-IT journey works end-to-end; one receptionist and one IT
character use the reusable runtime; guided and limited free movement
work; authored dialogue works without AI; AI is either safely integrated
or clearly labelled as unavailable/stub; production build and available
checks pass or blockers are documented.

## Out of scope for one-week MVP

Full photorealism, every room fully decorated, voiced/lip-synced
dialogue for all characters, multiplayer, visitor CRM, unapproved
analytics, scraping, AdMob.
