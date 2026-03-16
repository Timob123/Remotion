import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../config/theme';

const TEXT_FADE_START = 0;
const TEXT_FADE_END = 30;
const BAR_SLIDE_START = 32;
const BAR_SLIDE_END = 50;
const BAR_HEIGHT = 80;
const TEXT_SIZE = 64;
const TEXT_WEIGHT = 500;
const TEXT_LETTER_SPACING = 4;
const SUBTEXT_SIZE = 20;
const SUBTEXT_MARGIN_TOP = 16;
const SUBTEXT_LETTER_SPACING = 8;

type CinematicTextSceneProps = {
  text: string;
  subtext?: string;
  dark?: boolean;
  bg?: string;
};

export const CinematicTextScene: React.FC<CinematicTextSceneProps> = ({ text, subtext, dark, bg }) => {
  const frame = useCurrentFrame();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;
  const accentColor = theme.colors.accent;

  const textOpacity = interpolate(frame, [TEXT_FADE_START, TEXT_FADE_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const barScale = interpolate(frame, [BAR_SLIDE_START, BAR_SLIDE_END], [0, 1], {
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
          top: 0,
          left: 0,
          right: 0,
          height: BAR_HEIGHT,
          backgroundColor: textColor,
          transform: `scaleY(${barScale})`,
          transformOrigin: 'top',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: BAR_HEIGHT,
          backgroundColor: textColor,
          transform: `scaleY(${barScale})`,
          transformOrigin: 'bottom',
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontSize: TEXT_SIZE,
            fontWeight: TEXT_WEIGHT,
            letterSpacing: TEXT_LETTER_SPACING,
            textTransform: 'uppercase',
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
              letterSpacing: SUBTEXT_LETTER_SPACING,
              textTransform: 'uppercase',
              color: theme.colors.textMuted,
              opacity: textOpacity,
              marginTop: SUBTEXT_MARGIN_TOP,
              fontFamily: theme.font.display,
            }}
          >
            {subtext}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
