import { exteriorZones } from "./exterior";
import type { Prop, PropVariant, Rect, Zone } from "./types";

/** Office bounds used for collision, camera clamping and the minimap. */
export const OFFICE_BOUNDS: Rect = { x0: -28, x1: 28, z0: -16, z1: 20 };

const PI = Math.PI;
/** Inner face of the solid outer walls (wall centre line plus half thickness). */
const NORTH = -15.84;
const WEST = -27.84;

/** A desk with its chair tucked in. The user sits on the south side facing north; monitors stand on the north edge. */
function workstation(x: number, z: number, variant: PropVariant): Prop[] {
  return [
    { kind: "desk", x, z, variant },
    { kind: "chair", x, z: z + 1.0, rot: PI, variant: "task" },
  ];
}

/** Chairs on both long sides of a table centred at (x, z), `n` per side, `inset` metres from the table edge. */
function seatsAlong(x: number, z: number, w: number, d: number, n: number, variant: PropVariant, inset = 0.55): Prop[] {
  const out: Prop[] = [];
  for (let i = 0; i < n; i++) {
    const cx = x - w / 2 + (w * (i + 0.5)) / n;
    out.push({ kind: "chair", x: cx, z: z - d / 2 - inset, rot: 0, variant });
    out.push({ kind: "chair", x: cx, z: z + d / 2 + inset, rot: PI, variant });
  }
  return out;
}

