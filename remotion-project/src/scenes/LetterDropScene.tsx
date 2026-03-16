import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast, springBounce } from '../hooks/useSceneAnimation';

const LETTER_STAGGER = 3;
const LETTER_SIZE = 140;
const LETTER_WEIGHT = 900;
const LETTER_DROP_DISTANCE = -120;
const LETTER_SPACING_PX = -4;

type LetterDropSceneProps = {
  word: string;
  dark?: boolean;
  bg?: string;
  size?: number;
};

export const LetterDropScene: React.FC<LetterDropSceneProps> = ({ word, dark, bg, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;
  const accentColor = theme.colors.accent;

  const chars = [...word];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      }}
    >
      {chars.map((char, i) => {
        const letterDelay = i * LETTER_STAGGER;
        const letterSpring = spring({
          frame: Math.max(0, frame - letterDelay),
          fps,
          config: springBounce,
        });
        const letterY = interpolate(letterSpring, [0, 1], [LETTER_DROP_DISTANCE, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const letterOpacity = interpolate(letterSpring, [0, 0.3], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: `translateY(${letterY}px)`,
              opacity: letterOpacity,
              fontSize: size ?? LETTER_SIZE,
              fontWeight: LETTER_WEIGHT,
              letterSpacing: LETTER_SPACING_PX,
              fontFamily: theme.font.display,
              color: textColor,
            }}
          >
            {char}
          </span>
        );
      })}
    </AbsoluteFill>
  );
};
