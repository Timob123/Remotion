import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { springFast } from '../hooks/useSceneAnimation';

// ─── Colour constants ────────────────────────────────────────────────────────
const TERM_BG             = '#0d1117';
const PROMPT_COLOR        = '#39d353';
const CMD_COLOR           = '#e6edf3';
const OUTPUT_COLOR_SUCCESS = '#3fb950';
const OUTPUT_COLOR_URL    = '#58a6ff';
const OUTPUT_COLOR_MUTED  = '#8b949e';
const CHROME_BG           = '#161b22';
const CHROME_DOT_RED      = '#ff5f57';
const CHROME_DOT_YELLOW   = '#febc2e';
const CHROME_DOT_GREEN    = '#28c840';
const CHROME_TITLE_COLOR  = '#8b949e';
const WINDOW_BORDER_COLOR = 'rgba(255,255,255,0.08)';
const SHADOW_COLOR        = 'rgba(0,0,0,0.6)';

// ─── Timing constants ────────────────────────────────────────────────────────
const TERM_ENTRY_END   = 10;
const TYPE_START       = TERM_ENTRY_END;
const TYPE_END         = 45;
const OUTPUT_START     = 50;
const OUTPUT_STAGGER   = 6;
const CURSOR_BLINK_RATE = 7;

// ─── Layout constants ────────────────────────────────────────────────────────
const FONT_SIZE        = 16;
const FONT_FAMILY      = '"Fira Code", "Cascadia Code", monospace';
const LINE_HEIGHT      = 28;
const WINDOW_PADDING   = 24;
const CHROME_HEIGHT    = 36;
const CHROME_DOT_SIZE  = 12;
const CHROME_DOT_SPACING = 8;
const CHROME_DOT_MARGIN  = 14;
const WINDOW_WIDTH     = 800;
const WINDOW_MIN_HEIGHT = 320;
const WINDOW_RADIUS    = 10;
const SHADOW_Y         = 32;
const SHADOW_BLUR      = 80;
const SLIDE_DISTANCE   = 80;

// ─── Derived layout constants ─────────────────────────────────────────────────
const CHROME_DOT_RADIUS         = CHROME_DOT_SIZE / 2;
const CHROME_TITLE_FONT_SIZE    = FONT_SIZE - 2;
const CHROME_CONTENT_PADDING_RIGHT = CHROME_DOT_MARGIN + CHROME_DOT_SIZE * 3 + CHROME_DOT_SPACING * 2;

// ─── Content constants ───────────────────────────────────────────────────────
const COMMAND = 'npx deploy --prod --region=us-east-1';
const CURSOR_CHAR = '█';

const OUTPUT_LINES = [
  { text: '  ✓ Building for production...', color: OUTPUT_COLOR_SUCCESS },
  { text: '  ✓ Optimizing bundle (847 kB → 203 kB)', color: OUTPUT_COLOR_SUCCESS },
  { text: '  ✓ Deploying to edge network...', color: OUTPUT_COLOR_SUCCESS },
  { text: '    https://app.tapid.io', color: OUTPUT_COLOR_URL },
  { text: '  ✓ Done in 4.2s', color: OUTPUT_COLOR_MUTED },
];

// ─── Types ───────────────────────────────────────────────────────────────────
type TerminalSceneProps = {
  dark?: boolean;
  bg?: string;
};

