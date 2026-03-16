import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast, springBounce } from '../hooks/useSceneAnimation';

// ── Timing ────────────────────────────────────────────────────────────────────
const MAP_ENTRY_END = 12;
const DOT_1_START = 16;
const DOT_2_START = 34;
const DOT_3_START = 52;

// ── Layout ────────────────────────────────────────────────────────────────────
const MAP_SIZE = 560;
const DOT_SIZE = 16;
const DOT_GLOW_SIZE = 40;
const LABEL_FONT_SIZE = 14;
const DIST_FONT_SIZE = 12;
const CENTRE_DOT_SIZE = 12;

// ── Venues ────────────────────────────────────────────────────────────────────
const VENUES = [
  { dx: 120, dy: -80,  name: 'Nobu London',  dist: '0.3 mi', start: DOT_1_START },
  { dx: -90, dy: 60,   name: 'Sexy Fish',    dist: '0.5 mi', start: DOT_2_START },
  { dx: 60,  dy: 130,  name: "Annabel's",    dist: '0.7 mi', start: DOT_3_START },
];

interface NearbyVenueSceneProps {
  dark?: boolean;
  bg?: string;
}

export const NearbyVenueScene: React.FC<NearbyVenueSceneProps> = ({ dark = false, bg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;

  const mapSpring = spring({ frame: Math.max(0, frame), fps, config: springFast });
  const mapOp = interpolate(mapSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Centre pulse ring
  const centrePulse = 1 + Math.sin(frame * 0.1) * 0.15;
  const centreRingOp = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.2, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const cx = MAP_SIZE / 2;
  const cy = MAP_SIZE / 2;

  const cardBg = dark ? 'rgba(255,255,255,0.1)' : theme.colors.surface;

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: MAP_SIZE, height: MAP_SIZE, opacity: mapOp }}>
        {/* Map background */}
        <svg width={MAP_SIZE} height={MAP_SIZE} viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`} style={{ position: 'absolute', top: 0, left: 0 }}>
          <circle cx={cx} cy={cy} r={MAP_SIZE / 2} fill={dark ? '#1a1a2e' : '#eef2ee'} />
          {/* Radar rings */}
          {[100, 180, 260].map((r, i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} strokeWidth={1} />
          ))}
          {/* Cross hairs */}
          <line x1={cx} y1={0} x2={cx} y2={MAP_SIZE} stroke={dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} strokeWidth={1} />
          <line x1={0} y1={cy} x2={MAP_SIZE} y2={cy} stroke={dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} strokeWidth={1} />

          {/* Centre "you" pulse ring */}
          <circle cx={cx} cy={cy} r={CENTRE_DOT_SIZE * centrePulse * 2} fill={theme.colors.accent} opacity={centreRingOp} />
          {/* Centre dot */}
          <circle cx={cx} cy={cy} r={CENTRE_DOT_SIZE / 2} fill={theme.colors.accent} />

          {/* Venue dots */}
          {VENUES.map((v, i) => {
            const dotSpring = spring({ frame: Math.max(0, frame - v.start), fps, config: springBounce });
            const dotScale = interpolate(dotSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const dotOp = interpolate(dotSpring, [0, 0.3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const vx = cx + v.dx;
            const vy = cy + v.dy;
            return (
              <g key={i} opacity={dotOp}>
                <circle cx={vx} cy={vy} r={DOT_GLOW_SIZE / 2} fill={theme.colors.accent} opacity={0.2 * dotScale} />
                <circle cx={vx} cy={vy} r={DOT_SIZE / 2} fill={theme.colors.accent} transform={`scale(${dotScale}) translate(${vx * (1 - dotScale)}, ${vy * (1 - dotScale)})`} />
              </g>
            );
          })}
        </svg>

        {/* Venue label cards */}
        {VENUES.map((v, i) => {
          const cardSpring = spring({ frame: Math.max(0, frame - (v.start + 4)), fps, config: springFast });
          const cardX = interpolate(cardSpring, [0, 1], [12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const cardOp = interpolate(cardSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const vx = cx + v.dx;
          const vy = cy + v.dy;
          return (
            <div key={i} style={{
              position: 'absolute',
              left: vx + DOT_SIZE,
              top: vy - 20,
              opacity: cardOp,
              transform: `translateX(${cardX}px)`,
              backgroundColor: cardBg,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: 10,
              padding: '8px 12px',
              minWidth: 120,
            }}>
              <div style={{ fontFamily: theme.font.display, fontSize: LABEL_FONT_SIZE, fontWeight: theme.font.weights.semibold, color: textColor }}>{v.name}</div>
              <div style={{ fontFamily: theme.font.display, fontSize: DIST_FONT_SIZE, color: theme.colors.textMuted, marginTop: 2 }}>{v.dist}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
