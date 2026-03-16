import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast, springBounce } from '../hooks/useSceneAnimation';

// ── Timing ────────────────────────────────────────────────────────────────────
const ENTRY_END = 14;
const TICK_1_FRAME = 28;
const TICK_2_FRAME = 52;
const WIN_FRAME = 68;

// ── Layout ────────────────────────────────────────────────────────────────────
const NUMBER_SIZE = 120;
const LABEL_SIZE = 24;
const SUB_SIZE = 16;
const WIN_SIZE = 42;
const BADGE_RADIUS = 20;
const BADGE_PADDING = 40;

// ── Confetti ──────────────────────────────────────────────────────────────────
const CONFETTI_POS = [
  { x: -180, y: -100 }, { x: 140, y: -120 }, { x: -220, y: 40 },
  { x: 200, y: 60 }, { x: -100, y: 140 }, { x: 120, y: 150 },
  { x: -60, y: -160 }, { x: 80, y: -80 }, { x: -160, y: 80 },
  { x: 160, y: -40 }, { x: -40, y: 160 }, { x: 60, y: 120 },
];
const CONFETTI_THEME_COLORS = [theme.colors.accent, theme.colors.success, theme.colors.danger];

interface WaitlistSceneProps {
  dark?: boolean;
  bg?: string;
}

export const WaitlistScene: React.FC<WaitlistSceneProps> = ({ dark = false, bg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;

  const entrySpring = spring({ frame: Math.max(0, frame), fps, config: springFast });
  const entryScale = interpolate(entrySpring, [0, 1], [0.9, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const entryOp = interpolate(entrySpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Number: 3 → 2 → 1
  let displayNumber = 3;
  if (frame >= TICK_2_FRAME) displayNumber = 1;
  else if (frame >= TICK_1_FRAME) displayNumber = 2;

  // Flip animation for each tick
  const tick1Spring = spring({ frame: Math.max(0, frame - TICK_1_FRAME), fps, config: springBounce });
  const tick2Spring = spring({ frame: Math.max(0, frame - TICK_2_FRAME), fps, config: springBounce });
  const tickScale = frame >= TICK_2_FRAME
    ? interpolate(tick2Spring, [0, 0.5, 1], [0.7, 1.1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : frame >= TICK_1_FRAME
      ? interpolate(tick1Spring, [0, 0.5, 1], [0.7, 1.1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      : 1;

  const isWin = frame >= WIN_FRAME;
  const winSpring = spring({ frame: Math.max(0, frame - WIN_FRAME), fps, config: springBounce });
  const winBgOp = interpolate(winSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const cardBg = dark ? 'rgba(255,255,255,0.06)' : theme.colors.surface;
  const cardBorder = dark ? 'rgba(255,255,255,0.1)' : theme.colors.border;

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ opacity: entryOp, transform: `scale(${entryScale})`, position: 'relative' }}>
        {/* Confetti */}
        {isWin && CONFETTI_POS.map((pos, i) => {
          const confSpring = spring({ frame: Math.max(0, frame - WIN_FRAME - i * 2), fps, config: springBounce });
          const cx = interpolate(confSpring, [0, 1], [0, pos.x], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const cy = interpolate(confSpring, [0, 1], [0, pos.y], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const cop = interpolate(confSpring, [0, 0.2], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <div key={i} style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 10, height: 10, borderRadius: '50%',
              backgroundColor: CONFETTI_THEME_COLORS[i % 3],
              transform: `translate(calc(-50% + ${cx}px), calc(-50% + ${cy}px))`,
              opacity: cop,
            }} />
          );
        })}

        {/* Card */}
        <div style={{
          backgroundColor: isWin ? theme.colors.successLight : cardBg,
          border: `1px solid ${isWin ? theme.colors.success : cardBorder}`,
          borderRadius: BADGE_RADIUS,
          padding: BADGE_PADDING,
          textAlign: 'center',
          minWidth: 360,
          transition: 'none',
        }}>
          {!isWin ? (
            <>
              <div style={{ fontFamily: theme.font.display, fontSize: NUMBER_SIZE, fontWeight: theme.font.weights.black, color: theme.colors.accent, lineHeight: 1, transform: `scale(${tickScale})` }}>
                #{displayNumber}
              </div>
              <div style={{ fontFamily: theme.font.display, fontSize: LABEL_SIZE, fontWeight: theme.font.weights.semibold, color: textColor, marginTop: 16 }}>
                You're on the waitlist
              </div>
              <div style={{ fontFamily: theme.font.display, fontSize: SUB_SIZE, color: theme.colors.textMuted, marginTop: 8 }}>
                Hang tight, a spot is opening soon...
              </div>
            </>
          ) : (
            <>
              <div style={{ fontFamily: theme.font.display, fontSize: WIN_SIZE, fontWeight: theme.font.weights.black, color: theme.colors.success, lineHeight: 1, transform: `scale(${interpolate(winBgOp, [0, 1], [0.5, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})` }}>
                You're in! 🎉
              </div>
              <div style={{ fontFamily: theme.font.display, fontSize: SUB_SIZE, color: theme.colors.success, marginTop: 16, opacity: winBgOp }}>
                Your table is ready
              </div>
            </>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
