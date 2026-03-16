import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast } from '../hooks/useSceneAnimation';

// ─── Constants ────────────────────────────────────────────────────────────────

const PHONE_WIDTH = 400;
const PHONE_HEIGHT = 820;
const SIDE_BUTTON_COLOR = '#222';
const DYNAMIC_ISLAND_COLOR = '#000';
const SCREEN_COLOR = '#000000';
const POSITION_OFFSET = 320;
const CAPTION_FADE_START = 10;
const CAPTION_FADE_END = 25;
const STREAK_OPACITY_PEAK = 0.4;
const STREAK_FADE_START = 8;
const STREAK_PEAK = 30;
const STREAK_FADE_END = 50;
const GHOST_DELAY = 8;
const GHOST_TRAVEL = 320;
const GHOST_WIDTH = 300;
const GHOST_HEIGHT = 180;

// Phone shell layout constants
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

// Caption layout
const CAPTION_BOTTOM = 60;
const CAPTION_FONT_SIZE = 18;

// ─── Types ────────────────────────────────────────────────────────────────────

type PhoneSwipeSceneProps = {
  position?: 'center' | 'left' | 'right';
  caption?: string;
  direction?: 'left' | 'right';
};

// ─── Component ────────────────────────────────────────────────────────────────

export const PhoneSwipeScene: React.FC<PhoneSwipeSceneProps> = ({
  position = 'center',
  caption,
  direction = 'left',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const xOffset =
    position === 'left'
      ? -POSITION_OFFSET
      : position === 'right'
      ? POSITION_OFFSET
      : 0;

  // Ghost card spring + movement
  const ghostSpring = spring({ frame: Math.max(0, frame - GHOST_DELAY), fps, config: springFast });
  const ghostX = interpolate(ghostSpring, [0, 1], [0, direction === 'left' ? -GHOST_TRAVEL : GHOST_TRAVEL]);
  const ghostOpacity = interpolate(ghostSpring, [0, 0.3, 1], [1, 1, 0]);

  // Streak opacity (shared across all 3 streaks)
  const streakOpacity = interpolate(
    frame,
    [STREAK_FADE_START, STREAK_PEAK, STREAK_FADE_END],
    [0, STREAK_OPACITY_PEAK, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Streak container offset from phone centre
  // direction === 'left' means content exits left → energy trails on RIGHT side
  const streakSideOffset =
    direction === 'left'
      ? PHONE_WIDTH / 2 + 20
      : -(PHONE_WIDTH / 2 + 20);

  // Caption fade-in
  const captionOpacity = interpolate(
    frame,
    [CAPTION_FADE_START, CAPTION_FADE_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const streakWidths = [80, 60, 40];
  const streakTops = [-20, 0, 20];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
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

          {/* ── INTERACTION LAYER — ghost card ── */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginLeft: -GHOST_WIDTH / 2,
              width: GHOST_WIDTH,
              height: GHOST_HEIGHT,
              backgroundColor: 'rgba(255,255,255,0.06)',
              borderRadius: 12,
              transform: `translateY(-50%) translateX(${ghostX}px)`,
              opacity: ghostOpacity,
              zIndex: 20,
            }}
          />
        </div>

        {/* ── AMBIENT STREAKS — beside phone ── */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translateX(${streakSideOffset + xOffset}px) translateY(-50%)`,
            pointerEvents: 'none',
            zIndex: 5,
          }}
        >
          {streakWidths.map((width, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: streakTops[i],
                left: direction === 'left' ? 0 : -width,
                width,
                height: 2,
                backgroundColor: theme.colors.accent,
                opacity: streakOpacity,
                borderRadius: 1,
              }}
            />
          ))}
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
