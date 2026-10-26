import * as THREE from "three";

/**
 * Procedural surface textures, painted once on first use and shared by every material.
 * Nothing is downloaded, so there is nothing that can fail to load and no third-party licence to track.
 * Greyscale textures are tinted by the material colour; colour textures (art, screens, books) are used as drawn.
 */

type Paint = (g: CanvasRenderingContext2D, w: number, h: number, rnd: () => number) => void;

/** Small deterministic generator so every session paints identical textures. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const cache = new Map<string, THREE.CanvasTexture>();

function paint(key: string, w: number, h: number, draw: Paint, opts: { srgb?: boolean; seed?: number } = {}): THREE.CanvasTexture {
  const hit = cache.get(key);
  if (hit) return hit;
  // Unit tests import world modules in a DOM-less environment: hand back an empty texture there.
  if (typeof document === "undefined") return new THREE.CanvasTexture(null as unknown as HTMLCanvasElement);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const g = canvas.getContext("2d");
  if (g) draw(g, w, h, mulberry32(opts.seed ?? key.length * 7919));
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  t.colorSpace = opts.srgb === false ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  cache.set(key, t);
  return t;
}

const grey = (v: number, a = 1) => `rgba(${v},${v},${v},${a})`;

/** Speckle used by carpet, plaster-like and acoustic surfaces. */
function speckle(g: CanvasRenderingContext2D, w: number, h: number, rnd: () => number, count: number, lo: number, hi: number, alpha: number) {
  for (let i = 0; i < count; i++) {
    const v = Math.floor(lo + rnd() * (hi - lo));
    g.fillStyle = grey(v, alpha);
    g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 1.5, 1 + rnd() * 1.5);
  }
}

/** Oak-like grain running along the u axis. Greyscale, tinted by the material. */
export const woodGrain = () =>
  paint("wood-grain", 512, 512, (g, w, h, rnd) => {
    g.fillStyle = grey(226);
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 170; i++) {
      const y = rnd() * h;
      const amp = 2 + rnd() * 5;
      const freq = 0.004 + rnd() * 0.01;
      const phase = rnd() * 6.28;
      g.strokeStyle = grey(120 + Math.floor(rnd() * 90), 0.1 + rnd() * 0.22);
      g.lineWidth = 0.6 + rnd() * 2.2;
      g.beginPath();
      for (let x = 0; x <= w; x += 8) {
        const yy = y + Math.sin(x * freq * 6.28 + phase) * amp;
        if (x === 0) g.moveTo(x, yy);
        else g.lineTo(x, yy);
      }
      g.stroke();
    }
    // a few soft knots
    for (let k = 0; k < 3; k++) {
      const x = rnd() * w;
      const y = rnd() * h;
      const grad = g.createRadialGradient(x, y, 1, x, y, 16 + rnd() * 10);
      grad.addColorStop(0, grey(120, 0.35));
      grad.addColorStop(1, grey(120, 0));
      g.fillStyle = grad;
      g.fillRect(x - 40, y - 40, 80, 80);
    }
    speckle(g, w, h, rnd, 900, 150, 235, 0.25);
  });

/** Carpet tile weave: 2 x 2 tiles with slightly different tone and fine reveals. */
export const carpetTile = () =>
  paint("carpet-tile", 512, 512, (g, w, h, rnd) => {
    for (let ty = 0; ty < 2; ty++) {
      for (let tx = 0; tx < 2; tx++) {
        g.fillStyle = grey(222 + Math.floor(rnd() * 12));
        g.fillRect(tx * 256, ty * 256, 256, 256);
      }
    }
    speckle(g, w, h, rnd, 9000, 150, 255, 0.55);
    g.strokeStyle = grey(150, 0.22);
    g.lineWidth = 2;
    for (let i = 0; i <= 2; i++) {
      g.beginPath();
      g.moveTo(i * 256, 0);
      g.lineTo(i * 256, h);
      g.moveTo(0, i * 256);
      g.lineTo(w, i * 256);
      g.stroke();
    }
  });

