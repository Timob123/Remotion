import { AbsoluteFill, Img, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation, springFast } from '../hooks/useSceneAnimation';
import { TestimonialSceneProps } from '../types';

export const TestimonialScene: React.FC<TestimonialSceneProps> = ({
  quote,
  name,
  role,
  company,
  avatarUrl,
}) => {
  const { frame, fps, s, fadeIn, slideUp } = useSceneAnimation();

  // Card entrance
  const cardSpring = s(0, springFast);
  const cardScale = interpolate(cardSpring, [0, 1], [0.94, 1]);
  const cardOpacity = Math.min(1, cardSpring * 1.6);

  // Stars
  const starsOpacity = fadeIn(4, 12);

  // Quote text
  const quoteOpacity = fadeIn(12, 15);
  const quoteY = slideUp(12, 20);

  // Separator
  const separatorSpring = s(20, springFast);
  const separatorScaleX = interpolate(separatorSpring, [0, 1], [0, 1]);
  const separatorOpacity = Math.min(1, separatorSpring * 2);

  // Author row
  const authorOpacity = fadeIn(28, 14);
  const authorX = interpolate(
    s(28, springFast),
    [0, 1],
    [-20, 0]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Subtle dot grid top-right */}
      <div
        style={{
          position: 'absolute',
          top: 48,
          right: 72,
          width: 160,
          height: 160,
          backgroundImage: `radial-gradient(circle, ${theme.colors.border} 1.5px, transparent 1.5px)`,
          backgroundSize: '18px 18px',
          opacity: 0.55,
          pointerEvents: 'none',
        }}
      />
      {/* Subtle dot grid bottom-left */}
      <div
        style={{
          position: 'absolute',
          bottom: 48,
          left: 72,
          width: 120,
          height: 120,
          backgroundImage: `radial-gradient(circle, ${theme.colors.border} 1.5px, transparent 1.5px)`,
          backgroundSize: '18px 18px',
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      />

      {/* Card */}
      <div
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 22,
          boxShadow: theme.shadowLg,
          maxWidth: 780,
          width: '100%',
          padding: 64,
          position: 'relative',
          transform: `scale(${cardScale})`,
          opacity: cardOpacity,
          overflow: 'visible',
        }}
      >
        {/* Giant decorative quote mark */}
        <div
          style={{
            position: 'absolute',
            top: 18,
            left: 30,
            fontFamily: theme.font.display,
            fontSize: 160,
            fontWeight: theme.font.weights.black,
            color: theme.colors.accent,
            opacity: 0.13,
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          "
        </div>

        {/* Stars row */}
        <div
          style={{
            opacity: starsOpacity,
            display: 'flex',
            gap: 6,
            marginBottom: 28,
          }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              style={{
                fontSize: 22,
                color: '#F59E0B',
                lineHeight: 1,
              }}
            >
              ★
            </span>
          ))}
        </div>

        {/* Quote text */}
        <div
          style={{
            opacity: quoteOpacity,
            transform: `translateY(${quoteY}px)`,
            marginBottom: 36,
            paddingTop: 8,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <p
            style={{
              fontFamily: theme.font.body,
              fontSize: 26,
              fontWeight: theme.font.weights.medium,
              color: theme.colors.text,
              lineHeight: 1.65,
              margin: 0,
              padding: 0,
            }}
          >
            {quote}
          </p>
        </div>

        {/* Separator line */}
        <div
          style={{
            height: 1,
            backgroundColor: theme.colors.border,
            marginBottom: 32,
            transformOrigin: 'left center',
            transform: `scaleX(${separatorScaleX})`,
            opacity: separatorOpacity,
          }}
        />

        {/* Author row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            opacity: authorOpacity,
            transform: `translateX(${authorX}px)`,
          }}
        >
          {/* Avatar */}
          {avatarUrl ? (
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
                border: `2px solid ${theme.colors.border}`,
              }}
            >
              <Img
                src={avatarUrl}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ) : (
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                backgroundColor: theme.colors.accentLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: `2px solid ${theme.colors.accent}`,
              }}
            >
              <span
                style={{
                  fontFamily: theme.font.display,
                  fontSize: 22,
                  fontWeight: theme.font.weights.bold,
                  color: theme.colors.accent,
                  lineHeight: 1,
                }}
              >
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Name / role / company */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span
              style={{
                fontFamily: theme.font.display,
                fontSize: 17,
                fontWeight: theme.font.weights.semibold,
                color: theme.colors.text,
                lineHeight: 1.2,
              }}
            >
              {name}
            </span>
            <span
              style={{
                fontFamily: theme.font.body,
                fontSize: 14,
                fontWeight: theme.font.weights.regular,
                color: theme.colors.textMuted,
                lineHeight: 1.3,
              }}
            >
              {role}
              {role && company ? ' · ' : ''}
              {company}
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
