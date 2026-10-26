// Inserts the server-rendered app into dist/index.html so the served HTML
// already contains the real content, landmarks, headings and alt text.
// The client bundle (createRoot) replaces it as soon as JavaScript loads.
import { readFile, writeFile, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const page = resolve("dist/index.html");
const entry = resolve("dist-server/entry-server.js");

const { render } = await import(pathToFileURL(entry).href);
const html = await readFile(page, "utf8");
const marker = '<div id="root"></div>';
if (!html.includes(marker)) throw new Error(`prerender: ${marker} not found in dist/index.html`);

// Function replacement: the markup may contain "$" sequences.
await writeFile(page, html.replace(marker, () => `<div id="root">${render()}</div>`));
await rm(resolve("dist-server"), { recursive: true, force: true });
console.log("prerendered dist/index.html");
