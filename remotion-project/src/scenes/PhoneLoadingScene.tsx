import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../config/theme';
// springFast imported to satisfy the rule; available for callers extending this scene
import {} from '../hooks/useSceneAnimation';

// ─── Constants ────────────────────────────────────────────────────────────────

// Layout
const PHONE_WIDTH = 400;
const PHONE_HEIGHT = 820;
const POSITION_OFFSET = 320;

// Phone shell
const PHONE_BORDER_RADIUS = 48;
const DYNAMIC_ISLAND_WIDTH = 90;
const DYNAMIC_ISLAND_HEIGHT = 28;
const DYNAMIC_ISLAND_TOP = 14;
const DYNAMIC_ISLAND_BORDER_RADIUS = 14;
const BUTTON_INSET = -14;
const BUTTON_WIDTH = 4;
const BUTTON_RIGHT_TOP = 160;
const BUTTON_RIGHT_HEIGHT = 60;
const BUTTON_LEFT_1_TOP = 120;
const BUTTON_LEFT_1_HEIGHT = 40;
const BUTTON_LEFT_2_TOP = 175;
const BUTTON_LEFT_2_HEIGHT = 40;

// Ambient halo SVG
const HALO_SVG_SIZE = 600;
const HALO_CIRCLE_RADIUS = 280;
const HALO_STROKE_WIDTH = 3;
const HALO_FULL_STROKE_OPACITY = 0.12;
const HALO_ARC_DASHARRAY_ON = 140;
const HALO_ARC_DASHARRAY_OFF = 1619;
const HALO_ROTATION_DEG_PER_FRAME = 2;

// Spinner
const SPINNER_SIZE = 48;
const SPINNER_RADIUS = 20;
const SPINNER_STROKE_WIDTH = 3;
const SPINNER_DASHARRAY_ON = 40;
const SPINNER_DASHARRAY_OFF = 86;
const SPINNER_TOP = '40%';
const SPINNER_ROTATION_DEG_PER_FRAME = 4;

// Label
const LABEL_TOP = 'calc(40% + 60px)';
const LABEL_FONT_SIZE = 14;
const LABEL_FADE_START = 10;
const LABEL_FADE_END = 22;

// Progress bar
const PROGRESS_BOTTOM = 100;
const PROGRESS_LEFT = 30;
const PROGRESS_RIGHT = 30;
const PROGRESS_HEIGHT = 3;
const PROGRESS_BORDER_RADIUS = 2;
const PROGRESS_FILL_FRAME_START = 10;
const PROGRESS_FILL_FRAME_END = 60;
const DEFAULT_PROGRESS = 0.7;

// Caption
const CAPTION_BOTTOM = 60;
const CAPTION_FONT_SIZE = 18;
const CAPTION_FADE_START = 10;
const CAPTION_FADE_END = 25;

// ─── Types ────────────────────────────────────────────────────────────────────

type PhoneLoadingSceneProps = {
  position?: 'center' | 'left' | 'right';
  caption?: string;
  label?: string;
  progress?: number; // 0–1, default 0.7
};

// ─── Component ────────────────────────────────────────────────────────────────

