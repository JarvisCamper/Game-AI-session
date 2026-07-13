import { Card } from "@/types";

export default function CardThumb({
  card,
  active,
}: {
  card: Card;
  active: boolean;
}) {
  const pct = Math.max(
    0,
    Math.min(100, (card.stats.health / card.stats.max_health) * 100)
  );
  const barColor =
    pct > 50 ? "bg-defend" : pct > 20 ? "bg-special" : "bg-attack";

  return (
    <div
      className={`comic-border-sm relative flex h-[clamp(1.75rem,5vh,3.5rem)] w-[clamp(1.75rem,5vh,3.5rem)] flex-col items-center justify-center rounded-lg bg-surface text-[clamp(0.9rem,2.4vh,1.5rem)] ${
        card.is_defeated ? "grayscale opacity-60" : ""
      } ${active ? "glow-blue" : ""}`}
      title={card.name}
    >
      <span aria-hidden>{card.avatar}</span>
      <span className="mt-1 h-1 w-8 overflow-hidden rounded-full bg-black/60">
        <span
          className={`block h-full ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </span>
      {card.is_defeated && (
        <span className="absolute inset-0 flex items-center justify-center font-comic text-attack text-lg">
          ×
        </span>
      )}
    </div>
  );
}
