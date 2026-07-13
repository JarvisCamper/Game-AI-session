import { Card } from "@/types";
import AttributeBadge from "./AttributeBadge";
import HealthBar from "./HealthBar";

export default function CardFace({
  card,
  isActiveTurn,
  shaking,
}: {
  card: Card;
  isActiveTurn: boolean;
  shaking: boolean;
}) {
  return (
    <div
      className={`comic-border halftone relative w-full max-w-55 rounded-2xl bg-card p-[clamp(0.4rem,1.5vh,1rem)] sm:max-w-65 ${
        isActiveTurn ? "animate-pulse-glow" : ""
      } ${shaking ? "animate-hit-shake" : ""} ${
        card.is_defeated ? "grayscale" : ""
      }`}
    >
      {card.is_defeated && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <span className="comic-border-sm text-stroke -rotate-12 rounded-md bg-attack px-3 py-1 font-comic text-xl tracking-wider text-white">
            K.O.
          </span>
        </div>
      )}

      <div className="mb-[clamp(0.1rem,0.6vh,0.5rem)] flex items-start justify-between gap-2">
        <h3 className="font-comic text-[clamp(0.85rem,2.4vh,1.25rem)] leading-none tracking-wide text-foreground">
          {card.name}
        </h3>
      </div>

      <div className="mb-[clamp(0.1rem,0.6vh,0.5rem)] flex items-center justify-between">
        <AttributeBadge attribute={card.attribute} />
      </div>

      <div className="halftone-blue comic-border-sm mx-auto mb-[clamp(0.35rem,1.2vh,0.75rem)] flex h-[clamp(2.25rem,8vh,6rem)] w-[clamp(2.25rem,8vh,6rem)] items-center justify-center rounded-full bg-surface text-[clamp(1.1rem,4vh,3rem)]">
        <span aria-hidden>{card.avatar}</span>
      </div>

      <HealthBar health={card.stats.health} maxHealth={card.stats.max_health} />
    </div>
  );
}
