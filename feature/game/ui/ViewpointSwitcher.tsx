/**
 * Dev-only: flips which player's perspective this browser tab is rendering,
 * without touching the shared battle state. Proves the perspective layer
 * works (self is always bottom, moves only fire for the active player) before
 * websockets exist to give each client its own fixed viewpoint for real. Once
 * networking lands, viewpoint comes from the server (the room seat) and this
 * switcher is removed.
 */
export function ViewpointSwitcher({
  viewpointId,
  selfId,
  opponentId,
  onChange,
}: {
  viewpointId: number;
  selfId: number;
  opponentId: number;
  onChange: (id: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-white/10 bg-black/50 p-2 text-white backdrop-blur">
      <p className="text-[8px] uppercase tracking-widest text-white/40">
        Viewing as (dev)
      </p>
      <div className="flex gap-1">
        <button
          onClick={() => onChange(selfId)}
          className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium transition ${
            viewpointId === selfId
              ? "bg-white text-black"
              : "bg-white/10 text-white/70 hover:bg-white/20"
          }`}
        >
          Player 1
        </button>
        <button
          onClick={() => onChange(opponentId)}
          className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium transition ${
            viewpointId === opponentId
              ? "bg-white text-black"
              : "bg-white/10 text-white/70 hover:bg-white/20"
          }`}
        >
          Player 2
        </button>
      </div>
    </div>
  );
}
