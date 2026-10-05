// Run with: npm run test:media
import { pickSource, shouldLoadVideo, type VideoSource } from "../lib/media-policy";
import { getHeroVideo } from "../lib/media";

let failures = 0;
const check = (ok: boolean, msg: string) => { if (!ok) { failures++; console.error("FAIL:", msg); } else console.log("ok  :", msg); };

const base = { reducedMotion: false, saveData: false, effectiveType: "4g", viewportWidth: 1440, minWidth: 768, pageHidden: false };
check(shouldLoadVideo(base) === true, "desktop, 4g, no preferences -> loads");
check(shouldLoadVideo({ ...base, reducedMotion: true }) === false, "prefers-reduced-motion -> never loads");
check(shouldLoadVideo({ ...base, saveData: true }) === false, "Save-Data -> never loads");
check(shouldLoadVideo({ ...base, effectiveType: "3g" }) === false, "3g -> never loads");
check(shouldLoadVideo({ ...base, effectiveType: "2g" }) === false, "2g -> never loads");
check(shouldLoadVideo({ ...base, viewportWidth: 390 }) === false, "phone width (390) -> poster only");
check(shouldLoadVideo({ ...base, viewportWidth: 768 }) === true, "tablet width (768) -> loads");
check(shouldLoadVideo({ ...base, pageHidden: true }) === false, "hidden tab -> does not start");
check(shouldLoadVideo({ ...base, effectiveType: undefined }) === true, "unknown connection type (Safari/Firefox) -> loads");

const S = (w: number, mime: string, bytes = 1): VideoSource => ({ src: `/videos/hero/x-${w}.${mime.includes("webm") ? "webm" : "mp4"}`, mime, width: w, bytes });
const MP4 = 'video/mp4; codecs="avc1.640028"', WEBM = 'video/webm; codecs="vp9"';
const set = [S(480, MP4, 120), S(720, MP4, 300), S(720, WEBM, 250), S(1080, MP4, 900), S(1080, WEBM, 700)];
const all = () => true;
check(pickSource(set, 1440, 1, all)?.width === 1080, "1440px screen -> largest (1080) when nothing is wider");
check(pickSource(set, 1440, 1, all)?.mime.startsWith("video/webm") === true, "equal width, WebM smaller -> WebM chosen");
check(pickSource([S(1080, MP4, 800), S(1080, WEBM, 1100)], 1440, 1, all)?.mime === MP4, "equal width, MP4 smaller -> MP4 chosen (not hard-coded to WebM)");
check(pickSource(set, 800, 1, all)?.width === 1080, "800px @1x needs >=800 -> 1080 (720 is too small)");
check(pickSource(set, 700, 1, all)?.width === 720, "700px @1x -> 720");
check(pickSource(set, 600, 2, all)?.width === 1080, "600px @2x needs 1200 -> 1080 (largest available)");
check(pickSource(set, 400, 3, (m) => m === MP4)?.mime === MP4, "browser without WebM -> falls back to MP4");
check(pickSource(set, 1440, 1, () => false) === null, "no playable type -> null (poster only)");
check(pickSource([], 1440, 1, all) === null, "empty list -> null");

import fs from "fs";
import path from "path";
const hasManifest = fs.existsSync(path.join(process.cwd(), "public", "videos", "hero", "manifest.json"));
const hv = getHeroVideo();
if (hasManifest) check(hv !== null && hv.sources.length > 0, "manifest present -> loader returns a validated manifest");
else check(hv === null, "no manifest (the default) -> no video rendered, no extra bytes");

if (failures) { console.error(`\n${failures} failure(s)`); process.exit(1); }
console.log("\nMedia policy tests passed");
