import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast, springBounce } from '../hooks/useSceneAnimation';

// ── Timing ────────────────────────────────────────────────────────────────────
const CARD_ENTRY_END = 14;
const LINE_1_START = 16;
const LINE_2_START = 26;
const LINE_3_START = 36;
const LINE_4_START = 46;
const DIVIDER_START = 30;
const CHECK_START = 62;
const CONFIRM_TEXT_START = 74;

// ── Layout ────────────────────────────────────────────────────────────────────
const CARD_MAX_WIDTH = 500;
const CARD_RADIUS = 20;
const CARD_PADDING = 40;
const CHECK_SIZE = 72;
const CHECK_RADIUS = 36;
const LABEL_SIZE = 12;
const VALUE_SIZE = 18;
const DIVIDER_H = 1;

// ── Data ──────────────────────────────────────────────────────────────────────
const LINES = [
  { label: 'VENUE',        value: 'Nobu London' },
  { label: 'DATE',         value: 'Friday, 14 March 2025' },
  { label: 'TIME',         value: '8:00 PM · Party of 2' },
  { label: 'CONFIRMATION', value: '#TPD-2847' },
];
const LINE_STARTS = [LINE_1_START, LINE_2_START, LINE_3_START, LINE_4_START];

interface BookingConfirmedSceneProps {
  dark?: boolean;
  bg?: string;
}

export const BookingConfirmedScene: React.FC<BookingConfirmedSceneProps> = ({ dark = false, bg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;

  const cardSpring = spring({ frame: Math.max(0, frame), fps, config: springFast });
  const cardScale = interpolate(cardSpring, [0, 1], [0.92, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cardOp = interpolate(cardSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const dividerProgress = interpolate(frame, [DIVIDER_START, DIVIDER_START + 18], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const checkSpring = spring({ frame: Math.max(0, frame - CHECK_START), fps, config: springBounce });
  const checkScale = interpolate(checkSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const confirmOp = interpolate(frame, [CONFIRM_TEXT_START, CONFIRM_TEXT_START + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const cardBg = dark ? 'rgba(255,255,255,0.06)' : theme.colors.surface;
  const cardBorder = dark ? 'rgba(255,255,255,0.1)' : theme.colors.border;

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: CARD_MAX_WIDTH,
        backgroundColor: cardBg,
        border: `1px solid ${cardBorder}`,
        borderRadius: CARD_RADIUS,
        padding: CARD_PADDING,
        boxShadow: theme.shadowLg,
        opacity: cardOp,
        transform: `scale(${cardScale})`,
      }}>
        {LINES.map((line, i) => {
          const lineSpring = spring({ frame: Math.max(0, frame - LINE_STARTS[i]), fps, config: springFast });
          const lineY = interpolate(lineSpring, [0, 1], [10, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const lineOp = interpolate(lineSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

          return (
            <div key={i}>
              {i === 2 && (
                <div style={{ height: DIVIDER_H, backgroundColor: theme.colors.border, width: `${dividerProgress}%`, marginBottom: 16 }} />
              )}
              <div style={{ opacity: lineOp, transform: `translateY(${lineY}px)`, marginBottom: i < LINES.length - 1 ? 20 : 0 }}>
                <div style={{ fontFamily: theme.font.display, fontSize: LABEL_SIZE, fontWeight: theme.font.weights.semibold, color: theme.colors.textMuted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
                  {line.label}
                </div>
                <div style={{ fontFamily: theme.font.display, fontSize: VALUE_SIZE, fontWeight: theme.font.weights.medium, color: textColor }}>
                  {line.value}
                </div>
              </div>
            </div>
          );
        })}

        {/* Check */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 32, gap: 12 }}>
          <div style={{
            width: CHECK_SIZE, height: CHECK_SIZE, borderRadius: CHECK_RADIUS,
            backgroundColor: theme.colors.success,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: `scale(${checkScale})`,
          }}>
            <svg width={32} height={32} viewBox="0 0 32 32" fill="none">
              <path d="M8 16L13 21L24 11" stroke={theme.colors.bg} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ opacity: confirmOp, fontFamily: theme.font.display, fontSize: 16, fontWeight: theme.font.weights.semibold, color: theme.colors.success }}>
            Booking confirmed
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
