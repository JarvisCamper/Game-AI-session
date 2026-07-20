import type { PlayerState } from "@/types";

/**
 * Corner nameplate — pinned top-left ("Player 1" / self) or top-right
 * ("Player 2" / opponent), mirroring the reference's hero-portrait corners.
 * `role` is the fixed viewpoint slot label; `player.name` is the real name.
 */
export function PlayerBadge({
  role,
  player,
  align,
}: {
  role: "Player 1" | "Player 2";
  player: PlayerState;
  align: "left" | "right";
}) {
  return (
    <div
      className={`rounded-xl border border-amber-200/20 bg-black/50 px-4 py-2.5 text-white shadow-lg shadow-black/40 backdrop-blur ${
        align === "left" ? "text-left" : "text-right"
      }`}
    >
      <p className="text-[10px] uppercase tracking-widest text-amber-200/70">
        {role}
      </p>
      <p className="truncate text-sm font-semibold">{player.name}</p>
      <p className="text-[10px] tabular-nums text-white/50">
        {player.scoreboard.wins}W – {player.scoreboard.losses}L
      </p>
    </div>
  );
}
