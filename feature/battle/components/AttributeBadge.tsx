import { CardAttribute } from "@/types";
import { ATTRIBUTE_META } from "../attributeMeta";

export default function AttributeBadge({
  attribute,
  className = "",
}: {
  attribute: CardAttribute;
  className?: string;
}) {
  const meta = ATTRIBUTE_META[attribute];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border-2 border-black bg-surface px-2 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wide text-foreground/90 ${className}`}
    >
      <span aria-hidden>{meta.emoji}</span>
      <span className="font-sans">{meta.label}</span>
    </span>
  );
}
