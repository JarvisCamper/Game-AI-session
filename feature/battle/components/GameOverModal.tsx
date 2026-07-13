import { Side } from "../useBattleEngine";

export default function GameOverModal({
  winner,
  onRematch,
}: {
  winner: Side;
  onRematch: () => void;
}) {
  const won = winner === "self";

  return (
    <div className="halftone absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div
        className={`comic-border relative w-[90%] max-w-sm -rotate-1 rounded-2xl bg-card px-6 py-8 text-center`}
      >
        <div
          className={`burst-shape absolute -top-10 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center border-4 border-black sm:h-24 sm:w-24 ${
            won ? "bg-defend" : "bg-attack"
          }`}
        >
          <span className="text-2xl sm:text-3xl" aria-hidden>
            {won ? "🏆" : "💥"}
          </span>
        </div>

        <h2
          className={`text-stroke mt-8 font-comic text-4xl tracking-wide sm:text-5xl ${
            won ? "text-defend" : "text-attack"
          }`}
        >
          {won ? "VICTORY!" : "DEFEAT"}
        </h2>
        <p className="mt-2 font-sans text-sm text-foreground/70">
          {won
            ? "The office bows to your synergy."
            : "Back to your desk, champ."}
        </p>

        <button
          type="button"
          onClick={onRematch}
          className="comic-border glow-blue-hover mx-auto mt-6 block rounded-xl bg-accent px-6 py-3 font-comic text-lg tracking-wide text-white"
        >
          REMATCH
        </button>
      </div>
    </div>
  );
}
