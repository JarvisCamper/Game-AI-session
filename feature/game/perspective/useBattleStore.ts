import { create } from "zustand";
import { MoveEffectiveness, MoveType } from "@/types";
import {
  activeCardOf,
  applyMove,
  createBattle,
  type BattleState,
  type MoveOutcome,
} from "../engine/battle";
import { makeMockPlayers } from "../mockGame";
import type { BattleEvent } from "./types";

/**
 * The authoritative store — holds the ONE shared BattleState plus the log.
 * -----------------------------------------------------------------------
 * In local hot-seat mode this stands in for the server: a single source of
 * truth that both perspectives read from. When networking lands, this store is
 * fed by inbound socket messages instead of by local `applyMove` calls, but its
 * shape (state + events) stays identical, so `toPerspective` and the UI don't
 * change.
 */

interface BattleStore {
  state: BattleState;
  events: BattleEvent[];
  nextEventId: number;

  /** Resolve a move locally (the local "transport"). */
  dispatchMove: (playerId: number, move: MoveType) => void;
  /** Emit a canned taunt from a player's active card. */
  dispatchTaunt: (playerId: number) => void;
  reset: () => void;
}

function initialState(): BattleState {
  const { self, opponent } = makeMockPlayers();
  return createBattle(self, opponent);
}

const EFFECTIVENESS_TAG: Record<MoveEffectiveness, string> = {
  [MoveEffectiveness.WEAK]: " (not very effective)",
  [MoveEffectiveness.NEUTRAL]: "",
  [MoveEffectiveness.STRONG]: " — super effective!",
};

const TAUNTS = [
  "Is that all you've got?",
  "I do this before my morning coffee.",
  "You're going to want to schedule a retro after this.",
  "Circling back to finish you off.",
  "Let's take this offline. Permanently.",
];

function outcomeToEvents(
  state: BattleState,
  outcome: MoveOutcome,
  startId: number,
): BattleEvent[] {
  const events: BattleEvent[] = [];
  let id = startId;
  const attackerName = outcome.attackerCard.name;

  if (outcome.move === MoveType.DEFEND) {
    events.push({
      id: id++,
      kind: "move",
      actorPlayerId: outcome.attackerPlayerId,
      text: `${attackerName} braced and recovered ${outcome.healed} HP.`,
    });
  } else {
    const moveName =
      outcome.move === MoveType.ATTACK
        ? outcome.attackerCard.moves.attack.name
        : outcome.attackerCard.moves.special.name;
    const tag = outcome.effectiveness
      ? EFFECTIVENESS_TAG[outcome.effectiveness]
      : "";
    events.push({
      id: id++,
      kind: "move",
      actorPlayerId: outcome.attackerPlayerId,
      text: `${attackerName} used ${moveName} — ${outcome.damage} dmg${tag}`,
    });
  }

  if (outcome.defenderDefeated) {
    events.push({
      id: id++,
      kind: "defeat",
      actorPlayerId: outcome.defenderPlayerId,
      text: `${outcome.defenderCard.name} was knocked out!`,
    });
  }

  if (outcome.gameOver) {
    const winner = outcome.winnerId != null ? state.players[outcome.winnerId] : null;
    events.push({
      id: id++,
      kind: "game_over",
      actorPlayerId: outcome.winnerId,
      text: `${winner?.name ?? "Someone"} wins the match!`,
    });
  }

  return events;
}

export const useBattleStore = create<BattleStore>((set) => ({
  state: initialState(),
  events: [],
  nextEventId: 1,

  dispatchMove: (playerId, move) =>
    set((store) => {
      const { state, outcome } = applyMove(store.state, playerId, move);
      if (!outcome) return store; // illegal move (not your turn / game over)
      const newEvents = outcomeToEvents(state, outcome, store.nextEventId);
      return {
        state,
        events: [...store.events, ...newEvents],
        nextEventId: store.nextEventId + newEvents.length,
      };
    }),

  dispatchTaunt: (playerId) =>
    set((store) => {
      if (store.state.phase === "game_over") return store;
      const card = activeCardOf(store.state.players[playerId]);
      const line = TAUNTS[card.id % TAUNTS.length];
      return {
        events: [
          ...store.events,
          {
            id: store.nextEventId,
            kind: "taunt",
            actorPlayerId: playerId,
            text: `${card.name}: "${line}"`,
          },
        ],
        nextEventId: store.nextEventId + 1,
      };
    }),

  reset: () => set({ state: initialState(), events: [], nextEventId: 1 }),
}));
