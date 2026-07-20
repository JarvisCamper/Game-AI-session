"use client";

import type { ReactNode } from "react";
import { usePlayerStore } from "../../store/usePlayerStore";
import { canPerceive } from "./canPerceive";
import type { VisibilityRule } from "./types";

/**
 * Rendering gate. Wrap ANY entity in <Perceivable rule={...}> and it renders only
 * when the current player is allowed to perceive it. This is the single place the
 * visibility decision touches the render tree — scenes stay declarative and never
 * hardcode "if role === A".
 */
export function Perceivable({
  rule,
  children,
}: {
  rule: VisibilityRule;
  children: ReactNode;
}) {
  const playerId = usePlayerStore((s) => s.localPlayerId);
  const role = usePlayerStore((s) => s.role);
  const flags = usePlayerStore((s) => s.flags);

  if (!canPerceive(rule, { playerId, role, flags })) return null;
  return <>{children}</>;
}