/** Polished terrazzo slabs with flecks. */
export const terrazzo = () =>
  paint("terrazzo", 512, 512, (g, w, h, rnd) => {
    g.fillStyle = grey(238);
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 700; i++) {
      const v = 120 + Math.floor(rnd() * 120);
      g.fillStyle = grey(v, 0.28 + rnd() * 0.3);
      const x = rnd() * w;
      const y = rnd() * h;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + 2 + rnd() * 6, y + rnd() * 3);
      g.lineTo(x + rnd() * 5, y + 2 + rnd() * 6);
      g.closePath();
      g.fill();
    }
    g.strokeStyle = grey(150, 0.55);
    g.lineWidth = 2;
    g.strokeRect(0, 0, w, h);
    g.beginPath();
    g.moveTo(w / 2, 0);
    g.lineTo(w / 2, h);
    g.moveTo(0, h / 2);
    g.lineTo(w, h / 2);
    g.stroke();
  });

/** Large-format porcelain tile with grout and soft veining. */
export const porcelain = () =>
  paint("porcelain", 512, 512, (g, w, h, rnd) => {
    for (let ty = 0; ty < 2; ty++) {
      for (let tx = 0; tx < 2; tx++) {
        g.fillStyle = grey(232 + Math.floor(rnd() * 16));
        g.fillRect(tx * 256, ty * 256, 256, 256);
        g.strokeStyle = grey(160, 0.16);
        g.lineWidth = 1.5;
        for (let v = 0; v < 4; v++) {
          g.beginPath();
          const sx = tx * 256 + rnd() * 256;
          const sy = ty * 256;
          g.moveTo(sx, sy);
          g.bezierCurveTo(sx + 40, sy + 70, sx - 40, sy + 160, sx + rnd() * 60 - 30, sy + 256);
          g.stroke();
        }
      }
    }
    g.strokeStyle = grey(120, 0.8);
    g.lineWidth = 3;
    for (let i = 0; i <= 2; i++) {
      g.beginPath();
      g.moveTo(i * 256, 0);
      g.lineTo(i * 256, h);
      g.moveTo(0, i * 256);
      g.lineTo(w, i * 256);
      g.stroke();
    }
  });

/** Engineered oak planks, 8 per texture width, staggered joints. */
export const planks = () =>
  paint("planks", 512, 512, (g, w, h, rnd) => {
    const rows = 8;
    const rh = h / rows;
    for (let r = 0; r < rows; r++) {
      const split = rnd() * w;
      for (const [x0, x1] of [
        [0, split],
        [split, w],
      ] as const) {
        g.fillStyle = grey(206 + Math.floor(rnd() * 40));
        g.fillRect(x0, r * rh, x1 - x0, rh);
        g.strokeStyle = grey(110, 0.12);
        g.lineWidth = 1;
        for (let i = 0; i < 9; i++) {
          const y = r * rh + rnd() * rh;
          g.beginPath();
          g.moveTo(x0, y);
          g.lineTo(x1, y + (rnd() - 0.5) * 4);
          g.stroke();
        }
        g.strokeStyle = grey(70, 0.5);
        g.lineWidth = 1.5;
        g.strokeRect(x0, r * rh, x1 - x0, rh);
      }
    }
  });

/** Fine upholstery weave. */
export const fabricWeave = () =>
  paint("fabric-weave", 128, 128, (g, w, h, rnd) => {
    g.fillStyle = grey(236);
    g.fillRect(0, 0, w, h);
    g.strokeStyle = grey(190, 0.5);
    g.lineWidth = 1;
    for (let i = 0; i < w; i += 3) {
      g.beginPath();
      g.moveTo(i, 0);
      g.lineTo(i, h);
      g.stroke();
    }
    g.strokeStyle = grey(205, 0.45);
    for (let j = 0; j < h; j += 3) {
      g.beginPath();
      g.moveTo(0, j);
      g.lineTo(w, j);
      g.stroke();
    }
    speckle(g, w, h, rnd, 500, 170, 255, 0.5);
  });

/** Mineral-fibre ceiling tile with a recessed reveal. */
export const ceilingTile = () =>
  paint("ceiling-tile", 512, 512, (g, w, h, rnd) => {
    g.fillStyle = grey(248);
    g.fillRect(0, 0, w, h);
    speckle(g, w, h, rnd, 2600, 190, 235, 0.5);
    g.strokeStyle = grey(150, 0.7);
    g.lineWidth = 3;
    g.strokeRect(0, 0, w, h);
    g.strokeStyle = grey(255, 0.9);
    g.lineWidth = 1;
    g.strokeRect(3, 3, w - 6, h - 6);
  });

