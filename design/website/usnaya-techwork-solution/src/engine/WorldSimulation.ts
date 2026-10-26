import { characters } from "../data/characters";
import { GATE } from "../data/exterior";
import { destinationById, ENTRANCE_NODE, MANAGER_DOOR, nodeById, RECEPTION_HOME_NODE } from "../data/destinations";
import type { CharacterDefinition, Vec2 } from "../data/types";
import type { ExperienceContext } from "../experience/ExperienceMachine";
import { dist, routeFrom } from "../navigation/graph";
import { buildFollowPath, trimEnd } from "../navigation/follow";
import { WaypointNavigator } from "../navigation/WaypointNavigator";
import { propBoxes } from "../world/propBoxes";
import { cabinDoorBox, gateLeafBox, resolveCollision, wallBoxes } from "../world/walls";
import { useUi } from "../store/uiStore";
import { voice } from "./VoiceManager";

export type Anim = "idle" | "walk" | "talk" | "type" | "sit" | "wave";

export type CharRuntime = {
  def: CharacterDefinition;
  nav: WaypointNavigator;
  yaw: number;
  anim: Anim;
  home: Vec2;
  patrolIdx: number;
  patrolDir: 1 | -1;
  patrolWait: number;
  wavedAt: number;
};

export type Snapshot = { name: string; sub: string | null; context: ExperienceContext };
export type Input = { x: number; z: number; forward: Vec2 };
export type Nearby = { kind: "character" | "door" | "gate"; id: string; label: string; verb: string } | null;

export const VISITOR_SPEED = 3.4;
export const GUIDE_SPEED = 3.3;
export const FREE_SPEED = 4.6;
const RADIUS = 0.45;
export const GUIDE_ID = "receptionist";
/** How far behind the guide the visitor stops, and how far ahead the guide may get before she waits. */
export const FOLLOW_GAP = 1.6;
const FOLLOW_MIN = FOLLOW_GAP + 0.2;
const FOLLOW_MAX = 4.5;
const TRACE_LIMIT = 200;
const TRAVEL_STATES = new Set(["arrival", "guidedTravel"]);

const turn = (cur: number, target: number, maxStep: number) => {
  let d = target - cur;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return cur + Math.max(-maxStep, Math.min(maxStep, d));
};

export class WorldSimulation {
  visitor = new WaypointNavigator(nodeById(ENTRANCE_NODE) as Vec2, Math.PI);
  chars = new Map<string, CharRuntime>();
  doorOpen = 0;
  doorUnlocked = false;
  /** Vehicle gate: 0 closed, 1 open. Toggled by the visitor (E near the gate controls). */
  gateOpen = 0;
  gateTarget: 0 | 1 = 0;
  nearby: Nearby = null;
  onStep: (() => void) | null = null;

  private activeRoute = -1;
  private lastSkip = 0;
  private leading = false;
  private speedMul = 1;
  private visitorDone = true;
  private guideDone = true;
  private stepTimer = 0;
  private pendingSkip = false;
  private stall = 0;
  private prevName = "";
  /** Emits events to the Director; injected so the simulation stays testable. */
  constructor(private emit: (e: { type: "navigation:arrived"; routeId: number } | { type: "navigation:started"; routeId: number }) => void) {
    for (const def of characters) {
      this.chars.set(def.id, {
        def,
        nav: new WaypointNavigator(def.position, def.facing),
        yaw: def.facing,
        anim: "idle",
        home: { ...def.position },
        patrolIdx: 0,
        patrolDir: 1 as const,
        patrolWait: 1,
        wavedAt: -99,
      });
    }
  }

  get guide(): CharRuntime {
    return this.chars.get(GUIDE_ID) as CharRuntime;
  }

  /** Put everything back to the start (used on restart). */
  reset() {
    this.visitor = new WaypointNavigator(nodeById(ENTRANCE_NODE) as Vec2, Math.PI);
    for (const c of this.chars.values()) {
      c.nav = new WaypointNavigator(c.def.position, c.def.facing);
      c.yaw = c.def.facing;
      c.anim = "idle";
    }
    this.activeRoute = -1;
    this.task = null;
    this.trace = [];
    this.doorUnlocked = false;
    this.doorOpen = 0;
    this.gateOpen = 0;
    this.gateTarget = 0;
    this.leading = false;
    this.visitorDone = true;
    this.guideDone = true;
    this.lastSkip = 0;
    this.pendingSkip = false;
    this.stall = 0;
    this.prevName = "";
    this.nearby = null;
  }

