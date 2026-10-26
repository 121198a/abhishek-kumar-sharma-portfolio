import { Html } from "../components/HtmlOverlay";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { allProps, centerOf, commonAreaProps, lightAreas, OFFICE_BOUNDS, zones } from "../data/departments";
import type { Rect } from "../data/types";
import { world } from "../engine/worldRef";
import { floorMaterial, ceilingMaterial, M, plasterMaterial } from "./materials";
import { palette } from "./palette";
import { propBox } from "./propBoxes";
import { PropMesh } from "./Props";
import { Baked, Box } from "./props/shared";
import { BrandPlane } from "./BrandPlane";
import { Exterior } from "./Exterior";
import { softShadow } from "./textures";
import { CABIN_DOOR, CEILING_H, doorways, northWindows, SOLID_H, T, walls, WINDOW_HEAD, WINDOW_SILL, type Doorway, type WallSegment } from "./walls";

const GLASS_TOP = 2.85;

const glassMat = new THREE.MeshPhysicalMaterial({
  color: palette.glass,
  transparent: true,
  opacity: 0.28,
  roughness: 0.04,
  metalness: 0.1,
  side: THREE.DoubleSide,
  depthWrite: false,
});
const baseboardMat = new THREE.MeshStandardMaterial({ color: palette.frameDark, roughness: 0.4 });
const frameMat = new THREE.MeshStandardMaterial({ color: palette.frameMullion, roughness: 0.35, metalness: 0.8 });
const lightTrackMat = new THREE.MeshStandardMaterial({ color: palette.frameDark, roughness: 0.3, metalness: 0.9 });
const lightGlowMat = new THREE.MeshStandardMaterial({ color: "#fff3db", emissive: "#ffdfa0", emissiveIntensity: 1.5 });
const downlightMat = new THREE.MeshBasicMaterial({ color: "#fff4dc" });

type Piece = { s: [number, number, number]; p: [number, number, number]; m: THREE.Material };

/** Solid wall with window openings. Collision stays closed (see walls.ts); only the picture has openings. */
function windowedWall({ minX, maxX, minZ, maxZ }: WallSegment): Piece[] {
  const sx = maxX - minX;
  const sz = maxZ - minZ;
  const cx = (minX + maxX) / 2;
  const cz = (minZ + maxZ) / 2;
  const openings = northWindows.filter((w) => w.center - w.width / 2 > minX && w.center + w.width / 2 < maxX).sort((a, b) => a.center - b.center);
  const out: Piece[] = [
    { s: [sx, WINDOW_SILL, sz], p: [cx, WINDOW_SILL / 2, cz], m: plasterMaterial },
    { s: [sx, CEILING_H - WINDOW_HEAD, sz], p: [cx, (CEILING_H + WINDOW_HEAD) / 2, cz], m: plasterMaterial },
  ];
  const h = WINDOW_HEAD - WINDOW_SILL;
  const mid = (WINDOW_HEAD + WINDOW_SILL) / 2;
  let edge = minX;
  for (const w of openings) {
    const x0 = w.center - w.width / 2;
    const x1 = w.center + w.width / 2;
    if (x0 > edge) out.push({ s: [x0 - edge, h, sz], p: [(edge + x0) / 2, mid, cz], m: plasterMaterial });
    edge = x1;
    // frame: head, sill, jambs, and a centre mullion on wide units
    out.push({ s: [w.width, 0.06, sz * 0.7], p: [w.center, WINDOW_HEAD - 0.03, cz], m: frameMat });
    out.push({ s: [w.width, 0.06, sz * 0.7], p: [w.center, WINDOW_SILL + 0.03, cz], m: frameMat });
    for (const side of [-1, 1]) out.push({ s: [0.06, h, sz * 0.7], p: [w.center + (side * (w.width - 0.06)) / 2, mid, cz], m: frameMat });
    if (w.width >= 2.2) out.push({ s: [0.04, h, sz * 0.5], p: [w.center, mid, cz], m: frameMat });
    // stone sill board projecting into the room (north wall: the room is on the +z side)
    out.push({ s: [w.width + 0.14, 0.04, 0.14], p: [w.center, WINDOW_SILL + 0.02, maxZ + 0.07], m: M.quartzWhite });
  }
  if (edge < maxX) out.push({ s: [maxX - edge, h, sz], p: [(edge + maxX) / 2, mid, cz], m: plasterMaterial });
  return out;
}

