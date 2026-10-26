import { M } from "../materials";
import { Box, Cyl, Keyboard, Monitor, Mouse, Mug } from "./shared";

/** Reception desk. The visitor side is +z (slatted oak front and a raised quartz ledge); the receptionist works behind it. */
export function ReceptionDesk({ w = 6 }: { w?: number }) {
  return (
    <group>
      {/* visitor-facing slatted front, ledge, and end returns */}
      <Box s={[w, 1.05, 0.12]} p={[0, 0.525, 0.64]} m={M.woodSlats} />
      <Box s={[w + 0.12, 0.05, 0.6]} p={[0, 1.075, 0.42]} m={M.quartzWhite} />
      {[-1, 1].map((s) => (
        <Box key={s} s={[0.12, 1.05, 1.4]} p={[s * (w / 2 - 0.06), 0.525, -0.0]} m={M.woodOak} />
      ))}
      <Box s={[w - 0.4, 0.012, 0.03]} p={[0, 1.0, 0.71]} m={M.lampWarm} cast={false} />
      <Box s={[w - 0.4, 0.012, 0.03]} p={[0, 0.06, 0.71]} m={M.lampWarm} cast={false} />
      {/* working surface behind the ledge */}
      <Box s={[w - 0.3, 0.04, 0.7]} p={[0, 0.74, -0.3]} m={M.woodOak} />
      <Box s={[w - 0.3, 0.7, 0.03]} p={[0, 0.38, -0.62]} m={M.woodWalnut} />
      <Box s={[w - 0.3, 0.6, 0.03]} p={[0, 0.7, 0.2]} m={M.woodWalnut} />
      {/* two workstations, screens turned towards the receptionist */}
      {[-1.4, 1.4].map((x) => (
        <group key={x}>
          <Monitor p={[x, 1.1, -0.2]} w={0.6} h={0.36} screen={M.screenDocument} ry={Math.PI} surface={0.76} />
          <Keyboard p={[x, 0.76, -0.45]} ry={Math.PI} />
          <Mouse p={[x + 0.3, 0.76, -0.45]} />
        </group>
      ))}
      <Mug p={[0.4, 0.76, -0.4]} />
      {/* bell and visitor sign-in tablet on the ledge */}
      <Cyl r={0.045} h={0.03} p={[-0.6, 1.115, 0.42]} m={M.brass} seg={14} />
      <Box s={[0.26, 0.012, 0.18]} p={[0.6, 1.106, 0.42]} m={M.metalCharcoal} cast={false} />
      <Box s={[0.24, 0.004, 0.16]} p={[0.6, 1.114, 0.42]} m={M.screenWelcome} cast={false} />
    </group>
  );
}

export function SecurityDesk() {
  return (
    <group>
      <Box s={[1.8, 1.02, 0.7]} p={[0, 0.51, 0]} m={M.woodOak} />
      <Box s={[1.92, 0.05, 0.8]} p={[0, 1.045, 0]} m={M.quartzWhite} />
      <Monitor p={[0, 1.42, -0.15]} w={0.5} h={0.3} screen={M.screenDashboard} surface={1.07} />
      <Box s={[0.4, 0.012, 0.15]} p={[0, 1.076, 0.1]} m={M.metalCharcoal} cast={false} />
    </group>
  );
}

