# Optional Cloudflare Worker AI Gateway

Optional only. If an existing backend securely supports AI requests, use
it instead of adding another backend.

Responsibilities: validate schema/IDs, apply origin policy and rate
limits, call provider using Worker secret, supply approved company
knowledge, validate structured output, return safe errors/request IDs.
Never expose provider keys or execute model-generated code.

Proposed endpoint: `POST /api/conversations/message`; optional
`GET /health`. Confirm Cloudflare and provider before implementation.
Configure production origins, cost controls, and tests for malformed
input, timeout, rate limits and fallback. Do not deploy a fake endpoint
that claims to be real AI.