  /** Open or close the vehicle gate. Works for real: the gate leaf animates and blocks movement while closed. */
  toggleGate() {
    this.gateTarget = this.gateTarget === 1 ? 0 : 1;
  }

  /** Navigation trace (newest last). Always recorded so tests and the console can inspect task hand-over. */
  trace: string[] = [];
  /** Set `window.__NAV_DEBUG = true` (or `localStorage["usnaya.debug"] = "1"`) to mirror the trace to the console. */
  private log(msg: string) {
    this.trace.push(msg);
    if (this.trace.length > TRACE_LIMIT) this.trace.shift();
    if (typeof window !== "undefined" && (window as unknown as { __NAV_DEBUG?: boolean }).__NAV_DEBUG) console.debug(`[nav] ${msg}`);
  }

  /** The one active guided task. Only the task whose id matches the Director's routeId may move anyone or report arrival. */
  private task: { id: number; destId: string } | null = null;

  /** Drops everything the previous task left behind: both characters' paths, follow state and stall timer. (A queued skip is cleared when travel ends.) */
  private cancelTask(reason: string) {
    if (this.task) this.log(`task ${this.task.id} (${this.task.destId}) cancelled: ${reason}`);
    this.task = null;
    this.visitor.cancel();
    this.guide.nav.cancel();
    this.leading = false;
    this.visitorDone = true;
    this.guideDone = true;
    this.stall = 0;
  }

  /**
   * Starts task `routeId`, replacing any earlier one immediately. While guided, the guide alone owns the destination route;
   * the visitor receives no destination, only the guide's route to trail her along (see buildFollowPath).
   */
  private startRoute(destId: string, routeId: number, guided: boolean) {
    const dest = destinationById(destId);
    if (!dest) return;
    this.cancelTask(`replaced by task ${routeId} (${destId})`);
    this.activeRoute = routeId;
    this.task = { id: routeId, destId };
    const guide = this.guide;
    const guidePath = guided ? routeFrom(guide.nav.pos, dest.nodeId) : null;
    this.leading = guidePath !== null;
    let visitorPath: Vec2[] | null;
    if (guidePath) {
      visitorPath = buildFollowPath(this.visitor.pos, guide.nav.pos, guidePath);
      if (visitorPath) visitorPath = trimEnd(visitorPath, FOLLOW_GAP);
      else this.leading = false;
    } else {
      // Not a guided walk (arrival from the street) or the guide cannot reach it: the visitor walks alone.
      visitorPath = routeFrom(this.visitor.pos, dest.nodeId);
    }
    if (!visitorPath) {
      // unreachable: stop safely, inform the user, and let the Director continue from the current position
      useUi.getState().setToast(`Destination ${dest.label} is currently unreachable from your location.`);
      this.log(`task ${routeId} (${destId}) unreachable`);
      this.cancelTask("unreachable");
      this.emit({ type: "navigation:arrived", routeId });
      return;
    }
    if (this.leading && guidePath) {
      guide.nav.setPath(guidePath);
      this.guideDone = !guide.nav.moving;
    }
    let len = 0;
    for (let i = 1; i < visitorPath.length; i++) len += dist(visitorPath[i - 1] as Vec2, visitorPath[i] as Vec2);
    this.speedMul = len > 40 ? 1.5 : 1;
    this.visitor.setPath(visitorPath);
    this.visitorDone = !this.visitor.moving;
    this.log(`task ${routeId} started: ${destId}; guide ${this.leading ? "leads" : "idle"}, visitor ${this.leading ? "follows guide" : "walks alone"}`);
    this.emit({ type: "navigation:started", routeId });
    if (this.visitorDone && this.guideDone) this.finishTask(routeId);
  }

