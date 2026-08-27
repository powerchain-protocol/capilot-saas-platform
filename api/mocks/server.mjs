
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.MOCK_API_PORT ?? 8010);
const host = process.env.MOCK_API_HOST ?? "127.0.0.1";

const fixture = async (name) => JSON.parse(await readFile(join(here, "fixtures", name), "utf8"));
const json = (res, code, body, headers = {}) => {
  res.writeHead(code, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-powerchain-mock": "true", ...headers });
  res.end(JSON.stringify(body));
};
const readBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { return {}; }
};

const server = createServer(async (req, res) => {
  const method = req.method ?? "GET";
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? `${host}:${port}`}`);
  const path = url.pathname.startsWith("/v1/") ? `/api${url.pathname}` : url.pathname;
  if (method === "OPTIONS") {
    res.writeHead(204, { "access-control-allow-origin": req.headers.origin ?? "http://localhost:3000", "access-control-allow-credentials": "true", "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS", "access-control-allow-headers": "content-type,x-request-id,x-api-key" });
    return res.end();
  }
  try {
    if (path === "/" && method === "GET") return json(res, 200, { name: "PowerChain Copilot Mock API", version: "1.0.0", authoritative: false });
    if (path === "/api/v1/health" && method === "GET") return json(res, 200, await fixture("health.json"));
    if ((path === "/api/v1/auth/demo" || path === "/api/v1/auth/sign-in" || path === "/api/v1/auth/register") && method === "POST") {
      return json(res, path.endsWith("register") ? 201 : 200, { ok: true, data: { ...(await fixture("session.json")).data, sessionId: "ses_0123456789abcdef0123456789abcdef" } }, { "set-cookie": "pc_session=mock-session; Path=/; HttpOnly; SameSite=Lax" });
    }
    if (path === "/api/v1/auth/sign-out" && method === "POST") return json(res, 200, { ok: true, data: { signedOut: true } }, { "set-cookie": "pc_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax" });
    if (path === "/api/v1/sessions/current" && method === "GET") return json(res, 200, await fixture("session.json"));
    if (path === "/api/v1/sessions" && method === "GET") return json(res, 200, { ok: true, data: [{ ...(await fixture("session.json")).data.session, current: true }] });
    if (/^\/api\/v1\/sessions\/[^/]+$/.test(path) && method === "DELETE") return json(res, 200, { ok: true, data: { revoked: true, id: path.split("/").at(-1) } });
    if (path === "/api/v1/security/session" && method === "GET") return json(res, 200, { ok: true, data: { ip: url.searchParams.get("reveal") === "1" ? "203.0.113.10" : "203.0.113.xxx", masked: url.searchParams.get("reveal") !== "1", role: "operator", persistent: false, expiresAt: "2026-08-28T06:00:00.000Z", sessionId: "ses_0123456789abcdef0123456789abcdef" } });
    if (path === "/api/v1/dashboard" && method === "GET") return json(res, 200, await fixture("dashboard.json"));
    if (path === "/api/v1/assets" && method === "GET") return json(res, 200, await fixture("assets.json"));
    if (path === "/api/v1/approvals" && method === "GET") return json(res, 200, await fixture("approvals.json"));
    if (/^\/api\/v1\/approvals\/[^/]+$/.test(path) && method === "POST") {
      const body = await readBody(req); const current = (await fixture("approvals.json")).data[0];
      const status = body.action === "request_changes" ? "changes_requested" : "approved";
      return json(res, 200, { ok: true, data: { ...current, id: path.split("/").at(-1), status } });
    }
    if (path === "/api/v1/ai/generate" && method === "POST") return json(res, 200, await fixture("ai-generate.json"));
    if (path === "/api/v1/chat" && method === "GET") return json(res, 200, await fixture("chat-list.json"));
    if (path === "/api/v1/chat" && method === "POST") return json(res, 201, { ok: true, data: (await fixture("chat-list.json")).data[0] });
    if (/^\/api\/v1\/chat\/[^/]+$/.test(path) && method === "GET") return json(res, 200, await fixture("chat-detail.json"));
    if (/^\/api\/v1\/chat\/[^/]+\/messages$/.test(path) && method === "POST") return json(res, 200, await fixture("chat-message.json"));
    if (path === "/api/v1/copilot" && method === "GET") return json(res, 200, { ok: true, data: (await fixture("chat-detail.json")).data.messages });
    if (path === "/api/v1/copilot" && method === "POST") return json(res, 200, await fixture("chat-message.json"));
    if (/^\/api\/v1\/messages\/[^/]+$/.test(path) && method === "GET") return json(res, 200, await fixture("message.json"));
    if (path === "/api/v1/profile" && method === "PATCH") return json(res, 200, { ok: true, data: { user: (await fixture("session.json")).data.user, workspace: (await fixture("session.json")).data.workspace } });
    if (path === "/api/v1/services" && method === "GET") return json(res, 200, await fixture("services.json"));
    if (path === "/api/v1/market/price" && method === "GET") return json(res, 200, await fixture("market-price.json"));
    if (path === "/api/v1/network/solana" && method === "GET") return json(res, 200, await fixture("solana-network.json"));
    if (path === "/api/v1/contact" && method === "POST") return json(res, 201, await fixture("contact.json"));
    if (path === "/api/v1/credits" && method === "GET") return json(res, 200, await fixture("credits.json"));
    if (path === "/api/v1/credits/ledger" && method === "GET") return json(res, 200, await fixture("credit-ledger.json"));
    if (path === "/api/v1/tokens" && method === "GET") return json(res, 200, await fixture("tokens.json"));
    if (path === "/api/v1/tokens/pwrc" && method === "GET") { const tokens = await fixture("tokens.json"); return json(res, 200, { ok: true, data: tokens.data[0] }); }

    return json(res, 404, { ok: false, error: { message: "Mock route not found.", code: "MOCK_NOT_FOUND", requestId: "req_mock_not_found" } });
  } catch (error) {
    return json(res, 500, { ok: false, error: { message: error instanceof Error ? error.message : "Mock server error.", code: "MOCK_ERROR" } });
  }
});

server.listen(port, host, () => {
  console.log(`PowerChain Copilot mock API listening at http://${host}:${port}`);
  console.log("MOCK ONLY — responses are representative and non-authoritative.");
});
