import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast, springBounce } from '../hooks/useSceneAnimation';

// ── Timing ────────────────────────────────────────────────────────────────────
const PHONE_ENTRY_END = 20;
const TERMINAL_ENTRY_END = 16;
const APPROACH_START = 20;
const APPROACH_END = 44;
const CONTACT_FRAME = 44;
const RIPPLE_1_END = 60;
const RIPPLE_2_END = 68;
const RIPPLE_3_END = 76;
const CONFIRM_START = 62;

// ── Layout ────────────────────────────────────────────────────────────────────
const PHONE_W = 160;
const PHONE_H = 280;
const PHONE_RADIUS = 24;
const TERMINAL_W = 120;
const TERMINAL_H = 200;
const TERMINAL_RADIUS = 14;
const RIPPLE_MAX_R = 80;
const AMOUNT_SIZE = 28;
const CONFIRM_SIZE = 22;
const GAP_BEFORE_CONTACT = 80;

interface PayTapSceneProps {
  dark?: boolean;
  bg?: string;
  amount?: string;
}

export const PayTapScene: React.FC<PayTapSceneProps> = ({
  dark = false,
  bg,
  amount = '£86.00',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;

  const phoneSpring = spring({ frame: Math.max(0, frame), fps, config: springFast });
  const phoneX = interpolate(phoneSpring, [0, 1], [-80, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const phoneOp = interpolate(phoneSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const termSpring = spring({ frame: Math.max(0, frame), fps, config: springFast });
  const termX = interpolate(termSpring, [0, 1], [80, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const termOp = interpolate(termSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const approachX = interpolate(frame, [APPROACH_START, APPROACH_END], [0, GAP_BEFORE_CONTACT - 4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const makeRipple = (end: number) => {
    const p = interpolate(frame, [CONTACT_FRAME, end], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return { r: p * RIPPLE_MAX_R, op: interpolate(p, [0, 0.2, 1], [0, 0.7, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) };
  };
  const r1 = makeRipple(RIPPLE_1_END);
  const r2 = makeRipple(RIPPLE_2_END);
  const r3 = makeRipple(RIPPLE_3_END);

  const confirmSpring = spring({ frame: Math.max(0, frame - CONFIRM_START), fps, config: springBounce });
  const confirmY = interpolate(confirmSpring, [0, 1], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const confirmOp = interpolate(confirmSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const phoneBg = dark ? '#1C1C1E' : '#1C1C1E';
  const termBg = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  // Midpoint between phone right edge and terminal left edge (contact point)
  // Phone is at -(GAP_BEFORE_CONTACT/2 - approachX/2), terminal is at +(GAP_BEFORE_CONTACT/2)
  // Contact midpoint relative to centre: ~0

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
      {/* Confirmed text */}
      <div style={{ opacity: confirmOp, transform: `translateY(${confirmY}px)`, textAlign: 'center' }}>
        <span style={{ fontFamily: theme.font.display, fontSize: CONFIRM_SIZE, fontWeight: theme.font.weights.bold, color: theme.colors.success }}>
          Payment confirmed ✓
        </span>
      </div>

      {/* Devices row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {/* Ripple rings at contact point */}
        {[r1, r2, r3].map((r, i) => r.r > 0 && (
          <div key={i} style={{
            position: 'absolute',
            width: r.r * 2, height: r.r * 2,
            borderRadius: '50%',
            border: `2px solid ${theme.colors.accent}`,
            opacity: r.op,
            pointerEvents: 'none',
            zIndex: 10,
          }} />
        ))}

        {/* Phone */}
        <div style={{
          width: PHONE_W, height: PHONE_H,
          borderRadius: PHONE_RADIUS,
          backgroundColor: phoneBg,
          border: '3px solid rgba(255,255,255,0.15)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 12,
          opacity: phoneOp,
          transform: `translateX(${phoneX - approachX}px)`,
          flexShrink: 0,
          position: 'relative',
          zIndex: 2,
        }}>
          {/* Apple Pay style */}
          <div style={{ fontFamily: theme.font.display, fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>
            APPLE PAY
          </div>
          <div style={{ fontFamily: theme.font.display, fontSize: AMOUNT_SIZE, fontWeight: theme.font.weights.bold, color: theme.colors.bg }}>
            {amount}
          </div>
          {/* NFC wave icon */}
          <svg width={32} height={32} viewBox="0 0 32 32" fill="none">
            <path d="M16 8 Q24 16 16 24" stroke={theme.colors.accent} strokeWidth={2} strokeLinecap="round" fill="none" />
            <path d="M16 12 Q21 16 16 20" stroke={theme.colors.accent} strokeWidth={2} strokeLinecap="round" fill="none" />
            <circle cx={16} cy={16} r={2} fill={theme.colors.accent} />
          </svg>
        </div>

        {/* Gap spacer */}
        <div style={{ width: GAP_BEFORE_CONTACT - approachX, flexShrink: 0 }} />

        {/* Terminal */}
        <div style={{
          width: TERMINAL_W, height: TERMINAL_H,
          borderRadius: TERMINAL_RADIUS,
          backgroundColor: termBg,
          border: `2px solid ${theme.colors.border}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 16,
          opacity: termOp,
          transform: `translateX(${termX}px)`,
          flexShrink: 0,
        }}>
          <svg width={36} height={36} viewBox="0 0 36 36" fill="none">
            <path d="M18 4 Q30 18 18 32" stroke={theme.colors.textMuted} strokeWidth={2} strokeLinecap="round" fill="none" />
            <path d="M18 10 Q26 18 18 26" stroke={theme.colors.textMuted} strokeWidth={2} strokeLinecap="round" fill="none" />
            <path d="M18 16 Q22 18 18 20" stroke={theme.colors.textMuted} strokeWidth={2} strokeLinecap="round" fill="none" />
          </svg>
          <div style={{ fontFamily: theme.font.display, fontSize: 11, color: theme.colors.textMuted, textAlign: 'center', lineHeight: 1.4 }}>
            TAP TO{'\n'}PAY
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
