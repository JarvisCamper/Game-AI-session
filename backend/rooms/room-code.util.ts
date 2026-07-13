const CODE_LENGTH = 4;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Generates a random 4-letter room code (A–Z), retrying on collision against
 * the currently active codes.
 */
export function generateRoomCode(existingCodes: ReadonlySet<string>): string {
  let code: string;

  do {
    code = "";
    for (let i = 0; i < CODE_LENGTH; i++) {
      code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
  } while (existingCodes.has(code));

  return code;
}

/** Normalizes a user-entered room code for lookup. */
export function normalizeRoomCode(code: string): string {
  return code.trim().toUpperCase();
}
