"use client";

import { MoveType } from "@/types";
import { useBattleEngine } from "./useBattleEngine";
import CardFace from "./components/CardFace";
import CardThumb from "./components/CardThumb";
import MoveButton from "./components/MoveButton";
import ActionBurst from "./components/ActionBurst";
import SpeechBubble from "./components/SpeechBubble";
import TurnBanner from "./components/TurnBanner";
import GameOverModal from "./components/GameOverModal";

export default function BattleRoom({ roomId }: { roomId: string }) {
  const {
    self,
    opponent,
    round,
    burst,
    bubble,
    banner,
    winner,
    shake,
    isPlayerTurn,
    selectMove,
    reset,
  } = useBattleEngine();

  const selfActive = self.cards[self.active_card_index];
  const opponentActive = opponent.cards[opponent.active_card_index];
  const benchSelf = self.cards.filter((_, i) => i !== self.active_card_index);
  const benchOpponent = opponent.cards.filter(
    (_, i) => i !== opponent.active_card_index
  );

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background">
      <div className="warehouse-bg pointer-events-none absolute inset-0" />
      <div className="halftone speed-lines pointer-events-none absolute inset-0" />

      <div
        className="spotlight pointer-events-none absolute -top-20 left-[6%] h-56 w-56 bg-accent/25"
        aria-hidden
      />
      <div
        className="spotlight pointer-events-none absolute -top-20 right-[6%] h-56 w-56 bg-special/15"
        aria-hidden
      />

      <span
        aria-hidden
        className="graffiti-tag pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 -rotate-6 select-none whitespace-nowrap font-comic text-[clamp(2.5rem,13vw,7rem)] leading-none"
      >
        CUBICLE BRAWL
      </span>

      <div
        className="steel-beam pointer-events-none absolute inset-y-0 left-0 z-10 w-2 sm:w-3"
        aria-hidden
      >
        {[12, 36, 60, 84].map((top) => (
          <span
            key={top}
            className="rivet absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#6b6b70]"
            style={{ top: `${top}%` }}
          />
        ))}
      </div>
      <div
        className="steel-beam pointer-events-none absolute inset-y-0 right-0 z-10 w-2 sm:w-3"
        aria-hidden
      >
        {[12, 36, 60, 84].map((top) => (
          <span
            key={top}
            className="rivet absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#6b6b70]"
            style={{ top: `${top}%` }}
          />
        ))}
      </div>

      <header className="comic-border-sm relative z-10 mx-3 mt-2 flex shrink-0 items-center justify-between rounded-xl bg-surface px-4 py-[clamp(0.25rem,1vh,0.5rem)] sm:mx-6">
        <span className="font-comic text-sm tracking-wide text-accent sm:text-base">
          ROOM {roomId.slice(0, 6).toUpperCase()}
        </span>
        <span className="font-comic text-base tracking-widest text-foreground sm:text-lg">
          ROUND {round}
        </span>
        <div className="flex items-center gap-2 font-sans text-xs font-bold sm:text-sm">
          <span className="text-defend">{self.scoreboard.wins}W</span>
          <span className="text-foreground/40">–</span>
          <span className="text-attack">{opponent.scoreboard.wins}W</span>
        </div>
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-evenly gap-[clamp(0.15rem,0.8vh,0.5rem)] overflow-hidden px-3 py-1 sm:px-6">
        <TurnBanner banner={banner} />
        <ActionBurst burst={burst} />

        <section className="flex min-h-0 w-full flex-col items-center justify-center gap-[clamp(0.1rem,0.6vh,0.4rem)]">
          <div className="flex items-center gap-2 sm:gap-4">
            {benchOpponent.map((c) => (
              <CardThumb key={c.id} card={c} active={false} />
            ))}
          </div>
          <div className="relative">
            <SpeechBubble
              bubble={bubble?.side === "opponent" ? bubble : null}
            />
            <CardFace
              card={opponentActive}
              isActiveTurn={!isPlayerTurn && !winner}
              shaking={shake === "opponent"}
            />
          </div>
          <p className="font-sans text-[11px] font-bold text-foreground/60 sm:text-sm">
            {opponent.name}
          </p>
        </section>

        <div className="relative flex w-full max-w-xs shrink-0 items-center gap-3">
          <span className="h-0.5 flex-1 bg-border" />
          <span className="comic-border-sm shrink-0 rounded-full bg-surface px-3 py-1 font-comic text-sm tracking-widest text-foreground/80">
            VS
          </span>
          <span className="h-0.5 flex-1 bg-border" />
        </div>

        <section className="flex min-h-0 w-full flex-col items-center justify-center gap-[clamp(0.1rem,0.6vh,0.4rem)]">
          <p className="font-sans text-[11px] font-bold text-foreground/60 sm:text-sm">
            {self.name}
          </p>
          <div className="relative">
            <CardFace
              card={selfActive}
              isActiveTurn={isPlayerTurn}
              shaking={shake === "self"}
            />
            <SpeechBubble bubble={bubble?.side === "self" ? bubble : null} />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {benchSelf.map((c) => (
              <CardThumb key={c.id} card={c} active={false} />
            ))}
          </div>
        </section>
      </main>

      <footer className="metal-floor relative z-10 shrink-0 border-t-2 border-[#4a4a4e] px-3 py-[clamp(0.35rem,1.2vh,1rem)] shadow-[0_-4px_10px_rgba(0,0,0,0.5)] sm:px-6">
        <div className="mx-auto grid max-w-md grid-cols-3 gap-2 sm:gap-4">
          <MoveButton
            moveType={MoveType.ATTACK}
            move={selfActive.moves.attack}
            disabled={!isPlayerTurn}
            onClick={() => selectMove(MoveType.ATTACK)}
          />
          <MoveButton
            moveType={MoveType.DEFEND}
            move={selfActive.moves.defend}
            disabled={!isPlayerTurn}
            onClick={() => selectMove(MoveType.DEFEND)}
          />
          <MoveButton
            moveType={MoveType.SPECIAL}
            move={selfActive.moves.special}
            disabled={!isPlayerTurn}
            onClick={() => selectMove(MoveType.SPECIAL)}
          />
        </div>
      </footer>

      {winner && <GameOverModal winner={winner} onRematch={reset} />}
    </div>
  );
}
