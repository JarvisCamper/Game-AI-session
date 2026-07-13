import { randomUUID } from "node:crypto";
import type { WebSocket } from "ws";
import type { RoomPlayer } from "@/types";
import type { Room, RoomConnection } from "./room.types";
import { generateRoomCode } from "./room-code.util";

const MAX_PLAYERS_PER_ROOM = 2;

export class RoomServiceError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

/**
 * Owns all room state for the lobby phase. In-memory only — rooms do not
 * survive a server restart.
 */
export class RoomService {
  private readonly roomsByCode = new Map<string, Room>();
  private readonly roomsByUuid = new Map<string, Room>();
  private nextPlayerId = 1;

  createRoom(playerName: string, socket: WebSocket): Room {
    const roomCode = generateRoomCode(new Set(this.roomsByCode.keys()));
    const host: RoomConnection = {
      player: this.buildPlayer(playerName, true),
      socket,
    };

    const room: Room = {
      room_uuid: randomUUID(),
      room_code: roomCode,
      created_at: Date.now(),
      host,
      guest: null,
    };

    this.roomsByCode.set(room.room_code, room);
    this.roomsByUuid.set(room.room_uuid, room);
    return room;
  }

  joinRoom(roomCode: string, playerName: string, socket: WebSocket): Room {
    const room = this.roomsByCode.get(roomCode);

    if (!room) {
      throw new RoomServiceError(
        "ROOM_NOT_FOUND",
        `No room found for code ${roomCode}`,
      );
    }
    if (room.host.socket === socket) {
      throw new RoomServiceError(
        "ALREADY_IN_ROOM",
        "Host cannot join their own room as a guest",
      );
    }
    if (room.guest) {
      throw new RoomServiceError(
        "ROOM_FULL",
        `Room ${roomCode} already has ${MAX_PLAYERS_PER_ROOM} players`,
      );
    }

    room.guest = {
      player: this.buildPlayer(playerName, false),
      socket,
    };

    return room;
  }

  findRoomBySocket(socket: WebSocket): Room | undefined {
    for (const room of this.roomsByUuid.values()) {
      if (room.host.socket === socket || room.guest?.socket === socket) {
        return room;
      }
    }
    return undefined;
  }

  /** Removes a disconnected socket from its room, deleting empty rooms. */
  removeConnection(socket: WebSocket): void {
    const room = this.findRoomBySocket(socket);
    if (!room) return;

    if (room.guest?.socket === socket) {
      room.guest = null;
      return;
    }

    if (room.host.socket === socket) {
      this.roomsByCode.delete(room.room_code);
      this.roomsByUuid.delete(room.room_uuid);
    }
  }

  private buildPlayer(name: string, isHost: boolean): RoomPlayer {
    return { player_id: this.nextPlayerId++, name, is_host: isHost };
  }
}
