// Server-enforced chat session cap.
//
// The client used to send `sessionMessageCount` and the server trusted it, so
// anyone could bypass the per-session limit by sending 0. The count now also
// lives in a signed, HttpOnly cookie that the client cannot forge or lower.
// Cost: free (no database). Limit: a visitor can still clear cookies — the
// per-IP and daily budget limits remain the real cost backstop.

import { createHmac, randomBytes, timingSafeEqual } from "crypto";

export const SESSION_COOKIE = "aks_chat_session";
const TTL_SECONDS = 60 * 60; // one hour

// Set CHAT_SESSION_SECRET in production. Without it a per-process random
// secret is used: still unforgeable, but cookies reset on cold start.
const SECRET = process.env.CHAT_SESSION_SECRET?.trim() || randomBytes(32).toString("hex");

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

/** Returns the verified count, or 0 for a missing/expired/tampered cookie. */
export function readSessionCount(raw: string | undefined): number {
  if (!raw) return 0;
  const [countStr, expStr, sig] = raw.split(".");
  if (!countStr || !expStr || !sig) return 0;
  const expected = sign(`${countStr}.${expStr}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return 0;
  const count = Number(countStr);
  const exp = Number(expStr);
  if (!Number.isInteger(count) || count < 0 || !Number.isFinite(exp)) return 0;
  if (exp < Math.floor(Date.now() / 1000)) return 0;
  return count;
}

export function buildSessionCookie(count: number): string {
  const exp = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  const payload = `${count}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/api/chat",
  maxAge: TTL_SECONDS,
};
