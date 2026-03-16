import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';

// ─── Constants ────────────────────────────────────────────────────────────────

const PHONE_WIDTH = 400;
const PHONE_HEIGHT = 820;
const SIDE_BUTTON_COLOR = '#222';
const DYNAMIC_ISLAND_COLOR = '#000';
const SCREEN_COLOR = '#000000';
const POSITION_OFFSET = 320;
const CAPTION_FADE_START = 10;
const CAPTION_FADE_END = 25;
// flash timing
const FLASH_START = 8;
const FLASH_PEAK = 12;
const FLASH_SCREEN_END = 24;
const FLASH_AMBIENT_END = 28;
const SCREEN_FLASH_OPACITY_PEAK = 1;
const AMBIENT_FLASH_OPACITY_PEAK = 0.85;
// ambient bloom
const BLOOM_SIZE = 600;
// shutter sweep
const SHUTTER_LINE_HEIGHT = 2;
const SHUTTER_START = 8;
const SHUTTER_END = 20;
// corner brackets
const BRACKET_ARM = 20;
const BRACKET_THICKNESS = 3;
const BRACKET_OFFSET = 12;

// Phone shell geometry
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

// Caption
const CAPTION_BOTTOM = 60;
const CAPTION_FONT_SIZE = 18;

// ─── Types ────────────────────────────────────────────────────────────────────

type PhoneScreenshotSceneProps = {
  position?: 'center' | 'left' | 'right';
  caption?: string;
};

// ─── Component ────────────────────────────────────────────────────────────────

export const PhoneScreenshotScene: React.FC<PhoneScreenshotSceneProps> = ({
  position = 'center',
  caption,
}) => {
  const frame = useCurrentFrame();
  useVideoConfig(); // consumed for fps access consistency with other scenes

  const xOffset =
    position === 'left'
      ? -POSITION_OFFSET
      : position === 'right'
      ? POSITION_OFFSET
      : 0;

  // ── Screen flash ──
  const screenFlashOpacity = interpolate(
    frame,
    [FLASH_START, FLASH_PEAK, FLASH_SCREEN_END],
    [0, SCREEN_FLASH_OPACITY_PEAK, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── Ambient flash overlay + bloom ──
  const ambientFlashOpacity = interpolate(
    frame,
    [FLASH_START, FLASH_PEAK, FLASH_AMBIENT_END],
    [0, AMBIENT_FLASH_OPACITY_PEAK, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── Shutter sweep ──
  const shutterY = interpolate(
    frame,
    [SHUTTER_START, SHUTTER_END],
    [0, PHONE_HEIGHT],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const shutterOpacity = interpolate(
    frame,
    [FLASH_START, FLASH_PEAK, FLASH_SCREEN_END],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── Caption ──
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
      {/* ── AMBIENT BLOOM — behind phone ── */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(calc(-50% + ${xOffset}px), -50%)`,
          width: BLOOM_SIZE,
          height: BLOOM_SIZE,
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, transparent 55%)',
          opacity: ambientFlashOpacity,
          pointerEvents: 'none',
          zIndex: 4,
        }}
      />

      {/* ── PHONE SHELL ── */}
      <div style={{ position: 'relative', transform: `translateX(${xOffset}px)`, zIndex: 10 }}>
        {/* Side buttons */}
        <div
          style={{
            position: 'absolute',
            right: BUTTON_INSET,
            top: BUTTON_RIGHT_TOP,
            width: BUTTON_WIDTH,
            height: BUTTON_RIGHT_HEIGHT,
            backgroundColor: SIDE_BUTTON_COLOR,
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
            backgroundColor: SIDE_BUTTON_COLOR,
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
            backgroundColor: SIDE_BUTTON_COLOR,
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
              backgroundColor: DYNAMIC_ISLAND_COLOR,
              borderRadius: DYNAMIC_ISLAND_BORDER_RADIUS,
              zIndex: 10,
            }}
          />

          {/* Screen area */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: SCREEN_COLOR,
            }}
          />

          {/* ── INTERACTION LAYER ── */}

          {/* Screen flash */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#fff',
              opacity: screenFlashOpacity,
              zIndex: 20,
            }}
          />

          {/* Shutter sweep line */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: shutterY,
              height: SHUTTER_LINE_HEIGHT,
              backgroundColor: '#fff',
              opacity: shutterOpacity,
              zIndex: 21,
            }}
          />

          {/* Corner brackets — top-left */}
          <div style={{ position: 'absolute', top: BRACKET_OFFSET, left: BRACKET_OFFSET, opacity: screenFlashOpacity, zIndex: 22 }}>
            {/* horizontal arm */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: BRACKET_ARM,
                height: BRACKET_THICKNESS,
                backgroundColor: '#fff',
              }}
            />
            {/* vertical arm */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: BRACKET_THICKNESS,
                height: BRACKET_ARM,
                backgroundColor: '#fff',
              }}
            />
          </div>

          {/* Corner brackets — top-right */}
          <div style={{ position: 'absolute', top: BRACKET_OFFSET, right: BRACKET_OFFSET, opacity: screenFlashOpacity, zIndex: 22 }}>
            {/* horizontal arm */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: BRACKET_ARM,
                height: BRACKET_THICKNESS,
                backgroundColor: '#fff',
              }}
            />
            {/* vertical arm */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: BRACKET_THICKNESS,
                height: BRACKET_ARM,
                backgroundColor: '#fff',
              }}
            />
          </div>

          {/* Corner brackets — bottom-left */}
          <div style={{ position: 'absolute', bottom: BRACKET_OFFSET, left: BRACKET_OFFSET, opacity: screenFlashOpacity, zIndex: 22 }}>
            {/* horizontal arm */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: BRACKET_ARM,
                height: BRACKET_THICKNESS,
                backgroundColor: '#fff',
              }}
            />
            {/* vertical arm */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: BRACKET_THICKNESS,
                height: BRACKET_ARM,
                backgroundColor: '#fff',
              }}
            />
          </div>

          {/* Corner brackets — bottom-right */}
          <div style={{ position: 'absolute', bottom: BRACKET_OFFSET, right: BRACKET_OFFSET, opacity: screenFlashOpacity, zIndex: 22 }}>
            {/* horizontal arm */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: BRACKET_ARM,
                height: BRACKET_THICKNESS,
                backgroundColor: '#fff',
              }}
            />
            {/* vertical arm */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: BRACKET_THICKNESS,
                height: BRACKET_ARM,
                backgroundColor: '#fff',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── FULL-SCENE AMBIENT FLASH OVERLAY ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#fff',
          opacity: ambientFlashOpacity,
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

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
            zIndex: 30,
          }}
        >
          {caption}
        </div>
      )}
    </AbsoluteFill>
  );
};
