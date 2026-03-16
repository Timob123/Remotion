import React from 'react';
import { AbsoluteFill } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation, springBounce } from '../hooks/useSceneAnimation';
import type { CTASceneProps } from '../types';

export const CTAScene: React.FC<CTASceneProps> = ({
  headline,
  subheadline,
  ctaText,
  url,
}) => {
  const { frame, fps, fadeIn, slideUp, s } = useSceneAnimation();

  // Circles fade in first
  const circlesFade = fadeIn(0, 20);

  // Headline springs up from y=50 at delay 0
  const headlineY = slideUp(0, 50);
  const headlineOpacity = fadeIn(0, 12);

  // Subheadline fades in at delay 14
  const subOpacity = fadeIn(14, 14);

  // CTA bounces in with springBounce at delay 24
  const ctaScale = s(24, springBounce);
  const ctaOpacity = fadeIn(24, 10);

  // URL fades in at delay 38
  const urlOpacity = fadeIn(38, 14);

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
      {/* Large decorative circle — 600px, faint border, centered */}
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          border: `1px solid ${theme.colors.border}`,
          opacity: 0.3 * circlesFade,
          pointerEvents: 'none',
        }}
      />

      {/* Smaller dashed decorative circle — 300px, accent, offset */}
      <div
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          border: `1.5px dashed ${theme.colors.accent}`,
          opacity: 0.12 * circlesFade,
          transform: 'translate(160px, -120px)',
          pointerEvents: 'none',
        }}
      />

      {/* Main content column */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 820,
          width: '100%',
          padding: '0 48px',
          textAlign: 'center',
          gap: 0,
        }}
      >
        {/* Headline */}
        <h1
          style={{
            fontFamily: theme.font.display,
            fontSize: theme.font.sizes.xxl,
            fontWeight: theme.font.weights.black,
            color: theme.colors.text,
            letterSpacing: '-2.5px',
            lineHeight: 1.0,
            margin: 0,
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
          }}
        >
          {headline}
        </h1>

        {/* Subheadline */}
        {subheadline && (
          <p
            style={{
              fontFamily: theme.font.body,
              fontSize: 20,
              fontWeight: theme.font.weights.regular,
              color: theme.colors.textMuted,
              margin: '24px 0 0 0',
              lineHeight: 1.5,
              opacity: subOpacity,
            }}
          >
            {subheadline}
          </p>
        )}

        {/* CTA Button */}
        <div
          style={{
            marginTop: 40,
            opacity: ctaOpacity,
            transform: `scale(${ctaScale})`,
            transformOrigin: 'center center',
          }}
        >
          <div
            style={{
              backgroundColor: theme.colors.accent,
              color: '#FFFFFF',
              fontFamily: theme.font.display,
              fontSize: 20,
              fontWeight: theme.font.weights.bold,
              borderRadius: theme.radii.full,
              padding: '20px 52px',
              boxShadow: '0 0 0 4px rgba(99,102,241,0.2)',
              display: 'inline-block',
              letterSpacing: '-0.3px',
            }}
          >
            {ctaText}
          </div>
        </div>

        {/* URL */}
        <p
          style={{
            fontFamily: theme.font.body,
            fontSize: theme.font.sizes.xs,
            fontWeight: theme.font.weights.regular,
            color: theme.colors.textMuted,
            margin: '20px 0 0 0',
            opacity: urlOpacity,
            letterSpacing: '0.3px',
          }}
        >
          {url}
        </p>
      </div>
    </AbsoluteFill>
  );
};
