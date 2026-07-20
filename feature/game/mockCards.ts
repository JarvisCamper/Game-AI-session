import { Card, CardAttribute, MoveType } from "@/types";

/**
 * Sample "office member" cards for local development / component testing.
 * These conform to the `Card` shape in types.ts (the single source of truth)
 * so components built against them will match real socket payloads.
 */
export const MOCK_CARDS: Card[] = [
  {
    id: 1,
    name: "Dave from Accounting",
    avatar: "🚬",
    attribute: CardAttribute.SMOKER,
    stats: {
      health: 120,
      max_health: 120,
      attack: 55,
      defend: 40,
      special: 70,
    },
    moves: {
      attack: {
        type: MoveType.ATTACK,
        name: "Smoke Break Ambush",
        description: "Catches the enemy off guard by the back door.",
        base_power: 45,
      },
      defend: {
        type: MoveType.DEFEND,
        name: "Nicotine Nerves",
        description: "Steadies under pressure.",
        base_power: 30,
      },
      special: {
        type: MoveType.SPECIAL,
        name: "Second-Hand Cloud",
        description: "Envelops the arena in haze.",
        base_power: 80,
      },
    },
    is_defeated: false,
  },
  {
    id: 2,
    name: "Priya, Team Lead",
    avatar: "☕",
    attribute: CardAttribute.CAFFEINE_ADDICT,
    stats: {
      health: 100,
      max_health: 100,
      attack: 65,
      defend: 35,
      special: 75,
    },
    moves: {
      attack: {
        type: MoveType.ATTACK,
        name: "Espresso Shot",
        description: "A rapid, jittery strike.",
        base_power: 50,
      },
      defend: {
        type: MoveType.DEFEND,
        name: "Standing Desk Stance",
        base_power: 25,
      },
      special: {
        type: MoveType.SPECIAL,
        name: "Triple Shot Overdrive",
        description: "Acts twice this turn.",
        base_power: 90,
      },
    },
    is_defeated: false,
  },
  {
    id: 3,
    name: "Marcus (Intern)",
    avatar: "🌙",
    attribute: CardAttribute.NIGHT_OWL,
    stats: {
      health: 90,
      max_health: 90,
      attack: 45,
      defend: 55,
      special: 60,
    },
    moves: {
      attack: {
        type: MoveType.ATTACK,
        name: "Midnight Commit",
        description: "Ships code no one asked for.",
        base_power: 40,
      },
      defend: {
        type: MoveType.DEFEND,
        name: "Do Not Disturb",
        base_power: 45,
      },
      special: {
        type: MoveType.SPECIAL,
        name: "3AM Deploy",
        description: "High risk, high reward.",
        base_power: 85,
      },
    },
    is_defeated: false,
  },
];

export const MOCK_CARD = MOCK_CARDS[0];