/** Painted wall: soft plaster mottling only, so large walls do not look like flat vector fills. */
export const plaster = () =>
  paint("plaster", 256, 256, (g, w, h, rnd) => {
    g.fillStyle = grey(250);
    g.fillRect(0, 0, w, h);
    speckle(g, w, h, rnd, 1800, 215, 255, 0.35);
  });

/** Radial falloff used for contact shadows under furniture. */
export const softShadow = () =>
  paint(
    "soft-shadow",
    128,
    128,
    (g, w, h) => {
      const grad = g.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w / 2);
      grad.addColorStop(0, "rgba(0,0,0,0.55)");
      grad.addColorStop(0.55, "rgba(0,0,0,0.22)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, w, h);
    },
    { srgb: false },
  );

/** Row of book spines. Abstract colour blocks, no readable titles. */
export const bookSpines = () =>
  paint("book-spines", 512, 128, (g, w, h, rnd) => {
    g.fillStyle = "#2a241e";
    g.fillRect(0, 0, w, h);
    const tones = ["#8a5a3c", "#c9b79c", "#3f4f5a", "#a07a4a", "#d9d2c3", "#5b3f2e", "#6d7a66", "#b5654a", "#2f3a41", "#9a8d7a"];
    let x = 2;
    while (x < w - 6) {
      const bw = 8 + rnd() * 16;
      const bh = h * (0.68 + rnd() * 0.3);
      g.fillStyle = tones[Math.floor(rnd() * tones.length)] as string;
      g.fillRect(x, h - bh, bw, bh);
      g.fillStyle = "rgba(0,0,0,0.25)";
      g.fillRect(x + bw - 2, h - bh, 2, bh);
      g.fillStyle = "rgba(255,255,255,0.35)";
      g.fillRect(x + 3, h - bh + 8, bw - 8, 3);
      x += bw + 1;
    }
  });

/** Abstract code editor: coloured strokes of varying length, no readable text. */
export const screenCode = () =>
  paint("screen-code", 320, 200, (g, w, h, rnd) => {
    g.fillStyle = "#10161c";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#1a232b";
    g.fillRect(0, 0, 44, h);
    const tones = ["#7fb8d6", "#d9a15c", "#9bc28a", "#c2c8cc", "#c98aa6"];
    let indent = 0;
    for (let y = 12; y < h - 6; y += 10) {
      if (rnd() < 0.3) indent = Math.max(0, Math.min(3, indent + (rnd() < 0.5 ? -1 : 1)));
      let x = 54 + indent * 14;
      const segs = 1 + Math.floor(rnd() * 4);
      for (let s = 0; s < segs; s++) {
        const len = 14 + rnd() * 50;
        g.fillStyle = tones[Math.floor(rnd() * tones.length)] as string;
        g.fillRect(x, y, len, 4);
        x += len + 6;
      }
    }
  }, { seed: 11 });

/** Abstract analytics dashboard in warm neutrals. */
export const screenDashboard = () =>
  paint("screen-dashboard", 320, 200, (g, w, h, rnd) => {
    g.fillStyle = "#f1ede5";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#3b3631";
    g.fillRect(0, 0, w, 18);
    for (let i = 0; i < 3; i++) {
      g.fillStyle = "#fffdf8";
      g.fillRect(12 + i * 100, 28, 90, 40);
      g.fillStyle = ["#b5754a", "#4f6d73", "#8a7f6e"][i] as string;
      g.fillRect(20 + i * 100, 40, 40, 6);
      g.fillRect(20 + i * 100, 52, 24, 4);
    }
    g.fillStyle = "#fffdf8";
    g.fillRect(12, 78, 190, 110);
    for (let i = 0; i < 9; i++) {
      const bh = 20 + rnd() * 70;
      g.fillStyle = i % 3 === 0 ? "#b5754a" : "#4f6d73";
      g.fillRect(24 + i * 19, 178 - bh, 12, bh);
    }
    g.fillStyle = "#fffdf8";
    g.fillRect(212, 78, 96, 110);
    g.strokeStyle = "#b5754a";
    g.lineWidth = 6;
    g.beginPath();
    g.arc(260, 133, 28, 0, 4.2);
    g.stroke();
  }, { seed: 23 });

