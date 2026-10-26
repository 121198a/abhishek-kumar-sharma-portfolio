import { M } from "../materials";
import { Box, Cyl, Stack } from "./shared";

/** Height of the worktop surface. Appliances stand on it. */
export const COUNTER_TOP = 0.92;

/** Base cabinet run with oak fronts, brass pulls, quartz worktop and a tiled splashback. Fronts face +z. */
export function Counter({ w = 6, d = 0.7 }: { w?: number; d?: number }) {
  const units = Math.max(1, Math.round(w / 0.6));
  const uw = w / units;
  return (
    <group>
      <Box s={[w - 0.04, 0.1, d - 0.08]} p={[0, 0.05, -0.02]} m={M.metalCharcoal} />
      <Box s={[w, 0.78, d - 0.03]} p={[0, 0.49, -0.015]} m={M.woodOak} />
      {Array.from({ length: units }, (_, i) => {
        const x = -w / 2 + uw * (i + 0.5);
        return (
          <group key={i}>
            <Box s={[uw - 0.012, 0.74, 0.016]} p={[x, 0.49, d / 2 - 0.016]} m={M.woodOak} cast={false} />
            <Box s={[0.012, 0.74, 0.02]} p={[x + uw / 2, 0.49, d / 2 - 0.012]} m={M.woodWalnut} cast={false} />
            <Box s={[0.012, 0.16, 0.022]} p={[x + uw * 0.3, 0.8, d / 2 + 0.004]} m={M.brass} cast={false} />
          </group>
        );
      })}
      <Box s={[w + 0.04, 0.04, d + 0.03]} p={[0, COUNTER_TOP - 0.02, 0.0]} m={M.quartzWhite} />
      <Box s={[w + 0.04, 0.5, 0.02]} p={[0, COUNTER_TOP + 0.25, -d / 2 + 0.01]} m={M.splash} />
    </group>
  );
}

/** Bean-to-cup coffee machine with cups, jars and a tray of capsules. Stands on the worktop. */
export function CoffeeStation() {
  return (
    <group position={[0, COUNTER_TOP, 0]}>
      <Box s={[0.36, 0.44, 0.38]} p={[-0.1, 0.22, -0.08]} m={M.metalCharcoal} />
      <Box s={[0.34, 0.04, 0.36]} p={[-0.1, 0.46, -0.08]} m={M.metalBrushed} />
      <Box s={[0.3, 0.05, 0.1]} p={[-0.1, 0.17, 0.12]} m={M.metalChrome} />
      <Box s={[0.34, 0.012, 0.18]} p={[-0.1, 0.006, 0.12]} m={M.metalBrushed} cast={false} />
      <Box s={[0.1, 0.07, 0.01]} p={[-0.1, 0.34, 0.112]} m={M.screenWelcome} cast={false} />
      <Cyl r={0.012} h={0.06} p={[-0.1, 0.24, 0.1]} m={M.metalChrome} seg={8} />
      <Cyl r={[0.035, 0.03]} h={0.07} p={[-0.1, 0.075, 0.13]} m={M.ceramic} seg={10} />
      <Box s={[0.14, 0.15, 0.1]} p={[-0.1, 0.52, -0.2]} m={M.metalBrushed} cast={false} />
      {/* cups, a milk jug and a capsule tray */}
      {[0, 1, 2, 3].map((i) => (
        <Cyl key={i} r={[0.038, 0.03]} h={0.08} p={[0.2 + (i % 2) * 0.085, 0.04, -0.05 + Math.floor(i / 2) * 0.09]} m={M.ceramic} seg={10} />
      ))}
      <Cyl r={[0.03, 0.04]} h={0.14} p={[0.32, 0.07, 0.1]} m={M.metalChrome} seg={10} />
      <Box s={[0.24, 0.04, 0.16]} p={[0.28, 0.02, 0.17]} m={M.woodWalnut} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Box key={i} s={[0.03, 0.025, 0.03]} p={[0.2 + (i % 3) * 0.05, 0.055, 0.14 + Math.floor(i / 3) * 0.05]} m={i % 2 ? M.brass : M.fabricCharcoal} cast={false} />
      ))}
    </group>
  );
}

export function Fridge() {
  return (
    <group>
      <Box s={[0.9, 1.9, 0.78]} p={[0, 0.95, 0]} m={M.metalBrushed} />
      <Box s={[0.005, 1.2, 0.02]} p={[0, 1.3, 0.39]} m={M.metalCharcoal} cast={false} />
      <Box s={[0.005, 0.7, 0.02]} p={[0, 0.4, 0.39]} m={M.metalCharcoal} cast={false} />
      <Box s={[0.02, 0.8, 0.04]} p={[-0.06, 1.3, 0.42]} m={M.metalChrome} cast={false} />
      <Box s={[0.02, 0.8, 0.04]} p={[0.06, 1.3, 0.42]} m={M.metalChrome} cast={false} />
      <Box s={[0.02, 0.4, 0.04]} p={[0.06, 0.45, 0.42]} m={M.metalChrome} cast={false} />
      <Box s={[0.2, 0.14, 0.01]} p={[-0.25, 1.55, 0.395]} m={M.screenWelcome} cast={false} />
      <Box s={[0.9, 0.04, 0.78]} p={[0, 1.92, 0]} m={M.metalCharcoal} />
    </group>
  );
}

