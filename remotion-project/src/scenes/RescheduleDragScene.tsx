import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast, springBounce } from '../hooks/useSceneAnimation';

// ── Timing ────────────────────────────────────────────────────────────────────
const TIMELINE_ENTRY_END = 16;
const DRAG_START = 24;
const DRAG_END = 62;
const DROP_FRAME = 64;
const SETTLE_END = 78;
const CONFIRM_START = 74;

// ── Layout ────────────────────────────────────────────────────────────────────
const SLOT_HEIGHT = 64;
const SLOT_WIDTH = 560;
const SLOT_GAP = 2;
const SLOT_RADIUS = 8;
const SLOT_PADDING = 16;
const EVENT_RADIUS = 10;
const EVENT_FONT_SIZE = 15;
const TIME_FONT_SIZE = 13;

// ── Data ──────────────────────────────────────────────────────────────────────
const TIME_SLOTS = ['6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'];
const ORIGINAL_SLOT = 1;
const TARGET_SLOT = 3;

interface RescheduleDragSceneProps {
  dark?: boolean;
  bg?: string;
}

export const RescheduleDragScene: React.FC<RescheduleDragSceneProps> = ({ dark = false, bg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;

  const timelineSpring = spring({ frame: Math.max(0, frame), fps, config: springFast });
  const timelineOp = interpolate(timelineSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Event position: original y → target y
  const originalY = ORIGINAL_SLOT * (SLOT_HEIGHT + SLOT_GAP);
  const targetY = TARGET_SLOT * (SLOT_HEIGHT + SLOT_GAP);

  const isDragging = frame >= DRAG_START && frame < DROP_FRAME;
  const isDropped = frame >= DROP_FRAME;

  const dragProgress = interpolate(frame, [DRAG_START, DRAG_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const dragY = interpolate(dragProgress, [0, 1], [originalY, targetY], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const settleSpring = spring({ frame: Math.max(0, frame - DROP_FRAME), fps, config: springBounce });
  const settledY = interpolate(settleSpring, [0, 1], [dragY, targetY], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const eventY = isDropped ? settledY : isDragging ? dragY : originalY;

  const dragScale = isDragging ? 1.03 : 1;
  const dragShadow = isDragging ? '0 12px 40px rgba(0,0,0,0.2)' : theme.shadow;

  const showTarget = frame > DRAG_END - 10;
  const confirmOp = interpolate(frame, [CONFIRM_START, CONFIRM_START + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const slotBg = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
  const slotBorder = dark ? 'rgba(255,255,255,0.08)' : theme.colors.border;

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
      <div style={{ opacity: timelineOp, position: 'relative', width: SLOT_WIDTH }}>
        {/* Slot rows */}
        {TIME_SLOTS.map((time, i) => {
          const slotSpring = spring({ frame: Math.max(0, frame - i * 3), fps, config: springFast });
          const slotX = interpolate(slotSpring, [0, 1], [-20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const slotOp = interpolate(slotSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const isTargetSlot = i === TARGET_SLOT && showTarget;

          return (
            <div key={i} style={{
              height: SLOT_HEIGHT, width: SLOT_WIDTH,
              borderRadius: SLOT_RADIUS,
              backgroundColor: isTargetSlot ? theme.colors.accentLight : slotBg,
              border: `${isTargetSlot ? '2px dashed' : '1px solid'} ${isTargetSlot ? theme.colors.accent : slotBorder}`,
              display: 'flex', alignItems: 'center', paddingLeft: SLOT_PADDING,
              marginBottom: SLOT_GAP,
              opacity: slotOp,
              transform: `translateX(${slotX}px)`,
              boxSizing: 'border-box',
            }}>
              <span style={{ fontFamily: theme.font.display, fontSize: TIME_FONT_SIZE, color: theme.colors.textMuted }}>
                {time}
              </span>
            </div>
          );
        })}

        {/* Ghost outline at original position (visible during drag) */}
        {isDragging && (
          <div style={{
            position: 'absolute', top: originalY, left: 0,
            width: SLOT_WIDTH, height: SLOT_HEIGHT,
            borderRadius: EVENT_RADIUS,
            border: `2px dashed ${theme.colors.border}`,
            boxSizing: 'border-box',
          }} />
        )}

        {/* Event block */}
        <div style={{
          position: 'absolute', top: eventY, left: 0,
          width: SLOT_WIDTH, height: SLOT_HEIGHT,
          borderRadius: EVENT_RADIUS,
          backgroundColor: theme.colors.accent,
          display: 'flex', alignItems: 'center', paddingLeft: SLOT_PADDING, paddingRight: SLOT_PADDING,
          justifyContent: 'space-between',
          transform: `scale(${dragScale})`,
          boxShadow: dragShadow,
          boxSizing: 'border-box',
        }}>
          <span style={{ fontFamily: theme.font.display, fontSize: EVENT_FONT_SIZE, fontWeight: theme.font.weights.semibold, color: theme.colors.bg }}>
            Dinner — Nobu London
          </span>
          <span style={{ fontFamily: theme.font.display, fontSize: TIME_FONT_SIZE, color: 'rgba(255,255,255,0.75)' }}>
            {isDropped ? '9:00 PM' : '7:00 PM'}
          </span>
        </div>
      </div>

      {/* Confirm */}
      <div style={{ opacity: confirmOp, fontFamily: theme.font.display, fontSize: 15, fontWeight: theme.font.weights.semibold, color: theme.colors.success }}>
        Rescheduled to 9:00 PM ✓
      </div>
    </AbsoluteFill>
  );
};
