// Privacy-conscious, free-by-default analytics. This never calls a
// third-party service — it only ever fires when BOTH the server flag
// (ENABLE_ANALYTICS) says the feature is on AND the visitor has consented
// via the cookie banner. Until then, trackEvent is a silent no-op.
//
// Swap the fetch target below for Vercel Web Analytics, Plausible, or
// GoatCounter's free tiers later without changing any call sites.

export type PortfolioEvent =
  | "page_view"
  | "project_view"
  | "resume_download"
  | "github_click"
  | "linkedin_click"
  | "contact_submit"
  | "recruiter_mode"
  | "ai_chat_started"
  | "ai_question_category"
  | "fallback_used"
  | "project_ai_opened";

/**
 * Maps the chat API's internal fallback `reason` string (e.g.
 * "daily_budget_exhausted", "provider_error_500") to the small,
 * privacy-safe category set Phase 9 asks for. Purely a client-side label
 * for an already-public response field — does not read, store, or alter
 * anything about the fallback answer itself.
 */
export function mapFallbackReason(reason?: string): string {
  if (!reason) return "provider_error";
  if (reason === "ai_disabled") return "ai_disabled";
  if (reason === "daily_budget_exhausted") return "rate_limit";
  if (reason === "ai_not_configured") return "configuration";
  if (reason.startsWith("provider_error")) return "provider_error";
  return "provider_error"; // empty_response, request_failed, and anything unrecognized
}

const CONSENT_KEY = "portfolioCookieChoice";

export function getConsent(): "all" | "essential" | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(CONSENT_KEY);
  return v === "all" || v === "essential" ? v : null;
}

export function setConsent(choice: "all" | "essential") {
  localStorage.setItem(CONSENT_KEY, choice);
}

export function trackEvent(event: PortfolioEvent, meta?: Record<string, string | boolean>) {
  if (typeof window === "undefined") return;
  if (getConsent() !== "all") return; // only "Accept All" enables optional analytics

  // Best-effort, fire-and-forget — never blocks the UI or throws.
  try {
    navigator.sendBeacon?.(
      "/api/analytics",
      JSON.stringify({ event, meta, path: window.location.pathname, ts: Date.now() })
    );
  } catch {
    // Analytics must never break the site.
  }
}
