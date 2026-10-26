import { useMemo } from "react";
import * as THREE from "three";
import type { PropVariant } from "../../data/types";
import { M } from "../materials";
import { directoryTexture } from "../textures";
import { Box, Cyl } from "./shared";

/**
 * Wall-mounted items. The local origin is on the wall surface and the item extends along +z,
 * so every piece is flush with its wall and never floats.
 */

const displayMaterial = (v?: PropVariant) => (v === "code" ? M.screenCode : v === "welcome" ? M.screenWelcome : M.screenDashboard);

export function WallDisplay({ w = 2.4, y = 1.55, variant }: { w?: number; y?: number; variant?: PropVariant }) {
  const h = (w * 9) / 16;
  return (
    <group position={[0, y, 0]}>
      <Box s={[w, h, 0.04]} p={[0, 0, 0.02]} m={M.metalCharcoal} />
      <Box s={[w - 0.05, h - 0.05, 0.004]} p={[0, 0, 0.042]} m={displayMaterial(variant)} cast={false} />
      <Box s={[0.4, 0.02, 0.02]} p={[0, -h / 2 - 0.02, 0.012]} m={M.metalCharcoal} cast={false} />
    </group>
  );
}

/** Wall whiteboard with an aluminium frame and marker tray; "mobile" is a freestanding two-leg easel board. */
export function Whiteboard({ w = 2.2, y = 1.45, variant }: { w?: number; y?: number; variant?: PropVariant }) {
  const h = w * 0.55;
  const face = variant === "document" || variant === "mobile" ? M.whiteboardNotes : M.whiteboard;
  if (variant === "mobile") {
    return (
      <group>
        <Box s={[w + 0.04, h + 0.04, 0.035]} p={[0, 1.35, 0]} m={M.metalBrushed} />
        <Box s={[w, h, 0.01]} p={[0, 1.35, 0.02]} m={face} cast={false} />
        <Box s={[w * 0.5, 0.02, 0.07]} p={[0, 1.35 - h / 2 - 0.04, 0.04]} m={M.metalBrushed} cast={false} />
        {[-1, 1].map((s) => (
          <group key={s}>
            <Box s={[0.04, 1.0, 0.04]} p={[s * (w / 2 - 0.1), 0.5, 0]} m={M.metalCharcoal} />
            <Box s={[0.05, 0.04, 0.5]} p={[s * (w / 2 - 0.1), 0.03, 0]} m={M.metalCharcoal} />
            <Cyl r={0.025} h={0.03} p={[s * (w / 2 - 0.1), 0.015, 0.22]} m={M.metalCharcoal} seg={8} cast={false} />
            <Cyl r={0.025} h={0.03} p={[s * (w / 2 - 0.1), 0.015, -0.22]} m={M.metalCharcoal} seg={8} cast={false} />
          </group>
        ))}
      </group>
    );
  }
  return (
    <group position={[0, y, 0]}>
      <Box s={[w + 0.05, h + 0.05, 0.03]} p={[0, 0, 0.015]} m={M.metalBrushed} />
      <Box s={[w, h, 0.01]} p={[0, 0, 0.032]} m={face} cast={false} />
      <Box s={[w * 0.6, 0.025, 0.07]} p={[0, -h / 2 - 0.035, 0.05]} m={M.metalBrushed} cast={false} />
      {[-0.1, 0, 0.1].map((x, i) => (
        <Box key={x} s={[0.1, 0.018, 0.018]} p={[x, -h / 2 - 0.012, 0.075]} m={[M.ledBlue, M.redExtinguisher, M.metalCharcoal][i] as THREE.Material} cast={false} />
      ))}
    </group>
  );
}

export function NoticeBoard({ w = 1.4, y = 1.5 }: { w?: number; y?: number }) {
  const h = w * 0.75;
  return (
    <group position={[0, y, 0]}>
      <Box s={[w + 0.06, h + 0.06, 0.03]} p={[0, 0, 0.015]} m={M.woodWalnut} />
      <Box s={[w, h, 0.01]} p={[0, 0, 0.034]} m={M.cork} cast={false} />
    </group>
  );
}

