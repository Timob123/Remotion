import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../config/theme';

const BLUR_START_PX = 20;
const BLUR_END_FRAME = 25;
const FOCUS_SIZE = 120;
const FOCUS_WEIGHT = 700;
const FOCUS_LETTER_SPACING = -3;
const SUBTEXT_DELAY = 28;
const SUBTEXT_SIZE = 24;
const SUBTEXT_FADE_DURATION = 12;

type WordFocusSceneProps = {
  word: string;
  subtext?: string;
  dark?: boolean;
  bg?: string;
};

export const WordFocusScene: React.FC<WordFocusSceneProps> = ({ word, subtext, dark, bg }) => {
  const frame = useCurrentFrame();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;
  const accentColor = theme.colors.accent;

  const blurPx = interpolate(frame, [0, BLUR_END_FRAME], [BLUR_START_PX, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subtextOpacity = interpolate(frame, [SUBTEXT_DELAY, SUBTEXT_DELAY + SUBTEXT_FADE_DURATION], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          filter: `blur(${blurPx}px)`,
          opacity,
          fontSize: FOCUS_SIZE,
          fontWeight: FOCUS_WEIGHT,
          fontFamily: theme.font.display,
          letterSpacing: FOCUS_LETTER_SPACING,
          color: textColor,
        }}
      >
        {word}
      </div>
      {subtext && (
        <div
          style={{
            fontSize: SUBTEXT_SIZE,
            color: theme.colors.textMuted,
            opacity: subtextOpacity,
            marginTop: 16,
            fontFamily: theme.font.display,
          }}
        >
          {subtext}
        </div>
      )}
    </AbsoluteFill>
  );
};
