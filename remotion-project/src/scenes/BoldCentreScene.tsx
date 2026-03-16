import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springBounce } from '../hooks/useSceneAnimation';

const GLOW_OPACITY = 0.12;
const GLOW_SIZE = 800;
const ENTRY_SCALE_START = 0.6;
const WORD_SIZE = 160;
const WORD_WEIGHT = 900;
const WORD_LETTER_SPACING = -5;

type BoldCentreSceneProps = {
  word: string;
  dark?: boolean;
  bg?: string;
};

export const BoldCentreScene: React.FC<BoldCentreSceneProps> = ({ word, dark, bg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;
  const accentColor = theme.colors.accent;

  const entrySpring = spring({ frame, fps, config: springBounce });
  const scale = interpolate(entrySpring, [0, 1], [ENTRY_SCALE_START, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(entrySpring, [0, 0.3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const glowOpacity = interpolate(entrySpring, [0, 1], [0, GLOW_OPACITY], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

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
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: GLOW_SIZE,
          height: GLOW_SIZE,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${accentColor} 0%, transparent 70%)`,
          opacity: glowOpacity,
        }}
      />
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          fontSize: WORD_SIZE,
          fontWeight: WORD_WEIGHT,
          letterSpacing: WORD_LETTER_SPACING,
          fontFamily: theme.font.display,
          color: textColor,
          position: 'relative',
        }}
      >
        {word}
      </div>
    </AbsoluteFill>
  );
};
