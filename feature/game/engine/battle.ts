import {
  MoveType,
  type Card,
  type MoveEffectiveness,
  type PlayerState,
} from "@/types";
import { EFFECTIVENESS_MULTIPLIER, getEffectiveness } from "./effectiveness";

/**
 * Battle engine — the authoritative, PURE game logic.
 * -----------------------------------------------------------------------
 * No React, no zustand, no sockets. Everything here is a plain function of
 * its inputs and returns brand-new state (never mutates). This is the layer
 * that will eventually live on the server; the client mirrors it so it can
 * preview outcomes. Keep it dependency-free so it can be unit tested and
 * shared verbatim with the backend.
 */

export type BattlePhase = "in_progress" | "game_over";

/** Full authoritative state — holds BOTH players, keyed by player_id. */
export interface BattleState {
  round: number;
  /** Both players, keyed by player_id. Perspective is derived, never stored. */
  players: Record<number, PlayerState>;
  /** Stable turn order: [firstPlayerId, secondPlayerId]. */
  playerOrder: [number, number];
  /** Whose turn it currently is. */
  activePlayerId: number;
  phase: BattlePhase;
  winnerId: number | null;
}

/** The resolved result of a single move — mirrors MoveResultPayload's core. */
export interface MoveOutcome {
  attackerPlayerId: number;
  attackerCard: Card;
  defenderPlayerId: number;
  defenderCard: Card;
  move: MoveType;
  effectiveness: MoveEffectiveness | null;
  /** Damage dealt to the defender (0 for DEFEND). */
  damage: number;
  /** Health restored to the attacker's own card (0 for ATTACK/SPECIAL). */
  healed: number;
  defenderRemainingHealth: number;
  defenderDefeated: boolean;
  nextActiveCardIndex: 0 | 1 | 2 | null;
  gameOver: boolean;
  winnerId: number | null;
}

// -----------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------

export function opponentIdOf(state: BattleState, playerId: number): number {
  const [a, b] = state.playerOrder;
  return playerId === a ? b : a;
}

export function activeCardOf(player: PlayerState): Card {
  return player.cards[player.active_card_index];
}

/** First non-defeated card index, or null if the whole team is down. */
function firstAliveIndex(player: PlayerState): 0 | 1 | 2 | null {
  const idx = player.cards.findIndex((c) => !c.is_defeated);
  return idx === -1 ? null : (idx as 0 | 1 | 2);
}

// -----------------------------------------------------------------------
// Damage / heal math
// -----------------------------------------------------------------------

/** Which stat a move scales off. */
function statForMove(card: Card, move: MoveType): number {
  switch (move) {
    case MoveType.ATTACK:
      return card.stats.attack;
    case MoveType.SPECIAL:
      return card.stats.special;
    case MoveType.DEFEND:
      return card.stats.defend;
  }
}

/**
 * Placeholder combat math — deliberately simple and easy to retune.
 * ATTACK/SPECIAL damage the opponent's active card and are scaled by attribute
 * effectiveness; DEFEND heals the attacker's own active card instead.
 */
const STAT_DIVISOR = 60;

// -----------------------------------------------------------------------
// Construction
// -----------------------------------------------------------------------

export function createBattle(
  first: PlayerState,
  second: PlayerState,
): BattleState {
  return {
    round: 1,
    players: { [first.player_id]: first, [second.player_id]: second },
    playerOrder: [first.player_id, second.player_id],
    activePlayerId: first.player_id,
    phase: "in_progress",
    winnerId: null,
  };
}

// -----------------------------------------------------------------------
// The one mutation entry point
// -----------------------------------------------------------------------

/**
 * Resolve the active player's chosen move against the current board and return
 * the next state plus a structured outcome. Illegal calls (not your turn, game
 * already over) return the state unchanged with a null outcome.
 */
export function applyMove(
  state: BattleState,
  actingPlayerId: number,
  move: MoveType,
): { state: BattleState; outcome: MoveOutcome | null } {
  if (state.phase === "game_over" || actingPlayerId !== state.activePlayerId) {
    return { state, outcome: null };
  }

  const attackerId = actingPlayerId;
  const defenderId = opponentIdOf(state, attackerId);
  const attacker = state.players[attackerId];
  const defender = state.players[defenderId];
  const attackerCard = activeCardOf(attacker);
  const defenderCard = activeCardOf(defender);

  let nextAttacker = attacker;
  let nextDefender = defender;

  let damage = 0;
  let healed = 0;
  let effectiveness: MoveEffectiveness | null = null;
  let defenderRemainingHealth = defenderCard.stats.health;
  let defenderDefeated = false;
  let nextActiveCardIndex: 0 | 1 | 2 | null = defender.active_card_index;

  const stat = statForMove(attackerCard, move);

  if (move === MoveType.DEFEND) {
    // Heal the attacker's own active card, capped at max health.
    const raw = Math.round(
      attackerCard.moves.defend.base_power * (stat / STAT_DIVISOR),
    );
    const newHealth = Math.min(
      attackerCard.stats.max_health,
      attackerCard.stats.health + raw,
    );
    healed = newHealth - attackerCard.stats.health;
    nextAttacker = replaceActiveCard(attacker, {
      ...attackerCard,
      stats: { ...attackerCard.stats, health: newHealth },
    });
  } else {
    // ATTACK / SPECIAL — damage the defender's active card.
    effectiveness = getEffectiveness(
      attackerCard.attribute,
      defenderCard.attribute,
    );
    const basePower =
      move === MoveType.ATTACK
        ? attackerCard.moves.attack.base_power
        : attackerCard.moves.special.base_power;
    damage = Math.max(
      1,
      Math.round(
        basePower * (stat / STAT_DIVISOR) * EFFECTIVENESS_MULTIPLIER[effectiveness],
      ),
    );
    defenderRemainingHealth = Math.max(0, defenderCard.stats.health - damage);
    defenderDefeated = defenderRemainingHealth === 0;

    const updatedDefenderCard: Card = {
      ...defenderCard,
      stats: { ...defenderCard.stats, health: defenderRemainingHealth },
      is_defeated: defenderDefeated,
    };
    nextDefender = replaceActiveCard(defender, updatedDefenderCard);

    if (defenderDefeated) {
      nextActiveCardIndex = firstAliveIndex(nextDefender);
      if (nextActiveCardIndex !== null) {
        nextDefender = { ...nextDefender, active_card_index: nextActiveCardIndex };
      }
    }
  }

  const gameOver = defenderDefeated && nextActiveCardIndex === null;
  const winnerId = gameOver ? attackerId : null;

  const players: Record<number, PlayerState> = {
    ...state.players,
    [attackerId]: nextAttacker,
    [defenderId]: nextDefender,
  };

  const nextState: BattleState = gameOver
    ? { ...state, players, phase: "game_over", winnerId }
    : {
        ...state,
        players,
        activePlayerId: defenderId,
        round: state.round + 1,
      };

  const outcome: MoveOutcome = {
    attackerPlayerId: attackerId,
    attackerCard: activeCardOf(nextAttacker),
    defenderPlayerId: defenderId,
    defenderCard: activeCardOf(nextDefender),
    move,
    effectiveness,
    damage,
    healed,
    defenderRemainingHealth,
    defenderDefeated,
    nextActiveCardIndex,
    gameOver,
    winnerId,
  };

  return { state: nextState, outcome };
}

/** Immutably swap the player's currently-active card for an updated copy. */
function replaceActiveCard(player: PlayerState, card: Card): PlayerState {
  const cards = [...player.cards] as [Card, Card, Card];
  cards[player.active_card_index] = card;
  return { ...player, cards };
}
