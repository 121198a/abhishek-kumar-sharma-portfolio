import { create } from "zustand";
import { TOUR_STOPS } from "../data/destinations";
import { send } from "../experience/ExperienceDirector";

type TourStore = {
  active: boolean;
  index: number;
  start: () => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
  setIndex: (i: number) => void;
};

export const useTour = create<TourStore>((set, get) => ({
  active: false,
  index: -1,
  setIndex: (index) => set({ index }),
  stop: () => set({ active: false, index: -1 }),
  start: () => {
    set({ active: true, index: 0 });
    send({ type: "mode:changed", mode: "guided" });
    const target = TOUR_STOPS[0];
    if (target) send({ type: "destination:selected", destinationId: target });
  },
  next: () => {
    const { active, index } = get();
    if (!active) return;
    const nextIdx = index + 1;
    if (nextIdx < TOUR_STOPS.length) {
      set({ index: nextIdx });
      const target = TOUR_STOPS[nextIdx];
      if (target) send({ type: "destination:selected", destinationId: target });
    } else {
      get().stop();
    }
  },
  prev: () => {
    const { active, index } = get();
    if (!active) return;
    const prevIdx = Math.max(0, index - 1);
    set({ index: prevIdx });
    const target = TOUR_STOPS[prevIdx];
    if (target) send({ type: "destination:selected", destinationId: target });
  },
}));
