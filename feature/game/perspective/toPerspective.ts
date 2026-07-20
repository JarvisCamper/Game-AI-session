import { opponentIdOf, type BattleState } from "../engine/battle";
import type { PerspectiveView } from "./types";

/**
 * Project the authoritative BattleState down to a single player's point of view.
 * PURE — this is the exact transform the server runs before it sends each
 * client its `self` / `opponent` payload. Rendering the "primary player at the
 * bottom" is then just: always draw `view.self` on the bottom, `view.opponent`
 * on top. Swap the viewpoint id and the board flips.
 */
export function toPerspective(
  state: BattleState,
  viewpointId: number,
): PerspectiveView {
  const opponentId = opponentIdOf(state, viewpointId);
  const isOver = state.phase === "game_over";

  return {
    round: state.round,
    phase: state.phase,
    self: state.players[viewpointId],
    opponent: state.players[opponentId],
    isMyTurn: !isOver && state.activePlayerId === viewpointId,
    activePlayerId: state.activePlayerId,
    winnerId: state.winnerId,
    amIWinner: isOver ? state.winnerId === viewpointId : null,
  };
}
