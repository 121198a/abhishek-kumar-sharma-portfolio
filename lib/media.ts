// Server-only: finds the optional hero video produced by `npm run media:optimize`.
// No manifest (the default) = no video, no extra bytes, nothing rendered.

import fs from "fs";
import path from "path";
import type { VideoManifest } from "@/lib/media-policy";

const DIR = "/videos/hero";

function exists(publicPath: string): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", publicPath));
}

export function getHeroVideo(): VideoManifest | null {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), "public", DIR, "manifest.json"), "utf8");
    const m = JSON.parse(raw) as VideoManifest;
    if (!m || !Array.isArray(m.sources) || m.sources.length === 0) return null;
    if (!m.poster || !m.poster.src.startsWith(DIR + "/") || !exists(m.poster.src)) return null;
    const ok = m.sources.every(
      (s) =>
        typeof s.src === "string" &&
        s.src.startsWith(DIR + "/") &&
        typeof s.mime === "string" &&
        Number.isFinite(s.width) &&
        exists(s.src)
    );
    return ok ? m : null;
  } catch {
    return null;
  }
}
