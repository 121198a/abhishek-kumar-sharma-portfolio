// Shared request hardening for the JSON POST APIs (/api/chat, /api/contact).
//
// Fixes found by tests/security.ts:
//  - a JSON body of `null` (or any non-object) used to crash the handler (500)
//  - the body was parsed whatever the Content-Type, so a cross-site
//    <form enctype="text/plain"> post could reach the API without a CORS preflight
//  - the size cap trusted the Content-Length header, so chunked uploads bypassed it
//
// Order matters: cheap checks (origin, content type, declared size) run first,
// the body is then read with a hard byte cap, and only then parsed.

import type { NextRequest, NextResponse } from "next/server";

export type GuardResult =
  | { ok: true; body: Record<string, unknown> }
  | { ok: false; response: NextResponse };

type Fail = (error: string, status: number) => NextResponse;

/** Origin must match the host the request was addressed to (same-origin only). */
export function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser clients / same-origin GET-style requests send none
  try {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    return !!host && new URL(origin).host === host;
  } catch {
    return false; // e.g. Origin: null (sandboxed iframes, some redirects)
  }
}

export async function readJsonObject(req: NextRequest, maxBytes: number, fail: Fail): Promise<GuardResult> {
  if (!isSameOrigin(req)) return { ok: false, response: fail("Cross-origin requests are not allowed.", 403) };

  const type = (req.headers.get("content-type") ?? "").toLowerCase();
  if (!type.startsWith("application/json")) {
    return { ok: false, response: fail("Content-Type must be application/json.", 415) };
  }

  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > maxBytes) return { ok: false, response: fail("Request too large.", 413) };

  // Read at most maxBytes (+1) even when no Content-Length was sent (chunked).
  const reader = req.body?.getReader();
  if (!reader) return { ok: false, response: fail("Invalid request body.", 400) };
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel().catch(() => {});
      return { ok: false, response: fail("Request too large.", 413) };
    }
    chunks.push(value);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return { ok: false, response: fail("Invalid request body.", 400) };
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, response: fail("Request body must be a JSON object.", 400) };
  }
  return { ok: true, body: parsed as Record<string, unknown> };
}
