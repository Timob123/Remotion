import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast } from '../hooks/useSceneAnimation';

const LINE_STAGGER = 10;
const LINE_SLIDE_X = 80;
const LINE_SIZE = 64;
const LINE_WEIGHT = 700;
const LINE_LETTER_SPACING = -2;
const MAX_LINES = 3;

type StackBuildSceneProps = {
  lines: string[];
  dark?: boolean;
  bg?: string;
};

export const StackBuildScene: React.FC<StackBuildSceneProps> = ({ lines, dark, bg }) => {
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {lines.slice(0, MAX_LINES).map((line, i) => {
        const lineDelay = i * LINE_STAGGER;
        const lineSpring = spring({ frame: Math.max(0, frame - lineDelay), fps, config: springFast });
        const lineX = interpolate(lineSpring, [0, 1], [LINE_SLIDE_X, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const lineOpacity = interpolate(lineSpring, [0, 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

        return (
          <div
            key={i}
            style={{
              transform: `translateX(${lineX}px)`,
              opacity: lineOpacity,
              fontSize: LINE_SIZE,
              fontWeight: LINE_WEIGHT,
              letterSpacing: LINE_LETTER_SPACING,
              fontFamily: theme.font.display,
              color: textColor,
            }}
          >
            {line}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
