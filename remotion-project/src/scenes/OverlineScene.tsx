import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';

const SUBTEXT_MARGIN_TOP = 12;
const LINE_DRAW_START = 0;
const LINE_DRAW_END = 18;
const LINE_HEIGHT_PX = 3;
const LINE_MARGIN_BOTTOM = 20;
const TEXT_FADE_START = 14;
const TEXT_FADE_END = 28;
const TEXT_SIZE = 72;
const TEXT_WEIGHT = 700;
const SUBTEXT_FADE_START = 26;
const SUBTEXT_FADE_END = 40;
const SUBTEXT_SIZE = 24;

type OverlineSceneProps = {
  text: string;
  subtext?: string;
  dark?: boolean;
  bg?: string;
};

export const OverlineScene: React.FC<OverlineSceneProps> = ({ text, subtext, dark, bg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;
  const accentColor = theme.colors.accent;

  const lineWidth = interpolate(frame, [LINE_DRAW_START, LINE_DRAW_END], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const textOpacity = interpolate(frame, [TEXT_FADE_START, TEXT_FADE_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const subtextOpacity = interpolate(frame, [SUBTEXT_FADE_START, SUBTEXT_FADE_END], [0, 1], {
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
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          height: LINE_HEIGHT_PX,
          backgroundColor: accentColor,
          width: `${lineWidth}%`,
          marginBottom: LINE_MARGIN_BOTTOM,
        }}
      />
      <div
        style={{
          fontSize: TEXT_SIZE,
          fontWeight: TEXT_WEIGHT,
          fontFamily: theme.font.display,
          color: textColor,
          opacity: textOpacity,
        }}
      >
        {text}
      </div>
      {subtext && (
        <div
          style={{
            fontSize: SUBTEXT_SIZE,
            fontFamily: theme.font.display,
            color: theme.colors.textMuted,
            opacity: subtextOpacity,
            marginTop: SUBTEXT_MARGIN_TOP,
          }}
        >
          {subtext}
        </div>
      )}
    </AbsoluteFill>
  );
};
