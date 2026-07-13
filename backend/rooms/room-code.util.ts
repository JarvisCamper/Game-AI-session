const CODE_LENGTH = 4;
const CODE_CEILING = 10 ** CODE_LENGTH;

/**
 * Generates a random 4-digit room code, retrying on collision against the
 * currently active codes.
 */
export function generateRoomCode(existingCodes: ReadonlySet<string>): string {
  let code: string;

  do {
    code = Math.floor(Math.random() * CODE_CEILING)
      .toString()
      .padStart(CODE_LENGTH, "0");
  } while (existingCodes.has(code));

  return code;
}
