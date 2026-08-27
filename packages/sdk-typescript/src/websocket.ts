
import type { ChatSocketEvent } from "./types";

export type ChatSocketOptions = {
  wsBaseUrl: string;
  chatIdOrSlug: string;
  onEvent: (event: ChatSocketEvent) => void;
  onError?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
};

export function connectChatSocket(options: ChatSocketOptions): WebSocket {
  const base = options.wsBaseUrl.replace(/\/+$/, "");
  const socket = new WebSocket(`${base}/ws/v1/chat/${encodeURIComponent(options.chatIdOrSlug)}`);
  socket.addEventListener("message", (event) => {
    if (typeof event.data !== "string") return;
    try {
      const parsed = JSON.parse(event.data) as unknown;
      if (!parsed || typeof parsed !== "object") return;
      const candidate = parsed as Record<string, unknown>;
      if (typeof candidate.type !== "string" || typeof candidate.chatId !== "string" || typeof candidate.timestamp !== "string") return;
      if (candidate.type !== "chat.message" && candidate.type !== "chat.receipt" && candidate.type !== "chat.updated" && candidate.type !== "system.heartbeat") return;
      options.onEvent({ type: candidate.type, chatId: candidate.chatId, payload: candidate.payload, timestamp: candidate.timestamp });
    } catch { /* malformed realtime frames are ignored */ }
  });
  if (options.onError) socket.addEventListener("error", options.onError);
  if (options.onClose) socket.addEventListener("close", options.onClose);
  return socket;
}
