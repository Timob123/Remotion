import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast, springBounce } from '../hooks/useSceneAnimation';

// ── Timing ────────────────────────────────────────────────────────────────────
const FLOOR_ENTRY_END = 18;
const TABLE_STAGGER = 5;
const RESERVED_PULSE_START = 40;
const TAG_START = 52;

// ── Layout ────────────────────────────────────────────────────────────────────
const FLOOR_WIDTH = 680;
const FLOOR_HEIGHT = 480;
const FLOOR_RADIUS = 16;
const TABLE_RADIUS = 10;
const TABLE_SIZE_SM = 60;
const TABLE_SIZE_MD = 80;
const TABLE_SIZE_LG = 100;
const CHAIR_SIZE = 14;
const TAG_RADIUS = 8;
const TAG_FONT_SIZE = 12;
const TAG_PADDING = 8;

// ── Tables ────────────────────────────────────────────────────────────────────
const TABLES = [
  { x: 100, y: 80,  size: TABLE_SIZE_SM, chairs: 2, reserved: false },
  { x: 220, y: 80,  size: TABLE_SIZE_SM, chairs: 2, reserved: false },
  { x: 360, y: 80,  size: TABLE_SIZE_MD, chairs: 4, reserved: false },
  { x: 510, y: 80,  size: TABLE_SIZE_MD, chairs: 4, reserved: false },
  { x: 100, y: 230, size: TABLE_SIZE_MD, chairs: 4, reserved: false },
  { x: 260, y: 220, size: TABLE_SIZE_LG, chairs: 6, reserved: false },
  { x: 460, y: 220, size: TABLE_SIZE_LG, chairs: 6, reserved: true  },
  { x: 100, y: 390, size: TABLE_SIZE_SM, chairs: 2, reserved: false },
  { x: 290, y: 380, size: TABLE_SIZE_MD, chairs: 4, reserved: false },
  { x: 490, y: 380, size: TABLE_SIZE_SM, chairs: 2, reserved: false },
];

interface TableLayoutSceneProps {
  dark?: boolean;
  bg?: string;
  tableNumber?: number;
}

export const TableLayoutScene: React.FC<TableLayoutSceneProps> = ({ dark = false, bg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);

  const floorSpring = spring({ frame: Math.max(0, frame), fps, config: springFast });
  const floorScale = interpolate(floorSpring, [0, 1], [0.95, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const floorOp = interpolate(floorSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const pulseScale = frame >= RESERVED_PULSE_START
    ? 1 + Math.sin((frame - RESERVED_PULSE_START) * 0.18) * 0.04
    : 1;
  const pulseBorderOp = frame >= RESERVED_PULSE_START
    ? interpolate(Math.sin((frame - RESERVED_PULSE_START) * 0.18), [-1, 1], [0.5, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  const tagSpring = spring({ frame: Math.max(0, frame - TAG_START), fps, config: springBounce });
  const tagY = interpolate(tagSpring, [0, 1], [-10, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const tagOp = interpolate(tagSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const floorBg = dark ? '#1a1f2e' : '#f0ede8';
  const tableBg = dark ? 'rgba(255,255,255,0.1)' : theme.colors.surface;
  const tableBorder = dark ? 'rgba(255,255,255,0.15)' : theme.colors.border;
  const chairBg = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ opacity: floorOp, transform: `scale(${floorScale})`, position: 'relative', width: FLOOR_WIDTH, height: FLOOR_HEIGHT, backgroundColor: floorBg, borderRadius: FLOOR_RADIUS, overflow: 'visible' }}>
        {TABLES.map((table, i) => {
          const tableSpring = spring({ frame: Math.max(0, frame - i * TABLE_STAGGER), fps, config: springFast });
          const tableScale = interpolate(tableSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const tableOp = interpolate(tableSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

          const isReserved = table.reserved;
          const effectiveScale = isReserved ? tableScale * pulseScale : tableScale;

          return (
            <div key={i} style={{ position: 'absolute', left: table.x, top: table.y, opacity: tableOp, transform: `scale(${effectiveScale})`, transformOrigin: 'center' }}>
              {/* Chairs around table */}
              {table.chairs >= 2 && (
                <>
                  <div style={{ position: 'absolute', top: -CHAIR_SIZE - 3, left: table.size / 2 - CHAIR_SIZE / 2, width: CHAIR_SIZE, height: CHAIR_SIZE, borderRadius: 4, backgroundColor: chairBg, border: `1px solid ${tableBorder}` }} />
                  <div style={{ position: 'absolute', bottom: -CHAIR_SIZE - 3, left: table.size / 2 - CHAIR_SIZE / 2, width: CHAIR_SIZE, height: CHAIR_SIZE, borderRadius: 4, backgroundColor: chairBg, border: `1px solid ${tableBorder}` }} />
                </>
              )}
              {table.chairs >= 4 && (
                <>
                  <div style={{ position: 'absolute', left: -CHAIR_SIZE - 3, top: table.size / 2 - CHAIR_SIZE / 2, width: CHAIR_SIZE, height: CHAIR_SIZE, borderRadius: 4, backgroundColor: chairBg, border: `1px solid ${tableBorder}` }} />
                  <div style={{ position: 'absolute', right: -CHAIR_SIZE - 3, top: table.size / 2 - CHAIR_SIZE / 2, width: CHAIR_SIZE, height: CHAIR_SIZE, borderRadius: 4, backgroundColor: chairBg, border: `1px solid ${tableBorder}` }} />
                </>
              )}

              {/* Table */}
              <div style={{
                width: table.size, height: table.size,
                borderRadius: TABLE_RADIUS,
                backgroundColor: isReserved ? theme.colors.accentLight : tableBg,
                border: `${isReserved ? 2 : 1}px solid ${isReserved ? theme.colors.accent : tableBorder}`,
                opacity: isReserved ? pulseBorderOp : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxSizing: 'border-box',
              }}>
                {isReserved && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: theme.colors.accent }} />
                )}
              </div>

              {/* Reserved tag */}
              {isReserved && (
                <div style={{
                  position: 'absolute', bottom: table.size + 6, left: '50%',
                  transform: `translateX(-50%) translateY(${tagY}px)`,
                  opacity: tagOp,
                  backgroundColor: theme.colors.accent,
                  borderRadius: TAG_RADIUS,
                  padding: `${TAG_PADDING / 2}px ${TAG_PADDING}px`,
                  whiteSpace: 'nowrap',
                }}>
                  <span style={{ fontFamily: theme.font.display, fontSize: TAG_FONT_SIZE, fontWeight: theme.font.weights.semibold, color: theme.colors.bg }}>
                    Reserved
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
