import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast, springBounce } from '../hooks/useSceneAnimation';

// ── Timing ────────────────────────────────────────────────────────────────────
const TITLE_START = 0;
const AXIS_START = 10;
const LINE_DRAW_START = 16;
const LINE_DRAW_END = 65;
const PEAK_ANNOTATION_START = 68;

// ── Layout ────────────────────────────────────────────────────────────────────
const CHART_WIDTH = 640;
const CHART_HEIGHT = 280;
const LINE_STROKE = 3;
const DOT_SIZE = 12;
const DOT_GLOW_SIZE = 28;
const ANNOTATION_WIDTH = 180;
const ANNOTATION_HEIGHT = 72;
const ANNOTATION_RADIUS = 12;
const TITLE_SIZE = 26;
const AXIS_LABEL_SIZE = 12;
const ANNOTATION_FONT_SIZE = 13;
const GRID_LINES = 4;

// ── Data ──────────────────────────────────────────────────────────────────────
const DATA_POINTS = [
  { x: 0.00, y: 0.18 },
  { x: 0.14, y: 0.32 },
  { x: 0.29, y: 0.28 },
  { x: 0.43, y: 0.55 },
  { x: 0.57, y: 0.48 },
  { x: 0.71, y: 0.72 },
  { x: 0.86, y: 0.91 },
  { x: 1.00, y: 0.85 },
];
const X_LABELS = ['Mar 1', 'Mar 5', 'Mar 10', 'Mar 15', 'Mar 20', 'Mar 25', 'Mar 29', 'Mar 31'];
const PEAK_IDX = 6;
const CHART_PAD_BOTTOM = 32;
const CHART_PAD_TOP = 20;

function pointToPixel(px: number, py: number): { x: number; y: number } {
  return {
    x: px * CHART_WIDTH,
    y: CHART_PAD_TOP + (1 - py) * (CHART_HEIGHT - CHART_PAD_TOP - CHART_PAD_BOTTOM),
  };
}

interface RevenueLineSceneProps {
  dark?: boolean;
  bg?: string;
  title?: string;
}

export const RevenueLineScene: React.FC<RevenueLineSceneProps> = ({
  dark = false,
  bg,
  title = 'Revenue This Month',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;

  const titleOp = interpolate(frame, [TITLE_START, TITLE_START + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const axisOp = interpolate(frame, [AXIS_START, AXIS_START + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const drawProgress = interpolate(frame, [LINE_DRAW_START, LINE_DRAW_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Build path points
  const pixels = DATA_POINTS.map(p => pointToPixel(p.x, p.y));

  // SVG polyline path
  const linePath = pixels.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${pixels[pixels.length - 1].x},${CHART_HEIGHT - CHART_PAD_BOTTOM} L0,${CHART_HEIGHT - CHART_PAD_BOTTOM} Z`;

  // Approximate total path length for dash animation
  const APPROX_PATH_LENGTH = 900;
  const dashOffset = APPROX_PATH_LENGTH * (1 - drawProgress);

  // Moving dot position
  const dotX = drawProgress * CHART_WIDTH;
  const dotY = (() => {
    let best = pixels[0];
    for (let i = 0; i < pixels.length - 1; i++) {
      if (dotX >= pixels[i].x && dotX <= pixels[i + 1].x) {
        const t = (dotX - pixels[i].x) / (pixels[i + 1].x - pixels[i].x);
        return pixels[i].y + t * (pixels[i + 1].y - pixels[i].y);
      }
    }
    return pixels[pixels.length - 1].y;
  })();

  const peakSpring = spring({ frame: Math.max(0, frame - PEAK_ANNOTATION_START), fps, config: springBounce });
  const peakScale = interpolate(peakSpring, [0, 1], [0.8, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const peakOp = interpolate(peakSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const peakPx = pointToPixel(DATA_POINTS[PEAK_IDX].x, DATA_POINTS[PEAK_IDX].y);

  const cardBg = dark ? 'rgba(255,255,255,0.1)' : theme.colors.surface;

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28 }}>
      <div style={{ opacity: titleOp, fontFamily: theme.font.display, fontSize: TITLE_SIZE, fontWeight: theme.font.weights.bold, color: textColor }}>
        {title}
      </div>

      <div style={{ position: 'relative', width: CHART_WIDTH, height: CHART_HEIGHT }}>
        {/* Grid lines */}
        <div style={{ opacity: axisOp }}>
          {Array.from({ length: GRID_LINES }, (_, i) => {
            const y = CHART_PAD_TOP + (i / GRID_LINES) * (CHART_HEIGHT - CHART_PAD_TOP - CHART_PAD_BOTTOM);
            return <div key={i} style={{ position: 'absolute', top: y, left: 0, right: 0, height: 1, backgroundColor: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)' }} />;
          })}
        </div>

        <svg width={CHART_WIDTH} height={CHART_HEIGHT} viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}>
          {/* Clip for area reveal */}
          <defs>
            <clipPath id="lineClip">
              <rect x={0} y={0} width={drawProgress * CHART_WIDTH} height={CHART_HEIGHT} />
            </clipPath>
          </defs>

          {/* Area fill */}
          <path d={areaPath} fill={theme.colors.accent} opacity={0.1} clipPath="url(#lineClip)" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke={theme.colors.accent}
            strokeWidth={LINE_STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={APPROX_PATH_LENGTH}
            strokeDashoffset={dashOffset}
          />

          {/* Moving dot */}
          {drawProgress > 0 && (
            <>
              <circle cx={dotX} cy={dotY} r={DOT_GLOW_SIZE / 2} fill={theme.colors.accent} opacity={0.2} />
              <circle cx={dotX} cy={dotY} r={DOT_SIZE / 2} fill={theme.colors.accent} />
            </>
          )}
        </svg>

        {/* X axis labels */}
        <div style={{ opacity: axisOp, position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between' }}>
          {X_LABELS.map((l, i) => (
            <span key={i} style={{ fontFamily: theme.font.display, fontSize: AXIS_LABEL_SIZE, color: theme.colors.textMuted }}>{l}</span>
          ))}
        </div>

        {/* Annotation */}
        <div style={{
          position: 'absolute',
          left: peakPx.x - ANNOTATION_WIDTH / 2,
          top: peakPx.y - ANNOTATION_HEIGHT - 16,
          width: ANNOTATION_WIDTH,
          height: ANNOTATION_HEIGHT,
          opacity: peakOp,
          transform: `scale(${peakScale})`,
          backgroundColor: cardBg,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: ANNOTATION_RADIUS,
          padding: 14,
          boxSizing: 'border-box',
        }}>
          <div style={{ fontFamily: theme.font.display, fontSize: 20, fontWeight: theme.font.weights.bold, color: theme.colors.success }}>+£12,400</div>
          <div style={{ fontFamily: theme.font.display, fontSize: ANNOTATION_FONT_SIZE, color: theme.colors.textMuted, marginTop: 4 }}>Best day this month</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
