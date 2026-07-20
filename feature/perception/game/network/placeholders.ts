import type { Vec2 } from "../../store/usePlayerStore";
import type { NetworkAdapter } from "./types";

/**
 * No-op stand-in for the real Socket.IO adapter. Gameplay calls these today and
 * nothing happens over the wire; the networking dev replaces this module (or
 * provides an alternative NetworkAdapter) without touching call sites.
 */
export const placeholderNetwork: NetworkAdapter = {
  sendPlayerMovement(_pos: Vec2) {
    // TODO(networking): emit "player:move" to the server.
  },
  sendInteraction(_entityId: string) {
    // TODO(networking): emit "player:interact" to the server.
  },
  onRemotePlayerUpdate(_cb) {
    // TODO(networking): subscribe to "player:update" broadcasts.
    return () => {};
  },
  onPuzzleStateChanged(_cb) {
    // TODO(networking): subscribe to authoritative "puzzle:state" updates.
    return () => {};
  },
};
