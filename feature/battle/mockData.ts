import { Card, CardAttribute, MoveType, PlayerState } from "@/types";

function move(
  type: MoveType,
  name: string,
  base_power: number,
  description: string
) {
  return { type, name, base_power, description };
}

const selfCards: [Card, Card, Card] = [
  {
    id: 1,
    name: "Big Steve",
    avatar: "\u{1F454}",
    attribute: CardAttribute.WORKAHOLIC,
    stats: { health: 68, max_health: 68, attack: 13, defend: 9, special: 11 },
    moves: {
      attack: move(MoveType.ATTACK, "Deadline Crunch", 18, "Slams the desk with a 6pm deadline."),
      defend: move(MoveType.DEFEND, "Coffee Break Shield", 14, "Steps away just long enough to dodge the blame."),
      special: move(MoveType.SPECIAL, "All-Nighter", 24, "Pulls an all-nighter, powered by pure spite."),
    },
    is_defeated: false,
  },
  {
    id: 2,
    name: "Gary the Gossiper",
    avatar: "\u{1F9D1}",
    attribute: CardAttribute.GOSSIPER,
    stats: { health: 54, max_health: 54, attack: 11, defend: 8, special: 14 },
    moves: {
      attack: move(MoveType.ATTACK, "Watercooler Leak", 16, "Spills a rumor at full volume."),
      defend: move(MoveType.DEFEND, "Plausible Deniability", 12, "\"I never said that.\""),
      special: move(MoveType.SPECIAL, "CC The Whole Team", 22, "Reply-all chaos ensues."),
    },
    is_defeated: false,
  },
  {
    id: 3,
    name: "Nadia Night-Owl",
    avatar: "\u{1F9DB}",
    attribute: CardAttribute.NIGHT_OWL,
    stats: { health: 58, max_health: 58, attack: 12, defend: 10, special: 12 },
    moves: {
      attack: move(MoveType.ATTACK, "Midnight Merge", 17, "Ships code nobody reviewed."),
      defend: move(MoveType.DEFEND, "Do Not Disturb", 15, "Slack status: invisible."),
      special: move(MoveType.SPECIAL, "3AM Inspiration", 21, "A caffeinated stroke of genius."),
    },
    is_defeated: false,
  },
];

const opponentCards: [Card, Card, Card] = [
  {
    id: 4,
    name: "Karen from Accounting",
    avatar: "\u{1F469}",
    attribute: CardAttribute.MICROMANAGER,
    stats: { health: 60, max_health: 60, attack: 12, defend: 12, special: 10 },
    moves: {
      attack: move(MoveType.ATTACK, "Can I Get an Update?", 17, "Pings you every 20 minutes."),
      defend: move(MoveType.DEFEND, "CC'd Into Oblivion", 16, "Buries you in a paper trail."),
      special: move(MoveType.SPECIAL, "Surprise Audit", 23, "Nobody expects the spreadsheet review."),
    },
    is_defeated: false,
  },
  {
    id: 5,
    name: "Chad the Slacker",
    avatar: "\u{1F60E}",
    attribute: CardAttribute.SLACKER,
    stats: { health: 62, max_health: 62, attack: 10, defend: 11, special: 12 },
    moves: {
      attack: move(MoveType.ATTACK, "Passive Aggressive Sticky Note", 15, "Leaves it right on your monitor."),
      defend: move(MoveType.DEFEND, "\"I'm On It\"", 17, "He is not, in fact, on it."),
      special: move(MoveType.SPECIAL, "Mysterious Disappearance", 20, "Gone for a 'meeting' since 2pm."),
    },
    is_defeated: false,
  },
  {
    id: 6,
    name: "Early-Bird Emma",
    avatar: "\u{1F469}‍\u{1F4BC}",
    attribute: CardAttribute.EARLY_BIRD,
    stats: { health: 56, max_health: 56, attack: 13, defend: 9, special: 13 },
    moves: {
      attack: move(MoveType.ATTACK, "6AM Standup", 18, "Calls a meeting before sunrise."),
      defend: move(MoveType.DEFEND, "Already Did It", 13, "Finished before you even logged in."),
      special: move(MoveType.SPECIAL, "Sunrise Sprint Review", 22, "Relentless, chipper productivity."),
    },
    is_defeated: false,
  },
];

export const MOCK_SELF: PlayerState = {
  player_id: 1,
  name: "You",
  scoreboard: { wins: 2, losses: 1 },
  cards: selfCards,
  active_card_index: 0,
};

export const MOCK_OPPONENT: PlayerState = {
  player_id: 2,
  name: "The Regional Manager",
  scoreboard: { wins: 1, losses: 2 },
  cards: opponentCards,
  active_card_index: 0,
};

export const TAUNT_LINES = [
  "Is this going to be a whole thing?",
  "I have a meeting in five minutes, let's wrap this up.",
  "Per my last email...",
  "Circling back on this attack.",
  "That's not in my job description.",
  "Let's take this offline.",
];
