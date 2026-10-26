import type { PropVariant } from "../../data/types";
import { M } from "../materials";
import { Box, Cyl, Keyboard, Monitor, Mouse, Mug, Stack } from "./shared";

/** Under-desk cable tray and a vertical cable spine, so wiring never hangs loose. */
function CableManagement({ w, d }: { w: number; d: number }) {
  return (
    <group>
      <Box s={[w - 0.5, 0.045, 0.12]} p={[0, 0.66, -d / 2 + 0.12]} m={M.metalCharcoal} />
      <Cyl r={0.011} h={0.62} p={[w / 2 - 0.3, 0.36, -d / 2 + 0.1]} m={M.cable} seg={6} />
      <Box s={[0.14, 0.045, 0.06]} p={[w / 2 - 0.3, 0.025, -d / 2 + 0.1]} m={M.metalCharcoal} />
      <Cyl r={0.025} h={0.006} p={[-w / 2 + 0.35, 0.763, -d / 2 + 0.08]} m={M.metalCharcoal} seg={12} cast={false} />
    </group>
  );
}

/** Mobile pedestal with three drawers under the desk top. */
function Pedestal({ x, d }: { x: number; d: number }) {
  return (
    <group position={[x, 0, 0]}>
      <Box s={[0.4, 0.58, d - 0.4]} p={[0, 0.34, 0.05]} m={M.metalCharcoal} />
      {[0.18, 0.38, 0.58].map((y) => (
        <Box key={y} s={[0.36, 0.17, 0.012]} p={[0, y - 0.05, d / 2 - 0.15]} m={M.woodOak} cast={false} />
      ))}
      <Box s={[0.1, 0.012, 0.014]} p={[0, 0.5, d / 2 - 0.14]} m={M.metalBrushed} cast={false} />
    </group>
  );
}

function Laptop({ p, ry = 0 }: { p: [number, number, number]; ry?: number }) {
  return (
    <group position={p} rotation={[0, ry, 0]}>
      <Box s={[0.32, 0.014, 0.22]} p={[0, 0.007, 0]} m={M.metalBrushed} cast={false} />
      <group position={[0, 0.014, -0.11]} rotation={[-0.32, 0, 0]}>
        <Box s={[0.32, 0.21, 0.01]} p={[0, 0.105, 0]} m={M.metalBrushed} cast={false} />
        <Box s={[0.3, 0.19, 0.004]} p={[0, 0.105, 0.007]} m={M.screenDashboard} cast={false} />
      </group>
    </group>
  );
}

function Phone({ p }: { p: [number, number, number] }) {
  return (
    <group position={p}>
      <Box s={[0.14, 0.04, 0.2]} p={[0, 0.02, 0]} m={M.metalCharcoal} cast={false} />
      <Box s={[0.05, 0.03, 0.18]} p={[-0.07, 0.05, 0]} m={M.metalCharcoal} cast={false} />
    </group>
  );
}

function TaskLight({ p }: { p: [number, number, number] }) {
  return (
    <group position={p}>
      <Cyl r={0.06} h={0.014} p={[0, 0.007, 0]} m={M.metalCharcoal} seg={14} cast={false} />
      <Cyl r={0.008} h={0.32} p={[0, 0.17, 0]} m={M.metalCharcoal} seg={6} cast={false} />
      <Box s={[0.26, 0.016, 0.05]} p={[0.1, 0.34, 0]} m={M.metalCharcoal} cast={false} />
      <Box s={[0.24, 0.006, 0.035]} p={[0.1, 0.33, 0]} m={M.lampWarm} cast={false} />
    </group>
  );
}

const TOP = 0.76; // desk surface height