export const zones: Zone[] = [
  {
    id: "it-department",
    name: "IT Department",
    rect: { x0: -28, x1: -14, z0: -16, z1: -2 },
    floor: "#8b867d",
    finish: "carpet",
    props: [
      // front row of engineering workstations under the status display
      ...workstation(-25, -14.5, "engineering"),
      ...workstation(-21, -14.5, "engineering"),
      ...workstation(-17, -14.5, "engineering"),
      // second row, leaving the aisle from the door open at x = -21
      ...workstation(-25, -10.5, "engineering"),
      ...workstation(-17.5, -10.5, "engineering"),
      // device test bench against the west wall, with its stool
      { kind: "desk", x: -27.4, z: -12, rot: PI / 2, w: 3, d: 0.75, variant: "bench" },
      { kind: "chair", x: -26.35, z: -12, rot: -PI / 2, variant: "task" },
      // network cabinets justified by the department, with the overhead cable route
      { kind: "rack", x: -27.2, z: -7.5, rot: PI / 2 },
      { kind: "rack", x: -27.2, z: -8.7, rot: PI / 2 },
      { kind: "cableTray", x: -23.4, z: -8.1, w: 8 },
      // equipment storage and printing along the east partition
      { kind: "cabinet", x: -14.5, z: -6.6, rot: -PI / 2, variant: "tall" },
      { kind: "printerStation", x: -14.5, z: -4.6, rot: -PI / 2 },
      // wall items on the solid north and west walls
      { kind: "wallDisplay", x: -21, z: NORTH, w: 2.4, y: 2.0, variant: "code" },
      { kind: "wallClock", x: -14.9, z: NORTH, y: 2.4 },
      { kind: "noticeBoard", x: WEST, z: -12, rot: PI / 2, w: 1.6, y: 1.9 },
      { kind: "extinguisher", x: WEST, z: -3.2, rot: PI / 2 },
      { kind: "firstAid", x: WEST, z: -4.6, rot: PI / 2 },
      { kind: "plant", x: -27.1, z: -15.2, variant: "tall" },
      { kind: "plant", x: -14.9, z: -15.0, variant: "blades" },
      { kind: "plant", x: -18.2, z: -2.8, variant: "tall" },
    ],
  },
  {
    id: "hr-department",
    name: "HR Department",
    rect: { x0: -14, x1: -4, z0: -16, z1: -2 },
    floor: "#9b8b7b",
    finish: "carpet",
    props: [
      ...workstation(-11.3, -13, "hr"),
      ...workstation(-7, -13, "hr"),
      // confidential lateral files and a reference bookcase on the partitions
      { kind: "filing", x: -13.55, z: -9.5, rot: PI / 2 },
      { kind: "shelf", x: -4.45, z: -9, rot: -PI / 2 },
      // soft seating
      { kind: "rug", x: -12.3, z: -5.2, w: 3.2, d: 2.8 },
      { kind: "sofa", x: -13.0, z: -5.2, rot: PI / 2, w: 2.2, variant: "taupe" },
      { kind: "coffeeTable", x: -11.7, z: -5.2, rot: PI / 2, w: 1.1, d: 0.55 },
      // interview table
      { kind: "diningTable", x: -6.3, z: -4.8, w: 1.2, d: 1.2 },
      { kind: "plant", x: -6.3, z: -4.8, y: 0.76, variant: "small" },
      { kind: "chair", x: -6.3, z: -3.8, rot: PI, variant: "guest" },
      { kind: "chair", x: -6.3, z: -5.8, rot: 0, variant: "guest" },
      { kind: "noticeBoard", x: -9, z: NORTH, w: 1.5, y: 1.4 },
      { kind: "wallClock", x: -9, z: NORTH, y: 2.5 },
      { kind: "artFrame", x: -4.85, z: NORTH, w: 0.8, y: 1.6, variant: "art2" },
      { kind: "plant", x: -13.3, z: -15.2, variant: "tall" },
      { kind: "plant", x: -4.8, z: -2.8, variant: "blades" },
    ],
  },
  {
    id: "sales-department",
    name: "Sales Department",
    rect: { x0: -4, x1: 8, z0: -16, z1: -2 },
    floor: "#948c81",
    finish: "carpet",
    props: [
      // open-plan row of three workstations
      ...workstation(-1.4, -13.2, "sales"),
      ...workstation(2, -13.2, "sales"),
      ...workstation(5.4, -13.2, "sales"),
      { kind: "wallDisplay", x: 2, z: NORTH, w: 2.4, y: 2.1, variant: "dashboard" },
      // team huddle table and a mobile pipeline board
      { kind: "diningTable", x: 5.2, z: -6, w: 2, d: 1 },
      ...seatsAlong(5.2, -6, 2, 1, 2, "task"),
      { kind: "whiteboard", x: -2.6, z: -6, rot: PI / 2, w: 1.6, variant: "mobile" },
      { kind: "plant", x: 7.2, z: -15.1, variant: "tall" },
      { kind: "plant", x: -3.3, z: -3.0, variant: "blades" },
    ],
  },
  {
    id: "conference-hall",
    name: "Conference Hall",
    rect: { x0: 8, x1: 20, z0: -16, z1: -2 },
    floor: "#7e7971",
    finish: "carpet",
    props: [
      { kind: "confTable", x: 14, z: -9.5, w: 8, d: 3 },
      ...seatsAlong(14, -9.5, 8, 3, 3, "meeting"),
      { kind: "chair", x: 9.45, z: -9.5, rot: PI / 2, variant: "meeting" },
      { kind: "chair", x: 18.55, z: -9.5, rot: -PI / 2, variant: "meeting" },
      // presentation wall: board, display with a credenza under it, acoustic panels between
      { kind: "whiteboard", x: 9.9, z: NORTH, w: 2.2 },
      { kind: "acousticPanel", x: 11.95, z: NORTH, w: 1.4 },
      { kind: "wallDisplay", x: 14, z: NORTH, w: 2.4, y: 1.9, variant: "welcome" },
      { kind: "credenza", x: 14, z: -15.58, w: 2.4, variant: "conference" },
      { kind: "acousticPanel", x: 16.1, z: NORTH, w: 1.4 },
      { kind: "plant", x: 19.3, z: -15.2, variant: "tall" },
      { kind: "plant", x: 19.2, z: -2.8, variant: "blades" },
      { kind: "plant", x: 8.8, z: -2.8, variant: "tall" },
    ],
  },
  {
    id: "executive-zone",
    name: "Executive Zone",
    rect: { x0: 20, x1: 28, z0: -9, z1: -2 },
    floor: "#9b8b7b",
    finish: "carpet",
    props: [
      { kind: "rug", x: 26.7, z: -5.4, w: 2.6, d: 3.2 },
      { kind: "sofa", x: 27.2, z: -5.4, rot: -PI / 2, w: 2.2, variant: "leather" },
      { kind: "sideTable", x: 27.3, z: -3.2 },
      { kind: "tableLamp", x: 27.3, z: -3.2, y: 0.515 },
      { kind: "lamp", x: 27.2, z: -8.2 },
      { kind: "artFrame", x: 21.4, z: -8.84, w: 0.8, y: 1.45, variant: "art1" },
      { kind: "artFrame", x: 26.4, z: -8.84, w: 0.8, y: 1.45, variant: "art3" },
      { kind: "plant", x: 20.7, z: -2.8, variant: "tall" },
    ],
  },
  {
    id: "manager-cabin",
    name: "Manager's Cabin",
    rect: { x0: 20, x1: 28, z0: -16, z1: -9 },
    floor: "#c19a68",
    finish: "wood",
    props: [
      { kind: "managerDesk", x: 24, z: -14 },
      { kind: "chair", x: 24, z: -15.2, rot: 0, variant: "meeting" },
      // storage and display along the north wall, the window sits behind the desk
      { kind: "credenza", x: 21.4, z: -15.58, w: 1.8, variant: "executive" },
      { kind: "artFrame", x: 21.4, z: NORTH, w: 0.7, y: 1.7, variant: "art2" },
      { kind: "shelf", x: 26.8, z: -15.62, w: 2 },
      // guest seating facing the desk
      { kind: "rug", x: 24, z: -11.6, w: 4.2, d: 2.8 },
      { kind: "armchair", x: 22, z: -11.6, rot: PI, variant: "leather" },
      { kind: "armchair", x: 26, z: -11.6, rot: PI, variant: "leather" },
      { kind: "sideTable", x: 27.2, z: -10.2 },
      { kind: "tableLamp", x: 27.2, z: -10.2, y: 0.515 },
      { kind: "lamp", x: 20.9, z: -10.0 },
      { kind: "artFrame", x: 21.6, z: -9.16, rot: PI, w: 0.8, y: 1.35, variant: "art3" },
      { kind: "artFrame", x: 26.4, z: -9.16, rot: PI, w: 0.8, y: 1.35, variant: "art1" },
    ],
  },
  {
    id: "office-kitchen",
    name: "Kitchen and Break Area",
    rect: { x0: -18, x1: -4, z0: 2, z1: 16 },
    floor: "#ece5d8",
    finish: "tile",
    props: [
      // kitchen run along the south glass: tall fridge, pantry, base cabinets with worktop and appliances
      { kind: "fridge", x: -17, z: 15.4, rot: PI },
      { kind: "cabinet", x: -15.7, z: 15.45, rot: PI, w: 0.9, d: 0.6, variant: "tall" },
      { kind: "counter", x: -10.4, z: 15.35, rot: PI, w: 8.4 },
      { kind: "coffee", x: -13.3, z: 15.35, rot: PI },
      { kind: "microwave", x: -8.8, z: 15.35, rot: PI },
      { kind: "sink", x: -7, z: 15.35, rot: PI },
      { kind: "binSet", x: -5.05, z: 15.3, rot: PI },
      { kind: "dispenser", x: -17.6, z: 12.6, rot: PI / 2 },
      // dining
      { kind: "diningTable", x: -9, z: 9, w: 3.2, d: 1.4 },
      ...seatsAlong(-9, 9, 3.2, 1.4, 2, "cafe", 0.6),
      { kind: "diningTable", x: -14, z: 7.5, w: 2.4, d: 1.2 },
      ...seatsAlong(-14, 7.5, 2.4, 1.2, 2, "cafe", 0.6),
      { kind: "plant", x: -9, z: 9, y: 0.76, variant: "small" },
      { kind: "plant", x: -14, z: 7.5, y: 0.76, variant: "small" },
      { kind: "pendant", x: -9.8, z: 9, y: 1.2 },
      { kind: "pendant", x: -8.2, z: 9, y: 1.2 },
      { kind: "pendant", x: -14, z: 7.5, y: 1.2 },
      { kind: "plant", x: -4.9, z: 3.0, variant: "tall" },
      { kind: "plant", x: -17.4, z: 3.0, variant: "tall" },
    ],
  },
  {
    id: "waiting-lounge",
    name: "Visitor Waiting Lounge",
    rect: { x0: 8, x1: 22, z0: 2, z1: 16 },
    floor: "#ab9983",
    finish: "carpet",
    props: [
      { kind: "rug", x: 15, z: 10.6, w: 7.4, d: 5 },
      { kind: "sofa", x: 12.4, z: 12.6, rot: PI, variant: "sand" },
      { kind: "sofa", x: 17.6, z: 12.6, rot: PI, variant: "sand" },
      { kind: "coffeeTable", x: 15, z: 9.7, w: 1.4, d: 0.7 },
      { kind: "armchair", x: 10.4, z: 9.8, rot: PI / 2, variant: "taupe" },
      { kind: "armchair", x: 19.6, z: 9.8, rot: -PI / 2, variant: "taupe" },
      { kind: "sideTable", x: 19.9, z: 12.9 },
      { kind: "tableLamp", x: 19.9, z: 12.9, y: 0.515 },
      { kind: "pendant", x: 15, z: 9.7, y: 1.0 },
      { kind: "shelf", x: 21.55, z: 6.5, rot: -PI / 2, w: 2 },
      { kind: "lamp", x: 9.1, z: 14.8 },
      { kind: "plant", x: 21.2, z: 3.4, variant: "tall" },
      { kind: "plant", x: 8.9, z: 3.4, variant: "tall" },
    ],
  },
  {
    id: "reception",
    name: "Reception",
    rect: { x0: -4, x1: 8, z0: 2, z1: 20 },
    floor: "#ede7db",
    finish: "stone",
    props: [
      // desk with the receptionist behind it, a slatted feature wall for the company sign behind her
      { kind: "receptionDesk", x: 3, z: 10, w: 6 },
      { kind: "chair", x: 4.8, z: 9.0, rot: 0, variant: "task" },
      { kind: "brandWall", x: 3, z: 5.9, w: 5.4, d: 0.3 },
      { kind: "extinguisher", x: 1, z: 5.75, rot: PI },
      { kind: "firstAid", x: 5.1, z: 5.75, rot: PI },
      // visitor seating cluster on the west side
      { kind: "rug", x: -1.4, z: 16.4, w: 3.6, d: 2.8 },
      { kind: "sofa", x: -3, z: 16.4, rot: PI / 2, w: 2.4, variant: "charcoal" },
      { kind: "coffeeTable", x: -1.4, z: 16.4, rot: PI / 2, w: 1.1, d: 0.55 },
      { kind: "armchair", x: -1.4, z: 14.4, rot: 0, variant: "taupe" },
      { kind: "armchair", x: -1.4, z: 18.4, rot: PI, variant: "taupe" },
      { kind: "plant", x: -1.4, z: 16.4, y: 0.44, variant: "small" },
      { kind: "securityDesk", x: 6.4, z: 16.6, rot: -PI / 2 },
      { kind: "exitSign", x: 2, z: 19.84, rot: PI, y: 2.7 },
      { kind: "plant", x: -3.2, z: 4.0, variant: "tall" },
      { kind: "plant", x: 7.2, z: 4.0, variant: "tall" },
      { kind: "plant", x: 7.2, z: 18.6, variant: "tall" },
      { kind: "plant", x: -3.2, z: 19.2, variant: "blades" },
      { kind: "lamp", x: -3.3, z: 12.8 },
    ],
  },
];

