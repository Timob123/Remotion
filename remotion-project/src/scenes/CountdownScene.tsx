import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springBounce } from '../hooks/useSceneAnimation';

const FRAMES_PER_NUMBER = 20;
const NUMBER_SIZE = 200;
const NUMBER_WEIGHT = 900;
const NUMBER_LETTER_SPACING = -6;
const SLAM_SCALE_START = 1.4;

type CountdownSceneProps = {
  from?: number;
  dark?: boolean;
  bg?: string;
};

export const CountdownScene: React.FC<CountdownSceneProps> = ({ from, dark, bg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;
  const accentColor = theme.colors.accent;

  const totalNumbers = from ?? 3;
  const currentIndex = Math.min(Math.floor(frame / FRAMES_PER_NUMBER), totalNumbers - 1);
  const stepFrame = frame % FRAMES_PER_NUMBER;
  const currentNumber = totalNumbers - currentIndex;

  const numSpring = spring({ frame: stepFrame, fps, config: springBounce });
  const numScale = interpolate(numSpring, [0, 1], [SLAM_SCALE_START, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const numOpacity = interpolate(stepFrame, [0, 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

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
          fontSize: NUMBER_SIZE,
          fontWeight: NUMBER_WEIGHT,
          fontFamily: theme.font.display,
          letterSpacing: NUMBER_LETTER_SPACING,
          color: textColor,
          transform: `scale(${numScale})`,
          opacity: numOpacity,
        }}
      >
        {currentNumber}
      </div>
    </AbsoluteFill>
  );
};
