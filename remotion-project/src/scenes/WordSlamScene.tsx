import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springBounce } from '../hooks/useSceneAnimation';

const SLAM_DELAY = 0;
const SLAM_SIZE = 140;
const SLAM_WEIGHT = 900;
const SLAM_LETTER_SPACING = -4;

type WordSlamSceneProps = {
  word: string;
  dark?: boolean;
  bg?: string;
  size?: number;
};

export const WordSlamScene: React.FC<WordSlamSceneProps> = ({ word, dark, bg, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;
  const accentColor = theme.colors.accent;

  const slamSpring = spring({ frame: Math.max(0, frame - SLAM_DELAY), fps, config: springBounce });
  const scale = interpolate(slamSpring, [0, 1], [0.08, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = interpolate(frame, [0, 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

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
          fontSize: size ?? SLAM_SIZE,
          fontFamily: theme.font.display,
          fontWeight: SLAM_WEIGHT,
          letterSpacing: SLAM_LETTER_SPACING,
          color: textColor,
          transform: `scale(${scale})`,
          opacity,
        }}
      >
        {word}
      </div>
    </AbsoluteFill>
  );
};
