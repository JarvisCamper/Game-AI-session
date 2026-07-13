import { BattleMessageType } from "@/types";
import type { ErrorPayload } from "@/types";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parseEnvelope(
  raw: unknown,
): { type: string; payload: unknown } | null {
  if (!isRecord(raw) || typeof raw.type !== "string") return null;
  return { type: raw.type, payload: (raw as Record<string, unknown>).payload };
}

export function buildMessage<TPayload>(
  type: BattleMessageType,
  roomUuid: string,
  payload: TPayload,
) {
  return {
    type,
    room_uuid: roomUuid,
    created_at: new Date().toISOString(),
    payload,
  };
}

export function buildError(code: string, message: string) {
  const payload: ErrorPayload = { code, message };
  return { type: BattleMessageType.ERROR, payload };
}