function Walls() {
  return (
    <group>
      {walls.map((w, i) => {
        const sx = w.maxX - w.minX;
        const sz = w.maxZ - w.minZ;
        const cx = (w.minX + w.maxX) / 2;
        const cz = (w.minZ + w.maxZ) / 2;
        const len = Math.max(sx, sz);
        const isX = sx >= sz;

        if (w.tall) {
          const isNorth = isX && w.maxZ < OFFICE_BOUNDS.z0 + 2 * T + 0.01;
          return (
            <group key={i}>
              {isNorth ? (
                windowedWall(w).map((p, k) => <Box key={k} {...p} />)
              ) : (
                <Box s={[sx, CEILING_H, sz]} p={[cx, CEILING_H / 2, cz]} m={plasterMaterial} />
              )}
              <Box s={[sx + 0.02, 0.1, sz + 0.02]} p={[cx, 0.05, cz]} m={baseboardMat} cast={false} />
            </group>
          );
        }
        if (w.glass) {
          return (
            <group key={i} position={[cx, 0, cz]}>
              <Box s={[sx, 0.08, sz]} p={[0, 0.04, 0]} m={frameMat} />
              <mesh position={[0, (0.08 + GLASS_TOP) / 2, 0]} material={glassMat}>
                <boxGeometry args={[Math.max(sx - 0.02, 0.02), GLASS_TOP - 0.08, Math.max(sz - 0.02, 0.02)]} />
              </mesh>
              <Box s={[sx, 0.06, sz]} p={[0, GLASS_TOP - 0.03, 0]} m={frameMat} />
              {/* plaster bulkhead closes the gap between the glass and the ceiling */}
              <Box s={[sx, CEILING_H - GLASS_TOP, sz]} p={[0, (CEILING_H + GLASS_TOP) / 2, 0]} m={plasterMaterial} />
              {len > 3 &&
                [-len / 4, len / 4].map((offset) => (
                  <Box key={offset} s={[isX ? 0.05 : sx + 0.01, GLASS_TOP, isX ? sz + 0.01 : 0.05]} p={isX ? [offset, GLASS_TOP / 2, 0] : [0, GLASS_TOP / 2, offset]} m={frameMat} />
                ))}
            </group>
          );
        }
        return (
          <group key={i}>
            <Box s={[sx, SOLID_H, sz]} p={[cx, SOLID_H / 2, cz]} m={plasterMaterial} />
            <Box s={[sx + 0.02, 0.1, sz + 0.02]} p={[cx, 0.05, cz]} m={baseboardMat} cast={false} />
          </group>
        );
      })}
    </group>
  );
}

/** Metal frame around each opening, with a plaster lintel up to the ceiling where the wall is glazed. */
function DoorFrames() {
  const one = (d: Doorway, i: number) => {
    const along = (u: number, v: number, y: number): [number, number, number] => (d.axis === "h" ? [d.center + u, y, d.at + v] : [d.at + v, y, d.center + u]);
    const size = (u: number, h: number, v: number): [number, number, number] => (d.axis === "h" ? [u, h, v] : [v, h, u]);
    const top = d.glass ? 2.4 : SOLID_H;
    const depth = 2 * T + 0.04;
    return (
      <group key={i}>
        {[-1, 1].map((side) => (
          <Box key={side} s={size(0.07, top, depth)} p={along(side * (d.width / 2 + 0.035), 0, top / 2)} m={frameMat} />
        ))}
        {d.glass && (
          <>
            <Box s={size(d.width + 0.14, 0.06, depth)} p={along(0, 0, top)} m={frameMat} />
            <Box s={size(d.width + 0.14, CEILING_H - top - 0.03, 2 * T)} p={along(0, 0, (CEILING_H + top + 0.03) / 2)} m={plasterMaterial} />
          </>
        )}
      </group>
    );
  };
  return <group>{doorways.map(one)}</group>;
}

