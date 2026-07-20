"use client";

import { useState } from "react";
import { useLocalBattle } from "./perspective/useLocalBattle";
import { SELF_PLAYER_ID, OPPONENT_PLAYER_ID } from "./mockGame";
import { ArenaBackground } from "./ui/ArenaBackground";
import { Board } from "./ui/Board";
import { PlayerBadge } from "./ui/PlayerBadge";
import { TurnBanner } from "./ui/TurnBanner";
import { HeroAvatar } from "./ui/HeroAvatar";
import { MovePanel } from "./ui/MovePanel";
import { BattleLog } from "./ui/BattleLog";
import { GameOverOverlay } from "./ui/GameOverOverlay";
import { ViewpointSwitcher } from "./ui/ViewpointSwitcher";

/**
 * Turn-based card battle — Pokémon-style. Each player has 3 cards; one is
 * active at a time; on your turn you pick attack or defend (special is on
 * hold) against the opponent's active card.
 *
 * Everything below is driven entirely through the BattleController from
 * `useLocalBattle`. When websockets land, swap that one hook for a
 * `useSocketBattle(viewpointId)` that satisfies the same interface — Board,
 * PlayerBadge, TurnBanner, MovePanel, and BattleLog need zero changes.
 */
export function GameScene() {
  const [viewpointId, setViewpointId] = useState(SELF_PLAYER_ID);
  const controller = useLocalBattle(viewpointId);
  const { view, events, timeRemaining, selectMove, sendTaunt, leave, reset } =
    controller;

  const myActiveCard = view.self.cards[view.self.active_card_index];

  return (
    <div className="relative h-screen w-screen overflow-hidden text-white select-none">
      <ArenaBackground />

      {/* Top corners: viewpoint player left, opponent right. */}
      <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
        <ViewpointSwitcher
          viewpointId={viewpointId}
          selfId={SELF_PLAYER_ID}
          opponentId={OPPONENT_PLAYER_ID}
          onChange={setViewpointId}
        />
        <PlayerBadge role="Player 1" player={view.self} align="left" />
      </div>
      <div className="absolute right-4 top-4">
        <PlayerBadge role="Player 2" player={view.opponent} align="right" />
      </div>

      {/* Center: round/turn status. */}
      <div className="absolute left-1/2 top-4 -translate-x-1/2">
        <TurnBanner
          round={view.round}
          isMyTurn={view.isMyTurn}
          timeRemaining={timeRemaining}
          onTaunt={sendTaunt}
          onLeave={leave}
        />
      </div>

      <Board self={view.self} opponent={view.opponent} />

      {/* Bottom bar: battle log left, move hand centered, hero portrait right. */}
      <div className="absolute inset-x-0 bottom-4 flex items-end justify-between gap-4 px-4">
        <BattleLog events={events} />
        <MovePanel
          card={myActiveCard}
          disabled={!view.isMyTurn}
          onSelect={selectMove}
        />
        <HeroAvatar card={myActiveCard} />
      </div>

      <GameOverOverlay amIWinner={view.amIWinner} onReset={reset} />
    </div>
  );
}
