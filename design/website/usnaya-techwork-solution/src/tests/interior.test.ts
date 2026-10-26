import { describe, expect, it } from "vitest";
import { allProps, commonAreaProps, zones } from "../data/departments";
import { characters } from "../data/characters";
import { navNodes } from "../data/destinations";
import type { Prop, PropKind } from "../data/types";
import { footprint, propBox } from "../world/propBoxes";
import { WALL_KINDS } from "../world/Props";
import { doorways, northWindows, SOLID_H, CEILING_H, T, walls, wallBoxes, type Box } from "../world/walls";

const blocking = allProps.flatMap((p) => {
  const b = propBox(p);
  return b ? [{ p, b }] : [];
});

const overlap = (a: Box, b: Box) => Math.min(a.maxX, b.maxX) - Math.max(a.minX, b.minX) > 0.02 && Math.min(a.maxZ, b.maxZ) - Math.max(a.minZ, b.minZ) > 0.02;
const inside = (x: number, z: number, b: Box, pad = 0) => x > b.minX - pad && x < b.maxX + pad && z > b.minZ - pad && z < b.maxZ + pad;
const label = (p: Prop) => `${p.kind}@${p.x},${p.z}`;

describe("interior layout", () => {
  it("gives every room a floor finish and furnishes it", () => {
    for (const z of zones) {
      expect(z.finish, z.id).toBeDefined();
      expect(z.props.length, z.id).toBeGreaterThan(5);
    }
  });

  it("has no two identical props in the same place", () => {
    const seen = new Set<string>();
    for (const p of allProps) {
      const key = `${p.kind}|${p.x}|${p.z}|${p.y ?? 0}`;
      expect(seen.has(key), label(p)).toBe(false);
      seen.add(key);
    }
  });

  it("keeps blocking furniture inside its own room", () => {
    for (const z of zones) {
      for (const p of z.props) {
        const b = propBox(p);
        if (!b) continue;
        expect(b.minX, label(p)).toBeGreaterThanOrEqual(z.rect.x0 + T - 0.02);
        expect(b.maxX, label(p)).toBeLessThanOrEqual(z.rect.x1 - T + 0.02);
        expect(b.minZ, label(p)).toBeGreaterThanOrEqual(z.rect.z0 + T - 0.02);
        expect(b.maxZ, label(p)).toBeLessThanOrEqual(z.rect.z1 - T + 0.02);
      }
    }
  });

  it("never overlaps two pieces of blocking furniture", () => {
    for (let i = 0; i < blocking.length; i++) {
      for (let j = i + 1; j < blocking.length; j++) {
        const a = blocking[i];
        const c = blocking[j];
        if (a && c) expect(overlap(a.b, c.b), `${label(a.p)} overlaps ${label(c.p)}`).toBe(false);
      }
    }
  });

  it("never pushes furniture through a wall", () => {
    for (const { p, b } of blocking) {
      for (const w of wallBoxes) {
        expect(overlap(b, w), `${label(p)} overlaps a wall`).toBe(false);
      }
    }
  });

  it("keeps chair centres out of furniture and walls", () => {
    for (const p of allProps.filter((q) => q.kind === "chair")) {
      for (const { p: other, b } of blocking) expect(inside(p.x, p.z, b), `${label(p)} inside ${label(other)}`).toBe(false);
      for (const w of wallBoxes) expect(inside(p.x, p.z, w, 0.2), `${label(p)} against a wall`).toBe(false);
    }
  });

  it("keeps every waypoint and every standing character clear of furniture", () => {
    for (const n of navNodes) for (const { p, b } of blocking) expect(inside(n.x, n.z, b, 0.3), `node ${n.id} blocked by ${label(p)}`).toBe(false);
    for (const c of characters.filter((q) => q.pose === "stand")) {
      for (const { p, b } of blocking) expect(inside(c.position.x, c.position.z, b, 0.25), `${c.id} stands in ${label(p)}`).toBe(false);
    }
  });

  it("keeps a clear 1.2 m approach in front of every doorway", () => {
    for (const d of doorways) {
      const half = d.width / 2;
      const zone: Box = d.axis === "h" ? { minX: d.center - half, maxX: d.center + half, minZ: d.at - 1.2, maxZ: d.at + 1.2 } : { minX: d.at - 1.2, maxX: d.at + 1.2, minZ: d.center - half, maxZ: d.center + half };
      for (const { p, b } of blocking) expect(overlap(zone, b), `${label(p)} blocks a doorway at ${d.axis}${d.at}/${d.center}`).toBe(false);
    }
  });

  it("seats every sitting character on a chair or sofa", () => {
    const seats = allProps.filter((p) => p.kind === "chair" || p.kind === "sofa");
    for (const c of characters.filter((q) => q.pose !== "stand")) {
      // the body sits 0.14 m behind the character origin (see Person.tsx)
      const px = c.position.x - Math.sin(c.facing) * 0.14;
      const pz = c.position.z - Math.cos(c.facing) * 0.14;
      const ok = seats.some((s) => {
        if (s.kind === "chair") return Math.hypot(s.x - px, s.z - pz) < 0.2;
        const b = propBox(s);
        return b ? inside(px, pz, b, 0.05) : false;
      });
      expect(ok, `${c.id} is not on a seat`).toBe(true);
    }
  });
});

