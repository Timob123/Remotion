import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast } from '../hooks/useSceneAnimation';

type PhoneNotificationSceneProps = {
  position?: 'center' | 'left' | 'right';
  caption?: string;
  appName: string;
  message: string;
  time?: string;
};

export const PhoneNotificationScene: React.FC<PhoneNotificationSceneProps> = ({
  position = 'center',
  caption,
  appName,
  message,
  time = 'now',
}) => {
  const RING_DURATION = 60;
  const RING_STAGGER = 8;
  const RING_SCALE_MAX = 2.5;
  const RING_OPACITY_START = 0.5;
  const BANNER_DELAY = RING_STAGGER; // ties banner to ring timing
  const BANNER_ENTRY_Y = -120;
  const CAPTION_FADE_START = 10;
  const CAPTION_FADE_END = 25;
  const POSITION_OFFSET = 320;
  const PHONE_WIDTH = 400;
  const PHONE_HEIGHT = 820;

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const xOffset = position === 'left' ? -POSITION_OFFSET : position === 'right' ? POSITION_OFFSET : 0;

  // Ambient pulse rings
  const ring1Scale = interpolate(frame, [0, RING_DURATION], [1, RING_SCALE_MAX], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ring1Opacity = interpolate(frame, [0, RING_DURATION], [RING_OPACITY_START, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ring2Scale = interpolate(frame, [RING_STAGGER, RING_STAGGER + RING_DURATION], [1, RING_SCALE_MAX], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ring2Opacity = interpolate(frame, [RING_STAGGER, RING_STAGGER + RING_DURATION], [RING_OPACITY_START, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ring3Scale = interpolate(frame, [RING_STAGGER * 2, RING_STAGGER * 2 + RING_DURATION], [1, RING_SCALE_MAX], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ring3Opacity = interpolate(frame, [RING_STAGGER * 2, RING_STAGGER * 2 + RING_DURATION], [RING_OPACITY_START, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Notification banner slide-in
  const bannerSpring = spring({ frame: Math.max(0, frame - BANNER_DELAY), fps, config: springFast });
  const bannerY = interpolate(bannerSpring, [0, 1], [BANNER_ENTRY_Y, 0]);

  // Caption fade-in
  const captionOpacity = interpolate(frame, [CAPTION_FADE_START, CAPTION_FADE_END], [0, 1], { extrapolateRight: 'clamp' });

  const ringBase: React.CSSProperties = {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: '50%',
    border: `2px solid ${theme.colors.accent}`,
    top: '50%',
    left: '50%',
  };

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* AMBIENT EFFECT behind phone */}
      <div style={{ position: 'absolute', transform: `translateX(${xOffset}px)`, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', pointerEvents: 'none' }}>
        <div style={{ position: 'relative', width: 500, height: 500 }}>
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
        <div style={{ width: PHONE_WIDTH, height: PHONE_HEIGHT, border: '10px solid #111110', borderRadius: 48, backgroundColor: '#111110', position: 'relative', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.22)' }}>
          {/* Dynamic island */}
          <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', width: 90, height: 28, backgroundColor: '#000', borderRadius: 14, zIndex: 10 }} />
          {/* BLACK SCREEN */}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: '#000000' }} />
          {/* INTERACTION LAYER */}
          <div style={{ position: 'absolute', top: 50, left: 12, right: 12, backgroundColor: '#fff', borderRadius: 16, padding: '10px 14px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', zIndex: 20, transform: `translateY(${bannerY}px)`, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 12, color: theme.colors.textMuted, fontFamily: theme.font.body }}>
              {appName}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: theme.colors.text, fontFamily: theme.font.body }}>
              {message}
            </div>
            <div style={{ fontSize: 11, color: theme.colors.textMuted, fontFamily: theme.font.body, textAlign: 'right' }}>
              {time}
            </div>
          </div>
        </div>
      </div>

      {/* CAPTION */}
      {caption && (
        <div style={{ position: 'absolute', bottom: 60, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `translateX(${xOffset}px)`, fontFamily: theme.font.body, fontSize: 18, color: theme.colors.textMuted, opacity: captionOpacity }}>
          {caption}
        </div>
      )}
    </AbsoluteFill>
  );
};
