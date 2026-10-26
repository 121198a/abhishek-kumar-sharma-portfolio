import { Html } from "../components/HtmlOverlay";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { world } from "../engine/worldRef";
import {
  ASPHALT,
  bays,
  bushes,
  COMPOUND,
  GATE,
  lamps,
  paths,
  roads,
  signs,
  trees,
  vehicles,
  type Bay,
} from "../data/exterior";
import { BrandPlane } from "./BrandPlane";
import { palette } from "./palette";
import { compoundWalls, pillars } from "./walls";
import { VehicleMesh } from "./Vehicles";

const mat = (color: string, rough = 0.8, metal = 0) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
const M = {
  lawn: mat("#6a8f55", 1),
  wall: mat("#e6dfd0", 0.85),
  cap: mat("#5a4636", 0.6),
  stone: mat("#cfc6b4", 0.7),
  charcoal: mat("#2b2f33", 0.5, 0.6),
  brass: mat(palette.brass, 0.35, 0.8),
  paint: mat("#f1f0ea", 0.9),
  blue: mat("#2b6cb0", 0.8),
  trunk: mat("#5b4330", 0.9),
  leafA: mat("#4f7d4a", 0.9),
  leafB: mat("#3f6b45", 0.9),
  bush: mat("#46784a", 0.95),
  lampGlow: new THREE.MeshStandardMaterial({ color: "#fff1c9", emissive: "#ffd98a", emissiveIntensity: 1.3 }),
  glass: new THREE.MeshPhysicalMaterial({ color: "#9cc2c6", transparent: true, opacity: 0.35, roughness: 0.08, depthWrite: false }),
  asphalt: mat(ASPHALT, 0.95),
  bayAsphalt: mat("#565b5e", 0.9),
  street: mat("#3d4144", 0.95),
  curb: mat("#b8b1a3", 0.8),
  metal: mat("#6c747a", 0.4, 0.7),
  planter: mat("#7a6a58", 0.8),
};
const boxG = new THREE.BoxGeometry(1, 1, 1);

const Slab = ({ x0, x1, z0, z1, y = 0.02, h = 0.04, m }: { x0: number; x1: number; z0: number; z1: number; y?: number; h?: number; m: THREE.Material }) => (
  <mesh geometry={boxG} material={m} scale={[x1 - x0, h, z1 - z0]} position={[(x0 + x1) / 2, y, (z0 + z1) / 2]} receiveShadow />
);

