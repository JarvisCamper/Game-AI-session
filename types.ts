/**
 * WebSocket connection route
 * -----------------------------------------------------------------------
 * Dynamic route used as the base for opening the battle room socket.
 * Example client usage:
 *
 *   const socket = new WebSocket(getBattleSocketUrl(roomUuid));
 *
 * Adjust the scheme/host resolution to match your env config (ws vs wss).
 */

// -----------------------------------------------------------------------
// Enums
// -----------------------------------------------------------------------

/**
 * Discriminator for every message that can travel over the battle socket,
 * in either direction. Mirrors the MessageType pattern used elsewhere.
 */
export const enum BattleMessageType {
  JOIN_ROOM = "join_room",
  PLAYER_READY = "player_ready",
  MATCH_START = "match_start",
  TURN_START = "turn_start",
  MOVE_SELECT = "move_select",
  MOVE_RESULT = "move_result",
  CARD_DEFEATED = "card_defeated",
  ROUND_END = "round_end",
  GAME_OVER = "game_over",
  TAUNT = "taunt",
  OPPONENT_DISCONNECTED = "opponent_disconnected",
  OPPONENT_RECONNECTED = "opponent_reconnected",
  LEAVE_ROOM = "leave_room",
  ERROR = "error",
}

export const enum MoveType {
  ATTACK = "attack",
  DEFEND = "defend",
  SPECIAL = "special",
}

/**
 * "Office member" flavor attributes. These drive the effectiveness chart
 * (rock/paper/scissors-style) between attacking and defending cards.
 */
export const enum CardAttribute {
  SMOKER = "smoker",
  CAFFEINE_ADDICT = "caffeine_addict",
  WORKAHOLIC = "workaholic",
  GOSSIPER = "gossiper",
  EARLY_BIRD = "early_bird",
  NIGHT_OWL = "night_owl",
  MICROMANAGER = "micromanager",
  SLACKER = "slacker",
}

export const enum MoveEffectiveness {
  WEAK = "weak", // 0.5x
  NEUTRAL = "neutral", // 1x
  STRONG = "strong", // 1.5x / 2x
}

// -----------------------------------------------------------------------
// Core domain shapes
// -----------------------------------------------------------------------

export interface CardStats {
  health: number;
  max_health: number;
  attack: number;
  defend: number;
  special: number;
}

export interface CardMove {
  type: MoveType;
  name: string;
  description?: string;
  base_power: number;
}

/**
 * A single "office member" battle card.
 */
export interface Card {
  id: number;
  name: string;
  avatar: string;
  attribute: CardAttribute;
  stats: CardStats;
  moves: {
    attack: CardMove;
    defend: CardMove;
    special: CardMove;
  };
  is_defeated: boolean;
}

export interface Scoreboard {
  wins: number;
  losses: number;
}

/**
 * One player's full battle-perspective state. Each connected client
 * receives its own PlayerState plus the opponent's (see MatchStartPayload).
 */
export interface PlayerState {
  player_id: number;
  name: string;
  scoreboard: Scoreboard;
  cards: [Card, Card, Card];
  active_card_index: 0 | 1 | 2;
}

export interface TauntLine {
  card_id: number;
  message: string;
}

// -----------------------------------------------------------------------
// Receive payloads (backend -> frontend): {Type}Payload
// -----------------------------------------------------------------------

export interface JoinRoomPayload {
  room_uuid: string;
  player: PlayerState;
  opponent: Pick<PlayerState, "player_id" | "name" | "scoreboard"> | null;
}

export interface PlayerReadyPayload {
  player_id: number;
  ready: boolean;
}

export interface MatchStartPayload {
  room_uuid: string;
  round: number;
  first_turn_player_id: number;
  self: PlayerState;
  opponent: PlayerState;
}

export interface TurnStartPayload {
  round: number;
  active_player_id: number;
  turn_timeout_seconds: number;
}

export interface MoveResultPayload {
  round: number;
  attacker_player_id: number;
  attacker_card_id: number;
  defender_player_id: number;
  defender_card_id: number;
  move: MoveType;
  effectiveness: MoveEffectiveness;
  damage: number;
  defender_remaining_health: number;
  self: PlayerState;
  opponent: PlayerState;
}

export interface CardDefeatedPayload {
  player_id: number;
  card_id: number;
  next_active_card_index: 0 | 1 | 2 | null;
}

