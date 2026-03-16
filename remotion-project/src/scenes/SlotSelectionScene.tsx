import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast, springBounce } from '../hooks/useSceneAnimation';

// ── Timing ────────────────────────────────────────────────────────────────────
const HEADER_START = 0;
const SLOT_STAGGER = 8;
const SLOT_BASE_START = 16;
const SELECT_FRAME = 48;
const DIM_END = 68;
const CONFIRM_START = 70;

// ── Layout ────────────────────────────────────────────────────────────────────
const SLOT_WIDTH = 140;
const SLOT_HEIGHT = 56;
const SLOT_RADIUS = 28;
const SLOT_FONT_SIZE = 18;
const SLOT_GAP = 16;
const HEADER_SIZE = 28;
const SUB_SIZE = 16;
const CONFIRM_SIZE = 15;

// ── Data ──────────────────────────────────────────────────────────────────────
const SLOTS = ['6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'];
const DEFAULT_SELECTED = 2;

interface SlotSelectionSceneProps {
  dark?: boolean;
  bg?: string;
  selectedSlot?: number;
}

export const SlotSelectionScene: React.FC<SlotSelectionSceneProps> = ({
  dark = false,
  bg,
  selectedSlot = DEFAULT_SELECTED,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;

  const headerSpring = spring({ frame: Math.max(0, frame - HEADER_START), fps, config: springFast });
  const headerY = interpolate(headerSpring, [0, 1], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const headerOp = interpolate(headerSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const selectSpring = spring({ frame: Math.max(0, frame - SELECT_FRAME), fps, config: springBounce });
  const selectScale = interpolate(selectSpring, [0, 0.6, 1], [1, 1.08, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const selectFill = interpolate(selectSpring, [0, 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const confirmSpring = spring({ frame: Math.max(0, frame - CONFIRM_START), fps, config: springFast });
  const confirmOp = interpolate(confirmSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const slotBg = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';
  const slotBorder = dark ? 'rgba(255,255,255,0.12)' : theme.colors.border;

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', opacity: headerOp, transform: `translateY(${headerY}px)` }}>
        <div style={{ fontFamily: theme.font.display, fontSize: HEADER_SIZE, fontWeight: theme.font.weights.bold, color: textColor, marginBottom: 8 }}>
          Pick a time
        </div>
        <div style={{ fontFamily: theme.font.display, fontSize: SUB_SIZE, fontWeight: theme.font.weights.regular, color: theme.colors.textMuted }}>
          Friday, 14 March
        </div>
      </div>

      {/* Slots */}
      <div style={{ display: 'flex', gap: SLOT_GAP, flexWrap: 'wrap', justifyContent: 'center' }}>
        {SLOTS.map((slot, i) => {
          const slotSpring = spring({ frame: Math.max(0, frame - (SLOT_BASE_START + i * SLOT_STAGGER)), fps, config: springFast });
          const slotY = interpolate(slotSpring, [0, 1], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const slotOp = interpolate(slotSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const isSelected = i === selectedSlot;
          const dimOp = frame > SELECT_FRAME && !isSelected
            ? interpolate(frame, [SELECT_FRAME, DIM_END], [1, 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            : 1;

          return (
            <div key={i} style={{
              width: SLOT_WIDTH, height: SLOT_HEIGHT,
              borderRadius: SLOT_RADIUS,
              backgroundColor: isSelected && selectFill > 0.5 ? theme.colors.accent : slotBg,
              border: `1.5px solid ${isSelected ? theme.colors.accent : slotBorder}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: slotOp * dimOp,
              transform: `translateY(${slotY}px) scale(${isSelected ? selectScale : 1})`,
              cursor: 'pointer',
            }}>
              <span style={{
                fontFamily: theme.font.display,
                fontSize: SLOT_FONT_SIZE,
                fontWeight: theme.font.weights.semibold,
                color: isSelected && selectFill > 0.5 ? theme.colors.bg : textColor,
              }}>
                {slot}
              </span>
            </div>
          );
        })}
      </div>

      {/* Confirmation */}
      <div style={{ opacity: confirmOp, fontFamily: theme.font.display, fontSize: CONFIRM_SIZE, color: theme.colors.success, fontWeight: theme.font.weights.semibold }}>
        {SLOTS[selectedSlot]} selected ✓
      </div>
    </AbsoluteFill>
  );
};
