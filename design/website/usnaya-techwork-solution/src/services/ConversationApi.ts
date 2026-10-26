import { isValidDestination } from "../data/destinations";

export type ChatReply = {
  message: string;
  suggestedReplies: string[];
  action: { type: "navigate"; targetId: string } | null;
  /** "fallback" = the AI service could not be reached; the visitor should use the authored options. */
  source: "ai" | "fallback";
};

export type ChatRequest = { characterId: string; departmentId: string; message: string };

const TIMEOUT_MS = 8000;
const MAX_LEN = 300;
const sessionId = (globalThis.crypto?.randomUUID?.() ?? `s-${Date.now()}`).slice(0, 64);

export const FALLBACK_TEXT =
  "The assistant isn't available right now, so I can't answer typed questions. Please use the options above, or ask the team directly.";

function fallback(): ChatReply {
  return { message: FALLBACK_TEXT, suggestedReplies: [], action: null, source: "fallback" };
}

/** Defensive parse: the server is trusted less than our own code. Unknown actions are dropped. */
export function parseReply(raw: unknown): ChatReply | null {
  if (typeof raw !== "object" || raw === null) return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.message !== "string" || o.message.length === 0 || o.message.length > 1200) return null;
  const replies = Array.isArray(o.suggestedReplies)
    ? o.suggestedReplies.filter((r): r is string => typeof r === "string" && r.length <= 120).slice(0, 3)
    : [];
  let action: ChatReply["action"] = null;
  const a = o.action as { type?: unknown; targetId?: unknown } | null | undefined;
  if (a && a.type === "navigate" && typeof a.targetId === "string" && isValidDestination(a.targetId)) {
    action = { type: "navigate", targetId: a.targetId };
  }
  return { message: o.message, suggestedReplies: replies, action, source: "ai" };
}

async function attempt(req: ChatRequest, outer: AbortSignal): Promise<{ ok: true; reply: ChatReply } | { ok: false; retryable: boolean }> {
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  const onAbort = () => ctrl.abort();
  outer.addEventListener("abort", onAbort);
  try {
    const res = await fetch("/api/conversations/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, ...req }),
      signal: ctrl.signal,
    });
    if (!res.ok) return { ok: false, retryable: res.status >= 500 };
    const reply = parseReply(await res.json());
    return reply ? { ok: true, reply } : { ok: false, retryable: false };
  } catch {
    return { ok: false, retryable: !outer.aborted };
  } finally {
    window.clearTimeout(timer);
    outer.removeEventListener("abort", onAbort);
  }
}

/** Sends a typed question. Never throws: on any failure it returns a clear fallback reply. */
export async function sendMessage(req: ChatRequest, signal: AbortSignal): Promise<ChatReply | null> {
  const message = req.message.trim().slice(0, MAX_LEN);
  if (!message) return null;
  const body = { ...req, message };
  let r = await attempt(body, signal);
  if (signal.aborted) return null; // a newer request or a closed panel superseded this one
  if (!r.ok && r.retryable) {
    await new Promise((res) => window.setTimeout(res, 400));
    if (signal.aborted) return null;
    r = await attempt(body, signal);
  }
  if (signal.aborted) return null;
  return r.ok ? r.reply : fallback();
}
