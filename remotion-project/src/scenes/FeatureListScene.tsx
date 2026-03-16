import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation, springFast, springBounce } from '../hooks/useSceneAnimation';
import { FeatureListSceneProps } from '../types';

export const FeatureListScene: React.FC<FeatureListSceneProps> = ({
  title,
  items,
}) => {
  const { frame, fps, s, fadeIn } = useSceneAnimation();

  // Title: springs up first
  const titleProgress = s(0, springBounce);
  const titleY = interpolate(titleProgress, [0, 1], [40, 0]);
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);

  // Decorative vertical line: scaleY animates 0→1 at delay 8
  const lineDelay = 8;
  const lineProgress = s(lineDelay, springFast);
  const lineScaleY = interpolate(lineProgress, [0, 1], [0, 1]);
  const lineOpacity = interpolate(lineProgress, [0, 1], [0, 1]);

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
          maxWidth: 680,
          width: '100%',
          padding: '0 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: 40,
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontFamily: theme.font.display,
            fontSize: 44,
            fontWeight: theme.font.weights.bold,
            color: theme.colors.text,
            margin: 0,
            lineHeight: 1.1,
            transform: `translateY(${titleY}px)`,
            opacity: titleOpacity,
          }}
        >
          {title}
        </h1>

        {/* List area with decorative left line */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 24,
          }}
        >
          {/* Decorative vertical line */}
          <div
            style={{
              flexShrink: 0,
              width: 2,
              borderRadius: 1,
              backgroundColor: theme.colors.accent,
              transformOrigin: 'top center',
              transform: `scaleY(${lineScaleY})`,
              opacity: lineOpacity,
              alignSelf: 'stretch',
              minHeight: items.length * 56,
            }}
          />

          {/* Items list */}
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              flex: 1,
            }}
          >
            {items.map((item, i) => {
              // Items slide in from x=-30, staggered 6 frames apart, base delay 14
              const itemDelay = 14 + i * 6;
              const itemProgress = s(itemDelay, springFast);
              const itemX = interpolate(itemProgress, [0, 1], [-30, 0]);
              const itemOpacity = interpolate(itemProgress, [0, 1], [0, 1]);

              return (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 16,
                    transform: `translateX(${itemX}px)`,
                    opacity: itemOpacity,
                  }}
                >
                  {/* Checkmark badge: 28x28 near-black filled circle with white ✓ */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: 28,
                      height: 28,
                      borderRadius: theme.radii.full,
                      backgroundColor: theme.colors.text,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span
                      style={{
                        color: '#FFFFFF',
                        fontSize: 14,
                        fontWeight: theme.font.weights.bold,
                        lineHeight: 1,
                        userSelect: 'none',
                      }}
                    >
                      ✓
                    </span>
                  </div>

                  {/* Item text */}
                  <span
                    style={{
                      fontFamily: theme.font.body,
                      fontSize: 22,
                      fontWeight: theme.font.weights.regular,
                      color: theme.colors.text,
                      lineHeight: 1.4,
                    }}
                  >
                    {item}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </AbsoluteFill>
  );
};
