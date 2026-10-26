import { useCallback, useEffect, useState } from "react";
// Duration multipliers: Slow/Cinematic = longer transitions, Fast = shorter.
export const PRESETS = { Slow: 1.7, Normal: 1, Fast: 0.55, Cinematic: 2.6 };
const read = (k, d) => {
  try {
    return localStorage.getItem(k) || d;
  } catch {
    return d;
  }
};
const write = (k, v) => {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* storage unavailable */
  }
};
export function useTheme(key, fallback) {
  const [theme, setTheme] = useState(() => read(key, fallback));
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    write(key, theme);
  }, [theme, key]);
  const toggle = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    [],
  );
  return [theme, toggle];
}
export function useReducedMotion() {
  const q = "(prefers-reduced-motion: reduce)";
  const [r, setR] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const f = () => setR(m.matches);
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, []);
  return r;
}
export function useMotion(key) {
  const [preset, setPreset] = useState(() =>
    PRESETS[read(key, "Normal")] ? read(key, "Normal") : "Normal",
  );
  const reduced = useReducedMotion();
  useEffect(() => write(key, preset), [preset, key]);
  // Reduced motion always wins over the chosen preset.
  const mult = reduced ? 0.01 : PRESETS[preset];
  return { preset, setPreset, mult, reduced };
}
