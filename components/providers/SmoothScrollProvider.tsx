"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";

const HEADER_OFFSET = 76; // sticky nav height, px

type ScrollTarget = string | number | HTMLElement;
type ScrollOptions = { offset?: number; immediate?: boolean };

interface SmoothScrollContextValue {
  scrollTo: (target: ScrollTarget, options?: ScrollOptions) => void;
  lenis: Lenis | null;
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  scrollTo: () => {},
  lenis: null,
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Keep in-page anchor links offset below the sticky header.
    function handleAnchorClick(e: MouseEvent) {
      const link = (e.target as HTMLElement).closest("a");
      const href = link?.getAttribute("href");
      if (!href || !href.startsWith("#") || href.length < 2) return;
      const el = document.querySelector<HTMLElement>(href);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -HEADER_OFFSET });
      if (!el.hasAttribute("tabindex") && !el.matches("a,button,input,select,textarea")) {
        el.setAttribute("tabindex", "-1");
      }
      el.focus({ preventScroll: true });
    }

    document.addEventListener("click", handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = (target: ScrollTarget, options: ScrollOptions = {}) => {
    if (typeof window === "undefined") return;
    const offset = options.offset ?? -HEADER_OFFSET;

    if (lenisRef.current && !options.immediate && !prefersReducedMotion()) {
      lenisRef.current.scrollTo(target, { offset });
      return;
    }

    // Fallback native scroll
    const behavior: ScrollBehavior = options.immediate || prefersReducedMotion() ? "auto" : "smooth";
    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior });
      return;
    }
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: Math.max(0, top), behavior });
  };

  return (
    <SmoothScrollContext.Provider value={{ scrollTo, lenis: lenisRef.current }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
