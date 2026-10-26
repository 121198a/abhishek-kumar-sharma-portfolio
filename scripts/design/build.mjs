// Builds each Design Showcase project into public/design-projects/<category>/<slug>/
//
//   npm run design:build                       every live project
//   npm run design:build -- auth               one category
//   npm run design:build -- auth/lamp-auth     one project
//   flags: --skip-install   reuse existing node_modules (faster re-builds)
//
// Why a build step instead of copying folders into public/:
//   - Vite projects must be compiled with their own dependency set (React 18 vs 19,
//     Tailwind 3, TypeScript, framer-motion, gsap ... conflict if merged).
//   - Each one is built with --base=/design-projects/<category>/<slug>/ so every
//     asset URL is absolute and works whether or not the URL has a trailing slash.
//   - Static projects (no package.json) get their relative URLs rewritten the same way.
//   - Output is verified in a staging folder and only then swapped into public/,
//     so a failed build never leaves a half-broken project live.

import { spawnSync } from "node:child_process";
import {
  cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync,
  rmSync, statSync, writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  ROOT, STATIC_ALWAYS_EXCLUDE, selectProjects, validateConfig, verifyOutput,
} from "./lib.mjs";

const argv = process.argv.slice(2);
const flags = new Set(argv.filter((a) => a.startsWith("--")));
const selectors = argv.filter((a) => !a.startsWith("--"));

const configErrors = validateConfig();
if (configErrors.length) {
  console.error("Invalid data/designs.ts:\n  " + configErrors.join("\n  "));
  process.exit(1);
}

function run(cmd, cwd, env = {}) {
  // Put the project's own node_modules/.bin first, exactly as `npm run` does.
  const binDir = path.join(cwd, "node_modules", ".bin");
  const PATH = `${binDir}${path.delimiter}${process.env.PATH ?? ""}`;
  console.log(`    $ ${cmd}`);
  const r = spawnSync(cmd, { cwd, shell: true, stdio: "inherit", env: { ...process.env, ...env, PATH } });
  if (r.status !== 0) throw new Error(`command failed (exit ${r.status}): ${cmd}`);
}

// ---- helpers --------------------------------------------------------------

const SKIP_REF = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\/)/i; // scheme:, //host, #hash, or already root-absolute

/** Make relative src/href/url() references absolute under `base`. */
function absolutizeHtml(html, base) {
  const fix = (v) => (v === "" || SKIP_REF.test(v) ? null : base + v.replace(/^\.\//, ""));
  return html
    .replace(/(\b(?:src|href|poster)\s*=\s*)(["'])([^"']*)\2/gi, (m, pre, q, v) => {
      const abs = fix(v);
      return abs ? `${pre}${q}${abs}${q}` : m;
    })
    .replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/gi, (m, q, v) => {
      const abs = fix(v);
      return abs ? `url(${q}${abs}${q})` : m;
    });
}

/** A web manifest's start_url / icons are root-absolute; keep them inside the project. */
function fixManifest(dir, base) {
  const file = path.join(dir, "manifest.webmanifest");
  if (!existsSync(file)) return;
  const m = JSON.parse(readFileSync(file, "utf8"));
  const inside = (u) => (typeof u === "string" && u.startsWith("/") && !u.startsWith(base) ? base + u.slice(1) : u);
  if (m.start_url) m.start_url = inside(m.start_url);
  if (!m.scope) m.scope = base;
  if (Array.isArray(m.icons)) m.icons = m.icons.map((i) => ({ ...i, src: inside(i.src) }));
  writeFileSync(file, JSON.stringify(m, null, 2) + "\n");
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else yield full;
  }
}

function dirSize(dir) {
  let n = 0;
  for (const f of walk(dir)) n += statSync(f).size;
  return n;
}

// ---- per-kind builders: each returns a folder of finished files ---------------

function buildVite(entry) {
  const { srcDir, base } = entry;
  const pkg = JSON.parse(readFileSync(path.join(srcDir, "package.json"), "utf8"));
  const script = pkg.scripts?.build;
  if (!script || !/\bvite build\b/.test(script)) {
    throw new Error('package.json "build" script must call `vite build` (found: ' + JSON.stringify(script) + ")");
  }

  if (!flags.has("--skip-install") || !existsSync(path.join(srcDir, "node_modules"))) {
    run(existsSync(path.join(srcDir, "package-lock.json"))
      ? "npm ci --no-audit --no-fund"
      : "npm install --no-audit --no-fund", srcDir);
  }

  // Run the project's OWN build script (so e.g. `tsc &&` type-checking or Door's
  // server-side prerender still happen), adding --base to every `vite build` in it.
  const command = script.replace(/\bvite build\b/g, `vite build --base=${base}`);
  const dist = path.join(srcDir, "dist");
  rmSync(dist, { recursive: true, force: true });
  // Door's canonical/og tags need an absolute URL; only set it if the site URL is known.
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, "");
  run(command, srcDir, site ? { SITE_URL: site + base.replace(/\/$/, "") } : {});

  if (!existsSync(path.join(dist, "index.html"))) throw new Error("build produced no dist/index.html");
  fixManifest(dist, base);
  return { dir: dist, cleanup: () => rmSync(dist, { recursive: true, force: true }) };
}

