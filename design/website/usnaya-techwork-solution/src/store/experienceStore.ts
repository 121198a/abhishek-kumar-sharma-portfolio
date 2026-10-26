import { create } from "zustand";
import { director, type ExperienceSnapshot } from "../experience/ExperienceDirector";
import type { ExperienceContext } from "../experience/ExperienceMachine";

export type StateValue = ExperienceSnapshot["value"];

type NearbyTarget = { kind: "character" | "door" | "gate"; id: string; label: string; verb: string } | null;

type ExperienceStore = {
  value: StateValue;
  /** Top-level state name, e.g. "managerDoor". */
  name: string;
  /** Sub-state, e.g. "knocking". */
  sub: string | null;
  context: ExperienceContext;
  nearby: NearbyTarget;
  setNearby: (n: NearbyTarget) => void;
  matches: (...names: string[]) => boolean;
};

function names(value: StateValue): [string, string | null] {
  if (typeof value === "string") return [value, null];
  const k = Object.keys(value)[0] ?? "";
  const v = (value as Record<string, unknown>)[k];
  return [k, typeof v === "string" ? v : null];
}

export const useExperience = create<ExperienceStore>((set, get) => {
  const snap = director.getSnapshot();
  const [name, sub] = names(snap.value);
  return {
    value: snap.value,
    name,
    sub,
    context: snap.context,
    nearby: null,
    setNearby: (n) => {
      const cur = get().nearby;
      if (cur?.id === n?.id && cur?.kind === n?.kind && cur?.label === n?.label && cur?.verb === n?.verb) return;
      set({ nearby: n });
    },
    matches: (...ns) => ns.includes(get().name),
  };
});

director.subscribe((s) => {
  const [name, sub] = names(s.value);
  useExperience.setState({ value: s.value, name, sub, context: s.context });
});
director.start();

/** States in which a conversation panel is shown. */
export const DIALOGUE_STATES = ["reception", "dialogue", "managerDialogue"] as const;
