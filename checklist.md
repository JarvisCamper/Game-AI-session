# Game AI Session — Agent Checklist

Status snapshot for agents continuing work on this repo. Check items off as you complete them; keep notes brief.

---

## Done

### Contract & types

- [x] Shared WebSocket message contract in `types.ts` (`BattleMessageType`, payloads, `BattleMessage`, `SendBattleMessage`)
- [x] Domain shapes: cards, moves, attributes, player/room state, effectiveness types

### Backend (lobby only)

- [x] Raw `ws` server entry (`backend/server.ts`, scripts `ws:dev` / `ws:start`)
- [x] Connection gateway (`backend/ws/connection.gateway.ts`) — parse envelopes, route create/join
- [x] Envelope helpers (`backend/ws/envelope.ts`) — parse, build message, build error
- [x] In-memory room service (`backend/rooms/room.service.ts`) — create/join, max 2 players
- [x] Room code util + room types
- [x] Handled inbound: `CREATE_ROOM`, `JOIN_ROOM`
- [x] Outbound lobby events: create/join success, `OPPONENT_JOINED`, `ERROR`
- [x] Cleanup on disconnect (`removeConnection`)

### Frontend — socket & lobby UX

- [x] Shared client socket (`lib/ws/battle-socket.ts`) — connect/reuse, send, create/join request helpers
- [x] Lobby session persistence (`lib/ws/lobby-session.ts`)
- [x] Landing page create/join over WebSocket → navigate to `/room/[code]` (`feature/landing/LandingPage.tsx`)
- [x] Room lobby page — code display, host/guest slots, opponent-joined updates, WS status (`app/room/[id]/page.tsx`)
- [x] Env: `NEXT_PUBLIC_WS_API` for client WS URL (see `.env`)

### Message mapper & hook

- [x] Typed message mapper (`helper/message-mapper.ts`)
  - parse inbound → `BattleMessage`
  - dispatch to per-type handlers
  - outbound builders for all sendable types
- [x] React hook (`hooks/useBattleMessages.ts`) — subscribe + send/builders API
- [x] Agent pickup checklist (`checklist.md`) — this file

### App shell

- [x] Next.js app routes: `/`, `/room/[id]`, `/settings` (settings page is empty stub)
- [x] Agent guidance: `AGENTS.md` / `CLAUDE.md` (read Next docs under `node_modules/next/dist/docs/` before changing Next APIs)

---

## Not done yet (pickup queue)

### Wire mapper into UI

- [ ] Refactor room page (and later battle UI) to use `useBattleMessages` instead of ad-hoc `JSON.parse` listeners
- [ ] Prefer `battleMessageBuilders` + `send` for outbound traffic where applicable

### Backend — remaining message types

- [ ] `PLAYER_READY` (card selection / ready state)
- [ ] `LEAVE_ROOM`
- [ ] Match lifecycle: `MATCH_START`, `TURN_START`, `MOVE_SELECT`, `MOVE_RESULT`
- [ ] `CARD_DEFEATED`, `ROUND_END`, `GAME_OVER`
- [ ] `TAUNT`
- [ ] `OPPONENT_DISCONNECTED` / `OPPONENT_RECONNECTED` (timeouts, rejoin)

### Gameplay

- [ ] Character / card selection flow
- [ ] Battle UI (turns, moves, health, effectiveness)
- [ ] Effectiveness chart populated client-side (type exists in `types.ts`)
- [ ] Settings page content (`app/settings/page.tsx`)

### Hardening

- [ ] Auth / identity beyond ephemeral player ids
- [ ] Persist rooms beyond in-memory (optional)
- [ ] Reconnect strategy after refresh mid-lobby / mid-match
- [ ] Shared parse helper: align `lib/ws/battle-socket.ts` `parseMessage` with `helper/message-mapper.ts`

---

## Quick map for agents

| Area | Path |
|------|------|
| Message contract | `types.ts` |
| Client mapper | `helper/message-mapper.ts` |
| Client hook | `hooks/useBattleMessages.ts` |
| Client socket | `lib/ws/battle-socket.ts` |
| Lobby session | `lib/ws/lobby-session.ts` |
| Landing | `feature/landing/LandingPage.tsx` |
| Room lobby UI | `app/room/[id]/page.tsx` |
| WS gateway | `backend/ws/connection.gateway.ts` |
| Rooms | `backend/rooms/room.service.ts` |

**Run locally:** `npm run dev` (Next) + `npm run ws:dev` (WebSocket, default `ws://localhost:4001`).
