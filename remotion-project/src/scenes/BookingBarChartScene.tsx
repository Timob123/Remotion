import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast } from '../hooks/useSceneAnimation';

// ── Timing ────────────────────────────────────────────────────────────────────
const TITLE_START = 0;
const AXIS_START = 10;
const BAR_BASE_START = 18;
const BAR_STAGGER = 7;
const LABEL_DELAY = 6;

// ── Layout ────────────────────────────────────────────────────────────────────
const CHART_WIDTH = 640;
const CHART_HEIGHT = 320;
const BAR_WIDTH = 56;
const BAR_GAP = 28;
const BAR_RADIUS = 6;
const GRID_LINES = 4;
const TITLE_SIZE = 26;
const AXIS_LABEL_SIZE = 13;
const VALUE_SIZE = 14;

// ── Data ──────────────────────────────────────────────────────────────────────
const BARS = [
  { day: 'Mon', value: 42, highlight: false },
  { day: 'Tue', value: 58, highlight: false },
  { day: 'Wed', value: 71, highlight: false },
  { day: 'Thu', value: 65, highlight: false },
  { day: 'Fri', value: 112, highlight: true  },
  { day: 'Sat', value: 98, highlight: false },
  { day: 'Sun', value: 55, highlight: false },
];
const MAX_BAR_VALUE = 112;

interface BookingBarChartSceneProps {
  dark?: boolean;
  bg?: string;
  title?: string;
}

export const BookingBarChartScene: React.FC<BookingBarChartSceneProps> = ({
  dark = false,
  bg,
  title = 'Bookings by Day',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;

  const titleSpring = spring({ frame: Math.max(0, frame - TITLE_START), fps, config: springFast });
  const titleX = interpolate(titleSpring, [0, 1], [-30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const titleOp = interpolate(titleSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const axisOp = interpolate(frame, [AXIS_START, AXIS_START + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const mutedBarColor = dark ? 'rgba(255,255,255,0.2)' : 'rgba(99,102,241,0.25)';

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
      {/* Title */}
      <div style={{ opacity: titleOp, transform: `translateX(${titleX}px)`, fontFamily: theme.font.display, fontSize: TITLE_SIZE, fontWeight: theme.font.weights.bold, color: textColor }}>
        {title}
      </div>

      {/* Chart */}
      <div style={{ position: 'relative', width: CHART_WIDTH, height: CHART_HEIGHT }}>
        {/* Grid lines */}
        <div style={{ opacity: axisOp }}>
          {Array.from({ length: GRID_LINES }, (_, i) => {
            const y = ((GRID_LINES - i) / (GRID_LINES + 1)) * CHART_HEIGHT;
            return (
              <div key={i} style={{ position: 'absolute', top: y, left: 0, right: 0, height: 1, backgroundColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }} />
            );
          })}
        </div>

        {/* Bars */}
        <div style={{ position: 'absolute', bottom: 32, left: 0, right: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: BAR_GAP }}>
          {BARS.map((bar, i) => {
            const barStart = BAR_BASE_START + i * BAR_STAGGER;
            const barSpring = spring({ frame: Math.max(0, frame - barStart), fps, config: springFast });
            const barH = interpolate(barSpring, [0, 1], [0, (bar.value / MAX_BAR_VALUE) * (CHART_HEIGHT - 60)], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

            const valStart = barStart + LABEL_DELAY;
            const valOp = interpolate(frame, [valStart, valStart + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const displayVal = Math.round(interpolate(frame, [barStart, barStart + 20], [0, bar.value], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                {/* Value label */}
                <div style={{ opacity: valOp, fontFamily: theme.font.display, fontSize: VALUE_SIZE, fontWeight: theme.font.weights.semibold, color: bar.highlight ? theme.colors.accent : textColor, minHeight: 20 }}>
                  {displayVal}
                </div>
                {/* Bar */}
                <div style={{
                  width: BAR_WIDTH, height: barH,
                  borderRadius: `${BAR_RADIUS}px ${BAR_RADIUS}px 0 0`,
                  backgroundColor: bar.highlight ? theme.colors.accent : mutedBarColor,
                }} />
                {/* Day label */}
                <div style={{ opacity: axisOp, fontFamily: theme.font.display, fontSize: AXIS_LABEL_SIZE, color: bar.highlight ? theme.colors.accent : theme.colors.textMuted, fontWeight: bar.highlight ? theme.font.weights.semibold : theme.font.weights.regular }}>
                  {bar.day}
                </div>
              </div>
            );
          })}
        </div>

        {/* X axis */}
        <div style={{ position: 'absolute', bottom: 28, left: 0, right: 0, height: 1, backgroundColor: dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)', opacity: axisOp }} />
      </div>
    </AbsoluteFill>
  );
};
