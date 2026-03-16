import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation, springBounce, springFast } from '../hooks/useSceneAnimation';
import { FeatureCalloutSceneProps } from '../types';

export const FeatureCalloutScene: React.FC<FeatureCalloutSceneProps> = ({
  icon,
  title,
  description,
  bullets = [],
}) => {
  const { frame, fps, s, fadeIn } = useSceneAnimation();

  // Icon: bounces in immediately
  const iconScale = s(0, springBounce);
  const iconOpacity = fadeIn(0, 8);

  // Title: springs up from right at delay 10
  const titleProgress = s(10, springFast);
  const titleX = interpolate(titleProgress, [0, 1], [40, 0]);
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);

  // Description: fades in at delay 18
  const descOpacity = fadeIn(18, 14);

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
          alignItems: 'center',
          maxWidth: 1100,
          width: '100%',
          gap: 80,
          padding: '0 60px',
        }}
      >
        {/* Left column: Icon tile */}
        <div
          style={{
            flexShrink: 0,
            width: 200,
            height: 200,
            borderRadius: theme.radii.lg,
            backgroundColor: theme.colors.accentLight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${iconScale})`,
            opacity: iconOpacity,
          }}
        >
          <span
            style={{
              fontSize: 100,
              lineHeight: 1,
              userSelect: 'none',
            }}
          >
            {icon}
          </span>
        </div>

        {/* Right column: Text content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontFamily: theme.font.display,
              fontSize: 52,
              fontWeight: theme.font.weights.black,
              color: theme.colors.text,
              margin: 0,
              lineHeight: 1.1,
              transform: `translateX(${titleX}px)`,
              opacity: titleOpacity,
            }}
          >
            {title}
          </h1>

          {/* Description */}
          <p
            style={{
              fontFamily: theme.font.body,
              fontSize: 20,
              fontWeight: theme.font.weights.regular,
              color: theme.colors.textMuted,
              margin: 0,
              lineHeight: 1.6,
              opacity: descOpacity,
            }}
          >
            {description}
          </p>

          {/* Bullets */}
          {bullets.length > 0 && (
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              {bullets.map((bullet, i) => {
                const delay = 24 + i * 5;
                const bulletProgress = s(delay, springFast);
                const bulletX = interpolate(bulletProgress, [0, 1], [20, 0]);
                const bulletOpacity = interpolate(bulletProgress, [0, 1], [0, 1]);

                return (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      transform: `translateX(${bulletX}px)`,
                      opacity: bulletOpacity,
                    }}
                  >
                    {/* Indigo filled dot */}
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: theme.radii.full,
                        backgroundColor: theme.colors.accent,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: theme.font.body,
                        fontSize: 18,
                        fontWeight: theme.font.weights.medium,
                        color: theme.colors.text,
                        lineHeight: 1.5,
                      }}
                    >
                      {bullet}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
