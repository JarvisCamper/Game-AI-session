import { CardAttribute } from "@/types";

export const ATTRIBUTE_META: Record<
  CardAttribute,
  { emoji: string; label: string }
> = {
  [CardAttribute.SMOKER]: { emoji: "\u{1F6AC}", label: "Smoker" },
  [CardAttribute.CAFFEINE_ADDICT]: { emoji: "☕", label: "Caffeine Addict" },
  [CardAttribute.WORKAHOLIC]: { emoji: "\u{1F4BC}", label: "Workaholic" },
  [CardAttribute.GOSSIPER]: { emoji: "\u{1F5E3}️", label: "Gossiper" },
  [CardAttribute.EARLY_BIRD]: { emoji: "\u{1F305}", label: "Early Bird" },
  [CardAttribute.NIGHT_OWL]: { emoji: "\u{1F989}", label: "Night Owl" },
  [CardAttribute.MICROMANAGER]: { emoji: "\u{1F575}️", label: "Micromanager" },
  [CardAttribute.SLACKER]: { emoji: "\u{1F6CB}️", label: "Slacker" },
};
