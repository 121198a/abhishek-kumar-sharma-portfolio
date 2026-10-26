# Phase 4 --- Dialogue and Secure AI

Validate authored dialogue graphs. Add receptionist and IT conversations
using approved facts. Implement backend AI endpoint only after provider
and deployment are confirmed. Keep credentials server-side; add input
validation, rate limits, timeout, safe errors, schema validation,
allow-listed actions and fallback. If credentials/knowledge are missing,
label AI as a stub; never fake live responses.

Acceptance: authored dialogue always works. Where configured, test AI
success, malformed output, timeout and rate-limit paths.
