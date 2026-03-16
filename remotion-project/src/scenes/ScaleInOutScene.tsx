import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast } from '../hooks/useSceneAnimation';

const SCALE_START_FACTOR = 4;
const SCALE_SIZE = 140;
const SCALE_WEIGHT = 900;
const SCALE_LETTER_SPACING = -4;

type ScaleInOutSceneProps = {
  word: string;
  dark?: boolean;
  bg?: string;
  size?: number;
};

export const ScaleInOutScene: React.FC<ScaleInOutSceneProps> = ({ word, dark, bg, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;
  const accentColor = theme.colors.accent;

  const scaleSpring = spring({ frame, fps, config: springFast });
  const scale = interpolate(scaleSpring, [0, 1], [SCALE_START_FACTOR, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

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
          fontSize: size ?? SCALE_SIZE,
          fontFamily: theme.font.display,
          fontWeight: SCALE_WEIGHT,
          letterSpacing: SCALE_LETTER_SPACING,
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