/** Many thin boxes drawn in one call: parking lines, zebra stripes. */
function Strips({ items, material }: { items: { x: number; z: number; w: number; d: number }[]; material: THREE.Material }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new THREE.Object3D();
    items.forEach((it, i) => {
      o.position.set(it.x, 0.045, it.z);
      o.scale.set(it.w, 0.01, it.d);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [items]);
  return <instancedMesh ref={ref} args={[boxG, material, items.length]} receiveShadow />;
}

function bayLines(list: Bay[]) {
  const out: { x: number; z: number; w: number; d: number }[] = [];
  const seen = new Set<string>();
  for (const b of list) {
    for (const edge of [b.x - b.w / 2, b.x + b.w / 2]) {
      const k = `${edge.toFixed(2)}|${b.z}`;
      if (seen.has(k)) continue;
      seen.add(k);
      out.push({ x: edge, z: b.z, w: 0.08, d: b.d });
    }
  }
  return out;
}

function zebra(cx: number, cz: number, along: "x" | "z", length: number) {
  const out: { x: number; z: number; w: number; d: number }[] = [];
  for (let t = -length / 2 + 0.3; t < length / 2; t += 0.7) {
    out.push(along === "x" ? { x: cx + t, z: cz, w: 0.4, d: 2.2 } : { x: cx, z: cz + t, w: 2.2, d: 0.4 });
  }
  return out;
}

function Gate() {
  const leaf = useRef<THREE.Group>(null);
  const gv = GATE.vehicle;
  useFrame(() => {
    if (leaf.current) leaf.current.position.x = -world.sim.gateOpen * (gv.width + 0.4);
  });
  const slats = useMemo(() => Array.from({ length: 13 }, (_, i) => -gv.width / 2 + 0.3 + i * ((gv.width - 0.6) / 12)), [gv.width]);
  return (
    <group position={[gv.cx, 0, GATE.z + 0.55]}>
      {/* sliding leaf, runs on a rail along the inside of the wall */}
      <group ref={leaf}>
        <mesh geometry={boxG} material={M.charcoal} scale={[gv.width, 0.14, 0.1]} position={[0, 0.5, 0]} castShadow />
        <mesh geometry={boxG} material={M.charcoal} scale={[gv.width, 0.14, 0.1]} position={[0, 2.1, 0]} castShadow />
        {slats.map((x) => (
          <mesh key={x} geometry={boxG} material={M.charcoal} scale={[0.06, 1.7, 0.06]} position={[x, 1.3, 0]} castShadow />
        ))}
        <mesh geometry={boxG} material={M.brass} scale={[gv.width, 0.05, 0.12]} position={[0, 2.2, 0]} />
        {/* wheels on the rail */}
        {[-gv.width / 2 + 0.6, gv.width / 2 - 0.6].map((x) => (
          <mesh key={x} position={[x, 0.15, 0]} rotation={[0, 0, Math.PI / 2]} material={M.metal}>
            <cylinderGeometry args={[0.12, 0.12, 0.08, 12]} />
          </mesh>
        ))}
      </group>
      {/* rail */}
      <mesh geometry={boxG} material={M.metal} scale={[gv.width * 2 + 1, 0.06, 0.1]} position={[-gv.width / 2, 0.06, 0]} />
    </group>
  );
}

function PedestrianGate() {
  const gp = GATE.pedestrian;
  // swing leaf, left open at 100 degrees, hinged on the left pillar
  return (
    <group position={[gp.cx - gp.width / 2, 0, GATE.z + 0.2]} rotation={[0, -1.75, 0]}>
      <mesh geometry={boxG} material={M.charcoal} scale={[gp.width - 0.2, 1.7, 0.06]} position={[(gp.width - 0.2) / 2, 0.95, 0]} castShadow />
    </group>
  );
}

function Pillar({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh geometry={boxG} material={M.stone} scale={[0.7, 3.0, 0.7]} position={[0, 1.5, 0]} castShadow />
      <mesh geometry={boxG} material={M.cap} scale={[0.85, 0.12, 0.85]} position={[0, 3.06, 0]} />
      <mesh geometry={boxG} material={M.lampGlow} scale={[0.34, 0.34, 0.34]} position={[0, 3.3, 0]} />
      <mesh geometry={boxG} material={M.brass} scale={[0.72, 0.05, 0.72]} position={[0, 2.6, 0]} />
    </group>
  );
}

function GuardCabin() {
  const c = GATE.cabin;
  return (
    <group position={[c.x, 0, c.z]}>
      <mesh geometry={boxG} material={M.wall} scale={[c.w, 2.5, c.d]} position={[0, 1.25, 0]} castShadow receiveShadow />
      <mesh geometry={boxG} material={M.glass} scale={[c.w + 0.02, 1.0, c.d * 0.6]} position={[0, 1.55, c.d * 0.2]} />
      <mesh geometry={boxG} material={M.glass} scale={[c.w * 0.6, 1.0, c.d + 0.02]} position={[c.w * 0.2, 1.55, 0]} />
      <mesh geometry={boxG} material={M.cap} scale={[c.w + 0.7, 0.14, c.d + 0.7]} position={[0, 2.6, 0]} castShadow />
      <mesh geometry={boxG} material={M.lampGlow} scale={[0.5, 0.06, 0.2]} position={[0, 2.5, c.d / 2 + 0.2]} />
      <Html position={[0, 3.2, 0]} center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
        <div className="zone-label">Security checkpoint</div>
      </Html>
    </group>
  );
}

function Wall({ w }: { w: { minX: number; maxX: number; minZ: number; maxZ: number } }) {
  const sx = w.maxX - w.minX;
  const sz = w.maxZ - w.minZ;
  return (
    <group position={[(w.minX + w.maxX) / 2, 0, (w.minZ + w.maxZ) / 2]}>
      <mesh geometry={boxG} material={M.wall} scale={[sx, 2.2, sz]} position={[0, 1.1, 0]} castShadow receiveShadow />
      <mesh geometry={boxG} material={M.cap} scale={[sx + 0.06, 0.12, sz + 0.18]} position={[0, 2.26, 0]} />
    </group>
  );
}

function Tree({ t, i }: { t: { x: number; z: number; r: number; h: number }; i: number }) {
  return (
    <group position={[t.x, 0, t.z]}>
      <mesh material={M.trunk} position={[0, t.h * 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.24, t.h * 0.6, 8]} />
      </mesh>
      <mesh material={i % 2 ? M.leafA : M.leafB} position={[0, t.h * 0.72, 0]} castShadow>
        <icosahedronGeometry args={[t.r, 1]} />
      </mesh>
      <mesh material={i % 2 ? M.leafB : M.leafA} position={[t.r * 0.35, t.h * 0.95, t.r * 0.2]} castShadow>
        <icosahedronGeometry args={[t.r * 0.7, 1]} />
      </mesh>
    </group>
  );
}

function LampPost({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh material={M.charcoal} position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.06, 0.09, 4.4, 8]} />
      </mesh>
      <mesh geometry={boxG} material={M.charcoal} scale={[0.5, 0.06, 0.2]} position={[0.2, 4.4, 0]} />
      <mesh geometry={boxG} material={M.lampGlow} scale={[0.4, 0.05, 0.16]} position={[0.2, 4.34, 0]} />
    </group>
  );
}

