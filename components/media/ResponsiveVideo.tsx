"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { pickSource, shouldLoadVideo, type VideoManifest } from "@/lib/media-policy";
import { useMotionPreference } from "@/components/providers/MotionPreferenceProvider";

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
  const { motionEnabled, ready } = useMotionPreference();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false); // a source was loaded
  const [userPaused, setUserPaused] = useState(false);
  const userPausedRef = useRef(false);
  userPausedRef.current = userPaused;

  const tryLoad = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;

    // Respect portfolio user motion preference if set, falling back to system media query
    const isReduced = ready
      ? !motionEnabled
      : window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Respect user's explicit Save-Data mode when enabled on metered connections
    const effectiveType = conn?.saveData ? conn?.effectiveType : undefined;

    const allowed = shouldLoadVideo({
      reducedMotion: isReduced,
      saveData: !!conn?.saveData,
      effectiveType,
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

    const source = pickSource(manifest.sources, window.innerWidth, window.devicePixelRatio || 1, (m) => v.canPlayType(m) !== "");
    if (!source) return;

    // Guarantee browser recognizes the element as muted for autoplay policy
    v.defaultMuted = true;
    v.muted = true;

    if (v.getAttribute("src") !== source.src) {
      v.src = source.src;
      v.load();
    }

    setActive(true);

    if (!userPausedRef.current) {
      const p = v.play();
      if (p !== undefined) {
        p.catch(() => {
          // Autoplay policy deferred until user interaction; do NOT set userPaused to true!
        });
      }
    }
  }, [manifest.sources, minWidth, motionEnabled, ready]);

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.defaultMuted = true;
      v.muted = true;
    }

    // Initialize playback promptly after hydration
    const timer = window.setTimeout(tryLoad, 150);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", tryLoad);
    window.addEventListener("resize", tryLoad);

    // One-time interaction listener ensures deferred autoplay starts as soon as user touches or scrolls
    const onUserGesture = () => {
      const el = videoRef.current;
      if (el && !userPausedRef.current && el.paused) {
        el.defaultMuted = true;
        el.muted = true;
        el.play().catch(() => {});
      }
    };
    window.addEventListener("pointerdown", onUserGesture, { once: true, passive: true });
    window.addEventListener("scroll", onUserGesture, { once: true, passive: true });
    window.addEventListener("keydown", onUserGesture, { once: true, passive: true });

    const onVisibility = () => {
      const el = videoRef.current;
      if (!el || !el.getAttribute("src")) return;
      if (document.hidden) el.pause();
      else if (!userPausedRef.current) el.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);

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
      window.clearTimeout(timer);
      mq.removeEventListener("change", tryLoad);
      window.removeEventListener("resize", tryLoad);
      window.removeEventListener("pointerdown", onUserGesture);
      window.removeEventListener("scroll", onUserGesture);
      window.removeEventListener("keydown", onUserGesture);
      document.removeEventListener("visibilitychange", onVisibility);
      io?.disconnect();
    };
  }, [tryLoad]);

  function toggle() {
    const v = videoRef.current;
    if (!v) return;
    if (userPaused) {
      setUserPaused(false);
      v.defaultMuted = true;
      v.muted = true;
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
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
          className="h-full w-full object-cover opacity-80 dark:opacity-75 transition-opacity duration-700"
        />
      </div>
      {active && (
        <button
          type="button"
          onClick={toggle}
          aria-pressed={userPaused}
          aria-label={userPaused ? "Play background video" : "Pause background video"}
          className="absolute right-4 top-20 z-20 sm:top-24 btn-icon"
        >
          <span aria-hidden="true">{userPaused ? "▶" : "❚❚"}</span>
        </button>
      )}
    </>
  );
}
