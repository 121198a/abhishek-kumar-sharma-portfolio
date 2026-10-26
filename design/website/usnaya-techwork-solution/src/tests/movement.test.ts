import { describe, expect, it } from "vitest";
import { createActor } from "xstate";
import { WorldSimulation, type Snapshot } from "../engine/WorldSimulation";
import { experienceMachine } from "../experience/ExperienceMachine";
import { destinations } from "../data/destinations";
import { propBoxes } from "../world/propBoxes";
import { wallBoxes } from "../world/walls";
import type { Box } from "../world/walls";

/** Real machine + real simulation, stepped at 30 fps, no rendering. */
function rig() {
  const actor = createActor(experienceMachine);
  const sim = new WorldSimulation((e) => actor.send(e));
  actor.start();
  const snap = (): Snapshot => {
    const v = actor.getSnapshot().value;
    const [n, sub] = typeof v === "string" ? [v, null] : [Object.keys(v)[0] as string, Object.values(v)[0] as string];
    return { name: n, sub, context: actor.getSnapshot().context };
  };
  const name = () => snap().name;
  let clock = 0;
  const input = { x: 0, z: 0, forward: { x: 0, z: -1 } };
  const run = (seconds: number, until?: () => boolean) => {
    for (let t = 0; t < seconds; t += 1 / 30) {
      sim.update(1 / 30, snap(), input, (clock += 1 / 30));
      if (until?.()) return true;
    }
    return until ? false : true;
  };
  return { actor, sim, name, run };
}

const inside = (p: { x: number; z: number }, b: Box, r = 0) => p.x > b.minX + r && p.x < b.maxX - r && p.z > b.minZ + r && p.z < b.maxZ - r;
const blocking = [...wallBoxes, ...propBoxes];

describe("repeated movement through every reachable destination", () => {
  it("visits every destination from every destination: always arrives, never stuck, never inside a wall or furniture", () => {
    const r = rig();
    r.actor.send({ type: "assets:ready" });
    r.actor.send({ type: "experience:start" });
    expect(r.run(40, () => r.name() === "reception")).toBe(true);

    const ids = destinations.map((d) => d.id).filter((id) => id !== "manager-cabin"); // door sequence has its own test
    const order = ids.concat(ids.slice().reverse(), ids.slice(3), ids.slice(0, 5)); // several laps of the whole site in varied order
    const violations: string[] = [];
    for (const id of order) {
      r.actor.send({ type: "destination:selected", destinationId: id });
      const arrived = r.run(150, () => {
        const v = r.sim.visitor.pos;
        const bad = blocking.find((b) => inside(v, b, 0.1));
        if (bad) violations.push(`visitor inside a blocker en route to ${id} at ${v.x.toFixed(2)},${v.z.toFixed(2)}`);
        return r.name() === "dialogue" || (r.name() === "destinationChoice" && !!r.sim);
      });
      expect(arrived, `never arrived at ${id}`).toBe(true);
      if (r.name() === "dialogue") r.actor.send({ type: "dialogue:completed" });
      r.run(3);
      expect(["destinationChoice", "freeExplore"]).toContain(r.name());
    }
    expect(violations.slice(0, 3)).toEqual([]);
  });

  it("an invalid destination or a repeat of the current one leaves the app usable", () => {
    const r = rig();
    r.actor.send({ type: "assets:ready" });
    r.actor.send({ type: "experience:start" });
    r.run(40, () => r.name() === "reception");
    r.actor.send({ type: "destination:selected", destinationId: "nowhere" });
    r.run(2);
    expect(r.name()).toBe("reception");
    r.actor.send({ type: "destination:selected", destinationId: "hr-department" });
    r.actor.send({ type: "destination:selected", destinationId: "hr-department" });
    expect(r.run(120, () => r.name() === "dialogue")).toBe(true);
  });
});

describe("autonomous activity over a sustained session", () => {
  it("simulates ten minutes: no character enters a wall or furniture, none leaves the site, none jitters out of control", () => {
    const r = rig();
    r.actor.send({ type: "assets:ready" });
    r.actor.send({ type: "experience:start" });
    r.run(40, () => r.name() === "reception");
    const bad: string[] = [];
    const moved = new Map<string, number>();
    const last = new Map<string, { x: number; z: number }>();
    let maxStep = 0;
    for (let t = 0; t < 600; t += 1 / 30) {
      r.run(1 / 30);
      for (const c of r.sim.chars.values()) {
        const p = c.nav.pos;
        const prev = last.get(c.def.id);
        if (prev) {
          const step = Math.hypot(p.x - prev.x, p.z - prev.z);
          moved.set(c.def.id, (moved.get(c.def.id) ?? 0) + step);
          maxStep = Math.max(maxStep, step);
        }
        last.set(c.def.id, { x: p.x, z: p.z });
        if (Math.abs(p.x) > 45 || p.z < -30 || p.z > 85) bad.push(`${c.def.id} left the site`);
        // seated characters sit on a chair or sofa that is deliberately not in the blocking set; only test walkers
        if (c.def.pose !== "sit" && c.def.movementProfile !== "stationary" && blocking.some((b) => inside(p, b, 0.12))) bad.push(`${c.def.id} inside a blocker at ${p.x.toFixed(1)},${p.z.toFixed(1)}`);
      }
    }
    expect([...new Set(bad)].slice(0, 5)).toEqual([]);
    expect(maxStep).toBeLessThan(0.5); // no teleporting at 30 fps (walking speed is about 1.4 m/s)
    for (const [id, d] of moved) expect(d, `${id} walked ${d.toFixed(0)} m in 10 min: not purposeless endless walking`).toBeLessThan(900);
  });
});
