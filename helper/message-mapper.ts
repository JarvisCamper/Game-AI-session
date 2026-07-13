import {
  BattleMessageType,
  type BattleMessage,
  type CardDefeatedPayload,
  type CreateRoomPayload,
  type CreateRoomRequestPayload,
  type ErrorPayload,
  type GameOverPayload,
  type JoinRoomPayload,
  type JoinRoomRequestPayload,
  type LeaveRoomRequestPayload,
  type MatchStartPayload,
  type MoveResultPayload,
  type MoveSelectRequestPayload,
  type OpponentDisconnectedPayload,
  type OpponentJoinedPayload,
  type OpponentReconnectedPayload,
  type PlayerReadyPayload,
  type PlayerReadyRequestPayload,
  type RoundEndPayload,
  type SendBattleMessage,
  type TauntPayload,
  type TauntRequestPayload,
  type TurnStartPayload,
  type TypedBattlePayload,
} from "@/types";

/** Payload type for a given inbound `BattleMessageType`. */
export type BattleInboundPayloadMap = {
  [BattleMessageType.CREATE_ROOM]: CreateRoomPayload;
  [BattleMessageType.JOIN_ROOM]: JoinRoomPayload;
  [BattleMessageType.OPPONENT_JOINED]: OpponentJoinedPayload;
  [BattleMessageType.PLAYER_READY]: PlayerReadyPayload;
  [BattleMessageType.MATCH_START]: MatchStartPayload;
  [BattleMessageType.TURN_START]: TurnStartPayload;
  [BattleMessageType.MOVE_RESULT]: MoveResultPayload;
  [BattleMessageType.CARD_DEFEATED]: CardDefeatedPayload;
  [BattleMessageType.ROUND_END]: RoundEndPayload;
  [BattleMessageType.GAME_OVER]: GameOverPayload;
  [BattleMessageType.TAUNT]: TauntPayload;
  [BattleMessageType.OPPONENT_DISCONNECTED]: OpponentDisconnectedPayload;
  [BattleMessageType.OPPONENT_RECONNECTED]: OpponentReconnectedPayload;
  [BattleMessageType.ERROR]: ErrorPayload;
};

/** Payload type for a given outbound `BattleMessageType`. */
export type BattleOutboundPayloadMap = {
  [BattleMessageType.CREATE_ROOM]: CreateRoomRequestPayload;
  [BattleMessageType.JOIN_ROOM]: JoinRoomRequestPayload;
  [BattleMessageType.PLAYER_READY]: PlayerReadyRequestPayload;
  [BattleMessageType.MOVE_SELECT]: MoveSelectRequestPayload;
  [BattleMessageType.TAUNT]: TauntRequestPayload;
  [BattleMessageType.LEAVE_ROOM]: LeaveRoomRequestPayload;
};

export type BattleMessageHandler<T extends keyof BattleInboundPayloadMap> = (
  payload: BattleInboundPayloadMap[T],
  message: Extract<BattleMessage, { type: T }>,
) => void;

/** Optional per-type handlers for every inbound battle message. */
export type BattleMessageHandlers = {
  [T in keyof BattleInboundPayloadMap]?: BattleMessageHandler<T>;
} & {
  /** Called for any inbound message before the typed handler. */
  onAny?: (message: BattleMessage) => void;
  /** Called when JSON parse / shape validation fails. */
  onInvalid?: (raw: unknown, error?: unknown) => void;
};

const INBOUND_TYPES = new Set<string>([
  BattleMessageType.CREATE_ROOM,
  BattleMessageType.JOIN_ROOM,
  BattleMessageType.OPPONENT_JOINED,
  BattleMessageType.PLAYER_READY,
  BattleMessageType.MATCH_START,
  BattleMessageType.TURN_START,
  BattleMessageType.MOVE_RESULT,
  BattleMessageType.CARD_DEFEATED,
  BattleMessageType.ROUND_END,
  BattleMessageType.GAME_OVER,
  BattleMessageType.TAUNT,
  BattleMessageType.OPPONENT_DISCONNECTED,
  BattleMessageType.OPPONENT_RECONNECTED,
  BattleMessageType.ERROR,
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Parse a raw WebSocket payload into a typed `BattleMessage`.
 * Returns `null` when the shape is not a known inbound envelope.
 */
export function parseBattleMessage(raw: unknown): BattleMessage | null {
  let data: unknown = raw;

  if (typeof raw === "string") {
    try {
      data = JSON.parse(raw);
    } catch {
      return null;
    }
  }

  if (!isRecord(data) || typeof data.type !== "string") return null;
  if (!INBOUND_TYPES.has(data.type)) return null;
  if (!("payload" in data)) return null;

  return data as BattleMessage;
}

/**
 * Dispatch an inbound message to the matching typed handler.
 * Returns `true` when a typed handler ran.
 */
export function mapBattleMessage(
  message: BattleMessage,
  handlers: BattleMessageHandlers,
): boolean {
  handlers.onAny?.(message);

  const handler = handlers[message.type] as
    | ((payload: TypedBattlePayload["payload"], message: BattleMessage) => void)
    | undefined;

  if (!handler) return false;
  handler(message.payload, message);
  return true;
}

/**
 * Parse raw socket data and map it onto handlers in one step.
 */
export function mapRawBattleMessage(
  raw: unknown,
  handlers: BattleMessageHandlers,
): boolean {
  try {
    const message = parseBattleMessage(raw);
    if (!message) {
      handlers.onInvalid?.(raw);
      return false;
    }
    return mapBattleMessage(message, handlers);
  } catch (error) {
    handlers.onInvalid?.(raw, error);
    return false;
  }
}

type OutboundOptions = {
  room_uuid?: string;
};

/**
 * Build a typed outbound envelope for any sendable message type.
 */
export function buildBattleMessage<T extends keyof BattleOutboundPayloadMap>(
  type: T,
  payload: BattleOutboundPayloadMap[T],
  options: OutboundOptions = {},
): SendBattleMessage {
  return {
    type,
    payload,
    ...(options.room_uuid ? { room_uuid: options.room_uuid } : {}),
  } as SendBattleMessage;
}

/** Convenience builders for every outbound message type. */
export const battleMessageBuilders = {
  createRoom: (payload: CreateRoomRequestPayload) =>
    buildBattleMessage(BattleMessageType.CREATE_ROOM, payload),

  joinRoom: (payload: JoinRoomRequestPayload) =>
    buildBattleMessage(BattleMessageType.JOIN_ROOM, payload),

  playerReady: (payload: PlayerReadyRequestPayload, roomUuid: string) =>
    buildBattleMessage(BattleMessageType.PLAYER_READY, payload, {
      room_uuid: roomUuid,
    }),

  moveSelect: (payload: MoveSelectRequestPayload, roomUuid: string) =>
    buildBattleMessage(BattleMessageType.MOVE_SELECT, payload, {
      room_uuid: roomUuid,
    }),

  taunt: (payload: TauntRequestPayload, roomUuid: string) =>
    buildBattleMessage(BattleMessageType.TAUNT, payload, {
      room_uuid: roomUuid,
    }),

  leaveRoom: (payload: LeaveRoomRequestPayload = {}, roomUuid?: string) =>
    buildBattleMessage(BattleMessageType.LEAVE_ROOM, payload, {
      room_uuid: roomUuid,
    }),
} as const;
