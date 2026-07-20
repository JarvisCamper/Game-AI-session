import type { PlayerRole } from "../../store/usePlayerStore";

/**
 * Everything the visibility system needs to know about the *current* player in
 * order to decide what they can perceive. Kept deliberately small and derived
 * from stores — never passed around manually by puzzle code.
 */
export interface PerceptionContext {
  playerId: string;
  role: PlayerRole;
  flags: Record<string, boolean>;
}

/**
 * A declarative description of WHO may perceive an entity. This is the seam that
 * keeps visibility out of puzzle logic: puzzles/entities describe intent, the
 * renderer resolves it. Add new rule kinds here rather than branching in scenes.
 */
export type VisibilityRule =
  | { kind: "everyone" }
  | { kind: "players"; playerIds: string[] }
  | { kind: "roles"; roles: PlayerRole[] }
  | { kind: "condition"; predicate: (ctx: PerceptionContext) => boolean };
