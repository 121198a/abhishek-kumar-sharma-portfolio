import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../../server/app";
import { createLocalProvider, type Provider } from "../../server/ai/provider";
import { FALLBACK_TEXT, sendMessage } from "../services/ConversationApi";
import { useDialogue } from "../store/dialogueStore";

/**
 * Client chat pathway against the REAL Express app and the REAL local provider, over a real socket.
 * Only the browser's relative URL is rewritten to the test server's port.
 */
let server: ReturnType<ReturnType<typeof createApp>["listen"]>;
let base = "";
let provider: Provider = createLocalProvider();
const flaky = { fail: 0, calls: 0 };

beforeAll(() => {
  const app = createApp({
    provider: { name: "test", generate: (r) => (flaky.fail-- > 0 ? Promise.reject(new Error("down")) : provider.generate(r)) },
    allowedOrigins: [],
    dailyCap: 1000,
    ratePerMinute: 1000,
  });
  server = app.listen(0);
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  vi.stubGlobal("window", globalThis);
  const realFetch = globalThis.fetch;
  vi.stubGlobal("fetch", (url: string, init?: RequestInit) => {
    flaky.calls++;
    return realFetch(url.startsWith("/") ? base + url : url, init);
  });
  console.log = () => undefined; // the server logs one JSON line per request
});
afterAll(() => {
  server.close();
  vi.unstubAllGlobals();
});
beforeEach(() => {
  flaky.fail = 0;
  flaky.calls = 0;
  provider = createLocalProvider();
  useDialogue.setState({ conversationId: null, node: null, messages: [], ai: { status: "idle" } });
});

const req = { characterId: "bhavishya", departmentId: "office-kitchen" };

describe("typed questions", () => {
  it("returns a real answer from approved knowledge", async () => {
    const r = await sendMessage({ ...req, message: "Where is the break area?" }, new AbortController().signal);
    expect(r?.source).toBe("ai");
    expect(r?.message.length).toBeGreaterThan(0);
  });

  it("an actionable request yields a validated navigate action", async () => {
    const r = await sendMessage({ ...req, message: "Take me to the IT department" }, new AbortController().signal);
    expect(r?.action).toEqual({ type: "navigate", targetId: "it-department" });
  });

  it("retries one recoverable failure and then succeeds", async () => {
    flaky.fail = 1;
    const r = await sendMessage({ ...req, message: "Where is reception?" }, new AbortController().signal);
    expect(r?.source).toBe("ai");
    expect(flaky.calls).toBe(2);
  });

  it("persistent failure gives a clear fallback, never a fake answer", async () => {
    flaky.fail = 99;
    const r = await sendMessage({ ...req, message: "Where is reception?" }, new AbortController().signal);
    expect(r).toMatchObject({ source: "fallback", message: FALLBACK_TEXT, action: null });
  });

  it("a rejected request (400) is not retried and falls back", async () => {
    const r = await sendMessage({ characterId: "Bad Id!", departmentId: "x", message: "hi" }, new AbortController().signal);
    expect(r?.source).toBe("fallback");
    expect(flaky.calls).toBe(1);
  });

  it("empty input sends nothing; an aborted request resolves to null", async () => {
    expect(await sendMessage({ ...req, message: "   " }, new AbortController().signal)).toBeNull();
    expect(flaky.calls).toBe(0);
    const c = new AbortController();
    const p = sendMessage({ ...req, message: "Where is HR?" }, c.signal);
    c.abort();
    expect(await p).toBeNull();
  });
});

describe("authored conversation (Bhavishya)", () => {
  it("opens with the intended greeting and the four suggested questions", () => {
    useDialogue.getState().open("bhavishya-intro");
    const s = useDialogue.getState();
    expect(s.messages[0]?.text).toBe("Hello, I'm Bhavishya. Welcome to the break area. Can I get you a coffee?");
    expect(s.node?.choices?.map((c) => c.label)).toEqual([
      "Do people eat lunch here?",
      "What can I find in the break area?",
      "Can you tell me about this office?",
      "Thank you, that's all.",
    ]);
  });

  it("choosing a question appends the visitor line and the answer, and the conversation continues", () => {
    const d = useDialogue.getState();
    d.open("bhavishya-intro");
    d.choose(useDialogue.getState().node!.choices![0]!);
    const s = useDialogue.getState();
    expect(s.messages.map((m) => m.sender)).toEqual(["employee", "visitor", "employee"]);
    expect(s.node?.choices?.map((c) => c.label)).toContain("Ask something else");
  });

  it("closing clears the conversation; reopening starts fresh with one greeting", () => {
    const d = useDialogue.getState();
    d.open("bhavishya-intro");
    d.open("bhavishya-intro"); // duplicate open is ignored
    expect(useDialogue.getState().messages).toHaveLength(1);
    d.close();
    expect(useDialogue.getState()).toMatchObject({ conversationId: null, node: null, messages: [] });
  });
});
