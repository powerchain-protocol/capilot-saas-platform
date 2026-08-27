import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const sourceRoot = root;
const publicRoot = path.join(root, "public");

async function walk(directory) {
  const output = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (["node_modules", ".next", ".turbo", "public"].includes(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await walk(absolute));
    else if (/\.(ts|tsx|css)$/.test(entry.name)) output.push(absolute);
  }
  return output;
}

const refs = new Set();
for (const file of await walk(sourceRoot)) {
  const text = await fs.readFile(file, "utf8");
  const matches = text.matchAll(/["'`](\/(?:icons|images|apple-icon|favicon|openapi)[^"'`?#]*)["'`]/g);
  for (const match of matches) refs.add(match[1]);
}

const missing = [];
for (const ref of refs) {
  const relative = ref === "/favicon.ico" ? "favicon.ico" : ref.slice(1);
  try { await fs.access(path.join(publicRoot, relative)); }
  catch { missing.push(ref); }
}

if (missing.length) {
  console.error("Missing public assets:\n" + missing.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log(`Public asset audit passed (${refs.size} literal asset references).`);
