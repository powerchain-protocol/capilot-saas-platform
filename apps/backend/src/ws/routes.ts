import type { FastifyInstance } from "fastify";
import type WebSocket from "ws";
import { WS_PREFIX } from "../constants/api";
import { getStore } from "../store";
import { getAuthContext } from "../api/v1/middlewares/auth";
import { wsHub } from "./hub";

export async function registerWebSocketRoutes(app: FastifyInstance): Promise<void> {
  app.get(`${WS_PREFIX}/chat/:id`, { websocket: true }, async (socket: WebSocket, request) => {
    const auth = await getAuthContext(request);
    if (!auth) {
      socket.close(4401, "Authentication required");
      return;
    }
    const params = request.params as { id: string };
    const chat = await getStore().getChat(auth.workspace.id, auth.user.id, params.id);
    if (!chat) {
      socket.close(4404, "Chat not found");
      return;
    }
    wsHub.join(chat.id, socket);
    socket.send(JSON.stringify({ type: "system.heartbeat", chatId: chat.id, payload: { connected: true }, timestamp: new Date().toISOString() }));
    socket.on("message", (data) => {
      const text = data.toString();
      if (text === "ping") socket.send(JSON.stringify({ type: "system.heartbeat", chatId: chat.id, payload: { pong: true }, timestamp: new Date().toISOString() }));
    });
    socket.on("close", () => wsHub.leave(chat.id, socket));
    socket.on("error", () => wsHub.leave(chat.id, socket));
  });
}