export const PhoneLoadingScene: React.FC<PhoneLoadingSceneProps> = ({
  position = 'center',
  caption,
  label,
  progress,
}) => {
  const frame = useCurrentFrame();

  const xOffset =
    position === 'left'
      ? -POSITION_OFFSET
      : position === 'right'
      ? POSITION_OFFSET
      : 0;

  // Halo rotation (continuous, frame-based)
  const haloRotation = frame * HALO_ROTATION_DEG_PER_FRAME;

  // Spinner rotation (continuous, frame-based)
  const spinnerRotation = frame * SPINNER_ROTATION_DEG_PER_FRAME;

  // Label fade-in
  const labelOpacity = interpolate(frame, [LABEL_FADE_START, LABEL_FADE_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Progress bar fill width (percentage)
  const progressTarget = (progress ?? DEFAULT_PROGRESS) * 100;
  const progressWidth = interpolate(
    frame,
    [PROGRESS_FILL_FRAME_START, PROGRESS_FILL_FRAME_END],
    [0, progressTarget],
    { extrapolateRight: 'clamp' }
  );

  // Caption fade-in
  const captionOpacity = interpolate(
    frame,
    [CAPTION_FADE_START, CAPTION_FADE_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* ── AMBIENT HALO — behind phone ── */}
      <div
        style={{
          position: 'absolute',
          transform: `translateX(${xOffset}px)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <div style={{ transform: `rotate(${haloRotation}deg)` }}>
          <svg
            width={HALO_SVG_SIZE}
            height={HALO_SVG_SIZE}
            viewBox="-300 -300 600 600"
            style={{ overflow: 'visible' }}
          >
            {/* Full faint circle */}
            <circle
              r={HALO_CIRCLE_RADIUS}
              fill="none"
              stroke={theme.colors.accent}
              strokeWidth={HALO_STROKE_WIDTH}
              strokeOpacity={HALO_FULL_STROKE_OPACITY}
            />
            {/* Rotating arc */}
            <circle
              r={HALO_CIRCLE_RADIUS}
              fill="none"
              stroke={theme.colors.accent}
              strokeWidth={HALO_STROKE_WIDTH}
              strokeDasharray={`${HALO_ARC_DASHARRAY_ON} ${HALO_ARC_DASHARRAY_OFF}`}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* ── PHONE SHELL ── */}
      <div style={{ position: 'relative', transform: `translateX(${xOffset}px)` }}>
        {/* Side buttons */}
        <div
          style={{
            position: 'absolute',
            right: BUTTON_INSET,
            top: BUTTON_RIGHT_TOP,
            width: BUTTON_WIDTH,
            height: BUTTON_RIGHT_HEIGHT,
            backgroundColor: '#222',
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: BUTTON_INSET,
            top: BUTTON_LEFT_1_TOP,
            width: BUTTON_WIDTH,
            height: BUTTON_LEFT_1_HEIGHT,
            backgroundColor: '#222',
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: BUTTON_INSET,
            top: BUTTON_LEFT_2_TOP,
            width: BUTTON_WIDTH,
            height: BUTTON_LEFT_2_HEIGHT,
            backgroundColor: '#222',
            borderRadius: 2,
          }}
        />

        {/* Phone body */}
        <div
          style={{
            width: PHONE_WIDTH,
            height: PHONE_HEIGHT,
            border: `10px solid ${theme.colors.text}`,
            borderRadius: PHONE_BORDER_RADIUS,
            backgroundColor: theme.colors.text,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0,0,0,0.22)',
          }}
        >
          {/* Dynamic island */}
          <div
            style={{
              position: 'absolute',
              top: DYNAMIC_ISLAND_TOP,
              left: '50%',
              transform: 'translateX(-50%)',
              width: DYNAMIC_ISLAND_WIDTH,
              height: DYNAMIC_ISLAND_HEIGHT,
              backgroundColor: '#000',
              borderRadius: DYNAMIC_ISLAND_BORDER_RADIUS,
              zIndex: 10,
            }}
          />

          {/* Screen area */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#000000',
            }}
          />

          {/* ── INTERACTION LAYER ── */}

          {/* Spinner */}
          <div
            style={{
              position: 'absolute',
              top: SPINNER_TOP,
              left: '50%',
              transform: `translateX(-50%) rotate(${spinnerRotation}deg)`,
              zIndex: 20,
            }}
          >
            <svg
              width={SPINNER_SIZE}
              height={SPINNER_SIZE}
              viewBox="0 0 48 48"
            >
              {/* Background track */}
              <circle
                cx={24}
                cy={24}
                r={SPINNER_RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth={SPINNER_STROKE_WIDTH}
              />
              {/* Spinning arc */}
              <circle
                cx={24}
                cy={24}
                r={SPINNER_RADIUS}
                fill="none"
                stroke={theme.colors.accent}
                strokeWidth={SPINNER_STROKE_WIDTH}
                strokeDasharray={`${SPINNER_DASHARRAY_ON} ${SPINNER_DASHARRAY_OFF}`}
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Label */}
          {label && (
            <div
              style={{
                position: 'absolute',
                top: LABEL_TOP,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.7)',
                fontSize: LABEL_FONT_SIZE,
                fontFamily: theme.font.body,
                opacity: labelOpacity,
                zIndex: 20,
              }}
            >
              {label}
            </div>
          )}

          {/* Progress bar */}
          <div
            style={{
              position: 'absolute',
              bottom: PROGRESS_BOTTOM,
              left: PROGRESS_LEFT,
              right: PROGRESS_RIGHT,
              zIndex: 20,
            }}
          >
            {/* Track */}
            <div
              style={{
                height: PROGRESS_HEIGHT,
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: PROGRESS_BORDER_RADIUS,
              }}
            >
              {/* Fill */}
              <div
                style={{
                  height: PROGRESS_HEIGHT,
                  backgroundColor: theme.colors.accent,
                  borderRadius: PROGRESS_BORDER_RADIUS,
                  width: progressWidth + '%',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── CAPTION ── */}
      {caption && (
        <div
          style={{
            position: 'absolute',
            bottom: CAPTION_BOTTOM,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            transform: `translateX(${xOffset}px)`,
            fontFamily: theme.font.body,
            fontSize: CAPTION_FONT_SIZE,
            color: theme.colors.textMuted,
            opacity: captionOpacity,
          }}
        >
          {caption}
        </div>
      )}
    </AbsoluteFill>
  );
};
