import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springBounce } from '../hooks/useSceneAnimation';

const FLASH_PEAK = 4;
const FLASH_FADE_END = 16;
const TEXT_SPRING_DELAY = 6;
const TEXT_SIZE = 96;
const TEXT_WEIGHT = 700;
const SUBTEXT_DELAY = 20;
const SUBTEXT_SIZE = 28;
const SUBTEXT_FADE_DURATION = 12;
const TEXT_SCALE_START = 0.85;

type FlashCutSceneProps = {
  text: string;
  subtext?: string;
  dark?: boolean;
  bg?: string;
};

export const FlashCutScene: React.FC<FlashCutSceneProps> = ({ text, subtext, dark, bg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;
  const accentColor = theme.colors.accent;

  const flashColor = theme.colors.bg;

  const flashOpacity = interpolate(frame, [0, FLASH_PEAK, FLASH_FADE_END], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const textSpring = spring({ frame: Math.max(0, frame - TEXT_SPRING_DELAY), fps, config: springBounce });
  const textScale = interpolate(textSpring, [0, 1], [TEXT_SCALE_START, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const textOpacity = interpolate(textSpring, [0, 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subtextOpacity = interpolate(frame, [SUBTEXT_DELAY, SUBTEXT_DELAY + SUBTEXT_FADE_DURATION], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

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
          position: 'absolute',
          inset: 0,
          backgroundColor: flashColor,
          opacity: flashOpacity,
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontSize: TEXT_SIZE,
            fontWeight: TEXT_WEIGHT,
            fontFamily: theme.font.display,
            color: textColor,
            transform: `scale(${textScale})`,
            opacity: textOpacity,
          }}
        >
          {text}
        </div>
        {subtext && (
          <div
            style={{
              fontSize: SUBTEXT_SIZE,
              color: theme.colors.textMuted,
              opacity: subtextOpacity,
              fontFamily: theme.font.display,
              marginTop: 16,
            }}
          >
            {subtext}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
