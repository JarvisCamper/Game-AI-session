import { BubbleInfo } from "../useBattleEngine";

export default function SpeechBubble({
  bubble,
}: {
  bubble: BubbleInfo | null;
}) {
  if (!bubble) return null;

  const isSelf = bubble.side === "self";

  return (
    <div
      key={bubble.id}
      className={`animate-bubble-pop absolute left-1/2 z-20 w-max max-w-[180px] -translate-x-1/2 sm:max-w-[220px] ${
        isSelf ? "bottom-full mb-3" : "top-full mt-3"
      }`}
    >
      <div className="comic-border-sm relative rounded-2xl bg-foreground px-3 py-2 text-center">
        <p className="font-sans text-[11px] font-bold italic leading-snug text-background sm:text-sm">
          {bubble.text}
        </p>
        <span
          className={`absolute left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-foreground ${
            isSelf
              ? "top-full -mt-1.5 border-b-2 border-r-2 border-black"
              : "bottom-full -mb-1.5 border-l-2 border-t-2 border-black"
          }`}
        />
      </div>
    </div>
  );
}
