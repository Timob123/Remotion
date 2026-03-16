import React from 'react';
import { interpolate } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation } from '../hooks/useSceneAnimation';
import { MetricsSceneProps } from '../types';

export const MetricsScene: React.FC<MetricsSceneProps> = ({ metrics }) => {
  const { staggeredSpring, fadeIn } = useSceneAnimation();

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    gap: 64,
  };

  return (
    <div style={containerStyle}>
      <div style={rowStyle}>
        {metrics.map((metric, i) => {
          const springVal = staggeredSpring(i, 8);
          const translateY = interpolate(springVal, [0, 1], [50, 0]);
          const opacity = interpolate(springVal, [0, 0.4], [0, 1], {
            extrapolateRight: 'clamp',
          });

          // Determine if value is purely numeric (possibly decimal)
          const parsedFloat = parseFloat(metric.value);
          const isNumeric =
            !isNaN(parsedFloat) && String(parsedFloat) === metric.value.trim();
          const hasDecimal = isNumeric && metric.value.includes('.');

          let displayValue: string;
          if (isNumeric) {
            const counted = interpolate(springVal, [0, 1], [0, parsedFloat]);
            displayValue = hasDecimal
              ? counted.toFixed(1)
              : String(Math.round(counted));
          } else {
            displayValue = metric.value;
          }

          const lineOpacity = fadeIn(8 + i * 5 + 10, 12);

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity,
                transform: `translateY(${translateY}px)`,
                backgroundColor: theme.colors.surface,
                borderRadius: 20,
                boxShadow: theme.shadow,
                padding: '52px 56px 44px',
                minWidth: 260,
              }}
            >
              {/* Value row: prefix + value + suffix */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'baseline',
                  gap: 4,
                }}
              >
                {metric.prefix && (
                  <span
                    style={{
                      fontFamily: theme.font.display,
                      fontSize: theme.font.sizes.xl,
                      fontWeight: theme.font.weights.black,
                      color: theme.colors.textMuted,
                      letterSpacing: '-2px',
                      lineHeight: 1,
                    }}
                  >
                    {metric.prefix}
                  </span>
                )}
                <span
                  style={{
                    fontFamily: theme.font.display,
                    fontSize: 88,
                    fontWeight: theme.font.weights.black,
                    color: theme.colors.text,
                    letterSpacing: '-3px',
                    lineHeight: 1,
                  }}
                >
                  {displayValue}
                </span>
                {metric.suffix && (
                  <span
                    style={{
                      fontFamily: theme.font.display,
                      fontSize: theme.font.sizes.xl,
                      fontWeight: theme.font.weights.black,
                      color: theme.colors.accent,
                      letterSpacing: '-2px',
                      lineHeight: 1,
                    }}
                  >
                    {metric.suffix}
                  </span>
                )}
              </div>

              {/* Divider line */}
              <div
                style={{
                  width: '100%',
                  height: 1,
                  backgroundColor: theme.colors.border,
                  marginTop: 20,
                  marginBottom: 16,
                  opacity: lineOpacity,
                }}
              />

              {/* Label */}
              <span
                style={{
                  fontFamily: theme.font.body,
                  fontSize: theme.font.sizes.sm,
                  fontWeight: theme.font.weights.medium,
                  color: theme.colors.textMuted,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginTop: 14,
                }}
              >
                {metric.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
