export type Mode = "guided" | "free";

/** Typed events. Only the Experience Director (the machine) decides what they do. */
export type ExperienceEvent =
  | { type: "assets:ready" }
  | { type: "asset:failed"; reason: string }
  | { type: "experience:start" }
  | { type: "destination:selected"; destinationId: string }
  | { type: "navigation:started"; routeId: number }
  | { type: "navigation:arrived"; routeId: number }
  | { type: "interaction:started"; targetId: string }
  | { type: "dialogue:completed" }
  | { type: "mode:changed"; mode: Mode }
  | { type: "door:knocked" }
  | { type: "door:opened" }
  | { type: "skip:requested" }
  | { type: "experience:paused" }
  | { type: "experience:resumed" }
  | { type: "experience:exit" }
  | { type: "experience:restart" }
  | { type: "conversation:failed"; reason: string };

export const MANAGER_DOOR_TARGET = "door:manager";
