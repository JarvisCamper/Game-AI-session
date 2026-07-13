"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BattleMessageType, type BattleMessage } from "@/types";
import {
  connectBattleSocket,
  getBattleSocket,
  getSocketStatus,
  type SocketStatus,
} from "@/lib/ws/battle-socket";
import {
  loadLobbySession,
  updateLobbyOpponent,
  type LobbySession,
} from "@/lib/ws/lobby-session";

const MAX_PLAYERS = 2;

const STATUS_LABEL: Record<SocketStatus, string> = {
  idle: "No socket",
  connecting: "Connecting…",
  open: "WebSocket connected",
  closed: "WebSocket disconnected",
};

export default function RoomPage() {
  const params = useParams<{ id: string }>();
  const roomCode = (params.id ?? "").toUpperCase();

  const [session, setSession] = useState<LobbySession | null>(null);
  const [status, setStatus] = useState<SocketStatus>("idle");
  const [imHere, setImHere] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      const stored = loadLobbySession();
      if (
        !cancelled &&
        stored &&
        stored.roomCode.toUpperCase() === roomCode
      ) {
        setSession(stored);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [roomCode]);

  useEffect(() => {
    const sync = () => setStatus(getSocketStatus(getBattleSocket()));
    sync();

    const ws = getBattleSocket() ?? connectBattleSocket();
    sync();

    const onOpen = () => setStatus("open");
    const onClose = () => setStatus("closed");
    const onError = () => setStatus(getSocketStatus(ws));
    const onMessage = (event: MessageEvent<string>) => {
      try {
        const data = JSON.parse(event.data) as BattleMessage;
        if (data.type === BattleMessageType.OPPONENT_JOINED) {
          const next = updateLobbyOpponent(data.payload.opponent.name);
          if (next) setSession(next);
          else {
            setSession((prev) =>
              prev
                ? { ...prev, opponentName: data.payload.opponent.name }
                : prev,
            );
          }
        }
      } catch {
        // ignore non-JSON
      }
    };

    ws.addEventListener("open", onOpen);
    ws.addEventListener("close", onClose);
    ws.addEventListener("error", onError);
    ws.addEventListener("message", onMessage);

    const interval = window.setInterval(sync, 1000);

    return () => {
      ws.removeEventListener("open", onOpen);
      ws.removeEventListener("close", onClose);
      ws.removeEventListener("error", onError);
      ws.removeEventListener("message", onMessage);
      window.clearInterval(interval);
    };
  }, []);

  const connected = status === "open";
  const youName = session?.playerName ?? "—";
  const opponentName = session?.opponentName;
  const playerCount = session ? (opponentName ? MAX_PLAYERS : 1) : 0;
  const roomFull = playerCount >= MAX_PLAYERS;

  const hostLabel = "Host";
  const hostName = session?.isHost ? youName : opponentName ?? "—";
  const hostPresent = session?.isHost ? imHere : Boolean(opponentName);

  const guestLabel = "Guest";
  const guestName = session?.isHost ? opponentName ?? "Waiting…" : youName;
  const guestPresent = session?.isHost ? Boolean(opponentName) : imHere;
  const guestEmpty = session?.isHost ? !opponentName : !session;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard may be blocked
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[#0c1210] px-4 text-[#f2ebe0]">
      <div className="text-center">
        <p className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.3em] text-[#c4a574] uppercase">
          Room code
        </p>
        <div className="mt-3 flex items-center justify-center gap-3">
          <h1 className="font-[family-name:var(--font-geist-mono)] text-5xl font-semibold tracking-[0.35em] text-[#f2ebe0]">
            {roomCode}
          </h1>
          <button
            type="button"
            onClick={copyCode}
            className="rounded-lg border border-[#2f453c] px-3 py-2 text-xs text-[#c4a574] transition hover:border-[#c4a574]"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="mt-3 text-sm text-[#8fa098]">
          {roomFull
            ? "Room full · 2 / 2 players"
            : `Waiting for opponent · ${playerCount} / ${MAX_PLAYERS}`}
        </p>
      </div>

      <div className="grid w-full max-w-md gap-3">
        <PlayerSlot
          label={session?.isHost ? `${hostLabel} · you` : hostLabel}
          name={hostName}
          present={hostPresent}
          empty={!session}
        />
        <PlayerSlot
          label={!session?.isHost ? `${guestLabel} · you` : guestLabel}
          name={guestName}
          present={guestPresent}
          empty={guestEmpty}
        />
      </div>

      {imHere ? (
        <p
          role="status"
          className="rounded-lg border border-[#2f6b4f] bg-[#143528] px-4 py-2 text-sm text-[#9fdfbc]"
        >
          You&apos;re here — {youName} is in the room
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setImHere(true)}
          disabled={imHere}
          className={`rounded-lg px-5 py-2.5 text-sm font-medium transition disabled:cursor-default ${
            imHere
              ? "border border-[#2f6b4f] bg-[#143528] text-[#9fdfbc]"
              : "bg-[#c4a574] text-[#1a1510] hover:bg-[#d4b888]"
          }`}
        >
          {imHere ? "I'm here ✓" : "I'm here"}
        </button>

        <button
          type="button"
          onClick={() => {
            const ws = getBattleSocket() ?? connectBattleSocket();
            setStatus(getSocketStatus(ws));
          }}
          className={`rounded-lg border px-5 py-2.5 text-sm font-medium transition ${
            connected
              ? "border-[#2f6b4f] bg-[#143528] text-[#9fdfbc]"
              : "border-[#7a3b2e] bg-[#2a1612] text-[#e8b4a8]"
          }`}
        >
          {STATUS_LABEL[status]}
        </button>
      </div>
    </main>
  );
}

function PlayerSlot({
  label,
  name,
  present,
  empty,
}: {
  label: string;
  name: string;
  present: boolean;
  empty: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 transition ${
        empty
          ? "border-dashed border-[#2f453c] bg-transparent text-[#5c6b64]"
          : present
            ? "border-[#2f6b4f] bg-[#143528]/60"
            : "border-[#2f453c] bg-[#101916]"
      }`}
    >
      <p className="text-xs tracking-wide text-[#c4a574] uppercase">{label}</p>
      <div className="mt-1 flex items-center justify-between gap-3">
        <p className="text-base text-[#f2ebe0]">{name}</p>
        {!empty ? (
          <span
            className={`text-xs ${
              present ? "text-[#9fdfbc]" : "text-[#8fa098]"
            }`}
          >
            {present ? "Here" : "Joined"}
          </span>
        ) : null}
      </div>
    </div>
  );
}
