import { CardAttribute } from "@/types";

/**
 * Flavor + display metadata for each office attribute. Purely cosmetic — the
 * effectiveness math in engine/effectiveness.ts doesn't read this at all, so
 * new attributes can get a badge here without touching balance.
 */
export interface TraitMeta {
  label: string;
  icon: string;
  className: string;
}

export const TRAIT_META: Record<CardAttribute, TraitMeta> = {
  [CardAttribute.SMOKER]: {
    label: "Smoker",
    icon: "🚬",
    className: "border-slate-400/40 bg-slate-400/15 text-slate-200",
  },
  [CardAttribute.CAFFEINE_ADDICT]: {
    label: "Caffeine Addict",
    icon: "☕",
    className: "border-amber-400/40 bg-amber-400/15 text-amber-200",
  },
  [CardAttribute.WORKAHOLIC]: {
    label: "Workaholic",
    icon: "💼",
    className: "border-rose-400/40 bg-rose-400/15 text-rose-200",
  },
  [CardAttribute.GOSSIPER]: {
    label: "Gossiper",
    icon: "🗣️",
    className: "border-pink-400/40 bg-pink-400/15 text-pink-200",
  },
  [CardAttribute.EARLY_BIRD]: {
    label: "Early Bird",
    icon: "🌅",
    className: "border-orange-400/40 bg-orange-400/15 text-orange-200",
  },
  [CardAttribute.NIGHT_OWL]: {
    label: "Night Owl",
    icon: "🌙",
    className: "border-indigo-400/40 bg-indigo-400/15 text-indigo-200",
  },
  [CardAttribute.MICROMANAGER]: {
    label: "Micromanager",
    icon: "📋",
    className: "border-red-400/40 bg-red-400/15 text-red-200",
  },
  [CardAttribute.SLACKER]: {
    label: "Slacker",
    icon: "🛋️",
    className: "border-teal-400/40 bg-teal-400/15 text-teal-200",
  },
};
