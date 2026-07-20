import {
  CardAttribute,
  MoveEffectiveness,
  type EffectivenessChart,
} from "@/types";

/**
 * Attribute effectiveness — pure, no React, no network.
 * -----------------------------------------------------------------------
 * The 8 office attributes sit on a wheel. Reading clockwise, each attribute
 * is STRONG against the next three and WEAK against the previous three;
 * itself and its polar opposite are NEUTRAL. This is generated rather than
 * hand-written so all 64 pairings stay internally consistent.
 *
 *   offset (defender - attacker, mod 8):
 *     0            -> NEUTRAL (mirror match)
 *     1, 2, 3      -> STRONG
 *     4            -> NEUTRAL (opposite)
 *     5, 6, 7      -> WEAK
 */

/** Canonical wheel order. Do not reorder without re-checking balance. */
export const ATTRIBUTE_WHEEL: readonly CardAttribute[] = [
  CardAttribute.SMOKER,
  CardAttribute.CAFFEINE_ADDICT,
  CardAttribute.WORKAHOLIC,
  CardAttribute.GOSSIPER,
  CardAttribute.EARLY_BIRD,
  CardAttribute.NIGHT_OWL,
  CardAttribute.MICROMANAGER,
  CardAttribute.SLACKER,
];

function offsetEffectiveness(offset: number): MoveEffectiveness {
  if (offset === 0 || offset === 4) return MoveEffectiveness.NEUTRAL;
  return offset <= 3 ? MoveEffectiveness.STRONG : MoveEffectiveness.WEAK;
}

/** Fully materialised chart, mirrored on the client from the (future) server. */
export const EFFECTIVENESS_CHART: EffectivenessChart = ATTRIBUTE_WHEEL.reduce(
  (chart, attacker, i) => {
    chart[attacker] = ATTRIBUTE_WHEEL.reduce(
      (row, defender, j) => {
        row[defender] = offsetEffectiveness((j - i + ATTRIBUTE_WHEEL.length) % ATTRIBUTE_WHEEL.length);
        return row;
      },
      {} as Record<CardAttribute, MoveEffectiveness>,
    );
    return chart;
  },
  {} as EffectivenessChart,
);

export function getEffectiveness(
  attacker: CardAttribute,
  defender: CardAttribute,
): MoveEffectiveness {
  return EFFECTIVENESS_CHART[attacker][defender];
}

/** Damage/heal multiplier for a given effectiveness tier. */
export const EFFECTIVENESS_MULTIPLIER: Record<MoveEffectiveness, number> = {
  [MoveEffectiveness.WEAK]: 0.5,
  [MoveEffectiveness.NEUTRAL]: 1,
  [MoveEffectiveness.STRONG]: 1.5,
};
