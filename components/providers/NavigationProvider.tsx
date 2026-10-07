"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSmoothScroll } from "./SmoothScrollProvider";

export type IsolatedSection =
  | "about"
  | "experience"
  | "projects"
  | "designs"
  | "skills"
  | "education"
  | "contact"
  | null;

interface NavigationContextValue {
  isolatedSection: IsolatedSection;
  navigateToSection: (section: string) => void;
  navigateToHero: () => void;
}

const NavigationContext = createContext<NavigationContextValue>({
  isolatedSection: null,
  navigateToSection: () => {},
  navigateToHero: () => {},
});

export function useNavigation() {
  return useContext(NavigationContext);
}

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [isolatedSection, setIsolatedSection] = useState<IsolatedSection>(null);
  const { scrollTo } = useSmoothScroll();

  // Scroll to absolute top
  const resetScrollToTop = useCallback(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      scrollTo(0, { immediate: true });
    }
  }, [scrollTo]);

  // Page Refresh Behavior:
  // Always start from Hero section top; never restore previously isolated section.
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    setIsolatedSection(null);

    // Clean hash on refresh without leaving old section in history
    if (window.location.hash) {
      window.history.replaceState({ section: null }, "", window.location.pathname);
    } else {
      window.history.replaceState({ section: null }, "", window.location.pathname);
    }

    resetScrollToTop();
  }, [resetScrollToTop]);

  // Browser Back Button & History Navigation:
  // Back button from any section returns to Hero top without full reload.
  useEffect(() => {
    function handlePopState(e: PopStateEvent) {
      const targetSection = e.state?.section as IsolatedSection | undefined;
      if (targetSection) {
        setIsolatedSection(targetSection);
      } else {
        setIsolatedSection(null);
      }
      resetScrollToTop();
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [resetScrollToTop]);

  // Direct section navigation
  const navigateToSection = useCallback(
    (sectionRaw: string) => {
      const section = sectionRaw.replace(/^#/, "").toLowerCase() as IsolatedSection;
      if (!section) return;

      // Push state if coming from Hero, or replaceState if moving between isolated sections
      // so a single back button click brings the user back to Hero top.
      if (isolatedSection === null) {
        window.history.pushState({ section }, "", `#${section}`);
      } else {
        window.history.replaceState({ section }, "", `#${section}`);
      }

      setIsolatedSection(section);
      resetScrollToTop();
    },
    [isolatedSection, resetScrollToTop]
  );

  // Return to Hero top
  const navigateToHero = useCallback(() => {
    if (window.location.hash) {
      window.history.pushState({ section: null }, "", window.location.pathname);
    }
    setIsolatedSection(null);
    resetScrollToTop();
  }, [resetScrollToTop]);

  return (
    <NavigationContext.Provider
      value={{
        isolatedSection,
        navigateToSection,
        navigateToHero,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}
