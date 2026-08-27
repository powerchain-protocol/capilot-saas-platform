import fs from "node:fs";
import path from "node:path";
import { appRoot, frontendRoot } from "./paths.mjs";

const ignored = new Set(["node_modules", ".next", ".turbo", ".git"]);
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) return ignored.has(entry.name) ? [] : walk(path.join(dir, entry.name));
    return [path.join(dir, entry.name)];
  });
}
function urlRouteFromPage(file) {
  const relative = path.relative(appRoot, path.dirname(file)).split(path.sep).filter(Boolean);
  const visible = relative.filter((segment) => !(segment.startsWith("(") && segment.endsWith(")")));
  return visible.length ? `/${visible.join("/")}` : "/";
}
const pages = walk(appRoot).filter((file) => file.endsWith("page.tsx"));
const routes = new Set(pages.map(urlRouteFromPage));
const source = walk(frontendRoot).filter((file) => /\.(tsx|ts)$/.test(file));
const links = new Set();
for (const file of source) {
  const text = fs.readFileSync(file, "utf8");
  for (const re of [/href\s*=\s*["'](\/[^"']*?)["']/g, /href\s*:\s*["'](\/[^"']*?)["']/g]) {
    let match;
    while ((match = re.exec(text))) {
      const clean = match[1].split(/[?#]/)[0] || "/";
      if (!clean.startsWith("/api/") && !clean.startsWith("/ws/")) links.add(clean);
    }
  }
}
const missing = [...links].filter((route) => !routes.has(route) && !route.includes("["));
console.log(`Detected ${routes.size} page routes and ${links.size} literal internal links.`);
if (missing.length) {
  console.error("Missing page routes:", missing);
  process.exit(1);
}
console.log("Internal literal route audit passed: no dead page links detected.");
