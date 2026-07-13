/**
 * PlayerCard — office-member battle card.
 *
 *   import { CHARACTERS } from "./characters";
 *   import PlayerCard from "./PlayerCard";
 *
 *   <PlayerCard character={CHARACTERS[0]} />
 */

import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardAttribute,
  CardMove,
  MoveType,
} from "../../types";

export interface PlayerCardProps {
  character: Card;
  className?: string;
}

interface Theme {
  bgFrom: string;
  bgTo: string;
  accent: string;
  accentSoft: string;
  metal: string;
  metalDark: string;
  glow: string;
  label: string;
  glyph: (id: string) => React.ReactNode;
}

const ATTRIBUTE_LABEL: Record<CardAttribute, string> = {
  [CardAttribute.SMOKER]: "Smoker",
  [CardAttribute.CAFFEINE_ADDICT]: "Caffeine Addict",
  [CardAttribute.WORKAHOLIC]: "Workaholic",
  [CardAttribute.GOSSIPER]: "Gossiper",
  [CardAttribute.EARLY_BIRD]: "Early Bird",
  [CardAttribute.NIGHT_OWL]: "Night Owl",
  [CardAttribute.MICROMANAGER]: "Micromanager",
  [CardAttribute.SLACKER]: "Slacker",
};

const THEME: Record<CardAttribute, Theme> = {
  [CardAttribute.SMOKER]: {
    bgFrom: "#1a120c",
    bgTo: "#2e2218",
    accent: "#c4a574",
    accentSoft: "#e8d4b0",
    metal: "#8a7355",
    metalDark: "#3a2e22",
    glow: "#d4b896",
    label: ATTRIBUTE_LABEL[CardAttribute.SMOKER],
    glyph: (id) => (
      <path
        d="M38 70c0-8 4-12 8-18 2-3 2-6 0-8 6 2 14 8 14 18 0 10-6 16-14 16s-8-4-8-8zm24-28c8-2 16 2 18 10 1 4-1 8-4 10 6 2 10 8 8 14-2 8-12 12-20 8"
        fill="none"
        stroke={`url(#${id}-fill)`}
        strokeWidth="3"
        strokeLinecap="round"
      />
    ),
  },
  [CardAttribute.CAFFEINE_ADDICT]: {
    bgFrom: "#2a1808",
    bgTo: "#4a2e14",
    accent: "#d4a017",
    accentSoft: "#f0d78c",
    metal: "#a67c3a",
    metalDark: "#3d2810",
    glow: "#e8c04a",
    label: ATTRIBUTE_LABEL[CardAttribute.CAFFEINE_ADDICT],
    glyph: (id) => (
      <path
        d="M35 30h28c2 0 4 2 4 4v28c0 8-8 14-18 14s-18-6-18-14V34c0-2 2-4 4-4zm32 8h4c6 0 10 4 10 10s-4 10-10 10h-4"
        fill={`url(#${id}-fill)`}
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="1.5"
      />
    ),
  },
  [CardAttribute.WORKAHOLIC]: {
    bgFrom: "#0d1520",
    bgTo: "#1a2a3a",
    accent: "#5b9fd4",
    accentSoft: "#a8d0f0",
    metal: "#4a7a9a",
    metalDark: "#152030",
    glow: "#7eb8e8",
    label: ATTRIBUTE_LABEL[CardAttribute.WORKAHOLIC],
    glyph: (id) => (
      <path
        d="M28 38h44v36H28V38zm8-10h28l4 10H32l4-10zm14 22v18m-10-10h20"
        fill="none"
        stroke={`url(#${id}-fill)`}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  [CardAttribute.GOSSIPER]: {
    bgFrom: "#2a0f1a",
    bgTo: "#4a1a30",
    accent: "#e85a9a",
    accentSoft: "#f5b0d0",
    metal: "#b85a80",
    metalDark: "#3a1528",
    glow: "#f070b0",
    label: ATTRIBUTE_LABEL[CardAttribute.GOSSIPER],
    glyph: (id) => (
      <>
        <circle cx="38" cy="42" r="10" fill={`url(#${id}-fill)`} />
        <circle cx="62" cy="42" r="10" fill={`url(#${id}-fill)`} opacity="0.7" />
        <path
          d="M30 58c4 10 14 16 20 16s16-6 20-16"
          fill="none"
          stroke={`url(#${id}-fill)`}
          strokeWidth="3"
        />
      </>
    ),
  },
  [CardAttribute.EARLY_BIRD]: {
    bgFrom: "#2a2008",
    bgTo: "#4a3810",
    accent: "#f0a830",
    accentSoft: "#ffd890",
    metal: "#c49040",
    metalDark: "#3a2c10",
    glow: "#ffc050",
    label: ATTRIBUTE_LABEL[CardAttribute.EARLY_BIRD],
    glyph: (id) => (
      <>
        <circle cx="50" cy="50" r="16" fill={`url(#${id}-fill)`} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line
              key={deg}
              x1={50 + Math.cos(rad) * 22}
              y1={50 + Math.sin(rad) * 22}
              x2={50 + Math.cos(rad) * 32}
              y2={50 + Math.sin(rad) * 32}
              stroke={`url(#${id}-fill)`}
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}
      </>
    ),
  },
  [CardAttribute.NIGHT_OWL]: {
    bgFrom: "#0c0c1a",
    bgTo: "#1a1a32",
    accent: "#8a8fff",
    accentSoft: "#c6c9ff",
    metal: "#55566e",
    metalDark: "#191922",
    glow: "#7d82ff",
    label: ATTRIBUTE_LABEL[CardAttribute.NIGHT_OWL],
    glyph: (id) => (
      <path
        d="M62 14c-16 4-26 18-26 34 0 18 14 32 32 32 6 0 12-1 17-4-9 8-21 12-33 12-24 0-42-18-42-40S28 10 52 10c4 0 7 1 10 4z"
        fill={`url(#${id}-fill)`}
        stroke="rgba(0,0,0,0.35)"
        strokeWidth="1.2"
      />
    ),
  },
  [CardAttribute.MICROMANAGER]: {
    bgFrom: "#1a0d0d",
    bgTo: "#321818",
    accent: "#e06050",
    accentSoft: "#f0b0a8",
    metal: "#a05048",
    metalDark: "#2a1414",
    glow: "#f07060",
    label: ATTRIBUTE_LABEL[CardAttribute.MICROMANAGER],
    glyph: (id) => (
      <path
        d="M50 18l4 14h14l-11 8 4 14-11-8-11 8 4-14-11-8h14z"
        fill={`url(#${id}-fill)`}
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="1.5"
      />
    ),
  },
  [CardAttribute.SLACKER]: {
    bgFrom: "#121816",
    bgTo: "#1e2a26",
    accent: "#6ab090",
    accentSoft: "#b0dcc8",
    metal: "#4a7868",
    metalDark: "#1a2822",
    glow: "#80c8a8",
    label: ATTRIBUTE_LABEL[CardAttribute.SLACKER],
    glyph: (id) => (
      <path
        d="M30 55c0-12 9-22 20-22s20 10 20 22c0 4-2 8-4 10H34c-2-2-4-6-4-10zm10-28c0-6 4-10 10-10s10 4 10 10"
        fill={`url(#${id}-fill)`}
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="1.5"
      />
    ),
  },
};

const MOVE_TYPE_LABEL: Record<MoveType, string> = {
  [MoveType.ATTACK]: "ATK",
  [MoveType.DEFEND]: "DEF",
  [MoveType.SPECIAL]: "SPC",
};

const PARTICLE_OFFSETS = [
  { x: 12, y: 18, r: 1.4, o: 0.5 },
  { x: 86, y: 14, r: 1.1, o: 0.4 },
  { x: 90, y: 70, r: 1.6, o: 0.5 },
  { x: 8, y: 78, r: 1.2, o: 0.4 },
  { x: 20, y: 88, r: 0.9, o: 0.35 },
  { x: 78, y: 92, r: 1.3, o: 0.45 },
  { x: 50, y: 6, r: 1.0, o: 0.4 },
  { x: 6, y: 45, r: 0.8, o: 0.3 },
  { x: 94, y: 42, r: 0.9, o: 0.35 },
];

let uidCounter = 0;

function MoveRow({ move, theme }: { move: CardMove; theme: Theme }) {
  return (
    <div className="pc-move">
      <div className="pc-move-head">
        <span
          className="pc-move-type"
          style={{ color: theme.accentSoft, borderColor: theme.metal }}
        >
          {MOVE_TYPE_LABEL[move.type]}
        </span>
        <span className="pc-move-name">{move.name}</span>
        <span className="pc-move-power">{move.base_power}</span>
      </div>
      {move.description ? (
        <p className="pc-move-desc">{move.description}</p>
      ) : null}
    </div>
  );
}

function ArtFallback({
  theme,
  gradId,
}: {
  theme: Theme;
  gradId: string;
}) {
  return (
    <svg viewBox="0 0 100 100" className="pc-art-fallback" aria-hidden="true">
      <defs>
        <radialGradient id={`${gradId}-fill`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor={theme.accentSoft} />
          <stop offset="55%" stopColor={theme.accent} />
          <stop offset="100%" stopColor={theme.metalDark} />
        </radialGradient>
        <radialGradient id={`${gradId}-bg`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor={theme.bgTo} />
          <stop offset="100%" stopColor={theme.bgFrom} />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill={`url(#${gradId}-bg)`} />
      {PARTICLE_OFFSETS.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={p.r}
          fill={theme.accent}
          opacity={p.o}
        />
      ))}
      <circle
        cx="50"
        cy="50"
        r="38"
        fill="none"
        stroke={theme.metal}
        strokeWidth="1"
        opacity="0.5"
      />
      <g transform="translate(0,2)">{theme.glyph(gradId)}</g>
    </svg>
  );
}

export function PlayerCard({ character, className }: PlayerCardProps) {
  const { id, name, avatar, attribute, stats, moves, is_defeated } = character;
  const theme = THEME[attribute];
  const gradId = useMemo(
    () => `pc-${attribute}-${id}-${uidCounter++}`,
    [attribute, id],
  );

  const hasAvatarPath = Boolean(avatar?.trim());
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = hasAvatarPath && !imageFailed;

  useEffect(() => {
    setImageFailed(false);
  }, [id, avatar]);

  const moveList: CardMove[] = [moves.attack, moves.defend, moves.special];

  return (
    <div className={`pc-root ${className ?? ""}`}>
      <style>{CARD_CSS}</style>
      <article
        className={`pc-card${is_defeated ? " pc-defeated" : ""}`}
        style={
          {
            "--pc-bg-from": theme.bgFrom,
            "--pc-bg-to": theme.bgTo,
            "--pc-accent": theme.accent,
            "--pc-accent-soft": theme.accentSoft,
            "--pc-metal": theme.metal,
            "--pc-metal-dark": theme.metalDark,
            "--pc-glow": theme.glow,
          } as React.CSSProperties
        }
      >
        <header className="pc-topbar">
          <span className="pc-id">#{id}</span>
          <h3 className="pc-name">{name}</h3>
          <div className="pc-hp">
            <span className="pc-hp-label">HP</span>
            <span className="pc-hp-value">
              {stats.health}
              <span className="pc-hp-max">/{stats.max_health}</span>
            </span>
          </div>
        </header>

        <div className="pc-art">
          {showImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="pc-avatar"
              src={avatar}
              alt={name}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <ArtFallback theme={theme} gradId={gradId} />
          )}
          <span className="pc-type-chip">{theme.label}</span>
        </div>

        <div className="pc-body">
          {moveList.map((move) => (
            <MoveRow key={move.type} move={move} theme={theme} />
          ))}
        </div>

        <footer className="pc-footer">
          <div className="pc-stat">
            <span className="pc-stat-label">Atk</span>
            <span className="pc-stat-value">{stats.attack}</span>
          </div>
          <div className="pc-stat">
            <span className="pc-stat-label">Def</span>
            <span className="pc-stat-value">{stats.defend}</span>
          </div>
          <div className="pc-stat">
            <span className="pc-stat-label">Spc</span>
            <span className="pc-stat-value">{stats.special}</span>
          </div>
        </footer>
      </article>
    </div>
  );
}

