# Security and Privacy

-   Never expose AI provider keys in client bundles. Keep secrets
    server-side.
-   Commit `.env.example` with placeholders; ignore `.env` and private
    keys.
-   Treat user input and AI output as untrusted.
-   Validate IDs, lengths, response schema and allow-listed actions.
-   Never evaluate AI output or render it as raw HTML.
-   Revalidate actions in Experience Director.
-   Use HTTPS, approved CORS origins, request limits, rate limits and
    safe errors.
-   Collect minimum data. Do not collect voice/camera/biometric/location
    data for MVP.
-   Do not store chats by default unless owner approves purpose,
    retention and policy.
-   Disclose AI processing where appropriate and redact logs.
-   Verify dependency and asset licences. Rotate accidentally exposed
    credentials.
-   Do not add analytics or persistence without an approved decision.
