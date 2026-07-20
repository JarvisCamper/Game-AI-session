"use client";

import { usePlayerStore, type PlayerRole } from "../store/usePlayerStore";

const ROLES: PlayerRole[] = ["A", "B", "C"];

/**
 * Dev-only overlay to impersonate each player's perception in single-player.
 * When networking lands, role comes from the server and this goes away (or
 * becomes a spectator/debug tool).
 */
export function RoleSwitcher() {
  const role = usePlayerStore((s) => s.role);
  const setRole = usePlayerStore((s) => s.setRole);
  const flags = usePlayerStore((s) => s.flags);
  const setFlag = usePlayerStore((s) => s.setFlag);

  return (
    <div className="absolute left-4 top-4 flex flex-col gap-3 rounded-xl border border-white/10 bg-black/50 p-3 text-white backdrop-blur">
      <div>
        <p className="mb-1.5 text-[10px] uppercase tracking-widest text-white/50">
          Perceive as
        </p>
        <div className="flex gap-1.5">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`h-8 w-8 rounded-md text-sm font-semibold transition ${
                role === r
                  ? "bg-white text-black"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-xs text-white/70">
        <input
          type="checkbox"
          checked={flags.leverPulled === true}
          onChange={(e) => setFlag("leverPulled", e.target.checked)}
        />
        leverPulled flag
      </label>
    </div>
  );
}
