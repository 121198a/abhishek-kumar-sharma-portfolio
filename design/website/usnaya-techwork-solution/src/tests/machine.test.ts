import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createActor } from "xstate";
import { experienceMachine, KNOCK_DELAY, OPENING_DELAY, PERMISSION_DELAY } from "../experience/ExperienceMachine";
import { MANAGER_DOOR_TARGET } from "../experience/ExperienceEvents";

function start() {
  const a = createActor(experienceMachine);
  a.start();
  return a;
}
const name = (a: ReturnType<typeof start>) => {
  const v = a.getSnapshot().value;
  return typeof v === "string" ? v : Object.keys(v)[0];
};
function toReception(a: ReturnType<typeof start>) {
  a.send({ type: "assets:ready" });
  a.send({ type: "experience:start" });
  a.send({ type: "navigation:arrived", routeId: a.getSnapshot().context.routeId });
}

describe("Experience Director", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("walks loading -> welcome -> arrival -> reception", () => {
    const a = start();
    expect(name(a)).toBe("loading");
    a.send({ type: "assets:ready" });
    expect(name(a)).toBe("welcome");
    a.send({ type: "experience:start" });
    expect(name(a)).toBe("arrival");
    a.send({ type: "navigation:arrived", routeId: a.getSnapshot().context.routeId });
    expect(name(a)).toBe("reception");
    expect(a.getSnapshot().context.conversationId).toBe("reception-intro");
  });

  it("ignores events that are illegal for the current state", () => {
    const a = start();
    a.send({ type: "destination:selected", destinationId: "it-department" });
    a.send({ type: "door:knocked" });
    expect(name(a)).toBe("loading");
  });

  it("ignores an unknown destination", () => {
    const a = start();
    toReception(a);
    a.send({ type: "destination:selected", destinationId: "roof-garden" });
    expect(name(a)).toBe("reception");
  });

  it("ignores stale arrival events from a cancelled route", () => {
    const a = start();
    toReception(a);
    a.send({ type: "destination:selected", destinationId: "it-department" });
    const oldRoute = a.getSnapshot().context.routeId;
    a.send({ type: "destination:selected", destinationId: "hr-department" });
    expect(a.getSnapshot().context.routeId).toBe(oldRoute + 1);
    a.send({ type: "navigation:arrived", routeId: oldRoute });
    expect(name(a)).toBe("guidedTravel");
    a.send({ type: "navigation:arrived", routeId: oldRoute + 1 });
    expect(name(a)).toBe("dialogue");
    expect(a.getSnapshot().context.conversationId).toBe("hr-exec-intro");
  });

  it("ignores a duplicate click on the same destination while travelling", () => {
    const a = start();
    toReception(a);
    a.send({ type: "destination:selected", destinationId: "it-department" });
    const r = a.getSnapshot().context.routeId;
    a.send({ type: "destination:selected", destinationId: "it-department" });
    a.send({ type: "destination:selected", destinationId: "it-department" });
    expect(a.getSnapshot().context.routeId).toBe(r);
  });

  it("skip during travel only requests a snap; arrival still comes from the runtime", () => {
    const a = start();
    toReception(a);
    a.send({ type: "destination:selected", destinationId: "sales-department" });
    a.send({ type: "skip:requested" });
    expect(name(a)).toBe("guidedTravel");
    expect(a.getSnapshot().context.skipCount).toBe(1);
  });

  it("skip from welcome lands on a valid state", () => {
    const a = start();
    a.send({ type: "assets:ready" });
    a.send({ type: "skip:requested" });
    expect(name(a)).toBe("reception");
  });

  it("returns to the guided menu after a conversation, or free explore in free mode", () => {
    const a = start();
    toReception(a);
    a.send({ type: "dialogue:completed" });
    expect(name(a)).toBe("destinationChoice");
    a.send({ type: "mode:changed", mode: "free" });
    expect(name(a)).toBe("freeExplore");
    a.send({ type: "interaction:started", targetId: "abhishek" });
    expect(name(a)).toBe("dialogue");
    a.send({ type: "dialogue:completed" });
    expect(name(a)).toBe("freeExplore");
  });

  it("switching to free mode mid-route cancels the route", () => {
    const a = start();
    toReception(a);
    a.send({ type: "destination:selected", destinationId: "conference-hall" });
    const r = a.getSnapshot().context.routeId;
    a.send({ type: "mode:changed", mode: "free" });
    expect(name(a)).toBe("freeExplore");
    expect(a.getSnapshot().context.routeId).toBe(r + 1);
    a.send({ type: "navigation:arrived", routeId: r });
    expect(name(a)).toBe("freeExplore");
  });

  it("runs the manager door sequence once, even if the visitor spams Knock", () => {
    const a = start();
    toReception(a);
    a.send({ type: "destination:selected", destinationId: "manager-cabin" });
    a.send({ type: "navigation:arrived", routeId: a.getSnapshot().context.routeId });
    expect(a.getSnapshot().matches({ managerDoor: "awaitingKnock" })).toBe(true);
    a.send({ type: "door:knocked" });
    a.send({ type: "door:knocked" });
    a.send({ type: "door:knocked" });
    expect(a.getSnapshot().matches({ managerDoor: "knocking" })).toBe(true);
    vi.advanceTimersByTime(KNOCK_DELAY);
    expect(a.getSnapshot().matches({ managerDoor: "waitingPermission" })).toBe(true);
    vi.advanceTimersByTime(PERMISSION_DELAY);
    expect(a.getSnapshot().matches({ managerDoor: "opening" })).toBe(true);
    vi.advanceTimersByTime(OPENING_DELAY);
    expect(name(a)).toBe("managerDialogue");
    expect(a.getSnapshot().context.conversationId).toBe("manager-intro");
  });

  it("lets a free-mode visitor knock via the door target, and skip the visit", () => {
    const a = start();
    toReception(a);
    a.send({ type: "mode:changed", mode: "free" });
    a.send({ type: "interaction:started", targetId: MANAGER_DOOR_TARGET });
    expect(a.getSnapshot().matches({ managerDoor: "awaitingKnock" })).toBe(true);
    a.send({ type: "skip:requested" });
    expect(name(a)).toBe("managerDialogue");
  });

  it("changing destination during the door sequence cancels it", () => {
    const a = start();
    toReception(a);
    a.send({ type: "destination:selected", destinationId: "manager-cabin" });
    a.send({ type: "navigation:arrived", routeId: a.getSnapshot().context.routeId });
    a.send({ type: "door:knocked" });
    a.send({ type: "destination:selected", destinationId: "waiting-lounge" });
    expect(name(a)).toBe("guidedTravel");
    vi.advanceTimersByTime(10_000);
    expect(name(a)).toBe("guidedTravel");
  });

  it("pauses and resumes without changing state", () => {
    const a = start();
    toReception(a);
    a.send({ type: "experience:paused" });
    expect(a.getSnapshot().context.paused).toBe(true);
    expect(name(a)).toBe("reception");
    a.send({ type: "experience:resumed" });
    expect(a.getSnapshot().context.paused).toBe(false);
  });

  it("can fail loading and retry", () => {
    const a = start();
    a.send({ type: "asset:failed", reason: "boom" });
    expect(name(a)).toBe("failed");
    expect(a.getSnapshot().context.error).toBe("boom");
    a.send({ type: "experience:restart" });
    expect(name(a)).toBe("loading");
  });

  it("fails from an active experience state when the graphics context is lost", () => {
    const a = start();
    toReception(a);

    a.send({
      type: "asset:failed",
      reason: "WebGL context lost",
    });

    expect(name(a)).toBe("failed");
    expect(a.getSnapshot().context.error).toBe("WebGL context lost");

    a.stop();
  });

  it("restart restores welcome state, resets mode and context, and cancels door timers", () => {
    const a = start();
    toReception(a);

    // Enter manager door
    a.send({ type: "destination:selected", destinationId: "manager-cabin" });
    a.send({ type: "navigation:arrived", routeId: a.getSnapshot().context.routeId });
    expect(a.getSnapshot().matches({ managerDoor: "awaitingKnock" })).toBe(true);
    a.send({ type: "door:knocked" });
    expect(a.getSnapshot().matches({ managerDoor: "knocking" })).toBe(true);

    // Restart while knocking
    a.send({ type: "experience:restart" });
    expect(name(a)).toBe("welcome");
    expect(a.getSnapshot().context.destinationId).toBeNull();
    expect(a.getSnapshot().context.conversationId).toBeNull();
    expect(a.getSnapshot().context.mode).toBe("guided");

    // Advancing timers should NOT transition to managerDialogue
    vi.advanceTimersByTime(KNOCK_DELAY + PERMISSION_DELAY + OPENING_DELAY + 2000);
    expect(name(a)).toBe("welcome");

    a.stop();
  });

  it("restart from freeExplore and dialogue resets context and returns to welcome", () => {
    const a = start();
    toReception(a);

    a.send({ type: "mode:changed", mode: "free" });
    expect(name(a)).toBe("freeExplore");
    expect(a.getSnapshot().context.mode).toBe("free");

    a.send({ type: "interaction:started", targetId: "abhishek" });
    expect(name(a)).toBe("dialogue");
    expect(a.getSnapshot().context.conversationId).toBe("it-head-intro");

    a.send({ type: "experience:restart" });
    expect(name(a)).toBe("welcome");
    expect(a.getSnapshot().context.mode).toBe("guided");
    expect(a.getSnapshot().context.conversationId).toBeNull();
    expect(a.getSnapshot().context.destinationId).toBeNull();

    a.stop();
  });

  it("verifies team-member interactions start the corresponding conversation", () => {
    const team = [
      { id: "umesh", conv: "manager-intro" },
      { id: "abhishek", conv: "it-head-intro" },
      { id: "receptionist", conv: "reception-intro" },
      { id: "ankita", conv: "ankita-intro" },
      { id: "bhavishya", conv: "bhavishya-intro" },
      { id: "dravya", conv: "dravya-intro" },
    ];

    for (const member of team) {
      const a = start();
      toReception(a);
      a.send({ type: "dialogue:completed" });
      expect(name(a)).toBe("destinationChoice");

      a.send({ type: "interaction:started", targetId: member.id });
      expect(name(a)).toBe("dialogue");
      expect(a.getSnapshot().context.conversationId).toBe(member.conv);
      expect(a.getSnapshot().context.speakerId).toBe(member.id);
      a.stop();
    }
  });
});
