import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { theme } from '../config/theme';
import { springFast } from '../hooks/useSceneAnimation';

// ── Timing ────────────────────────────────────────────────────────────────────
const CARD_STAGGER = 8; // frames between each card
const CARD_SLIDE_DISTANCE = 40; // px slide-in from below

// ── Layout ────────────────────────────────────────────────────────────────────
const CARD_RADIUS = 16; // px
const CARD_PADDING = 28; // px
const CARD_GAP = 20; // px
const ICON_SIZE = 44; // px
const ICON_RADIUS = 10; // px
const ICON_FONT_SIZE = 20; // px (emoji size)
const TITLE_FONT_SIZE = 18; // px
const BODY_FONT_SIZE = 14; // px
const GRID_MAX_WIDTH = 800; // px
const CARD_SPRING_DURATION = 40; // frames

// ── Colours ───────────────────────────────────────────────────────────────────
const CARD_BG_DARK = 'rgba(255,255,255,0.07)';
const CARD_BG_LIGHT = 'rgba(255,255,255,1)';
const CARD_BORDER_DARK = 'rgba(255,255,255,0.1)';
const CARD_BORDER_LIGHT = 'rgba(0,0,0,0.08)';
const ICON_BG_ALPHA = 0.15;
const CARD_BODY_ALPHA = 0.6;
const ACCENT_RGB = '99,102,241'; // matches theme.colors.accent

// ── Feature card data ─────────────────────────────────────────────────────────
const FEATURE_CARDS = [
  { icon: '⚡', title: 'Edge Deployment', body: 'Deploy to 100+ edge locations globally in seconds, not minutes.' },
  { icon: '🔮', title: 'AI-Powered', body: 'Intelligent optimizations that learn from your traffic patterns.' },
  { icon: '🛡️', title: 'Zero Trust Security', body: 'Every request authenticated and encrypted end-to-end by default.' },
  { icon: '📊', title: 'Real-time Analytics', body: 'Live dashboards with sub-second latency on all your metrics.' },
];

// ── Props ─────────────────────────────────────────────────────────────────────
type FeatureCardsSceneProps = {
  dark?: boolean;
  bg?: string;
};

export const FeatureCardsScene: React.FC<FeatureCardsSceneProps> = ({
  dark = true,
  bg,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;
  const cardBg = dark ? CARD_BG_DARK : CARD_BG_LIGHT;
  const cardBorder = dark ? CARD_BORDER_DARK : CARD_BORDER_LIGHT;
  const iconBg = `rgba(${ACCENT_RGB},${ICON_BG_ALPHA})`;

  // ── Card animations (staggered spring) ──────────────────────────────────────
  const cardAnimations = FEATURE_CARDS.map((_, i) => {
    const delay = i * CARD_STAGGER;
    const cardSpring = spring({
      frame: Math.max(0, frame - delay),
      fps,
      config: springFast,
      durationInFrames: CARD_SPRING_DURATION,
    });
    const opacity = interpolate(cardSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const translateY = interpolate(cardSpring, [0, 1], [CARD_SLIDE_DISTANCE, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return { opacity, translateY };
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: theme.font.display,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: GRID_MAX_WIDTH,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: CARD_GAP,
          padding: `0 ${CARD_GAP}px`,
        }}
      >
        {FEATURE_CARDS.map((card, i) => {
          const { opacity, translateY } = cardAnimations[i];
          return (
            <div
              key={i}
              style={{
                borderRadius: CARD_RADIUS,
                backgroundColor: cardBg,
                border: `1px solid ${cardBorder}`,
                padding: CARD_PADDING,
                opacity,
                transform: `translateY(${translateY}px)`,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              {/* Icon area */}
              <div
                style={{
                  width: ICON_SIZE,
                  height: ICON_SIZE,
                  borderRadius: ICON_RADIUS,
                  backgroundColor: iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: ICON_FONT_SIZE,
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </div>

              {/* Title */}
              <span
                style={{
                  fontFamily: theme.font.display,
                  fontSize: TITLE_FONT_SIZE,
                  fontWeight: theme.font.weights.semibold,
                  color: textColor,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.3,
                }}
              >
                {card.title}
              </span>

              {/* Body */}
              <span
                style={{
                  fontFamily: theme.font.display,
                  fontSize: BODY_FONT_SIZE,
                  fontWeight: theme.font.weights.regular,
                  color: textColor,
                  opacity: CARD_BODY_ALPHA,
                  lineHeight: 1.6,
                  letterSpacing: '-0.005em',
                }}
              >
                {card.body}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export default FeatureCardsScene;
