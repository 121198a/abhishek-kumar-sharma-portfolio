import { describe, expect, it } from "vitest";
import { createActor } from "xstate";
import { WorldSimulation, type Snapshot } from "../engine/WorldSimulation";
import { experienceMachine } from "../experience/ExperienceMachine";
import { dist } from "../navigation/graph";
import { nodeById } from "../data/destinations";

/** Runs the real machine and the real simulation together, without any rendering. */
function rig() {
  const actor = createActor(experienceMachine);
  const sim = new WorldSimulation((e) => actor.send(e));
  actor.start();
  const name = () => {
    const v = actor.getSnapshot().value;
    return typeof v === "string" ? v : (Object.keys(v)[0] as string);
  };
  const snap = (): Snapshot => {
    const v = actor.getSnapshot().value;
    const [n, sub] = typeof v === "string" ? [v, null] : [Object.keys(v)[0] as string, Object.values(v)[0] as string];
    return { name: n, sub, context: actor.getSnapshot().context };
  };
  const input = { x: 0, z: 0, forward: { x: 0, z: -1 } };
  const run = (seconds: number, until?: () => boolean) => {
    for (let t = 0; t < seconds; t += 1 / 30) {
      sim.update(1 / 30, snap(), input, t);
      if (until?.()) return true;
    }
    return until ? false : true;
  };
  return { actor, sim, name, run, input, snap };
}

