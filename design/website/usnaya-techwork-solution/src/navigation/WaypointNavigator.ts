import type { Vec2 } from "../data/types";

/** Moves a point along a polyline at constant speed. Pure logic, no rendering. */
export class WaypointNavigator {
  pos: Vec2;
  yaw = 0;
  private path: Vec2[] = [];
  private idx = 0;
  moving = false;

  constructor(start: Vec2, yaw = 0) {
    this.pos = { ...start };
    this.yaw = yaw;
  }

  setPath(path: Vec2[]) {
    this.path = path.map((p) => ({ ...p }));
    this.idx = 1;
    this.moving = this.path.length > 1;
  }

  cancel() {
    this.path = [];
    this.moving = false;
  }

  teleportToEnd() {
    const last = this.path[this.path.length - 1];
    if (last) this.pos = { ...last };
    this.cancel();
  }

  /** Distance still to walk along the current path (0 when idle). */
  remaining(): number {
    if (!this.moving) return 0;
    let total = 0;
    let prev = this.pos;
    for (let i = this.idx; i < this.path.length; i++) {
      const p = this.path[i] as Vec2;
      total += Math.hypot(p.x - prev.x, p.z - prev.z);
      prev = p;
    }
    return total;
  }

  get end(): Vec2 | undefined {
    return this.path[this.path.length - 1];
  }

  /** Advance by speed*dt. Returns true on the step the end is reached. */
  step(dt: number, speed: number): boolean {
    if (!this.moving) return false;
    let remaining = speed * dt;
    while (remaining > 0 && this.idx < this.path.length) {
      const target = this.path[this.idx] as Vec2;
      const dx = target.x - this.pos.x;
      const dz = target.z - this.pos.z;
      const d = Math.hypot(dx, dz);
      if (d > 1e-6) this.yaw = Math.atan2(dx, dz);
      if (d <= remaining) {
        this.pos = { ...target };
        remaining -= d;
        this.idx++;
      } else {
        this.pos = { x: this.pos.x + (dx / d) * remaining, z: this.pos.z + (dz / d) * remaining };
        remaining = 0;
      }
    }
    if (this.idx >= this.path.length) {
      this.moving = false;
      this.path = [];
      return true;
    }
    return false;
  }
}
