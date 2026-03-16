import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation, springBounce, springFast } from '../hooks/useSceneAnimation';
import { FeatureGridSceneProps } from '../types';

export const FeatureGridScene: React.FC<FeatureGridSceneProps> = ({
  title,
  features,
}) => {
  const { s, fadeIn } = useSceneAnimation();

  // Title: fades and slides up
  const titleProgress = s(0, springFast);
  const titleY = interpolate(titleProgress, [0, 1], [30, 0]);
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);

  // Grid layout: 2 columns for 4 items, 3 columns for 3, else 2
  const colCount = features.length === 3 ? 3 : 2;

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
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 1100,
          padding: '0 60px',
          gap: 52,
        }}
      >
        {/* Section title */}
        <h2
          style={{
            fontFamily: theme.font.display,
            fontSize: 40,
            fontWeight: theme.font.weights.bold,
            color: theme.colors.text,
            margin: 0,
            textAlign: 'center',
            lineHeight: 1.15,
            transform: `translateY(${titleY}px)`,
            opacity: titleOpacity,
          }}
        >
          {title}
        </h2>

        {/* Feature cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${colCount}, 1fr)`,
            gap: 24,
            width: '100%',
          }}
        >
          {features.map((feature, i) => {
            // Cards pop in with springBounce, staggered 5 frames apart, base delay 10
            const cardDelay = 10 + i * 5;
            const cardProgress = s(cardDelay, springBounce);
            const cardScale = interpolate(cardProgress, [0, 1], [0.88, 1]);
            const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1]);

            return (
              <div
                key={i}
                style={{
                  position: 'relative',
                  backgroundColor: theme.colors.surface,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.radii.md,
                  boxShadow: theme.shadow,
                  padding: 32,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  overflow: 'hidden',
                  transform: `scale(${cardScale})`,
                  opacity: cardOpacity,
                }}
              >
                {/* Left accent bar */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    backgroundColor: theme.colors.accent,
                    borderRadius: '0 2px 2px 0',
                  }}
                />

                {/* Icon */}
                <span
                  style={{
                    fontSize: 44,
                    lineHeight: 1,
                    userSelect: 'none',
                  }}
                >
                  {feature.icon}
                </span>

                {/* Feature title */}
                <h3
                  style={{
                    fontFamily: theme.font.display,
                    fontSize: theme.font.sizes.sm,
                    fontWeight: theme.font.weights.semibold,
                    color: theme.colors.text,
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {feature.title}
                </h3>

                {/* Feature description */}
                <p
                  style={{
                    fontFamily: theme.font.body,
                    fontSize: theme.font.sizes.xs,
                    fontWeight: theme.font.weights.regular,
                    color: theme.colors.textMuted,
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
