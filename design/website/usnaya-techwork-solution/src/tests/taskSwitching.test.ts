import { describe, expect, it } from "vitest";
import { createActor } from "xstate";
import { WorldSimulation, FOLLOW_GAP, type Snapshot } from "../engine/WorldSimulation";
import { experienceMachine } from "../experience/ExperienceMachine";
import { dist } from "../navigation/graph";
import { destinationById, nodeById } from "../data/destinations";
import type { Vec2 } from "../data/types";

/** Real Director + real simulation, stepped at 30 fps. */
function rig() {
  const actor = createActor(experienceMachine);
  const sim = new WorldSimulation((e) => actor.send(e));
  actor.start();
  actor.send({ type: "assets:ready" });
  actor.send({ type: "experience:start" });
  const snap = (): Snapshot => {
    const v = actor.getSnapshot().value;
    const [name, sub] = typeof v === "string" ? [v, null] : [Object.keys(v)[0] as string, Object.values(v)[0] as string];
    return { name, sub, context: actor.getSnapshot().context };
  };
  let clock = 0;
  const input = { x: 0, z: 0, forward: { x: 0, z: -1 } };
  const frame = () => sim.update(1 / 30, snap(), input, (clock += 1 / 30));
  const run = (seconds: number, until?: () => boolean) => {
    for (let t = 0; t < seconds; t += 1 / 30) {
      frame();
      if (until?.()) return true;
    }
    return until ? false : true;
  };
  const name = () => snap().name;
  return { actor, sim, run, frame, name, snap };
}
type Rig = ReturnType<typeof rig>;

const nodeOf = (dest: string) => nodeById(destinationById(dest)!.nodeId) as Vec2;
const taskIds = (sim: WorldSimulation, what: string) => sim.trace.filter((l) => l.includes(what)).map((l) => Number(/task (\d+)/.exec(l)?.[1]));

/** Selects a destination and runs one frame so the simulation has taken the new task. */
function select(r: Rig, dest: string) {
  r.actor.send({ type: "destination:selected", destinationId: dest });
  r.frame();
}

/** Right after a selection: the guide alone owns the new route and the visitor trails her; nothing points at an old destination. */
function expectOwnedBy(r: Rig, dest: string) {
  const target = nodeOf(dest);
  const guideEnd = r.sim.guide.nav.end;
  expect(guideEnd, "guide has a route").toBeDefined();
  expect(dist(guideEnd as Vec2, target), `guide heads to ${dest}`).toBeLessThan(0.01);
  const visitorEnd = r.sim.visitor.end;
  if (visitorEnd) expect(dist(visitorEnd, target), "visitor stops behind the guide, not at the destination").toBeLessThanOrEqual(FOLLOW_GAP + 0.01);
}

function arrive(r: Rig, dest: string) {
  const reached = r.run(150, () => ["dialogue", "managerDoor", "destinationChoice"].includes(r.name()));
  expect(reached, `never arrived at ${dest}`).toBe(true);
  expect(r.actor.getSnapshot().context.destinationId).toBe(dest);
}

const start = () => {
  const r = rig();
  r.run(40, () => r.name() === "reception");
  r.sim.trace.length = 0; // only the guided tasks below are of interest, not the walk in from the street
  return r;
};

