import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast } from '../hooks/useSceneAnimation';

// ── Timing ────────────────────────────────────────────────────────────────────
const ENTRY_END = 14;
const TICK_RATE = 8; // frames per second decrement

// ── Layout ────────────────────────────────────────────────────────────────────
const PROGRESS_RING_RADIUS = 80;
const RING_STROKE = 10;
const CIRCUMFERENCE = Math.PI * 2 * PROGRESS_RING_RADIUS;
const TIMER_FONT_SIZE = 52;
const LABEL_SIZE = 15;
const TITLE_SIZE = 32;
const SUB_SIZE = 18;
const CTA_SIZE = 17;
const CTA_RADIUS = 50;
const CTA_PX = 36;
const CTA_PY = 14;
const RING_SIZE = 200;
const MAX_SECONDS = 900; // 15 min total for ring calc

const DEFAULT_START_SECONDS = 899;

interface BookingCountdownSceneProps {
  dark?: boolean;
  bg?: string;
  startSeconds?: number;
}

export const BookingCountdownScene: React.FC<BookingCountdownSceneProps> = ({
  dark = false,
  bg,
  startSeconds = DEFAULT_START_SECONDS,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;

  const entrySpring = spring({ frame: Math.max(0, frame), fps, config: springFast });
  const entryOp = interpolate(entrySpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const entryY = interpolate(entrySpring, [0, 1], [24, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const secondsElapsed = Math.floor(frame / TICK_RATE);
  const currentSeconds = Math.max(0, startSeconds - secondsElapsed);
  const mins = Math.floor(currentSeconds / 60);
  const secs = currentSeconds % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // Ring fill based on remaining time
  const fillRatio = currentSeconds / MAX_SECONDS;
  const dashOffset = CIRCUMFERENCE * (1 - fillRatio);

  const ringColor = currentSeconds < 60 ? theme.colors.danger : currentSeconds < 120 ? theme.colors.accent : theme.colors.success;

  // CTA pulse
  const ctaPulse = 1 + Math.sin(frame * 0.12) * 0.02;

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
      <div style={{ opacity: entryOp, transform: `translateY(${entryY}px)`, textAlign: 'center' }}>
        <div style={{ fontFamily: theme.font.display, fontSize: TITLE_SIZE, fontWeight: theme.font.weights.bold, color: textColor, marginBottom: 8 }}>
          Your table is reserved
        </div>
        <div style={{ fontFamily: theme.font.display, fontSize: SUB_SIZE, fontWeight: theme.font.weights.regular, color: theme.colors.textMuted }}>
          Complete your booking before time runs out
        </div>
      </div>

      {/* Ring + timer */}
      <div style={{ position: 'relative', width: RING_SIZE, height: RING_SIZE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={PROGRESS_RING_RADIUS} fill="none" stroke={theme.colors.border} strokeWidth={RING_STROKE} />
          {/* Fill */}
          <circle
            cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={PROGRESS_RING_RADIUS}
            fill="none"
            stroke={ringColor}
            strokeWidth={RING_STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: theme.font.display, fontSize: TIMER_FONT_SIZE, fontWeight: theme.font.weights.bold, color: textColor, lineHeight: 1 }}>
            {timeStr}
          </div>
          <div style={{ fontFamily: theme.font.display, fontSize: LABEL_SIZE, color: theme.colors.textMuted, marginTop: 4 }}>
            remaining
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        paddingLeft: CTA_PX, paddingRight: CTA_PX, paddingTop: CTA_PY, paddingBottom: CTA_PY,
        borderRadius: CTA_RADIUS,
        backgroundColor: theme.colors.accent,
        transform: `scale(${ctaPulse})`,
        opacity: entryOp,
      }}>
        <span style={{ fontFamily: theme.font.display, fontSize: CTA_SIZE, fontWeight: theme.font.weights.semibold, color: theme.colors.bg }}>
          Reserve now
        </span>
      </div>
    </AbsoluteFill>
  );
};
