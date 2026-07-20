import type { CardAttribute } from "@/types";
import { TRAIT_META } from "../traits";

/**
 * Small pill showing a card's office attribute — icon + label, colour-coded
 * per trait so the effectiveness wheel is legible at a glance on the board.
 */
export function TraitBadge({
  attribute,
  size = "md",
}: {
  attribute: CardAttribute;
  size?: "sm" | "md";
}) {
  const meta = TRAIT_META[attribute];
  const padding = size === "md" ? "px-2 py-0.5 text-[9px]" : "px-1.5 py-0.5 text-[8px]";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-semibold uppercase tracking-wider ${padding} ${meta.className}`}
    >
      <span aria-hidden>{meta.icon}</span>
      {meta.label}
    </span>
  );
}
