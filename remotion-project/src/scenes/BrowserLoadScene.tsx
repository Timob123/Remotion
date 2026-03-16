import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast } from '../hooks/useSceneAnimation';

// ── Timing constants ──────────────────────────────────────────────────────────
const BROWSER_ENTRY_START = 0;
const BROWSER_ENTRY_END   = 14;
const URL_TYPE_START      = 16;
const URL_TYPE_END        = 44;
const LOAD_START          = 46;
const LOAD_END            = 64;
const CONTENT_IN_START    = 62;
const CONTENT_IN_END      = 80;

// ── Layout constants ──────────────────────────────────────────────────────────
const BROWSER_WIDTH            = 960;
const BROWSER_HEIGHT           = 580;
const CHROME_HEIGHT            = 48;
const TRAFFIC_SIZE             = 12;
const TRAFFIC_GAP              = 8;
const URL_BAR_HEIGHT           = 28;
const URL_BAR_RADIUS           = 14;
const LOAD_BAR_HEIGHT          = 2;
const BROWSER_RADIUS           = 12;
const CONTENT_PADDING          = 24;
const SKELETON_RADIUS          = 4;

// ── Colour constants ──────────────────────────────────────────────────────────
const BROWSER_DARK_BG          = '#1a1a1a';
const BROWSER_LIGHT_BG_CHROME  = '#f0eeeb';
const BROWSER_CHROME_DARK_BG   = '#252525';
const TRAFFIC_RED              = '#FF5F57';
const TRAFFIC_YELLOW           = '#FFBD2E';
const TRAFFIC_GREEN            = '#28C840';
const BOX_SHADOW_DARK          = 'rgba(0,0,0,0.6)';
const BOX_SHADOW_LIGHT         = 'rgba(0,0,0,0.18)';
const URL_BAR_DARK_BG          = 'rgba(255,255,255,0.08)';
const URL_BAR_LIGHT_BG         = 'rgba(0,0,0,0.07)';
const URL_TEXT_DARK            = 'rgba(255,255,255,0.75)';
const HERO_DARK_BG             = 'rgba(255,255,255,0.05)';
const HERO_LIGHT_BG            = 'rgba(0,0,0,0.04)';

// ── Animation constants ───────────────────────────────────────────────────────
const BROWSER_ENTRY_Y_START    = -80;
const BOX_SHADOW_Y             = 32;
const BOX_SHADOW_BLUR          = 80;

// ── Chrome bar constants ──────────────────────────────────────────────────────
const CHROME_PADDING_X         = 16;
const CHROME_GAP               = 12;
const URL_BAR_PADDING_LEFT     = 14;
const URL_FONT_SIZE            = 12;

// ── Content layout constants ──────────────────────────────────────────────────
const NAV_GAP                  = 12;
const NAV_MARGIN_BOTTOM        = 28;
const NAV_PILL_HEIGHT          = 12;
const HERO_HEIGHT              = 200;
const HERO_RADIUS              = 8;
const HERO_MARGIN_BOTTOM       = 20;
const HERO_PADDING             = 24;
const HERO_GAP                 = 12;
const TITLE_SKELETON_HEIGHT    = 28;
const TITLE_SKELETON_WIDTH     = 320;
const TEXT_SKELETON_HEIGHT     = 14;
const CARD_GAP                 = 16;
const CARD_HEIGHT              = 80;
const CARD_RADIUS              = 8;
const NAV_PILL_WIDTHS          = [60, 80, 70, 50];
const TEXT_SKELETON_WIDTHS     = [280, 240, 180];
const SKELETON_DOUBLE_RADIUS   = SKELETON_RADIUS * 2;
const CURSOR_BLINK_DIVISOR     = 4;
const CURSOR_BLINK_MODULO      = 2;
const CARD_ITEMS               = [0, 1, 2];
const TRAFFIC_COLORS           = [TRAFFIC_RED, TRAFFIC_YELLOW, TRAFFIC_GREEN];

interface BrowserLoadSceneProps {
  url?: string;
  pageTitle?: string;
  dark?: boolean;
  bg?: string;
}

