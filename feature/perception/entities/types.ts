import type { Vec2 } from "../store/usePlayerStore";
import type { VisibilityRule } from "../systems/visibility/types";

/**
 * A thing in the world. Purely declarative data — position, appearance, and who
 * may perceive it. The scene renders entities generically by mapping over them;
 * no entity type is special-cased. Interaction behaviour is added in a later step.
 */
export interface WorldEntity {
  id: string;
  position: Vec2;
  size: Vec2;
  color: string;
  label: string;
  rule: VisibilityRule;
}