export default PlayerCard;

const CARD_CSS = `
.pc-root { display: inline-block; }
.pc-card {
  --pc-w: 300px;
  width: var(--pc-w);
  aspect-ratio: 5 / 7;
  border-radius: 18px;
  padding: 8px;
  background: linear-gradient(155deg, var(--pc-metal), var(--pc-metal-dark) 40%, #000 120%);
  box-shadow:
    0 12px 30px rgba(0,0,0,0.55),
    0 0 0 1px rgba(255,255,255,0.06) inset;
  font-family: "Cinzel", Georgia, "Times New Roman", serif;
  color: #f1eef7;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-sizing: border-box;
  position: relative;
  transition: filter 0.2s ease, opacity 0.2s ease;
}
.pc-card.pc-defeated {
  filter: grayscale(0.85);
  opacity: 0.55;
}
.pc-card::before {
  content: "";
  position: absolute;
  inset: 6px;
  border-radius: 13px;
  border: 1px solid rgba(255,255,255,0.18);
  pointer-events: none;
  z-index: 1;
}
.pc-topbar {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(180deg, var(--pc-bg-to), var(--pc-bg-from));
  border: 1px solid var(--pc-metal);
  border-radius: 10px;
  padding: 6px 10px;
}
.pc-id {
  font-family: "Inter", system-ui, sans-serif;
  font-size: 9px;
  letter-spacing: 0.06em;
  color: var(--pc-accent-soft);
  opacity: 0.85;
  flex: 0 0 auto;
}
.pc-name {
  flex: 1;
  margin: 0;
  font-size: 15px;
  letter-spacing: 0.02em;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 1px 0 rgba(0,0,0,0.6);
}
.pc-hp {
  display: flex;
  align-items: baseline;
  gap: 3px;
  flex: 0 0 auto;
}
.pc-hp-label {
  font-family: "Inter", system-ui, sans-serif;
  font-size: 9px;
  color: var(--pc-accent-soft);
}
.pc-hp-value {
  font-size: 16px;
  color: var(--pc-accent);
  font-weight: 700;
}
.pc-hp-max {
  font-size: 10px;
  font-weight: 500;
  color: var(--pc-accent-soft);
  opacity: 0.7;
  margin-left: 1px;
}
.pc-art {
  position: relative;
  flex: 1;
  min-height: 0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--pc-metal);
  background: var(--pc-bg-from);
}
.pc-avatar {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}
.pc-art-fallback {
  width: 100%;
  height: 100%;
  display: block;
}
.pc-type-chip {
  position: absolute;
  bottom: 6px;
  right: 6px;
  z-index: 2;
  font-family: "Inter", system-ui, sans-serif;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(0,0,0,0.55);
  border: 1px solid var(--pc-metal);
  color: var(--pc-accent-soft);
}
.pc-body {
  background: linear-gradient(180deg, #1a1a22, #12121a);
  border: 1px solid var(--pc-metal);
  border-radius: 10px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
}
.pc-move { display: flex; flex-direction: column; gap: 2px; }
.pc-move-head { display: flex; align-items: center; gap: 6px; }
.pc-move-type {
  font-family: "Inter", system-ui, sans-serif;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 1px 5px;
  border: 1px solid;
  border-radius: 4px;
  flex: 0 0 auto;
}
.pc-move-name {
  flex: 1;
  font-size: 12px;
  font-weight: 600;
}
.pc-move-power {
  font-size: 13px;
  font-weight: 700;
  color: var(--pc-accent);
}
.pc-move-desc {
  margin: 0 0 0 2px;
  font-family: "Inter", system-ui, sans-serif;
  font-size: 10px;
  line-height: 1.35;
  color: #b9b6c6;
}
.pc-footer {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 4px 8px 2px;
}
.pc-stat {
  display: flex;
  align-items: center;
  gap: 5px;
}
.pc-stat-label {
  font-family: "Inter", system-ui, sans-serif;
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8b87a0;
}
.pc-stat-value {
  font-weight: 700;
  color: var(--pc-accent);
  font-size: 12px;
}
`;
