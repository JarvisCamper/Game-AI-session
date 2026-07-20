import { useEffect, useRef } from "react";
import type { BattleEvent } from "../perspective/types";

/**
 * Scrolling feed of recent battle events, phrased from the viewpoint player's
 * side ("You" vs the opponent's name) so it reads naturally under a
 * perspective-flipped board.
 */
export function BattleLog({ events }: { events: BattleEvent[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [events.length]);

  return (
    <div className="flex h-32 w-72 flex-col gap-1 overflow-y-auto rounded-xl border border-amber-200/20 bg-black/50 p-2.5 text-[11px] text-white/80 shadow-lg shadow-black/40 backdrop-blur">
      {events.length === 0 && (
        <p className="text-white/40">Battle log will appear here…</p>
      )}
      {events.map((event) => (
        <p key={event.id} className={eventClass(event)}>
          {event.text}
        </p>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

function eventClass(event: BattleEvent): string {
  switch (event.kind) {
    case "defeat":
      return "font-semibold text-red-300";
    case "game_over":
      return "font-bold text-amber-300";
    case "taunt":
      return "italic text-white/60";
    default:
      return "";
  }
}
