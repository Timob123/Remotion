import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast } from '../hooks/useSceneAnimation';

// ── Timing constants ──────────────────────────────────────────────────────────
const REQUEST_ENTRY_END  = 14;
const WIRE_L_START       = 16;
const WIRE_L_END         = 30;
const SPIN_START         = 18;
const SPIN_END           = 52;
const WIRE_R_START       = 48;
const WIRE_R_END         = 62;
const RESPONSE_START     = 60;
const RESPONSE_END       = 74;

// ── Layout constants ──────────────────────────────────────────────────────────
const BOX_WIDTH          = 260;
const BOX_HEIGHT         = 200;
const BOX_RADIUS         = 12;
const BOX_PADDING        = 16;
const WIRE_LENGTH        = 120;
const WIRE_HEIGHT        = 2;
const CENTRE_NODE_SIZE   = 56;
const CENTRE_NODE_RADIUS = 28;
const FONT_SIZE_MONO     = 13;
const STATUS_SIZE        = 22;

// ── Colour constants ──────────────────────────────────────────────────────────
const STATUS_OK_COLOR_R  = 52;
const STATUS_OK_COLOR_G  = 211;
const STATUS_OK_COLOR_B  = 153;

interface APIRequestSceneProps {
  endpoint?: string;
  dark?: boolean;
  bg?: string;
}

export const APIRequestScene: React.FC<APIRequestSceneProps> = ({
  endpoint,
  dark = false,
  bg,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgColor    = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor  = dark ? theme.colors.bg : theme.colors.text;
  const accentColor = theme.colors.accent;

  const ep = endpoint ?? 'POST /v1/completions';

  // Request box
  const reqSpring = spring({ frame, fps, config: springFast });
  const reqX  = interpolate(reqSpring, [0, 1], [-60, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const reqOp = interpolate(reqSpring, [0, 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Wire progress
  const wireLProgress = interpolate(frame, [WIRE_L_START, WIRE_L_END], [0, WIRE_LENGTH], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const wireRProgress = interpolate(frame, [WIRE_R_START, WIRE_R_END], [0, WIRE_LENGTH], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Spinner
  const spinAngle = interpolate(frame, [SPIN_START, SPIN_END], [0, 360 * 3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const spinnerOp = interpolate(
    frame,
    [SPIN_START, SPIN_START + 6, SPIN_END - 6, SPIN_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Response box
  const respSpring = spring({ frame: Math.max(0, frame - RESPONSE_START), fps, config: springFast });
  const respX  = interpolate(respSpring, [0, 1], [60, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const respOp = interpolate(respSpring, [0, 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const dimTextColor = dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
  const boxBg        = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  const boxBorder    = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)';
  const okColor      = `rgb(${STATUS_OK_COLOR_R},${STATUS_OK_COLOR_G},${STATUS_OK_COLOR_B})`;

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>

        {/* REQUEST box */}
        <div style={{
          width: BOX_WIDTH,
          height: BOX_HEIGHT,
          borderRadius: BOX_RADIUS,
          backgroundColor: boxBg,
          border: `1px solid ${boxBorder}`,
          padding: BOX_PADDING,
          transform: `translateX(${reqX}px)`,
          opacity: reqOp,
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}>
          <div style={{
            fontFamily: theme.font.display,
            fontSize: 11,
            color: dimTextColor,
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 10,
          }}>
            Request
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: FONT_SIZE_MONO, color: textColor, lineHeight: '20px' }}>
            <div style={{ color: accentColor }}>{ep}</div>
            <div style={{ marginTop: 8, opacity: 0.7 }}>{'{'}</div>
            <div style={{ paddingLeft: 16, opacity: 0.7 }}>&quot;model&quot;: &quot;claude-3&quot;,</div>
            <div style={{ paddingLeft: 16, opacity: 0.7 }}>&quot;max_tokens&quot;: 1024,</div>
            <div style={{ paddingLeft: 16, opacity: 0.7 }}>&quot;messages&quot;: [...]</div>
            <div style={{ opacity: 0.7 }}>{'}'}</div>
          </div>
        </div>

        {/* Left wire */}
        <div style={{
          width: wireLProgress,
          height: WIRE_HEIGHT,
          backgroundColor: accentColor,
          flexShrink: 0,
        }} />

        {/* Centre node */}
        <div style={{
          width: CENTRE_NODE_SIZE,
          height: CENTRE_NODE_SIZE,
          borderRadius: CENTRE_NODE_RADIUS,
          backgroundColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          border: `2px solid ${accentColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          opacity: spinnerOp,
        }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: `2.5px solid ${accentColor}`,
            borderTopColor: 'transparent',
            transform: `rotate(${spinAngle}deg)`,
          }} />
        </div>

        {/* Right wire */}
        <div style={{
          width: wireRProgress,
          height: WIRE_HEIGHT,
          backgroundColor: okColor,
          flexShrink: 0,
        }} />

        {/* RESPONSE box */}
        <div style={{
          width: BOX_WIDTH,
          height: BOX_HEIGHT,
          borderRadius: BOX_RADIUS,
          backgroundColor: boxBg,
          border: `1px solid ${okColor}`,
          padding: BOX_PADDING,
          transform: `translateX(${respX}px)`,
          opacity: respOp,
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}>
          <div style={{
            fontFamily: theme.font.display,
            fontSize: 11,
            color: dimTextColor,
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 10,
          }}>
            Response
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ fontSize: STATUS_SIZE, fontWeight: 700, fontFamily: theme.font.display, color: okColor }}>200</div>
            <div style={{ fontSize: 13, fontFamily: theme.font.display, color: okColor, opacity: 0.8 }}>OK</div>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: FONT_SIZE_MONO, color: textColor, lineHeight: '20px' }}>
            <div style={{ opacity: 0.7 }}>{'{'}</div>
            <div style={{ paddingLeft: 16, opacity: 0.7 }}>&quot;id&quot;: &quot;msg_01X...&quot;,</div>
            <div style={{ paddingLeft: 16, opacity: 0.7 }}>&quot;content&quot;: &quot;...&quot;,</div>
            <div style={{ paddingLeft: 16, opacity: 0.7 }}>&quot;usage&quot;: {'{'} &quot;tokens&quot;: 412 {'}'}</div>
            <div style={{ opacity: 0.7 }}>{'}'}</div>
          </div>
        </div>

      </div>
    </AbsoluteFill>
  );
};
