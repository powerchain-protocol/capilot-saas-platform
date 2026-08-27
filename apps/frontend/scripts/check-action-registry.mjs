import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const registryPath = path.resolve(root, "../dashboard/actions.json");
const appRoot = path.join(root, "app");
const registry = JSON.parse(await fs.readFile(registryPath, "utf8"));

async function walk(directory) {
  const output = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await walk(absolute));
    else if (entry.name === "page.tsx") output.push(absolute);
  }
  return output;
}
function routeFromPage(file) {
  const segments = path.relative(appRoot, path.dirname(file)).split(path.sep).filter(Boolean).filter((segment) => !(segment.startsWith("(") && segment.endsWith(")")));
  return segments.length ? `/${segments.join("/")}` : "/";
}
const routes = new Set((await walk(appRoot)).map(routeFromPage));

if (registry.version !== "1.0.0" || !Array.isArray(registry.actions)) {
  console.error("Dashboard action registry must use canonical version 1.0.0 and contain an actions array.");
  process.exit(1);
}
const problems = [];
const ids = new Set();
for (const action of registry.actions) {
  if (!action || typeof action !== "object") { problems.push("Invalid action entry"); continue; }
  if (typeof action.id !== "string" || !action.id) problems.push("Action missing id");
  else if (ids.has(action.id)) problems.push(`Duplicate action id: ${action.id}`);
  else ids.add(action.id);
  if (typeof action.route !== "string" || !action.route.startsWith("/")) problems.push(`${action.id ?? "unknown"}: invalid route`);
  else if (!routes.has(action.route)) problems.push(`${action.id ?? "unknown"}: route has no page (${action.route})`);
  if (action.risk === "high" && action.requiresApproval !== true) problems.push(`${action.id ?? "unknown"}: high-risk actions must require approval`);
}
if (problems.length) { console.error("Action registry audit failed:\n" + problems.map((problem) => `- ${problem}`).join("\n")); process.exit(1); }
console.log(`Action registry audit passed (${registry.actions.length} actions).`);
