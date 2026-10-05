# Content audit — Phase 1 (truth layer)

Every project on the site must match the code. Sources: the project ZIPs and github.com/121198a (13 repos).

## Verified in code (safe to state)
| Project | Verified facts |
|---|---|
| Bank Management System | React/Vite, Express, MongoDB, JWT + refresh cookie, RBAC, Decimal128 + transactions, 26 models, ~12 unit tests, GitHub Actions, Docker/nginx |
| VentureFlow | Next.js 15, TypeScript, Supabase, CMS + auth API routes, role middleware, 69 test cases |
| UnboundX Admin Dashboard | React 19, Vite, Tailwind 4, React Router 7, Axios; **no backend in repo**; README license "Private" |
| Sharma Kitchen | Next.js, 269-dish menu, Razorpay, Mongoose, rule-based assistant; README says it is a scaffold; **no auth** |
| NOC Monitoring Lab | FastAPI, SNMP polling, UDP syslog, JWT/bcrypt, React dashboard, 9 tests; **trap receiver is a stub** |
| FIR Management System | Java **Swing + JDBC + MySQL** (not Spring Boot) |

## Corrected on the site in this phase
- Bank Management System: was "Java/Spring Boot/SQL" → React/Express/MongoDB.
- UnboundX: was "Node/Express/MongoDB, RBAC" → React-only admin panel.
- Multi-Waveform Generator → Ramp Waveform Generator; removed "UART" and "multiple waveforms" (both were README *future enhancements*).
- Added VentureFlow, Sharma Kitchen, NOC Lab, FIR. Chatbot FAQ + slug map updated.
- Project years set from repo evidence (modern dependency versions), not guesses — **confirm**.
- RAG freshness guard (`lib/rag.ts`): stale index chunks are ignored until re-indexed.

## TODO — USER INPUT REQUIRED (not verifiable from code)
1. Steganography: code files are 0 bytes. Paper proof (acceptance/DOI), whether AWS S3/Lambda were used.
2. WAGAN SHOP: server code absent; year/"internship" status are user-stated.
3. Ramp Waveform: DAC used or not (two READMEs disagree).
4. "Spring Boot" and ".NET" appear in skills/hero/FAQ but no uploaded code uses them.
5. Infopulse (current internship) and Ardent (MySQL vs MongoDB): no evidence in uploads.
6. VentureFlow / UnboundX: your role and whether they may be shown publicly.
7. Campus Connect: README only → intentionally **not** added.

## Required before deploy
- Rotate the NVIDIA key that was inside the uploaded ZIP; never zip `.env*`.
- Run `npm run index:knowledge` with a fresh key to rebuild embeddings.
- FIR repo hardcodes a MySQL root login: change that password.
