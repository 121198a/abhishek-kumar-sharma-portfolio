// Central place to read feature flags and limits. Keeping this in one file
// means COST_CONTROL.md and scripts/cost-check.mjs can stay in sync with
// what the app actually enforces.

function bool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value === "true";
}

function num(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export const flags = {
  enableAI: bool(process.env.ENABLE_AI, true),
  enableAnalytics: bool(process.env.ENABLE_ANALYTICS, false),
  enableContactForm: bool(process.env.ENABLE_CONTACT_FORM, true),
  // RAG only ever supplements the structured KB (never replaces it, never
  // required for fallback) — safe to default on. It self-disables if the
  // embeddings index hasn't been built or NVIDIA_API_KEY is missing.
  enableRag: bool(process.env.ENABLE_RAG, true),
};

export const aiLimits = {
  dailyLimit: num(process.env.AI_DAILY_LIMIT, 20),
  maxMessagesPerSession: num(process.env.AI_MAX_MESSAGES_PER_SESSION, 10),
  maxInputChars: num(process.env.AI_MAX_INPUT_CHARS, 400),
  maxOutputTokens: num(process.env.AI_MAX_OUTPUT_TOKENS, 512),
  requestTimeoutMs: num(process.env.AI_REQUEST_TIMEOUT_MS, 15000),
  perIpPerMinute: num(process.env.AI_RATE_LIMIT_PER_IP_PER_MINUTE, 5),
};

export const emailLimits = {
  perIpPerHour: num(process.env.CONTACT_RATE_LIMIT_PER_IP_PER_HOUR, 3),
};

export const analyticsLimits = {
  perIpPerMinute: num(process.env.ANALYTICS_RATE_LIMIT_PER_IP_PER_MINUTE, 40),
};
