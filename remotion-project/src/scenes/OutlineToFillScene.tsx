import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast } from '../hooks/useSceneAnimation';

const OUTLINE_PHASE_END = 20;
const FILL_PHASE_START = 20;
const FILL_PHASE_END = 35;
const WORD_SIZE = 140;
const WORD_WEIGHT = 900;
const STROKE_WIDTH = 2;
const LETTER_SPACING = -4;

type OutlineToFillSceneProps = {
  word: string;
  dark?: boolean;
  bg?: string;
};

export const OutlineToFillScene: React.FC<OutlineToFillSceneProps> = ({ word, dark, bg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;
  const accentColor = theme.colors.accent;

  const entrySpring = spring({ frame, fps, config: springFast });
  const scale = interpolate(entrySpring, [0, 1], [0.7, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fillOpacity = interpolate(frame, [FILL_PHASE_START, FILL_PHASE_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const outlineOpacity = interpolate(frame, [OUTLINE_PHASE_END, FILL_PHASE_END], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const sharedTextStyle: React.CSSProperties = {
    fontSize: WORD_SIZE,
    fontWeight: WORD_WEIGHT,
    fontFamily: theme.font.display,
    letterSpacing: LETTER_SPACING,
    position: 'absolute',
    top: 0,
    left: 0,
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
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          transform: `scale(${scale})`,
        }}
      >
        {/* Outline layer */}
        <div
          style={{
            ...sharedTextStyle,
            color: 'transparent',
            WebkitTextStroke: `${STROKE_WIDTH}px ${textColor}`,
            opacity: outlineOpacity,
          }}
        >
          {word}
        </div>
        {/* Fill layer */}
        <div
          style={{
            ...sharedTextStyle,
            color: textColor,
            opacity: fillOpacity,
          }}
        >
          {word}
        </div>
        {/* Hidden spacer to give container natural size */}
        <div
          style={{
            fontSize: WORD_SIZE,
            fontWeight: WORD_WEIGHT,
            fontFamily: theme.font.display,
            letterSpacing: LETTER_SPACING,
            whiteSpace: 'nowrap',
            visibility: 'hidden',
          }}
        >
          {word}
        </div>
      </div>
    </AbsoluteFill>
  );
};
