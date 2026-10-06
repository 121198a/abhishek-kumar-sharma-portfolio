"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

const MOTION_PREFERENCE_KEY = "portfolio-motion-preference";

type MotionPreferenceContextValue = {
  motionEnabled: boolean;
  ready: boolean;
  toggleMotion: () => void;
};

const MotionPreferenceContext = createContext<MotionPreferenceContextValue>({
  motionEnabled: true,
  ready: false,
  toggleMotion: () => {},
});

export function MotionPreferenceProvider({ children }: { children: React.ReactNode }) {
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [ready, setReady] = useState(false);
  const preferenceRef = useRef<boolean | null>(null);
  const hasAppliedInitialPreference = useRef(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let savedPreference: string | null = null;
    try {
      savedPreference = localStorage.getItem(MOTION_PREFERENCE_KEY);
    } catch {
      // Use the system setting if storage is unavailable.
    }

    if (savedPreference === "enabled" || savedPreference === "reduced") {
      preferenceRef.current = savedPreference === "enabled";
      setMotionEnabled(preferenceRef.current);
    } else {
      preferenceRef.current = null;
      setMotionEnabled(!motionQuery.matches);
    }
    setReady(true);

    const handleMotionPreferenceChange = (event: MediaQueryListEvent) => {
      if (preferenceRef.current === null) setMotionEnabled(!event.matches);
    };
    motionQuery.addEventListener("change", handleMotionPreferenceChange);

    return () => motionQuery.removeEventListener("change", handleMotionPreferenceChange);
  }, []);

  useEffect(() => {
    if (!hasAppliedInitialPreference.current) {
      hasAppliedInitialPreference.current = true;
      return;
    }
    document.documentElement.classList.toggle("motion-enabled", motionEnabled);
    document.documentElement.classList.toggle("motion-reduced", !motionEnabled);
  }, [motionEnabled]);

  const toggleMotion = () => {
    const nextMotionEnabled = !motionEnabled;
    preferenceRef.current = nextMotionEnabled;
    try {
      localStorage.setItem(MOTION_PREFERENCE_KEY, nextMotionEnabled ? "enabled" : "reduced");
    } catch {
      // Keep the in-memory preference for this page session.
    }
    setMotionEnabled(nextMotionEnabled);
  };

  return (
    <MotionPreferenceContext.Provider value={{ motionEnabled, ready, toggleMotion }}>
      {children}
    </MotionPreferenceContext.Provider>
  );
}

export function useMotionPreference() {
  return useContext(MotionPreferenceContext);
}