"use client";

import React, { createContext, useContext, useEffect } from "react";

// Native smooth scrolling. Replaces the Lenis library (extra JS plus a
// permanent requestAnimationFrame loop): CSS `scroll-behavior` in globals.css
// handles smoothing and already switches off for prefers-reduced-motion.
// The API (`useSmoothScroll().scrollTo`) is unchanged for existing consumers.

const HEADER_OFFSET = 76; // sticky nav height, px

type ScrollTarget = string | number | HTMLElement;
type ScrollOptions = { offset?: number; immediate?: boolean };

interface SmoothScrollContextValue {
  scrollTo: (target: ScrollTarget, options?: ScrollOptions) => void;
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollToTarget(target: ScrollTarget, options: ScrollOptions = {}) {
  if (typeof window === "undefined") return;
  const behavior: ScrollBehavior = options.immediate || prefersReducedMotion() ? "auto" : "smooth";
  const offset = options.offset ?? -HEADER_OFFSET;

  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior });
    return;
  }
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top: Math.max(0, top), behavior });
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({ scrollTo: scrollToTarget });

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Keep in-page anchor links offset below the sticky header.
    function handleAnchorClick(e: MouseEvent) {
      const link = (e.target as HTMLElement).closest("a");
      const href = link?.getAttribute("href");
      if (!href || !href.startsWith("#") || href.length < 2) return;
      const el = document.querySelector<HTMLElement>(href);
      if (!el) return;
      e.preventDefault();
      scrollToTarget(el);
      // Keep keyboard / screen-reader position in sync with the scroll
      // (we cancelled the browser's default jump, which would have done this).
      if (!el.hasAttribute("tabindex") && !el.matches("a,button,input,select,textarea")) el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    }
    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  return <SmoothScrollContext.Provider value={{ scrollTo: scrollToTarget }}>{children}</SmoothScrollContext.Provider>;
}
