import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast } from '../hooks/useSceneAnimation';

// ── Timing ────────────────────────────────────────────────────────────────────
const ENTRY_END = 12;
const FILL_START = 16;
const FILL_END = 65;
const COUNT_START = 16;
const COUNT_END = 65;
const LEGEND_START = 55;

// ── Layout ────────────────────────────────────────────────────────────────────
const RING_SIZE = 300;
const RING_RADIUS = 110;
const RING_STROKE = 28;
const CIRCUMFERENCE = Math.PI * 2 * RING_RADIUS;
const INNER_NUMBER_SIZE = 72;
const INNER_PERCENT_SIZE = 28;
const INNER_LABEL_SIZE = 13;
const LEGEND_FONT_SIZE = 15;
const LEGEND_DOT_SIZE = 10;
const SUBTITLE_SIZE = 16;

const DEFAULT_PERCENTAGE = 82;

interface DonutFillSceneProps {
  dark?: boolean;
  bg?: string;
  percentage?: number;
  label?: string;
  sublabel?: string;
}

export const DonutFillScene: React.FC<DonutFillSceneProps> = ({
  dark = false,
  bg,
  percentage = DEFAULT_PERCENTAGE,
  label = 'Capacity Booked',
  sublabel = 'This Weekend',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;

  const entrySpring = spring({ frame: Math.max(0, frame), fps, config: springFast });
  const entryScale = interpolate(entrySpring, [0, 1], [0.9, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const entryOp = interpolate(entrySpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const fillProgress = interpolate(frame, [FILL_START, FILL_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const currentFill = fillProgress * percentage;
  const dashOffset = CIRCUMFERENCE * (1 - currentFill / 100);

  const displayPct = Math.round(interpolate(frame, [COUNT_START, COUNT_END], [0, percentage], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

  const legendSpring = spring({ frame: Math.max(0, frame - LEGEND_START), fps, config: springFast });
  const legendOp = interpolate(legendSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Ring colour based on final percentage
  const ringColor = percentage >= 80 ? theme.colors.accent : percentage >= 60 ? theme.colors.success : theme.colors.textMuted;

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
      <div style={{ opacity: entryOp, transform: `scale(${entryScale})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
        {/* Ring */}
        <div style={{ position: 'relative', width: RING_SIZE, height: RING_SIZE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
            {/* Track */}
            <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS} fill="none" stroke={theme.colors.border} strokeWidth={RING_STROKE} />
            {/* Fill */}
            <circle
              cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS}
              fill="none" stroke={ringColor} strokeWidth={RING_STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
            />
          </svg>
          {/* Centre text */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2 }}>
              <span style={{ fontFamily: theme.font.display, fontSize: INNER_NUMBER_SIZE, fontWeight: theme.font.weights.black, color: textColor, lineHeight: 1 }}>{displayPct}</span>
              <span style={{ fontFamily: theme.font.display, fontSize: INNER_PERCENT_SIZE, fontWeight: theme.font.weights.bold, color: ringColor }}>%</span>
            </div>
            <div style={{ fontFamily: theme.font.display, fontSize: INNER_LABEL_SIZE, color: theme.colors.textMuted, marginTop: 4 }}>{sublabel}</div>
          </div>
        </div>

        {/* Label */}
        <div style={{ fontFamily: theme.font.display, fontSize: SUBTITLE_SIZE, fontWeight: theme.font.weights.medium, color: theme.colors.textMuted }}>
          {label}
        </div>

        {/* Legend */}
        <div style={{ opacity: legendOp, display: 'flex', gap: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: LEGEND_DOT_SIZE, height: LEGEND_DOT_SIZE, borderRadius: '50%', backgroundColor: ringColor }} />
            <span style={{ fontFamily: theme.font.display, fontSize: LEGEND_FONT_SIZE, color: textColor }}>Booked</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: LEGEND_DOT_SIZE, height: LEGEND_DOT_SIZE, borderRadius: '50%', border: `2px solid ${theme.colors.border}` }} />
            <span style={{ fontFamily: theme.font.display, fontSize: LEGEND_FONT_SIZE, color: textColor }}>Available</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
