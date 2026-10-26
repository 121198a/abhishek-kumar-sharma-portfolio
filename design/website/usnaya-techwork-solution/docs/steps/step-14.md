# Step 14: AI chat (secure backend)

**Goal:** Optional AI text chat. Authored dialogue must still work if it fails.

**Needs from the owner:** AI provider, hosting choice, and the real company facts for companyKnowledge.ts.

## Prompt to paste into the agent

```
Before doing anything, read AGENTS.md and the files it lists (docs/18_PROJECT_BRIEF.md, docs/20_DESIGN_GUARDRAILS.md, docs/blueprint/00_MASTER_RULES.md, 02_TRD.md, 03_ARCHITECTURE.md, 04_DATA_MODEL.md, 10_SECURITY.md).
Do ONLY the task below. Do not start other steps and do not add extra features.
First reply with a short plan: the files you will create or change, and why. Then implement.
At the end: run the real lint, typecheck, test and build scripts that exist in package.json and report the exact results (never claim a check you did not run); update docs/blueprint/15_MICROTASKS.md and 16_CHANGELOG.md; give me a manual test checklist; then STOP and wait for me.

TASK (Step 14: AI conversation layer)
First ask me which AI provider and which hosting/backend to use (docs/blueprint/cloudflare-worker/README.md describes an optional Cloudflare Worker; a small Node + TypeScript service is the alternative). If I have not confirmed, implement only the frontend side with a clearly labelled STUB and stop.
Server (once confirmed): POST /api/conversations/message per docs/blueprint/07_API_CONTRACT.md.
- API key only in server environment variables; .env.example has placeholders.
- Validate JSON content type, ids, and max message length; request body size limit.
- Rate limit per IP/session; request timeout; app-level daily request cap in addition to a provider-side spending cap that I will configure.
- Strict output schema { message, suggestedReplies, action }; action must be from an allow-list of known destination ids or null.
- Knowledge only from server/knowledge/companyKnowledge.ts, which I will fill. Create it as a template with TODO placeholders, no invented facts. If the answer is not in the knowledge base, the character says so and offers a next step.
- Approved CORS origins; safe error responses with a request id; logs without secrets and without full private messages.
Frontend: ConversationApi.ts with timeout, abort of stale requests, bounded retry, typing indicator, rendering AI text as plain text, automatic fallback to authored dialogue on failure. The Director revalidates any action.
Tests: malformed output, invalid action, timeout, rate-limit response, offline.
```

## How you check it yourself
With the server off, the chat shows a clear fallback and authored dialogue still works. With it on, answers come only from the knowledge file. A malformed or disallowed action is rejected.

## Then commit
```
git add .
git commit -m "step 14: ai chat"
```
