import { M } from "../materials";
import { Box, Cyl } from "./shared";

/** 42U network cabinet with a glazed door, patch panels and switch ports. Door faces +z. */
export function Rack() {
  const units = [0.3, 0.55, 0.8, 1.05, 1.3, 1.55, 1.8];
  return (
    <group>
      <Box s={[0.8, 2.1, 0.9]} p={[0, 1.075, 0]} m={M.metalCharcoal} />
      <Box s={[0.74, 2.0, 0.02]} p={[0, 1.075, 0.46]} m={M.glassClear} cast={false} />
      <Box s={[0.82, 0.04, 0.92]} p={[0, 2.14, 0]} m={M.metalCharcoal} />
      {units.map((y, i) => (
        <group key={y} position={[0, y, 0.43]}>
          <Box s={[0.68, 0.17, 0.03]} p={[0, 0, 0]} m={i % 3 === 1 ? M.metalBrushed : M.metalCharcoal} cast={false} />
          {[...Array(6)].map((_, k) => (
            <Box key={k} s={[0.025, 0.02, 0.01]} p={[-0.28 + k * 0.045, 0.02, 0.02]} m={k % 3 === 0 ? M.ledGreen : k % 3 === 1 ? M.ledBlue : M.ledAmber} cast={false} />
          ))}
          {i % 3 === 1 &&
            [...Array(8)].map((_, k) => <Box key={k} s={[0.03, 0.03, 0.01]} p={[-0.0 + k * 0.04 - 0.1, -0.03, 0.02]} m={M.fabricCharcoal} cast={false} />)}
        </group>
      ))}
    </group>
  );
}

/** Overhead ladder tray carrying data cabling, hung from the slab on rods. Runs along local x. */
export function CableTray({ w = 6 }: { w?: number }) {
  const rods = Math.max(2, Math.round(w / 2) + 1);
  return (
    <group position={[0, 2.8, 0]}>
      <Box s={[w, 0.05, 0.02]} p={[0, 0, 0.14]} m={M.metalBrushed} cast={false} />
      <Box s={[w, 0.05, 0.02]} p={[0, 0, -0.14]} m={M.metalBrushed} cast={false} />
      {Array.from({ length: Math.floor(w / 0.3) }, (_, i) => (
        <Box key={i} s={[0.02, 0.02, 0.26]} p={[-w / 2 + 0.15 + i * 0.3, -0.015, 0]} m={M.metalBrushed} cast={false} />
      ))}
      <Box s={[w - 0.2, 0.03, 0.14]} p={[0, 0.01, 0]} m={M.cable} cast={false} />
      {Array.from({ length: rods }, (_, i) => (
        <Cyl key={i} r={0.006} h={0.4} p={[-w / 2 + 0.1 + (i * (w - 0.2)) / (rods - 1), 0.2, 0]} m={M.metalBrushed} seg={4} cast={false} />
      ))}
    </group>
  );
}
