import React from 'react';
import { AbsoluteFill, Img, useVideoConfig, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation } from '../hooks/useSceneAnimation';
import type { OutroSceneProps } from '../types';

export const OutroScene: React.FC<OutroSceneProps> = ({
  brandName,
  tagline,
  logoUrl,
  handles = [],
  website,
}) => {
  const { frame, fadeIn } = useSceneAnimation();
  const { durationInFrames } = useVideoConfig();

  // Fade in over first 20 frames from delay 0
  const fadeInOpacity = fadeIn(0, 20);

  // Fade out over last 20 frames
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const opacity = Math.min(fadeInOpacity, fadeOut);

  // Social pills: merge handles and website into one row
  const pills: string[] = [
    ...handles,
    ...(website ? [website] : []),
  ];

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
          opacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 600,
          width: '100%',
          padding: '0 48px',
        }}
      >
        {/* Logo mark */}
        {logoUrl ? (
          <Img
            src={logoUrl}
            style={{
              width: 80,
              height: 80,
              borderRadius: theme.radii.lg,
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: theme.radii.md,
              backgroundColor: theme.colors.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: theme.font.display,
                fontSize: 40,
                fontWeight: theme.font.weights.bold,
                color: '#FFFFFF',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              {brandName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Brand name */}
        <h1
          style={{
            fontFamily: theme.font.display,
            fontSize: theme.font.sizes.xl,
            fontWeight: theme.font.weights.black,
            color: theme.colors.text,
            letterSpacing: '-1.5px',
            lineHeight: 1.1,
            margin: '20px 0 0 0',
          }}
        >
          {brandName}
        </h1>

        {/* Tagline */}
        {tagline && (
          <p
            style={{
              fontFamily: theme.font.body,
              fontSize: theme.font.sizes.sm,
              fontWeight: theme.font.weights.regular,
              color: theme.colors.textMuted,
              margin: '10px 0 0 0',
              lineHeight: 1.5,
            }}
          >
            {tagline}
          </p>
        )}

        {/* Horizontal rule */}
        <div
          style={{
            width: 400,
            height: 1,
            backgroundColor: theme.colors.border,
            margin: '28px 0 24px 0',
            flexShrink: 0,
          }}
        />

        {/* Social handles / website pills */}
        {pills.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {pills.map((pill, i) => (
              <div
                key={i}
                style={{
                  fontFamily: theme.font.body,
                  fontSize: 12,
                  fontWeight: theme.font.weights.medium,
                  color: theme.colors.textMuted,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.radii.full,
                  padding: '4px 12px',
                  lineHeight: 1.5,
                  whiteSpace: 'nowrap',
                }}
              >
                {pill}
              </div>
            ))}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