/** Executive desk: walnut top on a wrapped leather modesty panel. Visitors sit on the +z side; the executive on -z. */
export function ManagerDesk({ w = 2.8, d = 1.3 }: { w?: number; d?: number }) {
  return (
    <group>
      <Box s={[w, 0.06, d]} p={[0, 0.76, 0]} m={M.woodWalnut} />
      <Box s={[0.06, 0.73, d - 0.1]} p={[-w / 2 + 0.1, 0.365, 0]} m={M.woodWalnut} />
      <Box s={[0.06, 0.73, d - 0.1]} p={[w / 2 - 0.1, 0.365, 0]} m={M.woodWalnut} />
      <Box s={[w - 0.2, 0.62, 0.04]} p={[0, 0.45, d / 2 - 0.2]} m={M.leatherWarm} />
      <Box s={[0.5, 0.58, d - 0.4]} p={[w / 2 - 0.4, 0.4, -0.05]} m={M.woodWalnut} />
      {[0.2, 0.4, 0.58].map((y) => (
        <Box key={y} s={[0.46, 0.15, 0.012]} p={[w / 2 - 0.4, y, d / 2 - 0.24]} m={M.woodOak} cast={false} />
      ))}
      {/* display faces the executive, a leather pad and a brass lamp face the visitor */}
      <Monitor p={[0.3, 1.14, -0.05]} w={0.8} h={0.45} screen={M.screenDashboard} ry={Math.PI} surface={0.79} />
      <Box s={[0.7, 0.008, 0.4]} p={[0.3, 0.795, -0.35]} m={M.leatherBlack} cast={false} />
      <Keyboard p={[0.3, 0.8, -0.38]} ry={Math.PI} />
      <group position={[-0.95, 0.79, 0.1]}>
        <Cyl r={0.08} h={0.025} p={[0, 0.0125, 0]} m={M.brass} seg={14} />
        <Cyl r={0.012} h={0.34} p={[0, 0.19, 0]} m={M.brass} seg={6} />
        <Box s={[0.22, 0.05, 0.1]} p={[0.06, 0.38, 0]} m={M.brass} />
      </group>
      <Box s={[0.3, 0.02, 0.2]} p={[-0.2, 0.8, 0.2]} m={M.paperWhite} cast={false} />
    </group>
  );
}

/** Boardroom table with a cable trough, a speakerphone, notepads and water glasses. */
export function ConfTable({ w = 8, d = 3 }: { w?: number; d?: number }) {
  const places = [-0.375, 0, 0.375].map((k) => k * w * 0.8);
  return (
    <group>
      <Box s={[w, 0.06, d]} p={[0, 0.75, 0]} m={M.woodOak} />
      <Box s={[w * 0.5, 0.012, 0.3]} p={[0, 0.786, 0]} m={M.metalBrushed} />
      <Cyl r={[0.11, 0.13]} h={0.035} p={[0, 0.81, 0]} m={M.metalCharcoal} seg={18} />
      {[-1, 1].map((s) => (
        <group key={s} position={[s * w * 0.3, 0, 0]}>
          <Box s={[0.7, 0.04, d * 0.55]} p={[0, 0.02, 0]} m={M.metalCharcoal} />
          <Box s={[0.2, 0.7, d * 0.4]} p={[0, 0.39, 0]} m={M.metalCharcoal} />
        </group>
      ))}
      {[-1, 1].flatMap((side) =>
        places.map((x) => (
          <group key={`${side}${x}`} position={[x, 0.78, side * (d / 2 - 0.4)]}>
            <Box s={[0.22, 0.012, 0.3]} p={[0, 0.006, 0]} m={M.paperWhite} cast={false} />
            <Box s={[0.01, 0.01, 0.12]} p={[0.07, 0.016, 0.02]} m={M.metalCharcoal} cast={false} />
            <Cyl r={[0.032, 0.026]} h={0.09} p={[-0.2, 0.045, -side * 0.08]} m={M.glassBottle} seg={10} />
          </group>
        )),
      )}
    </group>
  );
}

/** Slatted feature wall behind the reception desk. The company sign is added by the scene, so this stays a plain backdrop. */
export function BrandWall({ w = 5.4, h = 2.7, d = 0.3 }: { w?: number; h?: number; d?: number }) {
  return (
    <group>
      <Box s={[w, h, d]} p={[0, h / 2, 0]} m={M.woodSlats} />
      <Box s={[w + 0.1, 0.1, d + 0.1]} p={[0, 0.05, 0]} m={M.metalCharcoal} />
      <Box s={[w - 0.2, 0.014, 0.03]} p={[0, h - 0.12, d / 2 + 0.015]} m={M.lampWarm} cast={false} />
    </group>
  );
}
