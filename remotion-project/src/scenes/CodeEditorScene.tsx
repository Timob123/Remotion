import React from 'react';
import { AbsoluteFill, interpolate, spring, useVideoConfig, useCurrentFrame } from 'remotion';
import { theme } from '../config/theme';
import { springFast } from '../hooks/useSceneAnimation';

// Timing constants
const EDITOR_ENTRY_END   = 10; // frames for springFast to settle at 30fps (stiffness:200, damping:20)
const GHOST_APPEAR_START = 14;
const GHOST_APPEAR_END   = 30;
const ACCEPT_START       = 44;
const ACCEPT_END         = 52;
const CURSOR_BLINK_RATE  = 8;

// Layout constants
const EDITOR_WIDTH        = 840;
const EDITOR_HEIGHT       = 480;
const EDITOR_BORDER_RADIUS = 12;
const TAB_HEIGHT          = 36;
const LINE_HEIGHT_PX      = 24;
const LINE_NUMBER_WIDTH   = 48;
const EDITOR_FONT_SIZE    = 14;
const EDITOR_PADDING_LEFT = 16;
const EDITOR_PADDING_RIGHT = 16;
const GHOST_OPACITY_LOW   = 0.35;
const EDITOR_PADDING_TOP  = 16;
const LINE_HEADER_GAP     = 6;
const HEADER_PADDING_Y    = 4;
const HEADER_PADDING_X    = 14;
const HEADER_FONT_SIZE    = 12;
const HEADER_OPACITY      = 0.9;

// Shadow constants
const SHADOW_Y            = 24;
const SHADOW_BLUR         = 60;
const SHADOW_COLOR_RGB    = '0,0,0';
const SHADOW_ALPHA_DARK   = 0.7;
const SHADOW_ALPHA_LIGHT  = 0.15;

// Tab item radius
const TAB_ITEM_RADIUS     = 6;

// Cursor width
const CURSOR_WIDTH        = 2;

// Background colour constants
const EDITOR_DARK_BG  = '#1e1e2e';
const EDITOR_LIGHT_BG = '#fafafa';
const TAB_DARK_BG     = '#181825';
const TAB_LIGHT_BG    = '#f0eeeb';

// Syntax colours (Catppuccin Mocha palette)
const SYN_BASE  = '#cdd6f4';
const SYN_BLUE  = '#89b4fa';
const SYN_GREEN = '#a6e3a1';
const SYN_RED   = '#f38ba8';

// Line number gutter colour constant
const LINE_NUMBER_COLOR = 'rgba(205,214,244,0.2)';

// Code content — module-scope constants
const EXISTING_LINES = [
  { text: "import { useState, useCallback } from 'react';", color: SYN_BLUE },
  { text: '', color: SYN_BASE },
  { text: 'export function useDebounce<T>(value: T, delay: number) {', color: SYN_BASE },
  { text: '  const [debouncedValue, setDebouncedValue] = useState(value);', color: SYN_GREEN },
];
const GHOST_LINES = [
  { text: '  const callback = useCallback(() => {', color: SYN_BLUE },
  { text: '    setDebouncedValue(value);', color: SYN_GREEN },
  { text: '  }, [value]);', color: SYN_BLUE },
  { text: '', color: SYN_BASE },
  { text: '  useEffect(() => {', color: SYN_BLUE },
  { text: '    const timer = setTimeout(callback, delay);', color: SYN_BASE },
  { text: '    return () => clearTimeout(timer);', color: SYN_RED },
  { text: '  }, [callback, delay]);', color: SYN_BLUE },
];

type CodeEditorSceneProps = {
  filename?: string;
  dark?: boolean;
  bg?: string;
};