/** Circulation space that belongs to no room: the corridor and the two landings at its ends. */
export const commonAreaProps: Prop[] = [
  // west landing: wayfinding board, informal seating
  { kind: "directoryBoard", x: WEST, z: 9, rot: PI / 2, y: 1.45 },
  { kind: "artFrame", x: WEST, z: 5.2, rot: PI / 2, w: 0.9, y: 1.55, variant: "art1" },
  { kind: "artFrame", x: WEST, z: 12.8, rot: PI / 2, w: 0.9, y: 1.55, variant: "art3" },
  { kind: "bench", x: -27.4, z: 9, rot: PI / 2, w: 2.2 },
  { kind: "rug", x: -23.2, z: 12.2, w: 3.6, d: 2.8, variant: "charcoal" },
  { kind: "armchair", x: -24.6, z: 12.2, rot: PI / 2, variant: "charcoal" },
  { kind: "armchair", x: -21.8, z: 12.2, rot: -PI / 2, variant: "charcoal" },
  { kind: "sideTable", x: -23.2, z: 12.2 },
  { kind: "plant", x: -23.2, z: 12.2, y: 0.515, variant: "small" },
  { kind: "plant", x: -27.1, z: 3.2, variant: "tall" },
  { kind: "plant", x: -27.1, z: 15.0, variant: "tall" },
  { kind: "plant", x: -18.6, z: 15.0, variant: "blades" },
  // east landing: benches by the glass
  { kind: "bench", x: 27.4, z: 6.5, rot: -PI / 2, w: 1.8 },
  { kind: "bench", x: 27.4, z: 11.5, rot: -PI / 2, w: 1.8 },
  { kind: "plant", x: 27.2, z: 3.2, variant: "tall" },
  { kind: "plant", x: 27.2, z: 15.0, variant: "tall" },
  { kind: "plant", x: 22.7, z: 15.0, variant: "blades" },
  // corridor
  { kind: "bench", x: -16, z: -1.35, w: 1.8 },
  { kind: "bench", x: 8, z: -1.35, w: 1.8 },
  { kind: "plant", x: -26.8, z: -0.9, variant: "tall" },
  { kind: "plant", x: 26.8, z: -0.9, variant: "tall" },
];

/** Every placed prop in the building, room by room, then the common areas. */
export const allProps: Prop[] = [...zones.flatMap((z) => z.props), ...commonAreaProps];

/** Areas that receive a ceiling light grid: every room plus the corridor and the two landings. */
export const lightAreas: Rect[] = [
  ...zones.map((z) => z.rect),
  { x0: -28, x1: 28, z0: -2, z1: 2 },
  { x0: -28, x1: -18, z0: 2, z1: 16 },
  { x0: 22, x1: 28, z0: 2, z1: 16 },
];

export const centerOf = (r: Rect) => ({ x: (r.x0 + r.x1) / 2, z: (r.z0 + r.z1) / 2 });
export const zoneById = (id: string) => zones.find((z) => z.id === id) ?? exteriorZones.find((z) => z.id === id);
