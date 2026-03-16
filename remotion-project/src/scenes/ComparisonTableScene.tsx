import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation, springFast } from '../hooks/useSceneAnimation';
import { ComparisonTableSceneProps } from '../types';

export const ComparisonTableScene: React.FC<ComparisonTableSceneProps> = ({
  ourName,
  theirName,
  features,
}) => {
  const { frame, fps, staggeredSpring } = useSceneAnimation();

  // Header springs down from y=-20
  const headerSpring = staggeredSpring(0, 0, springFast);
  const headerY = interpolate(headerSpring, [0, 1], [-20, 0]);
  const headerOpacity = interpolate(headerSpring, [0, 1], [0, 1]);

  const ACCENT_DARK = '#4F46E5';
  const COL_FEATURE_W = '46%';
  const COL_OUR_W = '27%';
  const COL_THEIR_W = '27%';

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
          width: '100%',
          maxWidth: 820,
          borderRadius: theme.radii.lg,
          overflow: 'hidden',
          boxShadow: theme.shadowLg,
          background: theme.colors.surface,
        }}
      >
        {/* Header Row */}
        <div
          style={{
            display: 'flex',
            transform: `translateY(${headerY}px)`,
            opacity: headerOpacity,
            background: '#18181B',
          }}
        >
          {/* Feature column header */}
          <div
            style={{
              width: COL_FEATURE_W,
              padding: '20px 28px',
              fontFamily: theme.font.display,
              fontWeight: theme.font.weights.semibold,
              fontSize: 16,
              color: '#FFFFFF',
              letterSpacing: '0.01em',
            }}
          >
            Feature
          </div>

          {/* Our column header — indigo accent */}
          <div
            style={{
              width: COL_OUR_W,
              padding: '20px 12px',
              background: ACCENT_DARK,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              fontFamily: theme.font.display,
              fontWeight: theme.font.weights.semibold,
              fontSize: 15,
              color: '#FFFFFF',
              letterSpacing: '0.01em',
              borderLeft: `2px solid ${ACCENT_DARK}`,
              borderRight: `2px solid ${ACCENT_DARK}`,
            }}
          >
            <span style={{ fontSize: 14, opacity: 0.9 }}>✦</span>
            {ourName}
          </div>

          {/* Their column header */}
          <div
            style={{
              width: COL_THEIR_W,
              padding: '20px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: theme.font.display,
              fontWeight: theme.font.weights.semibold,
              fontSize: 15,
              color: '#9CA3AF',
              letterSpacing: '0.01em',
            }}
          >
            {theirName}
          </div>
        </div>

        {/* Feature rows */}
        {features.map((feature, i) => {
          const rowSpring = staggeredSpring(i, 8, springFast);
          const rowX = interpolate(rowSpring, [0, 1], [-40, 0]);
          const rowOpacity = interpolate(rowSpring, [0, 1], [0, 1]);
          const isEven = i % 2 === 0;
          const isLast = i === features.length - 1;

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                transform: `translateX(${rowX}px)`,
                opacity: rowOpacity,
                background: isEven ? '#FFFFFF' : '#FAFAF8',
                borderBottom: isLast ? 'none' : `1px solid ${theme.colors.border}`,
              }}
            >
              {/* Feature label */}
              <div
                style={{
                  width: COL_FEATURE_W,
                  padding: '16px 0 16px 28px',
                  fontFamily: theme.font.body,
                  fontWeight: theme.font.weights.medium,
                  fontSize: 14,
                  color: theme.colors.text,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {feature.label}
              </div>

              {/* Our column cell — light indigo tint + column borders */}
              <div
                style={{
                  width: COL_OUR_W,
                  padding: '16px 12px',
                  background: '#F5F3FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderLeft: `2px solid ${ACCENT_DARK}`,
                  borderRight: `2px solid ${ACCENT_DARK}`,
                }}
              >
                {feature.ours ? (
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: theme.font.weights.bold,
                      color: theme.colors.success,
                      lineHeight: 1,
                    }}
                  >
                    ✓
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: theme.font.weights.bold,
                      color: theme.colors.danger,
                      lineHeight: 1,
                    }}
                  >
                    ✕
                  </span>
                )}
              </div>

              {/* Their column cell */}
              <div
                style={{
                  width: COL_THEIR_W,
                  padding: '16px 12px',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {feature.theirs ? (
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: theme.font.weights.bold,
                      color: theme.colors.success,
                      lineHeight: 1,
                    }}
                  >
                    ✓
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: theme.font.weights.bold,
                      color: theme.colors.danger,
                      lineHeight: 1,
                    }}
                  >
                    ✕
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
