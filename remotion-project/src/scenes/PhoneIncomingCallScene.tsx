import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast } from '../hooks/useSceneAnimation';

type PhoneIncomingCallSceneProps = {
  position?: 'center' | 'left' | 'right';
  caption?: string;
  callerName: string;
  callerSubtitle?: string;
};

export const PhoneIncomingCallScene: React.FC<PhoneIncomingCallSceneProps> = ({
  position = 'center',
  caption,
  callerName,
  callerSubtitle,
}) => {
  // Layout constants
  const PHONE_WIDTH = 400;
  const PHONE_HEIGHT = 820;
  const POSITION_OFFSET = 320;

  // Ring animation constants
  const RING_COLOR = '#22C55E';
  const RING_SIZE = 600;
  const RING_SCALE_MIN = 1;
  const RING_SCALE_MAX = 3;
  const RING_OPACITY_START = 0.5;
  const RING_OPACITY_END = 0;
  const RING_1_START = 0;
  const RING_1_END = 90;
  const RING_2_START = 20;
  const RING_2_END = 110;
  const RING_3_START = 40;
  const RING_3_END = 130;

  // Call bar constants
  const CALL_BAR_HEIGHT = 200;
  const CALL_BAR_DELAY = 12;
  const CALL_BAR_SLIDE_FROM = 200;
  const CALL_BAR_SLIDE_TO = 0;

  // Button constants
  const BUTTON_SIZE = 56;

  // Caption constants
  const CAPTION_FADE_START = 10;
  const CAPTION_FADE_END = 25;

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const xOffset = position === 'left' ? -POSITION_OFFSET : position === 'right' ? POSITION_OFFSET : 0;

  // Ambient green ripple rings
  const ring1Scale = interpolate(frame, [RING_1_START, RING_1_END], [RING_SCALE_MIN, RING_SCALE_MAX], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ring1Opacity = interpolate(frame, [RING_1_START, RING_1_END], [RING_OPACITY_START, RING_OPACITY_END], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const ring2Scale = interpolate(frame, [RING_2_START, RING_2_END], [RING_SCALE_MIN, RING_SCALE_MAX], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ring2Opacity = interpolate(frame, [RING_2_START, RING_2_END], [RING_OPACITY_START, RING_OPACITY_END], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const ring3Scale = interpolate(frame, [RING_3_START, RING_3_END], [RING_SCALE_MIN, RING_SCALE_MAX], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ring3Opacity = interpolate(frame, [RING_3_START, RING_3_END], [RING_OPACITY_START, RING_OPACITY_END], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Green call bar slide-up
  const callBarSpring = spring({ frame: Math.max(0, frame - CALL_BAR_DELAY), fps, config: springFast });
  const callBarY = interpolate(callBarSpring, [0, 1], [CALL_BAR_SLIDE_FROM, CALL_BAR_SLIDE_TO]);

  // Caption fade-in
  const captionOpacity = interpolate(frame, [CAPTION_FADE_START, CAPTION_FADE_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const ringBase: React.CSSProperties = {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    border: `2px solid ${RING_COLOR}`,
    borderRadius: '50%',
    top: '50%',
    left: '50%',
  };

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* AMBIENT GREEN RIPPLE RINGS — behind phone */}
      <div style={{ position: 'absolute', transform: `translateX(${xOffset}px)`, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', pointerEvents: 'none' }}>
        <div style={{ position: 'relative', width: RING_SIZE, height: RING_SIZE }}>
          <div style={{ ...ringBase, transform: `translate(-50%, -50%) scale(${ring1Scale})`, opacity: ring1Opacity }} />
          <div style={{ ...ringBase, transform: `translate(-50%, -50%) scale(${ring2Scale})`, opacity: ring2Opacity }} />
          <div style={{ ...ringBase, transform: `translate(-50%, -50%) scale(${ring3Scale})`, opacity: ring3Opacity }} />
        </div>
      </div>

      {/* PHONE SHELL */}
      <div style={{ position: 'relative', transform: `translateX(${xOffset}px)` }}>
        {/* Side buttons */}
        <div style={{ position: 'absolute', right: -14, top: 160, width: 4, height: 60, backgroundColor: '#222', borderRadius: 2 }} />
        <div style={{ position: 'absolute', left: -14, top: 120, width: 4, height: 40, backgroundColor: '#222', borderRadius: 2 }} />
        <div style={{ position: 'absolute', left: -14, top: 175, width: 4, height: 40, backgroundColor: '#222', borderRadius: 2 }} />

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
          <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', width: 90, height: 28, backgroundColor: '#000', borderRadius: 14, zIndex: 10 }} />

          {/* Screen area */}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: '#000000' }} />

          {/* INTERACTION LAYER — green call bar slides up from bottom */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: CALL_BAR_HEIGHT,
            backgroundColor: theme.colors.success,
            borderRadius: '24px 24px 0 0',
            padding: 24,
            zIndex: 20,
            transform: `translateY(${callBarY}px)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Caller name */}
            <div style={{
              fontSize: 18,
              fontWeight: 700,
              color: '#fff',
              fontFamily: theme.font.display,
              textAlign: 'center',
            }}>
              {callerName}
            </div>

            {/* Caller subtitle */}
            {callerSubtitle && (
              <div style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.7)',
                fontFamily: theme.font.body,
                textAlign: 'center',
                marginTop: 4,
              }}>
                {callerSubtitle}
              </div>
            )}

            {/* Button row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              marginTop: 16,
            }}>
              {/* Decline button */}
              <div style={{
                width: BUTTON_SIZE,
                height: BUTTON_SIZE,
                borderRadius: '50%',
                backgroundColor: theme.colors.danger,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                color: '#fff',
              }}>
                ✕
              </div>

              {/* Accept button */}
              <div style={{
                width: BUTTON_SIZE,
                height: BUTTON_SIZE,
                borderRadius: '50%',
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                color: theme.colors.success,
              }}>
                ✓
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CAPTION */}
      {caption && (
        <div style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          transform: `translateX(${xOffset}px)`,
          fontFamily: theme.font.body,
          fontSize: 18,
          color: theme.colors.textMuted,
          opacity: captionOpacity,
        }}>
          {caption}
        </div>
      )}
    </AbsoluteFill>
  );
};
