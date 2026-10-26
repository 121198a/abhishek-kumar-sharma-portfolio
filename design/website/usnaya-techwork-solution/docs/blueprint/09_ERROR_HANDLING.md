# Error Handling

## Error classes

WebGL/scene failure, required or optional asset failure, invalid route,
blocked navigation, missing animation, invalid dialogue graph, AI
timeout/rate limit/provider failure, offline network, blocked audio
autoplay, unexpected exception.

## Recovery

-   Required asset: clear error + retry/reload; no blank canvas.
-   Optional asset: continue without it and log diagnostics.
-   Route failure: stop safely and offer a valid destination/directory.
-   AI failure: preserve typed text where practical and offer retry or
    guided dialogue.
-   Audio blocked: keep experience usable and show enable-audio control.
-   Invalid action: reject, never guess.
-   Unexpected error: safe fallback and non-sensitive diagnostic ID.

Abort/ignore stale requests after state changes. Prevent duplicate
submissions. Use bounded retries/backoff only for retryable errors.
Rendering never waits for a network call.

Log error code, subsystem, timestamp, version, request ID and safe
context. Never log secrets or full private transcripts by default.

Test missing GLB, broken texture, invalid destination, AI timeout,
malformed response, duplicate click, cancellation during movement,
refresh and no-WebGL fallback.
