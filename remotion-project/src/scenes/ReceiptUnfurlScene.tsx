import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast } from '../hooks/useSceneAnimation';

// ── Timing ────────────────────────────────────────────────────────────────────
const UNFURL_START = 8;
const UNFURL_END = 55;
const QR_START = 62;

// ── Layout ────────────────────────────────────────────────────────────────────
const RECEIPT_WIDTH = 340;
const RECEIPT_PADDING = 28;
const RECEIPT_RADIUS = 4;
const LINE_HEIGHT = 52;
const LABEL_SIZE = 11;
const VALUE_SIZE = 16;
const QR_SIZE = 80;
const QR_CELL = 8;
const LOGO_SIZE = 22;
const LINE_COUNT = 6;

// ── Data ──────────────────────────────────────────────────────────────────────
const RECEIPT_LINES = [
  { label: 'VENUE',       value: 'Nobu London' },
  { label: 'DATE',        value: 'Fri 14 Mar 2025' },
  { label: 'TIME',        value: '8:00 PM' },
  { label: 'GUESTS',      value: '2 people' },
  { label: 'BOOKING REF', value: '#TPD-2847' },
  { label: 'STATUS',      value: 'CONFIRMED ✓' },
];

// Simple 5×5 QR pattern (1 = dark cell)
const QR_PATTERN = [
  [1,1,1,1,1],
  [1,0,1,0,1],
  [1,1,0,1,1],
  [1,0,1,0,1],
  [1,1,1,1,1],
];

interface ReceiptUnfurlSceneProps {
  dark?: boolean;
  bg?: string;
}

export const ReceiptUnfurlScene: React.FC<ReceiptUnfurlSceneProps> = ({ dark = false, bg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : '#F5F5F0');
  const textColor = dark ? theme.colors.bg : theme.colors.text;

  const unfurlProgress = interpolate(frame, [UNFURL_START, UNFURL_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const clipBottom = interpolate(unfurlProgress, [0, 1], [100, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const qrSpring = spring({ frame: Math.max(0, frame - QR_START), fps, config: springFast });
  const qrOp = interpolate(qrSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const totalHeight = RECEIPT_PADDING * 2 + LOGO_SIZE + 24 + LINE_COUNT * LINE_HEIGHT + 24 + QR_SIZE + 16;

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        clipPath: `inset(0 0 ${clipBottom}% 0)`,
        width: RECEIPT_WIDTH,
      }}>
        <div style={{
          width: RECEIPT_WIDTH,
          backgroundColor: theme.colors.surface,
          borderRadius: RECEIPT_RADIUS,
          padding: `0 ${RECEIPT_PADDING}px ${RECEIPT_PADDING}px`,
          boxShadow: theme.shadowLg,
          position: 'relative',
        }}>
          {/* Jagged top edge via SVG */}
          <svg width={RECEIPT_WIDTH} height={16} viewBox={`0 0 ${RECEIPT_WIDTH} 16`} style={{ display: 'block', marginLeft: -RECEIPT_PADDING }}>
            <path d={`M0 16 ${Array.from({ length: Math.floor(RECEIPT_WIDTH / 12) }, (_, i) => `L${i * 12 + 6} 0 L${(i + 1) * 12} 16`).join(' ')} L${RECEIPT_WIDTH} 16 Z`} fill={theme.colors.surface} />
          </svg>

          {/* Logo */}
          <div style={{ paddingTop: 8, paddingBottom: 16, textAlign: 'center', borderBottom: `1px dashed ${theme.colors.border}`, marginBottom: 16 }}>
            <span style={{ fontFamily: theme.font.display, fontSize: LOGO_SIZE, fontWeight: theme.font.weights.bold, color: theme.colors.accent }}>tapid</span>
          </div>

          {/* Lines */}
          {RECEIPT_LINES.map((line, i) => {
            const lineReveal = interpolate(unfurlProgress, [i / LINE_COUNT, (i + 1) / LINE_COUNT], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const isStatus = i === LINE_COUNT - 1;
            return (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                height: LINE_HEIGHT, opacity: lineReveal,
                borderTop: i > 0 ? `1px solid ${theme.colors.border}` : 'none',
              }}>
                <span style={{ fontFamily: theme.font.display, fontSize: LABEL_SIZE, color: theme.colors.textMuted, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                  {line.label}
                </span>
                <span style={{
                  fontFamily: theme.font.display, fontSize: VALUE_SIZE,
                  fontWeight: theme.font.weights.semibold,
                  color: isStatus ? theme.colors.success : textColor,
                }}>
                  {line.value}
                </span>
              </div>
            );
          })}

          {/* QR Code */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, opacity: qrOp }}>
            <div style={{ padding: 12, border: `1px solid ${theme.colors.border}`, borderRadius: 8 }}>
              {QR_PATTERN.map((row, ri) => (
                <div key={ri} style={{ display: 'flex' }}>
                  {row.map((cell, ci) => (
                    <div key={ci} style={{ width: QR_CELL, height: QR_CELL, backgroundColor: cell ? textColor : 'transparent' }} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