/** Desk, oak top on inverted-U steel legs. Monitors face +z; the user sits on the +z side. */
export function Desk({ w = 2.6, d = 1.2, variant = "workstation" }: { w?: number; d?: number; variant?: PropVariant }) {
  const bench = variant === "bench";
  const rear = -d / 2;
  return (
    <group>
      <Box s={[w, 0.04, d]} p={[0, 0.74, 0]} m={bench ? M.metalBrushed : M.woodOak} />
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (w / 2 - 0.08), 0.35, 0]}>
          <Box s={[0.05, 0.7, 0.05]} p={[0, 0, d / 2 - 0.1]} m={M.metalCharcoal} />
          <Box s={[0.05, 0.7, 0.05]} p={[0, 0, -d / 2 + 0.1]} m={M.metalCharcoal} />
          <Box s={[0.05, 0.04, d - 0.1]} p={[0, -0.33, 0]} m={M.metalCharcoal} />
        </group>
      ))}
      <Box s={[w - 0.2, 0.04, 0.05]} p={[0, 0.7, d / 2 - 0.12]} m={M.metalCharcoal} />
      <CableManagement w={w} d={d} />

      {variant === "workstation" && (
        <>
          {/* acoustic felt divider along the rear edge */}
          <Box s={[w - 0.15, 0.4, 0.036]} p={[0, TOP + 0.2, rear + 0.04]} m={M.felt} />
          <Box s={[0.05, 0.12, 0.07]} p={[-w / 3, TOP + 0.02, rear + 0.04]} m={M.metalCharcoal} />
          <Box s={[0.05, 0.12, 0.07]} p={[w / 3, TOP + 0.02, rear + 0.04]} m={M.metalCharcoal} />
          <Monitor p={[0.25, TOP + 0.34, rear + 0.3]} w={0.62} h={0.36} screen={M.screenDocument} />
          <Monitor p={[-0.45, TOP + 0.34, rear + 0.34]} w={0.56} h={0.34} screen={M.screenDashboard} ry={0.22} />
          <Keyboard p={[0.1, TOP, rear + 0.78]} />
          <Mouse p={[0.42, TOP, rear + 0.78]} />
          <Mug p={[-0.62, TOP, rear + 0.8]} />
          <TaskLight p={[w / 2 - 0.25, TOP, rear + 0.2]} />
          <Pedestal x={-w / 2 + 0.35} d={d} />
        </>
      )}
      {variant === "engineering" && (
        <>
          <Monitor p={[0.1, TOP + 0.36, rear + 0.28]} w={0.78} h={0.43} screen={M.screenCode} />
          <Monitor p={[-0.62, TOP + 0.42, rear + 0.3]} w={0.34} h={0.55} screen={M.screenCode} ry={0.3} />
          <Monitor p={[0.84, TOP + 0.34, rear + 0.3]} w={0.5} h={0.32} screen={M.screenDashboard} ry={-0.3} />
          <Laptop p={[-0.2, TOP, rear + 0.78]} />
          <Keyboard p={[0.3, TOP, rear + 0.8]} />
          <Mouse p={[0.62, TOP, rear + 0.8]} />
          <Mug p={[0.95, TOP, rear + 0.78]} />
          {/* workstation tower and dock on the floor beside the leg */}
          <Box s={[0.2, 0.44, 0.42]} p={[w / 2 - 0.4, 0.22, 0.05]} m={M.metalCharcoal} />
          <Box s={[0.04, 0.012, 0.01]} p={[w / 2 - 0.4, 0.38, 0.265]} m={M.ledBlue} cast={false} />
        </>
      )}
      {variant === "hr" && (
        <>
          <Monitor p={[0.15, TOP + 0.34, rear + 0.32]} w={0.62} h={0.36} screen={M.screenDocument} />
          <Keyboard p={[0.15, TOP, rear + 0.78]} />
          <Mouse p={[0.48, TOP, rear + 0.78]} />
          <Phone p={[-0.7, TOP, rear + 0.35]} />
          <Stack p={[-0.55, TOP, rear + 0.85]} w={0.3} d={0.22} n={3} />
          <Mug p={[0.82, TOP, rear + 0.5]} />
          <Pedestal x={w / 2 - 0.35} d={d} />
        </>
      )}
      {variant === "sales" && (
        <>
          <Monitor p={[0.2, TOP + 0.34, rear + 0.3]} w={0.7} h={0.4} screen={M.screenDashboard} />
          <Laptop p={[-0.55, TOP, rear + 0.7]} ry={0.15} />
          <Keyboard p={[0.2, TOP, rear + 0.78]} />
          <Mouse p={[0.52, TOP, rear + 0.78]} />
          <Phone p={[0.95, TOP, rear + 0.4]} />
          <Mug p={[-0.9, TOP, rear + 0.4]} />
          <TaskLight p={[-w / 2 + 0.25, TOP, rear + 0.2]} />
          <Pedestal x={w / 2 - 0.35} d={d} />
        </>
      )}
      {bench && (
        <>
          <Monitor p={[0.5, TOP + 0.32, rear + 0.3]} w={0.6} h={0.36} screen={M.screenCode} />
          <Laptop p={[-0.3, TOP, rear + 0.45]} />
          {/* device trays and spare parts */}
          <Box s={[0.4, 0.04, 0.26]} p={[-0.95, TOP + 0.02, rear + 0.28]} m={M.metalCharcoal} />
          <Box s={[0.14, 0.05, 0.1]} p={[-0.95, TOP + 0.065, rear + 0.28]} m={M.fabricCharcoal} cast={false} />
          <Box s={[0.18, 0.03, 0.12]} p={[-0.8, TOP + 0.015, rear + 0.6]} m={M.paperWhite} cast={false} />
          <Box s={[0.5, 0.03, 0.22]} p={[0.8, TOP + 0.015, rear + 0.62]} m={M.metalBrushed} cast={false} />
        </>
      )}
    </group>
  );
}

