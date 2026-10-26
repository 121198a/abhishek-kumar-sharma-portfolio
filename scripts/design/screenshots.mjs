// Captures a real screenshot of each BUILT project into public/design-previews/<category>/<slug>.jpg
//
//   npm run design:screenshots                       every live, built project
//   npm run design:screenshots -- navbar             one category
//   npm run design:screenshots -- auth/lamp-auth     one project
//
// Requires Playwright, deliberately NOT added to package.json (so your lockfile and Vercel
// installs are untouched). One-time setup:
//     npm i --no-save playwright && npx playwright install chromium
// (set PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs to use a copy installed elsewhere)

import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { ROOT, selectProjects, validateConfig } from "./lib.mjs";
import { startStaticServer } from "./server.mjs";

const selectors = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const errs = validateConfig();
if (errs.length) { console.error(errs.join("\n")); process.exit(1); }

let chromium;
try {
  const spec = process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : "playwright";
  ({ chromium } = await import(spec));
} catch {
  console.error("Playwright is not installed.\n  npm i --no-save playwright && npx playwright install chromium");
  process.exit(1);
}

const entries = selectProjects(selectors).filter((e) => e.project.status === "live");
const server = await startStaticServer(path.join(ROOT, "public"));
const browser = await chromium.launch();
let failed = 0;

for (const e of entries) {
  if (!existsSync(path.join(e.outDir, "index.html"))) {
    console.log(`  SKIP  ${e.id}: not built yet (run npm run design:build -- ${e.id})`);
    failed++;
    continue;
  }
  const { width = 1280, height = 800, waitMs = 1800 } = e.project.preview ?? {};
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const problems = [];
  page.on("pageerror", (err) => problems.push(`script error: ${err.message}`));
  page.on("response", (r) => { if (r.status() >= 400) problems.push(`HTTP ${r.status()} ${r.url().replace(server.origin, "")}`); });
  try {
    await page.goto(server.origin + e.url, { waitUntil: "networkidle" });
    await page.waitForTimeout(waitMs); // let entrance animations settle
    mkdirSync(path.dirname(e.previewFile), { recursive: true });
    await page.screenshot({ path: e.previewFile, type: "jpeg", quality: 82 });
    console.log(`  OK    ${e.id}  ->  ${path.relative(ROOT, e.previewFile)}${problems.length ? "   (warnings below)" : ""}`);
    for (const p of problems) console.log(`          ! ${p}`);
  } catch (err) {
    failed++;
    console.log(`  FAIL  ${e.id}: ${err instanceof Error ? err.message : err}`);
  }
  await ctx.close();
}
await browser.close();
await server.close();
process.exit(failed ? 1 : 0);
