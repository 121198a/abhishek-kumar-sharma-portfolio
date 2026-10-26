import type { PropVariant } from "../../data/types";
import { M } from "../materials";
import { Box, Cyl } from "./shared";

/** Open bookcase: oak frame, five shelves, rows of books and a few objects. Faces +z. */
export function Bookcase({ w = 2, d = 0.4 }: { w?: number; d?: number }) {
  const h = 2.1;
  const inner = w - 0.08;
  return (
    <group>
      <Box s={[0.04, h, d]} p={[-w / 2 + 0.02, h / 2, 0]} m={M.woodOak} />
      <Box s={[0.04, h, d]} p={[w / 2 - 0.02, h / 2, 0]} m={M.woodOak} />
      <Box s={[inner, h, 0.015]} p={[0, h / 2, -d / 2 + 0.008]} m={M.woodWalnut} />
      {[0.03, 0.42, 0.81, 1.2, 1.59, 2.08].map((y) => (
        <Box key={y} s={[inner, 0.03, d]} p={[0, y, 0]} m={M.woodOak} />
      ))}
      {/* books on three shelves */}
      {[0.045, 0.83, 1.61].map((y) => (
        <Box key={y} s={[inner - 0.1, 0.3, d - 0.14]} p={[0.02, y + 0.15, -0.02]} m={M.books} cast={false} />
      ))}
      {/* objects on the open shelves */}
      <Cyl r={[0.05, 0.07]} h={0.24} p={[-w / 4, 0.57, 0]} m={M.ceramic} seg={12} />
      <Box s={[0.22, 0.18, 0.18]} p={[w / 5, 0.51, 0]} m={M.fabricSand} />
      <Cyl r={0.09} h={0.1} p={[-w / 5, 1.275, 0]} m={M.pot} seg={14} />
      <Box s={[0.3, 0.26, 0.02]} p={[w / 4, 1.34, -d / 2 + 0.05]} m={M.art1} cast={false} />
    </group>
  );
}

/** Storage cabinet with two doors and brushed pulls. The "tall" variant is a floor-to-ceiling pantry or stationery cabinet. */
export function Cabinet({ w = 1.05, d = 0.5, variant }: { w?: number; d?: number; variant?: PropVariant }) {
  const h = variant === "tall" ? 2.1 : 0.88;
  return (
    <group>
      <Box s={[w, 0.08, d - 0.04]} p={[0, 0.04, -0.01]} m={M.metalCharcoal} />
      <Box s={[w, h - 0.08, d]} p={[0, 0.08 + (h - 0.08) / 2, 0]} m={M.woodOak} />
      <Box s={[0.012, h - 0.14, 0.01]} p={[0, 0.08 + (h - 0.08) / 2, d / 2]} m={M.woodWalnut} cast={false} />
      {variant === "tall" && <Box s={[w - 0.04, 0.012, 0.01]} p={[0, 1.0, d / 2]} m={M.woodWalnut} cast={false} />}
      <Box s={[0.012, 0.3, 0.02]} p={[-0.06, variant === "tall" ? 1.05 : 0.55, d / 2 + 0.012]} m={M.metalBrushed} cast={false} />
      <Box s={[0.012, 0.3, 0.02]} p={[0.06, variant === "tall" ? 1.05 : 0.55, d / 2 + 0.012]} m={M.metalBrushed} cast={false} />
    </group>
  );
}

/** Four-drawer lateral filing cabinet in charcoal steel. */
export function Filing({ w = 1.2, d = 0.5 }: { w?: number; d?: number }) {
  return (
    <group>
      <Box s={[w, 1.32, d]} p={[0, 0.66, 0]} m={M.metalCharcoal} />
      {[0.18, 0.5, 0.82, 1.14].map((y) => (
        <group key={y}>
          <Box s={[w - 0.05, 0.28, 0.012]} p={[0, y, d / 2 + 0.004]} m={M.metalBrushed} cast={false} />
          <Box s={[0.34, 0.025, 0.02]} p={[0, y + 0.06, d / 2 + 0.018]} m={M.metalCharcoal} cast={false} />
        </group>
      ))}
    </group>
  );
}

/** Low sideboard. The variant decides what stands on it. */
export function Credenza({ w = 1.8, d = 0.5, variant }: { w?: number; d?: number; variant?: PropVariant }) {
  const doors = Math.max(2, Math.round(w / 0.6));
  const dw = (w - 0.04) / doors;
  return (
    <group>
      <Box s={[w - 0.1, 0.1, d - 0.08]} p={[0, 0.05, 0]} m={M.metalCharcoal} />
      <Box s={[w, 0.6, d]} p={[0, 0.4, 0]} m={M.woodWalnut} />
      <Box s={[w + 0.03, 0.035, d + 0.03]} p={[0, 0.7175, 0]} m={M.woodOak} />
      {Array.from({ length: doors }, (_, i) => (
        <group key={i}>
          <Box s={[0.006, 0.54, 0.01]} p={[-w / 2 + 0.02 + dw * (i + 1), 0.4, d / 2]} m={M.metalCharcoal} cast={false} />
          <Box s={[0.012, 0.14, 0.016]} p={[-w / 2 + 0.02 + dw * (i + 0.5) + 0.04, 0.5, d / 2 + 0.01]} m={M.brass} cast={false} />
        </group>
      ))}
      {variant === "conference" && (
        <>
          <Box s={[0.5, 0.012, 0.3]} p={[-w / 4, 0.74, 0]} m={M.metalBrushed} cast={false} />
          <Cyl r={[0.04, 0.06]} h={0.24} p={[-w / 4 - 0.12, 0.87, 0]} m={M.glassBottle} seg={14} />
          {[0, 1, 2, 3].map((i) => (
            <Cyl key={i} r={[0.032, 0.026]} h={0.09} p={[-w / 4 + 0.02 + i * 0.07, 0.79, 0.06]} m={M.glassBottle} seg={10} />
          ))}
          <Box s={[0.3, 0.1, 0.22]} p={[w / 4, 0.79, 0]} m={M.metalCharcoal} />
        </>
      )}
      {variant === "executive" && (
        <>
          <Box s={[0.34, 0.2, 0.05]} p={[-w / 4, 0.84, -0.12]} m={M.art3} r={[-0.12, 0, 0]} cast={false} />
          <Cyl r={[0.05, 0.07]} h={0.26} p={[0.1, 0.88, 0]} m={M.ceramic} seg={12} />
          <Box s={[0.4, 0.07, 0.26]} p={[w / 4, 0.77, 0]} m={M.books} cast={false} />
        </>
      )}
    </group>
  );
}