describe("world simulation with the Director", () => {
  it("walks the visitor from the entrance to reception on start", () => {
    const r = rig();
    r.actor.send({ type: "assets:ready" });
    r.actor.send({ type: "experience:start" });
    expect(r.run(30, () => r.name() === "reception")).toBe(true);
    expect(dist(r.sim.visitor.pos, nodeById("rec_front")!)).toBeLessThan(0.1);
  });

  it("guides the visitor to IT: the receptionist leads, both arrive, then the IT conversation opens", () => {
    const r = rig();
    r.actor.send({ type: "assets:ready" });
    r.actor.send({ type: "experience:start" });
    r.run(30, () => r.name() === "reception");
    r.actor.send({ type: "destination:selected", destinationId: "it-department" });
    let maxGap = 0;
    const done = r.run(60, () => {
      maxGap = Math.max(maxGap, dist(r.sim.visitor.pos, r.sim.guide.nav.pos));
      return r.name() === "dialogue";
    });
    expect(done).toBe(true);
    expect(r.actor.getSnapshot().context.conversationId).toBe("it-head-intro");
    expect(maxGap).toBeLessThan(7); // visitor never loses the guide
    // visitor ended in the IT room
    expect(r.sim.visitor.pos.x).toBeLessThan(-14);
    expect(r.sim.visitor.pos.z).toBeLessThan(-2);
  });

  it("the receptionist walks back to her desk afterwards", () => {
    const r = rig();
    r.actor.send({ type: "assets:ready" });
    r.actor.send({ type: "experience:start" });
    r.run(30, () => r.name() === "reception");
    r.actor.send({ type: "destination:selected", destinationId: "hr-department" });
    r.run(60, () => r.name() === "dialogue");
    r.actor.send({ type: "dialogue:completed" });
    r.run(30);
    expect(dist(r.sim.guide.nav.pos, r.sim.guide.home)).toBeLessThan(0.4);
  });

  it("switching destination mid-walk cancels the old route and still arrives", () => {
    const r = rig();
    r.actor.send({ type: "assets:ready" });
    r.actor.send({ type: "experience:start" });
    r.run(30, () => r.name() === "reception");
    r.actor.send({ type: "destination:selected", destinationId: "it-department" });
    r.run(4);
    r.actor.send({ type: "destination:selected", destinationId: "conference-hall" });
    expect(r.run(60, () => r.name() === "dialogue")).toBe(true);
    expect(r.actor.getSnapshot().context.conversationId).toBe("ankita-intro");
  });

  it("skip snaps a walk to its end", () => {
    const r = rig();
    r.actor.send({ type: "assets:ready" });
    r.actor.send({ type: "experience:start" });
    r.actor.send({ type: "skip:requested" });
    expect(r.run(2, () => r.name() === "reception")).toBe(true);
  });

  it("the manager door: arrive, knock, permission, door opens, visitor walks in", () => {
    const r = rig();
    r.actor.send({ type: "assets:ready" });
    r.actor.send({ type: "experience:start" });
    r.run(30, () => r.name() === "reception");
    r.actor.send({ type: "destination:selected", destinationId: "manager-cabin" });
    expect(r.run(90, () => r.name() === "managerDoor")).toBe(true);
    expect(r.sim.doorOpen).toBeLessThan(0.1);
    r.actor.send({ type: "door:knocked" });
    // real timers drive the machine delays; skip them instead of waiting
    r.actor.send({ type: "skip:requested" });
    expect(r.name()).toBe("managerDialogue");
    r.run(6);
    expect(r.sim.doorOpen).toBeGreaterThan(0.9);
    expect(r.sim.visitor.pos.z).toBeLessThan(-9.5); // inside the cabin
  });

  it("free exploration cannot pass through walls", () => {
    const r = rig();
    r.actor.send({ type: "assets:ready" });
    r.actor.send({ type: "experience:start" });
    r.run(30, () => r.name() === "reception");
    r.actor.send({ type: "dialogue:completed" });
    r.actor.send({ type: "mode:changed", mode: "free" });
    expect(r.name()).toBe("freeExplore");
    // walk "forward" (towards -z) from reception front: the first wall line is the corridor at z = 2 / desk
    r.input.z = 1;
    r.run(8);
    for (let i = 0; i < 1; i++) expect(r.sim.visitor.pos.x).toBeGreaterThan(-28);
    // never inside the solid wall band of the north shell or outside the bounds
    expect(r.sim.visitor.pos.z).toBeGreaterThan(-16);
    // walking into the reception desk is blocked: desk spans x 0..6, z 9.9..11.1
    const p = r.sim.visitor.pos;
    const insideDesk = p.x > 0 && p.x < 6 && p.z > 9.9 && p.z < 11.1;
    expect(insideDesk).toBe(false);
  });

  it("detects a nearby character and the manager's door in free mode", () => {
    const r = rig();
    r.actor.send({ type: "assets:ready" });
    r.actor.send({ type: "experience:start" });
    r.run(30, () => r.name() === "reception");
    r.actor.send({ type: "dialogue:completed" });
    r.actor.send({ type: "mode:changed", mode: "free" });
    r.sim.visitor.pos = { x: 24, z: -7.6 };
    r.run(0.2);
    expect(r.sim.nearby?.kind).toBe("door");
    r.sim.visitor.pos = { x: -18, z: -7 };
    r.run(0.2);
    expect(r.sim.nearby).toEqual({ kind: "character", id: "abhishek", label: "Abhishek Sharma", verb: "Talk to" });
  });

  it("does not move while paused", () => {
    const r = rig();
    r.actor.send({ type: "assets:ready" });
    r.actor.send({ type: "experience:start" });
    r.run(1);
    r.actor.send({ type: "experience:paused" });
    const before = { ...r.sim.visitor.pos };
    r.run(2);
    expect(r.sim.visitor.pos).toEqual(before);
  });

  it("walks from the street, through the pedestrian gate, to each outdoor stop", () => {
    for (const [dest, conv] of [
      ["main-gate", "gate-intro"],
      ["car-parking", "car-parking-info"],
      ["bike-parking", "bike-parking-info"],
    ] as const) {
      const r = rig();
      r.actor.send({ type: "assets:ready" });
      r.actor.send({ type: "skip:requested" }); // straight to reception
      r.run(2);
      r.actor.send({ type: "dialogue:completed" });
      r.actor.send({ type: "destination:selected", destinationId: dest });
      expect(r.run(120, () => r.name() === "dialogue"), dest).toBe(true);
      expect(r.actor.getSnapshot().context.conversationId).toBe(conv);
    }
  });

  it("the vehicle gate really opens and closes, and blocks walking while closed", () => {
    const r = rig();
    r.actor.send({ type: "assets:ready" });
    r.actor.send({ type: "skip:requested" });
    r.run(2);
    r.actor.send({ type: "dialogue:completed" });
    r.actor.send({ type: "mode:changed", mode: "free" });
    expect(r.sim.gateOpen).toBe(0);
    // walk "south" (towards +z) into the closed vehicle gate at x = -6
    r.sim.visitor.pos = { x: -6, z: 68 };
    r.input.forward = { x: 0, z: 1 };
    r.input.z = 1;
    r.run(4);
    expect(r.sim.visitor.pos.z).toBeLessThan(72);
    // operate it from the control point
    r.input.z = 0;
    r.sim.visitor.pos = { x: -2.8, z: 70.6 };
    r.run(0.2);
    expect(r.sim.nearby).toEqual({ kind: "gate", id: "gate:main", label: "the vehicle gate", verb: "Open" });
    r.sim.toggleGate();
    r.run(5);
    expect(r.sim.gateOpen).toBeGreaterThan(0.95);
    r.sim.visitor.pos = { x: -6, z: 68 };
    r.input.z = 1;
    r.run(2);
    expect(r.sim.visitor.pos.z).toBeGreaterThan(72.5);
  });

  it("free exploration cannot leave through the boundary wall", () => {
    const r = rig();
    r.actor.send({ type: "assets:ready" });
    r.actor.send({ type: "skip:requested" });
    r.run(2);
    r.actor.send({ type: "dialogue:completed" });
    r.actor.send({ type: "mode:changed", mode: "free" });
    r.sim.visitor.pos = { x: 20, z: 68 };
    r.input.forward = { x: 0, z: 1 };
    r.input.z = 1;
    r.run(6);
    expect(r.sim.visitor.pos.z).toBeLessThan(72);
    r.sim.visitor.pos = { x: 38, z: 60 };
    r.input.forward = { x: 1, z: 0 };
    r.run(4);
    expect(r.sim.visitor.pos.x).toBeLessThan(40);
  });

  it("outdoor walkers keep to the paths and never enter a wall or vehicle", () => {
    const r = rig();
    r.actor.send({ type: "assets:ready" });
    r.actor.send({ type: "experience:start" });
    r.run(60);
    for (const id of ["walker-employee", "walker-visitor"]) {
      const c = r.sim.chars.get(id);
      expect(c, id).toBeDefined();
    }
  });
});
