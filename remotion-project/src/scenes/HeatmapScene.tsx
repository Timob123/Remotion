import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast, springBounce } from '../hooks/useSceneAnimation';

// ── Timing ────────────────────────────────────────────────────────────────────
const TITLE_START = 0;
const GRID_ENTRY_END = 14;
const CELL_REVEAL_START = 14;
const CELL_STAGGER = 2;

// ── Layout ────────────────────────────────────────────────────────────────────
const CELL_SIZE = 72;
const CELL_GAP = 8;
const CELL_RADIUS = 8;
const TITLE_SIZE = 24;
const DAY_LABEL_SIZE = 13;
const WEEK_LABEL_SIZE = 12;
const LEGEND_SIZE = 12;
const COLS = 7;
const ROWS = 4;

// ── Data ──────────────────────────────────────────────────────────────────────
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEK_NAMES = ['W1', 'W2', 'W3', 'W4'];
const DENSITY: number[] = [
  0.2, 0.3, 0.4, 0.3, 0.8, 0.9, 0.6,
  0.3, 0.4, 0.5, 0.6, 0.9, 1.0, 0.7,
  0.1, 0.2, 0.3, 0.4, 0.7, 0.8, 0.5,
  0.4, 0.5, 0.6, 0.5, 0.95, 0.85, 0.55,
];

interface HeatmapSceneProps {
  dark?: boolean;
  bg?: string;
  title?: string;
}

export const HeatmapScene: React.FC<HeatmapSceneProps> = ({
  dark = false,
  bg,
  title = 'Booking Density — March',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;

  const titleOp = interpolate(frame, [TITLE_START, TITLE_START + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const WEEK_LABEL_W = 32;
  const totalW = WEEK_LABEL_W + COLS * (CELL_SIZE + CELL_GAP);

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
      {/* Title */}
      <div style={{ opacity: titleOp, fontFamily: theme.font.display, fontSize: TITLE_SIZE, fontWeight: theme.font.weights.bold, color: textColor }}>
        {title}
      </div>

      {/* Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Day name headers */}
        <div style={{ display: 'flex', marginLeft: WEEK_LABEL_W, marginBottom: 8, gap: CELL_GAP }}>
          {DAY_NAMES.map(d => (
            <div key={d} style={{ width: CELL_SIZE, textAlign: 'center', fontFamily: theme.font.display, fontSize: DAY_LABEL_SIZE, color: theme.colors.textMuted }}>
              {d}
            </div>
          ))}
        </div>

        {/* Rows */}
        {WEEK_NAMES.map((week, ri) => (
          <div key={ri} style={{ display: 'flex', alignItems: 'center', gap: CELL_GAP, marginBottom: CELL_GAP }}>
            {/* Week label */}
            <div style={{ width: WEEK_LABEL_W, fontFamily: theme.font.display, fontSize: WEEK_LABEL_SIZE, color: theme.colors.textMuted, textAlign: 'right', paddingRight: 6 }}>
              {week}
            </div>
            {/* Cells */}
            {Array.from({ length: COLS }, (_, ci) => {
              const cellIdx = ri * COLS + ci;
              const density = DENSITY[cellIdx] ?? 0;
              const cellStart = CELL_REVEAL_START + cellIdx * CELL_STAGGER;

              const cellSpring = spring({ frame: Math.max(0, frame - cellStart), fps, config: springBounce });
              const cellScale = interpolate(cellSpring, [0, 0.6, 1], [0, 1.1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              const cellOp = interpolate(cellSpring, [0, 0.3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

              const fillOp = 0.1 + density * 0.9;

              return (
                <div key={ci} style={{
                  width: CELL_SIZE, height: CELL_SIZE,
                  borderRadius: CELL_RADIUS,
                  backgroundColor: theme.colors.accent,
                  opacity: cellOp * fillOp,
                  transform: `scale(${cellScale})`,
                }} />
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: interpolate(frame, [CELL_REVEAL_START + COLS * ROWS * CELL_STAGGER, CELL_REVEAL_START + COLS * ROWS * CELL_STAGGER + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
        <span style={{ fontFamily: theme.font.display, fontSize: LEGEND_SIZE, color: theme.colors.textMuted }}>Low</span>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} style={{ width: 28, height: 14, borderRadius: 4, backgroundColor: theme.colors.accent, opacity: 0.1 + (i / 4) * 0.9 }} />
        ))}
        <span style={{ fontFamily: theme.font.display, fontSize: LEGEND_SIZE, color: theme.colors.textMuted }}>High</span>
      </div>
    </AbsoluteFill>
  );
};
