# Architecture

## Layers

-   **Experience:** state machine, objectives, destination logic,
    dialogue progression, permissions.
-   **Presentation:** camera, UI, audio, transitions and visual
    feedback.
-   **World:** rooms, doors, props, collision, navigation points and
    interactables.
-   **Character:** model loading, movement, facing, animation,
    interaction range and role configuration.
-   **Service:** optional AI API, approved knowledge, optional
    persistence.

## Main flow

Input → Experience Director → typed event/state transition →
navigation/character/camera/UI/audio → 3D renderer.

AI flow: Dialogue UI → backend validation/rate limit → AI provider +
approved knowledge → schema validation → UI. AI does not directly
manipulate the renderer.

## Core modules

`ExperienceDirector`, `ExperienceMachine`, `SceneManager`,
`AssetManager`, `CharacterRuntime`, `CharacterController`,
`NavigationGraph`, `InteractionManager`, `CameraManager`,
`DialogueManager`, `ConversationApi`, `AudioManager`,
`PerformanceManager`, `ExperienceShell`.

## Camera modes

Welcome overview, arrival follow, reception shot, guided follow, room
overview, character dialogue, manager door, free explore, paused. New
camera requests supersede old transitions.

## Events

`destination:selected`, `navigation:started`, `navigation:arrived`,
`character:nearby`, `interaction:started`, `dialogue:started`,
`dialogue:completed`, `door:knocked`, `door:opened`,
`experience:paused`, `experience:resumed`, `asset:failed`,
`conversation:failed`.

## Invariants

One primary dialogue at a time. Only Experience Director approves state
changes. AI cannot call engine functions. UI does not own movement.
Characters do not own company facts. Routes/actions have fallbacks.
Dispose resources on unmount.
