import type * as THREE from "three";
import type { PropVariant } from "../../data/types";
import { M } from "../materials";
import { Blob, Box, Cyl, Stack } from "./shared";

const upholstery = (v?: PropVariant): THREE.Material => {
  switch (v) {
    case "charcoal":
      return M.fabricCharcoal;
    case "leather":
      return M.leatherWarm;
    case "sand":
      return M.fabricSand;
    default:
      return M.fabricTaupe;
  }
};

/** Lounge sofa: split seat and back cushions on a slim frame with a throw cushion. `seats` = cushion count. */
export function Sofa({ w = 2.4, d = 1, variant }: { w?: number; d?: number; variant?: PropVariant }) {
  const f = upholstery(variant);
  const seats = Math.max(1, Math.round((w - 0.4) / 0.75));
  const cw = (w - 0.34) / seats;
  return (
    <group>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz]) => (
        <Cyl key={`${sx}${sz}`} r={[0.025, 0.018]} h={0.16} p={[(sx as number) * (w / 2 - 0.14), 0.08, (sz as number) * (d / 2 - 0.12)]} m={M.metalCharcoal} seg={8} />
      ))}
      <Box s={[w, 0.14, d]} p={[0, 0.23, 0]} m={f} />
      {Array.from({ length: seats }, (_, i) => {
        const x = -w / 2 + 0.17 + cw * (i + 0.5);
        return (
          <group key={i}>
            <Box s={[cw - 0.02, 0.15, d - 0.3]} p={[x, 0.37, 0.1]} m={f} />
            <Box s={[cw - 0.02, 0.36, 0.16]} p={[x, 0.62, -d / 2 + 0.22]} m={f} r={[-0.1, 0, 0]} />
          </group>
        );
      })}
      <Box s={[w, 0.5, 0.14]} p={[0, 0.5, -d / 2 + 0.07]} m={f} />
      <Box s={[0.17, 0.42, d]} p={[-w / 2 + 0.085, 0.46, 0]} m={f} />
      <Box s={[0.17, 0.42, d]} p={[w / 2 - 0.085, 0.46, 0]} m={f} />
      {w > 1.6 && <Box s={[0.38, 0.34, 0.1]} p={[w / 2 - 0.5, 0.58, -d / 2 + 0.34]} m={M.fabricMoss} r={[-0.25, 0.2, 0.1]} />}
    </group>
  );
}

export function Armchair({ variant }: { variant?: PropVariant }) {
  return <Sofa w={0.95} d={0.95} variant={variant} />;
}

export function Bench({ w = 1.8, d = 0.45 }: { w?: number; d?: number }) {
  return (
    <group>
      <Box s={[w, 0.045, d]} p={[0, 0.44, 0]} m={M.woodOak} />
      <Box s={[w - 0.1, 0.07, d - 0.08]} p={[0, 0.5, 0]} m={M.fabricCharcoal} />
      {[-1, 1].map((s) => (
        <group key={s} position={[s * (w / 2 - 0.12), 0.21, 0]}>
          <Box s={[0.04, 0.42, d - 0.06]} p={[0, 0, 0]} m={M.metalCharcoal} />
        </group>
      ))}
    </group>
  );
}

export function CoffeeTable({ w = 1.2, d = 0.6 }: { w?: number; d?: number }) {
  return (
    <group>
      <Box s={[w, 0.04, d]} p={[0, 0.42, 0]} m={M.woodLight} />
      <Box s={[w - 0.2, 0.03, d - 0.2]} p={[0, 0.2, 0]} m={M.metalCharcoal} />
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz]) => (
        <Box key={`${sx}${sz}`} s={[0.035, 0.4, 0.035]} p={[(sx as number) * (w / 2 - 0.08), 0.2, (sz as number) * (d / 2 - 0.08)]} m={M.metalCharcoal} />
      ))}
      <Stack p={[-w / 4, 0.44, 0]} w={0.28} d={0.2} n={3} />
      <Cyl r={0.07} h={0.025} p={[w / 4, 0.4575 + 0.0125, 0.05]} m={M.ceramic} seg={16} />
      <Cyl r={[0.04, 0.05]} h={0.16} p={[w / 4, 0.52, -0.08]} m={M.ceramic} seg={12} />
    </group>
  );
}

export function SideTable() {
  return (
    <group>
      <Cyl r={0.25} h={0.03} p={[0, 0.5, 0]} m={M.woodWalnut} seg={24} />
      <Cyl r={0.025} h={0.48} p={[0, 0.25, 0]} m={M.metalCharcoal} seg={8} />
      <Cyl r={0.18} h={0.02} p={[0, 0.01, 0]} m={M.metalCharcoal} seg={20} />
    </group>
  );
}

export function TableLamp({ lit = true }: { lit?: boolean }) {
  return (
    <group>
      <Cyl r={[0.07, 0.09]} h={0.2} p={[0, 0.1, 0]} m={M.ceramic} seg={14} />
      <Cyl r={[0.13, 0.17]} h={0.2} p={[0, 0.3, 0]} m={lit ? M.lampWarm : M.paperWhite} seg={18} cast={false} />
    </group>
  );
}

