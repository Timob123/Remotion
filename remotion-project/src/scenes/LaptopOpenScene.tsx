import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast } from '../hooks/useSceneAnimation';

// ── Timing constants ──────────────────────────────────────────────────────────
const LID_OPEN_START     = 0;
const LID_OPEN_END       = 22;
const SCREEN_GLOW_START  = 18;
const SCREEN_GLOW_END    = 28;
const URL_TYPE_START     = 30;
const URL_TYPE_END       = 56;
const LOAD_BAR_START     = 56;
const LOAD_BAR_END       = 72;
const CONTENT_FADE_START = 70;
const CONTENT_FADE_END   = 86;

// ── Layout constants ──────────────────────────────────────────────────────────
const LAPTOP_WIDTH            = 680;
const BASE_HEIGHT             = 36;
const SCREEN_HEIGHT           = 400;
const LID_BORDER_RADIUS       = 14;
const BASE_BORDER_RADIUS      = 6;
const HINGE_HEIGHT            = 6;
const SCREEN_PADDING          = 20;
const ADDRESS_BAR_HEIGHT      = 32;
const ADDRESS_BAR_RADIUS      = 6;
const LOAD_BAR_HEIGHT         = 3;
const CONTENT_LINE_HEIGHT_PX  = 14;
const CONTENT_LINE_RADIUS     = 4;
const CONTENT_MARGIN_BOTTOM   = 8;
const HERO_BLOCK_HEIGHT       = 80;
const HERO_MARGIN_BOTTOM      = 12;
const PERSPECTIVE              = 1200;
const SCREEN_INNER_RADIUS_OFFSET = 4;
const ADDR_PADDING_X           = 12;
const ADDR_MARGIN_BOTTOM       = 8;
const CONTENT_LINE_EXTRA_RADIUS = 2;
const BASE_OPACITY             = 0.9;
const ADDR_FONT_SIZE           = 12;
const SCREEN_MARGIN_BOTTOM     = 12;
const CONTENT_LINE_WIDTHS      = [100, 80, 90, 60];

// ── Colour constants ──────────────────────────────────────────────────────────
const BORDER_SHADOW_DARK  = 'rgba(0,0,0,0.08)';
const BORDER_HIGHLIGHT    = 'rgba(255,255,255,0.12)';
const INNER_SHADOW        = 'rgba(0,0,0,0.06)';
const INNER_HIGHLIGHT     = 'rgba(255,255,255,0.1)';
const SCREEN_FRAME_COLOR  = 'rgba(247,246,243,0.7)';
const GLOW_DARK_FACTOR    = 0.95;
const CURSOR_BLINK_DIVISOR = 4;
const CURSOR_BLINK_MODULO  = 2;
const HINGE_WIDTH_RATIO    = 0.6;
const LOAD_BAR_RADIUS      = LOAD_BAR_HEIGHT / 2;

// ── Colour RGB constants ──────────────────────────────────────────────────────
const HINGE_DARK_R  = 255;
const HINGE_DARK_G  = 255;
const HINGE_DARK_B  = 255;
const HINGE_LIGHT_R = 0;
const HINGE_LIGHT_G = 0;
const HINGE_LIGHT_B = 0;
const HINGE_DARK_ALPHA  = 0.15;
const HINGE_LIGHT_ALPHA = 0.2;
const SCREEN_GLOW_RGB = '247,246,243';
const SCREEN_OFF_RGB  = '17,17,16';

interface LaptopOpenSceneProps {
  url?: string;
  dark?: boolean;
  bg?: string;
}

