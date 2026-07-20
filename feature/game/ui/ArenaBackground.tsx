const GRID_PATTERN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Cpath d='M0 .5H48M.5 0V48' stroke='%23ffffff' stroke-opacity='0.06'/%3E%3C/svg%3E";

/**
 * Placeholder arena backdrop — no real illustrated background exists yet, so
 * this layers a dark vignette, a center spotlight over the board, and a
 * faint grid texture instead of a flat fill. Swap for an actual illustration
 * later; nothing above it needs to change.
 */
export function ArenaBackground() {
  return (
    <div className="absolute inset-0 -z-10 bg-[#0c1a14]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(31,94,58,0.55), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-70"
        style={{ backgroundImage: `url("${GRID_PATTERN}")` }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 120% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.65) 100%)",
        }}
      />
    </div>
  );
}