export const CodeEditorScene: React.FC<CodeEditorSceneProps> = ({
  filename,
  dark = true,
  bg,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrySettled = frame >= EDITOR_ENTRY_END;

  const accentColor = theme.colors.accent;
  const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const textColor = dark ? theme.colors.bg : theme.colors.text;

  // Entry animation
  const entrySpring   = spring({ frame, fps, config: springFast });
  const editorScale   = interpolate(entrySpring, [0, 1], [0.94, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const editorOpacity = interpolate(entrySpring, [0, 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Ghost / accept animation
  const ghostOpacity    = interpolate(frame, [GHOST_APPEAR_START, GHOST_APPEAR_END], [0, GHOST_OPACITY_LOW], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const acceptProgress  = interpolate(frame, [ACCEPT_START, ACCEPT_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const acceptedOpacity = interpolate(acceptProgress, [0, 1], [GHOST_OPACITY_LOW, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const cursorVisible = frame < GHOST_APPEAR_START && Math.floor(frame / CURSOR_BLINK_RATE) % 2 === 0;

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: EDITOR_WIDTH,
        height: EDITOR_HEIGHT,
        borderRadius: EDITOR_BORDER_RADIUS,
        overflow: 'hidden',
        transform: `scale(${editorScale})`,
        opacity: editorOpacity,
        boxShadow: `0 ${SHADOW_Y}px ${SHADOW_BLUR}px rgba(${SHADOW_COLOR_RGB},${dark ? SHADOW_ALPHA_DARK : SHADOW_ALPHA_LIGHT})`,
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* Tab bar */}
        <div style={{
          height: TAB_HEIGHT,
          backgroundColor: dark ? TAB_DARK_BG : TAB_LIGHT_BG,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: EDITOR_PADDING_LEFT,
          gap: LINE_HEADER_GAP,
          flexShrink: 0,
        }}>
          <div style={{
            padding: `${HEADER_PADDING_Y}px ${HEADER_PADDING_X}px`,
            borderRadius: `${TAB_ITEM_RADIUS}px ${TAB_ITEM_RADIUS}px 0 0`,
            backgroundColor: dark ? EDITOR_DARK_BG : EDITOR_LIGHT_BG,
            fontFamily: theme.font.display,
            fontSize: HEADER_FONT_SIZE,
            color: dark ? SYN_BASE : textColor,
            opacity: HEADER_OPACITY,
          }}>
            {filename ?? 'useDebounce.ts'}
          </div>
        </div>

        {/* Editor body */}
        <div style={{
          flex: 1,
          backgroundColor: dark ? EDITOR_DARK_BG : EDITOR_LIGHT_BG,
          fontFamily: 'monospace',
          fontSize: EDITOR_FONT_SIZE,
          lineHeight: `${LINE_HEIGHT_PX}px`,
          paddingTop: EDITOR_PADDING_TOP,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'hidden', // total line count (4 existing + 8 ghost) × LINE_HEIGHT_PX = 288px, well within EDITOR_HEIGHT
        }}>
          {/* Existing lines */}
          {EXISTING_LINES.map((line, i) => (
            <div key={i} style={{ display: 'flex', paddingLeft: EDITOR_PADDING_LEFT }}>
              <span style={{ width: LINE_NUMBER_WIDTH, color: LINE_NUMBER_COLOR, textAlign: 'right', paddingRight: EDITOR_PADDING_RIGHT, flexShrink: 0 }}>
                {i + 1}
              </span>
              <span style={{ color: dark ? line.color : textColor }}>{line.text}</span>
              {i === EXISTING_LINES.length - 1 && cursorVisible && (
                <span style={{ display: 'inline-block', width: CURSOR_WIDTH, height: EDITOR_FONT_SIZE, backgroundColor: accentColor, verticalAlign: 'middle' }} />
              )}
            </div>
          ))}

          {/* Ghost / accepted AI lines — only rendered after entry animation has settled */}
          {GHOST_LINES.map((line, i) => {
            const lineOpacity = frame >= ACCEPT_START ? acceptedOpacity : ghostOpacity;
            return (
              <div key={`g${i}`} style={{ display: entrySettled ? 'flex' : 'none', paddingLeft: EDITOR_PADDING_LEFT, opacity: lineOpacity }}>
                <span style={{ width: LINE_NUMBER_WIDTH, color: LINE_NUMBER_COLOR, textAlign: 'right', paddingRight: EDITOR_PADDING_RIGHT, flexShrink: 0 }}>
                  {EXISTING_LINES.length + i + 1}
                </span>
                <span style={{ color: frame >= ACCEPT_START ? line.color : (dark ? SYN_BASE : textColor) }}>
                  {line.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default CodeEditorScene;
