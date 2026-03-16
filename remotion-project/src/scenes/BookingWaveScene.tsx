import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springBounce } from '../hooks/useSceneAnimation';

// ── Timing ────────────────────────────────────────────────────────────────────
const COUNT_START = 10;
const COUNT_END = 70;
const LABEL_START = 60;

// ── Layout ────────────────────────────────────────────────────────────────────
const NUMBER_SIZE = 96;
const LABEL_SIZE = 22;
const SUB_SIZE = 16;
const WAVE_HEIGHT = 120;
const WAVE_WIDTH = 800;
const WAVE_AMPLITUDE = 28;
const WAVE_Y_OFFSET = 60;

// ── Wave config ────────────────────────────────────────────────────────────────
const WAVE_SPEED = 0.08;
const WAVE_OPACITIES = [0.15, 0.1, 0.07];
const WAVE_PHASES = [0, 1.2, 2.4];
const WAVE_PERIODS = [0.012, 0.009, 0.015];

interface BookingWaveSceneProps {
  dark?: boolean;
  bg?: string;
  count?: number;
  label?: string;
}

function buildWavePath(width: number, height: number, amplitude: number, period: number, phase: number, yOffset: number): string {
  const points: string[] = [];
  const steps = 80;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width;
    const y = height - yOffset - amplitude * Math.sin(x * period + phase);
    points.push(i === 0 ? `M0 ${height} L${x} ${y}` : `L${x} ${y}`);
  }
  points.push(`L${width} ${height} Z`);
  return points.join(' ');
}

export const BookingWaveScene: React.FC<BookingWaveSceneProps> = ({
  dark = false,
  bg,
  count = 47000,
  label = 'bookings made this month',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;

  const numSpring = spring({ frame: Math.max(0, frame - COUNT_START), fps, config: springBounce });
  const numScale = interpolate(numSpring, [0, 0.6, 1], [0.7, 1.05, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const currentCount = Math.round(
    interpolate(frame, [COUNT_START, COUNT_END], [0, count], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );
  const formattedCount = currentCount.toLocaleString();

  const labelOp = interpolate(frame, [LABEL_START, LABEL_START + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Sparkle dots cycling upward
  const sparkleDots = [0, 1, 2].map(i => {
    const cycle = (frame + i * 20) % 40;
    return {
      x: WAVE_WIDTH * (0.2 + i * 0.3),
      y: WAVE_HEIGHT * 0.4 - (cycle / 40) * WAVE_HEIGHT * 0.6,
      op: interpolate(cycle, [0, 10, 30, 40], [0, 0.8, 0.8, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      {/* Wave */}
      <div style={{ position: 'relative', width: WAVE_WIDTH, height: WAVE_HEIGHT, overflow: 'hidden' }}>
        <svg width={WAVE_WIDTH} height={WAVE_HEIGHT} viewBox={`0 0 ${WAVE_WIDTH} ${WAVE_HEIGHT}`} style={{ position: 'absolute', top: 0, left: 0 }}>
          {[0, 1, 2].map(i => (
            <path
              key={i}
              d={buildWavePath(WAVE_WIDTH, WAVE_HEIGHT, WAVE_AMPLITUDE, WAVE_PERIODS[i], WAVE_PHASES[i] + frame * WAVE_SPEED, WAVE_Y_OFFSET)}
              fill={theme.colors.accent}
              opacity={WAVE_OPACITIES[i]}
            />
          ))}
          {sparkleDots.map((dot, i) => (
            <circle key={i} cx={dot.x} cy={dot.y} r={4} fill={theme.colors.accent} opacity={dot.op} />
          ))}
        </svg>
      </div>

      {/* Count */}
      <div style={{ transform: `scale(${numScale})`, textAlign: 'center' }}>
        <div style={{ fontFamily: theme.font.display, fontSize: NUMBER_SIZE, fontWeight: theme.font.weights.black, color: textColor, lineHeight: 1 }}>
          {formattedCount}
        </div>
      </div>

      {/* Label */}
      <div style={{ opacity: labelOp, textAlign: 'center' }}>
        <div style={{ fontFamily: theme.font.display, fontSize: LABEL_SIZE, fontWeight: theme.font.weights.medium, color: theme.colors.textMuted }}>
          {label}
        </div>
      </div>
    </AbsoluteFill>
  );
};
