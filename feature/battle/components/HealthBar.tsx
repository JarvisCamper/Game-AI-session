export default function HealthBar({
  health,
  maxHealth,
  hit = false,
}: {
  health: number;
  maxHealth: number;
  hit?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, (health / maxHealth) * 100));
  const barColor =
    pct > 50 ? "bg-defend" : pct > 20 ? "bg-special" : "bg-attack";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-0.5 pb-1">
        <span className="font-comic text-[11px] tracking-wide text-foreground/70">
          HP
        </span>
        <span className="font-sans text-[11px] font-bold tabular-nums text-foreground/90">
          {health}/{maxHealth}
        </span>
      </div>
      <div className="h-3.5 w-full overflow-hidden rounded-full border-2 border-black bg-black/60">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor} ${
            hit ? "animate-hit-shake" : ""
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
