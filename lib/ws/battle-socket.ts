import {
  BattleMessageType,
  type BattleMessage,
  type CreateRoomPayload,
  type ErrorPayload,
  type JoinRoomPayload,
  type SendBattleMessage,
} from "@/types";

const DEFAULT_WS_URL = "ws://localhost:4001";
const LOG_PREFIX = "[battle-socket]";

let socket: WebSocket | null = null;

function readyStateLabel(readyState: number): string {
  switch (readyState) {
    case WebSocket.CONNECTING:
      return "CONNECTING";
    case WebSocket.OPEN:
      return "OPEN";
    case WebSocket.CLOSING:
      return "CLOSING";
    case WebSocket.CLOSED:
      return "CLOSED";
    default:
      return `UNKNOWN(${readyState})`;
  }
}

function log(...args: unknown[]) {
  console.log(LOG_PREFIX, ...args);
}

function logWarn(...args: unknown[]) {
  console.warn(LOG_PREFIX, ...args);
}

function logError(...args: unknown[]) {
  console.error(LOG_PREFIX, ...args);
}

function attachSocketDebugListeners(ws: WebSocket, url: string) {
  ws.addEventListener("open", () => {
    log("open", { url, readyState: readyStateLabel(ws.readyState) });
  });
  ws.addEventListener("message", (event) => {
    log("message ←", event.data);
  });
  ws.addEventListener("error", (event) => {
    logError("error event", {
      url,
      readyState: readyStateLabel(ws.readyState),
      event,
    });
  });
  ws.addEventListener("close", (event) => {
    logWarn("close", {
      url,
      code: event.code,
      reason: event.reason || "(none)",
      wasClean: event.wasClean,
      readyState: readyStateLabel(ws.readyState),
    });
  });
}

export function getBattleSocketUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_WS_API?.trim();
  const url = fromEnv || DEFAULT_WS_URL;
  log("resolved url", { fromEnv: fromEnv || null, url });
  return url;
}

export function getBattleSocket(): WebSocket | null {
  return socket;
}

export type SocketStatus = "idle" | "connecting" | "open" | "closed";

export function getSocketStatus(ws: WebSocket | null = socket): SocketStatus {
  if (!ws) return "idle";
  switch (ws.readyState) {
    case WebSocket.CONNECTING:
      return "connecting";
    case WebSocket.OPEN:
      return "open";
    default:
      return "closed";
  }
}

/** Reuses an open/connecting socket so navigation keeps the lobby connection. */
export function connectBattleSocket(): WebSocket {
  if (
    socket &&
    (socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING)
  ) {
    log("reuse existing socket", {
      readyState: readyStateLabel(socket.readyState),
      url: socket.url,
    });
    return socket;
  }

  const url = getBattleSocketUrl();
  log("connecting…", { url });
  socket = new WebSocket(url);
  attachSocketDebugListeners(socket, url);
  log("created socket", {
    readyState: readyStateLabel(socket.readyState),
    url: socket.url,
  });
  return socket;
}

export function closeBattleSocket(): void {
  if (!socket) return;
  log("closing socket", {
    readyState: readyStateLabel(socket.readyState),
    url: socket.url,
  });
  socket.close();
  socket = null;
}

export function sendBattleMessage(message: SendBattleMessage): void {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    logError("send blocked — socket not open", {
      hasSocket: Boolean(socket),
      readyState: socket ? readyStateLabel(socket.readyState) : null,
      message,
    });
    throw new Error("WebSocket is not connected");
  }
  const body = JSON.stringify(message);
  log("message →", body);
  socket.send(body);
}

