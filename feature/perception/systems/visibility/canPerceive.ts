import type { PerceptionContext, VisibilityRule } from "./types";

/**
 * Pure resolver: given a rule and the current player's context, can they see it?
 * No React, no stores — trivially unit-testable and reusable on the server later
 * for authoritative validation ("did this player really have line-of-sight?").
 */
export function canPerceive(
  rule: VisibilityRule,
  ctx: PerceptionContext,
): boolean {
  switch (rule.kind) {
    case "everyone":
      return true;
    case "players":
      return rule.playerIds.includes(ctx.playerId);
    case "roles":
      return rule.roles.includes(ctx.role);
    case "condition":
      return rule.predicate(ctx);
    default: {
      // Exhaustiveness guard: adding a rule kind without handling it is a type error.
      const _exhaustive: never = rule;
      return _exhaustive;
    }
  }
}
