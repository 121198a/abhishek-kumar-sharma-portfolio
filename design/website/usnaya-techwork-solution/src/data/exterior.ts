import type { Rect, Zone } from "./types";

/** The whole property. The building sits inside it, near the middle-back. */
export const COMPOUND: Rect = { x0: -40, x1: 40, z0: -26, z1: 72 };

/** Front boundary wall (z = 72). Vehicle gate on the left, pedestrian entry on the right. */
export const GATE = {
  z: 72,
  vehicle: { cx: -6, width: 8 },
  pedestrian: { cx: 6, width: 2.4 },
  cabin: { x: 1.4, z: 69.4, w: 2.4, d: 2.4 },
  /** Where the visitor stands to operate the vehicle gate. */
  control: { x: -2.8, z: 70.6 },
};

export const BAY = { car: { w: 2.5, d: 5 }, accessible: { w: 3.5, d: 5 }, bike: { w: 1.2, d: 2.2 } };

export type Road = { id: string; rect: Rect; color: string };
export const ASPHALT = "#4a4f52";
export const roads: Road[] = [
  { id: "main-drive", rect: { x0: -9.5, x1: -2.5, z0: 30, z1: 72 }, color: ASPHALT },
  { id: "drop-off", rect: { x0: -34, x1: 12, z0: 28, z1: 34 }, color: ASPHALT },
  { id: "west-aisle", rect: { x0: -36.5, x1: -9.5, z0: 44, z1: 50 }, color: ASPHALT },
  { id: "east-aisle", rect: { x0: -2.5, x1: 36.5, z0: 44, z1: 50 }, color: ASPHALT },
  { id: "bike-aisle", rect: { x0: -2.5, x1: 28, z0: 57.5, z1: 62 }, color: ASPHALT },
  { id: "west-bays", rect: { x0: -36.5, x1: -12.5, z0: 39, z1: 44 }, color: "#565b5e" },
  { id: "west-bays-2", rect: { x0: -36.5, x1: -12.5, z0: 50, z1: 55 }, color: "#565b5e" },
  { id: "east-bays", rect: { x0: 10, x1: 36.5, z0: 39, z1: 44 }, color: "#565b5e" },
  { id: "east-bays-2", rect: { x0: 10, x1: 36.5, z0: 50, z1: 55 }, color: "#565b5e" },
  { id: "bike-bays", rect: { x0: 9.5, x1: 28, z0: 62, z1: 64.4 }, color: "#565b5e" },
];

/** Pedestrian paths (paving). */
export const PAVING = "#c9c1b2";
export const paths: Road[] = [
  { id: "main-path", rect: { x0: 4.8, x1: 7.2, z0: 29, z1: 76 }, color: PAVING },
  { id: "plaza", rect: { x0: -3, x1: 10, z0: 20, z1: 29 }, color: PAVING },
  { id: "west-link", rect: { x0: -11, x1: 4.8, z0: 46.2, z1: 47.8 }, color: PAVING },
];

export type BayType = "car" | "visitor" | "accessible" | "bike";
export type Bay = { id: string; type: BayType; x: number; z: number; w: number; d: number; /** yaw the nose points at */ yaw: number };

