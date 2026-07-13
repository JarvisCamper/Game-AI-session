"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card, MoveType, PlayerState } from "@/types";
import { MOCK_OPPONENT, MOCK_SELF, TAUNT_LINES } from "./mockData";
import {
  effectivenessLabel,
  effectivenessMultiplier,
  getEffectiveness,
} from "./effectiveness";

export type Side = "self" | "opponent";
export type Phase = "idle" | "resolving" | "game-over";

export interface BurstInfo {
  id: number;
  side: Side;
  moveType: MoveType;
  headline: string;
  sub: string | null;
}

export interface BubbleInfo {
  id: number;
  side: Side;
  text: string;
}

export interface BannerInfo {
  id: number;
  text: string;
}

const MOVE_HEADLINE: Record<MoveType, string> = {
  [MoveType.ATTACK]: "POW!",
  [MoveType.DEFEND]: "BLOCK!",
  [MoveType.SPECIAL]: "ZAP!",
};

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return idCounter;
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function clonePlayer(p: PlayerState): PlayerState {
  return {
    ...p,
    cards: p.cards.map((c) => ({ ...c, stats: { ...c.stats } })) as [
      Card,
      Card,
      Card,
    ],
  };
}

function nextAliveIndex(
  cards: [Card, Card, Card],
  currentIndex: number
): 0 | 1 | 2 | null {
  for (let step = 1; step <= 3; step++) {
    const idx = ((currentIndex + step) % 3) as 0 | 1 | 2;
    if (!cards[idx].is_defeated) return idx;
  }
  return null;
}

export function useBattleEngine() {
  const [self, setSelf] = useState<PlayerState>(() => clonePlayer(MOCK_SELF));
  const [opponent, setOpponent] = useState<PlayerState>(() =>
    clonePlayer(MOCK_OPPONENT)
  );
  const [turn, setTurn] = useState<Side>("self");
  const [phase, setPhase] = useState<Phase>("idle");
  const [round, setRound] = useState(1);
  const [burst, setBurst] = useState<BurstInfo | null>(null);
  const [bubble, setBubble] = useState<BubbleInfo | null>(null);
  const [banner, setBanner] = useState<BannerInfo | null>(() => ({
    id: nextId(),
    text: "YOUR TURN",
  }));
  const [winner, setWinner] = useState<Side | null>(null);
  const [shake, setShake] = useState<Side | null>(null);

  const busyRef = useRef(false);
  const stateRef = useRef({ self, opponent });
  stateRef.current = { self, opponent };

  useEffect(() => {
    if (!bubble) return;
    const t = setTimeout(() => setBubble(null), 2000);
    return () => clearTimeout(t);
  }, [bubble]);

  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), 1600);
    return () => clearTimeout(t);
  }, [banner]);

  const resolveMove = useCallback(
    async (attackerSide: Side, moveType: MoveType) => {
      if (busyRef.current) return;
      busyRef.current = true;
      setPhase("resolving");

      const { self: curSelf, opponent: curOpponent } = stateRef.current;
      const attackerState = attackerSide === "self" ? curSelf : curOpponent;
      const defenderState = attackerSide === "self" ? curOpponent : curSelf;
      const attackerCard =
        attackerState.cards[attackerState.active_card_index];
      const defenderCard =
        defenderState.cards[defenderState.active_card_index];
      const move = attackerCard.moves[moveType];
      const statValue = attackerCard.stats[moveType];
      const effectiveness = getEffectiveness(
        attackerCard.attribute,
        defenderCard.attribute
      );
      const multiplier = effectivenessMultiplier(effectiveness);
      const variance = 0.9 + Math.random() * 0.2;
      const damage = Math.max(
        1,
        Math.round(
          (move.base_power * 0.5 + statValue * 0.4) * multiplier * variance
        )
      );

      setBurst({
        id: nextId(),
        side: attackerSide,
        moveType,
        headline: MOVE_HEADLINE[moveType],
        sub: effectivenessLabel(effectiveness),
      });

      await sleep(950);
      setBurst(null);
      setShake(attackerSide === "self" ? "opponent" : "self");

      const defenderSetter = attackerSide === "self" ? setOpponent : setSelf;
      let defeatedOut = false;
      let survivorsLeft = true;

      defenderSetter((prev) => {
        const cards = prev.cards.map((c) => ({
          ...c,
          stats: { ...c.stats },
        })) as [Card, Card, Card];
        const idx = prev.active_card_index;
        const card = cards[idx];
        card.stats.health = Math.max(0, card.stats.health - damage);
        if (card.stats.health === 0) {
          card.is_defeated = true;
          defeatedOut = true;
        }
        let activeIndex: 0 | 1 | 2 = idx;
        if (card.is_defeated) {
          const next = nextAliveIndex(cards, idx);
          if (next === null) {
            survivorsLeft = false;
          } else {
            activeIndex = next;
          }
        }
        return { ...prev, cards, active_card_index: activeIndex };
      });

      await sleep(420);
      setShake(null);

      if (defeatedOut && !survivorsLeft) {
        setWinner(attackerSide);
        setPhase("game-over");
        busyRef.current = false;
        return;
      }

      if (defeatedOut) {
        setBubble({
          id: nextId(),
          side: attackerSide,
          text: TAUNT_LINES[Math.floor(Math.random() * TAUNT_LINES.length)],
        });
      }

      if (attackerSide === "opponent") setRound((r) => r + 1);
      const nextTurn: Side = attackerSide === "self" ? "opponent" : "self";
      setTurn(nextTurn);
      setBanner({
        id: nextId(),
        text: nextTurn === "self" ? "YOUR TURN" : "OPPONENT'S TURN",
      });
      setPhase("idle");
      busyRef.current = false;
    },
    []
  );

  useEffect(() => {
    if (turn !== "opponent" || phase !== "idle" || winner) return;
    let cancelled = false;
    (async () => {
      await sleep(850);
      if (cancelled) return;
      const moves: MoveType[] = [
        MoveType.ATTACK,
        MoveType.DEFEND,
        MoveType.SPECIAL,
      ];
      const weights = [0.55, 0.2, 0.25];
      const r = Math.random();
      let acc = 0;
      let chosen: MoveType = MoveType.ATTACK;
      for (let i = 0; i < moves.length; i++) {
        acc += weights[i];
        if (r <= acc) {
          chosen = moves[i];
          break;
        }
      }
      resolveMove("opponent", chosen);
    })();
    return () => {
      cancelled = true;
    };
  }, [turn, phase, winner, resolveMove]);

  const selectMove = useCallback(
    (moveType: MoveType) => {
      if (turn !== "self" || phase !== "idle" || winner) return;
      resolveMove("self", moveType);
    },
    [turn, phase, winner, resolveMove]
  );

  const reset = useCallback(() => {
    setSelf(clonePlayer(MOCK_SELF));
    setOpponent(clonePlayer(MOCK_OPPONENT));
    setTurn("self");
    setPhase("idle");
    setRound(1);
    setBurst(null);
    setBubble(null);
    setWinner(null);
    setShake(null);
    setBanner({ id: nextId(), text: "YOUR TURN" });
    busyRef.current = false;
  }, []);

  return {
    self,
    opponent,
    turn,
    phase,
    round,
    burst,
    bubble,
    banner,
    winner,
    shake,
    selectMove,
    reset,
    isPlayerTurn: turn === "self" && phase === "idle" && !winner,
  };
}