/** Floor lamp with a weighted base and a drum shade. */
export function FloorLamp() {
  return (
    <group>
      <Cyl r={[0.18, 0.2]} h={0.035} p={[0, 0.018, 0]} m={M.metalCharcoal} seg={20} />
      <Cyl r={0.016} h={1.55} p={[0, 0.8, 0]} m={M.metalCharcoal} seg={8} />
      <Cyl r={[0.17, 0.24]} h={0.3} p={[0, 1.66, 0]} m={M.lampWarm} seg={20} cast={false} />
    </group>
  );
}

/** Dome pendant that hangs from the ceiling at 3.2 m on two cords. */
export function Pendant({ drop = 1.1 }: { drop?: number }) {
  const y = 3.2 - drop;
  return (
    <group>
      <Cyl r={0.004} h={drop} p={[0, 3.2 - drop / 2, 0]} m={M.cable} seg={4} cast={false} />
      <Cyl r={0.05} h={0.02} p={[0, 3.19, 0]} m={M.metalCharcoal} seg={10} cast={false} />
      <Cyl r={[0.05, 0.2]} h={0.18} p={[0, y - 0.1, 0]} m={M.metalCharcoal} seg={24} />
      <Cyl r={0.15} h={0.01} p={[0, y - 0.185, 0]} m={M.lampWarm} seg={20} cast={false} />
    </group>
  );
}

export function Rug({ w = 4, d = 3, variant }: { w?: number; d?: number; variant?: PropVariant }) {
  return (
    <group>
      <Box s={[w, 0.014, d]} p={[0, 0.02, 0]} m={variant === "charcoal" ? M.rugSlate : M.rugWool} cast={false} />
      <Box s={[w - 0.3, 0.004, d - 0.3]} p={[0, 0.029, 0]} m={variant === "charcoal" ? M.rugSlateInner : M.rugWoolInner} cast={false} />
    </group>
  );
}

const leaves = (n: number, rise: number, spread: number, size: number, startY: number) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + i * 0.7;
    const y = startY + (i / n) * rise;
    const r = spread * (0.6 + 0.4 * Math.sin(i * 1.3 + 1));
    return { a, y, r, size: size * (0.8 + 0.25 * Math.sin(i * 2.1)) };
  });

export function Plant({ variant }: { variant?: PropVariant }) {
  if (variant === "small") {
    return (
      <group>
        <Cyl r={[0.07, 0.055]} h={0.12} p={[0, 0.06, 0]} m={M.pot} seg={14} />
        {leaves(7, 0.18, 0.1, 0.07, 0.16).map((l, i) => (
          <Blob key={i} s={[l.size, 0.008, l.size * 1.5]} p={[Math.cos(l.a) * l.r, l.y, Math.sin(l.a) * l.r]} rot={[0.5, -l.a, 0]} m={i % 2 ? M.leafLight : M.leaf} />
        ))}
      </group>
    );
  }
  if (variant === "blades") {
    return (
      <group>
        <Box s={[0.44, 0.5, 0.44]} p={[0, 0.25, 0]} m={M.potDark} />
        <Box s={[0.4, 0.03, 0.4]} p={[0, 0.51, 0]} m={M.soil} cast={false} />
        {Array.from({ length: 11 }, (_, i) => {
          const a = (i / 11) * Math.PI * 2;
          const rr = 0.04 + (i % 3) * 0.045;
          const h = 0.55 + ((i * 37) % 5) * 0.11;
          return (
            <Blob key={i} s={[0.028, h / 2, 0.01]} p={[Math.cos(a) * rr, 0.5 + h / 2, Math.sin(a) * rr]} rot={[Math.sin(a) * 0.12, a, Math.cos(a) * 0.1]} m={i % 2 ? M.leaf : M.leafLight} />
          );
        })}
      </group>
    );
  }
  if (variant === "tall") {
    return (
      <group>
        <Cyl r={[0.3, 0.26]} h={0.6} p={[0, 0.3, 0]} m={M.potDark} seg={20} />
        <Cyl r={0.27} h={0.03} p={[0, 0.6, 0]} m={M.soil} seg={18} cast={false} />
        <Cyl r={[0.022, 0.035]} h={1.4} p={[0, 1.3, 0]} m={M.stem} seg={8} />
        {leaves(16, 1.0, 0.34, 0.2, 1.1).map((l, i) => (
          <Blob key={i} s={[l.size, 0.012, l.size * 1.45]} p={[Math.cos(l.a) * l.r, l.y, Math.sin(l.a) * l.r]} rot={[0.55, -l.a, 0.1]} m={i % 2 ? M.leafLight : M.leaf} />
        ))}
      </group>
    );
  }
  return (
    <group>
      <Cyl r={[0.26, 0.2]} h={0.52} p={[0, 0.26, 0]} m={M.pot} seg={18} />
      <Cyl r={0.24} h={0.03} p={[0, 0.5, 0]} m={M.soil} seg={16} cast={false} />
      <Cyl r={[0.02, 0.032]} h={0.6} p={[0, 0.8, 0]} m={M.stem} seg={8} />
      {leaves(11, 0.7, 0.26, 0.17, 0.85).map((l, i) => (
        <Blob key={i} s={[l.size, 0.012, l.size * 1.5]} p={[Math.cos(l.a) * l.r, l.y, Math.sin(l.a) * l.r]} rot={[0.5, -l.a, 0.1]} m={i % 2 ? M.leafLight : M.leaf} />
      ))}
    </group>
  );
}
