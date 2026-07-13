import { Card, CardAttribute, MoveType } from "./types";

/**
 * Starter roster of office-member battle cards.
 * Names are placeholders — swap them later.
 * Attributes and stats are shuffled across the set for variety.
 */
export const CHARACTERS: Card[] = [
  {
    id: 1,
    name: "Animesh",
    avatar: "/player_image/animesh.avif",
    attribute: CardAttribute.MICROMANAGER,
    stats: {
      health: 95,
      max_health: 95,
      attack: 14,
      defend: 22,
      special: 18,
    },
    moves: {
      attack: {
        type: MoveType.ATTACK,
        name: "Status Ping",
        description: "Asks for an update mid-sentence.",
        base_power: 14,
      },
      defend: {
        type: MoveType.DEFEND,
        name: "Process Shield",
        description: "Hides behind a wall of checklists.",
        base_power: 22,
      },
      special: {
        type: MoveType.SPECIAL,
        name: "Live Screen Share",
        description: "Forces everyone onto a shared desktop.",
        base_power: 18,
      },
    },
    is_defeated: false,
  },
  {
    id: 2,
    name: "Ayush",
    avatar: "/player_image/ayush.JPG",
    attribute: CardAttribute.NIGHT_OWL,
    stats: {
      health: 88,
      max_health: 88,
      attack: 20,
      defend: 12,
      special: 24,
    },
    moves: {
      attack: {
        type: MoveType.ATTACK,
        name: "Midnight Merge",
        description: "Ships a PR while the office sleeps.",
        base_power: 20,
      },
      defend: {
        type: MoveType.DEFEND,
        name: "Do Not Disturb",
        description: "Status set. Notifications off. Gone.",
        base_power: 12,
      },
      special: {
        type: MoveType.SPECIAL,
        name: "3am Breakthrough",
        description: "Suddenly solves the ticket at 03:17.",
        base_power: 24,
      },
    },
    is_defeated: false,
  },
  {
    id: 3,
    name: "Lil A",
    avatar: "/player_image/aneemes.avif",
    attribute: CardAttribute.CAFFEINE_ADDICT,
    stats: {
      health: 80,
      max_health: 80,
      attack: 26,
      defend: 10,
      special: 20,
    },
    moves: {
      attack: {
        type: MoveType.ATTACK,
        name: "Espresso Rush",
        description: "Triple shot. Zero patience.",
        base_power: 26,
      },
      defend: {
        type: MoveType.DEFEND,
        name: "Mug Fortress",
        description: "Clutches the travel mug like a shield.",
        base_power: 10,
      },
      special: {
        type: MoveType.SPECIAL,
        name: "Jitter Combo",
        description: "Types so fast the keyboard smokes.",
        base_power: 20,
      },
    },
    is_defeated: false,
  },
  {
    id: 4,
    name: "Ramit",
    avatar: "/player_image/ramit.jpeg",
    attribute: CardAttribute.GOSSIPER,
    stats: {
      health: 85,
      max_health: 85,
      attack: 16,
      defend: 14,
      special: 26,
    },
    moves: {
      attack: {
        type: MoveType.ATTACK,
        name: "Side-Channel Leak",
        description: "Drops a rumor that lands like a punch.",
        base_power: 16,
      },
      defend: {
        type: MoveType.DEFEND,
        name: "Plausible Denial",
        description: "I never said that. Who told you?",
        base_power: 14,
      },
      special: {
        type: MoveType.SPECIAL,
        name: "Watercooler Bomb",
        description: "Detonates drama across the open floor.",
        base_power: 26,
      },
    },
    is_defeated: false,
  },
  {
    id: 5,
    name: "Kastub",
    avatar: "/player_image/kastub.avif",
    attribute: CardAttribute.WORKAHOLIC,
    stats: {
      health: 110,
      max_health: 110,
      attack: 18,
      defend: 18,
      special: 16,
    },
    moves: {
      attack: {
        type: MoveType.ATTACK,
        name: "Overtime Slam",
        description: "Still online. Still booking meetings.",
        base_power: 18,
      },
      defend: {
        type: MoveType.DEFEND,
        name: "Calendar Armor",
        description: "Every slot is blocked. Forever.",
        base_power: 18,
      },
      special: {
        type: MoveType.SPECIAL,
        name: "Weekend Deploy",
        description: "Ships on Saturday. Apologizes on Monday.",
        base_power: 16,
      },
    },
    is_defeated: false,
  },
  {
    id: 6,
    name: "Ivy Quinn",
    avatar: "",
    attribute: CardAttribute.EARLY_BIRD,
    stats: {
      health: 92,
      max_health: 92,
      attack: 22,
      defend: 16,
      special: 14,
    },
    moves: {
      attack: {
        type: MoveType.ATTACK,
        name: "Dawn Standup",
        description: "Hits inbox zero before anyone wakes up.",
        base_power: 22,
      },
      defend: {
        type: MoveType.DEFEND,
        name: "Sunrise Buffer",
        description: "Already finished today's work at 7:05.",
        base_power: 16,
      },
      special: {
        type: MoveType.SPECIAL,
        name: "First-In Flex",
        description: "Lights on, coffee brewing, morale weaponized.",
        base_power: 14,
      },
    },
    is_defeated: false,
  },
  {
    id: 7,
    name: "Ajay",
    avatar: "/player_image/ajay.avif",
    attribute: CardAttribute.SMOKER,
    stats: {
      health: 78,
      max_health: 78,
      attack: 24,
      defend: 11,
      special: 22,
    },
    moves: {
      attack: {
        type: MoveType.ATTACK,
        name: "Smoke Break Ambush",
        description: "Returns from the balcony mid-argument.",
        base_power: 24,
      },
      defend: {
        type: MoveType.DEFEND,
        name: "Haze Cover",
        description: "Disappears into the designated zone.",
        base_power: 11,
      },
      special: {
        type: MoveType.SPECIAL,
        name: "Balcony Summit",
        description: "Negotiates deals between puffs.",
        base_power: 22,
      },
    },
    is_defeated: false,
  },
  {
    id: 8,
    name: "Sam Ortega",
    avatar: "",
    attribute: CardAttribute.SLACKER,
    stats: {
      health: 100,
      max_health: 100,
      attack: 12,
      defend: 24,
      special: 12,
    },
    moves: {
      attack: {
        type: MoveType.ATTACK,
        name: "Passive Poke",
        description: "Reacts with an emoji. Somehow deals damage.",
        base_power: 12,
      },
      defend: {
        type: MoveType.DEFEND,
        name: "Out of Office",
        description: "Auto-reply is the best defense.",
        base_power: 24,
      },
      special: {
        type: MoveType.SPECIAL,
        name: "Quiet Quitting Wave",
        description: "Does the bare minimum with maximum impact.",
        base_power: 12,
      },
    },
    is_defeated: false,
  },
];

export const CHARACTERS_BY_ID: Record<number, Card> = Object.fromEntries(
  CHARACTERS.map((card) => [card.id, card]),
);

export const CHARACTERS_BY_ATTRIBUTE: Record<CardAttribute, Card> =
  Object.fromEntries(
    CHARACTERS.map((card) => [card.attribute, card]),
  ) as Record<CardAttribute, Card>;
