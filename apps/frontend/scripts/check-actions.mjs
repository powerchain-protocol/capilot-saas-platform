import fs from "node:fs";
import path from "node:path";
import { frontendRoot } from "./paths.mjs";

const ignored = new Set(["node_modules", ".next", ".git", ".turbo"]);
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) return ignored.has(entry.name) ? [] : walk(path.join(dir, entry.name));
    return [path.join(dir, entry.name)];
  });
}
const source = walk(frontendRoot).filter((file) => /\.(tsx|ts)$/.test(file));
const problems = [];
for (const file of source) {
  const text = fs.readFileSync(file, "utf8");
  if (/href\s*=\s*["'](?:#|javascript:|\s*)["']/.test(text)) problems.push(`${file}: placeholder href`);
  if (/onClick\s*=\s*\{\s*\(\s*\)\s*=>\s*\{?\s*\}?\s*\}/.test(text)) problems.push(`${file}: empty onClick`);
  if (/TODO:\s*(?:wire|implement|button|action)/i.test(text)) problems.push(`${file}: unwired TODO action`);
}
if (problems.length) {
  console.error("Interactive action audit failed:\n" + problems.join("\n"));
  process.exit(1);
}
console.log(`Interactive action audit passed across ${source.length} TypeScript/TSX files.`);
