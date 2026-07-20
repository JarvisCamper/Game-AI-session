/**
 * Center-top banner: round number, whose turn it is, the per-turn countdown,
 * and the taunt/leave actions. Purely presentational — all data comes from
 * the PerspectiveView via GameScene.
 */
export function TurnBanner({
  round,
  isMyTurn,
  timeRemaining,
  onTaunt,
  onLeave,
}: {
  round: number;
  isMyTurn: boolean;
  timeRemaining: number | null;
  onTaunt: () => void;
  onLeave: () => void;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-amber-200/20 bg-black/50 px-6 py-2.5 text-white shadow-lg shadow-black/40 backdrop-blur">
      <p className="text-[10px] uppercase tracking-widest text-amber-200/70">
        Round {round}
      </p>
      <p
        className={`text-sm font-bold ${
          isMyTurn ? "text-emerald-300" : "text-white/60"
        }`}
      >
        {isMyTurn ? "Your Turn" : "Opponent's Turn"}
      </p>
      {timeRemaining != null && (
        <p className="text-[10px] tabular-nums text-white/40">
          {timeRemaining}s
        </p>
      )}
      <div className="mt-1.5 flex gap-1.5">
        <button
          onClick={onTaunt}
          className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/70 transition hover:bg-white/20"
        >
          Taunt
        </button>
        <button
          onClick={onLeave}
          className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/70 transition hover:bg-red-500/30"
        >
          Leave
        </button>
      </div>
    </div>
  );
}
