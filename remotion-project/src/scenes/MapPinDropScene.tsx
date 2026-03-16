import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast, springBounce } from '../hooks/useSceneAnimation';

// ── Timing ────────────────────────────────────────────────────────────────────
const MAP_ENTRY_END = 18;
const PIN_DROP_START = 20;
const PIN_LAND_FRAME = 36;
const RIPPLE_END = 54;
const CARD_START = 50;

// ── Layout ────────────────────────────────────────────────────────────────────
const MAP_WIDTH = 640;
const MAP_HEIGHT = 400;
const MAP_RADIUS = 20;
const PIN_SIZE = 48;
const RIPPLE_MAX_R = 48;
const CARD_RADIUS = 16;
const CARD_PADDING = 24;
const VENUE_FONT_SIZE = 20;
const ADDRESS_FONT_SIZE = 14;

interface MapPinDropSceneProps {
  dark?: boolean;
  bg?: string;
  venueName?: string;
  address?: string;
}

export const MapPinDropScene: React.FC<MapPinDropSceneProps> = ({
  dark = false,
  bg,
  venueName = 'Nobu London',
  address = '15 Berkeley St, Mayfair, London W1J 8DY',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;

  const mapSpring = spring({ frame: Math.max(0, frame), fps, config: springFast });
  const mapScale = interpolate(mapSpring, [0, 1], [0.95, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const mapOp = interpolate(mapSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const pinSpring = spring({ frame: Math.max(0, frame - PIN_DROP_START), fps, config: springBounce });
  const pinY = interpolate(pinSpring, [0, 1], [-80, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const pinOp = interpolate(pinSpring, [0, 0.2], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const rippleProgress = interpolate(frame, [PIN_LAND_FRAME, RIPPLE_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rippleR = interpolate(rippleProgress, [0, 1], [0, RIPPLE_MAX_R], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rippleOp = interpolate(rippleProgress, [0, 0.2, 1], [0, 0.7, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const cardSpring = spring({ frame: Math.max(0, frame - CARD_START), fps, config: springFast });
  const cardY = interpolate(cardSpring, [0, 1], [60, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cardOp = interpolate(cardSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const mapBg = dark ? '#1a1a2e' : '#e8f0e8';
  const roadColor = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)';
  const mainRoadColor = dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.22)';

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
      {/* Map */}
      <div style={{ opacity: mapOp, transform: `scale(${mapScale})`, position: 'relative' }}>
        <svg width={MAP_WIDTH} height={MAP_HEIGHT} viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} style={{ borderRadius: MAP_RADIUS, display: 'block' }}>
          {/* Background */}
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill={mapBg} rx={MAP_RADIUS} />
          {/* Horizontal grid roads */}
          {[80, 160, 240, 320, 380].map((y, i) => (
            <line key={i} x1={0} y1={y} x2={MAP_WIDTH} y2={y} stroke={roadColor} strokeWidth={i === 2 ? 6 : 2} />
          ))}
          {/* Vertical grid roads */}
          {[100, 200, 320, 440, 560].map((x, i) => (
            <line key={i} x1={x} y1={0} x2={x} y2={MAP_HEIGHT} stroke={roadColor} strokeWidth={i === 2 ? 6 : 2} />
          ))}
          {/* Main diagonal roads */}
          <line x1={0} y1={MAP_HEIGHT} x2={MAP_WIDTH} y2={0} stroke={mainRoadColor} strokeWidth={8} />
          <line x1={0} y1={0} x2={MAP_WIDTH * 0.6} y2={MAP_HEIGHT} stroke={mainRoadColor} strokeWidth={5} />

          {/* Ripple */}
          {rippleR > 0 && (
            <circle cx={MAP_WIDTH / 2} cy={MAP_HEIGHT / 2} r={rippleR} fill="none" stroke={theme.colors.accent} strokeWidth={2} opacity={rippleOp} />
          )}

          {/* Pin */}
          <g transform={`translate(${MAP_WIDTH / 2}, ${MAP_HEIGHT / 2 + pinY}) translate(-${PIN_SIZE / 2}, -${PIN_SIZE})`} opacity={pinOp}>
            <ellipse cx={PIN_SIZE / 2} cy={PIN_SIZE - 4} rx={6} ry={3} fill="rgba(0,0,0,0.2)" />
            <path d={`M ${PIN_SIZE / 2} 0 C 4 0, 0 ${PIN_SIZE * 0.4}, 0 ${PIN_SIZE * 0.5} C 0 ${PIN_SIZE * 0.75}, ${PIN_SIZE / 2} ${PIN_SIZE - 2}, ${PIN_SIZE / 2} ${PIN_SIZE - 2} C ${PIN_SIZE / 2} ${PIN_SIZE - 2}, ${PIN_SIZE} ${PIN_SIZE * 0.75}, ${PIN_SIZE} ${PIN_SIZE * 0.5} C ${PIN_SIZE} ${PIN_SIZE * 0.4}, ${PIN_SIZE - 4} 0, ${PIN_SIZE / 2} 0 Z`} fill={theme.colors.accent} />
            <circle cx={PIN_SIZE / 2} cy={PIN_SIZE * 0.42} r={PIN_SIZE * 0.18} fill={theme.colors.bg} />
          </g>
        </svg>
      </div>

      {/* Card */}
      <div style={{
        opacity: cardOp, transform: `translateY(${cardY}px)`,
        backgroundColor: dark ? 'rgba(255,255,255,0.08)' : theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: CARD_RADIUS, padding: CARD_PADDING,
        display: 'flex', alignItems: 'center', gap: 16,
        maxWidth: MAP_WIDTH,
        width: MAP_WIDTH,
        boxSizing: 'border-box',
      }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: theme.colors.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: theme.colors.accent }} />
        </div>
        <div>
          <div style={{ fontFamily: theme.font.display, fontSize: VENUE_FONT_SIZE, fontWeight: theme.font.weights.semibold, color: textColor, marginBottom: 4 }}>{venueName}</div>
          <div style={{ fontFamily: theme.font.display, fontSize: ADDRESS_FONT_SIZE, color: theme.colors.textMuted }}>{address}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
