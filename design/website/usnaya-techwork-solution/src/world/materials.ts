import * as THREE from "three";
import type { FloorFinish } from "../data/types";
import { palette } from "./palette";
import * as tex from "./textures";

/** Metres of surface covered by one repeat of a texture. Boxes and floors scale their UVs from it. */
type Tiled = THREE.MeshStandardMaterial & { userData: { tile?: number } };

function std(color: string, rough: number, metal = 0, map?: THREE.Texture, tile?: number, bump = 0): Tiled {
  const m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal }) as Tiled;
  if (map) {
    m.map = map;
    if (bump) {
      m.bumpMap = map;
      m.bumpScale = bump;
    }
  }
  if (tile) m.userData.tile = tile;
  return m;
}

/** A display that emits its own picture. */
function display(map: THREE.Texture, intensity = 0.7) {
  return new THREE.MeshStandardMaterial({ color: "#0c0f12", map, emissive: "#ffffff", emissiveMap: map, emissiveIntensity: intensity, roughness: 0.18, metalness: 0.2 });
}

function createMaterials() {
  const grain = tex.woodGrain();
  const weave = tex.fabricWeave();
  return {
    // wood: one grain texture, three tints
    woodOak: std("#c49a68", 0.42, 0, grain, 1.2),
    woodLight: std("#e0c49b", 0.5, 0, grain, 1.2),
    woodWalnut: std("#7a5535", 0.38, 0, grain, 1.2),

    // metals
    metalCharcoal: std("#2a2d30", 0.4, 0.55),
    metalBrushed: std(palette.metalLight, 0.32, 0.7),
    metalChrome: std(palette.chrome, 0.2, 0.85),
    brass: std(palette.brass, 0.28, 0.8),
    cable: std("#17191b", 0.8),

    // upholstery
    fabricAcoustic: std(palette.fabricAcoustic, 0.95, 0, weave, 0.3),
    fabricCharcoal: std(palette.fabric, 0.9, 0, weave, 0.3),
    fabricTaupe: std(palette.fabricWarm, 0.9, 0, weave, 0.3),
    fabricSand: std("#bfae94", 0.92, 0, weave, 0.3),
    fabricMoss: std(palette.fabricMoss, 0.92, 0, weave, 0.3),
    leatherBlack: std(palette.leather, 0.4),
    leatherWarm: std(palette.leatherWarm, 0.45),
    felt: std("#cfc8bb", 0.97, 0, weave, 0.3),

    // plants and ceramics
    leaf: std(palette.leaf, 0.65),
    leafLight: std(palette.leafLight, 0.6),
    stem: std("#3f553a", 0.75),
    soil: std("#261e17", 0.95),
    pot: std(palette.pot, 0.52),
    potDark: std(palette.potDark, 0.4),
    ceramic: std("#f3f0ea", 0.3),

    // surfaces
    quartzWhite: std(palette.wallSolid, 0.25),
    paintWhite: std("#f4f1ea", 0.7),
    paperWhite: std("#fbfaf6", 0.55),
    rugWool: std("#7b6c58", 0.98, 0, weave, 0.35, 0.6),
    rugWoolInner: std("#8f806b", 0.98, 0, weave, 0.35, 0.6),
    rugSlateInner: std("#656d77", 0.98, 0, weave, 0.35, 0.6),
    rugSlate: std("#4a525c", 0.98, 0, weave, 0.35, 0.6),
    books: new THREE.MeshStandardMaterial({ map: tex.bookSpines(), roughness: 0.8 }),
    glassClear: new THREE.MeshPhysicalMaterial({ color: palette.glass, transparent: true, opacity: 0.3, roughness: 0.05, metalness: 0.1, depthWrite: false }),
    glassBottle: new THREE.MeshStandardMaterial({ color: "#54b2d6", transparent: true, opacity: 0.6, roughness: 0.1 }),

    // displays
    screenOff: new THREE.MeshStandardMaterial({ color: palette.screen, roughness: 0.1, metalness: 0.5 }),
    screenCode: display(tex.screenCode(), 0.75),
    screenDashboard: display(tex.screenDashboard(), 0.55),
    screenDocument: display(tex.screenDocument(), 0.55),
    screenWelcome: display(tex.screenWelcome(), 0.8),

    splash: std("#efe9de", 0.3, 0, tex.porcelain(), 0.6),
    woodSlats: std("#c49a68", 0.45, 0, tex.woodSlats(), 0.5),
    cork: new THREE.MeshStandardMaterial({ map: tex.corkBoard(), roughness: 0.9 }),
    whiteboard: new THREE.MeshStandardMaterial({ color: "#fbfbf8", roughness: 0.25 }),
    whiteboardNotes: new THREE.MeshStandardMaterial({ map: tex.whiteboardNotes(), roughness: 0.25 }),
    clockFace: new THREE.MeshStandardMaterial({ map: tex.clockFace(), roughness: 0.4 }),
    binGrey: std("#6c7176", 0.5),
    binBlue: std("#46667f", 0.5),
    binGreen: std("#547a5a", 0.5),

    // artwork
    art1: new THREE.MeshStandardMaterial({ map: tex.artwork(1), roughness: 0.8 }),
    art2: new THREE.MeshStandardMaterial({ map: tex.artwork(2), roughness: 0.8 }),
    art3: new THREE.MeshStandardMaterial({ map: tex.artwork(3), roughness: 0.8 }),

    // lights and indicators
    ledGreen: new THREE.MeshStandardMaterial({ color: palette.ledGreen, emissive: palette.ledGreen, emissiveIntensity: 1.8 }),
    ledAmber: new THREE.MeshStandardMaterial({ color: palette.ledAmber, emissive: palette.ledAmber, emissiveIntensity: 1.8 }),
    ledBlue: new THREE.MeshStandardMaterial({ color: palette.ledBlue, emissive: palette.ledBlue, emissiveIntensity: 1.8 }),
    lampWarm: new THREE.MeshStandardMaterial({ color: "#fff3db", emissive: "#ffd896", emissiveIntensity: 1.4 }),
    redExtinguisher: std("#b93026", 0.35, 0.1),
    exitGreen: new THREE.MeshStandardMaterial({ map: tex.labelTexture("exit", "EXIT", "#ffffff", "#1f8a52"), emissive: "#ffffff", emissiveIntensity: 0.55 }),
  };
}