function row(prefix: string, type: BayType, x0: number, z: number, count: number, w: number, d: number, yaw: number, startIdx = 0): Bay[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${startIdx + i + 1}`,
    type,
    x: x0 + w * i + w / 2,
    z,
    w,
    d,
    yaw,
  }));
}

export const bays: Bay[] = [
  // employee parking (west): two rows facing the aisle
  ...row("emp-a", "car", -36.5, 41.5, 9, BAY.car.w, BAY.car.d, 0),
  ...row("emp-b", "car", -36.5, 52.5, 9, BAY.car.w, BAY.car.d, Math.PI),
  // visitor parking (east): accessible bays nearest the pedestrian path, then regular
  ...row("acc", "accessible", 10, 41.5, 2, BAY.accessible.w, BAY.accessible.d, 0),
  ...row("vis-a", "visitor", 17, 41.5, 7, BAY.car.w, BAY.car.d, 0),
  ...row("vis-b", "visitor", 10, 52.5, 10, BAY.car.w, BAY.car.d, Math.PI),
  // two-wheelers
  ...row("bike", "bike", 9.5, 63.2, 15, BAY.bike.w, BAY.bike.d, Math.PI),
];

export type VehicleKind = "sedan" | "suv" | "hatch" | "motorcycle" | "scooter";
export type Vehicle = { id: string; bayId: string; kind: VehicleKind; color: string; x: number; z: number; yaw: number; w: number; d: number };

/** Deterministic pseudo-random so the same bays are filled on every load. */
function lcg(seed: number) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}
const CAR_COLORS = ["#d9d6cf", "#2d3236", "#8a8f94", "#33485c", "#6b2f2f", "#e8e3d6", "#1f3a33"];
const BIKE_COLORS = ["#2d3236", "#a33a2a", "#2f5d8a", "#c9a24b", "#4a4a4a"];

const rnd = lcg(20261010);
export const vehicles: Vehicle[] = bays
  .filter((b) => rnd() < (b.type === "accessible" ? 0.3 : b.type === "bike" ? 0.6 : 0.62))
  .map((b) => {
    const r = rnd();
    const kind: VehicleKind = b.type === "bike" ? (r < 0.6 ? "motorcycle" : "scooter") : r < 0.4 ? "sedan" : r < 0.75 ? "suv" : "hatch";
    const palette = b.type === "bike" ? BIKE_COLORS : CAR_COLORS;
    const dims = kind === "motorcycle" || kind === "scooter" ? { w: 0.7, d: 1.9 } : kind === "suv" ? { w: 1.95, d: 4.6 } : { w: 1.8, d: 4.2 };
    return { id: `veh-${b.id}`, bayId: b.id, kind, color: palette[Math.floor(rnd() * palette.length)] as string, x: b.x, z: b.z, yaw: b.yaw, ...dims };
  });

export type Tree = { x: number; z: number; r: number; h: number };
const trees: Tree[] = [];
// side boundary, back garden and front garden. Kept clear of drives, bays and paths (a test checks this).
for (let z = 34; z <= 68; z += 8) {
  trees.push({ x: -37.5, z, r: 1.5, h: 4.2 }, { x: 37.8, z: z + 2, r: 1.4, h: 4 });
}
for (let x = -36; x <= 36; x += 9) trees.push({ x, z: -23, r: 1.6, h: 4.6 });
for (let z = -18; z <= 14; z += 9) trees.push({ x: -36.5, z, r: 1.5, h: 4.4 }, { x: 36.5, z, r: 1.5, h: 4.4 });
trees.push({ x: -20, z: 25, r: 1.3, h: 3.6 }, { x: -26, z: 24, r: 1.2, h: 3.4 }, { x: 18, z: 24.5, r: 1.3, h: 3.6 }, { x: 25, z: 25, r: 1.2, h: 3.4 });
export { trees };

export type Bush = { x: number; z: number; r: number };
export const bushes: Bush[] = [];
for (let x = -38; x <= 38; x += 3.2) {
  const inVeh = x > -10.5 && x < -1.5;
  const inPed = x > 3.6 && x < 8.4;
  if (!inVeh && !inPed) bushes.push({ x, z: 70.6, r: 0.7 });
}
for (let x = -26; x <= 26; x += 4) if (x < -4 || x > 11) bushes.push({ x, z: 22, r: 0.65 });

export type Lamp = { x: number; z: number };
export const lamps: Lamp[] = [
  { x: -10.6, z: 66 },
  { x: -1.4, z: 36 },
  { x: -10.6, z: 36 },
  { x: -1.4, z: 66 },
  { x: -37.6, z: 47 },
  { x: -24, z: 56.6 },
  { x: 37.6, z: 47 },
  { x: 22, z: 56.4 },
  { x: 8.8, z: 36 },
  { x: 8.8, z: 56 },
  { x: 8.8, z: 66 },
  { x: -3.4, z: 24 },
];

export type Sign = { id: string; x: number; z: number; text: string; yaw?: number };
export const signs: Sign[] = [
  { id: "sign-gate", x: -12.4, z: 73.8, text: "Vehicle entry" },
  { id: "sign-ped", x: 9.6, z: 73.8, text: "Visitors and pedestrians" },
  { id: "sign-emp", x: -24, z: 56.9, text: "Employee parking" },
  { id: "sign-vis", x: 27, z: 56, text: "Visitor parking" },
  { id: "sign-acc", x: 13.7, z: 38.2, text: "Accessible parking" },
  { id: "sign-bike", x: 19, z: 65.6, text: "Two-wheeler parking" },
  { id: "sign-drop", x: -14, z: 35.2, text: "Visitor drop-off" },
];

/** Exterior destinations rendered by Exterior.tsx (not by the room floor code). */
export const exteriorZones: Zone[] = [
  { id: "main-gate", name: "Main Gate", rect: { x0: -11, x1: 9, z0: 64, z1: 74 }, floor: ASPHALT, props: [] },
  { id: "car-parking", name: "Car Parking", rect: { x0: -37, x1: -9, z0: 38, z1: 56 }, floor: ASPHALT, props: [] },
  { id: "bike-parking", name: "Two-wheeler Parking", rect: { x0: 9, x1: 29, z0: 57, z1: 65 }, floor: ASPHALT, props: [] },
];

export const rectContains = (r: Rect, x: number, z: number, pad = 0) => x > r.x0 - pad && x < r.x1 + pad && z > r.z0 - pad && z < r.z1 + pad;