/** Abstract document / spreadsheet window. */
export const screenDocument = () =>
  paint("screen-document", 320, 200, (g, w, h, rnd) => {
    g.fillStyle = "#e9e6df";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#fffefb";
    g.fillRect(60, 8, 200, h - 8);
    g.fillStyle = "#cfc7b8";
    g.fillRect(74, 22, 90, 8);
    for (let y = 42; y < h - 10; y += 9) {
      g.fillStyle = "#d9d3c7";
      g.fillRect(74, y, 80 + rnd() * 100, 4);
    }
  }, { seed: 31 });

/** Calm brand-neutral wallpaper for displays that are idle. */
export const screenWelcome = () =>
  paint("screen-welcome", 320, 200, (g, w, h) => {
    const grad = g.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#2b2f33");
    grad.addColorStop(1, "#4a4038");
    g.fillStyle = grad;
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#cfa65c";
    g.fillRect(w / 2 - 70, h / 2 - 18, 4, 36);
    g.fillStyle = "#efe9de";
    g.fillRect(w / 2 - 58, h / 2 - 14, 120, 10);
    g.fillStyle = "#a9a193";
    g.fillRect(w / 2 - 58, h / 2 + 4, 84, 6);
  });

/** Abstract canvases in the office palette. Original compositions. */
export const artwork = (n: 1 | 2 | 3) =>
  paint(`art-${n}`, 256, 320, (g, w, h) => {
    g.fillStyle = ["#e8dfd0", "#d8d0c2", "#ece6da"][n - 1] as string;
    g.fillRect(0, 0, w, h);
    if (n === 1) {
      g.fillStyle = "#b5654a";
      g.beginPath();
      g.arc(128, 130, 70, 0, 6.3);
      g.fill();
      g.fillStyle = "#2f3a41";
      g.fillRect(40, 220, 176, 18);
      g.fillStyle = "#cfa65c";
      g.fillRect(40, 248, 110, 10);
    } else if (n === 2) {
      for (let i = 0; i < 6; i++) {
        g.fillStyle = ["#3f4f5a", "#a07a4a", "#c9b79c", "#8a5a3c", "#6d7a66", "#2f3a41"][i] as string;
        g.fillRect(24 + i * 36, 40 + (i % 3) * 22, 28, 200 - (i % 3) * 30);
      }
    } else {
      g.strokeStyle = "#8a5a3c";
      g.lineWidth = 14;
      g.beginPath();
      g.arc(128, 170, 90, Math.PI, 0);
      g.stroke();
      g.strokeStyle = "#2f3a41";
      g.lineWidth = 8;
      g.beginPath();
      g.arc(128, 170, 58, Math.PI, 0);
      g.stroke();
      g.fillStyle = "#cfa65c";
      g.fillRect(100, 188, 56, 56);
    }
  });

/** Generic labelled sign: a text label on a coloured plate. */
export function labelTexture(key: string, text: string, fg: string, bg: string): THREE.CanvasTexture {
  return paint(`label-${key}`, 256, 96, (g, w, h) => {
    g.fillStyle = bg;
    g.fillRect(0, 0, w, h);
    g.fillStyle = fg;
    g.font = "700 54px 'Familjen Grotesk', 'Trebuchet MS', sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(text, w / 2, h / 2 + 3);
  });
}

/** Vertical oak slats with dark reveals, used on the reception desk front and feature walls. */
export const woodSlats = () =>
  paint("wood-slats", 256, 256, (g, w, h, rnd) => {
    g.fillStyle = grey(40);
    g.fillRect(0, 0, w, h);
    const slat = 32;
    for (let x = 0; x < w; x += slat) {
      g.fillStyle = grey(205 + Math.floor(rnd() * 40));
      g.fillRect(x + 3, 0, slat - 6, h);
      g.strokeStyle = grey(110, 0.2);
      g.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const gx = x + 5 + rnd() * (slat - 10);
        g.beginPath();
        g.moveTo(gx, 0);
        g.lineTo(gx + (rnd() - 0.5) * 3, h);
        g.stroke();
      }
    }
  });