  /** Reports arrival for the active task, once. */
  private finishTask(routeId: number) {
    if (routeId !== this.activeRoute) {
      this.log(`ignored arrival of obsolete task ${routeId} (active ${this.activeRoute})`);
      return;
    }
    this.log(`task ${routeId} arrived`);
    this.activeRoute = -1;
    this.task = null;
    this.leading = false;
    this.emit({ type: "navigation:arrived", routeId });
  }

  private snapRoute() {
    if (this.activeRoute < 0) return;
    this.visitor.teleportToEnd();
    if (this.leading) this.guide.nav.teleportToEnd();
    this.visitorDone = true;
    this.guideDone = true;
  }

  update(dt: number, snap: Snapshot, input: Input, time: number) {
    dt = Math.min(dt, 0.1);
    const { name, sub, context } = snap;
    const travelling = TRAVEL_STATES.has(name);

    // ---- skip
    if (context.skipCount !== this.lastSkip) {
      this.lastSkip = context.skipCount;
      if (travelling) this.pendingSkip = true; // applied once the route exists (it may start this very frame)
      else if (name === "reception" && dist(this.visitor.pos, nodeById("rec_front") as Vec2) > 3) {
        const n = nodeById("rec_front") as Vec2;
        this.visitor.pos = { x: n.x, z: n.z };
        this.visitor.yaw = Math.PI;
      }
    }

    if (context.paused) return;

    // ---- route lifecycle
    if (travelling && context.destinationId && context.routeId !== this.activeRoute) {
      this.startRoute(context.destinationId, context.routeId, name === "guidedTravel");
    } else if (!travelling && this.activeRoute >= 0) {
      this.cancelTask(`left travel state (${name})`);
      this.activeRoute = -1;
    }

    if (this.pendingSkip && travelling && this.activeRoute >= 0) {
      this.pendingSkip = false;
      this.snapRoute();
    }
    if (!travelling) this.pendingSkip = false;

    // ---- manager door: walk into the cabin once permission is granted
    if (name === "managerDialogue" && this.prevName !== "managerDialogue") {
      const inside = nodeById("cabin_in") as Vec2;
      const p = routeFrom(this.visitor.pos, "cabin_in");
      this.doorUnlocked = true;
      if (p && dist(this.visitor.pos, inside) > 0.5) this.visitor.setPath(p);
    }
    if (name === "managerDoor" && sub === "opening") this.doorUnlocked = true;
    if (this.doorUnlocked && name !== "managerDoor" && name !== "managerDialogue" && this.visitor.pos.z > -7.8 && this.visitor.pos.x > 19) {
      this.doorUnlocked = false;
    }
    this.doorOpen += ((this.doorUnlocked ? 1 : 0) - this.doorOpen) * Math.min(1, dt * 3.2);
    this.gateOpen += (this.gateTarget - this.gateOpen) * Math.min(1, dt * 1.6);
    this.prevName = name;

    // ---- visitor movement
    const guide = this.guide;
    if (travelling && this.activeRoute >= 0) {
      // Both characters' remaining distance is measured to the same end point, so this is how far the guide is ahead
      // along the route. It can be negative right after a re-route if the visitor stands ahead of her: she then walks past first.
      const lead = this.leading ? this.visitor.remaining() + FOLLOW_GAP - guide.nav.remaining() : 0;
      const mayMove = !this.leading || this.guideDone || lead > FOLLOW_MIN;
      const mayLead = this.leading && !this.guideDone && (this.visitorDone || lead < FOLLOW_MAX);
      let moved = false;
      if (!this.visitorDone && mayMove && this.visitor.step(dt, VISITOR_SPEED * this.speedMul)) this.visitorDone = true;
      if (!this.visitorDone && mayMove) moved = true;
      if (mayLead) {
        moved = true;
        if (guide.nav.step(dt, GUIDE_SPEED * this.speedMul)) this.guideDone = true;
      }
      this.stall = moved || this.visitorDone ? 0 : this.stall + dt;

      // Stuck: rebuild the guide's route from where she is and the visitor's follow path from it. Still no destination for the visitor.
      if (this.stall > 2.2 && this.task && this.leading) {
        const dest = destinationById(this.task.destId);
        const gp = dest ? routeFrom(guide.nav.pos, dest.nodeId) : null;
        const vp = gp ? buildFollowPath(this.visitor.pos, guide.nav.pos, gp) : null;
        if (gp && vp) {
          guide.nav.setPath(gp);
          this.guideDone = !guide.nav.moving;
          this.visitor.setPath(trimEnd(vp, FOLLOW_GAP));
          this.visitorDone = !this.visitor.moving;
          this.stall = 0;
          this.log(`task ${this.task.id} rerouted after stall`);
          useUi.getState().setToast("Rerouting around obstacle…");
        }
      }

      // Still stuck: give up safely so neither character loops forever.
      if (this.stall > 4.5) {
        const id = this.activeRoute;
        this.log(`task ${id} abandoned: path obstructed`);
        this.cancelTask("path obstructed");
        useUi.getState().setToast("Path obstructed. Returning to safe position.");
        this.activeRoute = id;
        this.finishTask(id);
      } else if (this.visitorDone && this.guideDone) {
        this.finishTask(this.activeRoute);
      }
    } else if (name === "managerDialogue") {
      this.visitor.step(dt, VISITOR_SPEED);
    } else if (name === "freeExplore") {
      this.freeMove(dt, input);
    }
    if (this.visitor.moving) {
      this.stepTimer -= dt;
      if (this.stepTimer <= 0) {
        this.stepTimer = 0.42;
        this.onStep?.();
      }
    }

    // ---- characters
    const inConversation = name === "dialogue" || name === "reception" || name === "managerDialogue";
    const speaker = inConversation ? context.speakerId : null;
    const leadingNow = this.leading && travelling;
    const holdGuide = name === "managerDoor" || name === "managerDialogue";

    for (const c of this.chars.values()) {
      const isGuide = c.def.id === GUIDE_ID;
      if (isGuide && !leadingNow && !holdGuide && !c.nav.moving && dist(c.nav.pos, c.home) > 0.3) {
        const p = routeFrom(c.nav.pos, RECEPTION_HOME_NODE);
        if (p) c.nav.setPath(p);
      }
      if (isGuide && !leadingNow && c.nav.moving) c.nav.step(dt, GUIDE_SPEED + 0.8);

      if (c.def.movementProfile === "patrol" && c.def.patrol && !isGuide) this.patrol(c, dt, speaker === c.def.id);

      const moving = c.nav.moving;
      const toV = Math.atan2(this.visitor.pos.x - c.nav.pos.x, this.visitor.pos.z - c.nav.pos.z);
      const near = dist(this.visitor.pos, c.nav.pos) < 6.5;
      if (moving) c.yaw = turn(c.yaw, c.nav.yaw, dt * 8);
      else if (speaker === c.def.id || near) c.yaw = turn(c.yaw, toV, dt * 5);
      else c.yaw = turn(c.yaw, c.def.facing, dt * 3);

      const greeting =
        !moving &&
        !speaker &&
        c.def.pose === "stand" &&
        c.def.conversationId !== undefined &&
        near &&
        dist(this.visitor.pos, c.nav.pos) < 4.6 &&
        time - c.wavedAt < 2.4;
      if (!moving && !speaker && near && c.def.pose === "stand" && c.def.conversationId && time - c.wavedAt > 14) c.wavedAt = time;

      // Behavior scheduling: realistic work, meeting, and break rhythms
      let activeAnim: Anim;
      if (moving) {
        activeAnim = "walk";
      } else if (speaker === c.def.id || (c.def.id === context.speakerId && voice.isSpeaking)) {
        activeAnim = "talk";
      } else if (greeting) {
        activeAnim = "wave";
      } else if (c.def.departmentId === "conference-hall") {
        // Conference room collaborative meeting cycle:
        // Colleagues naturally alternate speaking and listening during discussions
        const phase = c.def.id === "ankita" ? 0 : c.def.id === "meeting-attendee-1" ? 8 : 16;
        const cycle = (time + phase) % 24;
        activeAnim = cycle < 6.5 ? "talk" : "sit";
      } else if (c.def.pose === "sit-type") {
        // Natural workstation rhythm: 13s focused typing, 5s reviewing monitor / resting
        const phase = c.def.id === "abhishek" ? 0 : 6;
        const typeCycle = (time + phase) % 18;
        activeAnim = typeCycle < 13 ? "type" : "sit";
      } else if (c.def.pose === "sit") {
        activeAnim = "sit";
      } else {
        activeAnim = "idle";
      }
      c.anim = activeAnim;
    }

    // visitor faces the person they are speaking with
    if (speaker && !this.visitor.moving) {
      const s = this.chars.get(speaker);
      if (s) this.visitor.yaw = turn(this.visitor.yaw, Math.atan2(s.nav.pos.x - this.visitor.pos.x, s.nav.pos.z - this.visitor.pos.z), dt * 6);
    }

    this.nearby = this.detectNearby(name);
  }

