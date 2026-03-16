import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast, springBounce } from '../hooks/useSceneAnimation';

// ── Timing ────────────────────────────────────────────────────────────────────
const GRID_ENTRY_END = 16;
const TAP_FRAME = 32;
const RIPPLE_END = 52;
const CHIP_START = 50;

// ── Layout ────────────────────────────────────────────────────────────────────
const COLS = 7;
const CELL_SIZE = 64;
const CELL_GAP = 8;
const CELL_RADIUS = 12;
const HEADER_SIZE = 20;
const DAY_LABEL_SIZE = 13;
const CELL_FONT_SIZE = 20;
const CHIP_RADIUS = 100;
const CHIP_FONT_SIZE = 16;
const CHIP_PADDING_X = 24;
const CHIP_PADDING_Y = 10;

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
const TARGET_DAY = 14;
const TARGET_IDX = 18;

interface CalendarTapSceneProps {
  dark?: boolean;
  bg?: string;
  month?: string;
  targetDay?: number;
}

export const CalendarTapScene: React.FC<CalendarTapSceneProps> = ({
  dark = false,
  bg,
  month = 'March 2025',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;
  const accentColor = theme.colors.accent;

  const gridSpring = spring({ frame: Math.max(0, frame), fps, config: springFast });
  const gridScale = interpolate(gridSpring, [0, 1], [0.85, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const gridOpacity = interpolate(gridSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const tapSpring = spring({ frame: Math.max(0, frame - TAP_FRAME), fps, config: { mass: 1, stiffness: 300, damping: 12 } });
  const tapScale = interpolate(tapSpring, [0, 0.5, 1], [1, 1.15, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const tapFill = interpolate(tapSpring, [0, 0.3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const rippleProgress = interpolate(frame, [TAP_FRAME, RIPPLE_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rippleR = interpolate(rippleProgress, [0, 1], [0, 40], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rippleOp = interpolate(rippleProgress, [0, 1], [0.6, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const chipSpring = spring({ frame: Math.max(0, frame - CHIP_START), fps, config: springFast });
  const chipY = interpolate(chipSpring, [0, 1], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const chipOp = interpolate(chipSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const rows: (number | null)[][] = [];
  for (let r = 0; r < 5; r++) {
    rows.push(DAYS.slice(r * 7, r * 7 + 7));
  }

  const cellBg = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ opacity: gridOpacity, transform: `scale(${gridScale})` }}>
        {/* Month header */}
        <div style={{ fontFamily: theme.font.display, fontSize: HEADER_SIZE, fontWeight: theme.font.weights.semibold, color: textColor, textAlign: 'center', marginBottom: 24 }}>
          {month}
        </div>

        {/* Day name headers */}
        <div style={{ display: 'flex', gap: CELL_GAP, marginBottom: CELL_GAP }}>
          {DAY_NAMES.map(d => (
            <div key={d} style={{ width: CELL_SIZE, textAlign: 'center', fontFamily: theme.font.display, fontSize: DAY_LABEL_SIZE, fontWeight: theme.font.weights.medium, color: theme.colors.textMuted }}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        {rows.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: CELL_GAP, marginBottom: CELL_GAP }}>
            {row.map((day, ci) => {
              const isTarget = day === TARGET_DAY;
              const flatIdx = ri * 7 + ci;
              return (
                <div
                  key={ci}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    borderRadius: CELL_RADIUS,
                    backgroundColor: isTarget
                      ? `rgba(${parseInt(accentColor.slice(1, 3), 16)}, ${parseInt(accentColor.slice(3, 5), 16)}, ${parseInt(accentColor.slice(5, 7), 16)}, ${tapFill})`
                      : day ? cellBg : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    transform: isTarget ? `scale(${tapScale})` : 'scale(1)',
                    overflow: 'visible',
                  }}
                >
                  {day && (
                    <span style={{
                      fontFamily: theme.font.display,
                      fontSize: CELL_FONT_SIZE,
                      fontWeight: isTarget ? theme.font.weights.bold : theme.font.weights.regular,
                      color: isTarget && tapFill > 0.5 ? theme.colors.bg : textColor,
                    }}>
                      {day}
                    </span>
                  )}
                  {isTarget && rippleR > 0 && (
                    <div style={{
                      position: 'absolute',
                      width: rippleR * 2,
                      height: rippleR * 2,
                      borderRadius: '50%',
                      border: `2px solid ${accentColor}`,
                      opacity: rippleOp,
                      pointerEvents: 'none',
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Confirmation chip */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, opacity: chipOp, transform: `translateY(${chipY}px)` }}>
          <div style={{
            paddingLeft: CHIP_PADDING_X, paddingRight: CHIP_PADDING_X,
            paddingTop: CHIP_PADDING_Y, paddingBottom: CHIP_PADDING_Y,
            borderRadius: CHIP_RADIUS,
            backgroundColor: theme.colors.successLight,
            border: `1px solid ${theme.colors.success}`,
            fontFamily: theme.font.display,
            fontSize: CHIP_FONT_SIZE,
            fontWeight: theme.font.weights.semibold,
            color: theme.colors.success,
          }}>
            Fri, 14 Mar · Confirmed
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
