import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const spec = JSON.parse(await readFile(path.join(root, "api/openapi/openapi.json"), "utf8"));
const collection = JSON.parse(await readFile(path.join(root, "api/postman/PowerChain-Copilot.postman_collection.json"), "utf8"));
const remote = JSON.parse(await readFile(path.join(root, "api/postman/remote.json"), "utf8"));
const postmanIndex = await readFile(path.join(root, "api/postman/index.yaml"), "utf8");
const methods = new Set(["get", "post", "put", "patch", "delete", "options", "head"]);

for (const [label, value] of [
  ["Postman workspace ID", remote.workspace?.id],
  ["Postman dataset ID", remote.dataset?.id],
  ["Postman specification ID", remote.specification?.id],
  ["Postman specification file ID", remote.specification?.fileId]
]) {
  if (typeof value !== "string" || !/^[0-9a-f-]{36}$/i.test(value)) throw new Error(`${label} is missing or invalid in api/postman/remote.json.`);
}
if (!String(remote.dataset?.url ?? "").includes(remote.dataset.id)) throw new Error("Postman dataset URL must contain the configured dataset ID.");
if (!String(remote.specification?.url ?? "").includes(remote.specification.id) || !String(remote.specification?.url ?? "").includes(remote.specification.fileId)) {
  throw new Error("Postman specification URL must contain the configured specification and file IDs.");
}

const canonicalPostmanSpecUrl = "https://crimson-crescent-8585.postman.co/workspace/55a50a8b-cdb7-46f5-807e-3494d0262565/specification/1e9bfbeb-cf59-4af3-a51f-25dce5bbe9c9/file/cc65a18c-43aa-41b0-8fee-bf8f6f18ebea";
if (remote.specification?.url !== canonicalPostmanSpecUrl) {
  throw new Error("api/postman/remote.json must use the canonical PowerChain Postman specification URL.");
}
for (const required of [remote.workspace.id, remote.dataset.id, remote.specification.id, remote.specification.fileId, canonicalPostmanSpecUrl, "api/openapi/openapi.yaml"]) {
  if (!postmanIndex.includes(required)) throw new Error(`api/postman/index.yaml is missing canonical Postman value: ${required}`);
}

const scheme = spec.components?.securitySchemes?.ApiKey;
if (scheme?.type !== "apiKey" || scheme?.in !== "header" || scheme?.name !== "X-Api-Key") {
  throw new Error("OpenAPI ApiKey scheme must use X-Api-Key header authentication.");
}
if (!Array.isArray(spec.security) || !spec.security.some((entry) => entry && typeof entry === "object" && "ApiKey" in entry)) {
  throw new Error("OpenAPI must apply the ApiKey security scheme globally.");
}

const operations = [];
const operationIds = new Set();
for (const [route, pathItem] of Object.entries(spec.paths ?? {})) {
  if (!route.startsWith("/v1/") || !pathItem || typeof pathItem !== "object") continue;
  for (const [method, operation] of Object.entries(pathItem)) {
    if (!methods.has(method) || !operation || typeof operation !== "object") continue;
    const operationId = operation.operationId;
    if (typeof operationId !== "string" || !operationId) throw new Error(`${method.toUpperCase()} ${route} is missing operationId.`);
    if (operationIds.has(operationId)) throw new Error(`Duplicate OpenAPI operationId: ${operationId}`);
    operationIds.add(operationId);
    operations.push({ method: method.toUpperCase(), route });
  }
}

const requests = [];
function walk(items) {
  for (const item of items ?? []) {
    if (Array.isArray(item.item)) walk(item.item);
    const request = item.request;
    if (!request || typeof request !== "object") continue;
    const method = String(request.method ?? "GET").toUpperCase();
    const raw = typeof request.url === "string" ? request.url : request.url?.raw;
    if (typeof raw !== "string") continue;
    let route = raw.replace(/^\{\{baseUrl\}\}/, "").split(/[?#]/)[0];
    route = route.replace(/:[A-Za-z][A-Za-z0-9_]*/g, "{id}");
    requests.push({ method, route, name: item.name });
  }
}
walk(collection.item);

function templateMatch(expected, actual) {
  const pattern = `^${expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\{[^}]+\\\}/g, "[^/]+")}$`;
  return new RegExp(pattern).test(actual);
}
const missing = operations.filter((operation) => !requests.some((request) => request.method === operation.method && templateMatch(operation.route, request.route)));
if (missing.length) {
  throw new Error(`Postman is missing ${missing.length} OpenAPI operation(s):\n${missing.map((item) => `- ${item.method} ${item.route}`).join("\n")}`);
}

const serverUrls = new Set((spec.servers ?? []).map((server) => server.url));
for (const required of ["https://api.capilot.powerchain.energy", "https://capilot.powerchain.app"]) {
  if (!serverUrls.has(required)) throw new Error(`OpenAPI servers must include ${required}.`);
}

console.log(`API DX audit passed (${operations.length} HTTP operations, ${requests.length} Postman requests, ${operationIds.size} unique operationIds, remote Postman workspace linked).`);
