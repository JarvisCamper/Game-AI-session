import { BannerInfo } from "../useBattleEngine";

export default function TurnBanner({ banner }: { banner: BannerInfo | null }) {
  if (!banner) return null;

  return (
    <div
      key={banner.id}
      className="animate-banner-slide pointer-events-none absolute left-1/2 top-2 z-40 -translate-x-1/2 sm:top-4"
    >
      <div className="comic-border glow-blue -rotate-1 rounded-lg bg-accent px-5 py-1.5 sm:px-8 sm:py-2">
        <span className="text-stroke font-comic text-lg tracking-widest text-white sm:text-2xl">
          {banner.text}
        </span>
      </div>
    </div>
  );
}
