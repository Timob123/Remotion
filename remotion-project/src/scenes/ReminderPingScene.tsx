import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springBounce } from '../hooks/useSceneAnimation';

// ── Timing ────────────────────────────────────────────────────────────────────
const BANNER_DROP_END = 16;
const ICON_PULSE_START = 20;
const ICON_PULSE_PERIOD = 24;

// ── Layout ────────────────────────────────────────────────────────────────────
const BANNER_WIDTH = 480;
const BANNER_PADDING_X = 20;
const BANNER_PADDING_Y = 16;
const BANNER_RADIUS = 20;
const ICON_SIZE = 44;
const ICON_RADIUS = 12;
const APP_NAME_SIZE = 12;
const BODY_SIZE = 15;
const TIME_SIZE = 13;
const RING_MAX_R = 30;

interface ReminderPingSceneProps {
  dark?: boolean;
  bg?: string;
  title?: string;
  body?: string;
  time?: string;
}

export const ReminderPingScene: React.FC<ReminderPingSceneProps> = ({
  dark = false,
  bg,
  title = 'Tapid',
  body = 'Dinner at Nobu — Tonight 8pm',
  time = 'now',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);

  const bannerSpring = spring({ frame: Math.max(0, frame), fps, config: springBounce });
  const bannerY = interpolate(bannerSpring, [0, 1], [-100, 60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bannerOp = interpolate(bannerSpring, [0, 0.2], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Bell rock
  const bellRock = frame >= ICON_PULSE_START ? Math.sin((frame - ICON_PULSE_START) * 0.25) * 18 : 0;

  // Two pulse rings cycling
  const ring1Phase = Math.max(0, frame - ICON_PULSE_START);
  const ring2Phase = Math.max(0, frame - ICON_PULSE_START - ICON_PULSE_PERIOD / 2);
  const makeRing = (phase: number) => {
    const cycle = phase % ICON_PULSE_PERIOD;
    const p = cycle / ICON_PULSE_PERIOD;
    return { r: p * RING_MAX_R, op: interpolate(p, [0, 0.3, 1], [0.6, 0.4, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) };
  };
  const ring1 = makeRing(ring1Phase);
  const ring2 = makeRing(ring2Phase);

  const bannerBg = dark ? 'rgba(30,30,30,0.95)' : 'rgba(255,255,255,0.97)';
  const bannerBorder = dark ? 'rgba(255,255,255,0.12)' : theme.colors.border;
  const textColor = dark ? theme.colors.bg : theme.colors.text;

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
      {/* Background scene hint */}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, ${theme.colors.accentLight} 0%, ${theme.colors.bg} 60%)`, opacity: 0.5 }} />

      {/* Banner */}
      <div style={{
        position: 'absolute',
        top: bannerY,
        opacity: bannerOp,
        width: BANNER_WIDTH,
        backgroundColor: bannerBg,
        border: `1px solid ${bannerBorder}`,
        borderRadius: BANNER_RADIUS,
        paddingLeft: BANNER_PADDING_X,
        paddingRight: BANNER_PADDING_X,
        paddingTop: BANNER_PADDING_Y,
        paddingBottom: BANNER_PADDING_Y,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        boxShadow: theme.shadowLg,
      }}>
        {/* App icon */}
        <div style={{ width: ICON_SIZE, height: ICON_SIZE, borderRadius: ICON_RADIUS, backgroundColor: theme.colors.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: theme.font.display, fontSize: 20, fontWeight: theme.font.weights.bold, color: theme.colors.bg }}>T</span>
        </div>

        {/* Text */}
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: theme.font.display, fontSize: APP_NAME_SIZE, fontWeight: theme.font.weights.semibold, color: theme.colors.textMuted, marginBottom: 3 }}>{title}</div>
          <div style={{ fontFamily: theme.font.display, fontSize: BODY_SIZE, fontWeight: theme.font.weights.medium, color: textColor }}>{body}</div>
        </div>

        {/* Time + Bell */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0, position: 'relative' }}>
          <div style={{ fontFamily: theme.font.display, fontSize: TIME_SIZE, color: theme.colors.textMuted }}>{time}</div>
          <div style={{ position: 'relative', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {frame >= ICON_PULSE_START && ring1.r > 0 && (
              <div style={{ position: 'absolute', width: ring1.r * 2, height: ring1.r * 2, borderRadius: '50%', border: `1.5px solid ${theme.colors.accent}`, opacity: ring1.op }} />
            )}
            {frame >= ICON_PULSE_START && ring2.r > 0 && (
              <div style={{ position: 'absolute', width: ring2.r * 2, height: ring2.r * 2, borderRadius: '50%', border: `1.5px solid ${theme.colors.accent}`, opacity: ring2.op }} />
            )}
            <svg width={20} height={20} viewBox="0 0 20 20" fill="none" style={{ transform: `rotate(${bellRock}deg)`, transformOrigin: '50% 0%' }}>
              <path d="M10 2C7.2 2 5 4.2 5 7v4l-1.5 2h13L15 11V7c0-2.8-2.2-5-5-5z" fill={theme.colors.accent} />
              <path d="M8.5 17a1.5 1.5 0 003 0" stroke={theme.colors.accent} strokeWidth={1.5} strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
