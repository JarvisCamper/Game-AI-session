import type { Vec2 } from "../../store/usePlayerStore";

/**
 * The contract the networking developer will implement (Socket.IO, server-
 * authoritative). Gameplay code depends ONLY on this interface — never on a
 * concrete transport — so the real adapter can be dropped in with zero changes
 * to scenes, stores, or puzzles.
 *
 * `on*` methods return an unsubscribe function (standard listener pattern).
 */
export interface NetworkAdapter {
  // ---- outbound (client -> server) ----
  sendPlayerMovement(pos: Vec2): void;
  sendInteraction(entityId: string): void;

  // ---- inbound (server -> client) ----
  onRemotePlayerUpdate(
    cb: (playerId: string, pos: Vec2) => void,
  ): () => void;
  onPuzzleStateChanged(cb: (puzzleId: string, solved: boolean) => void): () => void;
}
