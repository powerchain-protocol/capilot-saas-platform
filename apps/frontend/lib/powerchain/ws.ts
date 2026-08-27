import { startPolling } from "./fallbacks";
import { powerChainApi } from "./api";
import { wsEndpoints } from "./endpoints";
import type { ApiMessage } from "./types";

export type ChatWsEvent = {
  type: "chat.message" | "chat.receipt" | "chat.updated" | "system.heartbeat";
  chatId?: string;
  payload: unknown;
  timestamp: string;
};

export type ChatRealtimeOptions = {
  onEvent: (event: ChatWsEvent) => void;
  onFallbackMessages?: (messages: ApiMessage[]) => void;
  onStatus?: (status: "connecting" | "connected" | "polling" | "closed") => void;
};

function parseEvent(value: string): ChatWsEvent | null {
  try {
    const parsed = JSON.parse(value) as Partial<ChatWsEvent>;
    if (parsed.type !== "chat.message" && parsed.type !== "chat.receipt" && parsed.type !== "chat.updated" && parsed.type !== "system.heartbeat") return null;
    if (typeof parsed.timestamp !== "string") return null;
    return { type: parsed.type, chatId: typeof parsed.chatId === "string" ? parsed.chatId : undefined, payload: parsed.payload, timestamp: parsed.timestamp };
  } catch {
    return null;
  }
}

export function connectChatRealtime(idOrSlug: string, options: ChatRealtimeOptions): () => void {
  const url = wsEndpoints.chat(idOrSlug);
  let socket: WebSocket | null = null;
  let stopped = false;
  let stopPolling: (() => void) | null = null;

  const pollingFallback = (): void => {
    if (stopped || stopPolling) return;
    options.onStatus?.("polling");
    stopPolling = startPolling(
      async () => (await powerChainApi.getChat(idOrSlug)).messages,
      { intervalMs: 15_000, onValue: (messages) => options.onFallbackMessages?.(messages) },
    );
  };

  if (!url || typeof WebSocket === "undefined") {
    pollingFallback();
    return () => { stopped = true; stopPolling?.(); };
  }

  options.onStatus?.("connecting");
  try {
    socket = new WebSocket(url);
    socket.addEventListener("open", () => options.onStatus?.("connected"));
    socket.addEventListener("message", (event) => {
      const parsed = typeof event.data === "string" ? parseEvent(event.data) : null;
      if (parsed) options.onEvent(parsed);
    });
    socket.addEventListener("error", pollingFallback);
    socket.addEventListener("close", () => {
      if (!stopped) pollingFallback();
      else options.onStatus?.("closed");
    });
  } catch {
    pollingFallback();
  }

  return () => {
    stopped = true;
    stopPolling?.();
    socket?.close(1000, "client closed");
    options.onStatus?.("closed");
  };
}
