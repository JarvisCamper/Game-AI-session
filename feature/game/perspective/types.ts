import type { MoveType, PlayerState } from "@/types";
import type { BattlePhase } from "../engine/battle";

/**
 * The perspective seam.
 * -----------------------------------------------------------------------
 * Everything the UI renders comes from a PerspectiveView, and every action it
 * takes goes through a BattleController. Neither type knows whether the game is
 * running locally (hot-seat) or over a socket.
 *
 * This is intentional: `PerspectiveView` is shaped like the `self` / `opponent`
 * split that MatchStartPayload and MoveResultPayload already deliver per-client.
 * When networking lands, a `useSocketBattle` hook implements the SAME
 * `BattleController` interface and the entire UI layer is reused untouched.
 */

/**
 * The world as ONE player sees it. `self` is always "me" (rendered as the
 * primary/bottom player); `opponent` is always "them" (top). Two clients look
 * at the same authoritative battle and each gets their own view where they are
 * the protagonist — that is the whole point of the perspective layer.
 */
export interface PerspectiveView {
  round: number;
  phase: BattlePhase;
  self: PlayerState;
  opponent: PlayerState;
  /** True when it is the viewpoint player's turn to act. */
  isMyTurn: boolean;
  activePlayerId: number;
  winnerId: number | null;
  /** null while in progress; true/false once the game is over. */
  amIWinner: boolean | null;
}

export type BattleEventKind =
  | "move"
  | "defeat"
  | "turn"
  | "taunt"
  | "game_over";

/** A single line in the battle log. `id` is a monotonic counter. */
export interface BattleEvent {
  id: number;
  kind: BattleEventKind;
  text: string;
  /** Which player caused it, for perspective-aware styling ("you" vs "them"). */
  actorPlayerId: number | null;
}

/**
 * What the UI depends on. A local hot-seat driver and a future socket driver
 * both satisfy this — the components never learn which is behind it.
 */
export interface BattleController {
  view: PerspectiveView;
  events: BattleEvent[];
  /** Seconds left on the current turn, or null if timers are disabled. */
  timeRemaining: number | null;
  /** Attempt the given move as the viewpoint player's active card. No-op if not your turn. */
  selectMove: (move: MoveType) => void;
  sendTaunt: () => void;
  leave: () => void;
  /** Dev-only: restart the match. */
  reset: () => void;
}
