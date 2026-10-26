// Minimal static server that serves public/ the way Next.js (next start / Vercel) will:
//   - a trailing slash is redirected away        /design-projects/auth/x/  ->  /design-projects/auth/x
//   - the clean project URL is rewritten         /design-projects/auth/x   ->  .../x/index.html
//     (mirrors the `rewrites()` entry in next.config.mjs)
// Used by the screenshot script so previews are captured from the real built output.

import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".ico": "image/x-icon", ".woff2": "font/woff2", ".woff": "font/woff",
  ".txt": "text/plain; charset=utf-8", ".mp4": "video/mp4",
};

export function startStaticServer(publicDir, { extraHeaders = {}, root = "/design-projects" } = {}) {
  const server = createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    let pathname = decodeURIComponent(url.pathname);

    if (pathname.length > 1 && pathname.endsWith("/")) {
      res.writeHead(308, { Location: pathname.slice(0, -1) + url.search });
      return res.end();
    }
    const segs = pathname.split("/").filter(Boolean);
    if (pathname.startsWith(root + "/") && segs.length === 3) pathname += "/index.html";

    const file = path.join(publicDir, pathname);
    if (!file.startsWith(publicDir) || !existsSync(file) || !statSync(file).isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("404 " + pathname);
    }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream", ...extraHeaders });
    res.end(readFileSync(file));
  });
  return new Promise((resolve) =>
    server.listen(0, "127.0.0.1", () =>
      resolve({ origin: `http://127.0.0.1:${server.address().port}`, close: () => new Promise((r) => server.close(r)) })));
}
