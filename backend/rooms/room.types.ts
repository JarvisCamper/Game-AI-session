import type { WebSocket } from "ws";
import type { RoomPlayer } from "@/types";

/**
 * Server-internal bookkeeping only — holds the live socket reference.
 * Never exported to the shared contract in @/types.
 */
export interface RoomConnection {
  player: RoomPlayer;
  socket: WebSocket;
}

export interface Room {
  room_uuid: string;
  room_code: string;
  created_at: number;
  host: RoomConnection;
  guest: RoomConnection | null;
}
