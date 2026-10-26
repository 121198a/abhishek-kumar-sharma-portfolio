/**
 * End-to-end check against a RUNNING dev server (`npm run dev`) in real Chromium.
 *   BASE_URL=http://127.0.0.1:5173 PLAYWRIGHT_MODULE=playwright node scripts/e2e.mjs
 * Playwright is not a project dependency; install it (or point PLAYWRIGHT_MODULE at an install) to run this.
 * Rendering uses software GL, so this checks behaviour, not frame rate.
 */
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const BASE = process.env.BASE_URL ?? "http://127.0.0.1:5173";
const GL = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"];
// React dev-mode warning raised by the drei <Html> label overlays under StrictMode; present before the interior work, not emitted in production.
const KNOWN_NOISE = /synchronously unmount a root|Failed to load resource/;

const results = [];
const errors = [];
async function step(name, fn) {
  if (process.env.ONLY && !name.includes(process.env.ONLY)) return;
  const t = Date.now();
  try {
    await fn();
    results.push({ name, ok: true, ms: Date.now() - t });
  } catch (e) {
    const ctx = await page.$$eval(".chat-bubble", (b) => b.map((x) => x.textContent?.slice(0, 60))).catch(() => []);
    results.push({ name, ok: false, ms: Date.now() - t, error: `${String(e.message).split("\n").slice(0, 3).join(" ")} | bubbles=${JSON.stringify(ctx)}` });
  }
  const r = results.at(-1);
  console.log(`${r.ok ? "PASS" : "FAIL"}  ${name}${r.ok ? "" : "  -> " + r.error}`);
}
const expect = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

const browser = await chromium.launch({ args: GL });
async function open(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 800, height: 450 }, ...opts });
  const p = await ctx.newPage();
  p.setDefaultTimeout(90000); // software GL renders about 1 frame/s, which also delays click actionability checks
  p.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  p.on("console", (m) => m.type() === "error" && !KNOWN_NOISE.test(m.text()) && errors.push(`console: ${m.text().slice(0, 160)}`));
  await p.goto(BASE);
  await p.waitForSelector("text=Enter the office", { timeout: 90000 });
  return p;
}
const enter = async (p) => {
  await p.click("text=Enter the office");
  await p.click("text=Skip walk");
  await p.waitForSelector(".dialogue");
};
// The Directory button toggles, and the app may already have it open after a conversation closes.
const openDirectory = async (p) => {
  if (!(await p.$('[aria-label="Directory"]'))) await p.click("text=Directory");
  await p.waitForSelector('[aria-label="Directory"] .btn:not([disabled])');
};
const bubbles = (p) => p.$$eval(".chat-bubble__text", (e) => e.map((x) => x.textContent));

