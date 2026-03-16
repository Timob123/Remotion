import React from 'react';
import { AbsoluteFill, interpolate, spring } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation, springFast } from '../hooks/useSceneAnimation';
import { BeforeAfterSceneProps } from '../types';

// Timing constants (frames)
const DIVIDER_DELAY = 0;
const COLUMNS_DELAY = 10;
const ITEMS_BASE_DELAY = 22;

const XIcon: React.FC = () => (
  <svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0 }}
  >
    <circle cx={9} cy={9} r={9} fill="rgba(220,38,38,0.12)" />
    <line
      x1={5.5}
      y1={5.5}
      x2={12.5}
      y2={12.5}
      stroke={theme.colors.danger}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
    <line
      x1={12.5}
      y1={5.5}
      x2={5.5}
      y2={12.5}
      stroke={theme.colors.danger}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </svg>
);

const CheckIcon: React.FC = () => (
  <svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0 }}
  >
    <circle cx={9} cy={9} r={9} fill="rgba(22,163,74,0.12)" />
    <polyline
      points="4.5,9.5 7.5,12.5 13.5,6"
      stroke={theme.colors.success}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

interface ColumnProps {
  label: string;
  points: string[];
  side: 'before' | 'after';
  slideX: number;
  opacity: number;
  itemsBaseDelay: number;
}

const Column: React.FC<ColumnProps> = ({
  label,
  points,
  side,
  slideX,
  opacity,
  itemsBaseDelay,
}) => {
  const { frame } = useSceneAnimation();

  const isBefore = side === 'before';
  const labelColor = isBefore ? theme.colors.danger : theme.colors.success;
  const bgColor = isBefore ? '#FFF5F5' : '#F5FFF8';

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: bgColor,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '64px 56px',
        opacity,
        transform: `translateX(${slideX}px)`,
      }}
    >
      {/* Column label */}
      <div
        style={{
          fontFamily: theme.font.body,
          fontSize: 12,
          fontWeight: theme.font.weights.semibold,
          letterSpacing: '0.18em',
          textTransform: 'uppercase' as const,
          color: labelColor,
          marginBottom: 32,
        }}
      >
        {label}
      </div>

      {/* Items list */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {points.map((point, index) => {
          const itemOpacity = interpolate(
            frame,
            [itemsBaseDelay + index * 5, itemsBaseDelay + index * 5 + 10],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          // Derive y offset from a spring-like interpolation via frame
          const rawFrame = Math.max(0, frame - itemsBaseDelay - index * 5);
          // Simple ease-in approximation using interpolate for y offset
          const itemYProgress = interpolate(rawFrame, [0, 18], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const itemY = interpolate(itemYProgress, [0, 1], [20, 0]);

          return (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                opacity: itemOpacity,
                transform: `translateY(${itemY}px)`,
              }}
            >
              {isBefore ? <XIcon /> : <CheckIcon />}
              <span
                style={{
                  fontFamily: theme.font.body,
                  fontSize: 19,
                  fontWeight: theme.font.weights.regular,
                  color: theme.colors.text,
                  lineHeight: 1.45,
                }}
              >
                {point}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const BeforeAfterScene: React.FC<BeforeAfterSceneProps> = ({
  beforeLabel,
  afterLabel,
  beforePoints,
  afterPoints,
}) => {
  const { frame, fps } = useSceneAnimation();

  // Divider draws from top (scaleY 0 → 1)
  const dividerProgress = interpolate(
    frame,
    [DIVIDER_DELAY, DIVIDER_DELAY + 18],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Columns spring in simultaneously
  const columnSpring = spring({
    frame: Math.max(0, frame - COLUMNS_DELAY),
    fps,
    config: springFast,
  });

  const columnOpacity = interpolate(
    frame,
    [COLUMNS_DELAY, COLUMNS_DELAY + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const beforeX = interpolate(columnSpring, [0, 1], [-60, 0]);
  const afterX = interpolate(columnSpring, [0, 1], [60, 0]);

  // Stagger items relative to column entry
  const leftItemsDelay = ITEMS_BASE_DELAY;
  const rightItemsDelay = ITEMS_BASE_DELAY;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bg,
        display: 'flex',
        flexDirection: 'row',
        fontFamily: theme.font.body,
        overflow: 'hidden',
      }}
    >
      {/* Left (Before) column */}
      <Column
        label={beforeLabel}
        points={beforePoints}
        side="before"
        slideX={beforeX}
        opacity={columnOpacity}
        itemsBaseDelay={leftItemsDelay}
      />

      {/* Center divider */}
      <div
        style={{
          width: 1,
          backgroundColor: '#FFFFFF',
          flexShrink: 0,
          transformOrigin: 'top center',
          transform: `scaleY(${dividerProgress})`,
          alignSelf: 'stretch',
        }}
      />

      {/* Right (After) column */}
      <Column
        label={afterLabel}
        points={afterPoints}
        side="after"
        slideX={afterX}
        opacity={columnOpacity}
        itemsBaseDelay={rightItemsDelay}
      />
    </AbsoluteFill>
  );
};

export default BeforeAfterScene;
