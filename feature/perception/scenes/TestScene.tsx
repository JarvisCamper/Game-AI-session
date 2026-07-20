"use client";

import { usePlayerStore } from "../store/usePlayerStore";
import { useMovement } from "../hooks/useMovement";
import { Perceivable } from "../systems/visibility/Perceivable";
import { TEST_WORLD } from "../entities/testWorld";
import { RoleSwitcher } from "../ui/RoleSwitcher";

/**
 * Top-down 2D scene. The world layer is translated by -playerPosition so the
 * player stays centered (a following camera). Every entity is wrapped in
 * <Perceivable>, so what renders is entirely a function of the current role/flags.
 */
export function TestScene() {
  useMovement();
  const position = usePlayerStore((s) => s.position);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#0c1210] text-white select-none">
      {/* World layer — anchored at viewport center, panned by the camera. */}
      <div
        className="absolute left-1/2 top-1/2 h-0 w-0"
        style={{ transform: `translate(${-position.x}px, ${-position.y}px)` }}
      >
        {/* faint reference grid so movement is legible */}
        <div
          className="absolute -z-10 opacity-[0.06]"
          style={{
            left: -1000,
            top: -1000,
            width: 2000,
            height: 2000,
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {TEST_WORLD.map((entity) => (
          <Perceivable key={entity.id} rule={entity.rule}>
            <div
              className="absolute flex items-center justify-center rounded-md text-center text-[10px] font-medium leading-tight shadow-lg"
              style={{
                left: entity.position.x,
                top: entity.position.y,
                width: entity.size.x,
                height: entity.size.y,
                background: entity.color,
                transform: "translate(-50%, -50%)",
              }}
            >
              {entity.label}
            </div>
          </Perceivable>
        ))}
      </div>

      {/* Player — fixed at the center of the viewport. */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ring-4 ring-white/20" />

      <RoleSwitcher />

      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/40">
        WASD / arrows to move · switch role to change what exists
      </p>
    </div>
  );
}
