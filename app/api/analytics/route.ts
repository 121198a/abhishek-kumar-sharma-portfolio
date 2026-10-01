import { NextRequest, NextResponse } from "next/server";
import { flags, analyticsLimits } from "@/lib/env";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const ALLOWED_EVENTS = new Set([
  "page_view",
  "project_view",
  "resume_download",
  "github_click",
  "linkedin_click",
  "contact_submit",
  "recruiter_mode",
  "ai_chat_started",
  "ai_question_category",
  "fallback_used",
  "project_ai_opened",
]);

// The only categories/reasons this endpoint will ever log — anything else
// in the payload is dropped rather than passed through, so this can never
// become a place to smuggle arbitrary text (e.g. a question, a message)
// into logs under a different field name.
const ALLOWED_CATEGORIES = new Set([
  "about",
  "skills",
  "projects",
  "experience",
  "education",
  "research",
  "career",
  "recruiter",
  "contact",
  "technology",
  "project_deep_dive",
  "unknown",
  "ai_disabled",
  "rate_limit",
  "configuration",
  "provider_error",
  "timeout",
]);

function sanitizeMeta(meta: unknown): Record<string, string | boolean> | undefined {
  if (!meta || typeof meta !== "object") return undefined;
  const input = meta as Record<string, unknown>;
  const out: Record<string, string | boolean> = {};

  // `project`: a short label only (project name/slug) — never free text.
  if (typeof input.project === "string" && input.project.length > 0 && input.project.length <= 80) {
    out.project = input.project;
  }
  // `category`: must be one of the fixed, privacy-safe categories above.
  if (typeof input.category === "string" && ALLOWED_CATEGORIES.has(input.category)) {
    out.category = input.category;
  }
  // `enabled`: boolean flags only (e.g. recruiter_mode on/off).
  if (typeof input.enabled === "boolean") {
    out.enabled = input.enabled;
  }

  return Object.keys(out).length > 0 ? out : undefined;
}

// Minimal same-origin analytics sink. Deliberately does not store IP
// addresses or any personal data, and does nothing at all unless the
// server-side flag is on — so it costs nothing and collects nothing by
// default. Replace the console.info below with a Supabase insert if you
// want persisted analytics later (see COST_CONTROL.md).
const MAX_BODY_BYTES = 2_000; // analytics events are tiny by design (see sanitizeMeta) — no reason to ever be larger

export async function POST(req: NextRequest) {
  if (!flags.enableAnalytics) {
    // 204 responses must not carry a body.
    return new NextResponse(null, { status: 204 });
  }

  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return new NextResponse(null, { status: 413 });
  }

  // Analytics must never become an abuse/flooding vector — reuses the same
  // in-memory rate limiter as /api/chat and /api/contact, no new infra.
  const ip = getClientIp(req.headers);
  const withinLimit = checkRateLimit(`analytics:${ip}`, analyticsLimits.perIpPerMinute, 60_000);
  if (!withinLimit) {
    return new NextResponse(null, { status: 204 });
  }

  try {
    const body = await req.json();

    if (typeof body?.event === "string" && ALLOWED_EVENTS.has(body.event)) {
      const meta = sanitizeMeta(body.meta);
      console.info("[analytics]", body.event, meta ?? {});
    }
  } catch {
    // Never let a malformed beacon surface an error to the visitor.
  }

  return new NextResponse(null, { status: 204 });
}
