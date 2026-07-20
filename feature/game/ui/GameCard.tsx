import type { Card } from "@/types";
import { HealthBar } from "./HealthBar";
import { TraitBadge } from "./TraitBadge";

/**
 * Illustrated card frame — big portrait, name plate, trait badge, HP bar.
 * `tilt` gives it the laid-on-the-table look from the reference board (each
 * card in a row sits at a slightly different angle); `isActive` lifts the
 * card flat, scaled up, and glowing so it reads as "this one is fighting".
 */
export function GameCard({
  card,
  isActive = false,
  faded = false,
  size = "md",
  tilt = 0,
}: {
  card: Card;
  isActive?: boolean;
  faded?: boolean;
  size?: "sm" | "md";
  tilt?: number;
}) {
  const dims = size === "md" ? "w-40" : "w-24";
  const artSize = size === "md" ? "text-5xl" : "text-3xl";
  const namePad = size === "md" ? "px-2.5 py-2" : "px-1.5 py-1";

  return (
    <div
      className={`${dims} shrink-0 transition-all duration-300 ${
        card.is_defeated ? "opacity-35 saturate-0" : faded ? "opacity-70" : "opacity-100"
      }`}
      style={{
        transform: isActive
          ? "rotate(0deg) translateY(-8px) scale(1.08)"
          : `rotate(${tilt}deg)`,
        zIndex: isActive ? 10 : 1,
      }}
    >
      <div
        className={`overflow-hidden rounded-2xl border-2 bg-linear-to-b from-stone-800/90 to-stone-900/95 shadow-xl transition-shadow ${
          isActive
            ? "border-amber-300/80 shadow-amber-400/30"
            : "border-white/15 shadow-black/40"
        }`}
      >
        {/* Portrait */}
        <div
          className={`flex items-center justify-center bg-linear-to-b from-white/10 to-black/30 ${
            size === "md" ? "py-4" : "py-2.5"
          }`}
        >
          <span className={artSize}>{card.avatar}</span>
        </div>

        {/* Name plate */}
        <div className={`border-t border-white/10 bg-black/40 ${namePad}`}>
          <h3
            className={`truncate font-semibold text-white ${
              size === "md" ? "text-sm" : "text-[10px]"
            }`}
          >
            {card.name}
          </h3>
          {size === "md" && (
            <div className="mt-1">
              <TraitBadge attribute={card.attribute} />
            </div>
          )}
          <div className="mt-1.5">
            <HealthBar stats={card.stats} showNumbers={size === "md"} />
          </div>
        </div>
      </div>

      {card.is_defeated && (
        <p className="mt-1 text-center text-[9px] font-bold uppercase tracking-widest text-red-400">
          Defeated
        </p>
      )}
      {isActive && !card.is_defeated && (
        <p className="mt-1 text-center text-[9px] font-bold uppercase tracking-widest text-amber-300">
          Fighting
        </p>
      )}
    </div>
  );
}
