import { allProps } from "../data/departments";
import { trees, vehicles } from "../data/exterior";
import type { Prop, PropKind } from "../data/types";
import { cabinBox, compoundWalls, pillars, type Box } from "./walls";

/** Default footprint (width along x, depth along z) before rotation. Null means the object does not block movement. */
export const footprint = (p: Prop): { w: number; d: number } | null => {
  const k: PropKind = p.kind;
  switch (k) {
    case "desk":
      return { w: p.w ?? 2.6, d: p.d ?? 1.2 };
    case "confTable":
      return { w: p.w ?? 8, d: p.d ?? 3 };
    case "counter":
      return { w: p.w ?? 6, d: p.d ?? 0.7 };
    case "sofa":
      return { w: p.w ?? 2.4, d: p.d ?? 1 };
    case "armchair":
      return { w: 0.95, d: 0.95 };
    case "bench":
      return { w: p.w ?? 1.8, d: p.d ?? 0.45 };
    case "fridge":
      return { w: 0.9, d: 0.8 };
    case "managerDesk":
      return { w: p.w ?? 2.8, d: p.d ?? 1.3 };
    case "receptionDesk":
      return { w: p.w ?? 6, d: 1.4 };
    case "shelf":
      return { w: p.w ?? 2, d: p.d ?? 0.4 };
    case "diningTable":
      return { w: p.w ?? 2, d: p.d ?? 1.2 };
    case "coffeeTable":
      return { w: p.w ?? 1.2, d: p.d ?? 0.6 };
    case "sideTable":
      return { w: 0.5, d: 0.5 };
    case "rack":
      return { w: 0.8, d: 0.9 };
    case "cabinet":
      return { w: p.w ?? 1.05, d: p.d ?? 0.5 };
    case "filing":
      return { w: p.w ?? 1.2, d: p.d ?? 0.5 };
    case "credenza":
      return { w: p.w ?? 1.8, d: p.d ?? 0.5 };
    case "printerStation":
      return { w: 1.0, d: 0.6 };
    case "binSet":
      return { w: 1.0, d: 0.35 };
    case "dispenser":
      return { w: 0.4, d: 0.4 };
    case "securityDesk":
      return { w: 1.8, d: 0.7 };
    case "brandWall":
      return { w: p.w ?? 5.4, d: p.d ?? 0.3 };
    case "plant":
      // small plants stand on tables; the others are floor planters
      return p.variant === "small" || p.y ? null : { w: 0.6, d: 0.6 };
    default:
      return null; // chairs, rugs, lamps, wall items, pendants and cable trays do not block
  }
};

export function propBox(p: Prop): Box | null {
  const f = footprint(p);
  if (!f) return null;
  const quarter = Math.abs(Math.round(((p.rot ?? 0) / (Math.PI / 2)) % 2)) === 1;
  const hw = (quarter ? f.d : f.w) / 2;
  const hd = (quarter ? f.w : f.d) / 2;
  return { minX: p.x - hw, maxX: p.x + hw, minZ: p.z - hd, maxZ: p.z + hd };
}

export const interiorBoxes: Box[] = allProps.map(propBox).filter((b): b is Box => b !== null);

/** Boundary walls, pillars, guard cabin, parked vehicles and tree trunks. */
export const exteriorBoxes: Box[] = [
  ...compoundWalls,
  ...pillars,
  cabinBox,
  ...vehicles.map((v) => ({ minX: v.x - v.w / 2, maxX: v.x + v.w / 2, minZ: v.z - v.d / 2, maxZ: v.z + v.d / 2 })),
  ...trees.map((t) => ({ minX: t.x - 0.3, maxX: t.x + 0.3, minZ: t.z - 0.3, maxZ: t.z + 0.3 })),
];

export const propBoxes: Box[] = [...interiorBoxes, ...exteriorBoxes];
