"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MoveType } from "@/types";
import { toPerspective } from "./toPerspective";
import { useBattleStore } from "./useBattleStore";
import type { BattleController } from "./types";

/**
 * The LOCAL hot-seat driver — one concrete implementation of BattleController.
 * -----------------------------------------------------------------------
 * It owns the turn clock and translates UI intent into store dispatches. To go
 * multiplayer, write a `useSocketBattle(viewpointId)` that returns the same
 * BattleController (view from inbound MATCH_START/MOVE_RESULT, actions as
 * outbound MOVE_SELECT/TAUNT/LEAVE messages) and swap it in GameScene. Nothing
 * else changes.
 */

/** Per-turn budget. Mirrors TurnStartPayload.turn_timeout_seconds. */
export const TURN_SECONDS = 30;

export function useLocalBattle(viewpointId: number): BattleController {
  const state = useBattleStore((s) => s.state);
  const events = useBattleStore((s) => s.events);
  const dispatchMove = useBattleStore((s) => s.dispatchMove);
  const dispatchTaunt = useBattleStore((s) => s.dispatchTaunt);
  const reset = useBattleStore((s) => s.reset);

  const view = toPerspective(state, viewpointId);

  const [timeRemaining, setTimeRemaining] = useState(TURN_SECONDS);

  // Keep the latest active player in a ref so the timeout handler never fires
  // against a stale turn.
  const activePlayerRef = useRef(state.activePlayerId);
  activePlayerRef.current = state.activePlayerId;

  // One countdown per turn. Resetting the key (active player / round / phase)
  // restarts the clock; hitting zero auto-attacks so the match never stalls.
  useEffect(() => {
    if (state.phase === "game_over") return;
    setTimeRemaining(TURN_SECONDS);

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          dispatchMove(activePlayerRef.current, MoveType.ATTACK);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.activePlayerId, state.round, state.phase, dispatchMove]);

  const selectMove = useCallback(
    (move: MoveType) => dispatchMove(viewpointId, move),
    [dispatchMove, viewpointId],
  );

  const sendTaunt = useCallback(
    () => dispatchTaunt(viewpointId),
    [dispatchTaunt, viewpointId],
  );

  const leave = useCallback(() => {
    // Placeholder: locally, leaving just resets the sandbox. Over a socket this
    // becomes a LEAVE_ROOM message + navigation.
    reset();
  }, [reset]);

  return {
    view,
    events,
    timeRemaining,
    selectMove,
    sendTaunt,
    leave,
    reset,
  };
}
