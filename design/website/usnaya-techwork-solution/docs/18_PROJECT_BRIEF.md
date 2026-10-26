# Project Brief (owner's idea, written for the coding agent)

## Company
**USNAYA Techworks Solutions** (exact spelling). Branding appears on reception, signage, meeting rooms and UI.

## Core idea
Not an ordinary 3D website. An **interactive virtual corporate world**: a visitor enters a premium office, is welcomed at reception, explores departments, meets multiple human-like characters, talks to them through pop-up chat/dialogue boxes, and can visit the manager's cabin.

## What the owner asked for
- Multiple characters, not just one visitor meeting a manager.
- Separate departments: IT, HR, Sales; receptionist and reception; conference/meeting hall; office kitchen; waiting area; manager's cabin.
- Luxurious office setup, luxurious environment, luxurious animations.
- Characters should feel human, with real-person-like interaction.
- Interaction through pop-up chat boxes / message display showing what each character says or asks.
- The reference video's guided-walk idea (greeting, destination choice, character leads, knock, step inside) is kept, but expanded to many departments and characters.

## Locked decisions
| Decision | Choice |
|---|---|
| Visual style | Premium realistic environment with optimized 3D characters |
| Movement | Guided tour + free exploration |
| Conversations | Authored dialogue + AI text chat (authored must always work without AI) |
| Platform | Desktop/laptop first, mobile optimization afterwards |
| Stack | React + TypeScript + Vite, Three.js + React Three Fiber + Drei, XState, Zustand, GSAP, Howler, Blender/GLB |

## Spaces
Entrance and reception (central hub) / IT / HR / Sales / Conference hall / Visitor waiting area / Kitchen and break area / Manager's cabin (door, knock, permission).

## Characters (roster, names TBD by owner)
Receptionist, IT engineer, IT team lead, HR executive, HR manager, sales executive, sales manager, meeting host, 2 ambient employees, manager (optionally an assistant). Active conversational characters are few; ambient staff do not need AI.

## Not in scope
Scraping, ads/AdMob, multiplayer, CRM, database (unless persistence is later approved), full photorealism for every room in the first version.

## Definition of success for the first milestone (MVP)
Visitor starts, walks to reception, talks to the receptionist, picks IT, follows the guide, arrives, talks to an IT character, and can switch to free exploration, all with loading/error states and authored dialogue working without AI.
