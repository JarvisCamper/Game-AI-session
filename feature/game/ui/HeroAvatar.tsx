import type { Card } from "@/types";

/**
 * Circular "hero" portrait for the viewpoint player's own active card,
 * pinned bottom-right next to the move panel. The ring around it fills
 * clockwise with remaining HP so health is readable without glancing at the
 * full card up in the board row.
 */
export function HeroAvatar({ card }: { card: Card }) {
  const pct = Math.max(0, Math.min(1, card.stats.health / card.stats.max_health));
  const ringColor = pct > 0.5 ? "#34d399" : pct > 0.2 ? "#fbbf24" : "#f87171";

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="flex h-20 w-20 items-center justify-center rounded-full p-1"
        style={{
          background: `conic-gradient(${ringColor} ${pct * 360}deg, rgba(255,255,255,0.15) ${pct * 360}deg)`,
        }}
      >
        <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-black/40 bg-stone-900 text-3xl shadow-inner">
          {card.avatar}
        </div>
      </div>
      <p className="max-w-24 truncate text-center text-[10px] font-semibold text-white">
        {card.name}
      </p>
      <p className="text-[10px] tabular-nums text-white/60">
        {card.stats.health}/{card.stats.max_health}
      </p>
    </div>
  );
}
