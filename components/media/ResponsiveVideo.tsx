"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { pickSource, shouldLoadVideo, type VideoManifest } from "@/lib/media-policy";

type Props = {
  manifest: VideoManifest;
  /** Below this viewport width only the poster is shown (saves mobile data). */
  minWidth?: number;
};

type NetworkInformation = { effectiveType?: string; saveData?: boolean };

// Decorative looping background video.
// - Poster is in the server HTML (nothing waits on JS for first paint).
// - The video file is only requested after hydration, and only when policy allows:
//   not reduced-motion, not Save-Data, not 2g/3g, wide enough viewport, tab visible.
// - Pauses when scrolled out of view or the tab is hidden (CPU/battery).
// - Visible pause/play control (WCAG 2.2.2: auto-playing motion > 5 s needs one).
export default function ResponsiveVideo({ manifest, minWidth = 768 }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false); // a source was loaded
  const [userPaused, setUserPaused] = useState(false);
  const userPausedRef = useRef(false);
  userPausedRef.current = userPaused;

  const tryLoad = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    const allowed = shouldLoadVideo({
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      saveData: !!conn?.saveData,
      effectiveType: conn?.effectiveType,
      viewportWidth: window.innerWidth,
      minWidth,
      pageHidden: document.hidden,
    });
    if (!allowed) {
      if (v.getAttribute("src")) {
        v.pause();
        v.removeAttribute("src");
        v.load();
      }
      setActive(false);
      return;
    }
    if (v.getAttribute("src")) return; // already loaded
    const source = pickSource(manifest.sources, window.innerWidth, window.devicePixelRatio || 1, (m) => v.canPlayType(m) !== "");
    if (!source) return;
    v.src = source.src;
    v.load();
    setActive(true);
    if (!userPausedRef.current) v.play().catch(() => setUserPaused(true));
  }, [manifest.sources, minWidth]);

  useEffect(() => {
    // Wait until the browser is idle so the video never competes with first paint.
    // (Safari has no requestIdleCallback, hence the runtime check.)
    const hasIdle = typeof window.requestIdleCallback === "function";
    const handle = hasIdle ? window.requestIdleCallback(tryLoad, { timeout: 2000 }) : window.setTimeout(tryLoad, 600);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", tryLoad);
    window.addEventListener("resize", tryLoad);

    const onVisibility = () => {
      const v = videoRef.current;
      if (!v || !v.getAttribute("src")) return;
      if (document.hidden) v.pause();
      else if (!userPausedRef.current) v.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);

    const v = videoRef.current;
    const io =
      v && "IntersectionObserver" in window
        ? new IntersectionObserver(([entry]) => {
            if (!v.getAttribute("src")) return;
            if (entry.isIntersecting) {
              if (!userPausedRef.current) v.play().catch(() => {});
            } else v.pause();
          })
        : null;
    if (v && io) io.observe(v);

    return () => {
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      mq.removeEventListener("change", tryLoad);
      window.removeEventListener("resize", tryLoad);
      document.removeEventListener("visibilitychange", onVisibility);
      io?.disconnect();
    };
  }, [tryLoad]);

  function toggle() {
    const v = videoRef.current;
    if (!v) return;
    if (userPaused) {
      setUserPaused(false);
      v.play().catch(() => {});
    } else {
      setUserPaused(true);
      v.pause();
    }
  }

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          poster={manifest.poster.src}
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
          className="h-full w-full object-cover opacity-30"
        />
        {/* Keeps hero text readable over any footage. */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-bg/50 to-bg" />
      </div>
      {active && (
        <button
          type="button"
          onClick={toggle}
          aria-pressed={userPaused}
          aria-label={userPaused ? "Play background video" : "Pause background video"}
          className="absolute right-4 top-20 z-20 sm:top-24 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-ink/30 bg-bg/70 px-3 text-xs font-semibold text-ink transition-colors hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple"
        >
          <span aria-hidden="true">{userPaused ? "▶" : "❚❚"}</span>
        </button>
      )}
    </>
  );
}
