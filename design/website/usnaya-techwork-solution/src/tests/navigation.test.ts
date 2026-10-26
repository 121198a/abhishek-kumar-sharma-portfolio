import { describe, expect, it } from "vitest";
import { WaypointNavigator } from "../navigation/WaypointNavigator";
import { resolveCollision, wallBoxes } from "../world/walls";
import { segmentClear } from "../navigation/graph";

describe("WaypointNavigator", () => {
  const path = [
    { x: 0, z: 0 },
    { x: 0, z: 10 },
    { x: 10, z: 10 },
  ];
  it("moves at constant speed and reports arrival once", () => {
    const n = new WaypointNavigator(path[0]!);
    n.setPath(path);
    let arrivals = 0;
    for (let i = 0; i < 400; i++) if (n.step(0.05, 2)) arrivals++;
    expect(arrivals).toBe(1);
    expect(n.pos).toEqual({ x: 10, z: 10 });
    expect(n.moving).toBe(false);
  });
  it("faces the direction of travel", () => {
    const n = new WaypointNavigator(path[0]!);
    n.setPath(path);
    n.step(0.1, 2);
    expect(n.yaw).toBeCloseTo(0); // +z
  });
  it("can be cancelled without arriving", () => {
    const n = new WaypointNavigator(path[0]!);
    n.setPath(path);
    n.step(0.5, 2);
    n.cancel();
    expect(n.step(5, 2)).toBe(false);
  });
  it("teleportToEnd lands on the last waypoint", () => {
    const n = new WaypointNavigator(path[0]!);
    n.setPath(path);
    n.teleportToEnd();
    expect(n.pos).toEqual({ x: 10, z: 10 });
  });
});

describe("collision", () => {
  it("pushes a circle out of a wall", () => {
    const wall = { minX: 0, maxX: 10, minZ: -0.2, maxZ: 0.2 };
    const p = resolveCollision({ x: 5, z: 0.1 }, 0.45, [wall]);
    expect(Math.abs(p.z)).toBeGreaterThanOrEqual(0.2 + 0.44);
  });
  it("blocks a straight line through a wall but not through a door gap", () => {
    // the wall at z = -2 has door gaps at x = -21, -9, 2, 14, 24; x = -12 is solid wall
    expect(segmentClear({ x: -12, z: 0 }, { x: -12, z: -6 }, wallBoxes)).toBe(false);
    expect(segmentClear({ x: 2, z: 0 }, { x: 2, z: -6 }, wallBoxes)).toBe(true);
  });
});
