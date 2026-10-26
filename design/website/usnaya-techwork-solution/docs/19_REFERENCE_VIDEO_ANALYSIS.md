# Reference Video Analysis

Source: a 44-second, 720x1280, 30 fps phone recording of a laptop screen showing another company's interactive 3D office website. The recording includes a hand, keyboard and browser chrome, which are NOT part of the site. Frames were inspected manually; the audio words were NOT transcribed.

## Verified on screen
- Stylized, light-colored 3D office viewed from an elevated, isometric-like camera.
- A player character in a blue shirt with a floating "YOU" label.
- Card 1: "Welcome / Welcome to the office", with a sub-line about walking to reception.
- The player walks to a reception desk with a receptionist behind it.
- Card 2 (receptionist): "How can I help you?" with destination choices (Work Studio, Design Room, Meeting Room, Operations), a "Meet the boss" option and a "Just exploring" option.
- Card 3: "Your visit / Boss Cabin: Follow your receptionist to Boss Cabin", with a "Skip walk" control. A character labelled "RECEPTIONIST" walks ahead; the camera follows.
- At the cabin door: "Knocking on the boss cabin..." with a "Knock" label on the door.
- Final card: "Boss Cabin: Please step inside." Camera pulls out to a wide overview; control becomes "Skip visit".
- Many desks, plants, glass partitions, NPC employees at workstations.

## Pattern we learn from (not copy)
Welcome -> auto-walk to reception -> dialogue with choices -> chosen destination -> guide walks ahead, visitor and camera follow -> arrival -> knock -> invitation inside. UI is an HTML overlay on top of a 3D canvas.

## Hypotheses (unverified)
Three.js / React Three Fiber, GSAP, waypoint vs navmesh, GLB assets, Blender, audio library. Nothing in the video proves these. They are our implementation choices, not facts about the original.

## Do not copy
The signage in the video shows another company's name. Do not reuse its branding, text, layout, models or assets. USNAYA must have its own identity, environment, characters and copy. Take only the interaction and architecture ideas.

## Differences for USNAYA
More departments, many characters, character-anchored chat panel, AI chat, free exploration, premium realistic look (the reference is low-poly stylized).
