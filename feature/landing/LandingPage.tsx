"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  createRoomOverSocket,
  joinRoomOverSocket,
} from "@/lib/ws/battle-socket";
import { saveLobbySession } from "@/lib/ws/lobby-session";

type CreateRoomForm = {
  playerName: string;
};

type JoinRoomForm = {
  roomCode: string;
  playerName: string;
};

export default function LandingPage() {
  const router = useRouter();
  const [busy, setBusy] = useState<"create" | "join" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeForm, setActiveForm] = useState<"create" | "join" | null>(null);

  const createForm = useForm<CreateRoomForm>({
    defaultValues: { playerName: "" },
  });
  const joinForm = useForm<JoinRoomForm>({
    defaultValues: { roomCode: "", playerName: "" },
  });

  const createName = createForm.watch("playerName");
  const joinCode = joinForm.watch("roomCode");
  const joinName = joinForm.watch("playerName");

  const canCreate = createName.trim().length > 0;
  const canJoin = joinCode.trim().length > 0 && joinName.trim().length > 0;

  const createLocked = activeForm === "join";
  const joinLocked = activeForm === "create";

  function focusCreate() {
    if (activeForm === "join") {
      joinForm.reset({ roomCode: "", playerName: "" });
    }
    setActiveForm("create");
  }

  function focusJoin() {
    if (activeForm === "create") {
      createForm.reset({ playerName: "" });
    }
    setActiveForm("join");
  }

  const onCreateSubmit = createForm.handleSubmit(async ({ playerName }) => {
    setError(null);
    setBusy("create");
    try {
      const message = await createRoomOverSocket(playerName.trim());
      const { room_code, room_uuid, player } = message.payload;
      saveLobbySession({
        roomCode: room_code,
        roomUuid: room_uuid,
        playerId: player.player_id,
        playerName: player.name,
        isHost: player.is_host,
        opponentName: null,
      });
      router.push(`/room/${room_code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create room");
    } finally {
      setBusy(null);
    }
  });

  const onJoinSubmit = joinForm.handleSubmit(async ({ roomCode, playerName }) => {
    setError(null);
    setBusy("join");
    try {
      const message = await joinRoomOverSocket(
        roomCode.trim().toUpperCase(),
        playerName.trim(),
      );
      const { room_code, room_uuid, player, opponent } = message.payload;
      saveLobbySession({
        roomCode: room_code,
        roomUuid: room_uuid,
        playerId: player.player_id,
        playerName: player.name,
        isHost: player.is_host,
        opponentName: opponent?.name ?? null,
      });
      router.push(`/room/${room_code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join room");
    } finally {
      setBusy(null);
    }
  });

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16 text-[var(--landing-ink)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,#1a3a32_0%,transparent_45%),radial-gradient(ellipse_at_85%_20%,#3d2a12_0%,transparent_40%),linear-gradient(165deg,#0c1210_0%,#15221c_48%,#1a1510_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(-12deg,transparent_0_11px,#fff_11px_12px)]"
      />

      <div className="relative z-10 w-full max-w-4xl">
        <header className="mb-12 text-center">
          <p className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.35em] text-[#c4a574] uppercase">
            Office Arena
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-geist-sans)] text-5xl font-semibold tracking-tight text-[#f2ebe0] sm:text-6xl">
            Battle Lobby
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#a8b5ae]">
            Use one form at a time — focusing the other clears the first.
          </p>
        </header>

        {error ? (
          <p
            role="alert"
            className="mb-6 rounded-lg border border-[#7a3b2e] bg-[#2a1612] px-4 py-3 text-center text-sm text-[#e8b4a8]"
          >
            {error}
          </p>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2">
          <section
            className={`rounded-2xl border border-[#2f453c] bg-[#101916]/80 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm transition ${
              createLocked ? "opacity-40" : "opacity-100"
            }`}
          >
            <h2 className="font-[family-name:var(--font-geist-sans)] text-xl font-medium text-[#f2ebe0]">
              Create room
            </h2>
            <p className="mt-1 text-sm text-[#8fa098]">
              Open a new match and share the code.
            </p>

            <form onSubmit={onCreateSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="create-player-name"
                  className="mb-1.5 block text-xs tracking-wide text-[#c4a574] uppercase"
                >
                  Player name
                </label>
                <input
                  id="create-player-name"
                  type="text"
                  autoComplete="off"
                  placeholder="e.g. Night Owl"
                  onFocus={focusCreate}
                  className="w-full rounded-lg border border-[#2f453c] bg-[#0c1210] px-3 py-2.5 text-sm text-[#f2ebe0] outline-none transition placeholder:text-[#5c6b64] focus:border-[#c4a574]"
                  {...createForm.register("playerName", {
                    onChange: () => focusCreate(),
                  })}
                />
              </div>

              <button
                type="submit"
                disabled={!canCreate || busy !== null || createLocked}
                className="w-full rounded-lg bg-[#c4a574] px-4 py-2.5 text-sm font-medium text-[#1a1510] transition hover:bg-[#d4b888] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy === "create" ? "Connecting…" : "Create room"}
              </button>
            </form>
          </section>

          <section
            className={`rounded-2xl border border-[#2f453c] bg-[#101916]/80 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm transition ${
              joinLocked ? "opacity-40" : "opacity-100"
            }`}
          >
            <h2 className="font-[family-name:var(--font-geist-sans)] text-xl font-medium text-[#f2ebe0]">
              Join room
            </h2>
            <p className="mt-1 text-sm text-[#8fa098]">
              Enter a room code to jump into a match.
            </p>

            <form onSubmit={onJoinSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="join-room-code"
                  className="mb-1.5 block text-xs tracking-wide text-[#c4a574] uppercase"
                >
                  Room code
                </label>
                <input
                  id="join-room-code"
                  type="text"
                  autoComplete="off"
                  placeholder="e.g. KXPM"
                  maxLength={4}
                  onFocus={focusJoin}
                  className="w-full rounded-lg border border-[#2f453c] bg-[#0c1210] px-3 py-2.5 text-sm text-[#f2ebe0] outline-none transition placeholder:text-[#5c6b64] focus:border-[#c4a574]"
                  {...joinForm.register("roomCode", {
                    onChange: () => focusJoin(),
                  })}
                />
              </div>

              <div>
                <label
                  htmlFor="join-player-name"
                  className="mb-1.5 block text-xs tracking-wide text-[#c4a574] uppercase"
                >
                  Player name
                </label>
                <input
                  id="join-player-name"
                  type="text"
                  autoComplete="off"
                  placeholder="e.g. Micromanager"
                  onFocus={focusJoin}
                  className="w-full rounded-lg border border-[#2f453c] bg-[#0c1210] px-3 py-2.5 text-sm text-[#f2ebe0] outline-none transition placeholder:text-[#5c6b64] focus:border-[#c4a574]"
                  {...joinForm.register("playerName", {
                    onChange: () => focusJoin(),
                  })}
                />
              </div>

              <button
                type="submit"
                disabled={!canJoin || busy !== null || joinLocked}
                className="w-full rounded-lg bg-[#c4a574] px-4 py-2.5 text-sm font-medium text-[#1a1510] transition hover:bg-[#d4b888] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy === "join" ? "Connecting…" : "Join room"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
