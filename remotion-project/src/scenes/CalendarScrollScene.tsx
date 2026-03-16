import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast, springBounce } from '../hooks/useSceneAnimation';

// ── Timing ────────────────────────────────────────────────────────────────────
const SCROLL_START = 10;
const SCROLL_END = 42;
const SNAP_FRAME = 44;
const SELECT_FRAME = 58;
const CHIP_START = 70;

// ── Layout ────────────────────────────────────────────────────────────────────
const MONTH_WIDTH = 560;
const MONTH_HEIGHT = 380;
const CELL_SIZE = 60;
const CELL_GAP = 6;
const HEADER_SIZE = 20;
const DAY_LABEL_SIZE = 12;
const CELL_FONT_SIZE = 17;
const CELL_RADIUS = 10;

// ── Data ──────────────────────────────────────────────────────────────────────
const DAY_NAMES = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const FEB_DAYS: (number | null)[] = [
  null, null, null, null, null, null, 1,
  2, 3, 4, 5, 6, 7, 8,
  9, 10, 11, 12, 13, 14, 15,
  16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, null,
];
const MAR_DAYS: (number | null)[] = [
  null, null, null, null, null, 1, 2,
  3, 4, 5, 6, 7, 8, 9,
  10, 11, 12, 13, 14, 15, 16,
  17, 18, 19, 20, 21, 22, 23,
  24, 25, 26, 27, 28, 29, 30,
  31, null,
];
const TARGET_DAY = 14;

interface CalendarScrollSceneProps {
  dark?: boolean;
  bg?: string;
}

const renderMonth = (days: (number | null)[], name: string, targetDay: number | null, tapFill: number, tapScale: number, textColor: string, dark: boolean) => {
  const rows: (number | null)[][] = [];
  for (let r = 0; r < Math.ceil(days.length / 7); r++) rows.push(days.slice(r * 7, r * 7 + 7));
  const cellBg = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  return (
    <div style={{ width: MONTH_WIDTH, flexShrink: 0, paddingTop: 8 }}>
      <div style={{ fontFamily: theme.font.display, fontSize: HEADER_SIZE, fontWeight: theme.font.weights.semibold, color: textColor, textAlign: 'center', marginBottom: 16 }}>
        {name}
      </div>
      <div style={{ display: 'flex', gap: CELL_GAP, marginBottom: CELL_GAP }}>
        {DAY_NAMES.map((d, i) => (
          <div key={i} style={{ width: CELL_SIZE, textAlign: 'center', fontFamily: theme.font.display, fontSize: DAY_LABEL_SIZE, color: theme.colors.textMuted }}>{d}</div>
        ))}
      </div>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', gap: CELL_GAP, marginBottom: CELL_GAP }}>
          {row.map((day, ci) => {
            const isTarget = day === targetDay;
            return (
              <div key={ci} style={{
                width: CELL_SIZE, height: CELL_SIZE, borderRadius: CELL_RADIUS,
                backgroundColor: isTarget ? theme.colors.accent : day ? cellBg : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: isTarget ? `scale(${tapScale})` : 'scale(1)',
              }}>
                {day && (
                  <span style={{
                    fontFamily: theme.font.display, fontSize: CELL_FONT_SIZE,
                    fontWeight: isTarget ? theme.font.weights.bold : theme.font.weights.regular,
                    color: isTarget ? theme.colors.bg : textColor,
                  }}>
                    {day}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const CalendarScrollScene: React.FC<CalendarScrollSceneProps> = ({ dark = false, bg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;

  // Scroll translateX: 0 → -MONTH_WIDTH
  const scrollRaw = interpolate(frame, [SCROLL_START, SCROLL_END], [0, -MONTH_WIDTH], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const snapSpring = spring({ frame: Math.max(0, frame - SNAP_FRAME), fps, config: springFast });
  const snapX = interpolate(snapSpring, [0, 1], [scrollRaw, -MONTH_WIDTH], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const translateX = frame >= SNAP_FRAME ? snapX : scrollRaw;

  // Swipe gesture indicator
  const swipeOp = interpolate(frame, [SCROLL_START, SCROLL_END], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const swipeX = interpolate(frame, [SCROLL_START, SCROLL_END], [0, -40], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Tap on March 14
  const tapSpring = spring({ frame: Math.max(0, frame - SELECT_FRAME), fps, config: springBounce });
  const tapScale = interpolate(tapSpring, [0, 0.5, 1], [1, 1.2, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const tapFill = interpolate(tapSpring, [0, 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const chipSpring = spring({ frame: Math.max(0, frame - CHIP_START), fps, config: springFast });
  const chipOp = interpolate(chipSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const chipY = interpolate(chipSpring, [0, 1], [12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      {/* Scroll viewport */}
      <div style={{ width: MONTH_WIDTH, height: MONTH_HEIGHT, overflow: 'hidden', position: 'relative' }}>
        <div style={{ display: 'flex', transform: `translateX(${translateX}px)`, width: MONTH_WIDTH * 2 }}>
          {renderMonth(FEB_DAYS, 'February 2025', null, 0, 1, textColor, dark)}
          {renderMonth(MAR_DAYS, 'March 2025', frame >= SELECT_FRAME ? TARGET_DAY : null, tapFill, tapScale, textColor, dark)}
        </div>

        {/* Swipe indicator */}
        <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: `translateX(calc(-50% + ${swipeX}px))`, opacity: swipeOp, display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width={40} height={16} viewBox="0 0 40 16" fill="none">
            <line x1={38} y1={8} x2={2} y2={8} stroke={theme.colors.textMuted} strokeWidth={1.5} />
            <path d="M8 2L2 8L8 14" stroke={theme.colors.textMuted} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Chip */}
      <div style={{ opacity: chipOp, transform: `translateY(${chipY}px)` }}>
        <div style={{
          paddingLeft: 24, paddingRight: 24, paddingTop: 10, paddingBottom: 10,
          borderRadius: 100,
          backgroundColor: theme.colors.accentLight,
          border: `1px solid ${theme.colors.accent}`,
          fontFamily: theme.font.display, fontSize: 16,
          fontWeight: theme.font.weights.semibold, color: theme.colors.accent,
        }}>
          Fri 14 March
        </div>
      </div>
    </AbsoluteFill>
  );
};
