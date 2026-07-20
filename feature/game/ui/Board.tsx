import type { PlayerState } from "@/types";
import { CardRow } from "./CardRow";

/**
 * The battlefield: opponent's row on top, self's row on the bottom, each
 * player's full trio laid out side by side. Board always receives
 * `self`/`opponent` from the viewpoint player's PerspectiveView, so the SAME
 * component draws a mirrored board for each client without special-casing.
 */
export function Board({
  self,
  opponent,
}: {
  self: PlayerState;
  opponent: PlayerState;
}) {
  return (
    <div className="mx-auto flex h-full w-full max-w-350 flex-col items-center justify-between px-6 py-32">
      <CardRow player={opponent} />
      <CardRow player={self} />
    </div>
  );
}
