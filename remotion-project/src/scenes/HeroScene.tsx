import { AbsoluteFill } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation, springBounce } from '../hooks/useSceneAnimation';
import { HeroSceneProps } from '../types';

export const HeroScene: React.FC<HeroSceneProps> = ({ headline, subheadline, ctaText, badge }) => {
  const { s, fadeIn, slideUp } = useSceneAnimation();

  const badgeOpacity = fadeIn(0, 12);

  const headlineWords = headline.split('\n');
  const subOpacity = fadeIn(18, 14);
  const subY = slideUp(18, 25);

  const ctaSpring = s(28, springBounce);
  const ctaScale = 0.6 + ctaSpring * 0.4;
  const ctaOpacity = Math.min(1, ctaSpring * 2);

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
      {/* Decorative background circle */}
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          border: `1.5px solid ${theme.colors.border}`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 620,
          height: 620,
          borderRadius: '50%',
          border: `1px solid ${theme.colors.border}`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.35,
          pointerEvents: 'none',
        }}
      />
      {/* Dot grid accent — top-right quadrant */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          right: 80,
          width: 180,
          height: 180,
          backgroundImage: `radial-gradient(circle, ${theme.colors.border} 1.5px, transparent 1.5px)`,
          backgroundSize: '18px 18px',
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 900,
          width: '100%',
          padding: '0 60px',
          gap: 0,
          zIndex: 1,
        }}
      >
        {/* Badge */}
        {badge && (
          <div
            style={{
              opacity: badgeOpacity,
              marginBottom: 28,
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radii.full,
              padding: '6px 16px',
              boxShadow: theme.shadow,
            }}
          >
            <span
              style={{
                fontFamily: theme.font.body,
                fontSize: 13,
                fontWeight: theme.font.weights.semibold,
                color: theme.colors.accent,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              {badge}
            </span>
          </div>
        )}

        {/* Headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
            marginBottom: 28,
          }}
        >
          {headlineWords.map((line, i) => {
            const lineSpring = s(8 + i * 6);
            const lineY = (1 - lineSpring) * 50;
            const lineOpacity = Math.min(1, lineSpring * 1.5);
            return (
              <div
                key={i}
                style={{
                  transform: `translateY(${lineY}px)`,
                  opacity: lineOpacity,
                }}
              >
                <span
                  style={{
                    fontFamily: theme.font.display,
                    fontSize: theme.font.sizes.xxl,
                    fontWeight: theme.font.weights.black,
                    color: theme.colors.text,
                    letterSpacing: '-2px',
                    lineHeight: 1.05,
                    display: 'block',
                    textAlign: 'center',
                  }}
                >
                  {line}
                </span>
              </div>
            );
          })}
        </div>

        {/* Subheadline */}
        <div
          style={{
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            marginBottom: 44,
          }}
        >
          <span
            style={{
              fontFamily: theme.font.body,
              fontSize: 22,
              fontWeight: theme.font.weights.regular,
              color: theme.colors.textMuted,
              lineHeight: 1.6,
              textAlign: 'center',
              display: 'block',
              maxWidth: 640,
            }}
          >
            {subheadline}
          </span>
        </div>

        {/* CTA */}
        {ctaText && (
          <div
            style={{
              opacity: ctaOpacity,
              transform: `scale(${ctaScale})`,
            }}
          >
            <div
              style={{
                backgroundColor: theme.colors.text,
                color: '#FFFFFF',
                fontFamily: theme.font.body,
                fontSize: 17,
                fontWeight: theme.font.weights.semibold,
                letterSpacing: '-0.2px',
                padding: '16px 40px',
                borderRadius: theme.radii.full,
                display: 'inline-block',
                boxShadow: theme.shadowLg,
              }}
            >
              {ctaText}
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
