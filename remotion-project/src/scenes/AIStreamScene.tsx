import React from 'react';
import { AbsoluteFill, interpolate, spring, useVideoConfig, useCurrentFrame } from 'remotion';
import { theme } from '../config/theme';
import { springFast } from '../hooks/useSceneAnimation';

// Timing constants
const USER_BUBBLE_END   = 14;
const THINKING_START    = 18;
const THINKING_END      = 58; // dot 3 completes at THINKING_START+16+20=54, +4 frames fade = 58
const STREAM_START      = 62; // must follow THINKING_END
const STREAM_END        = 88; // fits within 90-frame scene budget
const CURSOR_BLINK_RATE = 7;

// Layout constants
const PANEL_WIDTH       = 640;
const BUBBLE_RADIUS     = 18;
const BUBBLE_TAIL_RADIUS = 4;
const FONT_SIZE         = 17;
const LINE_HEIGHT_PX    = 26;
const BUBBLE_PADDING_X  = 18;
const BUBBLE_PADDING_Y  = 12;
const BUBBLE_MAX_WIDTH  = '80%';
const DOT_SIZE          = 9;
const DOT_STAGGER       = 8;
const DOT_TRAVEL        = 6;
const DOT_GAP           = 6;
const DOT_OPACITY_BASE  = 0.5;
const AVATAR_SIZE       = 32;
const AVATAR_MARGIN     = 10;
const MSG_GAP           = 20;
const MSG_MARGIN_TOP    = 4;
const SUBTEXT_FONT_SIZE = 14;
const CURSOR_MARGIN_LEFT = 2;
const CURSOR_WIDTH      = 2;
const USER_BUBBLE_ALPHA = 0.13;
const ACCENT_RGB        = '99,102,241'; // matches theme.colors.accent #6366F1


type AIStreamSceneProps = {
  userMessage?: string;
  aiResponse?: string;
  dark?: boolean;
  bg?: string;
};

export const AIStreamScene: React.FC<AIStreamSceneProps> = ({
  userMessage,
  aiResponse,
  dark = true,
  bg,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accentColor = theme.colors.accent;
  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;

  // User message spring
  const userMsgSpring = spring({ frame, fps, config: springFast });
  const userBubbleX   = interpolate(userMsgSpring, [0, 1], [60, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const userBubbleOp  = interpolate(userMsgSpring, [0, 0.35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Guard: thinking dots only appear after user bubble animation settles
  const thinkingVisible = frame >= USER_BUBBLE_END;

  // Thinking dots — each bobs up/down with its own phase
  const dot1Y = interpolate(
    frame,
    [THINKING_START, THINKING_START + 12, THINKING_START + 20],
    [0, -DOT_TRAVEL, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const dot2Y = interpolate(
    frame,
    [THINKING_START + DOT_STAGGER, THINKING_START + DOT_STAGGER + 12, THINKING_START + DOT_STAGGER + 20],
    [0, -DOT_TRAVEL, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const dot3Y = interpolate(
    frame,
    [THINKING_START + DOT_STAGGER * 2, THINKING_START + DOT_STAGGER * 2 + 12, THINKING_START + DOT_STAGGER * 2 + 20],
    [0, -DOT_TRAVEL, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const thinkingOpacity = interpolate(
    frame,
    [THINKING_START, THINKING_START + 4, THINKING_END - 4, THINKING_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Streaming text
  const aiText  = aiResponse ?? "Here's a clean solution using React hooks. I've optimised for readability and performance.";
  const aiChars = Math.floor(interpolate(
    frame,
    [STREAM_START, STREAM_END],
    [0, aiText.length],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  ));
  const aiShown = aiText.slice(0, aiChars);
  const streamOpacity = interpolate(
    frame,
    [STREAM_START, STREAM_START + 6],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const cursorVisible = Math.floor(frame / CURSOR_BLINK_RATE) % 2 === 0;
  const userMsg = userMessage ?? 'Can you help me optimise this React component?';

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: PANEL_WIDTH, display: 'flex', flexDirection: 'column', gap: MSG_GAP }}>

        {/* User message — right aligned */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', transform: `translateX(${userBubbleX}px)`, opacity: userBubbleOp }}>
          <div style={{
            maxWidth: BUBBLE_MAX_WIDTH,
            backgroundColor: `rgba(${ACCENT_RGB},${USER_BUBBLE_ALPHA})`,
            borderRadius: `${BUBBLE_RADIUS}px ${BUBBLE_RADIUS}px ${BUBBLE_TAIL_RADIUS}px ${BUBBLE_RADIUS}px`,
            padding: `${BUBBLE_PADDING_Y}px ${BUBBLE_PADDING_X}px`,
            fontFamily: theme.font.display,
            fontSize: FONT_SIZE,
            lineHeight: `${LINE_HEIGHT_PX}px`,
            color: textColor,
          }}>
            {userMsg}
          </div>
        </div>

        {/* AI response row — left aligned */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: AVATAR_MARGIN, position: 'relative' }}>
          {/* Avatar */}
          <div style={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            borderRadius: '50%',
            backgroundColor: accentColor,
            flexShrink: 0,
            marginTop: MSG_MARGIN_TOP,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: SUBTEXT_FONT_SIZE,
            color: theme.colors.bg,
            fontFamily: theme.font.display,
            fontWeight: theme.font.weights.bold,
          }}>A</div>

          <div style={{ flex: 1, minHeight: LINE_HEIGHT_PX * 2 }}>
            {/* Thinking dots — only rendered after user bubble settles */}
            <div style={{
              display: thinkingVisible ? 'flex' : 'none',
              gap: DOT_GAP,
              alignItems: 'center',
              height: LINE_HEIGHT_PX,
              opacity: thinkingOpacity,
              position: 'absolute',
            }}>
              {[dot1Y, dot2Y, dot3Y].map((dy, i) => (
                <div key={i} style={{
                  width: DOT_SIZE,
                  height: DOT_SIZE,
                  borderRadius: '50%',
                  backgroundColor: textColor,
                  opacity: DOT_OPACITY_BASE,
                  transform: `translateY(${dy}px)`,
                }} />
              ))}
            </div>

            {/* Streamed AI text */}
            <div style={{
              fontFamily: theme.font.display,
              fontSize: FONT_SIZE,
              lineHeight: `${LINE_HEIGHT_PX}px`,
              color: textColor,
              opacity: streamOpacity,
            }}>
              {aiShown}
              {cursorVisible && aiChars < aiText.length && (
                <span style={{
                  display: 'inline-block',
                  width: CURSOR_WIDTH,
                  height: FONT_SIZE,
                  backgroundColor: accentColor,
                  verticalAlign: 'middle',
                  marginLeft: CURSOR_MARGIN_LEFT,
                }} />
              )}
            </div>
          </div>
        </div>

      </div>
    </AbsoluteFill>
  );
};

export default AIStreamScene;
