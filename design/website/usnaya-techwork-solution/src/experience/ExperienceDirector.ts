import { createActor, type SnapshotFrom } from "xstate";
import { experienceMachine } from "./ExperienceMachine";
import type { ExperienceEvent } from "./ExperienceEvents";

export type ExperienceSnapshot = SnapshotFrom<typeof experienceMachine>;

/** Single running Director. All systems send events here; none mutate state directly. */
export const director = createActor(experienceMachine);

export const send = (e: ExperienceEvent) => director.send(e);

/** Dev-only event log shown in the debug panel. */
export const eventLog: string[] = [];
export function logEvent(e: ExperienceEvent) {
  eventLog.unshift(`${new Date().toLocaleTimeString()}  ${e.type}`);
  if (eventLog.length > 12) eventLog.pop();
}
