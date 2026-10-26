import { useMemo } from "react";
import * as THREE from "three";
import type { Vehicle } from "../data/exterior";

const G = {
  box: new THREE.BoxGeometry(1, 1, 1),
  wheel: new THREE.CylinderGeometry(0.34, 0.34, 0.24, 16),
  bikeWheel: new THREE.CylinderGeometry(0.3, 0.3, 0.12, 14),
};
const M = {
  glass: new THREE.MeshStandardMaterial({ color: "#1c2a33", roughness: 0.15, metalness: 0.4 }),
  tyre: new THREE.MeshStandardMaterial({ color: "#16181a", roughness: 0.9 }),
  light: new THREE.MeshStandardMaterial({ color: "#fff4d6", emissive: "#ffe9b0", emissiveIntensity: 0.6 }),
  tail: new THREE.MeshStandardMaterial({ color: "#8a1f1f", emissive: "#8a1f1f", emissiveIntensity: 0.4 }),
  metal: new THREE.MeshStandardMaterial({ color: "#8d9499", metalness: 0.8, roughness: 0.35 }),
  seat: new THREE.MeshStandardMaterial({ color: "#1b1b1d", roughness: 0.8 }),
};

const B = ({ s, p, m }: { s: [number, number, number]; p: [number, number, number]; m: THREE.Material }) => (
  <mesh geometry={G.box} scale={s} position={p} material={m} castShadow />
);

/** Local frame: nose points to +z, like characters. Ground is y = 0. */
function Car({ kind, body }: { kind: Vehicle["kind"]; body: THREE.Material }) {
  const suv = kind === "suv";
  const hatch = kind === "hatch";
  const len = suv ? 4.6 : 4.2;
  const wid = suv ? 1.95 : 1.8;
  const bodyH = suv ? 0.85 : 0.62;
  const cabinH = suv ? 0.75 : 0.55;
  const cabinLen = suv ? 3.0 : hatch ? 2.5 : 2.2;
  const cabinZ = suv ? -0.2 : hatch ? -0.35 : -0.3;
  const wheelZ = len / 2 - 0.85;
  return (
    <group>
      <B s={[wid, bodyH, len]} p={[0, 0.3 + bodyH / 2, 0]} m={body} />
      <B s={[wid - 0.15, cabinH, cabinLen]} p={[0, 0.3 + bodyH + cabinH / 2, cabinZ]} m={body} />
      {/* windows */}
      <B s={[wid - 0.05, cabinH - 0.14, cabinLen - 0.5]} p={[0, 0.3 + bodyH + cabinH / 2, cabinZ]} m={M.glass} />
      <B s={[wid - 0.3, cabinH - 0.14, cabinLen + 0.02]} p={[0, 0.3 + bodyH + cabinH / 2, cabinZ]} m={M.glass} />
      {/* lights */}
      <B s={[0.4, 0.14, 0.05]} p={[-0.6, 0.65, len / 2]} m={M.light} />
      <B s={[0.4, 0.14, 0.05]} p={[0.6, 0.65, len / 2]} m={M.light} />
      <B s={[0.4, 0.14, 0.05]} p={[-0.6, 0.7, -len / 2]} m={M.tail} />
      <B s={[0.4, 0.14, 0.05]} p={[0.6, 0.7, -len / 2]} m={M.tail} />
      {/* wheels */}
      {[-1, 1].flatMap((sx) =>
        [-wheelZ, wheelZ].map((z) => (
          <mesh key={`${sx}${z}`} geometry={G.wheel} material={M.tyre} position={[sx * (wid / 2 - 0.02), 0.34, z]} rotation={[0, 0, Math.PI / 2]} castShadow />
        )),
      )}
    </group>
  );
}

function TwoWheeler({ kind, body }: { kind: Vehicle["kind"]; body: THREE.Material }) {
  const scooter = kind === "scooter";
  return (
    <group>
      {[-0.7, 0.7].map((z) => (
        <mesh key={z} geometry={G.bikeWheel} material={M.tyre} position={[0, 0.3, z]} rotation={[0, 0, Math.PI / 2]} castShadow />
      ))}
      {scooter ? (
        <>
          <B s={[0.38, 0.1, 1.1]} p={[0, 0.32, 0.05]} m={body} />
          <B s={[0.34, 0.5, 0.5]} p={[0, 0.55, -0.45]} m={body} />
          <B s={[0.3, 0.1, 0.55]} p={[0, 0.8, -0.35]} m={M.seat} />
          <B s={[0.1, 0.8, 0.1]} p={[0, 0.7, 0.55]} m={M.metal} />
        </>
      ) : (
        <>
          <B s={[0.3, 0.32, 0.8]} p={[0, 0.62, 0.1]} m={body} />
          <B s={[0.28, 0.12, 0.7]} p={[0, 0.85, -0.25]} m={M.seat} />
          <B s={[0.1, 0.7, 0.1]} p={[0, 0.65, 0.65]} m={M.metal} />
        </>
      )}
      <B s={[0.7, 0.05, 0.05]} p={[0, 1.02, 0.6]} m={M.metal} />
      <B s={[0.16, 0.1, 0.05]} p={[0, 0.9, 0.72]} m={M.light} />
    </group>
  );
}

export function VehicleMesh({ v }: { v: Vehicle }) {
  const body = useMemo(() => new THREE.MeshStandardMaterial({ color: v.color, roughness: 0.35, metalness: 0.45 }), [v.color]);
  const bike = v.kind === "motorcycle" || v.kind === "scooter";
  return (
    <group position={[v.x, 0.02, v.z]} rotation={[0, v.yaw, 0]}>
      {bike ? <TwoWheeler kind={v.kind} body={body} /> : <Car kind={v.kind} body={body} />}
    </group>
  );
}