function buildStatic(entry) {
  const { srcDir, base, project } = entry;
  const extra = new Set(project.staticExclude ?? []);
  const stage = mkdtempSync(path.join(os.tmpdir(), "design-static-"));
  cpSync(srcDir, stage, {
    recursive: true,
    filter: (src) => {
      const rel = path.relative(srcDir, src);
      if (rel === "") return true;
      return !STATIC_ALWAYS_EXCLUDE.has(path.basename(src)) && !extra.has(rel.split(path.sep).join("/"));
    },
  });
  for (const f of walk(stage)) {
    if (f.endsWith(".html")) writeFileSync(f, absolutizeHtml(readFileSync(f, "utf8"), base));
  }
  fixManifest(stage, base);
  return { dir: stage, cleanup: () => rmSync(stage, { recursive: true, force: true }) };
}

// ---- main -----------------------------------------------------------------

const results = [];
for (const entry of selectProjects(selectors)) {
  if (entry.project.status !== "live") {
    results.push([entry.id, "skipped", "status is coming-soon"]);
    continue;
  }
  if (!existsSync(entry.srcDir)) {
    results.push([entry.id, "SKIPPED", `no source folder at ${path.relative(ROOT, entry.srcDir)}`]);
    continue;
  }
  if (flags.has("--if-missing") && existsSync(path.join(entry.outDir, "index.html"))) {
    results.push([entry.id, "ok", "already built (skipped)"]);
    continue;
  }
  console.log(`\n== ${entry.id}  (${entry.kind})  ->  ${entry.base}`);
  let built;
  try {
    built = entry.kind === "vite" ? buildVite(entry) : buildStatic(entry);
    const problems = verifyOutput(entry, built.dir);
    if (problems.length) throw new Error("verification failed:\n      " + problems.join("\n      "));
    rmSync(entry.outDir, { recursive: true, force: true });
    mkdirSync(path.dirname(entry.outDir), { recursive: true });
    cpSync(built.dir, entry.outDir, { recursive: true });
    results.push([entry.id, "ok", `${(dirSize(entry.outDir) / 1024).toFixed(0)} KB`]);
  } catch (err) {
    results.push([entry.id, "FAILED", err instanceof Error ? err.message : String(err)]);
  } finally {
    built?.cleanup();
  }
}

console.log("\n== Summary");
for (const [id, status, note] of results) console.log(`  ${status.padEnd(8)} ${id.padEnd(28)} ${note}`);
const hasFailures = results.some(([, s]) => s === "FAILED");
process.exit(hasFailures && !flags.has("--soft") ? 1 : 0);
