import type { PlayerState } from "@/types";
import { GameCard } from "./GameCard";

/** Fan-tilt applied to non-active cards so a row reads as laid on a table rather than flat-stacked. */
const BENCH_TILT = [-6, 0, 6];

/**
 * One player's full trio, laid out as a single row exactly like the reference
 * board — three cards side by side, the currently-fighting one lifted and
 * glowing, the other two tilted slightly as if resting on the table. Only the
 * active card's moves are usable; the bench is informational.
 */
export function CardRow({ player }: { player: PlayerState }) {
  return (
    <div className="flex items-end justify-center gap-4 [perspective:900px]">
      {player.cards.map((card, i) => (
        <GameCard
          key={card.id}
          card={card}
          isActive={i === player.active_card_index}
          faded={i !== player.active_card_index}
          tilt={BENCH_TILT[i]}
        />
      ))}
    </div>
  );
}
