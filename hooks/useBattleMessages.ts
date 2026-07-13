"use client";

import { useEffect, useRef } from "react";
import {
  battleMessageBuilders,
  mapRawBattleMessage,
  type BattleMessageHandlers,
} from "@/helper/message-mapper";
import {
  connectBattleSocket,
  getBattleSocket,
  sendBattleMessage,
} from "@/lib/ws/battle-socket";
import type { SendBattleMessage } from "@/types";

export type UseBattleMessagesOptions = {
  /** When true (default), open/reuse the shared battle socket. */
  connect?: boolean;
  handlers?: BattleMessageHandlers;
};

/**
 * Subscribe to inbound battle socket messages and route them through
 * the typed message mapper. Also exposes send helpers for outbound traffic.
 */
export function useBattleMessages(options: UseBattleMessagesOptions = {}) {
  const { connect = true, handlers } = options;
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!connect) return;

    const ws = getBattleSocket() ?? connectBattleSocket();

    const onMessage = (event: MessageEvent<string>) => {
      const current = handlersRef.current;
      if (!current) return;
      mapRawBattleMessage(event.data, current);
    };

    ws.addEventListener("message", onMessage);
    return () => {
      ws.removeEventListener("message", onMessage);
    };
  }, [connect]);

  return {
    send: (message: SendBattleMessage) => sendBattleMessage(message),
    builders: battleMessageBuilders,
  };
}
