import { MoveType } from "@/types";
import { BurstInfo } from "../useBattleEngine";

const MOVE_COLOR: Record<MoveType, string> = {
  [MoveType.ATTACK]: "bg-attack",
  [MoveType.DEFEND]: "bg-defend",
  [MoveType.SPECIAL]: "bg-special",
};

export default function ActionBurst({ burst }: { burst: BurstInfo | null }) {
  if (!burst) return null;

  return (
    <div
      key={burst.id}
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
    >
      <div
        className={`burst-shape animate-burst-pop flex h-36 w-36 flex-col items-center justify-center border-4 border-black sm:h-44 sm:w-44 ${MOVE_COLOR[burst.moveType]}`}
      >
        <span className="text-stroke font-comic text-3xl tracking-wide text-black sm:text-4xl">
          {burst.headline}
        </span>
        {burst.sub && (
          <span className="text-stroke mt-1 px-2 text-center font-comic text-xs tracking-wide text-black sm:text-sm">
            {burst.sub}
          </span>
        )}
      </div>
    </div>
  );
}
