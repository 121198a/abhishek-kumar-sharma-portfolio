import { OFFICE_BOUNDS } from "../data/departments";
import { COMPOUND, GATE } from "../data/exterior";
import type { Vec2 } from "../data/types";

export type Box = { minX: number; maxX: number; minZ: number; maxZ: number };
/** Axis-aligned wall segment. `glass` = low solid base plus a transparent pane above it. */
export type WallSegment = Box & { glass: boolean; tall: boolean };

export const T = 0.16; // half thickness
type Gap = [center: number, width: number];

/** Height of solid interior walls (the manager's cabin walls). Tall outer walls and the ceiling are higher. */
export const SOLID_H = 2.4;
export const CEILING_H = 3.2;

/** An opening cut through a wall. `axis` "h" runs along x at constant z, "v" runs along z at constant x. */
export type Doorway = { axis: "h" | "v"; at: number; center: number; width: number; glass: boolean };
/** Every door opening, recorded when the walls are built so frames and lintels always match the collision gaps. */
export const doorways: Doorway[] = [];

/** Horizontal wall (constant z) from x0..x1 with gaps cut out. */
function hWall(z: number, x0: number, x1: number, gaps: Gap[], glass: boolean, tall = false): WallSegment[] {
  for (const [center, width] of gaps) doorways.push({ axis: "h", at: z, center, width, glass });
  return split(x0, x1, gaps).map(([a, b]) => ({ minX: a, maxX: b, minZ: z - T, maxZ: z + T, glass, tall }));
}
/** Vertical wall (constant x) from z0..z1. */
function vWall(x: number, z0: number, z1: number, gaps: Gap[], glass: boolean, tall = false): WallSegment[] {
  for (const [center, width] of gaps) doorways.push({ axis: "v", at: x, center, width, glass });
  return split(z0, z1, gaps).map(([a, b]) => ({ minX: x - T, maxX: x + T, minZ: a, maxZ: b, glass, tall }));
}
function split(a: number, b: number, gaps: Gap[]): [number, number][] {
  const sorted = [...gaps].sort((g, h) => g[0] - h[0]);
  const out: [number, number][] = [];
  let cur = a;
  for (const [c, w] of sorted) {
    const g0 = c - w / 2;
    const g1 = c + w / 2;
    if (g0 > cur) out.push([cur, g0]);
    cur = Math.max(cur, g1);
  }
  if (cur < b) out.push([cur, b]);
  return out;
}

const B = OFFICE_BOUNDS;
export const DOOR_W = 3.4;

export const walls: WallSegment[] = [
  // outer shell: north and west are tall solid, south and east are low glass so the camera can see in
  ...hWall(B.z0, B.x0, B.x1, [], false, true),
  ...vWall(B.x0, B.z0, 16, [], false, true),
  ...vWall(B.x1, B.z0, 16, [], true),
  ...hWall(16, B.x0, -4, [], true),
  ...hWall(16, 8, B.x1, [], true),
  // entrance lobby shell, with the main entrance gap at x = 2
  ...vWall(-4, 16, B.z1, [], true),
  ...vWall(8, 16, B.z1, [], true),
  ...hWall(B.z1, -4, 8, [[2, 4]], true),
  // corridor north boundary (room doors)
  ...hWall(-2, B.x0, B.x1, [[-21, DOOR_W], [-9, DOOR_W], [2, DOOR_W], [14, DOOR_W], [24, DOOR_W]], true),
  // dividers between north rooms
  ...vWall(-14, B.z0, -2, [], true),
  ...vWall(-4, B.z0, -2, [], true),
  ...vWall(8, B.z0, -2, [], true),
  ...vWall(20, B.z0, -2, [], true),
  // manager's cabin wall with its door at x = 24
  ...hWall(-9, 20, B.x1, [[24, 2.4]], false),
  // corridor south boundary: kitchen door, reception opening, lounge door
  ...hWall(2, -18, 22, [[-11, DOOR_W], [2, 5.4], [15, DOOR_W]], true),
  // south rooms side walls
  ...vWall(-18, 2, 16, [], true),
  ...vWall(-4, 2, 16, [], true),
  ...vWall(8, 2, 16, [], true),
  ...vWall(22, 2, 16, [], true),
];

export const wallBoxes: Box[] = walls;

