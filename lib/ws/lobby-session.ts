export type LobbySession = {
  roomCode: string;
  roomUuid: string;
  playerId: number;
  playerName: string;
  isHost: boolean;
  opponentName: string | null;
};

const LOBBY_SESSION_KEY = "battle-lobby-session";

export function saveLobbySession(session: LobbySession): void {
  sessionStorage.setItem(LOBBY_SESSION_KEY, JSON.stringify(session));
}

export function loadLobbySession(): LobbySession | null {
  try {
    const raw = sessionStorage.getItem(LOBBY_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LobbySession;
  } catch {
    return null;
  }
}

export function updateLobbyOpponent(opponentName: string): LobbySession | null {
  const session = loadLobbySession();
  if (!session) return null;
  const next = { ...session, opponentName };
  saveLobbySession(next);
  return next;
}
