// Checks the Design Showcase end to end, without a browser or network.
//
//   npm run design:verify              errors fail the run; missing previews are warnings
//   npm run design:verify -- --strict  missing previews / unbuilt projects are errors too
//
// For every live project it checks: source exists, built output exists, every src/href/url()
// resolves to a real file inside the project's own URL base, the manifest stays in scope, and
// a real preview screenshot exists. It also reports built folders that are not in the config.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { OUT_ROOT, ROOT, designCategories, selectProjects, validateConfig, verifyOutput } from "./lib.mjs";

const strict = process.argv.includes("--strict");
let errors = 0;
let warnings = 0;
const err = (m) => { errors++; console.log(`  ERROR  ${m}`); };
const warn = (m) => { if (strict) err(m); else { warnings++; console.log(`  warn   ${m}`); } };

for (const m of validateConfig()) err(`config: ${m}`);

for (const e of selectProjects([])) {
  if (e.project.status !== "live") { console.log(`  skip   ${e.id} (coming soon)`); continue; }

  if (!existsSync(e.srcDir)) { err(`${e.id}: source folder missing (${path.relative(ROOT, e.srcDir)})`); continue; }
  if (!existsSync(path.join(e.outDir, "index.html"))) {
    warn(`${e.id}: not built yet. Run: npm run design:build -- ${e.id}`);
  } else {
    const problems = verifyOutput(e);
    problems.forEach((p) => err(`${e.id}: ${p}`));
    if (!problems.length) console.log(`  ok     ${e.id}  (${e.kind}, assets resolve)`);
  }

  if (!existsSync(e.previewFile)) {
    warn(`${e.id}: no preview screenshot (card shows a "Preview pending" placeholder). Run: npm run design:screenshots -- ${e.id}`);
  } else {
    const head = readFileSync(e.previewFile).subarray(0, 3);
    const isJpeg = head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
    if (!isJpeg || statSync(e.previewFile).size < 2048) err(`${e.id}: preview is not a valid JPEG`);
  }
}

// Built folders that nothing in the config points at.
if (existsSync(OUT_ROOT)) {
  const known = new Set(designCategories.flatMap((c) => c.projects.map((p) => `${c.id}/${p.slug}`)));
  for (const cat of readdirSync(OUT_ROOT)) {
    const catDir = path.join(OUT_ROOT, cat);
    if (!statSync(catDir).isDirectory()) continue;
    for (const slug of readdirSync(catDir)) if (!known.has(`${cat}/${slug}`)) warn(`orphan build with no config entry: public/design-projects/${cat}/${slug}`);
  }
}

console.log(`\n${errors ? "FAILED" : "PASSED"}: ${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