/** Window openings in the solid north wall, drawn by the renderer. Collision keeps the wall closed. */
export type WallWindow = { center: number; width: number };
export const northWindows: WallWindow[] = [
  { center: -25, width: 2 },
  { center: -17, width: 2 },
  { center: -11.5, width: 2 },
  { center: -6.5, width: 2 },
  { center: -2, width: 2 },
  { center: 6, width: 2 },
  { center: 18.4, width: 2.2 },
  { center: 24, width: 2.6 },
];
export const WINDOW_SILL = 0.95;
export const WINDOW_HEAD = 2.45;

/** The cabin door leaf, drawn separately because it animates. */
export const CABIN_DOOR = { x: 24, z: -9, width: 2.4 };

/** Closed cabin door blocks movement until it opens. */
export const cabinDoorBox = (): Box => ({
  minX: CABIN_DOOR.x - CABIN_DOOR.width / 2,
  maxX: CABIN_DOOR.x + CABIN_DOOR.width / 2,
  minZ: CABIN_DOOR.z - T,
  maxZ: CABIN_DOOR.z + T,
});

/** Boundary wall around the whole property, with the vehicle gate and pedestrian entry cut out. */
const WT = 0.25;
const gv = GATE.vehicle;
const gp = GATE.pedestrian;
export const compoundWalls: WallSegment[] = [
  ...split(COMPOUND.x0, COMPOUND.x1, [[gv.cx, gv.width], [gp.cx, gp.width]]).map(([a, b]) => ({ minX: a, maxX: b, minZ: GATE.z - WT, maxZ: GATE.z + WT, glass: false, tall: false })),
  { minX: COMPOUND.x0 - WT, maxX: COMPOUND.x0 + WT, minZ: COMPOUND.z0, maxZ: GATE.z, glass: false, tall: false },
  { minX: COMPOUND.x1 - WT, maxX: COMPOUND.x1 + WT, minZ: COMPOUND.z0, maxZ: GATE.z, glass: false, tall: false },
  { minX: COMPOUND.x0, maxX: COMPOUND.x1, minZ: COMPOUND.z0 - WT, maxZ: COMPOUND.z0 + WT, glass: false, tall: false },
];

/** Gate pillars (also colliders). */
export const pillars: Box[] = [gv.cx - gv.width / 2 - 0.3, gv.cx + gv.width / 2 + 0.3, gp.cx - gp.width / 2 - 0.3, gp.cx + gp.width / 2 + 0.3].map((x) => ({
  minX: x - 0.35,
  maxX: x + 0.35,
  minZ: GATE.z - 0.35,
  maxZ: GATE.z + 0.35,
}));

export const cabinBox: Box = {
  minX: GATE.cabin.x - GATE.cabin.w / 2,
  maxX: GATE.cabin.x + GATE.cabin.w / 2,
  minZ: GATE.cabin.z - GATE.cabin.d / 2,
  maxZ: GATE.cabin.z + GATE.cabin.d / 2,
};

/** The closed vehicle gate leaf blocks movement; the pedestrian entry never does. */
export const gateLeafBox: Box = { minX: gv.cx - gv.width / 2, maxX: gv.cx + gv.width / 2, minZ: GATE.z - 0.2, maxZ: GATE.z + 0.2 };

/** Circle-vs-AABB resolution. Returns the corrected position. */
export function resolveCollision(p: Vec2, radius: number, boxes: Box[]): Vec2 {
  let { x, z } = p;
  for (let iter = 0; iter < 3; iter++) {
    for (const b of boxes) {
      const cx = Math.max(b.minX, Math.min(x, b.maxX));
      const cz = Math.max(b.minZ, Math.min(z, b.maxZ));
      const dx = x - cx;
      const dz = z - cz;
      const d2 = dx * dx + dz * dz;
      if (d2 < radius * radius) {
        if (d2 > 1e-8) {
          const d = Math.sqrt(d2);
          x += (dx / d) * (radius - d);
          z += (dz / d) * (radius - d);
        } else {
          // centre is inside the box: push out along the shortest axis
          const l = x - b.minX;
          const r = b.maxX - x;
          const t = z - b.minZ;
          const bt = b.maxZ - z;
          const m = Math.min(l, r, t, bt);
          if (m === l) x = b.minX - radius;
          else if (m === r) x = b.maxX + radius;
          else if (m === t) z = b.minZ - radius;
          else z = b.maxZ + radius;
        }
      }
    }
  }
  x = Math.max(COMPOUND.x0 + radius, Math.min(COMPOUND.x1 - radius, x));
  z = Math.max(COMPOUND.z0 + radius, Math.min(GATE.z + 12, z));
  return { x, z };
}
