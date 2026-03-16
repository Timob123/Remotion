import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../config/theme';

const BAR_HEIGHT = 80;
const BAR_DRAW_END = 20;
const TEXT_FADE_START = 16;
const TEXT_FADE_END = 30;
const TITLE_SIZE = 72;
const TITLE_WEIGHT = 700;
const SUBTITLE_SIZE = 24;
const SUBTITLE_MARGIN_TOP = 12;

type TitleCardSceneProps = {
  title: string;
  subtitle?: string;
  dark?: boolean;
  bg?: string;
};

export const TitleCardScene: React.FC<TitleCardSceneProps> = ({ title, subtitle, dark, bg }) => {
  const frame = useCurrentFrame();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;
  const accentColor = theme.colors.accent;

  const barScale = interpolate(frame, [0, BAR_DRAW_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const textOpacity = interpolate(frame, [TEXT_FADE_START, TEXT_FADE_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      {/* Top bar */}
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
      {/* Bottom bar */}
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
      {/* Centred text */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            fontSize: TITLE_SIZE,
            fontWeight: TITLE_WEIGHT,
            fontFamily: theme.font.display,
            color: textColor,
            opacity: textOpacity,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: SUBTITLE_SIZE,
              fontFamily: theme.font.display,
              color: theme.colors.textMuted,
              opacity: textOpacity,
              marginTop: SUBTITLE_MARGIN_TOP,
            }}
          >
            {subtitle}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
