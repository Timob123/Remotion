import React from 'react';
import { interpolate, spring } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation, springBounce } from '../hooks/useSceneAnimation';
import { ChartSceneProps } from '../types';

const CHART_HEIGHT = 320;
const BAR_WIDTH = 80;
const GRID_LINES = 4;

export const ChartScene: React.FC<ChartSceneProps> = ({ title, bars }) => {
  const { frame, fps, fadeIn, slideUp, staggeredSpring } = useSceneAnimation();

  const maxValue = Math.max(...bars.map((b) => b.value));

  // Animation phases:
  // 0: title springs up (delay 0)
  // 8: grid lines fade in
  // 18+: bars grow staggered with springBounce

  const titleSpring = spring({ frame: Math.max(0, frame), fps, config: { mass: 1, stiffness: 200, damping: 20 } });
  const titleTranslateY = interpolate(titleSpring, [0, 1], [30, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });

  const gridOpacity = fadeIn(8, 14);
  const axisOpacity = fadeIn(8, 14);

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.bg,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 80px',
    boxSizing: 'border-box',
  };

  return (
    <div style={containerStyle}>
      {/* Title */}
      {title && (
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleTranslateY}px)`,
            marginBottom: 52,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: theme.font.display,
              fontSize: 40,
              fontWeight: theme.font.weights.black,
              color: theme.colors.text,
              letterSpacing: '-1.5px',
              lineHeight: 1.1,
            }}
          >
            {title}
          </span>
        </div>
      )}

      {/* Chart area */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: bars.length * (BAR_WIDTH + 48) + 80,
        }}
      >
        {/* Grid lines */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: CHART_HEIGHT,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            opacity: gridOpacity * 0.5,
            pointerEvents: 'none',
          }}
        >
          {Array.from({ length: GRID_LINES }).map((_, idx) => (
            <div
              key={idx}
              style={{
                width: '100%',
                height: 1,
                backgroundColor: theme.colors.border,
              }}
            />
          ))}
        </div>

        {/* Bars row */}
        <div
          style={{
            height: CHART_HEIGHT,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: 32,
            position: 'relative',
          }}
        >
          {bars.map((bar, i) => {
            const isLast = i === bars.length - 1;
            const barColor = bar.color
              ? bar.color
              : isLast
              ? '#818CF8' // slightly brighter indigo for last bar
              : theme.colors.accent;

            const barSpring = spring({
              frame: Math.max(0, frame - 18 - i * 5),
              fps,
              config: springBounce,
            });

            const barHeightRatio = bar.value / maxValue;
            const barHeight = interpolate(barSpring, [0, 1], [0, CHART_HEIGHT * barHeightRatio]);

            // Value label fades in when bar is near full height (spring > 0.85)
            const valueLabelOpacity = interpolate(barSpring, [0.75, 1], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  height: CHART_HEIGHT,
                }}
              >
                {/* Value label above bar */}
                <div
                  style={{
                    opacity: valueLabelOpacity,
                    marginBottom: 8,
                    fontFamily: theme.font.display,
                    fontSize: theme.font.sizes.sm,
                    fontWeight: theme.font.weights.bold,
                    color: theme.colors.text,
                    letterSpacing: '-0.5px',
                  }}
                >
                  {bar.value}
                </div>

                {/* Bar */}
                <div
                  style={{
                    width: BAR_WIDTH,
                    height: barHeight,
                    backgroundColor: barColor,
                    borderRadius: `${theme.radii.sm}px ${theme.radii.sm}px 0 0`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* X-axis line */}
        <div
          style={{
            width: '100%',
            height: 2,
            backgroundColor: theme.colors.border,
            opacity: axisOpacity,
          }}
        />

        {/* Category labels */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 32,
            marginTop: 14,
            opacity: axisOpacity,
          }}
        >
          {bars.map((bar, i) => (
            <div
              key={i}
              style={{
                width: BAR_WIDTH,
                textAlign: 'center',
                fontFamily: theme.font.body,
                fontSize: theme.font.sizes.xs,
                fontWeight: theme.font.weights.medium,
                color: theme.colors.textMuted,
                letterSpacing: '0.02em',
              }}
            >
              {bar.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
