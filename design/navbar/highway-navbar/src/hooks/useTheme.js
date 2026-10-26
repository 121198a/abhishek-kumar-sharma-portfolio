import { useCallback, useEffect, useState } from "react";
// Duration multipliers: Slow/Cinematic = longer transitions, Fast = shorter.
export const PRESETS = { Slow: 1.7, Normal: 1, Fast: 0.55, Cinematic: 2.6 };
const THEMES = ["dark", "light"];
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
  // Stored values are untrusted input: accept only known themes.
  const [theme, setTheme] = useState(() => {
    const v = read(key, fallback);
    return THEMES.includes(v) ? v : fallback;
  });
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
  const [force, setForce] = useState(() => read(`${key}-force`, "0") === "1");
  const systemReduced = useReducedMotion();
  useEffect(() => write(key, preset), [preset, key]);
  useEffect(() => write(`${key}-force`, force ? "1" : "0"), [force, key]);
  // calm = the OS asks for reduced motion and the user has not opted back in.
  // Calm keeps small in-place motion (needle, wheels, hovers) but stops scrolling scenery and swaps become instant.
  const calm = systemReduced && !force;
  const mult = calm ? 0.01 : PRESETS[preset];
  return { preset, setPreset, mult, calm, systemReduced, force, setForce };
}
