import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
const resolutionExtensions = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json"];
const indexNames = ["index.ts", "index.tsx", "index.js", "index.mjs"];
const ignored = new Set(["node_modules", ".next", ".turbo", "dist", "build", "out"]);
const importPattern = /(?:from\s+|import\s*\(|require\s*\()\s*["']([^"']+)["']/g;
const failures = [];
let checked = 0;

async function files(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await files(absolute));
    else if (sourceExtensions.has(path.extname(entry.name))) output.push(absolute);
  }
  return output;
}

function candidateBase(file, specifier) {
  if (specifier.startsWith("@/")) {
    const marker = `${path.sep}apps${path.sep}frontend${path.sep}`;
    const position = file.indexOf(marker);
    if (position < 0) return null;
    return path.join(file.slice(0, position + marker.length), specifier.slice(2));
  }
  if (specifier.startsWith("@backend/")) return path.join(root, "apps/backend/src", specifier.slice("@backend/".length));
  if (specifier.startsWith(".")) return path.resolve(path.dirname(file), specifier);
  return null;
}

function resolves(base) {
  const candidates = [
    base,
    ...resolutionExtensions.map((extension) => `${base}${extension}`),
    ...indexNames.map((name) => path.join(base, name)),
  ];
  return candidates.some((candidate) => existsSync(candidate));
}

for (const file of await files(root)) {
  const source = await readFile(file, "utf8");
  for (const match of source.matchAll(importPattern)) {
    const specifier = match[1];
    const base = candidateBase(file, specifier);
    if (!base) continue;
    checked += 1;
    if (!resolves(base)) failures.push(`${path.relative(root, file)} -> ${specifier}`);
  }
}

if (failures.length) throw new Error(`Unresolved internal imports (${failures.length}):\n${failures.join("\n")}`);
console.log(`Internal import audit passed (${checked} relative/frontend/backend alias imports).`);