describe("wall-mounted items", () => {
  const widthOf: Partial<Record<PropKind, number>> = { wallDisplay: 2.4, whiteboard: 2.2, noticeBoard: 1.4, artFrame: 0.9, wallClock: 0.4, acousticPanel: 1.4, directoryBoard: 1.0, firstAid: 0.4, extinguisher: 0.25, exitSign: 0.5 };
  const solid = [
    ...walls.filter((w) => w.tall || !w.glass).map((w) => ({ box: w, top: w.tall ? CEILING_H : SOLID_H, bottom: 0 })),
    ...blocking.filter(({ p }) => p.kind === "brandWall").map(({ b }) => ({ box: b, top: 2.7, bottom: 0 })),
    // the plaster lintel above a glazed doorway, from 2.4 m up to the ceiling
    ...doorways
      .filter((d) => d.glass)
      .map((d) => ({
        box: d.axis === "h" ? { minX: d.center - d.width / 2, maxX: d.center + d.width / 2, minZ: d.at - T, maxZ: d.at + T } : { minX: d.at - T, maxX: d.at + T, minZ: d.center - d.width / 2, maxZ: d.center + d.width / 2 },
        top: CEILING_H,
        bottom: 2.4,
      })),
  ];
  // the mobile whiteboard is a freestanding easel, not a wall item
  const items = allProps.filter((p) => WALL_KINDS.has(p.kind) && p.variant !== "mobile");

  it("fixes every item to a solid wall face, facing the room", () => {
    for (const p of items) {
      const fx = Math.sin(p.rot ?? 0);
      const fz = Math.cos(p.rot ?? 0);
      // the point just behind the item must lie inside a solid wall, and the point in front of it must not
      const hit = solid.find(({ box }) => inside(p.x - fx * 0.04, p.z - fz * 0.04, box) && !inside(p.x + fx * 0.04, p.z + fz * 0.04, box));
      expect(hit, `${label(p)} is not mounted on a solid wall`).toBeDefined();
      expect(p.y ?? 1, label(p)).toBeLessThan((hit?.top ?? 0) - 0.2);
      expect(p.y ?? 1, label(p)).toBeGreaterThanOrEqual((hit?.bottom ?? 0) + 0.1);
    }
  });

  it("keeps items out of the window openings", () => {
    for (const p of items.filter((q) => Math.abs(q.z - -15.84) < 0.01)) {
      const half = (widthOf[p.kind] ?? 0.5) / 2;
      const w = p.w ? p.w / 2 : half;
      for (const win of northWindows) {
        expect(Math.abs(p.x - win.center), `${label(p)} covers a window`).toBeGreaterThan(w + win.width / 2 - 0.01);
      }
    }
  });

  it("puts every window on the solid north wall and leaves every doorway framed", () => {
    for (const win of northWindows) expect(win.width).toBeGreaterThan(1);
    expect(doorways.length).toBeGreaterThan(8);
    expect(commonAreaProps.length).toBeGreaterThan(10);
  });

  it("only gives furniture a footprint where it can be walked into", () => {
    expect(footprint({ kind: "chair", x: 0, z: 0 })).toBeNull();
    expect(footprint({ kind: "rug", x: 0, z: 0 })).toBeNull();
    expect(footprint({ kind: "desk", x: 0, z: 0 })).not.toBeNull();
  });
});