export interface RoundEndPayload {
  round: number;
  next_turn_player_id: number;
}

export interface GameOverPayload {
  winner_player_id: number;
  loser_player_id: number;
  self: PlayerState;
  opponent: PlayerState;
  victory_taunt: TauntLine;
}

export interface TauntPayload {
  player_id: number;
  taunt: TauntLine;
}

export interface OpponentDisconnectedPayload {
  player_id: number;
  reconnect_timeout_seconds: number;
}

export interface OpponentReconnectedPayload {
  player_id: number;
}

export interface ErrorPayload {
  code: string;
  message: string;
}

export type BattlePayload =
  | JoinRoomPayload
  | PlayerReadyPayload
  | MatchStartPayload
  | TurnStartPayload
  | MoveResultPayload
  | CardDefeatedPayload
  | RoundEndPayload
  | GameOverPayload
  | TauntPayload
  | OpponentDisconnectedPayload
  | OpponentReconnectedPayload
  | ErrorPayload;

export type TypedBattlePayload =
  | { type: BattleMessageType.JOIN_ROOM; payload: JoinRoomPayload }
  | { type: BattleMessageType.PLAYER_READY; payload: PlayerReadyPayload }
  | { type: BattleMessageType.MATCH_START; payload: MatchStartPayload }
  | { type: BattleMessageType.TURN_START; payload: TurnStartPayload }
  | { type: BattleMessageType.MOVE_RESULT; payload: MoveResultPayload }
  | { type: BattleMessageType.CARD_DEFEATED; payload: CardDefeatedPayload }
  | { type: BattleMessageType.ROUND_END; payload: RoundEndPayload }
  | { type: BattleMessageType.GAME_OVER; payload: GameOverPayload }
  | { type: BattleMessageType.TAUNT; payload: TauntPayload }
  | {
      type: BattleMessageType.OPPONENT_DISCONNECTED;
      payload: OpponentDisconnectedPayload;
    }
  | {
      type: BattleMessageType.OPPONENT_RECONNECTED;
      payload: OpponentReconnectedPayload;
    }
  | { type: BattleMessageType.ERROR; payload: ErrorPayload };

type BaseBattleMessage = {
  room_uuid: string;
  created_at: string;
};

/**
 * Canonical inbound message received over the socket from the backend.
 */
export type BattleMessage = BaseBattleMessage & TypedBattlePayload;

// -----------------------------------------------------------------------
// Send payloads (frontend -> backend): {Type}RequestPayload
// -----------------------------------------------------------------------

export interface JoinRoomRequestPayload {
  room_uuid: string;
  player_name: string;
}

export interface PlayerReadyRequestPayload {
  selected_card_ids: [number, number, number];
}

export interface MoveSelectRequestPayload {
  card_id: number;
  move: MoveType;
  target_card_id: number;
}

export interface TauntRequestPayload {
  card_id: number;
  message: string;
}

export interface LeaveRoomRequestPayload {
  reason?: string;
}

export type BattleRequestPayloadData =
  | JoinRoomRequestPayload
  | PlayerReadyRequestPayload
  | MoveSelectRequestPayload
  | TauntRequestPayload
  | LeaveRoomRequestPayload;

export type TypedBattleRequestPayload =
  | { type: BattleMessageType.JOIN_ROOM; payload: JoinRoomRequestPayload }
  | { type: BattleMessageType.PLAYER_READY; payload: PlayerReadyRequestPayload }
  | { type: BattleMessageType.MOVE_SELECT; payload: MoveSelectRequestPayload }
  | { type: BattleMessageType.TAUNT; payload: TauntRequestPayload }
  | { type: BattleMessageType.LEAVE_ROOM; payload: LeaveRoomRequestPayload };

/**
 * Envelope sent to the backend over the socket.
 */
export type SendBattleMessage = {
  room_uuid: string;
} & TypedBattleRequestPayload;

// -----------------------------------------------------------------------
// Effectiveness chart helper type
// -----------------------------------------------------------------------

/**
 * Lookup table shape for attribute vs attribute effectiveness, e.g.:
 *   SMOKER attacking CAFFEINE_ADDICT -> STRONG
 * Populate this on the client (mirrored from backend) to preview
 * expected effectiveness before a move is confirmed by the server.
 */
export type EffectivenessChart = Record<
  CardAttribute,
  Record<CardAttribute, MoveEffectiveness>
>;
