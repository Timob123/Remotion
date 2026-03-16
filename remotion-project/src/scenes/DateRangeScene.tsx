import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast, springBounce } from '../hooks/useSceneAnimation';

// ── Timing ────────────────────────────────────────────────────────────────────
const GRID_ENTRY_END = 14;
const START_TAP = 24;
const SWEEP_START = 30;
const SWEEP_END = 54;
const END_TAP = 56;
const LABEL_START = 62;

// ── Layout ────────────────────────────────────────────────────────────────────
const CELL_SIZE = 72;
const CELL_GAP = 6;
const HEADER_SIZE = 22;
const DAY_LABEL_SIZE = 12;
const CELL_FONT_SIZE = 18;

// ── Data ──────────────────────────────────────────────────────────────────────
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS: (number | null)[] = [
  null, null, null, null, null, 1, 2,
  3, 4, 5, 6, 7, 8, 9,
  10, 11, 12, 13, 14, 15, 16,
  17, 18, 19, 20, 21, 22, 23,
  24, 25, 26, 27, 28, 29, 30,
  null, null,
];
const START_DAY = 10;
const END_DAY = 14;
const START_IDX = 14;
const END_IDX = 18;

interface DateRangeSceneProps {
  dark?: boolean;
  bg?: string;
}

export const DateRangeScene: React.FC<DateRangeSceneProps> = ({ dark = false, bg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;

  const gridSpring = spring({ frame: Math.max(0, frame), fps, config: springFast });
  const gridOpacity = interpolate(gridSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const gridScale = interpolate(gridSpring, [0, 1], [0.9, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const startSpring = spring({ frame: Math.max(0, frame - START_TAP), fps, config: springBounce });
  const startFill = interpolate(startSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const endSpring = spring({ frame: Math.max(0, frame - END_TAP), fps, config: springBounce });
  const endFill = interpolate(endSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Sweep progress — how many cells between start and end are filled
  const sweepProgress = interpolate(frame, [SWEEP_START, SWEEP_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const sweepCells = Math.round(sweepProgress * (END_IDX - START_IDX - 1));

  const labelSpring = spring({ frame: Math.max(0, frame - LABEL_START), fps, config: springFast });
  const labelY = interpolate(labelSpring, [0, 1], [16, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const labelOp = interpolate(labelSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const rows: (number | null)[][] = [];
  for (let r = 0; r < 5; r++) rows.push(DAYS.slice(r * 7, r * 7 + 7));

  const cellBg = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  const getCellStyle = (day: number | null, flatIdx: number) => {
    if (!day) return { bg: 'transparent', textCol: textColor, radius: 0 };
    if (day === START_DAY) return { bg: startFill > 0.5 ? theme.colors.accent : cellBg, textCol: startFill > 0.5 ? theme.colors.bg : textColor, radius: CELL_SIZE / 2 };
    if (day === END_DAY) return { bg: endFill > 0.5 ? theme.colors.accent : cellBg, textCol: endFill > 0.5 ? theme.colors.bg : textColor, radius: CELL_SIZE / 2 };
    const sweepIdx = flatIdx - START_IDX - 1;
    if (sweepIdx >= 0 && sweepIdx < sweepCells) return { bg: theme.colors.accentLight, textCol: theme.colors.accent, radius: 4 };
    return { bg: cellBg, textCol: textColor, radius: 8 };
  };

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ opacity: gridOpacity, transform: `scale(${gridScale})` }}>
        <div style={{ fontFamily: theme.font.display, fontSize: HEADER_SIZE, fontWeight: theme.font.weights.semibold, color: textColor, textAlign: 'center', marginBottom: 20 }}>
          March 2025
        </div>
        <div style={{ display: 'flex', gap: CELL_GAP, marginBottom: CELL_GAP }}>
          {DAY_NAMES.map(d => (
            <div key={d} style={{ width: CELL_SIZE, textAlign: 'center', fontFamily: theme.font.display, fontSize: DAY_LABEL_SIZE, color: theme.colors.textMuted }}>
              {d}
            </div>
          ))}
        </div>
        {rows.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: 0, marginBottom: CELL_GAP }}>
            {row.map((day, ci) => {
              const flatIdx = ri * 7 + ci;
              const { bg: cellBgColor, textCol, radius } = getCellStyle(day, flatIdx);
              return (
                <div key={ci} style={{
                  width: CELL_SIZE, height: CELL_SIZE,
                  backgroundColor: cellBgColor,
                  borderRadius: radius,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginRight: CELL_GAP,
                }}>
                  {day && (
                    <span style={{ fontFamily: theme.font.display, fontSize: CELL_FONT_SIZE, fontWeight: theme.font.weights.medium, color: textCol }}>
                      {day}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        <div style={{ textAlign: 'center', marginTop: 20, opacity: labelOp, transform: `translateY(${labelY}px)`, fontFamily: theme.font.display, fontSize: 16, fontWeight: theme.font.weights.semibold, color: theme.colors.accent }}>
          Mon 10 Mar → Fri 14 Mar · 5 nights
        </div>
      </div>
    </AbsoluteFill>
  );
};
