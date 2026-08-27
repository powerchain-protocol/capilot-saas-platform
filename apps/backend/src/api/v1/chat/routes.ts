import type { FastifyInstance, FastifyRequest } from "fastify";
import { MAX_MESSAGE_LENGTH } from "../../../constants/api";
import { getStore } from "../../../store";
import { generateAiReply } from "../../../services/ai";
import { wsHub } from "../../../ws/hub";
import { requireAuth } from "../middlewares/auth";
import { sanitizeText, sendError, sendOk } from "../middlewares/http";
import { rateLimit, sameOriginOrAllowed } from "../middlewares/security";

function bodyRecord(request: FastifyRequest): Record<string, unknown> { return typeof request.body === "object" && request.body !== null ? request.body as Record<string, unknown> : {}; }

function titleFromPrompt(prompt: string): string {
  const clean = prompt.replace(/\s+/g, " ").trim();
  return clean.length > 64 ? `${clean.slice(0, 61)}…` : clean || "New analysis";
}

async function ensureDefaultChat(workspaceId: string, userId: string) {
  const store = getStore();
  const chats = await store.listChats(workspaceId, userId);
  return chats[0] ?? store.createChat(workspaceId, userId, "PowerChain Copilot");
}

async function submitMessage(request: FastifyRequest, reply: Parameters<typeof sendOk>[0], chatIdOrSlug?: string) {
  if (!sameOriginOrAllowed(request)) return sendError(reply, "Cross-origin mutation rejected.", 403, "ORIGIN_REJECTED");
  if (!rateLimit(request, "chat-message", 60, 60_000)) return sendError(reply, "Too many requests. Try again shortly.", 429, "RATE_LIMITED");
  const auth = await requireAuth(request);
  const body = bodyRecord(request);
  const prompt = sanitizeText(body.message ?? body.prompt, MAX_MESSAGE_LENGTH);
  if (prompt.length < 2) return sendError(reply, "Enter a question for Copilot.", 422, "VALIDATION");
  const store = getStore();
  let chat = chatIdOrSlug ? await store.getChat(auth.workspace.id, auth.user.id, chatIdOrSlug) : null;
  if (!chat) chat = chatIdOrSlug ? null : await ensureDefaultChat(auth.workspace.id, auth.user.id);
  if (!chat && chatIdOrSlug) return sendError(reply, "Chat not found.", 404, "CHAT_NOT_FOUND");
  if (!chat) chat = await store.createChat(auth.workspace.id, auth.user.id, titleFromPrompt(prompt));
  const userMessage = await store.addMessage({ chatId: chat.id, workspaceId: auth.workspace.id, userId: auth.user.id, role: "user", content: prompt });
  wsHub.broadcast(chat.id, { type: "chat.message", chatId: chat.id, payload: userMessage, timestamp: new Date().toISOString() });
  const assets = await store.listAssets(auth.workspace.id);
  const aiReply = await generateAiReply(prompt, assets);
  const assistantMessage = await store.addMessage({ chatId: chat.id, workspaceId: auth.workspace.id, userId: auth.user.id, role: "assistant", content: aiReply.text });
  await store.addActivity(auth.workspace.id, "copilot", "Copilot analysis completed", `${aiReply.mode} response · 10,000 PWRC representative credit`);
  wsHub.broadcast(chat.id, { type: "chat.message", chatId: chat.id, payload: assistantMessage, timestamp: new Date().toISOString() });
  return sendOk(reply, { chat, userMessage, message: assistantMessage, mode: aiReply.mode, text: aiReply.text, actions: aiReply.actions });
}

export async function registerChatRoutes(app: FastifyInstance): Promise<void> {
  app.get("/chat", async (request, reply) => {
    const auth = await requireAuth(request);
    return sendOk(reply, await getStore().listChats(auth.workspace.id, auth.user.id));
  });

  app.post("/chat", async (request, reply) => {
    if (!sameOriginOrAllowed(request)) return sendError(reply, "Cross-origin mutation rejected.", 403, "ORIGIN_REJECTED");
    const auth = await requireAuth(request);
    const body = bodyRecord(request);
    const title = sanitizeText(body.title, 120) || "New analysis";
    return sendOk(reply, await getStore().createChat(auth.workspace.id, auth.user.id, title), 201);
  });

  app.get<{ Params: { id: string } }>("/chat/:id", async (request, reply) => {
    const auth = await requireAuth(request);
    const store = getStore();
    const chat = await store.getChat(auth.workspace.id, auth.user.id, request.params.id);
    if (!chat) return sendError(reply, "Chat not found.", 404, "CHAT_NOT_FOUND");
    return sendOk(reply, { chat, messages: await store.listMessages(chat.id, auth.workspace.id, auth.user.id) });
  });

  app.post<{ Params: { id: string } }>("/chat/:id/messages", async (request, reply) => submitMessage(request, reply, request.params.id));

  // Compatibility route for the current frontend while the chat UI migrates to explicit chat IDs.
  app.get("/copilot", async (request, reply) => {
    const auth = await requireAuth(request);
    const chat = await ensureDefaultChat(auth.workspace.id, auth.user.id);
    return sendOk(reply, await getStore().listMessages(chat.id, auth.workspace.id, auth.user.id));
  });
  app.post("/copilot", async (request, reply) => submitMessage(request, reply));
}
