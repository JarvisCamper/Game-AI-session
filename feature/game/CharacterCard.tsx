import { Card } from "@/types";

/**
 * CharacterCard — renders a single "office member" battle card.
 *
 * This is a minimal starting point. Build it out: stat bars, move list,
 * attribute badge, health bar, defeated state, active/selected styling, etc.
 */
export default function CharacterCard({ card }: { card: Card }) {
  return (
    <div className="w-56 rounded-xl border border-black/15 dark:border-white/20 p-4">
      <div className="text-4xl">{card.avatar}</div>
      <h3 className="mt-2 font-semibold">{card.name}</h3>
      <p className="text-xs uppercase tracking-widest opacity-50">
        {card.attribute}
      </p>
      <p className="mt-2 text-sm opacity-70">
        HP {card.stats.health}/{card.stats.max_health}
      </p>
    </div>
  );
}
