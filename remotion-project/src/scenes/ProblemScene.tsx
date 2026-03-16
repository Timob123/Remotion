import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation, springFast } from '../hooks/useSceneAnimation';
import { ProblemSceneProps } from '../types';

// Timing constants (frames)
const LABEL_DELAY = 0;
const HEADLINE_DELAY = 8;
const LINE_DELAY = 18;
const POINTS_BASE_DELAY = 26;

const XIcon: React.FC = () => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0 }}
  >
    <circle cx={10} cy={10} r={10} fill={theme.colors.dangerLight} />
    <line
      x1={6.5}
      y1={6.5}
      x2={13.5}
      y2={13.5}
      stroke={theme.colors.danger}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <line
      x1={13.5}
      y1={6.5}
      x2={6.5}
      y2={13.5}
      stroke={theme.colors.danger}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </svg>
);

export const ProblemScene: React.FC<ProblemSceneProps> = ({
  sectionLabel,
  headline,
  painPoints,
}) => {
  const { frame, fps, fadeIn, slideUp, staggeredSpring } = useSceneAnimation();

  // Section label
  const labelOpacity = fadeIn(LABEL_DELAY, 12);

  // Headline
  const headlineOpacity = fadeIn(HEADLINE_DELAY, 12);
  const headlineY = slideUp(HEADLINE_DELAY, 30, springFast);

  // Horizontal rule scaleX draw-in
  const lineProgress = interpolate(
    frame,
    [LINE_DELAY, LINE_DELAY + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 100,
        paddingRight: 80,
        fontFamily: theme.font.body,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          maxWidth: 760,
          width: '100%',
        }}
      >
        {/* Section label */}
        {sectionLabel && (
          <div
            style={{
              opacity: labelOpacity,
              fontFamily: theme.font.body,
              fontSize: 12,
              fontWeight: theme.font.weights.semibold,
              letterSpacing: '0.18em',
              textTransform: 'uppercase' as const,
              color: theme.colors.danger,
              marginBottom: 20,
            }}
          >
            {sectionLabel}
          </div>
        )}

        {/* Headline */}
        <div
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            fontFamily: theme.font.display,
            fontSize: theme.font.sizes.xl,
            fontWeight: theme.font.weights.bold,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: theme.colors.text,
            maxWidth: 700,
            marginBottom: 28,
          }}
        >
          {headline}
        </div>

        {/* Horizontal rule */}
        <div
          style={{
            height: 1.5,
            backgroundColor: theme.colors.border,
            maxWidth: 700,
            marginBottom: 36,
            transformOrigin: 'left center',
            transform: `scaleX(${lineProgress})`,
          }}
        />

        {/* Pain points */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          {painPoints.map((point, index) => {
            const itemProgress = staggeredSpring(index, POINTS_BASE_DELAY, springFast);
            const itemOpacity = interpolate(
              frame,
              [POINTS_BASE_DELAY + index * 5, POINTS_BASE_DELAY + index * 5 + 10],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            const itemY = interpolate(itemProgress, [0, 1], [20, 0]);

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  opacity: itemOpacity,
                  transform: `translateY(${itemY}px)`,
                }}
              >
                <XIcon />
                <span
                  style={{
                    fontFamily: theme.font.body,
                    fontSize: 22,
                    fontWeight: theme.font.weights.regular,
                    color: theme.colors.text,
                    lineHeight: 1.4,
                  }}
                >
                  {point}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default ProblemScene;
