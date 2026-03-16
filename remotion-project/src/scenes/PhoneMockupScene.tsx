import React from 'react';
import { AbsoluteFill, Img } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation, springFast } from '../hooks/useSceneAnimation';
import { PhoneMockupSceneProps } from '../types';

export const PhoneMockupScene: React.FC<PhoneMockupSceneProps> = ({
  screenshotUrl,
  headline,
  description,
}) => {
  const { frame, s, fadeIn } = useSceneAnimation();

  const hasText = Boolean(headline || description);

  // Phone spring: enters from y=80 at delay 0
  const phoneSpring = s(0, springFast);
  const phoneY = (1 - phoneSpring) * 80;
  const phoneOpacity = phoneSpring;

  // Idle float offset
  const floatY = Math.sin(frame / 40) * 6;

  // Text column fade/slide from x=20 at delay 18
  const textOpacity = fadeIn(18, 15);
  const textSpring = s(18, springFast);
  const textX = (1 - textSpring) * 20;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bg,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
        gap: 80,
      }}
    >
      {/* Phone mockup */}
      <div
        style={{
          transform: `translateY(${phoneY + floatY}px)`,
          opacity: phoneOpacity,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 280,
            height: 580,
            borderRadius: 44,
            border: `8px solid ${theme.colors.text}`,
            backgroundColor: theme.colors.text,
            boxShadow: '0 40px 100px rgba(0,0,0,0.20)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Inner screenshot container — clips content to phone shape */}
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 36,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Img
              src={screenshotUrl}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />

            {/* Dynamic island / notch */}
            <div
              style={{
                position: 'absolute',
                top: 12,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 70,
                height: 20,
                borderRadius: 10,
                backgroundColor: theme.colors.text,
                zIndex: 10,
              }}
            />

            {/* Home indicator */}
            <div
              style={{
                position: 'absolute',
                bottom: 10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 80,
                height: 4,
                borderRadius: 2,
                backgroundColor: theme.colors.text,
                opacity: 0.5,
                zIndex: 10,
              }}
            />
          </div>
        </div>
      </div>

      {/* Text column — only rendered when headline or description present */}
      {hasText && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            maxWidth: 480,
            opacity: textOpacity,
            transform: `translateX(${textX}px)`,
          }}
        >
          {headline && (
            <h2
              style={{
                fontFamily: theme.font.display,
                fontSize: 52,
                fontWeight: theme.font.weights.bold,
                color: theme.colors.text,
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              {headline}
            </h2>
          )}
          {description && (
            <p
              style={{
                fontFamily: theme.font.body,
                fontSize: 20,
                fontWeight: theme.font.weights.regular,
                color: theme.colors.textMuted,
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};
