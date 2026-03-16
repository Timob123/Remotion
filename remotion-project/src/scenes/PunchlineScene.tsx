import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springBounce } from '../hooks/useSceneAnimation';

const HEADLINE_SPRING_DELAY = 0;
const SUB_FADE_START = 18;
const SUB_FADE_END = 30;
const HEADLINE_SIZE = 120;
const HEADLINE_WEIGHT = 900;
const HEADLINE_LETTER_SPACING = -3;
const SUB_SIZE = 32;
const SUB_MARGIN_TOP = 24;

type PunchlineSceneProps = {
  headline: string;
  sub: string;
  dark?: boolean;
  bg?: string;
};

export const PunchlineScene: React.FC<PunchlineSceneProps> = ({ headline, sub, dark, bg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;
  const accentColor = theme.colors.accent;

  const headlineSpring = spring({ frame: Math.max(0, frame - HEADLINE_SPRING_DELAY), fps, config: springBounce });
  const headlineY = interpolate(headlineSpring, [0, 1], [50, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const headlineOpacity = interpolate(headlineSpring, [0, 0.3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subOpacity = interpolate(frame, [SUB_FADE_START, SUB_FADE_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

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
          transform: `translateY(${headlineY}px)`,
          opacity: headlineOpacity,
          fontSize: HEADLINE_SIZE,
          fontWeight: HEADLINE_WEIGHT,
          letterSpacing: HEADLINE_LETTER_SPACING,
          fontFamily: theme.font.display,
          color: textColor,
        }}
      >
        {headline}
      </div>
      <div
        style={{
          fontSize: SUB_SIZE,
          marginTop: SUB_MARGIN_TOP,
          opacity: subOpacity,
          color: theme.colors.textMuted,
          fontFamily: theme.font.display,
        }}
      >
        {sub}
      </div>
    </AbsoluteFill>
  );
};
