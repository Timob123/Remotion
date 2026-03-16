import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springBounce } from '../hooks/useSceneAnimation';

const SIDE_BUTTON_COLOR = '#222';
const DYNAMIC_ISLAND_COLOR = '#000';
const APP_NAME_COLOR = '#fff';
const SCREEN_COLOR = '#000000';

type PhoneAppOpenSceneProps = {
  position?: 'center' | 'left' | 'right';
  caption?: string;
  appIcon: string;
  appName: string;
};

export const PhoneAppOpenScene: React.FC<PhoneAppOpenSceneProps> = ({
  position = 'center',
  caption,
  appIcon,
  appName,
}) => {
  const PHONE_WIDTH = 400;
  const PHONE_HEIGHT = 820;
  const POSITION_OFFSET = 320;
  const DYNAMIC_ISLAND_WIDTH = 90;
  const DYNAMIC_ISLAND_HEIGHT = 28;
  const DYNAMIC_ISLAND_TOP = 14;
  const DYNAMIC_ISLAND_RADIUS = 14;
  const PHONE_BORDER_RADIUS = 48;
  const SIDE_BUTTON_RIGHT = -14;
  const SIDE_BUTTON_LEFT = -14;
  const SIDE_BUTTON_RIGHT_TOP = 160;
  const SIDE_BUTTON_RIGHT_HEIGHT = 60;
  const SIDE_BUTTON_LEFT1_TOP = 120;
  const SIDE_BUTTON_LEFT1_HEIGHT = 40;
  const SIDE_BUTTON_LEFT2_TOP = 175;
  const SIDE_BUTTON_LEFT2_HEIGHT = 40;
  const SIDE_BUTTON_WIDTH = 4;
  const LINE_COUNT = 8;
  const LINE_WIDTH = 2;
  const LINE_HEIGHT = 120;
  const LINE_TRANSLATE_Y_PX = 80;
  const LINE_OPACITY_START = 0.6;
  const LINE_FADE_END = 20;
  const ICON_SIZE = 80;
  const ICON_BORDER_RADIUS = 20;
  const ICON_FONT_SIZE = 40;
  const ICON_DELAY = 4;
  const ICON_OPACITY_END = 16;
  const APP_NAME_FONT_SIZE = 14;
  const APP_NAME_MARGIN_TOP = 8;
  const CAPTION_FADE_START = 10;
  const CAPTION_FADE_END = 25;
  const CAPTION_BOTTOM = 60;
  const CAPTION_FONT_SIZE = 18;
  const ICON_SCALE_MIN = 0.4;

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const xOffset = position === 'left' ? -POSITION_OFFSET : position === 'right' ? POSITION_OFFSET : 0;

  // Ambient radial lines opacity
  const lineOpacity = interpolate(frame, [0, LINE_FADE_END], [LINE_OPACITY_START, 0], {
    extrapolateRight: 'clamp',
  });

  // Icon scale spring
  const iconSpringProgress = spring({ frame: Math.max(0, frame - ICON_DELAY), fps, config: springBounce });
  const iconScale = interpolate(iconSpringProgress, [0, 1], [ICON_SCALE_MIN, 1]);

  // Icon opacity
  const iconOpacity = interpolate(frame, [ICON_DELAY, ICON_OPACITY_END], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Caption opacity
  const captionOpacity = interpolate(frame, [CAPTION_FADE_START, CAPTION_FADE_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* AMBIENT EFFECT — radial burst of lines behind phone */}
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
        <div style={{ position: 'relative', width: 0, height: 0 }}>
          {Array.from({ length: LINE_COUNT }, (_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: LINE_WIDTH,
                height: LINE_HEIGHT,
                backgroundColor: theme.colors.accent,
                transformOrigin: 'bottom center',
                transform: `rotate(${i * 45}deg) translateY(-${LINE_TRANSLATE_Y_PX}px)`,
                opacity: lineOpacity,
              }}
            />
          ))}
        </div>
      </div>

      {/* PHONE SHELL */}
      <div style={{ position: 'relative', transform: `translateX(${xOffset}px)` }}>
        {/* Side buttons */}
        <div
          style={{
            position: 'absolute',
            right: SIDE_BUTTON_RIGHT,
            top: SIDE_BUTTON_RIGHT_TOP,
            width: SIDE_BUTTON_WIDTH,
            height: SIDE_BUTTON_RIGHT_HEIGHT,
            backgroundColor: SIDE_BUTTON_COLOR,
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: SIDE_BUTTON_LEFT,
            top: SIDE_BUTTON_LEFT1_TOP,
            width: SIDE_BUTTON_WIDTH,
            height: SIDE_BUTTON_LEFT1_HEIGHT,
            backgroundColor: SIDE_BUTTON_COLOR,
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: SIDE_BUTTON_LEFT,
            top: SIDE_BUTTON_LEFT2_TOP,
            width: SIDE_BUTTON_WIDTH,
            height: SIDE_BUTTON_LEFT2_HEIGHT,
            backgroundColor: SIDE_BUTTON_COLOR,
            borderRadius: 2,
          }}
        />

        {/* Shell */}
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
              borderRadius: DYNAMIC_ISLAND_RADIUS,
              zIndex: 10,
            }}
          />

          {/* Screen area */}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: SCREEN_COLOR }} />

          {/* INTERACTION LAYER — app icon centred on screen */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) scale(${iconScale})`,
              opacity: iconOpacity,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 20,
            }}
          >
            {/* Icon square */}
            <div
              style={{
                width: ICON_SIZE,
                height: ICON_SIZE,
                backgroundColor: theme.colors.accent,
                borderRadius: ICON_BORDER_RADIUS,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: ICON_FONT_SIZE,
              }}
            >
              {appIcon}
            </div>
            {/* App name */}
            <div
              style={{
                color: APP_NAME_COLOR,
                fontSize: APP_NAME_FONT_SIZE,
                fontFamily: theme.font.body,
                textAlign: 'center',
                marginTop: APP_NAME_MARGIN_TOP,
              }}
            >
              {appName}
            </div>
          </div>
        </div>
      </div>

      {/* CAPTION */}
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
