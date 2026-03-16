import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { springFast } from '../hooks/useSceneAnimation';

// Phone shell
const PHONE_WIDTH = 400;
const PHONE_HEIGHT = 820;
const SIDE_BUTTON_COLOR = '#222';
const DYNAMIC_ISLAND_COLOR = '#000';
const SCREEN_COLOR = '#000000';
const POSITION_OFFSET = 320;
const CAPTION_FADE_START = 10;
const CAPTION_FADE_END = 25;

// Ambient
const GLOW_SIZE = 700;
const RING_SIZE = 500;
const GLOW_COLOR = 'rgba(148,163,184,0.12)';
const RING_BORDER_COLOR = 'rgba(148,163,184,0.08)';

// Lock screen content
const TIME_FADE_DELAY = 8;
const DATE_FADE_DELAY = 14;
const NOTIF_DELAY = 20;
const NOTIF_SLIDE_DISTANCE = 20;
const TIME_FONT_SIZE = 72;
const DATE_FONT_SIZE = 16;
const LOCK_EMOJI_SIZE = 24;
const NOTIF_FONT_SIZE = 14;
const SCREEN_TEXT_COLOR = '#fff';
const SCREEN_MUTED_COLOR = '#D1D5DB';

type PhoneLockScreenSceneProps = {
  position?: 'center' | 'left' | 'right';
  caption?: string;
  time?: string;
  date?: string;
  notificationText?: string;
};

export const PhoneLockScreenScene: React.FC<PhoneLockScreenSceneProps> = ({
  position = 'center',
  caption,
  time = '9:41',
  date = 'Saturday, March 14',
  notificationText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const xOffset =
    position === 'left'
      ? -POSITION_OFFSET
      : position === 'right'
      ? POSITION_OFFSET
      : 0;

  // Caption fade
  const captionOpacity = interpolate(
    frame,
    [CAPTION_FADE_START, CAPTION_FADE_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Lock emoji fade
  const lockOpacity = interpolate(
    frame,
    [TIME_FADE_DELAY - 4, TIME_FADE_DELAY + 8],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Time fade
  const timeOpacity = interpolate(
    frame,
    [TIME_FADE_DELAY, TIME_FADE_DELAY + 12],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Date fade
  const dateOpacity = interpolate(
    frame,
    [DATE_FADE_DELAY, DATE_FADE_DELAY + 12],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Notification slide
  const notifProgress = spring({
    frame: Math.max(0, frame - NOTIF_DELAY),
    fps,
    config: springFast,
  });
  const notifTranslateY = interpolate(notifProgress, [0, 1], [NOTIF_SLIDE_DISTANCE, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const notifOpacity = interpolate(notifProgress, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: theme.colors.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow — behind phone, shifted by xOffset */}
      <div
        style={{
          position: 'absolute',
          width: GLOW_SIZE,
          height: GLOW_SIZE,
          background: `radial-gradient(ellipse, ${GLOW_COLOR} 0%, transparent 65%)`,
          borderRadius: '50%',
          transform: `translateX(${xOffset}px)`,
          pointerEvents: 'none',
        }}
      />
      {/* Inner ring */}
      <div
        style={{
          position: 'absolute',
          width: RING_SIZE,
          height: RING_SIZE,
          border: `1px solid ${RING_BORDER_COLOR}`,
          borderRadius: '50%',
          transform: `translateX(${xOffset}px)`,
          pointerEvents: 'none',
        }}
      />

      {/* Phone shell */}
      <div
        style={{
          position: 'relative',
          width: PHONE_WIDTH,
          height: PHONE_HEIGHT,
          border: `10px solid ${theme.colors.text}`,
          borderRadius: 48,
          backgroundColor: theme.colors.text,
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.22)',
          transform: `translateX(${xOffset}px)`,
        }}
      >
        {/* Screen */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: SCREEN_COLOR,
          }}
        />

        {/* Dynamic island */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 90,
            height: 28,
            backgroundColor: DYNAMIC_ISLAND_COLOR,
            borderRadius: 14,
            zIndex: 10,
          }}
        />

        {/* Lock screen content */}

        {/* Lock emoji */}
        <div
          style={{
            position: 'absolute',
            top: 130,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            fontSize: LOCK_EMOJI_SIZE,
            color: SCREEN_TEXT_COLOR,
            opacity: lockOpacity,
          }}
        >
          🔒
        </div>

        {/* Time */}
        <div
          style={{
            position: 'absolute',
            top: 170,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            fontSize: TIME_FONT_SIZE,
            fontFamily: theme.font.display,
            fontWeight: 700,
            color: SCREEN_TEXT_COLOR,
            letterSpacing: -1,
            opacity: timeOpacity,
          }}
        >
          {time}
        </div>

        {/* Date */}
        <div
          style={{
            position: 'absolute',
            top: 255,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            fontSize: DATE_FONT_SIZE,
            color: SCREEN_MUTED_COLOR,
            fontFamily: theme.font.body,
            opacity: dateOpacity,
          }}
        >
          {date}
        </div>

        {/* Notification card */}
        {notificationText && (
          <div
            style={{
              position: 'absolute',
              bottom: 200,
              left: 16,
              right: 16,
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderRadius: 16,
              padding: 16,
              transform: `translateY(${notifTranslateY}px)`,
              opacity: notifOpacity,
            }}
          >
            <div
              style={{
                fontSize: NOTIF_FONT_SIZE,
                color: SCREEN_TEXT_COLOR,
                fontFamily: theme.font.body,
              }}
            >
              {notificationText}
            </div>
          </div>
        )}
      </div>

      {/* Side buttons — right */}
      <div
        style={{
          position: 'absolute',
          right: `calc(50% - ${PHONE_WIDTH / 2 + xOffset + 14}px)`,
          top: `calc(50% - ${PHONE_HEIGHT / 2 - 160}px)`,
          width: 4,
          height: 60,
          backgroundColor: SIDE_BUTTON_COLOR,
          borderRadius: 2,
        }}
      />

      {/* Side buttons — left top */}
      <div
        style={{
          position: 'absolute',
          left: `calc(50% - ${PHONE_WIDTH / 2 - xOffset + 14}px)`,
          top: `calc(50% - ${PHONE_HEIGHT / 2 - 120}px)`,
          width: 4,
          height: 40,
          backgroundColor: SIDE_BUTTON_COLOR,
          borderRadius: 2,
        }}
      />

      {/* Side buttons — left bottom */}
      <div
        style={{
          position: 'absolute',
          left: `calc(50% - ${PHONE_WIDTH / 2 - xOffset + 14}px)`,
          top: `calc(50% - ${PHONE_HEIGHT / 2 - 175}px)`,
          width: 4,
          height: 40,
          backgroundColor: SIDE_BUTTON_COLOR,
          borderRadius: 2,
        }}
      />

      {/* Caption */}
      {caption && (
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            left: '50%',
            transform: `translateX(calc(-50% + ${xOffset}px))`,
            fontFamily: theme.font.body,
            fontSize: 18,
            color: theme.colors.textMuted,
            opacity: captionOpacity,
            whiteSpace: 'nowrap',
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
};
