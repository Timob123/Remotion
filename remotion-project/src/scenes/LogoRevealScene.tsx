import { AbsoluteFill, Img } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation, springBounce } from '../hooks/useSceneAnimation';
import { LogoRevealSceneProps } from '../types';

export const LogoRevealScene: React.FC<LogoRevealSceneProps> = ({ brandName, tagline, logoUrl }) => {
  const { s, fadeIn, slideUp } = useSceneAnimation();

  const logoSpring = s(0, springBounce);
  const logoScale = 0.6 + logoSpring * 0.4;
  const logoOpacity = Math.min(1, logoSpring * 1.8);

  const ringSpring = s(4, springBounce);
  const ringScale = 0.7 + ringSpring * 0.3;
  const ringOpacity = Math.min(1, ringSpring * 1.4);

  const nameSpring = s(14);
  const nameY = (1 - nameSpring) * 20;
  const nameOpacity = Math.min(1, nameSpring * 1.5);

  const taglineOpacity = fadeIn(24, 14);

  const lettermark = brandName.charAt(0).toUpperCase();

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
      {/* Subtle background rings for depth */}
      <div
        style={{
          position: 'absolute',
          width: 700,
          height: 700,
          borderRadius: '50%',
          border: `1px solid ${theme.colors.border}`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
          zIndex: 1,
        }}
      >
        {/* Logo / Lettermark with decorative ring */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          {/* Decorative outer ring */}
          <div
            style={{
              position: 'absolute',
              width: 148,
              height: 148,
              borderRadius: '50%',
              border: `2px solid ${theme.colors.accent}`,
              opacity: ringOpacity * 0.35,
              transform: `scale(${ringScale})`,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: 164,
              height: 164,
              borderRadius: '50%',
              border: `1px solid ${theme.colors.border}`,
              opacity: ringOpacity * 0.5,
              transform: `scale(${ringScale * 0.98})`,
              pointerEvents: 'none',
            }}
          />

          {/* Logo mark */}
          <div
            style={{
              opacity: logoOpacity,
              transform: `scale(${logoScale})`,
              zIndex: 1,
            }}
          >
            {logoUrl ? (
              <Img
                src={logoUrl}
                style={{
                  width: 110,
                  height: 110,
                  objectFit: 'contain',
                  borderRadius: theme.radii.lg,
                }}
              />
            ) : (
              <div
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: theme.radii.lg,
                  backgroundColor: theme.colors.text,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: theme.shadowLg,
                }}
              >
                <span
                  style={{
                    fontFamily: theme.font.display,
                    fontSize: 52,
                    fontWeight: theme.font.weights.black,
                    color: '#FFFFFF',
                    letterSpacing: '-1px',
                    lineHeight: 1,
                    userSelect: 'none',
                  }}
                >
                  {lettermark}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Brand name */}
        <div
          style={{
            opacity: nameOpacity,
            transform: `translateY(${nameY}px)`,
            marginBottom: tagline ? 14 : 0,
          }}
        >
          <span
            style={{
              fontFamily: theme.font.display,
              fontSize: 64,
              fontWeight: theme.font.weights.black,
              color: theme.colors.text,
              letterSpacing: '-2px',
              lineHeight: 1.05,
              display: 'block',
              textAlign: 'center',
            }}
          >
            {brandName}
          </span>
        </div>

        {/* Tagline */}
        {tagline && (
          <div style={{ opacity: taglineOpacity }}>
            <span
              style={{
                fontFamily: theme.font.body,
                fontSize: 18,
                fontWeight: theme.font.weights.regular,
                color: theme.colors.textMuted,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                display: 'block',
                textAlign: 'center',
              }}
            >
              {tagline}
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
