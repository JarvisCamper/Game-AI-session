import { CardAttribute, MoveEffectiveness } from "@/types";

const ATTRIBUTE_ORDER: CardAttribute[] = [
  CardAttribute.SMOKER,
  CardAttribute.CAFFEINE_ADDICT,
  CardAttribute.WORKAHOLIC,
  CardAttribute.GOSSIPER,
  CardAttribute.EARLY_BIRD,
  CardAttribute.NIGHT_OWL,
  CardAttribute.MICROMANAGER,
  CardAttribute.SLACKER,
];

/**
 * Cyclic effectiveness chart: each attribute is strong against the two
 * that follow it in ATTRIBUTE_ORDER and weak against the two before it.
 * Mirrors the backend's rock-paper-scissors-style chart for UI preview.
 */
export function getEffectiveness(
  attacker: CardAttribute,
  defender: CardAttribute
): MoveEffectiveness {
  const a = ATTRIBUTE_ORDER.indexOf(attacker);
  const d = ATTRIBUTE_ORDER.indexOf(defender);
  const diff = (a - d + ATTRIBUTE_ORDER.length) % ATTRIBUTE_ORDER.length;

  if (diff === 1 || diff === 2) return MoveEffectiveness.STRONG;
  if (diff === 6 || diff === 7) return MoveEffectiveness.WEAK;
  return MoveEffectiveness.NEUTRAL;
}

export function effectivenessMultiplier(effectiveness: MoveEffectiveness) {
  switch (effectiveness) {
    case MoveEffectiveness.STRONG:
      return 1.6;
    case MoveEffectiveness.WEAK:
      return 0.5;
    default:
      return 1;
  }
}

export function effectivenessLabel(effectiveness: MoveEffectiveness) {
  switch (effectiveness) {
    case MoveEffectiveness.STRONG:
      return "SUPER EFFECTIVE!";
    case MoveEffectiveness.WEAK:
      return "NOT VERY EFFECTIVE...";
    default:
      return null;
  }
}