export const M = createMaterials();

/** Floor finishes. Each is tinted per room through `floorMaterial(finish, tint)`. */
const floorBase: Record<FloorFinish, { map: () => THREE.Texture; tile: number; rough: number; bump: number }> = {
  carpet: { map: tex.carpetTile, tile: 1.0, rough: 0.97, bump: 0.5 },
  stone: { map: tex.terrazzo, tile: 1.2, rough: 0.32, bump: 0 },
  tile: { map: tex.porcelain, tile: 1.2, rough: 0.28, bump: 0 },
  wood: { map: tex.planks, tile: 1.2, rough: 0.5, bump: 0.3 },
};
const floorCache = new Map<string, Tiled>();

export function floorMaterial(finish: FloorFinish, tint: string): Tiled {
  const key = `${finish}:${tint}`;
  let m = floorCache.get(key);
  if (!m) {
    const f = floorBase[finish];
    m = std(tint, f.rough, 0, f.map(), f.tile, f.bump);
    floorCache.set(key, m);
  }
  return m;
}

const ceilingMaterial = std("#f3efe7", 0.9, 0, tex.ceilingTile(), 0.6);
// lit by the room, not by the sun: a little self-illumination stands in for bounced light
ceilingMaterial.emissive = new THREE.Color("#e9e1d3");
ceilingMaterial.emissiveIntensity = 0.55;
ceilingMaterial.emissiveMap = tex.ceilingTile();
ceilingMaterial.side = THREE.FrontSide;
export { ceilingMaterial };
export const plasterMaterial = std(palette.wallSolid, 0.82, 0, tex.plaster(), 2.4);
