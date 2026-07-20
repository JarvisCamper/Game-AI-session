import type { CardStats } from "@/types";

/**
 * Reusable HP bar. Colour shifts green -> amber -> red as health drops.
 * Kept standalone so cards, HUD, and any future summary screen share it.
 */
export function HealthBar({
  stats,
  showNumbers = true,
}: {
  stats: Pick<CardStats, "health" | "max_health">;
  showNumbers?: boolean;
}) {
  const pct = Math.max(0, Math.min(1, stats.health / stats.max_health));
  const color =
    pct > 0.5 ? "bg-emerald-400" : pct > 0.2 ? "bg-amber-400" : "bg-red-500";

  return (
    <div className="w-full">
      <div className="h-2 w-full overflow-hidden rounded-full bg-black/30">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
      {showNumbers && (
        <p className="mt-1 text-right text-[10px] font-medium tabular-nums text-white/70">
          {stats.health}/{stats.max_health}
        </p>
      )}
    </div>
  );
}
