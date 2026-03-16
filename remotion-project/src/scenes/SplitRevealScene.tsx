import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';

const SPLIT_TRAVEL = 60;
const SPLIT_START = 0;
const SPLIT_PEAK = 15;
const SPLIT_RETURN = 35;
const TEXT_SIZE = 120;
const TEXT_WEIGHT = 900;
const TEXT_LETTER_SPACING = -3;

type SplitRevealSceneProps = {
  text: string;
  dark?: boolean;
  bg?: string;
};

export const SplitRevealScene: React.FC<SplitRevealSceneProps> = ({ text, dark, bg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;
  const splitProgress = interpolate(
    frame,
    [SPLIT_START, SPLIT_PEAK, SPLIT_RETURN],
    [0, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const topY = interpolate(splitProgress, [0, 1], [0, -SPLIT_TRAVEL], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const bottomY = interpolate(splitProgress, [0, 1], [0, SPLIT_TRAVEL], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const textStyle: React.CSSProperties = {
    fontSize: TEXT_SIZE,
    fontWeight: TEXT_WEIGHT,
    letterSpacing: TEXT_LETTER_SPACING,
    fontFamily: theme.font.display,
    color: textColor,
    position: 'absolute',
    whiteSpace: 'nowrap',
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ position: 'relative' }}>
        <div
          style={{
            ...textStyle,
            overflow: 'hidden',
            clipPath: 'inset(0 0 50% 0)',
            transform: `translateY(${topY}px)`,
          }}
        >
          {text}
        </div>
        <div
          style={{
            ...textStyle,
            overflow: 'hidden',
            clipPath: 'inset(50% 0 0 0)',
            transform: `translateY(${bottomY}px)`,
          }}
        >
          {text}
        </div>
        {/* Invisible spacer to give the relative container correct dimensions */}
        <div
          style={{
            ...textStyle,
            position: 'relative',
            visibility: 'hidden',
          }}
        >
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};
