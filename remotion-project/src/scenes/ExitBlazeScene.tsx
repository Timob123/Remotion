import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast } from '../hooks/useSceneAnimation';

const ENTRY_END = 20;
const HOLD_END = 38;
const EXIT_START = 40;
const EXIT_END = 55;
const EXIT_TRAVEL = -1200;
const TEXT_SIZE = 96;
const TEXT_WEIGHT = 700;
const TEXT_LETTER_SPACING = -2;
const SUBTEXT_DELAY = 14;
const SUBTEXT_SIZE = 28;
const SUBTEXT_MARGIN_TOP = 16;

type ExitBlazeSceneProps = {
  text: string;
  subtext?: string;
  dark?: boolean;
  bg?: string;
};

export const ExitBlazeScene: React.FC<ExitBlazeSceneProps> = ({ text, subtext, dark, bg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;
  const accentColor = theme.colors.accent;

  const entrySpring = spring({ frame, fps, config: springFast });
  const entryY = interpolate(entrySpring, [0, 1], [60, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const entryOpacity = interpolate(entrySpring, [0, 0.4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const exitY = interpolate(frame, [EXIT_START, EXIT_END], [0, EXIT_TRAVEL], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitOpacity = interpolate(frame, [EXIT_START, EXIT_START + 8], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateY = frame < EXIT_START ? entryY : exitY;
  const opacity = frame < EXIT_START ? entryOpacity : exitOpacity;

  const subtextOpacity = interpolate(
    frame,
    [SUBTEXT_DELAY, SUBTEXT_DELAY + 12],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

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
          flexDirection: 'column',
          alignItems: 'center',
          transform: `translateY(${translateY}px)`,
          opacity,
        }}
      >
        <div
          style={{
            fontSize: TEXT_SIZE,
            fontWeight: TEXT_WEIGHT,
            letterSpacing: TEXT_LETTER_SPACING,
            fontFamily: theme.font.display,
            color: textColor,
          }}
        >
          {text}
        </div>
        {subtext && (
          <div
            style={{
              fontSize: SUBTEXT_SIZE,
              color: theme.colors.textMuted,
              opacity: subtextOpacity,
              fontFamily: theme.font.display,
              marginTop: SUBTEXT_MARGIN_TOP,
            }}
          >
            {subtext}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