function waitForOpen(ws: WebSocket, timeoutMs = 8000): Promise<void> {
  if (ws.readyState === WebSocket.OPEN) {
    log("waitForOpen: already open");
    return Promise.resolve();
  }

  log("waitForOpen: waiting", {
    readyState: readyStateLabel(ws.readyState),
    timeoutMs,
  });

  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      cleanup();
      logError("waitForOpen: timed out", {
        readyState: readyStateLabel(ws.readyState),
        url: ws.url,
      });
      reject(new Error("Timed out waiting for WebSocket connection"));
    }, timeoutMs);

    const onOpen = () => {
      cleanup();
      log("waitForOpen: resolved");
      resolve();
    };
    const onError = () => {
      cleanup();
      logError("waitForOpen: error — is the WS backend running?", {
        url: ws.url,
        hint: "Run `npm run ws:dev` (default port 4001)",
      });
      reject(new Error("Failed to connect to battle WebSocket"));
    };
    const onClose = (event: CloseEvent) => {
      cleanup();
      logError("waitForOpen: closed before open", {
        code: event.code,
        reason: event.reason || "(none)",
        wasClean: event.wasClean,
      });
      reject(new Error("WebSocket closed before opening"));
    };

    function cleanup() {
      window.clearTimeout(timer);
      ws.removeEventListener("open", onOpen);
      ws.removeEventListener("error", onError);
      ws.removeEventListener("close", onClose);
    }

    ws.addEventListener("open", onOpen);
    ws.addEventListener("error", onError);
    ws.addEventListener("close", onClose);
  });
}

function parseMessage(raw: MessageEvent<string>): BattleMessage | null {
  try {
    const data = JSON.parse(raw.data) as BattleMessage;
    if (!data || typeof data.type !== "string") return null;
    return data;
  } catch (error) {
    logWarn("failed to parse inbound message", raw.data, error);
    return null;
  }
}

type LobbySuccess =
  | { type: BattleMessageType.CREATE_ROOM; payload: CreateRoomPayload }
  | { type: BattleMessageType.JOIN_ROOM; payload: JoinRoomPayload };

function requestLobby(
  expectedType: BattleMessageType.CREATE_ROOM | BattleMessageType.JOIN_ROOM,
  message: SendBattleMessage,
  timeoutMs = 10000,
): Promise<LobbySuccess> {
  log("requestLobby start", { expectedType, message });
  const ws = connectBattleSocket();

  return waitForOpen(ws).then(
    () =>
      new Promise<LobbySuccess>((resolve, reject) => {
        const timer = window.setTimeout(() => {
          cleanup();
          logError("requestLobby: timed out waiting for response", {
            expectedType,
          });
          reject(new Error("Timed out waiting for room response"));
        }, timeoutMs);

        const onMessage = (event: MessageEvent<string>) => {
          const data = parseMessage(event);
          if (!data) return;

          if (data.type === BattleMessageType.ERROR) {
            cleanup();
            const err = data.payload as ErrorPayload;
            logError("requestLobby: server error", err);
            reject(new Error(err.message || err.code || "Room request failed"));
            return;
          }

          if (data.type === expectedType) {
            cleanup();
            log("requestLobby: success", data);
            resolve(data as LobbySuccess);
          } else {
            log("requestLobby: ignored message type", data.type);
          }
        };

        const onClose = (event: CloseEvent) => {
          cleanup();
          logError("requestLobby: socket closed before response", {
            code: event.code,
            reason: event.reason || "(none)",
          });
          reject(new Error("WebSocket closed before room response"));
        };

        function cleanup() {
          window.clearTimeout(timer);
          ws.removeEventListener("message", onMessage);
          ws.removeEventListener("close", onClose);
        }

        ws.addEventListener("message", onMessage);
        ws.addEventListener("close", onClose);

        try {
          sendBattleMessage(message);
        } catch (error) {
          cleanup();
          reject(error);
        }
      }),
  );
}

export function createRoomOverSocket(playerName: string) {
  return requestLobby(BattleMessageType.CREATE_ROOM, {
    type: BattleMessageType.CREATE_ROOM,
    payload: { player_name: playerName },
  }) as Promise<{
    type: BattleMessageType.CREATE_ROOM;
    payload: CreateRoomPayload;
  }>;
}

export function joinRoomOverSocket(roomCode: string, playerName: string) {
  return requestLobby(BattleMessageType.JOIN_ROOM, {
    type: BattleMessageType.JOIN_ROOM,
    payload: { room_code: roomCode, player_name: playerName },
  }) as Promise<{
    type: BattleMessageType.JOIN_ROOM;
    payload: JoinRoomPayload;
  }>;
}
