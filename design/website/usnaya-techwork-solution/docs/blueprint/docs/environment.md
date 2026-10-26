# Environment Variables

Client-safe examples (only if used):

``` dotenv
VITE_APP_NAME=USNAYA Techworks Solution 3D Project
VITE_CONVERSATION_API_BASE_URL=/api
```

Server-only examples:

``` dotenv
AI_PROVIDER_API_KEY=replace-with-secret
AI_PROVIDER_MODEL=replace-with-approved-model
ALLOWED_ORIGINS=https://your-approved-domain.example
```

Names are illustrative, not existing configuration. Vite `VITE_`
variables are public. Never put secrets in client variables. Ignore
`.env`; commit placeholders in `.env.example`; validate required
variables at server startup.