// ─── Component ───────────────────────────────────────────────────────────────
export const TerminalScene: React.FC<TerminalSceneProps> = ({ bg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Window slide-in from bottom
  const entrySpring = spring({ frame, fps, config: springFast, durationInFrames: TERM_ENTRY_END });
  const translateY = interpolate(
    entrySpring,
    [0, 1],
    [SLIDE_DISTANCE, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const windowOpacity = interpolate(
    entrySpring,
    [0, 0.4],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Command typeout — how many chars are revealed
  const charsTyped = Math.floor(
    interpolate(
      frame,
      [TYPE_START, TYPE_END],
      [0, COMMAND.length],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    ),
  );
  const visibleCommand = COMMAND.slice(0, charsTyped);

  // Cursor blink — visible every other CURSOR_BLINK_RATE-frame window
  const cursorVisible = Math.floor(frame / CURSOR_BLINK_RATE) % 2 === 0;

  // Output lines — each fades in staggered after OUTPUT_START
  const outputOpacities = OUTPUT_LINES.map((_, i) => {
    const lineStart = OUTPUT_START + i * OUTPUT_STAGGER;
    return interpolate(
      frame,
      [lineStart, lineStart + OUTPUT_STAGGER],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    );
  });

  // Background — terminals are always dark; bg prop only affects the outer canvas
  const canvasBg = bg ?? TERM_BG;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: canvasBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Terminal window */}
      <div
        style={{
          width: WINDOW_WIDTH,
          minHeight: WINDOW_MIN_HEIGHT,
          borderRadius: WINDOW_RADIUS,
          overflow: 'hidden',
          transform: `translateY(${translateY}px)`,
          opacity: windowOpacity,
          boxShadow: `0 ${SHADOW_Y}px ${SHADOW_BLUR}px ${SHADOW_COLOR}`,
          border: `1px solid ${WINDOW_BORDER_COLOR}`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Chrome bar */}
        <div
          style={{
            height: CHROME_HEIGHT,
            backgroundColor: CHROME_BG,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: CHROME_DOT_MARGIN,
            gap: CHROME_DOT_SPACING,
            flexShrink: 0,
            borderBottom: `1px solid ${WINDOW_BORDER_COLOR}`,
          }}
        >
          {/* Traffic-light dots */}
          <div
            style={{
              width: CHROME_DOT_SIZE,
              height: CHROME_DOT_SIZE,
              borderRadius: CHROME_DOT_SIZE / 2,
              backgroundColor: CHROME_DOT_RED,
            }}
          />
          <div
            style={{
              width: CHROME_DOT_SIZE,
              height: CHROME_DOT_SIZE,
              borderRadius: CHROME_DOT_SIZE / 2,
              backgroundColor: CHROME_DOT_YELLOW,
            }}
          />
          <div
            style={{
              width: CHROME_DOT_SIZE,
              height: CHROME_DOT_SIZE,
              borderRadius: CHROME_DOT_SIZE / 2,
              backgroundColor: CHROME_DOT_GREEN,
            }}
          />
          {/* Title */}
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              fontFamily: FONT_FAMILY,
              fontSize: FONT_SIZE - 2,
              color: CHROME_TITLE_COLOR,
              paddingRight: CHROME_DOT_MARGIN + CHROME_DOT_SIZE * 3 + CHROME_DOT_SPACING * 2,
            }}
          >
            bash — 80×24
          </div>
        </div>

        {/* Terminal body */}
        <div
          style={{
            flex: 1,
            backgroundColor: TERM_BG,
            padding: WINDOW_PADDING,
            fontFamily: FONT_FAMILY,
            fontSize: FONT_SIZE,
            lineHeight: `${LINE_HEIGHT}px`,
            color: CMD_COLOR,
          }}
        >
          {/* Prompt + typing command */}
          <div style={{ display: 'flex', alignItems: 'baseline', whiteSpace: 'pre' }}>
            <span style={{ color: PROMPT_COLOR }}>{'$ '}</span>
            <span style={{ color: CMD_COLOR }}>{visibleCommand}</span>
            {cursorVisible && (
              <span style={{ color: CMD_COLOR }}>{CURSOR_CHAR}</span>
            )}
          </div>

          {/* Output lines */}
          {OUTPUT_LINES.map((line, i) => (
            <div
              key={i}
              style={{
                opacity: outputOpacities[i],
                color: line.color,
                whiteSpace: 'pre',
                lineHeight: `${LINE_HEIGHT}px`,
              }}
            >
              {line.text}
              {/* Cursor blinks after the last visible output line */}
              {i === OUTPUT_LINES.length - 1 && outputOpacities[i] > 0 && cursorVisible && (
                <span style={{ color: OUTPUT_COLOR_MUTED }}>{CURSOR_CHAR}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default TerminalScene;
