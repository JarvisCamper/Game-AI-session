import type { WorldEntity } from "./types";

/**
 * A tiny hand-authored world proving the core mechanic: all players stand in the
 * same coordinates, but each perceives a different subset of entities. Switch
 * roles in the UI and watch reality change.
 *
 * Adding an entity = one object in this array. No component or scene edits.
 */
export const TEST_WORLD: WorldEntity[] = [
  {
    id: "statue",
    position: { x: 0, y: -140 },
    size: { x: 70, y: 70 },
    color: "#8a8f98",
    label: "Statue (all)",
    rule: { kind: "everyone" },
  },
  {
    id: "red-symbol",
    position: { x: -180, y: 0 },
    size: { x: 60, y: 60 },
    color: "#c0392b",
    label: "Red symbol (A)",
    rule: { kind: "roles", roles: ["A"] },
  },
  {
    id: "blue-lever",
    position: { x: 180, y: 0 },
    size: { x: 60, y: 60 },
    color: "#2f80ed",
    label: "Blue lever (B)",
    rule: { kind: "roles", roles: ["B"] },
  },
  {
    id: "floating-numbers",
    position: { x: 0, y: 160 },
    size: { x: 60, y: 60 },
    color: "#27ae60",
    label: "Numbers (C)",
    rule: { kind: "roles", roles: ["C"] },
  },
  {
    id: "secret-door",
    position: { x: 0, y: 0 },
    size: { x: 50, y: 90 },
    color: "#8e44ad",
    label: "Secret door (needs flag)",
    // Perceivable only once the "leverPulled" flag is set — demonstrates
    // condition-gated visibility without any puzzle-specific code in the scene.
    rule: { kind: "condition", predicate: (ctx) => ctx.flags.leverPulled === true },
  },
];