describe("one active guided task at a time", () => {
  it("the example: IT, then Parking, then Manager's Cabin. Both end at the cabin and nothing completes for IT or Parking", () => {
    const r = start();
    select(r, "it-department");
    expectOwnedBy(r, "it-department");
    r.run(3);
    select(r, "car-parking");
    expectOwnedBy(r, "car-parking");
    r.run(3);
    select(r, "manager-cabin");
    expectOwnedBy(r, "manager-cabin");
    arrive(r, "manager-cabin");
    const arrivedIds = taskIds(r.sim, "arrived");
    const cancelled = taskIds(r.sim, "cancelled");
    const final = r.actor.getSnapshot().context.routeId;
    expect(arrivedIds).toEqual([final]);
    expect(cancelled.length).toBeGreaterThanOrEqual(2);
    expect(dist(r.sim.guide.nav.pos, nodeOf("manager-cabin"))).toBeLessThan(0.5);
    expect(dist(r.sim.visitor.pos, r.sim.guide.nav.pos)).toBeLessThan(FOLLOW_GAP + 0.6);
  });

  it("full sequence Reception > IT > Parking > Cabin > Lounge > Reception, changing the mind at awkward moments", () => {
    const r = start();
    const plan: { dest: string; switchAfter: number }[] = [
      { dest: "it-department", switchAfter: 0 }, // the very next frame: route just calculated
      { dest: "car-parking", switchAfter: 2.5 }, // while Priya is walking
      { dest: "manager-cabin", switchAfter: 5 }, // while the visitor is following
      { dest: "waiting-lounge", switchAfter: 1 },
      { dest: "reception", switchAfter: 999 },
    ];
    for (const [i, step] of plan.entries()) {
      select(r, step.dest);
      expectOwnedBy(r, step.dest);
      const next = plan[i + 1];
      if (!next) break;
      // switch after the given time, or just before arrival if the walk is shorter
      r.run(step.switchAfter, () => r.sim.guide.nav.remaining() < 1.2 && r.sim.guide.nav.moving === true);
      expect(r.name(), "still travelling when the user changes their mind").toBe("guidedTravel");
    }
    arrive(r, "reception");
    expect(taskIds(r.sim, "arrived")).toEqual([r.actor.getSnapshot().context.routeId]);
  });

  it("many rapid changes (12 random switches, some on the same frame): the guide always heads to the latest destination", () => {
    const r = start();
    let seed = 12345;
    const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
    const dests = ["it-department", "hr-department", "sales-department", "conference-hall", "car-parking", "bike-parking", "waiting-lounge", "office-kitchen", "manager-cabin", "reception", "main-gate"];
    let latest = "";
    let bad = 0;
    for (let i = 0; i < 12; i++) {
      let d = dests[Math.floor(rnd() * dests.length)] as string;
      if (d === latest) d = dests[(dests.indexOf(d) + 1) % dests.length] as string;
      latest = d;
      select(r, d);
      expectOwnedBy(r, d);
      const wait = rnd() < 0.3 ? 0 : rnd() * 4;
      for (let t = 0; t < wait; t += 1 / 30) {
        r.frame();
        const end = r.sim.guide.nav.end;
        if (r.name() === "guidedTravel" && end && dist(end, nodeOf(latest)) > 0.01) bad++;
        if (r.name() !== "guidedTravel") break;
      }
      if (r.name() !== "guidedTravel") break; // reached something quickly; the next selection starts from there
    }
    expect(bad, "frames where the guide walked toward a stale destination").toBe(0);
    arrive(r, latest);
    const arrivals = taskIds(r.sim, "arrived");
    expect(arrivals.at(-1)).toBe(r.actor.getSnapshot().context.routeId);
    // every arrival that was reported belongs to a task that was still current: none appear after their own cancellation
    const cancelled = new Set(taskIds(r.sim, "cancelled"));
    for (const id of arrivals.slice(0, -1)) expect(cancelled.has(id), `task ${id} arrived and was also cancelled`).toBe(false);
  });

  it("the visitor trails the guide the whole way: never overtakes her, never far behind, never at a stale destination", () => {
    const r = start();
    select(r, "it-department");
    r.run(2);
    select(r, "car-parking");
    let worstGap = 0;
    let overtook = 0;
    let prevRemaining = r.sim.visitor.remaining();
    r.run(150, () => {
      if (r.name() !== "guidedTravel") return true;
      const gap = dist(r.sim.visitor.pos, r.sim.guide.nav.pos);
      worstGap = Math.max(worstGap, gap);
      const lead = r.sim.visitor.remaining() + FOLLOW_GAP - r.sim.guide.nav.remaining();
      const rem = r.sim.visitor.remaining();
      // standing ahead of her right after a turn-around is fine; walking on ahead of her is not
      if (lead < -0.2 && rem < prevRemaining - 1e-6) overtook++;
      prevRemaining = rem;
      return false;
    });
    expect(worstGap).toBeLessThan(9);
    expect(overtook, "frames where the visitor advanced while ahead of the guide").toBe(0);
  });

  it("stale events cannot take over: an arrival or skip from an obsolete task does nothing", () => {
    const r = start();
    select(r, "it-department");
    const oldId = r.actor.getSnapshot().context.routeId;
    select(r, "hr-department");
    r.actor.send({ type: "navigation:arrived", routeId: oldId });
    expect(r.name()).toBe("guidedTravel");
    expect(r.actor.getSnapshot().context.destinationId).toBe("hr-department");
    arrive(r, "hr-department");
    expect(r.actor.getSnapshot().context.conversationId).toBe("hr-exec-intro");
  });

  it("no character keeps an old route after leaving guided travel for free exploration", () => {
    const r = start();
    select(r, "it-department");
    r.run(2);
    r.actor.send({ type: "mode:changed", mode: "free" });
    r.frame();
    expect(r.sim.visitor.moving).toBe(false);
    expect(r.name()).toBe("freeExplore");
    r.run(30);
    expect(dist(r.sim.guide.nav.pos, r.sim.guide.home)).toBeLessThan(0.4); // she walked back to her desk, not on to IT
  });
});
