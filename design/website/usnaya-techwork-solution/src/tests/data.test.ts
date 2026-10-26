import { describe, expect, it } from "vitest";
import { characters } from "../data/characters";
import { zoneById, zones } from "../data/departments";
import { bays, bushes, COMPOUND, lamps, paths, rectContains, roads, signs, trees, vehicles } from "../data/exterior";
import { destinations, navEdges, navNodes, TOUR_STOPS } from "../data/destinations";
import { conversations } from "../dialogue/conversations";
import { validateAllConversations, validateConversation } from "../dialogue/DialogueValidator";
import { reachableFrom, routeFrom, segmentClear, shortestPath } from "../navigation/graph";
import { propBoxes } from "../world/propBoxes";
import { wallBoxes } from "../world/walls";
import { DESTINATION_IDS } from "../../server/security/allowlist";

const unique = (a: string[]) => new Set(a).size === a.length;

describe("data integrity", () => {
  it("has unique ids", () => {
    expect(unique(zones.map((z) => z.id))).toBe(true);
    expect(unique(navNodes.map((n) => n.id))).toBe(true);
    expect(unique(characters.map((c) => c.id))).toBe(true);
    expect(unique(destinations.map((d) => d.id))).toBe(true);
  });

  it("references existing nodes, zones and characters", () => {
    const nodes = new Set(navNodes.map((n) => n.id));
    for (const [a, b] of navEdges) {
      expect(nodes.has(a), a).toBe(true);
      expect(nodes.has(b), b).toBe(true);
    }
    for (const d of destinations) {
      expect(nodes.has(d.nodeId), d.id).toBe(true);
      expect(zoneById(d.zoneId), d.id).toBeDefined();
    }
  });

  it("keeps every character inside the property", () => {
    for (const c of characters) {
      expect(c.position.x, c.id).toBeGreaterThan(COMPOUND.x0);
      expect(c.position.x, c.id).toBeLessThan(COMPOUND.x1);
      expect(c.position.z, c.id).toBeGreaterThan(COMPOUND.z0);
      expect(c.position.z, c.id).toBeLessThan(COMPOUND.z1);
    }
  });

  it("has the six named characters, and invents no titles", () => {
    const named = ["umesh", "abhishek", "receptionist", "ankita", "bhavishya", "dravya"].map((id) => characters.find((c) => c.id === id));
    expect(named.map((c) => c?.displayName)).toEqual(["Umesh Sharma", "Abhishek Sharma", "Priya Sharma", "Ankita Sharma", "Bhavishya Sharma", "Dravya Sharma"]);
    expect(named[0]?.role).toBe("Managing Director");
    expect(named[1]?.role).toBe("Head of IT Department");
    for (const c of named.slice(2)) {
      expect(c?.role).toBe("Title to be confirmed");
      expect(c?.roleUnconfirmed).toBe(true);
    }
  });

  it("matches the server allow-list", () => {
    expect([...DESTINATION_IDS].sort()).toEqual(destinations.map((d) => d.id).sort());
  });
});

describe("navigation graph", () => {
  it("reaches every node from the entrance", () => {
    const seen = reachableFrom("entrance");
    for (const n of navNodes) expect(seen.has(n.id), n.id).toBe(true);
  });

  it("routes from the entrance and from reception to every destination, and back", () => {
    for (const d of destinations) {
      expect(shortestPath("entrance", d.nodeId), `entrance -> ${d.id}`).not.toBeNull();
      expect(shortestPath("rec_front", d.nodeId), `reception -> ${d.id}`).not.toBeNull();
      expect(shortestPath(d.nodeId, "rec_front"), `${d.id} -> reception`).not.toBeNull();
    }
  });

  it("never draws a waypoint segment through a wall or large furniture", () => {
    const boxes = [...wallBoxes, ...propBoxes];
    const byId = new Map(navNodes.map((n) => [n.id, n]));
    for (const [a, b] of navEdges) {
      const pa = byId.get(a);
      const pb = byId.get(b);
      if (!pa || !pb) throw new Error("missing node");
      // the entrance point is outside the building, and the entrance gap is open
      expect(segmentClear(pa, pb, boxes, 0.2), `${a} -> ${b}`).toBe(true);
    }
  });

  it("finds a route from an arbitrary corridor position", () => {
    const r = routeFrom({ x: -5, z: 0.5 }, "cabin_front");
    expect(r).not.toBeNull();
    expect((r ?? []).length).toBeGreaterThan(2);
  });
});

