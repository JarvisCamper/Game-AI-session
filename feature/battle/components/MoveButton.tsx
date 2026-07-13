import { CardMove, MoveType } from "@/types";

const MOVE_STYLE: Record<
  MoveType,
  { bg: string; icon: string; ring: string }
> = {
  [MoveType.ATTACK]: {
    bg: "bg-attack",
    icon: "⚔️",
    ring: "focus-visible:ring-attack",
  },
  [MoveType.DEFEND]: {
    bg: "bg-defend",
    icon: "🛡️",
    ring: "focus-visible:ring-defend",
  },
  [MoveType.SPECIAL]: {
    bg: "bg-special",
    icon: "⚡",
    ring: "focus-visible:ring-special",
  },
};

export default function MoveButton({
  moveType,
  move,
  disabled,
  onClick,
}: {
  moveType: MoveType;
  move: CardMove;
  disabled: boolean;
  onClick: () => void;
}) {
  const style = MOVE_STYLE[moveType];
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      title={move.description}
      className={`comic-border glow-blue-hover flex flex-col items-center gap-0.5 rounded-xl ${style.bg} px-2 py-[clamp(0.35rem,1.4vh,0.75rem)] text-black transition-opacity sm:px-4 ${
        disabled
          ? "cursor-not-allowed opacity-40 saturate-50"
          : "cursor-pointer opacity-100"
      }`}
    >
      <span className="text-[clamp(1rem,2.6vh,1.5rem)]" aria-hidden>
        {style.icon}
      </span>
      <span className="font-comic text-[clamp(0.7rem,1.9vh,1rem)] leading-none tracking-wide">
        {move.name}
      </span>
      <span className="font-sans text-[9px] font-bold uppercase text-black/70 sm:text-[10px]">
        Power {move.base_power}
      </span>
    </button>
  );
}
