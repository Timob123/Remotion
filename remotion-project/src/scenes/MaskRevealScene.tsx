import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';

const SUBTEXT_MARGIN_TOP = 16;
const MASK_SPEED_START = 5;
const MASK_SPEED_END = 30;
const TEXT_SIZE = 96;
const TEXT_WEIGHT = 700;
const SUBTEXT_SIZE = 28;
const SUBTEXT_DELAY = 20;
const SUBTEXT_FADE_DURATION = 12;

type MaskRevealSceneProps = {
  text: string;
  subtext?: string;
  dark?: boolean;
  bg?: string;
};

export const MaskRevealScene: React.FC<MaskRevealSceneProps> = ({ text, subtext, dark, bg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;
  const maskLeft = interpolate(frame, [MASK_SPEED_START, MASK_SPEED_END], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const subtextOpacity = interpolate(
    frame,
    [SUBTEXT_DELAY, SUBTEXT_DELAY + SUBTEXT_FADE_DURATION],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

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
          position: 'relative',
          overflow: 'hidden',
          display: 'inline-block',
        }}
      >
        <div
          style={{
            fontSize: TEXT_SIZE,
            fontWeight: TEXT_WEIGHT,
            fontFamily: theme.font.display,
            color: textColor,
          }}
        >
          {text}
        </div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: `${100 - maskLeft}%`,
            backgroundColor: bgColor,
          }}
        />
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
