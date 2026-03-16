import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';

// Phone shell
const PHONE_WIDTH = 400;
const PHONE_HEIGHT = 820;
const SIDE_BUTTON_COLOR = '#222';
const DYNAMIC_ISLAND_COLOR = '#000';
const SCREEN_COLOR = '#000000';
const POSITION_OFFSET = 320;

// Caption
const CAPTION_FADE_START = 10;
const CAPTION_FADE_END = 25;

// Ambient ring (behind phone)
const AMBIENT_SIZE = 800;
const AMBIENT_SCALE_START = 1;
const AMBIENT_SCALE_END = 2.5;
const AMBIENT_OPACITY_START = 0.15;
const AMBIENT_FADE_END = 80;

// On-screen ripple
const RIPPLE_BASE_SIZE = 300;
const RIPPLE_START = 5;
const RIPPLE_END = 50;
const DOT_SIZE = 12;

type PhoneTapRippleSceneProps = {
  position?: 'center' | 'left' | 'right';
  caption?: string;
  rippleColor?: string;
};

export const PhoneTapRippleScene: React.FC<PhoneTapRippleSceneProps> = ({
  position = 'center',
  caption,
  rippleColor,
}) => {
  const frame = useCurrentFrame();
  // useVideoConfig is imported to remain consistent with project patterns,
  // though fps is not needed for pure interpolate-based animations here.
  useVideoConfig();

  const activeRippleColor = rippleColor ?? theme.colors.accent;
  const xOffset = position === 'left' ? -POSITION_OFFSET : position === 'right' ? POSITION_OFFSET : 0;

  // Ambient ring animation
  const ambientScale = interpolate(
    frame,
    [0, AMBIENT_FADE_END],
    [AMBIENT_SCALE_START, AMBIENT_SCALE_END],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const ambientOpacity = interpolate(
    frame,
    [0, AMBIENT_FADE_END],
    [AMBIENT_OPACITY_START, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // On-screen ripple animation
  const rippleScale = interpolate(
    frame,
    [RIPPLE_START, RIPPLE_END],
    [0.05, 2],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const rippleOpacity = interpolate(
    frame,
    [RIPPLE_START, RIPPLE_END],
    [0.8, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Centre dot animation
  const dotOpacity = interpolate(
    frame,
    [RIPPLE_START, RIPPLE_START + 15],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Caption fade-in
  const captionOpacity = interpolate(
    frame,
    [CAPTION_FADE_START, CAPTION_FADE_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      {/* AMBIENT RING — behind phone */}
      <div style={{
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        transform: `translateX(${xOffset}px)`,
        pointerEvents: 'none',
      }}>
        <div style={{
          width: AMBIENT_SIZE,
          height: AMBIENT_SIZE,
          border: `2px solid ${activeRippleColor}`,
          borderRadius: '50%',
          transform: `scale(${ambientScale})`,
          opacity: ambientOpacity,
        }} />
      </div>

      {/* PHONE SHELL */}
      <div style={{ position: 'relative', transform: `translateX(${xOffset}px)` }}>
        {/* Side buttons */}
        <div style={{ position: 'absolute', right: -14, top: 160, width: 4, height: 60, backgroundColor: SIDE_BUTTON_COLOR, borderRadius: 2 }} />
        <div style={{ position: 'absolute', left: -14, top: 120, width: 4, height: 40, backgroundColor: SIDE_BUTTON_COLOR, borderRadius: 2 }} />
        <div style={{ position: 'absolute', left: -14, top: 175, width: 4, height: 40, backgroundColor: SIDE_BUTTON_COLOR, borderRadius: 2 }} />

        {/* Shell */}
        <div style={{
          width: PHONE_WIDTH,
          height: PHONE_HEIGHT,
          border: `10px solid ${theme.colors.text}`,
          borderRadius: 48,
          backgroundColor: theme.colors.text,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.22)',
        }}>
          {/* Dynamic island */}
          <div style={{
            position: 'absolute',
            top: 14,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 90,
            height: 28,
            backgroundColor: DYNAMIC_ISLAND_COLOR,
            borderRadius: 14,
            zIndex: 10,
          }} />

          {/* Screen area */}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: SCREEN_COLOR }} />

          {/* INTERACTION LAYER */}
          {/* Ripple circle */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${rippleScale})`,
            width: RIPPLE_BASE_SIZE,
            height: RIPPLE_BASE_SIZE,
            border: `2px solid ${activeRippleColor}`,
            borderRadius: '50%',
            opacity: rippleOpacity,
            zIndex: 20,
          }} />

          {/* Centre dot */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: DOT_SIZE,
            height: DOT_SIZE,
            borderRadius: '50%',
            backgroundColor: activeRippleColor,
            opacity: dotOpacity,
            zIndex: 21,
          }} />
        </div>
      </div>

      {/* CAPTION */}
      {caption && (
        <div style={{
          position: 'absolute',
          bottom: 60,
          left: '50%',
          transform: `translateX(calc(-50% + ${xOffset}px))`,
          fontFamily: theme.font.body,
          fontSize: 18,
          color: theme.colors.textMuted,
          opacity: captionOpacity,
          textAlign: 'center',
          maxWidth: 500,
        }}>
          {caption}
        </div>
      )}
    </AbsoluteFill>
  );
};
