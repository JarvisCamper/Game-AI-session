import { MoveType, type Card } from "@/types";

const FAN_TILT = [-6, 0, 6];

/**
 * The viewpoint player's hand — attack/defend/special rendered as a fanned
 * trio of cards, like the reference's bottom hand. SPECIAL is intentionally
 * disabled for now — attack/defend only until special-attack balancing is
 * ready. Re-enable by dropping the `disabled` prop.
 */
export function MovePanel({
  card,
  disabled,
  onSelect,
}: {
  card: Card;
  disabled: boolean;
  onSelect: (move: MoveType) => void;
}) {
  return (
    <div className="flex items-end gap-2">
      <MoveCard
        label={card.moves.attack.name}
        sub="Attack"
        power={card.moves.attack.base_power}
        disabled={disabled}
        onClick={() => onSelect(MoveType.ATTACK)}
        accent="border-red-400/50 hover:bg-red-400/15"
        tilt={FAN_TILT[0]}
      />
      <MoveCard
        label={card.moves.defend.name}
        sub="Defend"
        power={card.moves.defend.base_power}
        disabled={disabled}
        onClick={() => onSelect(MoveType.DEFEND)}
        accent="border-sky-400/50 hover:bg-sky-400/15"
        tilt={FAN_TILT[1]}
      />
      <MoveCard
        label={card.moves.special.name}
        sub="Special · on hold"
        power={card.moves.special.base_power}
        disabled
        onClick={() => onSelect(MoveType.SPECIAL)}
        accent="border-violet-400/50"
        tilt={FAN_TILT[2]}
        locked
      />
    </div>
  );
}

function MoveCard({
  label,
  sub,
  power,
  disabled,
  onClick,
  accent,
  tilt,
  locked = false,
}: {
  label: string;
  sub: string;
  power: number;
  disabled: boolean;
  onClick: () => void;
  accent: string;
  tilt: number;
  locked?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{ transform: `rotate(${disabled ? 0 : tilt}deg)` }}
      className={`relative w-28 shrink-0 rounded-xl border-2 ${accent} bg-linear-to-b from-stone-800/90 to-stone-900/95 px-2.5 py-2.5 text-left text-white shadow-lg shadow-black/40 transition enabled:hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-40`}
    >
      <span className="absolute -left-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-amber-200/60 bg-stone-900 text-[10px] font-bold text-amber-200">
        {power}
      </span>
      {locked && <span className="absolute right-2 top-2 text-xs">🔒</span>}
      <p className="mt-3 truncate text-xs font-semibold">{label}</p>
      <p className="text-[9px] uppercase tracking-widest text-white/50">
        {sub}
      </p>
    </button>
  );
}