  private patrol(c: CharRuntime, dt: number, talking: boolean) {
    const pts = c.def.patrol as Vec2[];
    if (talking) return;
    // If visitor is directly obstructing the waypoint path, wait briefly then proceed
    const near = dist(this.visitor.pos, c.nav.pos) < 1.6;
    if (near && c.nav.moving) {
      // Step with gentle speed until clear
      c.nav.step(dt * 0.6, 1.0);
      return;
    }
    if (c.nav.moving) {
      c.nav.step(dt, 1.3);
      return;
    }
    c.patrolWait -= dt;
    if (c.patrolWait <= 0) {
      // walk back and forth along the listed points, so a long route never cuts a corner through a wall
      if (c.patrolIdx + c.patrolDir < 0 || c.patrolIdx + c.patrolDir >= pts.length) c.patrolDir = c.patrolDir === 1 ? -1 : 1;
      c.patrolIdx += c.patrolDir;
      c.nav.setPath([c.nav.pos, pts[c.patrolIdx] as Vec2]);
      c.patrolWait = 2.5;
    }
  }

  private freeMove(dt: number, input: Input) {
    const f = input.forward;
    const r = { x: -f.z, z: f.x };
    // input.z > 0 = forward, input.x > 0 = right (relative to the camera)
    let mx = f.x * input.z + r.x * input.x;
    let mz = f.z * input.z + r.z * input.x;
    const len = Math.hypot(mx, mz);
    this.visitor.moving = len > 0.01;
    if (len <= 0.01) return;
    mx /= len;
    mz /= len;
    this.visitor.yaw = turn(this.visitor.yaw, Math.atan2(mx, mz), dt * 10);
    const next = { x: this.visitor.pos.x + mx * FREE_SPEED * dt, z: this.visitor.pos.z + mz * FREE_SPEED * dt };
    const boxes = [...wallBoxes, ...propBoxes];
    if (this.doorOpen < 0.6 && !this.doorUnlocked) boxes.push(cabinDoorBox());
    if (this.gateOpen < 0.7) boxes.push(gateLeafBox);
    this.visitor.pos = resolveCollision(next, RADIUS, boxes);
  }

  private detectNearby(stateName: string): Nearby {
    if (stateName !== "freeExplore" && stateName !== "destinationChoice") return null;
    let best: CharRuntime | null = null;
    let bestD = 3.1;
    for (const c of this.chars.values()) {
      if (!c.def.conversationId) continue;
      const d = dist(this.visitor.pos, c.nav.pos);
      if (d < bestD) {
        bestD = d;
        best = c;
      }
    }
    if (!best && dist(this.visitor.pos, GATE.control) < 2.6) {
      return { kind: "gate", id: "gate:main", label: "the vehicle gate", verb: this.gateTarget === 1 ? "Close" : "Open" };
    }
    if (best) return { kind: "character", id: best.def.id, label: best.def.displayName, verb: "Talk to" };
    if (!this.doorUnlocked && dist(this.visitor.pos, { x: MANAGER_DOOR.x, z: MANAGER_DOOR.z + 1.2 }) < 2.3) {
      return { kind: "door", id: "door:manager", label: "the manager's door", verb: "Knock on" };
    }
    return null;
  }
}