/** Acoustic ceiling at 3.2 m. Faces down only, so it disappears when the camera is above it and the plan stays readable. */
function Ceiling() {
  const geometry = useMemo(() => {
    const make = (w: number, d: number) => {
      const g = new THREE.PlaneGeometry(w, d);
      const uv = g.attributes.uv as THREE.BufferAttribute;
      for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) * w) / 0.6, (uv.getY(i) * d) / 0.6);
      return g;
    };
    return { main: make(56, 32), lobby: make(12, 4) };
  }, []);
  return (
    <group>
      <mesh geometry={geometry.main} material={ceilingMaterial} position={[0, CEILING_H, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={geometry.lobby} material={ceilingMaterial} position={[2, CEILING_H, 18]} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  );
}

/** Recessed LED downlights laid out evenly in every room, the corridor and the landings. One draw call. */
function Downlights() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const spots = useMemo(() => {
    const out: [number, number][] = [];
    for (const r of lightAreas) {
      const nx = Math.max(1, Math.round((r.x1 - r.x0) / 3.4));
      const nz = Math.max(1, Math.round((r.z1 - r.z0) / 3.4));
      for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) out.push([r.x0 + ((r.x1 - r.x0) * (i + 0.5)) / nx, r.z0 + ((r.z1 - r.z0) * (j + 0.5)) / nz]);
    }
    return out;
  }, []);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    spots.forEach(([x, z], i) => mesh.setMatrixAt(i, m.makeTranslation(x, CEILING_H - 0.004, z)));
    mesh.instanceMatrix.needsUpdate = true;
  }, [spots]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, spots.length]} material={downlightMat} frustumCulled={false}>
      <circleGeometry args={[0.1, 20]} onUpdate={(g) => g.rotateX(Math.PI / 2)} />
    </instancedMesh>
  );
}

/** Suspended linear LED tracks over the main work areas. */
function LinearLights() {
  const tracks = [
    { x: -21, z: -12.5, len: 10, isX: true },
    { x: -9, z: -10, len: 7, isX: false },
    { x: 2, z: -10, len: 8, isX: true },
    { x: 14, z: -9.5, len: 7, isX: true },
    { x: 3, z: 10, len: 5, isX: true },
    { x: 0, z: 0, len: 38, isX: true },
  ];
  return (
    <group position={[0, CEILING_H - 0.12, 0]}>
      {tracks.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]}>
          <mesh material={lightTrackMat}>
            <boxGeometry args={[t.isX ? t.len : 0.08, 0.08, t.isX ? 0.08 : t.len]} />
          </mesh>
          <mesh position={[0, -0.042, 0]} material={lightGlowMat}>
            <boxGeometry args={[t.isX ? t.len - 0.04 : 0.06, 0.015, t.isX ? 0.06 : t.len - 0.04]} />
          </mesh>
          {[-1, 1].map((side) => (
            <mesh key={side} position={[t.isX ? (side * t.len) / 3 : 0, 0.06, t.isX ? 0 : (side * t.len) / 3]} material={frameMat}>
              <cylinderGeometry args={[0.006, 0.006, 0.12, 6]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function CabinDoor() {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    // hinge on the left edge; swings inward (towards -z) as it opens
    ref.current.rotation.y = world.sim.doorOpen * (Math.PI / 2.1);
  });
  return (
    <group position={[CABIN_DOOR.x - CABIN_DOOR.width / 2, 0, CABIN_DOOR.z]}>
      <group ref={ref}>
        <mesh position={[CABIN_DOOR.width / 2, 1.15, 0]} material={M.woodOak} castShadow>
          <boxGeometry args={[CABIN_DOOR.width - 0.06, 2.3, 0.08]} />
        </mesh>
        <mesh position={[CABIN_DOOR.width * 0.32, 1.3, 0]} material={glassMat}>
          <boxGeometry args={[0.22, 1.4, 0.082]} />
        </mesh>
        <mesh position={[CABIN_DOOR.width - 0.22, 1.1, 0.07]} material={M.brass}>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 12]} />
        </mesh>
      </group>
    </group>
  );
}

/** Soft contact shadows under furniture and chairs, drawn as one instanced layer. */
function ContactShadows() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const items = useMemo(
    () =>
      allProps.flatMap((p) => {
        const b = propBox(p);
        if (b) return [{ x: (b.minX + b.maxX) / 2, z: (b.minZ + b.maxZ) / 2, w: b.maxX - b.minX + 0.45, d: b.maxZ - b.minZ + 0.45 }];
        if (p.kind === "chair") return [{ x: p.x, z: p.z, w: 0.95, d: 0.95 }];
        if (p.kind === "lamp") return [{ x: p.x, z: p.z, w: 0.7, d: 0.7 }];
        return [];
      }),
    [],
  );
  const material = useMemo(() => new THREE.MeshBasicMaterial({ map: softShadow(), transparent: true, depthWrite: false, opacity: 0.8 }), []);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    items.forEach((it, i) => mesh.setMatrixAt(i, m.compose(new THREE.Vector3(it.x, 0.032, it.z), new THREE.Quaternion(), new THREE.Vector3(it.w, it.d, 1))));
    mesh.instanceMatrix.needsUpdate = true;
  }, [items]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, items.length]} material={material} frustumCulled={false} renderOrder={1}>
      <planeGeometry args={[1, 1]} onUpdate={(g) => g.rotateX(-Math.PI / 2)} />
    </instancedMesh>
  );
}

