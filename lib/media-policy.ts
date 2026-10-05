// Pure, client-safe logic for the optional hero background video.
// No fs / DOM access here so it can be unit-tested (tests/media.ts).

export type VideoSource = {
  src: string; // e.g. /videos/hero/hero-1080.webm
  mime: string; // full MIME incl. codecs, used with video.canPlayType()
  width: number; // pixel width of the encoded file
  bytes: number;
};

export type VideoManifest = {
  poster: { src: string; width: number; height: number };
  duration: number; // seconds
  sources: VideoSource[];
};

export type PolicyInput = {
  reducedMotion: boolean;
  saveData: boolean;
  effectiveType?: string; // navigator.connection.effectiveType when available
  viewportWidth: number;
  minWidth: number; // below this width only the poster is shown
  pageHidden: boolean;
};

/** Should the video file be downloaded and played at all? */
export function shouldLoadVideo(i: PolicyInput): boolean {
  if (i.reducedMotion || i.saveData || i.pageHidden) return false;
  if (i.viewportWidth < i.minWidth) return false;
  if (i.effectiveType && ["slow-2g", "2g", "3g"].includes(i.effectiveType)) return false;
  return true;
}

/**
 * Choose the smallest playable file that still covers the screen
 * (viewport width x device pixel ratio, capped at 2x). Falls back to the largest
 * playable file. At equal width the smaller file (by bytes) wins.
 */
export function pickSource(
  sources: VideoSource[],
  viewportWidth: number,
  dpr: number,
  canPlay: (mime: string) => boolean
): VideoSource | null {
  const playable = sources.filter((s) => canPlay(s.mime));
  if (playable.length === 0) return null;
  const target = viewportWidth * Math.min(Math.max(dpr, 1), 2);
  const widths = [...new Set(playable.map((s) => s.width))].sort((a, b) => a - b);
  const width = widths.find((w) => w >= target) ?? widths[widths.length - 1];
  // Same width in several codecs: take whichever file is actually smaller
  // (WebM is usually smaller, but not always - decide from real byte sizes).
  return playable.filter((s) => s.width === width).sort((a, b) => a.bytes - b.bytes)[0];
}
