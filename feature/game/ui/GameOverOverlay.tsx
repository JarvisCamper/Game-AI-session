export function GameOverOverlay({
  amIWinner,
  onReset,
}: {
  amIWinner: boolean | null;
  onReset: () => void;
}) {
  if (amIWinner === null) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/75 text-white backdrop-blur-sm">
      <p
        className={`text-4xl font-bold tracking-wide ${
          amIWinner ? "text-amber-300" : "text-red-300"
        }`}
      >
        {amIWinner ? "Victory!" : "Defeat"}
      </p>
      <button
        onClick={onReset}
        className="rounded-lg border-2 border-amber-200/50 bg-stone-900 px-5 py-2 text-sm font-semibold text-amber-100 transition hover:bg-stone-800"
      >
        Rematch
      </button>
    </div>
  );
}
