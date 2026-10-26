import type { AddressInfo } from "node:net";
import { afterEach, describe, expect, it } from "vitest";
import { createApp } from "./app";
import { createLocalProvider, matchKnowledge, type Provider } from "./ai/provider";
import { sanitizeOutput } from "./ai/schema";
import { DailyCap } from "./security/usageCap";
import type { KnowledgeEntry } from "./knowledge/companyKnowledge";

const servers: { close: () => void }[] = [];
afterEach(() => servers.splice(0).forEach((s) => s.close()));

async function boot(provider: Provider, extra: { dailyCap?: number; ratePerMinute?: number; timeoutMs?: number } = {}) {
  const app = createApp({ provider, allowedOrigins: ["http://localhost:5173"], dailyCap: extra.dailyCap ?? 100, ratePerMinute: extra.ratePerMinute, timeoutMs: extra.timeoutMs });
  const server = app.listen(0);
  servers.push(server);
  const port = (server.address() as AddressInfo).port;
  const post = (body: unknown, raw = false) =>
    fetch(`http://127.0.0.1:${port}/api/conversations/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw ? (body as string) : JSON.stringify(body),
    });
  return { post, port };
}
const ok = { characterId: "it-engineer", departmentId: "it-department", message: "hello" };
const silent = () => {
  const l = console.log;
  console.log = () => undefined;
  return () => (console.log = l);
};

describe("conversation API", () => {
  it("answers navigation requests with an allow-listed action", async () => {
    const { post } = await boot(createLocalProvider([]));
    const r = await post({ ...ok, message: "Please take me to the sales department" });
    const j = await r.json();
    expect(r.status).toBe(200);
    expect(j.action).toEqual({ type: "navigate", targetId: "sales-department" });
  });

  it("says it has no approved information when the knowledge base is empty", async () => {
    const { post } = await boot(createLocalProvider([]));
    const j = await (await post({ ...ok, message: "What are your prices?" })).json();
    expect(j.message).toMatch(/don't have approved information/i);
    expect(j.action).toBeNull();
  });

  it("answers from approved knowledge only", () => {
    const entries: KnowledgeEntry[] = [
      { id: "a", keywords: ["pricing"], answer: "APPROVED", approved: true },
      { id: "b", keywords: ["secret"], answer: "DRAFT", approved: false },
    ];
    expect(matchKnowledge("tell me about pricing", entries)?.answer).toBe("APPROVED");
    expect(matchKnowledge("tell me the secret", entries)).toBeNull();
  });

  it("rejects invalid input", async () => {
    const restore = silent();
    const { post } = await boot(createLocalProvider([]));
    expect((await post({ ...ok, message: "" })).status).toBe(400);
    expect((await post({ ...ok, message: "x".repeat(301) })).status).toBe(400);
    expect((await post({ ...ok, characterId: "../etc/passwd" })).status).toBe(400);
    expect((await post("{not json", true)).status).toBe(400);
    expect((await post({ ...ok, message: "x".repeat(6000) })).status).toBe(413);
    restore();
  });

  it("drops actions that are not on the allow-list", async () => {
    const restore = silent();
    const bad: Provider = { name: "bad", generate: async () => ({ message: "hi", suggestedReplies: [], action: { type: "navigate", targetId: "vault" } }) };
    const { post } = await boot(bad);
    const j = await (await post(ok)).json();
    expect(j.action).toBeNull();
    restore();
  });

  it("returns 502 for unusable provider output and for provider errors", async () => {
    const restore = silent();
    const junk = await boot({ name: "junk", generate: async () => ({ nope: 1 }) });
    expect((await junk.post(ok)).status).toBe(502);
    const boom = await boot({ name: "boom", generate: async () => Promise.reject(new Error("x")) });
    const r = await boom.post(ok);
    expect(r.status).toBe(502);
    expect((await r.json()).error.retryable).toBe(true);
    restore();
  });

  it("times out slow providers", async () => {
    const restore = silent();
    const slow: Provider = { name: "slow", generate: () => new Promise(() => undefined) };
    const { post } = await boot(slow, { timeoutMs: 50 });
    expect((await post(ok)).status).toBe(504);
    restore();
  });

  it("rate limits per client", async () => {
    const restore = silent();
    const { post } = await boot(createLocalProvider([]), { ratePerMinute: 2 });
    expect((await post(ok)).status).toBe(200);
    expect((await post(ok)).status).toBe(200);
    expect((await post(ok)).status).toBe(429);
    restore();
  });

  it("enforces the daily cap", async () => {
    const restore = silent();
    const { post } = await boot(createLocalProvider([]), { dailyCap: 1 });
    expect((await post(ok)).status).toBe(200);
    const r = await post(ok);
    expect(r.status).toBe(429);
    expect((await r.json()).error.code).toBe("DAILY_CAP");
    restore();
  });
});

describe("helpers", () => {
  it("DailyCap resets on a new day", () => {
    let d = new Date("2026-01-01T10:00:00Z");
    const cap = new DailyCap(1, () => d);
    expect(cap.take()).toBe(true);
    expect(cap.take()).toBe(false);
    d = new Date("2026-01-02T00:00:01Z");
    expect(cap.take()).toBe(true);
  });
  it("sanitizeOutput rejects bad shapes", () => {
    expect(sanitizeOutput("hi")).toBeNull();
    expect(sanitizeOutput({ message: "" })).toBeNull();
    expect(sanitizeOutput({ message: "ok" })?.action).toBeNull();
  });
});