/** Floor patch whose texture repeats by real-world size, not by the size of the patch. */
function Floor({ rect, finish, tint, y }: { rect: Rect; finish: Parameters<typeof floorMaterial>[0]; tint: string; y: number }) {
  const material = useMemo(() => floorMaterial(finish, tint), [finish, tint]);
  const tile = (material.userData as { tile?: number }).tile ?? 1;
  const w = rect.x1 - rect.x0;
  const d = rect.z1 - rect.z0;
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(w, d);
    const uv = g.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) * w) / tile, (uv.getY(i) * d) / tile);
    return g;
  }, [w, d, tile]);
  const c = centerOf(rect);
  return <mesh geometry={geometry} material={material} rotation={[-Math.PI / 2, 0, 0]} position={[c.x, y, c.z]} receiveShadow />;
}

function ZoneLabel({ x, z, text, strong = false }: { x: number; z: number; text: string; strong?: boolean }) {
  return (
    <Html position={[x, 2.6, z]} center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
      <div className={strong ? "zone-label zone-label--strong" : "zone-label"}>{text}</div>
    </Html>
  );
}

export function OfficeWorld() {
  const B = OFFICE_BOUNDS;
  const corridor: Rect = { x0: B.x0, x1: B.x1, z0: B.z0, z1: 16 };
  return (
    <group>
      {/* surrounding landscape ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 2]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color="#4a6e42" roughness={0.95} />
      </mesh>

      {/* honed terrazzo through the circulation space, textured finishes per room on top */}
      <Floor rect={corridor} finish="stone" tint="#e3dccf" y={0} />
      {zones.map((z) => (
        <Floor key={z.id} rect={z.rect} finish={z.finish ?? "carpet"} tint={z.floor} y={0.012} />
      ))}

      <Baked>
        <Walls />
        <DoorFrames />
      </Baked>
      <CabinDoor />
      <Ceiling />
      <Downlights />
      <LinearLights />
      <Exterior />
      {zones.map((z) => (
        <Baked key={z.id}>
          {z.props.map((p, i) => (
            <PropMesh key={i} prop={p} />
          ))}
        </Baked>
      ))}
      <Baked>
        {commonAreaProps.map((p, i) => (
          <PropMesh key={i} prop={p} />
        ))}
      </Baked>
      <ContactShadows />
      {/* company sign on the reception feature wall */}
      <BrandPlane position={[3, 1.85, 6.07]} size={[3.6, 0.675]} />
      {zones.map((z) => {
        const c = centerOf(z.rect);
        return <ZoneLabel key={z.id} x={c.x} z={c.z} text={z.name} strong={z.id === "reception"} />;
      })}
      <ZoneLabel x={0} z={-0.2} text="Central corridor" />
    </group>
  );
}
