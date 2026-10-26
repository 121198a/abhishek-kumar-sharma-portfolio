# API Contract

The following is a proposed contract for optional AI chat, not an
existing API.

## POST /api/conversations/message

Request:

``` json
{
  "sessionId": "optional-session-id",
  "characterId": "receptionist-01",
  "departmentId": "reception",
  "message": "Can I visit the IT department?"
}
```

Response:

``` json
{
  "message": "I can help you find the IT department.",
  "suggestedReplies": ["Tell me what IT does", "Start the guided tour"],
  "action": {"type": "navigate", "targetId": "it-department"}
}
```

`action` may be null. Frontend and Experience Director independently
validate it.

Error:

``` json
{
  "error": {
    "code": "AI_UNAVAILABLE",
    "message": "Conversation service is temporarily unavailable.",
    "retryable": true
  }
}
```

Validate JSON content type, message length, IDs, rate limits, timeout
and provider output. Return safe errors; do not expose secrets/raw stack
traces. Avoid logging complete messages by default. Configure HTTPS and
approved CORS origins.

Optional `POST /api/experience/sessions` only if persistence is
genuinely needed.
