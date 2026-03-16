import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast } from '../hooks/useSceneAnimation';

// Layout constants
const PHONE_WIDTH = 400;
const PHONE_HEIGHT = 820;
const POSITION_OFFSET = 320;

// Phone shell constants
const PHONE_BORDER_RADIUS = 48;
const DYNAMIC_ISLAND_WIDTH = 90;
const DYNAMIC_ISLAND_HEIGHT = 28;
const DYNAMIC_ISLAND_TOP = 14;
const DYNAMIC_ISLAND_BORDER_RADIUS = 14;
const BUTTON_RIGHT_TOP = 160;
const BUTTON_RIGHT_HEIGHT = 60;
const BUTTON_LEFT_1_TOP = 120;
const BUTTON_LEFT_1_HEIGHT = 40;
const BUTTON_LEFT_2_TOP = 175;
const BUTTON_LEFT_2_HEIGHT = 40;
const BUTTON_INSET = -14;
const BUTTON_WIDTH = 4;

// Ambient glow constants
const GLOW_SIZE = 700;
const GLOW_PULSE_FREQ = 0.08;
const GLOW_PULSE_AMP = 0.3;
const GLOW_PULSE_BASE = 0.7;

// Contact name label constants
const CONTACT_BOTTOM = 140;
const CONTACT_LEFT = 20;
const CONTACT_FONT_SIZE = 12;
const CONTACT_FADE_START = 5;
const CONTACT_FADE_END = 18;

// Chat bubble constants
const BUBBLE_BOTTOM = 80;
const BUBBLE_LEFT = 20;
const BUBBLE_BORDER_RADIUS = 20;
const BUBBLE_SPRING_DELAY = 10;
const BUBBLE_TRANSLATE_Y_FROM = 40;
const BUBBLE_TRANSLATE_Y_TO = 0;
const BUBBLE_PADDING = '12px 18px';

// Typing dots constants
const DOT_SIZE = 10;
const DOT_BORDER_RADIUS = '50%';
const DOT_GAP = 6;
const DOT_FREQ = 0.15;
const DOT_STAGGER = 1.2;
const DOT_AMP = 0.4;
const DOT_BASE = 0.6;

// Caption constants
const CAPTION_BOTTOM = 60;
const CAPTION_FONT_SIZE = 18;
const CAPTION_FADE_START = 10;
const CAPTION_FADE_END = 25;

type PhoneTypingSceneProps = {
  position?: 'center' | 'left' | 'right';
  caption?: string;
  contactName?: string;
};

export const PhoneTypingScene: React.FC<PhoneTypingSceneProps> = ({
  position = 'center',
  caption,
  contactName = 'Sarah',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const xOffset = position === 'left' ? -POSITION_OFFSET : position === 'right' ? POSITION_OFFSET : 0;

  // Ambient glow opacity pulse
  const glowOpacity = Math.sin(frame * GLOW_PULSE_FREQ) * GLOW_PULSE_AMP + GLOW_PULSE_BASE;

  // Contact name fade-in
  const contactOpacity = interpolate(frame, [CONTACT_FADE_START, CONTACT_FADE_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Chat bubble slide-up spring
  const bubbleSpring = spring({ frame: Math.max(0, frame - BUBBLE_SPRING_DELAY), fps, config: springFast });
  const bubbleTranslateY = interpolate(bubbleSpring, [0, 1], [BUBBLE_TRANSLATE_Y_FROM, BUBBLE_TRANSLATE_Y_TO]);

  // Caption fade-in
  const captionOpacity = interpolate(frame, [CAPTION_FADE_START, CAPTION_FADE_END], [0, 1], {
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
      {/* AMBIENT GLOW — behind the phone */}
      <div
        style={{
          position: 'absolute',
          width: GLOW_SIZE,
          height: GLOW_SIZE,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(251,191,36,0.18) 0%, transparent 70%)',
          opacity: glowOpacity,
          transform: `translateX(${xOffset}px)`,
          pointerEvents: 'none',
        }}
      />

      {/* PHONE SHELL */}
      <div style={{ position: 'relative', transform: `translateX(${xOffset}px)` }}>
        {/* Side buttons */}
        <div
          style={{
            position: 'absolute',
            right: BUTTON_INSET,
            top: BUTTON_RIGHT_TOP,
            width: BUTTON_WIDTH,
            height: BUTTON_RIGHT_HEIGHT,
            backgroundColor: '#222',
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
            backgroundColor: '#222',
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
            backgroundColor: '#222',
            borderRadius: 2,
          }}
        />

        {/* Phone shell body */}
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
              backgroundColor: '#000',
              borderRadius: DYNAMIC_ISLAND_BORDER_RADIUS,
              zIndex: 10,
            }}
          />

          {/* Screen area */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#000000',
            }}
          />

          {/* INTERACTION LAYER */}
          {/* Contact name label */}
          <div
            style={{
              position: 'absolute',
              bottom: CONTACT_BOTTOM,
              left: CONTACT_LEFT,
              fontSize: CONTACT_FONT_SIZE,
              color: 'rgba(255,255,255,0.5)',
              fontFamily: theme.font.body,
              opacity: contactOpacity,
              zIndex: 20,
            }}
          >
            {contactName}
          </div>

          {/* Chat bubble with typing dots */}
          <div
            style={{
              position: 'absolute',
              bottom: BUBBLE_BOTTOM,
              left: BUBBLE_LEFT,
              backgroundColor: theme.colors.surface,
              borderRadius: BUBBLE_BORDER_RADIUS,
              padding: BUBBLE_PADDING,
              boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
              transform: `translateY(${bubbleTranslateY}px)`,
              zIndex: 20,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: DOT_GAP,
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: DOT_SIZE,
                  height: DOT_SIZE,
                  backgroundColor: theme.colors.textMuted,
                  borderRadius: DOT_BORDER_RADIUS,
                  opacity: Math.sin(frame * DOT_FREQ + i * DOT_STAGGER) * DOT_AMP + DOT_BASE,
                }}
              />
            ))}
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
