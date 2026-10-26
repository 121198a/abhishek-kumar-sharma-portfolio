// Shared helpers for the Design Showcase scripts. Run through tsx (see package.json),
// which lets this plain-JS module import the TypeScript config in data/designs.ts.
//
// NOTE: .mjs files are not type-checked by `next build` (tsconfig has allowJs:false),
// so these scripts cannot break a production deploy.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
// Dynamic import: tsx's CJS/ESM interop does not expose named exports for a static
// `import { ... } from "../../data/designs.ts"` from a plain .mjs file, but does for import().
const designs = await import("../../data/designs.ts");
const { designCategories, designProjectUrl, designPreviewUrl, DESIGN_URL_ROOT } = designs;

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const SRC_ROOT = existsSync(path.join(ROOT, "design-projects-src"))
  ? path.join(ROOT, "design-projects-src")
  : path.join(ROOT, "design");
export const OUT_ROOT = path.join(ROOT, "public", "design-projects");
export const PREVIEW_ROOT = path.join(ROOT, "public", "design-previews");
export { designCategories, DESIGN_URL_ROOT };

/** Files that are never published from a static project. */
export const STATIC_ALWAYS_EXCLUDE = new Set([
  ".git", "node_modules", ".gitignore", ".env", ".env.example", "README.md", "AUDIT.md",
]);

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Turn CLI selectors into build entries.
 *   (none)               every live project
 *   auth                 every live project in a category
 *   auth/lamp-auth       one project
 */
export function selectProjects(selectors = []) {
  const all = [];
  for (const category of designCategories) {
    for (const project of category.projects) {
      const candidates = [
        path.join(SRC_ROOT, category.id, project.slug),
        path.join(ROOT, "design-projects-src", category.id, project.slug),
        path.join(ROOT, "design", category.id, project.slug),
        path.join(ROOT, category.id, project.slug),
        path.join(SRC_ROOT, category.id, "USNAYA Techwork Solution"),
        path.join(ROOT, "design", category.id, "USNAYA Techwork Solution"),
      ];
      const srcDir = candidates.find((p) => existsSync(p)) ?? path.join(SRC_ROOT, category.id, project.slug);
      all.push({
        category,
        project,
        id: `${category.id}/${project.slug}`,
        srcDir,
        outDir: path.join(OUT_ROOT, category.id, project.slug),
        base: `${designProjectUrl(category, project)}/`,
        url: designProjectUrl(category, project),
        previewFile: path.join(ROOT, "public", designPreviewUrl(category, project)),
        kind: project.kind ?? (existsSync(path.join(srcDir, "package.json")) ? "vite" : "static"),
      });
    }
  }
  const wanted = selectors.length
    ? all.filter((e) => selectors.some((s) => e.id === s || e.category.id === s))
    : all;
  if (selectors.length && wanted.length === 0) {
    throw new Error(`No project matches: ${selectors.join(", ")}. Valid: ${all.map((e) => e.id).join(", ")}`);
  }
  return wanted;
}

export function validateConfig() {
  const errors = [];
  const cats = new Set();
  for (const c of designCategories) {
    if (!SLUG.test(c.id)) errors.push(`category id "${c.id}" must be lowercase-hyphenated`);
    if (cats.has(c.id)) errors.push(`duplicate category id "${c.id}"`);
    cats.add(c.id);
    const slugs = new Set();
    for (const p of c.projects) {
      if (!SLUG.test(p.slug)) errors.push(`${c.id}/${p.slug}: slug must be lowercase-hyphenated`);
      if (slugs.has(p.slug)) errors.push(`duplicate slug "${c.id}/${p.slug}"`);
      slugs.add(p.slug);
    }
  }
  return errors;
}

// ---------------------------------------------------------------------------
// Reference verification
// ---------------------------------------------------------------------------

const IGNORED_REF = /^(?:data:|mailto:|tel:|javascript:|blob:|#|%23)/i;
const EXTERNAL_REF = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else yield full;
  }
}

// Inline data: URIs (e.g. SVG icons in daisyUI) can themselves contain "url(%23id)" fragments
// that are not file references. Remove them before scanning.
function stripDataUris(text) {
  return text
    .replace(/url\(\s*"data:[^"]*"\s*\)/gi, "url()")
    .replace(/url\(\s*'data:[^']*'\s*\)/gi, "url()")
    .replace(/url\(\s*data:[^)]*\)/gi, "url()");
}

function refsInHtml(html) {
  html = stripDataUris(html);
  const out = [];
  for (const m of html.matchAll(/\b(?:src|href|poster)\s*=\s*(["'])([^"']*)\1/gi)) out.push(m[2]);
  for (const m of html.matchAll(/url\(\s*(["']?)([^"')]+)\1\s*\)/gi)) out.push(m[2]);
  return out;
}
function refsInCss(css) {
  css = stripDataUris(css);
  const out = [];
  for (const m of css.matchAll(/url\(\s*(["']?)([^"')]+)\1\s*\)/gi)) out.push(m[2]);
  return out;
}

/**
 * Check that every local reference in a built project resolves to a real file
 * and that nothing points outside the project's own URL base.
 * `dir` is the folder holding the built files (defaults to the published folder).
 */
export function verifyOutput(entry, dir = entry.outDir) {
  const errors = [];
  if (!existsSync(path.join(dir, "index.html"))) {
    return [`missing index.html in ${path.relative(ROOT, dir)}`];
  }

  const check = (ref, fromFile) => {
    if (!ref || IGNORED_REF.test(ref)) return;
    if (EXTERNAL_REF.test(ref)) return; // external URL: fine (not checked offline)
    const clean = ref.split("#")[0].split("?")[0];
    if (!clean) return;
    const rel = path.relative(dir, fromFile);
    let target;
    if (clean.startsWith("/")) {
      if (!clean.startsWith(entry.base)) {
        errors.push(`${rel}: "${ref}" is root-absolute and points outside ${entry.base}`);
        return;
      }
      target = path.join(dir, decodeURI(clean.slice(entry.base.length)));
    } else if (fromFile.endsWith(".html")) {
      errors.push(`${rel}: "${ref}" is relative; it breaks when served without a trailing slash`);
      return;
    } else {
      target = path.resolve(path.dirname(fromFile), decodeURI(clean)); // CSS-relative is fine
    }
    if (!existsSync(target) || !statSync(target).isFile()) errors.push(`${rel}: "${ref}" -> file not found`);
  };

  for (const file of walk(dir)) {
    if (file.endsWith(".html")) for (const r of refsInHtml(readFileSync(file, "utf8"))) check(r, file);
    else if (file.endsWith(".css")) for (const r of refsInCss(readFileSync(file, "utf8"))) check(r, file);
  }

  const manifest = path.join(dir, "manifest.webmanifest");
  if (existsSync(manifest)) {
    try {
      const m = JSON.parse(readFileSync(manifest, "utf8"));
      const inBase = (u) => typeof u !== "string" || !u.startsWith("/") || u.startsWith(entry.base);
      if (!inBase(m.start_url)) errors.push(`manifest.webmanifest: start_url "${m.start_url}" escapes ${entry.base}`);
      for (const i of m.icons ?? []) if (!inBase(i.src)) errors.push(`manifest.webmanifest: icon "${i.src}" escapes ${entry.base}`);
    } catch {
      errors.push("manifest.webmanifest is not valid JSON");
    }
  }
  return errors;
}
