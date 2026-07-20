import { Card, CardAttribute, MoveType, type PlayerState } from "@/types";
import { MOCK_CARDS } from "./mockCards";

/**
 * Local, offline stand-ins for the two PlayerStates a MATCH_START would carry.
 * When websockets land, MatchStartPayload delivers `self` + `opponent` and this
 * file goes away. IDs here are stable so the engine + perspective layers have
 * something deterministic to key on.
 */

/** The opponent's roster — a distinct set so the two sides are visually clear. */
const OPPONENT_CARDS: [Card, Card, Card] = [
  {
    id: 4,
    name: "Karen from HR",
    avatar: "📋",
    attribute: CardAttribute.MICROMANAGER,
    stats: { health: 110, max_health: 110, attack: 50, defend: 60, special: 65 },
    moves: {
      attack: {
        type: MoveType.ATTACK,
        name: "Passive-Aggressive Memo",
        description: "Per my last email…",
        base_power: 45,
      },
      defend: {
        type: MoveType.DEFEND,
        name: "Policy Shield",
        description: "Cites the handbook, section 12.",
        base_power: 40,
      },
      special: {
        type: MoveType.SPECIAL,
        name: "Mandatory Meeting",
        description: "This could have been an email.",
        base_power: 85,
      },
    },
    is_defeated: false,
  },
  {
    id: 5,
    name: "Greg the Slacker",
    avatar: "🛋️",
    attribute: CardAttribute.SLACKER,
    stats: { health: 130, max_health: 130, attack: 40, defend: 55, special: 60 },
    moves: {
      attack: {
        type: MoveType.ATTACK,
        name: "Reply-All Blunder",
        description: "Accidentally CCs the whole company.",
        base_power: 40,
      },
      defend: {
        type: MoveType.DEFEND,
        name: "Working From 'Home'",
        base_power: 45,
      },
      special: {
        type: MoveType.SPECIAL,
        name: "Deadline? What Deadline?",
        description: "Somehow it still ships.",
        base_power: 80,
      },
    },
    is_defeated: false,
  },
  {
    id: 6,
    name: "Sam, Early Bird",
    avatar: "🌅",
    attribute: CardAttribute.EARLY_BIRD,
    stats: { health: 95, max_health: 95, attack: 60, defend: 45, special: 70 },
    moves: {
      attack: {
        type: MoveType.ATTACK,
        name: "6AM Standup",
        description: "Strikes before you've had coffee.",
        base_power: 50,
      },
      defend: {
        type: MoveType.DEFEND,
        name: "Head Start",
        base_power: 35,
      },
      special: {
        type: MoveType.SPECIAL,
        name: "Inbox Zero",
        description: "Overwhelming, relentless productivity.",
        base_power: 88,
      },
    },
    is_defeated: false,
  },
];

/** Deep-ish clone so the engine never mutates the shared mock literals. */
function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export const SELF_PLAYER_ID = 1;
export const OPPONENT_PLAYER_ID = 2;

export function makeMockPlayers(): {
  self: PlayerState;
  opponent: PlayerState;
} {
  return {
    self: {
      player_id: SELF_PLAYER_ID,
      name: "You",
      scoreboard: { wins: 0, losses: 0 },
      cards: clone(MOCK_CARDS).slice(0, 3) as [Card, Card, Card],
      active_card_index: 0,
    },
    opponent: {
      player_id: OPPONENT_PLAYER_ID,
      name: "Rival Corp.",
      scoreboard: { wins: 0, losses: 0 },
      cards: clone(OPPONENT_CARDS),
      active_card_index: 0,
    },
  };
}
