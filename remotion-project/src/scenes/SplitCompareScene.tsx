import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation, springFast } from '../hooks/useSceneAnimation';
import { SplitCompareSceneProps } from '../types';

export const SplitCompareScene: React.FC<SplitCompareSceneProps> = ({
  leftLabel,
  rightLabel,
  leftPoints,
  rightPoints,
}) => {
  const { staggeredSpring } = useSceneAnimation();

  // Left panel slides from x=-80
  const leftPanelSpring = staggeredSpring(0, 0, springFast);
  const leftPanelX = interpolate(leftPanelSpring, [0, 1], [-80, 0]);
  const leftPanelOpacity = interpolate(leftPanelSpring, [0, 1], [0, 1]);

  // Right panel slides from x=80 (simultaneous with left)
  const rightPanelSpring = staggeredSpring(0, 0, springFast);
  const rightPanelX = interpolate(rightPanelSpring, [0, 1], [80, 0]);
  const rightPanelOpacity = interpolate(rightPanelSpring, [0, 1], [0, 1]);

  const ITEM_BASE_DELAY = 10;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: theme.font.body,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 32,
          maxWidth: 1100,
          width: '100%',
          padding: '0 48px',
          boxSizing: 'border-box',
        }}
      >
        {/* Left panel — red-tinted */}
        <div
          style={{
            flex: 1,
            transform: `translateX(${leftPanelX}px)`,
            opacity: leftPanelOpacity,
            background: '#FFF8F8',
            border: '1px solid #FECACA',
            borderRadius: theme.radii.lg,
            padding: '32px 28px',
          }}
        >
          {/* Left label */}
          <div
            style={{
              fontFamily: theme.font.display,
              fontWeight: theme.font.weights.semibold,
              fontSize: 12,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: theme.colors.danger,
              marginBottom: 24,
            }}
          >
            {leftLabel}
          </div>

          {/* Left items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {leftPoints.map((point, i) => {
              const itemSpring = staggeredSpring(i, ITEM_BASE_DELAY, springFast);
              const itemOpacity = interpolate(itemSpring, [0, 1], [0, 1]);
              const itemY = interpolate(itemSpring, [0, 1], [16, 0]);

              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    opacity: itemOpacity,
                    transform: `translateY(${itemY}px)`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: theme.font.weights.bold,
                      color: theme.colors.danger,
                      lineHeight: 1.5,
                      flexShrink: 0,
                    }}
                  >
                    ✕
                  </span>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: theme.font.weights.medium,
                      color: '#7F1D1D',
                      lineHeight: 1.5,
                    }}
                  >
                    {point}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center divider line */}
        <div
          style={{
            width: 1,
            alignSelf: 'stretch',
            background: theme.colors.border,
            flexShrink: 0,
          }}
        />

        {/* Right panel — green-tinted */}
        <div
          style={{
            flex: 1,
            transform: `translateX(${rightPanelX}px)`,
            opacity: rightPanelOpacity,
            background: '#F8FFF9',
            border: '1px solid #BBF7D0',
            borderRadius: theme.radii.lg,
            padding: '32px 28px',
          }}
        >
          {/* Right label */}
          <div
            style={{
              fontFamily: theme.font.display,
              fontWeight: theme.font.weights.semibold,
              fontSize: 12,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: theme.colors.success,
              marginBottom: 24,
            }}
          >
            {rightLabel}
          </div>

          {/* Right items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {rightPoints.map((point, i) => {
              const itemSpring = staggeredSpring(i, ITEM_BASE_DELAY, springFast);
              const itemOpacity = interpolate(itemSpring, [0, 1], [0, 1]);
              const itemY = interpolate(itemSpring, [0, 1], [16, 0]);

              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    opacity: itemOpacity,
                    transform: `translateY(${itemY}px)`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: theme.font.weights.bold,
                      color: theme.colors.success,
                      lineHeight: 1.5,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: theme.font.weights.medium,
                      color: '#14532D',
                      lineHeight: 1.5,
                    }}
                  >
                    {point}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