/**
 * Sign labels use cached canvas textures rather than Drei Text/Troika.
 * Repeated labels share one texture.
 */
const signTextureCache = new Map<string, THREE.CanvasTexture>();

function getSignTexture(text: string): THREE.CanvasTexture {
  const cached = signTextureCache.get(text);
  if (cached) return cached;

  if (typeof document === "undefined") {
    const t = new THREE.CanvasTexture(null as unknown as HTMLCanvasElement);
    signTextureCache.set(text, t);
    return t;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 150;

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "600 36px 'Instrument Sans', 'Segoe UI', system-ui, sans-serif";
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2, canvas.width - 24);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  signTextureCache.set(text, texture);
  return texture;
}

function SignPost({ s }: { s: (typeof signs)[number] }) {
  const accessible = s.id === "sign-acc";
  const signTexture = useMemo(() => getSignTexture(s.text), [s.text]);

  return (
    <group position={[s.x, 0, s.z]}>
      <mesh material={M.metal} position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.8, 6]} />
      </mesh>
      <mesh
        geometry={boxG}
        material={accessible ? M.blue : M.charcoal}
        scale={[1.7, 0.5, 0.06]}
        position={[0, 1.8, 0]}
        castShadow
      />
      <mesh position={[0, 1.8, 0.032]}>
        <planeGeometry args={[1.6, 0.46]} />
        <meshBasicMaterial
          map={signTexture}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Hvac({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh geometry={boxG} material={M.metal} scale={[1.2, 0.9, 0.9]} position={[0, 0.45, 0]} castShadow />
      <mesh position={[0, 0.91, 0]} material={M.charcoal} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.04, 16]} />
      </mesh>
    </group>
  );
}

/** Entrance portal: canopy, columns, planters, lit company sign. */
function EntrancePortal() {
  return (
    <group>
      <mesh geometry={boxG} material={M.wall} scale={[9, 0.28, 6]} position={[2, 3.4, 23.2]} castShadow />
      <mesh geometry={boxG} material={M.cap} scale={[9.1, 0.1, 6.1]} position={[2, 3.58, 23.2]} />
      {[-1.9, 5.9].map((x) => (
        <mesh key={x} geometry={boxG} material={M.stone} scale={[0.5, 3.3, 0.5]} position={[x, 1.65, 25.6]} castShadow />
      ))}
      {[-1.9, 5.9].map((x) => (
        <mesh key={`b${x}`} geometry={boxG} material={M.planter} scale={[1.1, 0.5, 1.1]} position={[x < 0 ? x - 1 : x + 1, 0.25, 25.4]} castShadow />
      ))}
      {[-2.9, 6.9].map((x) => (
        <mesh key={`p${x}`} material={M.bush} position={[x, 0.85, 25.4]} castShadow>
          <icosahedronGeometry args={[0.5, 1]} />
        </mesh>
      ))}
      <BrandPlane position={[2, 3.0, 26.25]} size={[5, 0.94]} />
      {[0.4, 2.0, 3.6].map((x) => (
        <mesh key={x} geometry={boxG} material={M.lampGlow} scale={[0.2, 0.04, 0.2]} position={[x, 3.24, 24.4]} />
      ))}
    </group>
  );
}

