import { readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(root, "api/postman/remote.json");
const config = JSON.parse(await readFile(configPath, "utf8"));
const command = process.argv[2] ?? "info";
const apiKey = process.env.POSTMAN_API_KEY?.trim();
const postmanApi = "https://api.postman.com";

function requiredString(value, name) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Missing ${name} in api/postman/remote.json`);
  }
  return value.trim();
}

function validateConfig() {
  requiredString(config.workspace?.id, "workspace.id");
  requiredString(config.dataset?.id, "dataset.id");
  requiredString(config.dataset?.url, "dataset.url");
  requiredString(config.specification?.id, "specification.id");
  requiredString(config.specification?.fileId, "specification.fileId");
  requiredString(config.specification?.url, "specification.url");
  requiredString(config.repository?.openapi, "repository.openapi");
  requiredString(config.repository?.collection, "repository.collection");
}

function requireApiKey() {
  if (!apiKey) {
    throw new Error("POSTMAN_API_KEY is required for this command. Keep it in your shell/CI secret store; never commit it.");
  }
}

async function postmanFetch(url, init = {}) {
  requireApiKey();
  const headers = new Headers(init.headers ?? {});
  headers.set("X-API-Key", apiKey);
  headers.set("Accept", "application/json");
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const response = await fetch(url, { ...init, headers, redirect: "follow" });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Postman API ${response.status} ${response.statusText}: ${text.slice(0, 600)}`);
  }
  return text ? JSON.parse(text) : null;
}

async function resolveRemoteFile() {
  const specId = encodeURIComponent(config.specification.id);
  const result = await postmanFetch(`${postmanApi}/specs/${specId}/files`);
  const files = Array.isArray(result?.files) ? result.files : [];
  const byId = files.find((file) => file?.id === config.specification.fileId);
  const rootFile = files.find((file) => file?.type === "ROOT");
  const selected = byId ?? rootFile;
  if (!selected?.path) {
    throw new Error(`Unable to resolve Postman specification file ${config.specification.fileId}.`);
  }
  return selected;
}

async function pullSpec() {
  const specId = encodeURIComponent(config.specification.id);
  const definition = await postmanFetch(`${postmanApi}/specs/${specId}/definitions`);
  if (!definition || typeof definition !== "object") throw new Error("Postman returned an empty specification definition.");
  const output = path.join(root, "api/postman/remote-specification.snapshot.json");
  await writeFile(output, `${JSON.stringify(definition, null, 2)}\n`, "utf8");
  console.log(`Pulled Postman specification snapshot -> ${path.relative(root, output)}`);
  console.log("The repository OpenAPI remains the build-time source. Review the snapshot before applying changes.");
}

async function pushSpec() {
  const file = await resolveRemoteFile();
  const sourcePath = path.join(root, config.repository.openapi);
  const content = await readFile(sourcePath, "utf8");
  const specId = encodeURIComponent(config.specification.id);
  const filePath = file.path.split("/").map(encodeURIComponent).join("/");
  await postmanFetch(`${postmanApi}/specs/${specId}/files/${filePath}`, {
    method: "PATCH",
    body: JSON.stringify({ content })
  });
  console.log(`Updated Postman specification ${config.specification.id} file ${file.path} from ${config.repository.openapi}.`);
}

function dataset(action = "get") {
  const datasetId = config.dataset.id;
  const argsByAction = {
    get: ["dataset", "get", datasetId, "--json"],
    sources: ["dataset", "source", "list", "-d", datasetId, "--json"],
    views: ["dataset", "view", "list", "-d", datasetId, "--json"]
  };
  const args = argsByAction[action];
  if (!args) throw new Error(`Unknown dataset action: ${action}`);
  const result = spawnSync("postman", args, { stdio: "inherit", env: process.env });
  if (result.error?.code === "ENOENT") {
    throw new Error("Postman CLI is not installed. Install/sign in to Postman CLI, then rerun this command.");
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}

validateConfig();

switch (command) {
  case "info":
    console.log(JSON.stringify(config, null, 2));
    break;
  case "verify": {
    const openapi = await readFile(path.join(root, config.repository.openapi), "utf8");
    const collection = JSON.parse(await readFile(path.join(root, config.repository.collection), "utf8"));
    if (!openapi.includes("openapi: 3.1.0")) throw new Error("Repository OpenAPI must remain OpenAPI 3.1.0.");
    if (!collection?.info?.name) throw new Error("Postman collection is missing info.name.");
    console.log(`Postman remote config valid for workspace ${config.workspace.id}.`);
    console.log(`Dataset: ${config.dataset.id}`);
    console.log(`Specification: ${config.specification.id} / file ${config.specification.fileId}`);
    break;
  }
  case "pull-spec":
    await pullSpec();
    break;
  case "push-spec":
    await pushSpec();
    break;
  case "dataset":
    dataset(process.argv[3] ?? "get");
    break;
  default:
    throw new Error(`Unknown command: ${command}. Use info, verify, pull-spec, push-spec, or dataset [get|sources|views].`);
}