describe("dialogue", () => {
  it("has no broken conversations", () => {
    expect(validateAllConversations(conversations, characters, destinations)).toEqual([]);
  });

  it("detects missing nodes, dead ends and unreachable nodes", () => {
    const speakers = new Set(["receptionist"]);
    const dests = new Set(["reception"]);
    const errors = validateConversation(
      {
        id: "broken",
        startNodeId: "a",
        status: "placeholder",
        nodes: {
          a: { id: "a", speakerId: "receptionist", text: "x", choices: [{ id: "c", label: "go", nextNodeId: "missing" }] },
          b: { id: "b", speakerId: "receptionist", text: "dead end" },
          c: { id: "c", speakerId: "ghost", text: "unreachable", end: true },
        },
      },
      speakers,
      dests,
    );
    expect(errors.some((e) => e.includes("missing node"))).toBe(true);
    expect(errors.some((e) => e.includes("dead end"))).toBe(true);
    expect(errors.some((e) => e.includes("unreachable"))).toBe(true);
    expect(errors.some((e) => e.includes("unknown speaker"))).toBe(true);
  });
});

describe("exterior layout", () => {
  const inCompound = (x: number, z: number) => rectContains(COMPOUND, x, z);
  const overlap = (a: { x: number; z: number; w: number; d: number }, b: { x: number; z: number; w: number; d: number }) =>
    Math.abs(a.x - b.x) < (a.w + b.w) / 2 && Math.abs(a.z - b.z) < (a.d + b.d) / 2;

  it("keeps every bay inside the property and none overlapping", () => {
    for (const b of bays) {
      expect(inCompound(b.x - b.w / 2, b.z - b.d / 2), b.id).toBe(true);
      expect(inCompound(b.x + b.w / 2, b.z + b.d / 2), b.id).toBe(true);
    }
    for (let i = 0; i < bays.length; i++)
      for (let j = i + 1; j < bays.length; j++) {
        const a = bays[i]!;
        const c = bays[j]!;
        expect(overlap({ ...a, w: a.w - 0.02 }, { ...c, w: c.w - 0.02 }), `${a.id} / ${c.id}`).toBe(false);
      }
  });

  it("has separate car, visitor, accessible and two-wheeler bays", () => {
    const types = new Set(bays.map((b) => b.type));
    expect([...types].sort()).toEqual(["accessible", "bike", "car", "visitor"]);
    expect(bays.filter((b) => b.type === "accessible").every((b) => b.w >= 3.5)).toBe(true);
  });

  it("parks each vehicle fully inside its own bay, one per bay, facing the aisle", () => {
    const seen = new Set<string>();
    for (const v of vehicles) {
      const b = bays.find((x) => x.id === v.bayId);
      expect(b, v.id).toBeDefined();
      expect(seen.has(v.bayId), `duplicate in ${v.bayId}`).toBe(false);
      seen.add(v.bayId);
      if (!b) continue;
      expect(v.w).toBeLessThanOrEqual(b.w);
      expect(v.d).toBeLessThanOrEqual(b.d);
      expect(v.yaw).toBe(b.yaw);
      const bike = v.kind === "motorcycle" || v.kind === "scooter";
      expect(bike).toBe(b.type === "bike");
    }
    expect(vehicles.length).toBeGreaterThan(10);
  });

  it("keeps trees, lamps, signs and bushes off roads, bays and paths", () => {
    const blocked = [...roads, ...paths].map((r) => r.rect);
    const bad = (x: number, z: number, pad: number) => blocked.some((r) => rectContains(r, x, z, pad));
    for (const t of trees) expect(bad(t.x, t.z, t.r * 0.6), `tree ${t.x},${t.z}`).toBe(false);
    for (const l of lamps) expect(bad(l.x, l.z, 0.15), `lamp ${l.x},${l.z}`).toBe(false);
    for (const s of signs) expect(bad(s.x, s.z, 0.1), s.id).toBe(false);
    for (const b of bushes) expect(bad(b.x, b.z, 0.3), `bush ${b.x},${b.z}`).toBe(false);
  });

  it("keeps the gate openings free of plants", () => {
    for (const b of bushes.filter((x) => x.z > 60)) {
      const inVeh = b.x > -10.2 && b.x < -1.8;
      const inPed = b.x > 4.5 && b.x < 7.5;
      expect(inVeh || inPed, `bush ${b.x}`).toBe(false);
    }
  });

  it("routes visitors from the street to the gate, both car and bike parking, and the building", () => {
    for (const id of ["gate_in", "park_car", "park_bike", "plaza", "rec_front"]) expect(shortestPath("street", id), id).not.toBeNull();
  });

  it("has a guided tour that visits the exterior first and then every destination once", () => {
    expect(new Set(TOUR_STOPS).size).toBe(TOUR_STOPS.length);
    expect(TOUR_STOPS.slice(0, 3)).toEqual(["main-gate", "car-parking", "bike-parking"]);
    expect([...TOUR_STOPS].sort()).toEqual(destinations.map((d) => d.id).sort());
  });
});