function Wheels({ r }: { r: number }) {
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI * 2) / 5, 0]}>
          <Box s={[0.035, 0.028, r]} p={[0, 0.05, r / 2]} m={M.metalCharcoal} />
          <Cyl r={0.024} h={0.03} p={[0, 0.026, r]} m={M.metalCharcoal} rot={[0, 0, Math.PI / 2]} seg={8} />
        </group>
      ))}
    </>
  );
}

/** Chairs face local +z. Variants: task (default), meeting, cafe, guest. */
export function Chair({ variant = "task" }: { variant?: PropVariant }) {
  if (variant === "cafe") {
    return (
      <group>
        {[[-0.19, -0.19], [0.19, -0.19], [-0.19, 0.19], [0.19, 0.19]].map(([x, z]) => (
          <Cyl key={`${x}${z}`} r={0.014} h={0.45} p={[x as number, 0.225, z as number]} m={M.metalCharcoal} seg={6} />
        ))}
        <Box s={[0.44, 0.035, 0.42]} p={[0, 0.46, 0]} m={M.woodLight} />
        <Box s={[0.03, 0.4, 0.03]} p={[-0.19, 0.67, -0.19]} m={M.metalCharcoal} />
        <Box s={[0.03, 0.4, 0.03]} p={[0.19, 0.67, -0.19]} m={M.metalCharcoal} />
        <Box s={[0.4, 0.2, 0.025]} p={[0, 0.74, -0.2]} m={M.woodLight} r={[-0.1, 0, 0]} />
      </group>
    );
  }
  if (variant === "guest") {
    return (
      <group>
        <Box s={[0.04, 0.03, 0.5]} p={[-0.25, 0.04, 0]} m={M.metalBrushed} />
        <Box s={[0.04, 0.03, 0.5]} p={[0.25, 0.04, 0]} m={M.metalBrushed} />
        {[-0.25, 0.25].map((x) => (
          <Box key={x} s={[0.03, 0.4, 0.03]} p={[x, 0.24, 0.2]} m={M.metalBrushed} />
        ))}
        <Box s={[0.54, 0.1, 0.5]} p={[0, 0.44, 0.02]} m={M.fabricSand} />
        <Box s={[0.52, 0.42, 0.08]} p={[0, 0.74, -0.22]} m={M.fabricSand} r={[-0.14, 0, 0]} />
        {[-0.28, 0.28].map((x) => (
          <Box key={x} s={[0.04, 0.03, 0.4]} p={[x, 0.62, 0]} m={M.woodOak} />
        ))}
        {[-0.28, 0.28].map((x) => (
          <Box key={`a${x}`} s={[0.03, 0.18, 0.03]} p={[x, 0.53, 0.14]} m={M.metalBrushed} />
        ))}
      </group>
    );
  }
  const meeting = variant === "meeting";
  const upholstery = meeting ? M.leatherBlack : M.fabricCharcoal;
  return (
    <group>
      {meeting ? (
        <>
          <Cyl r={0.26} h={0.03} p={[0, 0.025, 0]} m={M.metalChrome} seg={20} />
          <Cyl r={[0.03, 0.035]} h={0.4} p={[0, 0.24, 0]} m={M.metalChrome} seg={10} />
        </>
      ) : (
        <>
          <Cyl r={[0.06, 0.07]} h={0.04} p={[0, 0.06, 0]} m={M.metalCharcoal} seg={12} />
          <Wheels r={0.28} />
          <Cyl r={[0.032, 0.035]} h={0.34} p={[0, 0.24, 0]} m={M.metalChrome} seg={10} />
        </>
      )}
      <Box s={[0.52, 0.075, 0.48]} p={[0, 0.45, 0]} m={upholstery} />
      <group position={[0, meeting ? 0.82 : 0.8, -0.21]} rotation={[-0.08, 0, 0]}>
        <Box s={[0.46, meeting ? 0.6 : 0.56, 0.04]} p={[0, 0, 0]} m={meeting ? M.leatherBlack : M.leatherBlack} />
        {!meeting && <Box s={[0.4, 0.08, 0.04]} p={[0, -0.12, -0.02]} m={M.metalCharcoal} />}
      </group>
      {[-0.26, 0.26].map((x) => (
        <group key={x} position={[x, 0.58, 0]}>
          <Box s={[0.035, 0.24, 0.04]} p={[0, 0, 0]} m={M.metalCharcoal} />
          <Box s={[0.07, 0.025, 0.22]} p={[0, 0.12, 0.02]} m={M.leatherBlack} />
        </group>
      ))}
    </group>
  );
}
