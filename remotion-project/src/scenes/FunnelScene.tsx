import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast } from '../hooks/useSceneAnimation';

// ── Timing ────────────────────────────────────────────────────────────────────
const TITLE_START = 0;
const BAR_BASE_START = 12;
const BAR_STAGGER = 14;
const DROPOFF_DELAY = 10;

// ── Layout ────────────────────────────────────────────────────────────────────
const FUNNEL_WIDTH = 560;
const BAR_MAX_WIDTH = 560;
const BAR_HEIGHT = 64;
const BAR_GAP = 16;
const BAR_RADIUS = 8;
const CONNECTOR_H = 16;
const TITLE_SIZE = 28;
const STEP_LABEL_SIZE = 16;
const VALUE_SIZE = 14;
const DROPOFF_SIZE = 13;

// ── Data ──────────────────────────────────────────────────────────────────────
const STEPS = [
  { label: 'Searched',  value: 24800, width: 1.00,  highlight: false },
  { label: 'Viewed',    value: 12400, width: 0.50,  highlight: false },
  { label: 'Selected',  value: 6200,  width: 0.25,  highlight: false },
  { label: 'Booked',    value: 3720,  width: 0.15,  highlight: true  },
];
const DROPOFFS = ['↓ 50% drop-off', '↓ 50% drop-off', '↓ 40% drop-off'];

interface FunnelSceneProps {
  dark?: boolean;
  bg?: string;
  title?: string;
}

export const FunnelScene: React.FC<FunnelSceneProps> = ({
  dark = false,
  bg,
  title = 'Booking Funnel',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;

  const titleOp = interpolate(frame, [TITLE_START, TITLE_START + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const mutedBarBg = dark ? 'rgba(255,255,255,0.15)' : 'rgba(99,102,241,0.15)';
  const connectorColor = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28 }}>
      {/* Title */}
      <div style={{ opacity: titleOp, fontFamily: theme.font.display, fontSize: TITLE_SIZE, fontWeight: theme.font.weights.bold, color: textColor }}>
        {title}
      </div>

      {/* Funnel */}
      <div style={{ width: FUNNEL_WIDTH, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        {STEPS.map((step, i) => {
          const barStart = BAR_BASE_START + i * BAR_STAGGER;
          const barSpring = spring({ frame: Math.max(0, frame - barStart), fps, config: springFast });
          const barW = interpolate(barSpring, [0, 1], [0, step.width * BAR_MAX_WIDTH], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const barOp = interpolate(barSpring, [0, 0.3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

          const displayVal = Math.round(interpolate(frame, [barStart, barStart + 20], [0, step.value], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

          const dropoffStart = barStart + DROPOFF_DELAY;
          const dropoffOp = i < DROPOFFS.length
            ? interpolate(frame, [dropoffStart, dropoffStart + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            : 0;

          return (
            <div key={i} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Bar row */}
              <div style={{ width: '100%', opacity: barOp, display: 'flex', justifyContent: 'center', position: 'relative', height: BAR_HEIGHT, alignItems: 'center' }}>
                <div style={{
                  width: barW, height: BAR_HEIGHT,
                  borderRadius: BAR_RADIUS,
                  backgroundColor: step.highlight ? theme.colors.success : mutedBarBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingLeft: 16, paddingRight: 16,
                  boxSizing: 'border-box',
                  minWidth: barW > 0 ? 80 : 0,
                  overflow: 'hidden',
                }}>
                  <span style={{ fontFamily: theme.font.display, fontSize: STEP_LABEL_SIZE, fontWeight: theme.font.weights.semibold, color: step.highlight ? theme.colors.bg : textColor, whiteSpace: 'nowrap' }}>
                    {step.label}
                  </span>
                  <span style={{ fontFamily: theme.font.display, fontSize: VALUE_SIZE, color: step.highlight ? 'rgba(255,255,255,0.8)' : theme.colors.textMuted, whiteSpace: 'nowrap' }}>
                    {displayVal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Drop-off badge */}
              {i < DROPOFFS.length && (
                <div style={{ height: CONNECTOR_H + BAR_GAP, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0, opacity: dropoffOp }}>
                  <div style={{ width: 2, height: 8, backgroundColor: connectorColor }} />
                  <div style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 3, paddingBottom: 3, borderRadius: 100, backgroundColor: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)' }}>
                    <span style={{ fontFamily: theme.font.display, fontSize: DROPOFF_SIZE, color: theme.colors.textMuted }}>{DROPOFFS[i]}</span>
                  </div>
                  <div style={{ width: 2, height: 8, backgroundColor: connectorColor }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
