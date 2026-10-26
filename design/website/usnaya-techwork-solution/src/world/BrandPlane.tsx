import { useEffect, useState } from "react";
import * as THREE from "three";
import { palette } from "./palette";

let cached: THREE.CanvasTexture | null = null;
let pending: Promise<THREE.CanvasTexture | null> | null = null;

/** Draws "USNAYA Techworks Solutions" once and shares the texture between every sign. */
function loadBrandTexture(): Promise<THREE.CanvasTexture | null> {
  if (cached) return Promise.resolve(cached);
  if (pending) return pending;
  const draw = (): THREE.CanvasTexture | null => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 192;
    const g = c.getContext("2d");
    if (!g) return null;
    g.fillStyle = palette.ink;
    g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = palette.brass;
    g.fillRect(40, 40, 8, 112);
    g.fillStyle = "#f2efe8";
    g.font = "700 64px 'Familjen Grotesk', 'Trebuchet MS', sans-serif";
    g.textBaseline = "middle";
    g.fillText("USNAYA", 76, 76);
    g.font = "400 38px 'Instrument Sans', 'Trebuchet MS', sans-serif";
    g.fillStyle = "#b9c7c4";
    g.fillText("Techworks Solutions", 76, 134);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    cached = t;
    return t;
  };
  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
  pending = fonts
    ? Promise.all([fonts.load("700 64px 'Familjen Grotesk'"), fonts.load("400 38px 'Instrument Sans'")]).then(draw, draw)
    : Promise.resolve(draw());
  return pending;
}

type Props = { position: [number, number, number]; size: [number, number]; rotationY?: number };

/** Company sign. Uses the same wording everywhere. No logo file exists in the project, so this is a text sign, not a logo. */
export function BrandPlane({ position, size, rotationY = 0 }: Props) {
  const [tex, setTex] = useState<THREE.CanvasTexture | null>(cached);
  useEffect(() => {
    let alive = true;
    void loadBrandTexture().then((t) => alive && setTex(t));
    return () => {
      alive = false;
    };
  }, []);
  if (!tex) return null;
  return (
    <mesh position={position} rotation={[0, rotationY, 0]}>
      <planeGeometry args={size} />
      <meshStandardMaterial map={tex} roughness={0.6} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={0.25} />
    </mesh>
  );
}