export function Microwave() {
  return (
    <group position={[0, COUNTER_TOP, 0]}>
      <Box s={[0.5, 0.3, 0.38]} p={[0, 0.15, 0]} m={M.metalBrushed} />
      <Box s={[0.32, 0.22, 0.008]} p={[-0.07, 0.15, 0.192]} m={M.screenOff} cast={false} />
      <Box s={[0.1, 0.22, 0.008]} p={[0.15, 0.15, 0.192]} m={M.metalCharcoal} cast={false} />
      <Box s={[0.07, 0.02, 0.01]} p={[0.15, 0.22, 0.2]} m={M.ledGreen} cast={false} />
      <Box s={[0.01, 0.18, 0.025]} p={[0.07, 0.15, 0.2]} m={M.metalChrome} cast={false} />
    </group>
  );
}

/** Stainless sink set into the worktop with a gooseneck mixer and soap pump. */
export function Sink() {
  return (
    <group position={[0, COUNTER_TOP, 0]}>
      <Box s={[0.62, 0.006, 0.44]} p={[0, 0.003, 0.02]} m={M.metalBrushed} cast={false} />
      <Box s={[0.5, 0.004, 0.32]} p={[0, 0.008, 0.02]} m={M.metalCharcoal} cast={false} />
      <Cyl r={0.025} h={0.004} p={[0, 0.011, 0.02]} m={M.metalBrushed} seg={10} cast={false} />
      <Cyl r={0.017} h={0.3} p={[0, 0.15, -0.2]} m={M.metalChrome} seg={10} />
      <Box s={[0.02, 0.02, 0.2]} p={[0, 0.3, -0.1]} m={M.metalChrome} cast={false} />
      <Box s={[0.012, 0.07, 0.012]} p={[0.07, 0.035, -0.2]} m={M.metalChrome} cast={false} />
      <Cyl r={0.032} h={0.12} p={[0.2, 0.06, -0.18]} m={M.ceramic} seg={10} />
    </group>
  );
}

/** Water cooler with a mounted bottle. */
export function Dispenser() {
  return (
    <group>
      <Box s={[0.36, 1.05, 0.36]} p={[0, 0.525, 0]} m={M.paintWhite} />
      <Box s={[0.28, 0.2, 0.02]} p={[0, 0.78, 0.18]} m={M.metalCharcoal} cast={false} />
      <Box s={[0.03, 0.04, 0.05]} p={[-0.06, 0.8, 0.2]} m={M.ledBlue} cast={false} />
      <Box s={[0.03, 0.04, 0.05]} p={[0.06, 0.8, 0.2]} m={M.redExtinguisher} cast={false} />
      <Cyl r={0.16} h={0.4} p={[0, 1.27, 0]} m={M.glassBottle} seg={16} />
    </group>
  );
}

/** Three-stream waste station. */
export function BinSet() {
  const bins = [M.binGrey, M.binBlue, M.binGreen];
  return (
    <group>
      {bins.map((lid, i) => (
        <group key={i} position={[(i - 1) * 0.32, 0, 0]}>
          <Box s={[0.29, 0.74, 0.34]} p={[0, 0.37, 0]} m={M.metalCharcoal} />
          <Box s={[0.3, 0.06, 0.35]} p={[0, 0.77, 0]} m={lid} />
          <Box s={[0.14, 0.012, 0.02]} p={[0, 0.78, 0.18]} m={M.metalCharcoal} cast={false} />
        </group>
      ))}
    </group>
  );
}

/** Multifunction printer on its own cabinet, with a ream of paper beside it. */
export function PrinterStation() {
  return (
    <group>
      <Box s={[1.0, 0.7, 0.6]} p={[0, 0.35, 0]} m={M.paintWhite} />
      <Box s={[0.012, 0.64, 0.01]} p={[0, 0.35, 0.3]} m={M.metalCharcoal} cast={false} />
      <Box s={[0.012, 0.2, 0.02]} p={[-0.06, 0.45, 0.31]} m={M.metalBrushed} cast={false} />
      <Box s={[0.012, 0.2, 0.02]} p={[0.06, 0.45, 0.31]} m={M.metalBrushed} cast={false} />
      <group position={[-0.12, 0.7, 0]}>
        <Box s={[0.6, 0.36, 0.5]} p={[0, 0.18, 0]} m={M.quartzWhite} />
        <Box s={[0.5, 0.03, 0.2]} p={[0, 0.07, 0.27]} m={M.metalCharcoal} />
        <Box s={[0.18, 0.08, 0.02]} p={[-0.15, 0.3, 0.255]} m={M.screenDashboard} r={[-0.5, 0, 0]} cast={false} />
        <Box s={[0.5, 0.03, 0.04]} p={[0, 0.375, -0.1]} m={M.metalCharcoal} cast={false} />
      </group>
      <Stack p={[0.34, 0.7, 0.05]} w={0.22} d={0.3} n={4} />
    </group>
  );
}