/** Wayfinding board listing the rooms that exist in this project. */
export function DirectoryBoard({ rows, y = 1.5 }: { rows: string[]; y?: number }) {
  const material = useMemo(() => new THREE.MeshStandardMaterial({ map: directoryTexture(rows), roughness: 0.55, emissive: "#ffffff", emissiveIntensity: 0.12 }), [rows]);
  const w = 1.0;
  const h = 1.25;
  return (
    <group position={[0, y, 0]}>
      <Box s={[w + 0.05, h + 0.05, 0.03]} p={[0, 0, 0.015]} m={M.metalCharcoal} />
      <Box s={[w, h, 0.008]} p={[0, 0, 0.034]} m={material} cast={false} />
    </group>
  );
}

export function ArtFrame({ w = 0.9, y = 1.55, variant }: { w?: number; y?: number; variant?: PropVariant }) {
  const h = w * 1.25;
  const art = variant === "art2" ? M.art2 : variant === "art3" ? M.art3 : M.art1;
  return (
    <group position={[0, y, 0]}>
      <Box s={[w + 0.06, h + 0.06, 0.03]} p={[0, 0, 0.015]} m={M.woodWalnut} />
      <Box s={[w, h, 0.01]} p={[0, 0, 0.032]} m={M.paperWhite} cast={false} />
      <Box s={[w - 0.14, h - 0.18, 0.004]} p={[0, 0, 0.039]} m={art} cast={false} />
    </group>
  );
}

export function WallClock({ y = 2.2 }: { y?: number }) {
  return (
    <group position={[0, y, 0]}>
      <Cyl r={0.2} h={0.04} p={[0, 0, 0.02]} m={M.metalCharcoal} rot={[Math.PI / 2, 0, 0]} seg={32} />
      <Cyl r={0.18} h={0.006} p={[0, 0, 0.042]} m={M.clockFace} rot={[Math.PI / 2, 0, 0]} seg={32} cast={false} />
      <Box s={[0.012, 0.12, 0.006]} p={[0.0, 0.05, 0.05]} m={M.metalCharcoal} cast={false} />
      <Box s={[0.1, 0.012, 0.006]} p={[0.04, 0.0, 0.052]} m={M.metalCharcoal} r={[0, 0, 0.5]} cast={false} />
    </group>
  );
}

/** Felt acoustic wall panel with vertical grooves. */
export function AcousticPanel({ w = 1.4, y = 1.6 }: { w?: number; y?: number }) {
  const h = 1.3;
  const slats = Math.max(3, Math.round(w / 0.2));
  const sw = w / slats;
  return (
    <group position={[0, y, 0]}>
      {Array.from({ length: slats }, (_, i) => (
        <Box key={i} s={[sw - 0.012, h, 0.045]} p={[-w / 2 + sw * (i + 0.5), 0, 0.0225]} m={i % 2 ? M.fabricSand : M.felt} />
      ))}
    </group>
  );
}

export function FirstAid({ y = 1.4 }: { y?: number }) {
  return (
    <group position={[0, y, 0]}>
      <Box s={[0.36, 0.3, 0.1]} p={[0, 0, 0.05]} m={M.paintWhite} />
      <Box s={[0.22, 0.06, 0.012]} p={[0, 0, 0.106]} m={M.ledGreen} cast={false} />
      <Box s={[0.06, 0.22, 0.012]} p={[0, 0, 0.106]} m={M.ledGreen} cast={false} />
    </group>
  );
}

/** Wall bracket, extinguisher and the standard red sign above it. */
export function Extinguisher({ y = 0.95 }: { y?: number }) {
  return (
    <group position={[0, y, 0]}>
      <Box s={[0.22, 0.62, 0.02]} p={[0, 0, 0.01]} m={M.metalCharcoal} />
      <Cyl r={0.075} h={0.46} p={[0, 0, 0.11]} m={M.redExtinguisher} seg={14} />
      <Cyl r={0.03} h={0.1} p={[0, 0.28, 0.11]} m={M.metalCharcoal} seg={8} />
      <Box s={[0.19, 0.03, 0.018]} p={[0, 0.06, 0.11]} m={M.metalCharcoal} cast={false} />
      <Box s={[0.22, 0.22, 0.012]} p={[0, 0.62, 0.006]} m={M.redExtinguisher} cast={false} />
      <Box s={[0.08, 0.14, 0.004]} p={[0, 0.62, 0.014]} m={M.paperWhite} cast={false} />
    </group>
  );
}

/** Illuminated exit sign, fixed flat to the wall above a doorway. */
export function ExitSign({ y = 2.55 }: { y?: number }) {
  return (
    <group position={[0, y, 0]}>
      <Box s={[0.5, 0.2, 0.04]} p={[0, 0, 0.02]} m={M.exitGreen} cast={false} />
    </group>
  );
}
