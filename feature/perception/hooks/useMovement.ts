"use client";

import { useEffect } from "react";
import { usePlayerStore } from "../store/usePlayerStore";
import { placeholderNetwork } from "../game/network/placeholders";

const MOVE_KEYS = {
  up: ["w", "arrowup"],
  down: ["s", "arrowdown"],
  left: ["a", "arrowleft"],
  right: ["d", "arrowright"],
};

/**
 * First-person-style local movement, top-down 2D. Runs a rAF loop, reads held
 * keys, writes the new position to the store, and forwards it to the network
 * placeholder (which the networking dev will make authoritative later).
 *
 * Position lives in the store (not React state) so movement never re-renders the
 * whole tree — only components that select `position` update.
 *
 * @param speed pixels per second
 */
export function useMovement(speed = 220) {
  useEffect(() => {
    const held = new Set<string>();
    const onDown = (e: KeyboardEvent) => held.add(e.key.toLowerCase());
    const onUp = (e: KeyboardEvent) => held.delete(e.key.toLowerCase());
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      let dx = 0;
      let dy = 0;
      if (MOVE_KEYS.up.some((k) => held.has(k))) dy -= 1;
      if (MOVE_KEYS.down.some((k) => held.has(k))) dy += 1;
      if (MOVE_KEYS.left.some((k) => held.has(k))) dx -= 1;
      if (MOVE_KEYS.right.some((k) => held.has(k))) dx += 1;

      if (dx !== 0 || dy !== 0) {
        const len = Math.hypot(dx, dy);
        const { position, setPosition } = usePlayerStore.getState();
        const next = {
          x: position.x + (dx / len) * speed * dt,
          y: position.y + (dy / len) * speed * dt,
        };
        setPosition(next);
        placeholderNetwork.sendPlayerMovement(next);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      cancelAnimationFrame(raf);
    };
  }, [speed]);
}
