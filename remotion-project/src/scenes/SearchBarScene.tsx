import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { theme } from '../config/theme';
import { springFast } from '../hooks/useSceneAnimation';

// ── Timing ────────────────────────────────────────────────────────────────────
const SEARCH_ENTRY_END = 8;
const TYPE_START = 8;
const TYPE_END = 50;
const RESULTS_START = 52;
const RESULT_STAGGER = 10; // frames between each card

// ── Search bar ────────────────────────────────────────────────────────────────
const SEARCH_QUERY = 'How does vector search work?';
const BAR_HEIGHT = 64; // px
const BAR_RADIUS = 32; // px (pill shape)
const BAR_MAX_WIDTH = 680; // px
const BAR_PADDING_X = 24; // px
const BAR_FONT_SIZE = 20; // px
const CURSOR_BLINK_RATE = 7;

// ── Result cards ──────────────────────────────────────────────────────────────
const RESULT_CARD_RADIUS = 12; // px
const RESULT_CARD_PADDING = 20; // px
const RESULT_SLIDE_DISTANCE = 24; // px (how far cards slide up from)
const RESULT_GAP = 12; // px
const RESULT_TITLE_FONT_SIZE = 15; // px
const RESULT_BODY_FONT_SIZE = 13; // px
const RESULT_MAX_WIDTH = 680; // px
const CURSOR_CHAR = '|';

// ── Colours (dark) ────────────────────────────────────────────────────────────
const ICON_COLOR_DARK = 'rgba(255,255,255,0.4)';
const ICON_COLOR_LIGHT = 'rgba(0,0,0,0.3)';
const BAR_BORDER_DARK = 'rgba(255,255,255,0.12)';
const BAR_BORDER_LIGHT = 'rgba(0,0,0,0.1)';
const BAR_BG_DARK = 'rgba(255,255,255,0.06)';
const BAR_BG_LIGHT = 'rgba(255,255,255,1)';
const CARD_BG_DARK = 'rgba(255,255,255,0.06)';
const CARD_BG_LIGHT = 'rgba(255,255,255,1)';
const CARD_BORDER_DARK = 'rgba(255,255,255,0.1)';
const CARD_BORDER_LIGHT = 'rgba(0,0,0,0.08)';
const CARD_BODY_ALPHA_DARK = 0.5;
const CARD_BODY_ALPHA_LIGHT = 0.6;

// ── Result card data ──────────────────────────────────────────────────────────
const RESULT_CARDS = [
  { title: 'Vector Search Fundamentals', body: 'Vector search uses high-dimensional embeddings to find semantically similar content using approximate nearest-neighbor algorithms.' },
  { title: 'How Embeddings Work', body: 'Text embeddings convert words and phrases into numerical vectors that capture meaning, enabling semantic similarity comparisons.' },
  { title: 'Popular Vector Databases', body: 'Pinecone, Weaviate, and pgvector are popular choices for storing and querying vector embeddings at scale.' },
];

// ── Props ─────────────────────────────────────────────────────────────────────
type SearchBarSceneProps = {
  dark?: boolean;
  bg?: string;
};

export const SearchBarScene: React.FC<SearchBarSceneProps> = ({
  dark = true,
  bg,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;
  const iconColor = dark ? ICON_COLOR_DARK : ICON_COLOR_LIGHT;
  const barBorder = dark ? BAR_BORDER_DARK : BAR_BORDER_LIGHT;
  const barBg = dark ? BAR_BG_DARK : BAR_BG_LIGHT;
  const cardBg = dark ? CARD_BG_DARK : CARD_BG_LIGHT;
  const cardBorder = dark ? CARD_BORDER_DARK : CARD_BORDER_LIGHT;
  const cardBodyAlpha = dark ? CARD_BODY_ALPHA_DARK : CARD_BODY_ALPHA_LIGHT;

  // ── Search bar entrance (frame 0-8) ─────────────────────────────────────────
  const barSpring = spring({ frame: Math.max(0, frame), fps, config: springFast });
  const barOpacity = interpolate(barSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const barScale = interpolate(barSpring, [0, 1], [0.9, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // ── Typeout (frame 8-50) ─────────────────────────────────────────────────────
  const charsVisible = Math.floor(
    interpolate(frame, [TYPE_START, TYPE_END], [0, SEARCH_QUERY.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const typedText = SEARCH_QUERY.slice(0, charsVisible);
  const isTyping = charsVisible < SEARCH_QUERY.length;
  const cursorVisible = Math.floor(frame / CURSOR_BLINK_RATE) % 2 === 0;

  // ── Result cards (frame 52+) ─────────────────────────────────────────────────
  const cardAnimations = RESULT_CARDS.map((_, i) => {
    const cardStart = RESULTS_START + i * RESULT_STAGGER;
    const cardSpring = spring({ frame: Math.max(0, frame - cardStart), fps, config: springFast });
    const opacity = interpolate(cardSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const translateY = interpolate(cardSpring, [0, 1], [RESULT_SLIDE_DISTANCE, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return { opacity, translateY };
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: theme.font.display,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: BAR_MAX_WIDTH,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: RESULT_GAP,
        }}
      >
        {/* Search bar */}
        <div
          style={{
            height: BAR_HEIGHT,
            borderRadius: BAR_RADIUS,
            backgroundColor: barBg,
            border: `1px solid ${barBorder}`,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: BAR_PADDING_X,
            paddingRight: BAR_PADDING_X,
            gap: 12,
            opacity: barOpacity,
            transform: `scale(${barScale})`,
          }}
        >
          {/* Search icon */}
          <svg
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            style={{ flexShrink: 0 }}
          >
            <circle cx="9" cy="9" r="6" stroke={iconColor} strokeWidth="2" />
            <path d="M13.5 13.5L17 17" stroke={iconColor} strokeWidth="2" strokeLinecap="round" />
          </svg>

          {/* Typed query */}
          <span
            style={{
              fontFamily: theme.font.display,
              fontSize: BAR_FONT_SIZE,
              color: textColor,
              flex: 1,
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {typedText}
            {(isTyping || frame >= TYPE_END) && cursorVisible && (
              <span
                style={{
                  display: 'inline',
                  color: theme.colors.accent,
                  marginLeft: 1,
                }}
              >
                {CURSOR_CHAR}
              </span>
            )}
          </span>
        </div>

        {/* Result cards */}
        {RESULT_CARDS.map((card, i) => {
          const { opacity, translateY } = cardAnimations[i];
          return (
            <div
              key={i}
              style={{
                borderRadius: RESULT_CARD_RADIUS,
                backgroundColor: cardBg,
                border: `1px solid ${cardBorder}`,
                padding: RESULT_CARD_PADDING,
                opacity,
                transform: `translateY(${translateY}px)`,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                maxWidth: RESULT_MAX_WIDTH,
                width: '100%',
              }}
            >
              <span
                style={{
                  fontFamily: theme.font.display,
                  fontSize: RESULT_TITLE_FONT_SIZE,
                  fontWeight: theme.font.weights.semibold,
                  color: textColor,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.3,
                }}
              >
                {card.title}
              </span>
              <span
                style={{
                  fontFamily: theme.font.display,
                  fontSize: RESULT_BODY_FONT_SIZE,
                  fontWeight: theme.font.weights.regular,
                  color: textColor,
                  opacity: cardBodyAlpha,
                  lineHeight: 1.55,
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

export default SearchBarScene;
