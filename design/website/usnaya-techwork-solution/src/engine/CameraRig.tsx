import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { centerOf, zoneById } from "../data/departments";
import { COMPOUND } from "../data/exterior";
import { destinationById, MANAGER_DOOR } from "../data/destinations";
import { useExperience } from "../store/experienceStore";
import { useSettings } from "../store/settingsStore";
import { useUi } from "../store/uiStore";
import { world } from "./worldRef";

type Shot = { target: THREE.Vector3; offset: THREE.Vector3 };
const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/** Chooses a camera shot from the Director state. Transitions are damped, never cut. */
function shotFor(): Shot {
  const { name, context } = useExperience.getState();
  const vis = world.sim.visitor.pos;
  const speaker = context.speakerId ? world.sim.chars.get(context.speakerId) : null;
  const isOutdoor = vis.z > 22;

  switch (name) {
    case "arrival":
    case "guidedTravel": {
      if (isOutdoor) {
        return { target: v(vis.x, 1.0, vis.z), offset: v(5.5, 5.8, 7.2) };
      }
      // Third-person human eye-level view inside the office
      return { target: v(vis.x, 1.15, vis.z), offset: v(3.2, 2.3, 3.8) };
    }
    case "freeExplore": {
      if (isOutdoor) {
        return { target: v(vis.x, 1.0, vis.z), offset: v(5.2, 5.2, 6.8) };
      }
      return { target: v(vis.x, 1.15, vis.z), offset: v(3.0, 2.2, 3.6) };
    }
    case "reception":
    case "dialogue":
    case "managerDialogue": {
      const sp = speaker?.nav.pos ?? vis;
      const far = Math.hypot(sp.x - vis.x, sp.z - vis.z) > 15;
      const s = far ? vis : sp;
      // Intimate, eye-level conversation shot
      return { target: v((vis.x + s.x) / 2, 1.25, (vis.z + s.z) / 2), offset: v(2.0, 1.2, 2.5) };
    }
    case "managerDoor":
      return { target: v(MANAGER_DOOR.x, 1.2, MANAGER_DOOR.z + 0.5), offset: v(3.2, 2.2, 3.8) };
    case "destinationArrival":
    case "destinationChoice": {
      const d = destinationById(context.destinationId ?? "");
      const z = d ? zoneById(d.zoneId) : undefined;
      const c = z ? centerOf(z.rect) : vis;
      if (isOutdoor) {
        const k = z ? Math.min(2.0, Math.max(1, Math.max(z.rect.x1 - z.rect.x0, z.rect.z1 - z.rect.z0) / 14)) : 1;
        return { target: v(c.x, 0.8, c.z), offset: v(6.5 * k, 7.5 * k, 8.5 * k) };
      }
      // Indoor room presentation: wide architectural room framing
      return { target: v(c.x, 1.0, c.z), offset: v(4.5, 3.4, 5.2) };
    }
    default:
      return { target: v(0, 1.0, 24), offset: v(0, 18, 26) };
  }
}

export function CameraRig() {
  const camera = useThree((s) => s.camera);
  const target = useRef(new THREE.Vector3(0, 0, 2));
  const first = useRef(true);
  useFrame((_, dt) => {
    if (useUi.getState().cameraMode === "orbit") {
      // orbit controls own the camera; keep forward direction fresh for movement keys
      const fx = world.camTarget.x - camera.position.x;
      const fz = world.camTarget.z - camera.position.z;
      const l = Math.hypot(fx, fz) || 1;
      world.camForward.x = fx / l;
      world.camForward.z = fz / l;
      return;
    }
    const shot = shotFor();
    // keep the look-at point inside the office so the camera never drifts outside it
    shot.target.x = THREE.MathUtils.clamp(shot.target.x, COMPOUND.x0, COMPOUND.x1);
    shot.target.z = THREE.MathUtils.clamp(shot.target.z, COMPOUND.z0, COMPOUND.z1 + 8);
    const desired = shot.target.clone().add(shot.offset);
    const k = useSettings.getState().reducedMotion ? 9 : 2.8;
    const a = first.current ? 1 : 1 - Math.exp(-k * Math.min(dt, 0.1));
    first.current = false;
    target.current.lerp(shot.target, a);
    camera.position.lerp(desired, a);
    camera.lookAt(target.current);
    world.camTarget.x = target.current.x;
    world.camTarget.y = target.current.y;
    world.camTarget.z = target.current.z;
    const fx = target.current.x - camera.position.x;
    const fz = target.current.z - camera.position.z;
    const l = Math.hypot(fx, fz) || 1;
    world.camForward.x = fx / l;
    world.camForward.z = fz / l;
  });
  return null;
}
