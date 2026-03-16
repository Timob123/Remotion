import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springBounce } from '../hooks/useSceneAnimation';

// ─── Constants ────────────────────────────────────────────────────────────────

const PHONE_WIDTH = 400;
const PHONE_HEIGHT = 820;
const SIDE_BUTTON_COLOR = '#222';
const DYNAMIC_ISLAND_COLOR = '#000';
const SCREEN_COLOR = '#000000';
const POSITION_OFFSET = 320;
const CAPTION_FADE_START = 10;
const CAPTION_FADE_END = 25;
const FLASH_SIZE = 600;
const BADGE_SWITCH_FRAME = 15;
const BADGE_SPRING_DELAY = 14;
const ICON_SIZE = 80;
const ICON_RADIUS = 20;
const ICON_EMOJI_SIZE = 40;
const BADGE_SIZE = 24;
const BADGE_RADIUS = 12;
const BADGE_COLOR = '#EF4444'; // no theme token for this exact red

// Phone shell geometry
const PHONE_BORDER_RADIUS = 48;
const DYNAMIC_ISLAND_WIDTH = 90;
const DYNAMIC_ISLAND_HEIGHT = 28;
const DYNAMIC_ISLAND_TOP = 14;
const DYNAMIC_ISLAND_BORDER_RADIUS = 14;
const BUTTON_INSET = -14;
const BUTTON_WIDTH = 4;
const BUTTON_RIGHT_TOP = 160;
const BUTTON_RIGHT_HEIGHT = 60;
const BUTTON_LEFT_1_TOP = 120;
const BUTTON_LEFT_1_HEIGHT = 40;
const BUTTON_LEFT_2_TOP = 175;
const BUTTON_LEFT_2_HEIGHT = 40;

// Caption
const CAPTION_BOTTOM = 60;
const CAPTION_FONT_SIZE = 18;

// ─── Types ────────────────────────────────────────────────────────────────────

type PhoneBadgeUpdateSceneProps = {
  position?: 'center' | 'left' | 'right';
  caption?: string;
  appIcon: string; // emoji
  fromCount?: number; // default 0
  toCount: number;
};

// ─── Component ────────────────────────────────────────────────────────────────

export const PhoneBadgeUpdateScene: React.FC<PhoneBadgeUpdateSceneProps> = ({
  position = 'center',
  caption,
  appIcon,
  fromCount = 0,
  toCount,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const xOffset =
    position === 'left'
      ? -POSITION_OFFSET
      : position === 'right'
      ? POSITION_OFFSET
      : 0;

  // ── Ambient flash ──
  const flashScale = interpolate(frame, [0, 8, 20], [0.8, 1.1, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const flashOpacity = interpolate(frame, [0, 4, 30], [0, 1, 0.3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Badge ──
  const badgeSpring = spring({
    frame: Math.max(0, frame - BADGE_SPRING_DELAY),
    fps,
    config: springBounce,
  });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.3, 1]);
  const badgeCount = frame < BADGE_SWITCH_FRAME ? (fromCount ?? 0) : toCount;

  // ── Caption ──
  const captionOpacity = interpolate(
    frame,
    [CAPTION_FADE_START, CAPTION_FADE_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* ── AMBIENT FLASH — behind phone ── */}
      <div
        style={{
          position: 'absolute',
          transform: `translateX(${xOffset}px)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            background: 'radial-gradient(ellipse, rgba(99,102,241,0.25) 0%, transparent 60%)',
            width: FLASH_SIZE,
            height: FLASH_SIZE,
            borderRadius: '50%',
            transform: `scale(${flashScale})`,
            opacity: flashOpacity,
          }}
        />
      </div>

      {/* ── PHONE SHELL ── */}
      <div style={{ position: 'relative', transform: `translateX(${xOffset}px)` }}>
        {/* Side buttons */}
        <div
          style={{
            position: 'absolute',
            right: BUTTON_INSET,
            top: BUTTON_RIGHT_TOP,
            width: BUTTON_WIDTH,
            height: BUTTON_RIGHT_HEIGHT,
            backgroundColor: SIDE_BUTTON_COLOR,
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: BUTTON_INSET,
            top: BUTTON_LEFT_1_TOP,
            width: BUTTON_WIDTH,
            height: BUTTON_LEFT_1_HEIGHT,
            backgroundColor: SIDE_BUTTON_COLOR,
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: BUTTON_INSET,
            top: BUTTON_LEFT_2_TOP,
            width: BUTTON_WIDTH,
            height: BUTTON_LEFT_2_HEIGHT,
            backgroundColor: SIDE_BUTTON_COLOR,
            borderRadius: 2,
          }}
        />

        {/* Phone body */}
        <div
          style={{
            width: PHONE_WIDTH,
            height: PHONE_HEIGHT,
            border: `10px solid ${theme.colors.text}`,
            borderRadius: PHONE_BORDER_RADIUS,
            backgroundColor: theme.colors.text,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0,0,0,0.22)',
          }}
        >
          {/* Dynamic island */}
          <div
            style={{
              position: 'absolute',
              top: DYNAMIC_ISLAND_TOP,
              left: '50%',
              transform: 'translateX(-50%)',
              width: DYNAMIC_ISLAND_WIDTH,
              height: DYNAMIC_ISLAND_HEIGHT,
              backgroundColor: DYNAMIC_ISLAND_COLOR,
              borderRadius: DYNAMIC_ISLAND_BORDER_RADIUS,
              zIndex: 10,
            }}
          />

          {/* Screen area */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: SCREEN_COLOR,
            }}
          />

          {/* ── INTERACTION LAYER ── */}

          {/* App icon + badge, centred on screen */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 20,
            }}
          >
            {/* Icon square */}
            <div
              style={{
                width: ICON_SIZE,
                height: ICON_SIZE,
                backgroundColor: theme.colors.accent,
                borderRadius: ICON_RADIUS,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: ICON_EMOJI_SIZE,
              }}
            >
              {appIcon}
            </div>

            {/* Badge */}
            <div
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                minWidth: BADGE_SIZE,
                height: BADGE_SIZE,
                backgroundColor: BADGE_COLOR,
                borderRadius: BADGE_RADIUS,
                color: '#fff',
                fontSize: 12,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                transform: `scale(${badgeScale})`,
                fontFamily: theme.font.body,
              }}
            >
              {badgeCount}
            </div>
          </div>
        </div>
      </div>

      {/* ── CAPTION ── */}
      {caption && (
        <div
          style={{
            position: 'absolute',
            bottom: CAPTION_BOTTOM,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            transform: `translateX(${xOffset}px)`,
            fontFamily: theme.font.body,
            fontSize: CAPTION_FONT_SIZE,
            color: theme.colors.textMuted,
            opacity: captionOpacity,
          }}
        >
          {caption}
        </div>
      )}
    </AbsoluteFill>
  );
};
