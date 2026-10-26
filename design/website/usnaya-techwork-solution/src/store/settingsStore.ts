import { create } from "zustand";

export type Quality = "high" | "medium" | "low";
type Settings = { volume: number; muted: boolean; quality: Quality; reducedMotion: boolean };
const KEY = "usnaya.settings.v1";

function systemReducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function load(): Settings {
  const base: Settings = { volume: 0.6, muted: false, quality: "medium", reducedMotion: systemReducedMotion() };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return base;
    const p = JSON.parse(raw) as Partial<Settings>;
    return {
      volume: typeof p.volume === "number" ? Math.min(1, Math.max(0, p.volume)) : base.volume,
      muted: typeof p.muted === "boolean" ? p.muted : base.muted,
      quality: p.quality === "low" || p.quality === "medium" || p.quality === "high" ? p.quality : base.quality,
      reducedMotion: typeof p.reducedMotion === "boolean" ? p.reducedMotion : base.reducedMotion,
    };
  } catch {
    return base;
  }
}

type SettingsStore = Settings & { set: (patch: Partial<Settings>) => void };

export const useSettings = create<SettingsStore>((set, get) => ({
  ...load(),
  set: (patch) => {
    set(patch);
    const { volume, muted, quality, reducedMotion } = get();
    try {
      localStorage.setItem(KEY, JSON.stringify({ volume, muted, quality, reducedMotion }));
    } catch {
      /* storage unavailable: settings last for this session only */
    }
  },
}));
