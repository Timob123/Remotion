import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';

const COUNT_START = 5;
const COUNT_END = 45;
const STAT_SIZE = 160;
const STAT_WEIGHT = 900;
const LABEL_SIZE = 28;
const LABEL_DELAY = 30;
const LABEL_FADE_DURATION = 12;
const PREFIX_SUFFIX_SIZE_FACTOR = 0.6;

type StatCountSceneProps = {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  dark?: boolean;
  bg?: string;
};

export const StatCountScene: React.FC<StatCountSceneProps> = ({ value, label, prefix, suffix, dark, bg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;
  const accentColor = theme.colors.accent;
  const labelColor = dark ? textColor : theme.colors.textMuted;

  const countedValue = Math.round(
    interpolate(frame, [COUNT_START, COUNT_END], [0, value], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );
  const statOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const labelOpacity = interpolate(frame, [LABEL_DELAY, LABEL_DELAY + LABEL_FADE_DURATION], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

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
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          opacity: statOpacity,
        }}
      >
        {prefix && (
          <span
            style={{
              fontFamily: theme.font.display,
              fontWeight: STAT_WEIGHT,
              fontSize: STAT_SIZE * PREFIX_SUFFIX_SIZE_FACTOR,
              color: textColor,
            }}
          >
            {prefix}
          </span>
        )}
        <span
          style={{
            fontFamily: theme.font.display,
            fontWeight: STAT_WEIGHT,
            fontSize: STAT_SIZE,
            color: textColor,
          }}
        >
          {countedValue}
        </span>
        {suffix && (
          <span
            style={{
              fontFamily: theme.font.display,
              fontWeight: STAT_WEIGHT,
              fontSize: STAT_SIZE * PREFIX_SUFFIX_SIZE_FACTOR,
              color: textColor,
            }}
          >
            {suffix}
          </span>
        )}
      </div>
      <div
        style={{
          fontFamily: theme.font.display,
          fontWeight: STAT_WEIGHT,
          fontSize: LABEL_SIZE,
          color: labelColor,
          opacity: labelOpacity,
        }}
      >
        {label}
      </div>
    </AbsoluteFill>
  );
};
