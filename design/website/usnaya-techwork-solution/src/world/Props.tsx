import { useMemo } from "react";
import { destinations } from "../data/destinations";
import type { Prop, PropKind } from "../data/types";
import { Counter, CoffeeStation, BinSet, Dispenser, Fridge, Microwave, PrinterStation, Sink } from "./props/kitchen";
import { Armchair, Bench, CoffeeTable, FloorLamp, Pendant, Plant, Rug, SideTable, Sofa, TableLamp } from "./props/lounge";
import { BrandWall, ConfTable, ManagerDesk, ReceptionDesk, SecurityDesk } from "./props/reception";
import { Bookcase, Cabinet, Credenza, Filing } from "./props/storage";
import { CableTray, Rack } from "./props/technical";
import { AcousticPanel, ArtFrame, DirectoryBoard, ExitSign, Extinguisher, FirstAid, NoticeBoard, WallClock, WallDisplay, Whiteboard } from "./props/wall";
import { Chair, Desk } from "./props/workplace";
import { Box } from "./props/shared";
import { M } from "./materials";

/** Rooms listed on the wayfinding board, in the same words the directory panel uses. */
const DIRECTORY_ROWS = destinations.filter((d) => d.zoneId !== "main-gate" && !d.zoneId.includes("parking")).map((d) => d.label);

/** Wall items that have no height of their own sit at the default set by their component. */
export const WALL_KINDS: ReadonlySet<PropKind> = new Set<PropKind>(["wallDisplay", "whiteboard", "noticeBoard", "directoryBoard", "artFrame", "wallClock", "acousticPanel", "firstAid", "extinguisher", "exitSign"]);

function render(p: Prop) {
  switch (p.kind) {
    case "desk":
      return <Desk w={p.w} d={p.d} variant={p.variant} />;
    case "chair":
      return <Chair variant={p.variant} />;
    case "sofa":
      return <Sofa w={p.w} d={p.d} variant={p.variant} />;
    case "armchair":
      return <Armchair variant={p.variant} />;
    case "bench":
      return <Bench w={p.w} d={p.d} />;
    case "confTable":
      return <ConfTable w={p.w} d={p.d} />;
    case "diningTable": {
      const w = p.w ?? 2;
      const d = p.d ?? 1.2;
      return (
        <group>
          <Box s={[w, 0.04, d]} p={[0, 0.74, 0]} m={M.woodLight} />
          {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz]) => (
            <Box key={`${sx}${sz}`} s={[0.05, 0.72, 0.05]} p={[(sx as number) * (w / 2 - 0.1), 0.36, (sz as number) * (d / 2 - 0.1)]} m={M.metalCharcoal} />
          ))}
          <Box s={[w - 0.2, 0.03, 0.04]} p={[0, 0.7, 0]} m={M.metalCharcoal} />
        </group>
      );
    }
    case "coffeeTable":
      return <CoffeeTable w={p.w} d={p.d} />;
    case "sideTable":
      return <SideTable />;
    case "managerDesk":
      return <ManagerDesk w={p.w} d={p.d} />;
    case "receptionDesk":
      return <ReceptionDesk w={p.w} />;
    case "securityDesk":
      return <SecurityDesk />;
    case "shelf":
      return <Bookcase w={p.w} d={p.d} />;
    case "cabinet":
      return <Cabinet w={p.w} d={p.d} variant={p.variant} />;
    case "filing":
      return <Filing w={p.w} d={p.d} />;
    case "credenza":
      return <Credenza w={p.w} d={p.d} variant={p.variant} />;
    case "counter":
      return <Counter w={p.w} d={p.d} />;
    case "coffee":
      return <CoffeeStation />;
    case "fridge":
      return <Fridge />;
    case "microwave":
      return <Microwave />;
    case "sink":
      return <Sink />;
    case "dispenser":
      return <Dispenser />;
    case "binSet":
      return <BinSet />;
    case "printerStation":
      return <PrinterStation />;
    case "rack":
      return <Rack />;
    case "cableTray":
      return <CableTray w={p.w} />;
    case "rug":
      return <Rug w={p.w} d={p.d} variant={p.variant} />;
    case "plant":
      return <Plant variant={p.variant} />;
    case "lamp":
      return <FloorLamp />;
    case "tableLamp":
      return <TableLamp />;
    case "pendant":
      return <Pendant drop={p.y} />;
    case "brandWall":
      return <BrandWall w={p.w} d={p.d} />;
    case "wallDisplay":
      return <WallDisplay w={p.w} y={p.y} variant={p.variant} />;
    case "whiteboard":
      return <Whiteboard w={p.w} y={p.y} variant={p.variant} />;
    case "noticeBoard":
      return <NoticeBoard w={p.w} y={p.y} />;
    case "directoryBoard":
      return <DirectoryBoard rows={DIRECTORY_ROWS} y={p.y} />;
    case "artFrame":
      return <ArtFrame w={p.w} y={p.y} variant={p.variant} />;
    case "wallClock":
      return <WallClock y={p.y} />;
    case "acousticPanel":
      return <AcousticPanel w={p.w} y={p.y} />;
    case "firstAid":
      return <FirstAid y={p.y} />;
    case "extinguisher":
      return <Extinguisher y={p.y} />;
    case "exitSign":
      return <ExitSign y={p.y} />;
  }
}

export function PropMesh({ prop }: { prop: Prop }) {
  const inner = useMemo(() => render(prop), [prop]);
  // `y` is a height for wall items and a drop for pendants; for everything else it lifts the object (for example a plant on a table)
  const lift = WALL_KINDS.has(prop.kind) || prop.kind === "pendant" ? 0 : (prop.y ?? 0);
  return (
    <group position={[prop.x, lift, prop.z]} rotation={[0, prop.rot ?? 0, 0]}>
      {inner}
    </group>
  );
}
