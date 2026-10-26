# Assets and Licences

| Item | Source | Licence |
|---|---|---|
| All 3D geometry (building, furniture, six named characters and other people, vehicles) | Generated in code (`src/world`, `src/characters`) | Original work for this project; no third-party models |
| All textures (wood, carpet, terrazzo, screens, art, signage) | Painted at runtime on canvases from code (`src/world/textures.ts`) | Original; no image files |
| Sound effects and music | Synthesised in the browser (`src/engine/AudioManager.ts`) | Original; no audio files |
| Voice | The visitor's own browser speech synthesis (Web Speech API) | Voices belong to the visitor's OS/browser; nothing is bundled |
| Fonts | `@fontsource/familjen-grotesk`, `@fontsource/instrument-sans` (bundled woff/woff2) | SIL Open Font License 1.1 |
| Libraries | react, react-dom, three, @react-three/fiber, @react-three/drei, xstate, @xstate/react, zustand, express, cors, express-rate-limit, zod | MIT (check each package's `LICENSE` in `node_modules` before redistribution) |

Phase 4 note: the supplied character reference image was used as visual guidance only. No external rigged character models were available to license, so the characters are original procedural figures with an articulated skeleton of grouped meshes. This keeps files tiny and licence-free; the trade-off is a stylised rather than photoreal look. Swapping in licensed GLB characters later would need a new rig and animation retargeting.