export const BrowserLoadScene: React.FC<BrowserLoadSceneProps> = ({
  url,
  pageTitle,
  dark = true,
  bg,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accentColor = theme.colors.accent;

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);

  // Browser entry animation
  const entrySpring = spring({ frame: Math.max(0, frame - BROWSER_ENTRY_START), fps, config: springFast, durationInFrames: BROWSER_ENTRY_END - BROWSER_ENTRY_START });
  const browserY = interpolate(entrySpring, [0, 1], [BROWSER_ENTRY_Y_START, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const browserOpacity = interpolate(entrySpring, [0, 0.4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // URL typing
  const urlStr = url ?? 'app.tapid.io/dashboard';
  const charsShown = Math.floor(
    interpolate(frame, [URL_TYPE_START, URL_TYPE_END], [0, urlStr.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  // Load bar progress
  const loadProgress = interpolate(frame, [LOAD_START, LOAD_END], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Content fade in
  const contentOpacity = interpolate(frame, [CONTENT_IN_START, CONTENT_IN_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Cursor blink
  const cursorOpacity = Math.floor(frame / CURSOR_BLINK_DIVISOR) % CURSOR_BLINK_MODULO === 0 ? 1 : 0;

  // Colours derived from dark mode
  const chromeBg    = dark ? BROWSER_CHROME_DARK_BG : BROWSER_LIGHT_BG_CHROME;
  const urlBarBg    = dark ? URL_BAR_DARK_BG : URL_BAR_LIGHT_BG;
  const urlTextColor = dark ? URL_TEXT_DARK : theme.colors.textMuted;
  const skeletonBg  = dark ? URL_BAR_DARK_BG : URL_BAR_LIGHT_BG;
  const heroBg      = dark ? HERO_DARK_BG : HERO_LIGHT_BG;

  // pageTitle reserved for future browser tab chrome rendering

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Browser window */}
      <div
        style={{
          width: BROWSER_WIDTH,
          height: BROWSER_HEIGHT,
          borderRadius: BROWSER_RADIUS,
          overflow: 'hidden',
          transform: `translateY(${browserY}px)`,
          opacity: browserOpacity,
          boxShadow: `0 ${BOX_SHADOW_Y}px ${BOX_SHADOW_BLUR}px ${dark ? BOX_SHADOW_DARK : BOX_SHADOW_LIGHT}`,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: dark ? BROWSER_DARK_BG : theme.colors.bg,
        }}
      >
        {/* Chrome bar */}
        <div
          style={{
            height: CHROME_HEIGHT,
            backgroundColor: chromeBg,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: `0 ${CHROME_PADDING_X}px`,
            gap: CHROME_GAP,
            flexShrink: 0,
          }}
        >
          {/* Traffic lights */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: TRAFFIC_GAP,
              flexShrink: 0,
            }}
          >
            {TRAFFIC_COLORS.map((c, i) => (
              <div
                key={i}
                style={{
                  width: TRAFFIC_SIZE,
                  height: TRAFFIC_SIZE,
                  borderRadius: '50%',
                  backgroundColor: c,
                }}
              />
            ))}
          </div>

          {/* Address bar */}
          <div
            style={{
              flex: 1,
              height: URL_BAR_HEIGHT,
              borderRadius: URL_BAR_RADIUS,
              backgroundColor: urlBarBg,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: URL_BAR_PADDING_LEFT,
              overflow: 'hidden',
            }}
          >
            <span
              style={{
                fontFamily: theme.font.body,
                fontSize: URL_FONT_SIZE,
                color: urlTextColor,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              {urlStr.slice(0, charsShown)}
              <span style={{ opacity: cursorOpacity }}>|</span>
            </span>
          </div>
        </div>

        {/* Loading bar */}
        <div
          style={{
            height: LOAD_BAR_HEIGHT,
            backgroundColor: accentColor,
            width: `${loadProgress}%`,
            flexShrink: 0,
          }}
        />

        {/* Content area */}
        <div
          style={{
            flex: 1,
            padding: CONTENT_PADDING,
            opacity: contentOpacity,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Nav row — skeleton pills */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: NAV_GAP,
              marginBottom: NAV_MARGIN_BOTTOM,
              flexShrink: 0,
            }}
          >
            {NAV_PILL_WIDTHS.map((w, i) => (
              <div
                key={i}
                style={{
                  width: w,
                  height: NAV_PILL_HEIGHT,
                  borderRadius: SKELETON_DOUBLE_RADIUS,
                  backgroundColor: skeletonBg,
                }}
              />
            ))}
          </div>

          {/* Hero block */}
          <div
            style={{
              height: HERO_HEIGHT,
              borderRadius: HERO_RADIUS,
              backgroundColor: heroBg,
              marginBottom: HERO_MARGIN_BOTTOM,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: HERO_PADDING,
              gap: HERO_GAP,
            }}
          >
            {/* Title skeleton */}
            <div
              style={{
                height: TITLE_SKELETON_HEIGHT,
                width: TITLE_SKELETON_WIDTH,
                borderRadius: SKELETON_RADIUS,
                backgroundColor: skeletonBg,
              }}
            />
            {/* Text skeletons */}
            {TEXT_SKELETON_WIDTHS.map((w, i) => (
              <div
                key={i}
                style={{
                  height: TEXT_SKELETON_HEIGHT,
                  width: w,
                  borderRadius: SKELETON_RADIUS,
                  backgroundColor: skeletonBg,
                }}
              />
            ))}
          </div>

          {/* Card row */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: CARD_GAP,
              flexShrink: 0,
            }}
          >
            {CARD_ITEMS.map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: CARD_HEIGHT,
                  borderRadius: CARD_RADIUS,
                  backgroundColor: skeletonBg,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
