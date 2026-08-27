import type { FastifyInstance, FastifyRequest } from "fastify";
import { MAX_MESSAGE_LENGTH } from "../../../constants/api.ts";
import { getStore } from "../../../store/index.ts";
import { generateAiReply } from "../../../services/ai.ts";
import { createCopilotCreditQuote } from "../../../credits/index.ts";
import { wsHub } from "../../../ws/hub.ts";
import { requireAuth } from "../middlewares/auth.ts";
import { sanitizeText, sendError, sendOk } from "../middlewares/http.ts";
import { rateLimit, sameOriginOrAllowed } from "../middlewares/security.ts";

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

  // Billing invariant: persist the deterministic server quote before attempting an atomic reservation.
  const quote = await createCopilotCreditQuote({
    workspaceId: auth.workspace.id,
    userId: auth.user.id,
    chatId: chat.id,
    requestMessageId: userMessage.id,
  });
  const reservation = await store.reserveCreditQuote(quote.id, auth.workspace.id, auth.user.id);
  if (!reservation.ok) {
    if (reservation.reason === "insufficient") {
      reply.header("x-powerchain-quote-id", quote.id);
      reply.header("x-powerchain-quote-hash", quote.quoteHash);
      return sendError(reply, "Insufficient PWRC credits for a completed Copilot response.", 402, "INSUFFICIENT_CREDITS");
    }
    return sendError(reply, "Unable to reserve PWRC credits for this response.", 409, `CREDIT_${reservation.reason.toUpperCase()}`);
  }

  let aiReply: Awaited<ReturnType<typeof generateAiReply>>;
  try {
    const assets = await store.listAssets(auth.workspace.id);
    aiReply = await generateAiReply(prompt, assets);
  } catch (error) {
    await store.releaseCreditQuote(quote.id, auth.workspace.id, auth.user.id, "ai_generation_failed");
    throw error;
  }

  // Persist the delivered assistant message and settle the reservation in one store transaction.
  // A thrown storage error must not strand a reservation: the settlement transaction rolls
  // back first, then we attempt an explicit compensating release before returning failure.
  let settlement: Awaited<ReturnType<typeof store.completeCreditSettledMessage>>;
  try {
    settlement = await store.completeCreditSettledMessage({
      quoteId: quote.id,
      chatId: chat.id,
      workspaceId: auth.workspace.id,
      userId: auth.user.id,
      content: aiReply.text,
    });
  } catch (error) {
    request.log.error({ err: error, quoteId: quote.id }, "credit settlement transaction failed");
    await store.releaseCreditQuote(quote.id, auth.workspace.id, auth.user.id, "settlement_exception").catch((releaseError) => {
      request.log.error({ err: releaseError, quoteId: quote.id }, "credit reservation compensation failed");
    });
    return sendError(reply, "The response completed but credit settlement could not be committed. No response was delivered.", 503, "CREDIT_SETTLEMENT_FAILED");
  }
  if (!settlement.ok) {
    await store.releaseCreditQuote(quote.id, auth.workspace.id, auth.user.id, "settlement_failed");
    return sendError(reply, "The response completed but credit settlement could not be committed. No response was delivered.", 503, "CREDIT_SETTLEMENT_FAILED");
  }

  await store.addActivity(auth.workspace.id, "billing", "Copilot response settled", `${settlement.receipt.amount} PWRC · receipt ${settlement.receipt.id}`);
  wsHub.broadcast(chat.id, { type: "chat.message", chatId: chat.id, payload: settlement.message, timestamp: new Date().toISOString() });
  wsHub.broadcast(chat.id, { type: "chat.receipt", chatId: chat.id, payload: settlement.receipt, timestamp: new Date().toISOString() });
  reply.header("x-powerchain-quote-id", settlement.quote.id);
  reply.header("x-powerchain-quote-hash", settlement.quote.quoteHash);
  reply.header("x-powerchain-receipt-id", settlement.receipt.id);
  return sendOk(reply, {
    chat,
    userMessage,
    message: settlement.message,
    mode: aiReply.mode,
    text: aiReply.text,
    actions: aiReply.actions,
    billing: { quote: settlement.quote, receipt: settlement.receipt, account: settlement.account },
  });
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