/** Cork pin board with a few pinned sheets. */
export const corkBoard = () =>
  paint("cork-board", 256, 192, (g, w, h, rnd) => {
    g.fillStyle = "#b98d60";
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 1400; i++) {
      g.fillStyle = rnd() < 0.5 ? "rgba(120,80,45,0.45)" : "rgba(235,200,150,0.4)";
      g.fillRect(rnd() * w, rnd() * h, 1.5, 1.5);
    }
    const sheets = [
      [18, 18, 70, 90, "#f6f2e8"],
      [104, 30, 60, 70, "#e3d6bd"],
      [176, 16, 64, 96, "#f6f2e8"],
      [40, 118, 80, 54, "#d6dde0"],
      [140, 124, 76, 50, "#f6f2e8"],
    ] as const;
    for (const [x, y, sw, sh, c] of sheets) {
      g.fillStyle = "rgba(0,0,0,0.18)";
      g.fillRect(x + 2, y + 3, sw, sh);
      g.fillStyle = c;
      g.fillRect(x, y, sw, sh);
      g.fillStyle = "#c9c2b2";
      for (let ly = y + 12; ly < y + sh - 6; ly += 9) g.fillRect(x + 8, ly, sw - 16 - rnd() * 18, 3);
      g.fillStyle = "#a3402f";
      g.beginPath();
      g.arc(x + sw / 2, y + 5, 3, 0, 6.3);
      g.fill();
    }
  });

/** Whiteboard with abstract diagram strokes. No readable text. */
export const whiteboardNotes = () =>
  paint("whiteboard-notes", 384, 192, (g, w, h) => {
    g.fillStyle = "#fbfbf8";
    g.fillRect(0, 0, w, h);
    g.lineWidth = 3;
    g.strokeStyle = "#2f5d8a";
    g.strokeRect(24, 28, 90, 48);
    g.strokeRect(150, 28, 90, 48);
    g.strokeRect(276, 28, 90, 48);
    g.strokeStyle = "#3a3a3a";
    g.beginPath();
    g.moveTo(114, 52);
    g.lineTo(150, 52);
    g.moveTo(240, 52);
    g.lineTo(276, 52);
    g.moveTo(195, 76);
    g.lineTo(195, 120);
    g.stroke();
    g.strokeStyle = "#b5443a";
    g.beginPath();
    g.ellipse(195, 140, 60, 26, 0, 0, 6.3);
    g.stroke();
    g.strokeStyle = "#2c7a4b";
    for (let i = 0; i < 4; i++) {
      g.beginPath();
      g.moveTo(40, 110 + i * 16);
      g.lineTo(100 + i * 12, 110 + i * 16);
      g.stroke();
    }
  });

/** Round wall clock face, ticks only. */
export const clockFace = () =>
  paint("clock-face", 128, 128, (g, w, h) => {
    g.fillStyle = "#f7f4ec";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#1d1f21";
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const r0 = i % 3 === 0 ? 46 : 52;
      g.save();
      g.translate(w / 2, h / 2);
      g.rotate(a);
      g.fillRect(-1.5, -58, 3, 58 - r0 + 4);
      g.restore();
    }
  });

/** Wayfinding board. Lists only rooms that exist in the project. */
export function directoryTexture(rows: string[]): THREE.CanvasTexture {
  return paint(`directory-${rows.join("|")}`, 512, 640, (g, w, h) => {
    g.fillStyle = "#2b2e31";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#cfa65c";
    g.fillRect(28, 28, 6, 70);
    g.fillStyle = "#f2efe8";
    g.font = "700 46px 'Familjen Grotesk', 'Trebuchet MS', sans-serif";
    g.textBaseline = "middle";
    g.textAlign = "left";
    g.fillText("Directory", 52, 62);
    const rowH = (h - 150) / rows.length;
    rows.forEach((r, i) => {
      const y = 126 + i * rowH + rowH / 2;
      g.fillStyle = "rgba(255,255,255,0.08)";
      g.fillRect(28, y - rowH / 2 + 4, w - 56, rowH - 8);
      g.fillStyle = "#f2efe8";
      g.font = "500 34px 'Instrument Sans', 'Trebuchet MS', sans-serif";
      g.textAlign = "left";
      g.fillText(r, 72, y);
      g.fillStyle = "#cfa65c";
      g.beginPath();
      g.arc(52, y, 6, 0, 6.3);
      g.fill();
    });
  });
}
