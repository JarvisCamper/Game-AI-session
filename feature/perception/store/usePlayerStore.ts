import { create } from "zustand";

/**
 * The local player's identity + kinematic state.
 *
 * `role` is the key to the whole game: it's what the visibility system reads to
 * decide which entities exist for THIS player. In single-player test mode we let
 * the UI switch it freely; once networking lands, the server assigns it on join
 * and it becomes read-only from the client's perspective.
 */

export type PlayerRole = "A" | "B" | "C";

export interface Vec2 {
  x: number;
  y: number;
}

interface PlayerState {
  localPlayerId: string;
  role: PlayerRole;
  position: Vec2;
  /** Arbitrary boolean world-state this player has unlocked (used by condition rules). */
  flags: Record<string, boolean>;

  setRole: (role: PlayerRole) => void;
  setPosition: (pos: Vec2) => void;
  setFlag: (key: string, value: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  localPlayerId: "local-player",
  role: "A",
  position: { x: 0, y: 0 },
  flags: {},

  setRole: (role) => set({ role }),
  setPosition: (position) => set({ position }),
  setFlag: (key, value) =>
    set((state) => ({ flags: { ...state.flags, [key]: value } })),
}));
