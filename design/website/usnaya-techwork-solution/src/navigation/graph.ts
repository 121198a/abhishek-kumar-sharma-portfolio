import { navEdges, navNodes } from "../data/destinations";
import type { NavNode, Vec2 } from "../data/types";
import { wallBoxes, type Box } from "../world/walls";

const byId = new Map<string, NavNode>(navNodes.map((n) => [n.id, n]));
const adj = new Map<string, string[]>();
for (const [a, b] of navEdges) {
  (adj.get(a) ?? adj.set(a, []).get(a)!).push(b);
  (adj.get(b) ?? adj.set(b, []).get(b)!).push(a);
}

export const dist = (a: Vec2, b: Vec2) => Math.hypot(a.x - b.x, a.z - b.z);

/** Dijkstra over the waypoint graph. Returns node ids, or null when unreachable. */
export function shortestPath(from: string, to: string): string[] | null {
  if (!byId.has(from) || !byId.has(to)) return null;
  const d = new Map<string, number>([[from, 0]]);
  const prev = new Map<string, string>();
  const open = new Set<string>([from]);
  while (open.size) {
    let cur = "";
    let best = Infinity;
    for (const id of open) {
      const v = d.get(id) ?? Infinity;
      if (v < best) {
        best = v;
        cur = id;
      }
    }
    open.delete(cur);
    if (cur === to) break;
    const cn = byId.get(cur) as NavNode;
    for (const nb of adj.get(cur) ?? []) {
      const nn = byId.get(nb) as NavNode;
      const alt = best + dist(cn, nn);
      if (alt < (d.get(nb) ?? Infinity)) {
        d.set(nb, alt);
        prev.set(nb, cur);
        open.add(nb);
      }
    }
  }
  if (!d.has(to)) return null;
  const path = [to];
  while (path[0] !== from) {
    const p = prev.get(path[0] as string);
    if (!p) return null;
    path.unshift(p);
  }
  return path;
}

/** True when the straight segment a->b does not cross any wall (walls inflated by `pad`). */
export function segmentClear(a: Vec2, b: Vec2, boxes: Box[] = wallBoxes, pad = 0.25): boolean {
  for (const w of boxes) {
    const minX = w.minX - pad;
    const maxX = w.maxX + pad;
    const minZ = w.minZ - pad;
    const maxZ = w.maxZ + pad;
    let t0 = 0;
    let t1 = 1;
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    let hit = true;
    for (const [p, q, lo, hi] of [
      [a.x, dx, minX, maxX],
      [a.z, dz, minZ, maxZ],
    ] as const) {
      if (Math.abs(q) < 1e-9) {
        if (p < lo || p > hi) {
          hit = false;
          break;
        }
      } else {
        let u0 = (lo - p) / q;
        let u1 = (hi - p) / q;
        if (u0 > u1) [u0, u1] = [u1, u0];
        t0 = Math.max(t0, u0);
        t1 = Math.min(t1, u1);
        if (t0 > t1) {
          hit = false;
          break;
        }
      }
    }
    if (hit) return false;
  }
  return true;
}

/** Nearest node that is visible from `p` (falls back to plain nearest). */
export function nearestNode(p: Vec2): NavNode {
  let best: NavNode | null = null;
  let bestD = Infinity;
  let any: NavNode = navNodes[0] as NavNode;
  let anyD = Infinity;
  for (const n of navNodes) {
    const dd = dist(p, n);
    if (dd < anyD) {
      anyD = dd;
      any = n;
    }
    if (dd < bestD && segmentClear(p, n)) {
      bestD = dd;
      best = n;
    }
  }
  return best ?? any;
}

/** Full route from an arbitrary position to a node: [position, ...waypoints]. */
export function routeFrom(pos: Vec2, toNodeId: string): Vec2[] | null {
  const start = nearestNode(pos);
  const ids = shortestPath(start.id, toNodeId);
  if (!ids) return null;
  const pts: Vec2[] = ids.map((id) => {
    const n = byId.get(id) as NavNode;
    return { x: n.x, z: n.z };
  });
  return [{ x: pos.x, z: pos.z }, ...pts];
}

export function pathLength(path: Vec2[]): number {
  let l = 0;
  for (let i = 1; i < path.length; i++) l += dist(path[i - 1] as Vec2, path[i] as Vec2);
  return l;
}

export function reachableFrom(start: string): Set<string> {
  const seen = new Set<string>([start]);
  const stack = [start];
  while (stack.length) {
    const c = stack.pop() as string;
    for (const nb of adj.get(c) ?? []) {
      if (seen.has(nb)) continue;
      seen.add(nb);
      stack.push(nb);
    }
  }
  return seen;
}
