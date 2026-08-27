import type WebSocket from "ws";

export type WsEvent = {
  type: "chat.message" | "chat.receipt" | "chat.updated" | "system.heartbeat";
  chatId?: string;
  payload: unknown;
  timestamp: string;
};

export class WebSocketHub {
  private readonly rooms = new Map<string, Set<WebSocket>>();

  join(room: string, socket: WebSocket): void {
    const sockets = this.rooms.get(room) ?? new Set<WebSocket>();
    sockets.add(socket);
    this.rooms.set(room, sockets);
  }

  leave(room: string, socket: WebSocket): void {
    const sockets = this.rooms.get(room);
    if (!sockets) return;
    sockets.delete(socket);
    if (sockets.size === 0) this.rooms.delete(room);
  }

  broadcast(room: string, event: WsEvent): void {
    const serialized = JSON.stringify(event);
    for (const socket of this.rooms.get(room) ?? []) {
      if (socket.readyState === 1) socket.send(serialized);
    }
  }

  count(room?: string): number {
    if (room) return this.rooms.get(room)?.size ?? 0;
    let total = 0;
    for (const sockets of this.rooms.values()) total += sockets.size;
    return total;
  }
}

export const wsHub = new WebSocketHub();
