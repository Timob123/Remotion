import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast } from '../hooks/useSceneAnimation';

const WORD_STAGGER = 8;
const SWEEP_DISTANCE = 200;
const WORD_SIZE = 80;
const WORD_WEIGHT = 700;
const WORD_LETTER_SPACING = -2;
const MAX_WORDS = 4;
const CONTAINER_MAX_WIDTH = 1200;
const CONTAINER_PADDING_X = 80;

type WordSweepSceneProps = {
  words: string[];
  dark?: boolean;
  bg?: string;
};

export const WordSweepScene: React.FC<WordSweepSceneProps> = ({ words, dark, bg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;
  const accentColor = theme.colors.accent;

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
          maxWidth: CONTAINER_MAX_WIDTH,
          width: '100%',
          margin: '0 auto',
          padding: `0 ${CONTAINER_PADDING_X}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        {words.slice(0, MAX_WORDS).map((word, i) => {
          const wordDelay = i * WORD_STAGGER;
          const wordSpring = spring({ frame: Math.max(0, frame - wordDelay), fps, config: springFast });
          const wordX = interpolate(wordSpring, [0, 1], [SWEEP_DISTANCE, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const wordOpacity = interpolate(wordSpring, [0, 0.3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

          return (
            <div
              key={i}
              style={{
                fontSize: WORD_SIZE,
                fontWeight: WORD_WEIGHT,
                fontFamily: theme.font.display,
                letterSpacing: WORD_LETTER_SPACING,
                color: textColor,
                transform: `translateX(${wordX}px)`,
                opacity: wordOpacity,
              }}
            >
              {word}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