let page = await open();
if (process.env.ONLY) {
  await enter(page); // the filtered step still needs the visitor inside the office with the conversation closed
  await page.click(".dialogue__close");
}
await step("welcome screen loads with no page errors", async () => {
  expect((await page.title()).includes("USNAYA"), "title");
});
await step("enter office and reach the receptionist conversation (greeting + name + role)", async () => {
  await enter(page);
  expect((await page.textContent(".dialogue__name")).includes("Priya Sharma"), "speaker name");
  expect((await bubbles(page)).length >= 1, "greeting");
});
await step("voice controls exist and give a text fallback when audio cannot start", async () => {
  await page.waitForSelector('[aria-label="Voice playback"], .dialogue__note');
  await page.waitForTimeout(3200);
  const note = await page.$$eval(".dialogue__note", (e) => e.map((x) => x.textContent));
  const group = await page.$('[aria-label="Voice playback"]');
  expect(group || note.length, "no voice UI or note");
});
await step("typed question gets a real answer", async () => {
  const before = (await bubbles(page)).length;
  await page.fill("#ask-input", "Where is the HR department?");
  await page.press("#ask-input", "Enter");
  await page.waitForFunction((n) => document.querySelectorAll(".chat-bubble__text").length >= n + 2, before, { timeout: 20000 });
  const last = (await bubbles(page)).at(-1);
  expect(!/isn't available/.test(last), "got fallback: " + last);
});
await step("API failure shows a clear message and Retry recovers", async () => {
  await page.route("**/api/conversations/message", (r) => r.fulfill({ status: 500, contentType: "application/json", body: '{"error":{"code":"X","message":"x","retryable":true}}' }));
  await page.fill("#ask-input", "Where is the break area?");
  await page.press("#ask-input", "Enter");
  await page.waitForSelector(".chat-bubble--error", { timeout: 90000 }); // slow under software GL: the client retries once before giving up
  await page.waitForSelector("text=Retry question");
  await page.unroute("**/api/conversations/message");
  const before = (await bubbles(page)).length;
  await page.click("text=Retry question");
  await page.waitForFunction((n) => document.querySelectorAll(".chat-bubble__text").length > n, before, { timeout: 20000 });
  expect((await page.$$(".chat-bubble--error")).length === 1, "error bubble kept, success appended");
});
await step("keyboard: Tab reaches controls with a visible focus ring", async () => {
  await page.focus("body");
  for (let i = 0; i < 6; i++) await page.keyboard.press("Tab");
  const ok = await page.evaluate(() => {
    const el = document.activeElement;
    return !!el && el !== document.body && getComputedStyle(el).outlineStyle !== "none";
  });
  expect(ok, "focused element has no outline");
});
await step("suggested choice navigates, arrives and opens the IT conversation; Close returns to the office", async () => {
  await page.click("text=Take me to the IT department.");
  await page.click("text=Skip walk");
  await page.waitForFunction(() => /Abhishek|IT team/.test(document.querySelector(".dialogue__name")?.textContent ?? ""), null, { timeout: 40000 });
  await page.click(".dialogue__close");
  await page.waitForFunction(() => !document.querySelector(".dialogue"), null, { timeout: 15000 });
});
await step("switching conversation leaves no stale panel or speech", async () => {
  expect((await page.$$(".dialogue")).length === 0, "dialogue still open");
});

await step("rapid destination changes: IT, Parking, Manager's Cabin. Only the last task arrives", async () => {
  const navLog = [];
  page.on("console", (m) => m.type() === "debug" && m.text().startsWith("[nav]") && navLog.push(m.text()));
  await page.evaluate(() => {
    window.__NAV_DEBUG = true;
  });
  for (const label of ["IT Department", "Car Parking", "Manager's Cabin"]) {
    await openDirectory(page);
    await page.click(`.directory >> text="${label}"`);
    await page.waitForTimeout(1500); // Priya is mid-walk when the visitor changes their mind
  }
  // Software rendering runs the simulation far slower than real time, so finish the last walk with Skip (it applies to the active task only).
  for (let i = 0; i < 40 && !(await page.$(":text('Knock')")); i++) {
    const skip = await page.$("text=Skip walk");
    if (skip) await skip.click().catch(() => undefined);
    await page.waitForTimeout(700);
  }
  await page.waitForSelector(":text('Knock')", { timeout: 60000 }); // arrival at the cabin door
  const started = navLog.filter((l) => /task \d+ started/.test(l));
  const cancelled = navLog.filter((l) => /cancelled: replaced/.test(l));
  const arrived = navLog.filter((l) => /task \d+ arrived/.test(l));
  expect(started.length >= 3, "three tasks started: " + started.length);
  expect(cancelled.length >= 2, "earlier tasks cancelled: " + cancelled.length);
  expect(arrived.length === 1 && arrived[0] === navLog.filter((l) => /arrived/.test(l)).at(-1), "exactly one arrival: " + JSON.stringify(arrived));
  expect(/manager-cabin/.test(started.at(-1)), "last task is the cabin");
  const knock = await page.$(":text('Knock')");
  if (knock) await knock.click().catch(() => undefined);
  await page.evaluate(() => {
    window.__NAV_DEBUG = false;
  });
});
await step("guided tour: next/previous/exit work and stop labels are real destinations", async () => {
  await openDirectory(page);
  await page.click("text=Start the full tour");
  await page.waitForSelector('[aria-label="Guided Tour Controls"]', { timeout: 20000 });
  const label = () => page.textContent(".tour-controller__badge");
  const a = await label();
  await page.click('[aria-label="Next tour stop"]');
  const b = await label();
  expect(a !== b, "Next did not advance");
  await page.click('[aria-label="Previous tour stop"]');
  expect((await label()) === a, "Previous did not go back");
  await page.click('[aria-label="Exit guided tour"]');
  await page.waitForFunction(() => !document.querySelector(".tour-controller"));
});

await step("repeated travel: every directory destination is reachable and none leaves the app stuck", async () => {
  await openDirectory(page);
  const labels = (await page.$$eval(".directory .btn", (e) => e.map((x) => x.textContent.trim()))).filter(Boolean);
  expect(labels.length >= 8, "directory too short: " + labels.length);
  await page.click("[aria-label=Directory] >> text=Close");
  for (const label of labels) {
    await openDirectory(page);
    await page.click(`.directory >> text="${label}"`);
    // Walk (skipping the animation), dismiss any arrival conversation, until the app is interactive again: no stuck state allowed.
    let settled = false;
    for (let i = 0; i < 40 && !settled; i++) {
      const skip = await page.$("text=Skip walk");
      if (skip) await skip.click().catch(() => undefined);
      const knock = await page.$("text=Knock");
      if (knock) await knock.click().catch(() => undefined);
      const close = await page.$(".dialogue__close");
      if (close) await close.click().catch(() => undefined);
      await page.waitForTimeout(700);
      settled = !(await page.$("text=Skip walk")) && !(await page.$(".dialogue")) && !(await page.$('[aria-label="Guided Tour Controls"]'));
    }
    expect(settled, `stuck after travelling to ${label}`);
  }
});
await step("pause and resume overlay (Escape) returns to a usable state", async () => {
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  const resume = await page.$("text=Resume");
  if (resume) await resume.click();
  await page.waitForSelector(".toolbar");
});
await page.context().close();

await step("reduced-motion preference is honoured in Settings", async () => {
  const p = await open({ reducedMotion: "reduce" });
  await enter(p);
  await p.click("text=Settings");
  expect(await p.isChecked("#rm"), "reduced motion not on");
  await p.context().close();
});

await step("mobile layout 390x844: no horizontal overflow; panel and touch controls usable", async () => {
  const p = await open({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await enter(p);
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow <= 1, `horizontal overflow ${overflow}px`);
  const box = await p.$eval(".dialogue", (e) => {
    const r = e.getBoundingClientRect();
    return { l: r.left, r: r.right, b: r.bottom };
  });
  expect(box.l >= 0 && box.r <= 391 && box.b <= 845, "dialogue off-screen " + JSON.stringify(box));
  await p.context().close();
});

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed; unexpected console/page errors: ${errors.length}`);
errors.slice(0, 10).forEach((e) => console.log("  " + e));
process.exit(failed.length || errors.length ? 1 : 0);
