import { create } from "zustand";
import { send } from "../experience/ExperienceDirector";

type Step = "renderer" | "scene" | "fonts";
const STEPS: Step[] = ["renderer", "scene", "fonts"];

type LoadingStore = {
  done: Set<Step>;
  progress: number;
  mark: (s: Step) => void;
  reset: () => void;
};

let readyTimer: number | null = null;

export const useLoading = create<LoadingStore>((set, get) => ({
  done: new Set(),
  progress: 0,
  mark: (s) => {
    if (get().done.has(s)) return;
    const done = new Set(get().done).add(s);
    set({ done, progress: done.size / STEPS.length });
    if (done.size === STEPS.length) {
      if (readyTimer !== null) window.clearTimeout(readyTimer);
      readyTimer = window.setTimeout(() => {
        readyTimer = null;
        send({ type: "assets:ready" });
      }, 350);
    }
  },
  reset: () => {
    if (readyTimer !== null) {
      window.clearTimeout(readyTimer);
      readyTimer = null;
    }
    set({ done: new Set(), progress: 0 });
  },
}));
