// In-memory rate limiting. This is intentionally simple and free: no Redis,
// no external service. On Vercel Hobby, serverless functions can run as
// multiple instances and reset on cold start, so this is a best-effort
// guard, not a perfectly precise one — it still meaningfully caps abuse and
// costs nothing. If you outgrow it, swap the Map for a Supabase table
// (a `request_log` row per hit) without changing the call sites below.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/**
 * Returns true if the request is allowed, false if the caller is over the
 * limit for the given window.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (existing.count >= limit) {
    return false;
  }

  existing.count += 1;
  return true;
}

// Daily global AI budget — separate from per-IP limiting. Once this trips,
// the whole AI feature disables itself for the rest of the day and the
// portfolio falls back to the local FAQ (see lib/ai-fallback.ts).
let dailyCount = 0;
let dailyResetAt = startOfNextUtcDay();

function startOfNextUtcDay(): number {
  const d = new Date();
  d.setUTCHours(24, 0, 0, 0);
  return d.getTime();
}

export function tryConsumeDailyAiBudget(dailyLimit: number): boolean {
  const now = Date.now();
  if (now >= dailyResetAt) {
    dailyCount = 0;
    dailyResetAt = startOfNextUtcDay();
  }
  if (dailyCount >= dailyLimit) return false;
  dailyCount += 1;
  return true;
}

export function getClientIp(headers: Headers): string {
  // On Vercel, x-vercel-forwarded-for is set by the platform (and survives an
  // upstream proxy); x-forwarded-for is also overwritten there to stop spoofing
  // (Vercel docs, "Request headers"). On any OTHER host these headers are
  // client-controlled, so per-IP limits can be dodged - see docs/SECURITY_NOTES.md.
  const vercel = headers.get("x-vercel-forwarded-for");
  if (vercel) return vercel.split(",")[0].trim();
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
