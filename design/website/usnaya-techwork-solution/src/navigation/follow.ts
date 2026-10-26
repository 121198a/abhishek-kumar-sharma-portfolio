import type { Vec2 } from "../data/types";
import { dist, nearestNode, routeFrom, segmentClear } from "./graph";

/** A follower joins the leader's route within this distance of it. */
export const JOIN_RADIUS = 2.5;

/** Closest point on a polyline that the follower can reach in a straight, wall-free line. */
export function projectOnPath(p: Vec2, path: Vec2[]): { q: Vec2; next: number; d: number } | null {
  let best: { q: Vec2; next: number; d: number } | null = null;
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1] as Vec2;
    const b = path[i] as Vec2;
    const abx = b.x - a.x;
    const abz = b.z - a.z;
    const len2 = abx * abx + abz * abz;
    const t = len2 < 1e-9 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * abx + (p.z - a.z) * abz) / len2));
    const q = { x: a.x + abx * t, z: a.z + abz * t };
    const d = dist(p, q);
    if ((!best || d < best.d) && segmentClear(p, q)) best = { q, next: i, d };
  }
  return best;
}

const dedupe = (pts: Vec2[]) => pts.filter((p, i) => i === 0 || dist(p, pts[i - 1] as Vec2) > 1e-4);

/**
 * The route a follower walks to trail a leader that is about to walk `leaderPath` (which starts at the leader).
 * The follower is given no destination: its path is the leader's route plus a connector to reach it.
 * Because both then share one tail, "distance still to walk" is directly comparable (see the sync rule in WorldSimulation).
 */
export function buildFollowPath(follower: Vec2, leaderPos: Vec2, leaderPath: Vec2[]): Vec2[] | null {
  const join = projectOnPath(follower, leaderPath);
  if (join && join.d <= JOIN_RADIUS) return dedupe([follower, join.q, ...leaderPath.slice(join.next)]);
  const connector = routeFrom(follower, nearestNode(leaderPos).id);
  if (!connector) return null;
  return dedupe([...connector, ...leaderPath.slice(1)]);
}

/** Shortens a polyline by `d` metres from its end (never below its first point). */
export function trimEnd(path: Vec2[], d: number): Vec2[] {
  const out = path.map((p) => ({ ...p }));
  let left = d;
  while (out.length > 1 && left > 0) {
    const a = out[out.length - 2] as Vec2;
    const b = out[out.length - 1] as Vec2;
    const seg = dist(a, b);
    if (seg <= left) {
      left -= seg;
      out.pop();
    } else {
      out[out.length - 1] = { x: b.x + ((a.x - b.x) / seg) * left, z: b.z + ((a.z - b.z) / seg) * left };
      left = 0;
    }
  }
  return out;
}