export const LaptopOpenScene: React.FC<LaptopOpenSceneProps> = ({
  url,
  dark = true,
  bg,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accentColor = theme.colors.accent;

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;

  // Lid open animation
  const lidSpring = spring({ frame, fps, config: springFast });
  const lidRotateX = interpolate(lidSpring, [0, 1], [80, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Screen glow (fades in after lid starts opening)
  const screenGlow = interpolate(frame, [SCREEN_GLOW_START, SCREEN_GLOW_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // URL typing
  const urlString = url ?? 'app.tapid.io';
  const charsShown = Math.floor(
    interpolate(frame, [URL_TYPE_START, URL_TYPE_END], [0, urlString.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  // Load bar
  const loadProgress = interpolate(frame, [LOAD_BAR_START, LOAD_BAR_END], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Content fade
  const contentOpacity = interpolate(frame, [CONTENT_FADE_START, CONTENT_FADE_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const contentBlur = interpolate(frame, [CONTENT_FADE_START, CONTENT_FADE_END], [8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Address bar cursor blink
  const cursorOpacity = Math.floor(frame / CURSOR_BLINK_DIVISOR) % CURSOR_BLINK_MODULO === 0 ? 1 : 0;

  // Screen interior background
  const screenBg = dark
    ? `rgba(${SCREEN_GLOW_RGB},${screenGlow})`
    : `rgba(${SCREEN_OFF_RGB},${screenGlow * GLOW_DARK_FACTOR})`;

  // Muted content placeholder colour
  const skeletonColor = dark ? BORDER_SHADOW_DARK : BORDER_HIGHLIGHT;
  const addressBarBg = dark ? INNER_SHADOW : INNER_HIGHLIGHT;
  const urlTextColor = dark ? theme.colors.textMuted : SCREEN_FRAME_COLOR;
  const hingeColor = dark
    ? `rgba(${HINGE_DARK_R},${HINGE_DARK_G},${HINGE_DARK_B},${HINGE_DARK_ALPHA})`
    : `rgba(${HINGE_LIGHT_R},${HINGE_LIGHT_G},${HINGE_LIGHT_B},${HINGE_LIGHT_ALPHA})`;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          perspective: PERSPECTIVE,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* LID / Screen */}
        <div
          style={{
            width: LAPTOP_WIDTH,
            height: SCREEN_HEIGHT,
            backgroundColor: textColor,
            borderRadius: `${LID_BORDER_RADIUS}px ${LID_BORDER_RADIUS}px 0 0`,
            transformOrigin: 'bottom center',
            transform: `rotateX(${lidRotateX}deg)`,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Screen interior */}
          <div
            style={{
              position: 'absolute',
              inset: SCREEN_PADDING,
              backgroundColor: screenBg,
              borderRadius: LID_BORDER_RADIUS - SCREEN_INNER_RADIUS_OFFSET,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* All screen content gated by screenGlow opacity */}
            <div style={{ opacity: screenGlow, display: 'flex', flexDirection: 'column', flex: 1 }}>
              {/* Address bar */}
              <div
                style={{
                  height: ADDRESS_BAR_HEIGHT,
                  backgroundColor: addressBarBg,
                  borderRadius: ADDRESS_BAR_RADIUS,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: ADDR_PADDING_X,
                  paddingRight: ADDR_PADDING_X,
                  marginBottom: ADDR_MARGIN_BOTTOM,
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: theme.font.body,
                    fontSize: ADDR_FONT_SIZE,
                    color: urlTextColor,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}
                >
                  {urlString.slice(0, charsShown)}
                  <span style={{ opacity: cursorOpacity }}>|</span>
                </span>
              </div>

              {/* Loading bar */}
              <div
                style={{
                  height: LOAD_BAR_HEIGHT,
                  backgroundColor: accentColor,
                  width: `${loadProgress}%`,
                  marginBottom: SCREEN_MARGIN_BOTTOM,
                  flexShrink: 0,
                  borderRadius: LOAD_BAR_RADIUS,
                }}
              />

              {/* Content area */}
              <div
                style={{
                  flex: 1,
                  opacity: contentOpacity,
                  filter: `blur(${contentBlur}px)`,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Hero block */}
                <div
                  style={{
                    height: HERO_BLOCK_HEIGHT,
                    backgroundColor: skeletonColor,
                    borderRadius: CONTENT_LINE_RADIUS + CONTENT_LINE_EXTRA_RADIUS,
                    marginBottom: HERO_MARGIN_BOTTOM,
                    flexShrink: 0,
                  }}
                />

                {/* Placeholder content lines */}
                {CONTENT_LINE_WIDTHS.map((widthPct, i) => (
                  <div
                    key={i}
                    style={{
                      height: CONTENT_LINE_HEIGHT_PX,
                      width: `${widthPct}%`,
                      backgroundColor: skeletonColor,
                      borderRadius: CONTENT_LINE_RADIUS,
                      marginBottom: CONTENT_MARGIN_BOTTOM,
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* HINGE */}
        <div
          style={{
            width: LAPTOP_WIDTH * HINGE_WIDTH_RATIO,
            height: HINGE_HEIGHT,
            backgroundColor: hingeColor,
          }}
        />

        {/* BASE */}
        <div
          style={{
            width: LAPTOP_WIDTH,
            height: BASE_HEIGHT,
            backgroundColor: textColor,
            borderRadius: `0 0 ${BASE_BORDER_RADIUS}px ${BASE_BORDER_RADIUS}px`,
            opacity: BASE_OPACITY,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
