import type { RawData, WebSocket, WebSocketServer } from "ws";
import {
  BattleMessageType,
  type CreateRoomPayload,
  type CreateRoomRequestPayload,
  type JoinRoomPayload,
  type JoinRoomRequestPayload,
  type OpponentJoinedPayload,
} from "@/types";
import { RoomService, RoomServiceError } from "../rooms/room.service";
import { buildError, buildMessage, isRecord, parseEnvelope } from "./envelope";

/**
 * Thin transport layer: parses/validates incoming frames and delegates to
 * RoomService. No room/game logic lives here.
 */
const LOG_PREFIX = "[ws-gateway]";

export function registerConnectionGateway(
  wss: WebSocketServer,
  roomService: RoomService = new RoomService(),
): void {
  wss.on("connection", (socket, request) => {
    console.log(LOG_PREFIX, "client connected", {
      url: request.url,
      remoteAddress: request.socket.remoteAddress,
    });

    socket.on("message", (raw) => handleMessage(socket, raw, roomService));
    socket.on("error", (error) => {
      console.error(LOG_PREFIX, "socket error", error);
    });
    socket.on("close", (code, reason) => {
      console.log(LOG_PREFIX, "client disconnected", {
        code,
        reason: reason.toString() || "(none)",
      });
      roomService.removeConnection(socket);
    });
  });
}

function handleMessage(
  socket: WebSocket,
  raw: RawData,
  roomService: RoomService,
): void {
  const text = raw.toString();
  console.log(LOG_PREFIX, "message ←", text);

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return send(socket, buildError("INVALID_JSON", "Message must be valid JSON"));
  }

  const envelope = parseEnvelope(parsed);
  if (!envelope) {
    return send(
      socket,
      buildError("INVALID_MESSAGE", "Message must include a string 'type'"),
    );
  }

  switch (envelope.type) {
    case BattleMessageType.CREATE_ROOM:
      return handleCreateRoom(socket, envelope.payload, roomService);
    case BattleMessageType.JOIN_ROOM:
      return handleJoinRoom(socket, envelope.payload, roomService);
    default:
      return send(
        socket,
        buildError("UNKNOWN_TYPE", `Unsupported message type: ${envelope.type}`),
      );
  }
}

function handleCreateRoom(
  socket: WebSocket,
  payload: unknown,
  roomService: RoomService,
): void {
  if (!isRecord(payload) || typeof payload.player_name !== "string" || !payload.player_name.trim()) {
    return send(
      socket,
      buildError("INVALID_PAYLOAD", "player_name is required to create a room"),
    );
  }

  const request = payload as unknown as CreateRoomRequestPayload;
  const room = roomService.createRoom(request.player_name.trim(), socket);

  const response: CreateRoomPayload = {
    room_uuid: room.room_uuid,
    room_code: room.room_code,
    player: room.host.player,
  };
  send(socket, buildMessage(BattleMessageType.CREATE_ROOM, room.room_uuid, response));
}

function handleJoinRoom(
  socket: WebSocket,
  payload: unknown,
  roomService: RoomService,
): void {
  if (
    !isRecord(payload) ||
    typeof payload.room_code !== "string" ||
    !payload.room_code.trim() ||
    typeof payload.player_name !== "string" ||
    !payload.player_name.trim()
  ) {
    return send(
      socket,
      buildError("INVALID_PAYLOAD", "room_code and player_name are required to join a room"),
    );
  }

  const request = payload as unknown as JoinRoomRequestPayload;

  let room;
  try {
    room = roomService.joinRoom(
      request.room_code.trim().toUpperCase(),
      request.player_name.trim(),
      socket,
    );
  } catch (error) {
    if (error instanceof RoomServiceError) {
      return send(socket, buildError(error.code, error.message));
    }
    throw error;
  }

  const guestResponse: JoinRoomPayload = {
    room_uuid: room.room_uuid,
    room_code: room.room_code,
    player: room.guest!.player,
    opponent: room.host.player,
  };
  send(socket, buildMessage(BattleMessageType.JOIN_ROOM, room.room_uuid, guestResponse));

  const hostNotice: OpponentJoinedPayload = {
    room_uuid: room.room_uuid,
    opponent: room.guest!.player,
  };
  send(
    room.host.socket,
    buildMessage(BattleMessageType.OPPONENT_JOINED, room.room_uuid, hostNotice),
  );
}

function send(socket: WebSocket, message: unknown): void {
  if (socket.readyState === socket.OPEN) {
    const body = JSON.stringify(message);
    console.log(LOG_PREFIX, "message →", body);
    socket.send(body);
    return;
  }
  console.warn(LOG_PREFIX, "send skipped — socket not open", {
    readyState: socket.readyState,
    message,
  });
}
