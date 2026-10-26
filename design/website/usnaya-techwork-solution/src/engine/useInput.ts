import { useEffect } from "react";
import { send } from "../experience/ExperienceDirector";
import { MANAGER_DOOR_TARGET } from "../experience/ExperienceEvents";
import { useExperience } from "../store/experienceStore";
import { audio } from "./AudioManager";
import { world } from "./worldRef";

const keys = new Set<string>();
let touchInput = { x: 0, z: 0 };

export function setTouchInput(x: number, z: number) {
  touchInput = { x, z };
}

export function getMoveInput() {
  const up = keys.has("w") || keys.has("arrowup");
  const down = keys.has("s") || keys.has("arrowdown");
  const left = keys.has("a") || keys.has("arrowleft");
  const right = keys.has("d") || keys.has("arrowright");
  const kx = (right ? 1 : 0) - (left ? 1 : 0);
  const kz = (up ? 1 : 0) - (down ? 1 : 0);
  const x = kx !== 0 ? kx : touchInput.x;
  const z = kz !== 0 ? kz : touchInput.z;
  return { x, z, forward: world.camForward };
}

const typing = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);

/** Sends the current "interact" action to the Director. Shared by key press and on-screen button. */
export function interact() {
  const n = useExperience.getState().nearby;
  if (!n) return;
  if (n.kind === "gate") {
    // the gate is world state, not story progression, so it does not go through the Director
    world.sim.toggleGate();
    audio.play("door");
    return;
  }
  send({ type: "interaction:started", targetId: n.kind === "door" ? MANAGER_DOOR_TARGET : n.id });
}

export function useInput() {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      audio.unlock();
      if (typing(e.target)) return;
      const k = e.key.toLowerCase();
      if (k === "escape") {
        const paused = useExperience.getState().context.paused;
        send({ type: paused ? "experience:resumed" : "experience:paused" });
        return;
      }
      if (k === "e") {
        interact();
        return;
      }
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) {
        keys.add(k);
        if (k.startsWith("arrow")) e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase());
    const blur = () => keys.clear();
    const pointer = () => audio.unlock();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    window.addEventListener("pointerdown", pointer);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
      window.removeEventListener("pointerdown", pointer);
      keys.clear();
    };
  }, []);
}
