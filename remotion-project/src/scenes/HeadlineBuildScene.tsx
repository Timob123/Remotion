import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast } from '../hooks/useSceneAnimation';

const WORD_STAGGER = 6;
const HEADLINE_SIZE = 96;
const HEADLINE_WEIGHT = 700;
const HEADLINE_LETTER_SPACING = -2;
const WORD_START_Y = 40;

type HeadlineBuildSceneProps = {
  headline: string;
  dark?: boolean;
  bg?: string;
  size?: number;
};

export const HeadlineBuildScene: React.FC<HeadlineBuildSceneProps> = ({ headline, dark, bg, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;
  const accentColor = theme.colors.accent;

  const words = headline.split(' ');

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
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        {words.map((word, i) => {
          const wordDelay = i * WORD_STAGGER;
          const wordSpring = spring({ frame: Math.max(0, frame - wordDelay), fps, config: springFast });
          const wordY = interpolate(wordSpring, [0, 1], [WORD_START_Y, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const wordOpacity = interpolate(wordSpring, [0, 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                transform: `translateY(${wordY}px)`,
                opacity: wordOpacity,
                fontFamily: theme.font.display,
                fontSize: size ?? HEADLINE_SIZE,
                fontWeight: HEADLINE_WEIGHT,
                letterSpacing: HEADLINE_LETTER_SPACING,
                color: textColor,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