function Pilasters() {
  const xs = [-27, -21, -15, -9, 10, 16, 22, 27];
  return (
    <group>
      {xs.map((x) => (
        <mesh key={x} geometry={boxG} material={M.wall} scale={[0.5, 3.1, 0.5]} position={[x, 1.55, 16.15]} castShadow />
      ))}
      {[-4.15, 8.15].map((x) => (
        <mesh key={x} geometry={boxG} material={M.wall} scale={[0.5, 3.1, 0.5]} position={[x, 1.55, 20.1]} castShadow />
      ))}
    </group>
  );
}

export function Exterior() {
  const lines = useMemo(() => bayLines(bays), []);
  const stripes = useMemo(
    () => [...zebra(-6, 47, "x", 7), ...zebra(6, 47, "z", 2.4).map((s) => ({ ...s, x: 6 })), ...zebra(6, 31, "z", 2.4)],
    [],
  );
  const accessibleFill = bays.filter((b) => b.type === "accessible");
  const gv = GATE.vehicle;
  const gp = GATE.pedestrian;
  return (
    <group>
      {/* lawn and street */}
      <Slab x0={COMPOUND.x0} x1={COMPOUND.x1} z0={COMPOUND.z0} z1={COMPOUND.z1} y={-0.015} h={0.03} m={M.lawn} />
      <Slab x0={-90} x1={90} z0={75} z1={92} y={0.0} h={0.04} m={M.street} />
      <Slab x0={-90} x1={90} z0={72.4} z1={75} y={0.01} h={0.05} m={M.curb} />
      {/* driveways, aisles, bays */}
      {roads.map((r) => (
        <Slab key={r.id} {...r.rect} m={r.color === ASPHALT ? M.asphalt : M.bayAsphalt} />
      ))}
      {paths.map((p) => (
        <Slab key={p.id} {...p.rect} y={0.035} m={M.stone} />
      ))}
      <Strips items={lines} material={M.paint} />
      <Strips items={stripes} material={M.paint} />
      {accessibleFill.map((b) => (
        <Slab key={b.id} x0={b.x - 0.9} x1={b.x + 0.9} z0={b.z - 1} z1={b.z + 1} y={0.05} h={0.01} m={M.blue} />
      ))}
      {/* drop-off lane marking */}
      <Strips items={[{ x: -14, z: 31, w: 14, d: 0.12 }]} material={M.paint} />

      {/* boundary, gate, pillars, cabin */}
      {compoundWalls.map((w, i) => (
        <Wall key={i} w={w} />
      ))}
      {pillars.map((p, i) => (
        <Pillar key={i} x={(p.minX + p.maxX) / 2} z={(p.minZ + p.maxZ) / 2} />
      ))}
      <Gate />
      <PedestrianGate />
      <GuardCabin />
      <BrandPlane position={[(gv.cx + gv.width / 2 + gp.cx - gp.width / 2) / 2 + 0.2, 1.4, GATE.z + 0.3]} size={[4.4, 0.82]} />

      {/* building exterior */}
      <EntrancePortal />
      <Pilasters />
      <Hvac x={29.4} z={-6} />
      <Hvac x={29.4} z={-3.6} />
      <Hvac x={-29.4} z={-10} />

      {/* vehicles */}
      {vehicles.map((v) => (
        <VehicleMesh key={v.id} v={v} />
      ))}

      {/* landscaping */}
      {trees.map((t, i) => (
        <Tree key={i} t={t} i={i} />
      ))}
      {bushes.map((b, i) => (
        <mesh key={i} material={M.bush} position={[b.x, b.r * 0.7, b.z]} scale={[1, 0.8, 1]} castShadow>
          <icosahedronGeometry args={[b.r, 1]} />
        </mesh>
      ))}

      {/* lighting posts and signage */}
      {lamps.map((l, i) => (
        <LampPost key={i} x={l.x} z={l.z} />
      ))}
      {signs.map((s) => (
        <SignPost key={s.id} s={s} />
      ))}
    </group>
  );
}
