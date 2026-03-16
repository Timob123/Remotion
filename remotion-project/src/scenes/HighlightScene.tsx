import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../config/theme';

const TEXT_FADE_START = 0;
const TEXT_FADE_END = 14;
const UNDERLINE_DRAW_START = 16;
const UNDERLINE_DRAW_END = 32;
const TEXT_SIZE = 80;
const TEXT_WEIGHT = 700;
const UNDERLINE_HEIGHT = 6;
const UNDERLINE_RADIUS = 3;
const LETTER_SPACING = -2;
const UNDERLINE_OFFSET = 4;

type HighlightSceneProps = {
  text: string;
  highlight: string;
  dark?: boolean;
  bg?: string;
};

export const HighlightScene: React.FC<HighlightSceneProps> = ({ text, highlight, dark, bg }) => {
  const frame = useCurrentFrame();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;
  const accentColor = theme.colors.accent;

  const textOpacity = interpolate(frame, [TEXT_FADE_START, TEXT_FADE_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const underlineWidth = interpolate(frame, [UNDERLINE_DRAW_START, UNDERLINE_DRAW_END], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const highlightIndex = text.indexOf(highlight);
  const before = highlightIndex >= 0 ? text.slice(0, highlightIndex) : text;
  const highlightText = highlightIndex >= 0 ? highlight : '';
  const after = highlightIndex >= 0 ? text.slice(highlightIndex + highlight.length) : '';

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
          fontSize: TEXT_SIZE,
          fontWeight: TEXT_WEIGHT,
          fontFamily: theme.font.display,
          letterSpacing: LETTER_SPACING,
          color: textColor,
          opacity: textOpacity,
        }}
      >
        <span>{before}</span>
        <span style={{ position: 'relative', display: 'inline-block' }}>
          {highlightText}
          <div
            style={{
              position: 'absolute',
              bottom: -UNDERLINE_OFFSET,
              left: 0,
              height: UNDERLINE_HEIGHT,
              backgroundColor: accentColor,
              borderRadius: UNDERLINE_RADIUS,
              width: `${underlineWidth}%`,
            }}
          />
        </span>
        <span>{after}</span>
      </div>
    </AbsoluteFill>
  );
};
