import { useLayoutEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { M } from "../materials";

export type V3 = [number, number, number];

const boxCache = new Map<string, THREE.BoxGeometry>();

/** Box whose UVs are scaled so a texture repeats every `tile` metres, instead of stretching over the whole face. */
function boxGeometry(s: V3, tile?: number): THREE.BoxGeometry {
  const key = `${s.join(",")}|${tile ?? 0}`;
  const hit = boxCache.get(key);
  if (hit) return hit;
  const g = new THREE.BoxGeometry(s[0], s[1], s[2]);
  if (tile) {
    const [w, h, d] = s;
    // BoxGeometry face order: +x, -x, +y, -y, +z, -z, four vertices each
    const dims: [number, number][] = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
    const uv = g.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) {
      const [du, dv] = dims[Math.floor(i / 4)] ?? [1, 1];
      uv.setXY(i, (uv.getX(i) * du) / tile, (uv.getY(i) * dv) / tile);
    }
    uv.needsUpdate = true;
  }
  boxCache.set(key, g);
  return g;
}

type BoxProps = { s: V3; p: V3; m: THREE.Material; r?: V3; cast?: boolean };

export function Box({ s, p, m, r, cast = true }: BoxProps) {
  const tile = (m.userData as { tile?: number }).tile;
  return <mesh position={p} rotation={r} material={m} geometry={boxGeometry(s, tile)} castShadow={cast} receiveShadow />;
}

type CylProps = { r: number | [number, number]; h: number; p: V3; m: THREE.Material; rot?: V3; seg?: number; cast?: boolean };

export function Cyl({ r, h, p, m, rot, seg = 16, cast = true }: CylProps) {
  const [top, bottom] = typeof r === "number" ? [r, r] : r;
  return (
    <mesh position={p} rotation={rot} material={m} castShadow={cast} receiveShadow>
      <cylinderGeometry args={[top, bottom, h, seg]} />
    </mesh>
  );
}

/** Flattened ellipsoid used for leaves and cushions' soft shapes. */
export function Blob({ s, p, m, rot }: { s: V3; p: V3; m: THREE.Material; rot?: V3 }) {
  return (
    <mesh position={p} rotation={rot} scale={s} material={m} castShadow>
      <sphereGeometry args={[1, 10, 7]} />
    </mesh>
  );
}

/** A monitor facing local +z. `p` is the screen centre; `surface` is the height of whatever it stands on. */
export function Monitor({ p, w = 0.6, h = 0.36, screen, ry = 0, surface = 0.76 }: { p: V3; w?: number; h?: number; screen: THREE.Material; ry?: number; surface?: number }) {
  const rise = p[1] - surface;
  const neck = rise - h / 2 + 0.02;
  return (
    <group position={p} rotation={[0, ry, 0]}>
      <Box s={[w, h, 0.022]} p={[0, 0, 0]} m={M.metalCharcoal} />
      <Box s={[w - 0.026, h - 0.026, 0.004]} p={[0, 0, 0.012]} m={screen} cast={false} />
      <Box s={[0.05, neck, 0.02]} p={[0, -rise + neck / 2 + 0.012, -0.03]} m={M.metalBrushed} />
      <Box s={[0.24, 0.012, 0.17]} p={[0, -rise + 0.006, 0.0]} m={M.metalBrushed} />
    </group>
  );
}

export function Keyboard({ p, ry = 0 }: { p: V3; ry?: number }) {
  return (
    <group position={p} rotation={[0, ry, 0]}>
      <Box s={[0.42, 0.014, 0.14]} p={[0, 0.007, 0]} m={M.metalCharcoal} cast={false} />
      <Box s={[0.39, 0.004, 0.11]} p={[0, 0.016, 0]} m={M.felt} cast={false} />
    </group>
  );
}

export function Mouse({ p }: { p: V3 }) {
  return <Box s={[0.06, 0.025, 0.1]} p={[p[0], p[1] + 0.012, p[2]]} m={M.metalCharcoal} cast={false} />;
}

export function Mug({ p, m = M.ceramic }: { p: V3; m?: THREE.Material }) {
  return <Cyl r={[0.04, 0.036]} h={0.09} p={[p[0], p[1] + 0.045, p[2]]} m={m} seg={12} />;
}

/** A flat book or folder stack. */
export function Stack({ p, w = 0.24, d = 0.18, n = 3 }: { p: V3; w?: number; d?: number; n?: number }) {
  const mats = [M.fabricCharcoal, M.fabricSand, M.leatherWarm, M.paperWhite];
  return (
    <group position={p}>
      {Array.from({ length: n }, (_, i) => (
        <Box key={i} s={[w - i * 0.015, 0.03, d - (i % 2) * 0.02]} p={[(i % 2) * 0.01, 0.015 + i * 0.03, 0]} m={mats[i % mats.length] as THREE.Material} cast={false} />
      ))}
    </group>
  );
}

/**
 * Static scenery is built from many small meshes. After mount this merges every opaque mesh in the subtree that
 * shares a material into one mesh, which cuts draw calls from thousands to a few dozen without changing how
 * anything looks. The originals are kept aside and put back on cleanup, so React StrictMode and hot reload are safe.
 */
export function Baked({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.updateWorldMatrix(true, true);
    const inverse = new THREE.Matrix4().copy(root.matrixWorld).invert();
    const buckets = new Map<string, { material: THREE.Material; cast: boolean; geometries: THREE.BufferGeometry[] }>();
    const originals: THREE.Mesh[] = [];
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh || Array.isArray(mesh.material)) return;
      const mat = mesh.material;
      if (mat.transparent) return; // glass and bottles keep their own sorting
      const geometry = mesh.geometry.clone();
      geometry.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse, mesh.matrixWorld));
      const key = `${mat.uuid}|${mesh.castShadow}`;
      const bucket = buckets.get(key) ?? { material: mat, cast: mesh.castShadow, geometries: [] };
      bucket.geometries.push(geometry);
      buckets.set(key, bucket);
      originals.push(mesh);
    });
    const parents = originals.map((m) => m.parent);
    originals.forEach((m) => m.removeFromParent());
    const merged: THREE.Mesh[] = [];
    for (const b of buckets.values()) {
      const geometry = mergeGeometries(b.geometries, false);
      b.geometries.forEach((g) => g.dispose());
      if (!geometry) continue;
      const mesh = new THREE.Mesh(geometry, b.material);
      mesh.castShadow = b.cast;
      mesh.receiveShadow = true;
      mesh.matrixAutoUpdate = false;
      root.add(mesh);
      merged.push(mesh);
    }
    return () => {
      merged.forEach((m) => {
        m.removeFromParent();
        m.geometry.dispose();
      });
      originals.forEach((m, i) => parents[i]?.add(m));
    };
  }, []);
  return <group ref={ref}>{children}</group>;
}
