#!/usr/bin/env node
// Turns ONE original video (any size, even 4K) into a small responsive set for
// the hero background, plus a poster and a manifest the site reads.
//
//   npm run media:optimize -- path/to/original.mp4
//   npm run media:optimize -- path/to/original.mov --max-height 720
//
// Needs ffmpeg and ffprobe on your PATH (https://ffmpeg.org/download.html).
// Output: public/videos/hero/{hero-1080.mp4,hero-1080.webm,hero-720.*,hero-480.mp4,hero-poster.webp,manifest.json}
// Nothing is uploaded anywhere. Frames are re-encoded only (scaled + compressed);
// no filter, upscaler, AI model or retouching is applied, so faces are never altered.

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const input = args.find((a) => !a.startsWith("--"));
const mh = args.indexOf("--max-height");
const maxHeight = mh >= 0 ? Number(args[mh + 1]) : 1080;
if (!input || !fs.existsSync(input) || !Number.isFinite(maxHeight)) {
  console.error("Usage: npm run media:optimize -- <video-file> [--max-height 1080]");
  process.exit(1);
}

function run(cmd, a, quiet = true) {
  const r = spawnSync(cmd, a, { encoding: "utf8" });
  if (r.error) {
    console.error(`Could not run "${cmd}". Install ffmpeg and make sure it is on your PATH.`);
    process.exit(1);
  }
  if (r.status !== 0) {
    console.error(`${cmd} failed:\n${r.stderr?.split("\n").slice(-12).join("\n")}`);
    process.exit(1);
  }
  return r.stdout;
}

const probe = JSON.parse(run("ffprobe", ["-v", "error", "-print_format", "json", "-show_streams", "-show_format", input]));
const v = probe.streams.find((s) => s.codec_type === "video");
if (!v) { console.error("No video stream found."); process.exit(1); }
const duration = Number(probe.format.duration);
console.log(`Source: ${v.width}x${v.height}, ${duration.toFixed(1)} s, ${(fs.statSync(input).size / 1e6).toFixed(1)} MB`);
if (duration > 15) console.warn("WARNING: a background loop should be about 6-12 s. Trim it first, or the files will be large.");

const out = path.join(process.cwd(), "public", "videos", "hero");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const ladder = [1080, 720, 480].filter((h) => h <= maxHeight && h <= Math.max(v.height, 480));
const sources = [];
const encode = (h, ext, codecArgs, mime) => {
  const file = path.join(out, `hero-${h}.${ext}`);
  console.log(`Encoding ${path.basename(file)} ...`);
  // -an: no audio (muted background video; audio would only add bytes)
  run("ffmpeg", ["-y", "-v", "error", "-i", input, "-an", "-vf", `scale=-2:${h},fps=30`, "-pix_fmt", "yuv420p", ...codecArgs, file]);
  const p = JSON.parse(run("ffprobe", ["-v", "error", "-print_format", "json", "-show_streams", file]));
  const s = p.streams.find((x) => x.codec_type === "video");
  const bytes = fs.statSync(file).size;
  sources.push({ src: `/videos/hero/hero-${h}.${ext}`, mime, width: s.width, bytes });
  if (h >= 1080 && bytes > 4_000_000) console.warn(`WARNING: ${path.basename(file)} is ${(bytes / 1e6).toFixed(1)} MB. Consider a shorter loop or --max-height 720.`);
};

for (const h of ladder) {
  encode(h, "mp4", ["-c:v", "libx264", "-profile:v", "high", "-preset", "slow", "-crf", "24", "-movflags", "+faststart"], 'video/mp4; codecs="avc1.640028"');
  if (h >= 720) encode(h, "webm", ["-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "34", "-row-mt", "1"], 'video/webm; codecs="vp9"');
}

const posterFile = path.join(out, "hero-poster.webp");
run("ffmpeg", ["-y", "-v", "error", "-ss", duration > 2 ? "1" : "0", "-i", input, "-frames:v", "1", "-vf", `scale=-2:${Math.min(maxHeight, 1080)}`, "-c:v", "libwebp", "-quality", "80", posterFile]);
const pp = JSON.parse(run("ffprobe", ["-v", "error", "-print_format", "json", "-show_streams", posterFile])).streams[0];

fs.writeFileSync(
  path.join(out, "manifest.json"),
  JSON.stringify({ poster: { src: "/videos/hero/hero-poster.webp", width: pp.width, height: pp.height }, duration: Number(duration.toFixed(2)), sources }, null, 2) + "\n"
);

console.log("\nDone. Files in public/videos/hero:");
for (const s of sources) console.log(`  ${s.src.padEnd(34)} ${s.width}px  ${(s.bytes / 1e6).toFixed(2)} MB  ${s.mime.split(";")[0]}`);
console.log(`  /videos/hero/hero-poster.webp       ${(fs.statSync(posterFile).size / 1e3).toFixed(0)} KB`);
console.log("\nRestart the dev server / rebuild and the hero shows the video. Delete public/videos/hero to remove it.");
