import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { theme } from '../config/theme';
import { springFast } from '../hooks/useSceneAnimation';

// ─── Timing constants ────────────────────────────────────────────────────────
const CARD_SCALE_END   = 12;
const COUNT_START      = 12;
const COUNT_END        = 70;
const CHART_DRAW_START = 15;
const CHART_DRAW_END   = 80;

// ─── Layout constants ────────────────────────────────────────────────────────
const CHART_PATH_LENGTH  = 880;
const CARD_GAP           = 24;
const CARD_PADDING       = 24;
const CARD_RADIUS        = 12;
const METRIC_FONT_SIZE   = 40;
const LABEL_FONT_SIZE    = 13;
const CHART_HEIGHT       = 200;
const CHART_STROKE_WIDTH = 3;
const CHART_AREA_RADIUS  = 12;
const CHART_MARGIN_TOP   = 48;
const CONTENT_MAX_WIDTH  = 960;
const CONTENT_PADDING    = 80;
const CARD_LABEL_GAP     = 8;
const CHART_AREA_PADDING = 24;

// ─── Colour constants (derived from theme + per-mode) ────────────────────────
const CARD_BG_DARK    = 'rgba(255,255,255,0.06)';
const CARD_BG_LIGHT   = 'rgba(0,0,0,0.04)';
const CARD_BORDER_DARK  = 'rgba(255,255,255,0.1)';
const CARD_BORDER_LIGHT = 'rgba(0,0,0,0.08)';

// ─── Content constants ───────────────────────────────────────────────────────
const METRICS = [
  { label: 'MRR', value: 48200, prefix: '$', suffix: '', decimals: 0 },
  { label: 'Active Users', value: 12847, prefix: '', suffix: '', decimals: 0 },
  { label: 'Churn Rate', value: 1.8, prefix: '', suffix: '%', decimals: 1 },
];

const CHART_PATH_D =
  'M 0 160 C 80 140, 160 120, 220 100 C 280 80, 340 90, 400 70 C 460 50, 520 60, 580 40 C 640 20, 700 30, 760 15 C 800 8, 840 5, 880 2';

// ─── Types ───────────────────────────────────────────────────────────────────
type DashboardRevealSceneProps = {
  dark?: boolean;
  bg?: string;
};

// ─── Component ───────────────────────────────────────────────────────────────
export const DashboardRevealScene: React.FC<DashboardRevealSceneProps> = ({
  dark = true,
  bg,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Colours
  const bgColor   = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;
  const cardBg    = dark ? CARD_BG_DARK : CARD_BG_LIGHT;
  const cardBorder = dark ? CARD_BORDER_DARK : CARD_BORDER_LIGHT;

  // ── Card scale-in spring ────────────────────────────────────────────────
  const cardSpring = spring({ frame, fps, config: springFast });
  const cardScale = interpolate(
    cardSpring,
    [0, 1],
    [0.85, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const cardOpacity = interpolate(
    cardSpring,
    [0, 0.4],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // ── Metric count-up progress ─────────────────────────────────────────────
  const countProgress = interpolate(
    frame,
    [COUNT_START, COUNT_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // ── Chart stroke-dashoffset reveal ──────────────────────────────────────
  const chartProgress = interpolate(
    frame,
    [CHART_DRAW_START, CHART_DRAW_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const strokeDashoffset = interpolate(
    chartProgress,
    [0, 1],
    [CHART_PATH_LENGTH, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Chart fade-in tied to draw progress
  const chartOpacity = interpolate(
    frame,
    [CHART_DRAW_START, CHART_DRAW_START + 8],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: CONTENT_MAX_WIDTH,
          padding: `0 ${CONTENT_PADDING}px`,
          boxSizing: 'border-box',
        }}
      >
        {/* ── Metric cards row ───────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: CARD_GAP,
            transform: `scale(${cardScale})`,
            opacity: cardOpacity,
          }}
        >
          {METRICS.map((metric, i) => {
            const currentValue = metric.value * countProgress;
            const displayValue =
              metric.decimals > 0
                ? currentValue.toFixed(metric.decimals)
                : Math.floor(currentValue).toLocaleString();

            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  padding: CARD_PADDING,
                  borderRadius: CARD_RADIUS,
                  backgroundColor: cardBg,
                  border: `1px solid ${cardBorder}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: CARD_LABEL_GAP,
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    fontFamily: theme.font.display,
                    fontSize: LABEL_FONT_SIZE,
                    color: textColor,
                    opacity: 0.6,
                    fontWeight: theme.font.weights.medium,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {metric.label}
                </div>
                <div
                  style={{
                    fontFamily: theme.font.display,
                    fontSize: METRIC_FONT_SIZE,
                    fontWeight: theme.font.weights.bold,
                    color: textColor,
                    lineHeight: 1.1,
                  }}
                >
                  {metric.prefix}{displayValue}{metric.suffix}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Chart area ──────────────────────────────────────────────────── */}
        <div
          style={{
            marginTop: CHART_MARGIN_TOP,
            borderRadius: CHART_AREA_RADIUS,
            backgroundColor: cardBg,
            border: `1px solid ${cardBorder}`,
            padding: CHART_AREA_PADDING,
            opacity: chartOpacity,
          }}
        >
          <svg
            viewBox={`0 0 ${CHART_PATH_LENGTH} ${CHART_HEIGHT}`}
            width="100%"
            height={CHART_HEIGHT}
            style={{ display: 'block', overflow: 'visible' }}
          >
            <path
              d={CHART_PATH_D}
              fill="none"
              stroke={theme.colors.accent}
              strokeWidth={CHART_STROKE_WIDTH}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={CHART_PATH_LENGTH}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default DashboardRevealScene;
