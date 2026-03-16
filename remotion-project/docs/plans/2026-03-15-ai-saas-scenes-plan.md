# AI SaaS Scenes — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Build 10 complex AI SaaS-themed Remotion scenes inspired by Cursor, Claude, Vercel, Linear, and Perplexity — device mockups, live AI interactions, dashboards, and abstract visuals.

**Architecture:** Each scene is a fully self-contained TSX file, 90 frames @ 30fps (3 s). Same rules as previous impact scenes: module-scope constants, both extrapolate clamps, theme tokens only, no useState/useEffect/CSS keyframes. All registered in `src/Root.tsx`. After all 10 are done, add them to a new `AISaaSReel` composition.

**Tech Stack:** Remotion 4, React, TypeScript, inline SVG for charts/wires/neural paths, CSS perspective for the laptop lid, `../config/theme`, `../hooks/useSceneAnimation`

---

## Shared Rules (apply to every scene)

```tsx
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast, springBounce } from '../hooks/useSceneAnimation';

// Inside component:
const frame = useCurrentFrame();
const { fps } = useVideoConfig();           // only if scene uses spring()
const bgColor  = bg ?? (dark ? theme.colors.text : theme.colors.bg);
const textColor = dark ? theme.colors.bg : theme.colors.text;
const accentColor = theme.colors.accent;
```

- Only import `spring`/`useVideoConfig`/`springFast`/`springBounce` when the scene actually uses them
- Every `interpolate()` → both `{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }`
- No hardcoded colour strings (`'transparent'` as CSS keyword is OK; `'#fff'` is not — use `theme.colors.bg`)
- All numbers at module scope as named constants

---

## Task 1: LaptopOpenScene + BrowserLoadScene

**Files to create:**
- `src/scenes/LaptopOpenScene.tsx`
- `src/scenes/BrowserLoadScene.tsx`

---

### LaptopOpenScene

**Concept:** MacBook-style laptop. Lid is closed (nearly flat). Over the first 20 frames the lid rotates open using a CSS perspective+rotateX trick. Then the screen glows on, a URL types in the address bar, a loading bar fills, and a blurred content block resolves into readable text.

**Props:** `url?: string`, `dark?: boolean`, `bg?: string`

**Module-scope constants:**
```ts
const LID_OPEN_START    = 0;
const LID_OPEN_END      = 22;
const SCREEN_GLOW_START = 18;
const SCREEN_GLOW_END   = 28;
const URL_TYPE_START    = 30;
const URL_TYPE_END      = 56;
const LOAD_BAR_START    = 56;
const LOAD_BAR_END      = 72;
const CONTENT_FADE_START = 70;
const CONTENT_FADE_END   = 86;

const LAPTOP_WIDTH      = 680;
const BASE_HEIGHT       = 36;
const SCREEN_HEIGHT     = 400;
const LID_BORDER_RADIUS = 14;
const BASE_BORDER_RADIUS = 6;
const HINGE_HEIGHT      = 6;
const SCREEN_PADDING    = 20;
const ADDRESS_BAR_HEIGHT = 32;
const ADDRESS_BAR_RADIUS = 6;
const LOAD_BAR_HEIGHT   = 3;
const CONTENT_LINE_HEIGHT = 14;
const CONTENT_LINE_RADIUS = 4;
```

**Animation:**
```ts
// Lid open: perspective rotateX 80° → 0°
const lidSpring = spring({ frame, fps, config: springFast });
const lidRotateX = interpolate(lidSpring, [0, 1], [80, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

// Screen brightness
const screenGlow = interpolate(frame, [SCREEN_GLOW_START, SCREEN_GLOW_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

// URL typing
const urlString = url ?? 'app.tapid.io';
const charsShown = Math.floor(interpolate(frame, [URL_TYPE_START, URL_TYPE_END], [0, urlString.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

// Loading bar
const loadProgress = interpolate(frame, [LOAD_BAR_START, LOAD_BAR_END], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

// Content fade + blur resolve
const contentOpacity = interpolate(frame, [CONTENT_FADE_START, CONTENT_FADE_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const contentBlur = interpolate(frame, [CONTENT_FADE_START, CONTENT_FADE_END], [8, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
```

**JSX structure:**
```tsx
<AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  {/* Outer perspective wrapper for the lid rotation */}
  <div style={{ perspective: 1200, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

    {/* LID — rotates open around bottom edge */}
    <div style={{
      width: LAPTOP_WIDTH,
      height: SCREEN_HEIGHT,
      backgroundColor: textColor,
      borderRadius: `${LID_BORDER_RADIUS}px ${LID_BORDER_RADIUS}px 0 0`,
      transformOrigin: 'bottom center',
      transform: `rotateX(${lidRotateX}deg)`,
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Screen interior */}
      <div style={{
        position: 'absolute', inset: SCREEN_PADDING,
        backgroundColor: screenGlow > 0 ? `rgba(${dark ? '247,246,243' : '17,17,16'},${screenGlow * (dark ? 1 : 0.95)})` : textColor,
        borderRadius: LID_BORDER_RADIUS - 4,
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Address bar */}
        <div style={{
          height: ADDRESS_BAR_HEIGHT,
          backgroundColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          borderRadius: ADDRESS_BAR_RADIUS,
          margin: '12px 16px 0',
          display: 'flex', alignItems: 'center',
          paddingLeft: 12,
          opacity: screenGlow,
        }}>
          <span style={{ fontFamily: theme.font.display, fontSize: 13, color: dark ? theme.colors.bg : theme.colors.text, opacity: 0.6 }}>
            {urlString.slice(0, charsShown)}
            {/* blinking cursor */}
            <span style={{ opacity: Math.floor(frame / 4) % 2 === 0 ? 1 : 0 }}>|</span>
          </span>
        </div>

        {/* Loading bar */}
        <div style={{ height: LOAD_BAR_HEIGHT, backgroundColor: accentColor, width: `${loadProgress}%`, marginTop: 2, marginLeft: 16, borderRadius: 2 }} />

        {/* Page content placeholder blocks */}
        <div style={{ padding: 16, flex: 1, opacity: contentOpacity, filter: `blur(${contentBlur}px)` }}>
          {/* Hero block */}
          <div style={{ height: 80, backgroundColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', borderRadius: 6, marginBottom: 12 }} />
          {/* Text lines */}
          {[100, 80, 90, 60].map((w, i) => (
            <div key={i} style={{ height: CONTENT_LINE_HEIGHT, width: `${w}%`, backgroundColor: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)', borderRadius: CONTENT_LINE_RADIUS, marginBottom: 8 }} />
          ))}
        </div>
      </div>
    </div>

    {/* HINGE */}
    <div style={{ width: LAPTOP_WIDTH * 0.6, height: HINGE_HEIGHT, backgroundColor: dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)' }} />

    {/* BASE */}
    <div style={{
      width: LAPTOP_WIDTH,
      height: BASE_HEIGHT,
      backgroundColor: textColor,
      borderRadius: `0 0 ${BASE_BORDER_RADIUS}px ${BASE_BORDER_RADIUS}px`,
      opacity: 0.9,
    }} />
  </div>
</AbsoluteFill>
```

**Root.tsx entry:**
```tsx
<Composition id="LaptopOpen" component={LaptopOpenScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ url: 'app.tapid.io', dark: true }} />
```

---

### BrowserLoadScene

**Concept:** Arc/Chrome-style browser window (dark or light). Window slides down from above. Traffic-light buttons. URL bar with animated typing. A thin indigo loading bar sweeps across. Then the content area reveals with skeleton-to-content transition.

**Props:** `url?: string`, `pageTitle?: string`, `dark?: boolean`, `bg?: string`

**Module-scope constants:**
```ts
const BROWSER_ENTRY_START = 0;
const BROWSER_ENTRY_END   = 14;
const URL_TYPE_START      = 16;
const URL_TYPE_END        = 44;
const LOAD_START          = 46;
const LOAD_END            = 64;
const CONTENT_IN_START    = 62;
const CONTENT_IN_END      = 80;

const BROWSER_WIDTH       = 960;
const BROWSER_HEIGHT      = 580;
const CHROME_HEIGHT       = 48;
const TRAFFIC_SIZE        = 12;
const TRAFFIC_GAP         = 8;
const URL_BAR_HEIGHT      = 28;
const URL_BAR_RADIUS      = 14;
const LOAD_BAR_HEIGHT     = 2;
const BROWSER_RADIUS      = 12;
const CONTENT_PADDING     = 24;
const SKELETON_RADIUS     = 4;
```

**Animation:**
```ts
const entrySpring = spring({ frame, fps, config: springFast });
const browserY = interpolate(entrySpring, [0, 1], [-80, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const browserOpacity = interpolate(entrySpring, [0, 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const urlStr = url ?? 'app.tapid.io/dashboard';
const charsShown = Math.floor(interpolate(frame, [URL_TYPE_START, URL_TYPE_END], [0, urlStr.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

const loadProgress = interpolate(frame, [LOAD_START, LOAD_END], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const contentOpacity = interpolate(frame, [CONTENT_IN_START, CONTENT_IN_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
```

**JSX structure:**
```tsx
<AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  <div style={{
    width: BROWSER_WIDTH, height: BROWSER_HEIGHT,
    borderRadius: BROWSER_RADIUS,
    overflow: 'hidden',
    transform: `translateY(${browserY}px)`,
    opacity: browserOpacity,
    boxShadow: `0 32px 80px rgba(0,0,0,${dark ? 0.6 : 0.18})`,
    display: 'flex', flexDirection: 'column',
    backgroundColor: dark ? '#1a1a1a' : theme.colors.bg,
  }}>

    {/* Chrome bar */}
    <div style={{
      height: CHROME_HEIGHT, backgroundColor: dark ? '#252525' : '#f0eeeb',
      display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, flexShrink: 0,
    }}>
      {/* Traffic lights */}
      <div style={{ display: 'flex', gap: TRAFFIC_GAP }}>
        {['#FF5F57','#FFBD2E','#28C840'].map((c, i) => (
          <div key={i} style={{ width: TRAFFIC_SIZE, height: TRAFFIC_SIZE, borderRadius: '50%', backgroundColor: c }} />
        ))}
      </div>
      {/* Address bar */}
      <div style={{
        flex: 1, height: URL_BAR_HEIGHT, borderRadius: URL_BAR_RADIUS,
        backgroundColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
        display: 'flex', alignItems: 'center', paddingLeft: 14,
      }}>
        <span style={{ fontFamily: theme.font.display, fontSize: 13, color: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
          {urlStr.slice(0, charsShown)}
          <span style={{ opacity: Math.floor(frame / 4) % 2 === 0 ? 1 : 0 }}>|</span>
        </span>
      </div>
    </div>

    {/* Loading bar */}
    <div style={{ height: LOAD_BAR_HEIGHT, backgroundColor: accentColor, width: `${loadProgress}%`, flexShrink: 0 }} />

    {/* Content area */}
    <div style={{ flex: 1, padding: CONTENT_PADDING, opacity: contentOpacity, overflow: 'hidden' }}>
      {/* Nav */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 28 }}>
        {[60, 80, 70, 50].map((w, i) => (
          <div key={i} style={{ height: 12, width: w, borderRadius: SKELETON_RADIUS, backgroundColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }} />
        ))}
      </div>
      {/* Hero */}
      <div style={{ height: 200, borderRadius: 8, backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', marginBottom: 20 }}>
        <div style={{ padding: 28 }}>
          <div style={{ height: 28, width: 320, borderRadius: SKELETON_RADIUS, backgroundColor: dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)', marginBottom: 12 }} />
          {[280, 240, 180].map((w, i) => (
            <div key={i} style={{ height: 12, width: w, borderRadius: SKELETON_RADIUS, backgroundColor: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)', marginBottom: 8 }} />
          ))}
        </div>
      </div>
      {/* Card row */}
      <div style={{ display: 'flex', gap: 16 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ flex: 1, height: 80, borderRadius: 8, backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }} />
        ))}
      </div>
    </div>
  </div>
</AbsoluteFill>
```

**Note on hardcoded traffic light colours:** The traffic light colours (`#FF5F57`, `#FFBD2E`, `#28C840`) are a well-known macOS UI convention, not brand colours. Define them as module-scope constants:
```ts
const TRAFFIC_RED    = '#FF5F57';
const TRAFFIC_YELLOW = '#FFBD2E';
const TRAFFIC_GREEN  = '#28C840';
```

**Note on browser bg:** Use `dark ? '#1a1a1a' : theme.colors.bg` — define `const BROWSER_DARK_BG = '#1a1a1a'` at module scope.

**Root.tsx entry:**
```tsx
<Composition id="BrowserLoad" component={BrowserLoadScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ url: 'app.tapid.io/dashboard', pageTitle: 'Dashboard', dark: true }} />
```

**Step:** After creating both files, add imports + compositions to `src/Root.tsx`. Commit: `git commit -m "feat: add LaptopOpen, BrowserLoad scenes"`

---

## Task 2: AIStreamScene + CodeEditorScene

**Files to create:**
- `src/scenes/AIStreamScene.tsx`
- `src/scenes/CodeEditorScene.tsx`

---

### AIStreamScene

**Concept:** Claude/ChatGPT-style chat panel floating in the centre. A user message bubble slides in from the right. Three thinking dots pulse. Then the AI response streams in character by character with a blinking cursor at the end. Clean, minimal — the signature AI product moment.

**Props:** `userMessage?: string`, `aiResponse?: string`, `dark?: boolean`, `bg?: string`

**Module-scope constants:**
```ts
const USER_BUBBLE_END    = 14;
const THINKING_START     = 18;
const THINKING_END       = 36;
const STREAM_START       = 38;
const CURSOR_BLINK_RATE  = 7;

const PANEL_WIDTH        = 640;
const BUBBLE_RADIUS      = 18;
const USER_BUBBLE_RADIUS = 18;
const AI_BUBBLE_RADIUS   = 4;
const FONT_SIZE          = 17;
const LINE_HEIGHT_PX     = 26;
const BUBBLE_PADDING_X   = 18;
const BUBBLE_PADDING_Y   = 12;
const DOT_SIZE           = 9;
const DOT_STAGGER        = 8;
const DOT_TRAVEL         = 6;
const AVATAR_SIZE        = 32;
const AVATAR_MARGIN      = 10;
const MSG_GAP            = 20;
const USER_BUBBLE_OPACITY = 0.13;
```

**Animation:**
```ts
const userMsgSpring = spring({ frame, fps, config: springFast });
const userBubbleX   = interpolate(userMsgSpring, [0, 1], [60, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const userBubbleOp  = interpolate(userMsgSpring, [0, 0.35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

// Thinking dots — each dot bobs up/down
const dot1Y = interpolate(frame, [THINKING_START, THINKING_START + 12, THINKING_START + 20], [0, -DOT_TRAVEL, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const dot2Y = interpolate(frame, [THINKING_START + DOT_STAGGER, THINKING_START + DOT_STAGGER + 12, THINKING_START + DOT_STAGGER + 20], [0, -DOT_TRAVEL, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const dot3Y = interpolate(frame, [THINKING_START + DOT_STAGGER * 2, THINKING_START + DOT_STAGGER * 2 + 12, THINKING_START + DOT_STAGGER * 2 + 20], [0, -DOT_TRAVEL, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const thinkingOpacity = interpolate(frame, [THINKING_START, THINKING_START + 4, THINKING_END - 4, THINKING_END], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

// AI streaming text
const aiText  = aiResponse ?? 'Here\'s a clean solution using React hooks. I\'ve optimised for readability and performance.';
const aiChars = Math.floor(interpolate(frame, [STREAM_START, STREAM_START + aiText.length * 1.5], [0, aiText.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
const aiShown = aiText.slice(0, aiChars);
const streamOpacity = interpolate(frame, [STREAM_START, STREAM_START + 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const cursorVisible = Math.floor(frame / CURSOR_BLINK_RATE) % 2 === 0;
const userMsg = userMessage ?? 'Can you help me optimise this React component?';
```

**JSX structure:**
```tsx
<AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  <div style={{ width: PANEL_WIDTH, display: 'flex', flexDirection: 'column', gap: MSG_GAP }}>

    {/* User message (right-aligned) */}
    <div style={{
      display: 'flex', justifyContent: 'flex-end',
      transform: `translateX(${userBubbleX}px)`, opacity: userBubbleOp,
    }}>
      <div style={{
        maxWidth: '80%',
        backgroundColor: accentColor,
        backgroundOpacity: USER_BUBBLE_OPACITY,  // Note: use rgba: `rgba(99,102,241,${USER_BUBBLE_OPACITY})`
        borderRadius: `${USER_BUBBLE_RADIUS}px ${USER_BUBBLE_RADIUS}px 4px ${USER_BUBBLE_RADIUS}px`,
        padding: `${BUBBLE_PADDING_Y}px ${BUBBLE_PADDING_X}px`,
        fontFamily: theme.font.display,
        fontSize: FONT_SIZE,
        lineHeight: `${LINE_HEIGHT_PX}px`,
        color: textColor,
      }}>
        {userMsg}
      </div>
    </div>

    {/* AI response row (left-aligned) */}
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: AVATAR_MARGIN }}>
      {/* Avatar dot */}
      <div style={{
        width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: '50%',
        backgroundColor: accentColor, flexShrink: 0, marginTop: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, color: theme.colors.bg, fontFamily: theme.font.display, fontWeight: 700,
      }}>A</div>

      <div style={{ flex: 1 }}>
        {/* Thinking dots */}
        <div style={{
          display: 'flex', gap: 6, alignItems: 'center',
          height: LINE_HEIGHT_PX * 2, opacity: thinkingOpacity,
          position: 'absolute',
        }}>
          {[dot1Y, dot2Y, dot3Y].map((dy, i) => (
            <div key={i} style={{
              width: DOT_SIZE, height: DOT_SIZE, borderRadius: '50%',
              backgroundColor: textColor, opacity: 0.5,
              transform: `translateY(${dy}px)`,
            }} />
          ))}
        </div>

        {/* Streamed text */}
        <div style={{
          fontFamily: theme.font.display, fontSize: FONT_SIZE, lineHeight: `${LINE_HEIGHT_PX}px`,
          color: textColor, opacity: streamOpacity,
        }}>
          {aiShown}
          {cursorVisible && aiChars < aiText.length && (
            <span style={{ display: 'inline-block', width: 2, height: FONT_SIZE, backgroundColor: accentColor, verticalAlign: 'middle', marginLeft: 2 }} />
          )}
        </div>
      </div>
    </div>
  </div>
</AbsoluteFill>
```

**Note:** For the user bubble background, use inline rgba string with the accent hex split out:
```ts
const ACCENT_RGB = '99,102,241'; // matches theme.colors.accent #6366F1 — define as module-scope const
// In style: backgroundColor: `rgba(${ACCENT_RGB},${USER_BUBBLE_OPACITY})`
```

**Root.tsx entry:**
```tsx
<Composition id="AIStream" component={AIStreamScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: true }} />
```

---

### CodeEditorScene

**Concept:** Cursor/VS Code style editor. A file tab and line numbers are visible. The cursor blinks at the end of existing code. Then AI ghost-text (muted colour) appears on the next lines. After a pause, the ghost text "accepts" — it brightens to full opacity. New code lines animate in with a syntax-highlight colour.

**Props:** `filename?: string`, `dark?: boolean`, `bg?: string`

**Module-scope constants:**
```ts
const EDITOR_ENTRY_END    = 10;
const GHOST_APPEAR_START  = 14;
const GHOST_APPEAR_END    = 30;
const ACCEPT_START        = 44;
const ACCEPT_END          = 52;

const EDITOR_WIDTH        = 840;
const EDITOR_HEIGHT       = 480;
const TAB_HEIGHT          = 36;
const LINE_HEIGHT_PX      = 24;
const LINE_NUMBER_WIDTH   = 48;
const EDITOR_FONT_SIZE    = 14;
const EDITOR_PADDING_LEFT = 16;
const GHOST_OPACITY_LOW   = 0.35;
const CURSOR_BLINK_RATE   = 8;
const EDITOR_DARK_BG      = '#1e1e2e';  // module-scope constant (Catppuccin Mocha)
const EDITOR_LIGHT_BG     = '#fafafa';
const TAB_DARK_BG         = '#181825';
const TAB_LIGHT_BG        = '#f0eeeb';
```

**Animation:**
```ts
const entrySpring = spring({ frame, fps, config: springFast });
const editorScale = interpolate(entrySpring, [0, 1], [0.94, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const editorOpacity = interpolate(entrySpring, [0, 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const ghostOpacity = interpolate(frame, [GHOST_APPEAR_START, GHOST_APPEAR_END], [0, GHOST_OPACITY_LOW], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const acceptProgress = interpolate(frame, [ACCEPT_START, ACCEPT_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const acceptedOpacity = interpolate(acceptProgress, [0, 1], [GHOST_OPACITY_LOW, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const cursorVisible = frame < GHOST_APPEAR_START && Math.floor(frame / CURSOR_BLINK_RATE) % 2 === 0;
```

**Hard-coded code lines** (use these exact strings — they look realistic):
```ts
const EXISTING_LINES = [
  { text: 'import { useState, useCallback } from \'react\';', color: '#cdd6f4' },
  { text: '', color: '#cdd6f4' },
  { text: 'export function useDebounce<T>(value: T, delay: number) {', color: '#cdd6f4' },
  { text: '  const [debouncedValue, setDebouncedValue] = useState(value);', color: '#cdd6f4' },
];
const GHOST_LINES = [
  { text: '  const callback = useCallback(() => {', color: '#89b4fa' },
  { text: '    setDebouncedValue(value);', color: '#a6e3a1' },
  { text: '  }, [value]);', color: '#89b4fa' },
  { text: '', color: '#cdd6f4' },
  { text: '  useEffect(() => {', color: '#89b4fa' },
  { text: '    const timer = setTimeout(callback, delay);', color: '#cdd6f4' },
  { text: '    return () => clearTimeout(timer);', color: '#f38ba8' },
  { text: '  }, [callback, delay]);', color: '#89b4fa' },
];
```

These are module-scope constants (arrays). The colours are syntax-highlight values — define them as module-scope string constants:
```ts
const SYN_BASE    = '#cdd6f4';
const SYN_BLUE    = '#89b4fa';
const SYN_GREEN   = '#a6e3a1';
const SYN_RED     = '#f38ba8';
```

**JSX structure:**
```tsx
<AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  <div style={{
    width: EDITOR_WIDTH, height: EDITOR_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    transform: `scale(${editorScale})`,
    opacity: editorOpacity,
    boxShadow: `0 24px 60px rgba(0,0,0,${dark ? 0.7 : 0.15})`,
    display: 'flex', flexDirection: 'column',
  }}>
    {/* Tab bar */}
    <div style={{
      height: TAB_HEIGHT,
      backgroundColor: dark ? TAB_DARK_BG : TAB_LIGHT_BG,
      display: 'flex', alignItems: 'center', paddingLeft: 16, gap: 6, flexShrink: 0,
    }}>
      <div style={{
        padding: '4px 14px', borderRadius: '6px 6px 0 0',
        backgroundColor: dark ? EDITOR_DARK_BG : EDITOR_LIGHT_BG,
        fontFamily: theme.font.display, fontSize: 12,
        color: dark ? SYN_BASE : theme.colors.text, opacity: 0.9,
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
      paddingTop: 16,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Existing lines */}
      {EXISTING_LINES.map((line, i) => (
        <div key={i} style={{ display: 'flex', paddingLeft: EDITOR_PADDING_LEFT }}>
          <span style={{ width: LINE_NUMBER_WIDTH, color: dark ? 'rgba(205,214,244,0.2)' : 'rgba(0,0,0,0.2)', textAlign: 'right', paddingRight: 16, flexShrink: 0 }}>{i + 1}</span>
          <span style={{ color: line.color }}>{line.text}</span>
          {i === EXISTING_LINES.length - 1 && cursorVisible && (
            <span style={{ display: 'inline-block', width: 2, height: EDITOR_FONT_SIZE, backgroundColor: accentColor, verticalAlign: 'middle' }} />
          )}
        </div>
      ))}

      {/* Ghost / accepted lines */}
      {GHOST_LINES.map((line, i) => {
        const lineOpacity = frame >= ACCEPT_START ? acceptedOpacity : ghostOpacity;
        return (
          <div key={`g${i}`} style={{ display: 'flex', paddingLeft: EDITOR_PADDING_LEFT, opacity: lineOpacity }}>
            <span style={{ width: LINE_NUMBER_WIDTH, color: dark ? 'rgba(205,214,244,0.2)' : 'rgba(0,0,0,0.2)', textAlign: 'right', paddingRight: 16, flexShrink: 0 }}>
              {EXISTING_LINES.length + i + 1}
            </span>
            <span style={{ color: frame >= ACCEPT_START ? line.color : (dark ? SYN_BASE : theme.colors.text) }}>
              {line.text}
            </span>
          </div>
        );
      })}
    </div>
  </div>
</AbsoluteFill>
```

**Root.tsx entry:**
```tsx
<Composition id="CodeEditor" component={CodeEditorScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: true }} />
```

**Step:** Add both imports + compositions to Root.tsx. Commit: `git commit -m "feat: add AIStream, CodeEditor scenes"`

---

## Task 3: TerminalScene + DashboardRevealScene

**Files to create:**
- `src/scenes/TerminalScene.tsx`
- `src/scenes/DashboardRevealScene.tsx`

---

### TerminalScene

**Concept:** macOS terminal window (dark always). Window chrome with traffic lights and a title. Prompt `$` appears. A command types character by character. Enter is pressed (cursor disappears). A spinner (rotating `|/-\` chars) pulses for ~half a second. Then output lines cascade down one by one.

**Props:** `command?: string`, `output?: string[]`, `dark?: boolean`, `bg?: string`

**Module-scope constants:**
```ts
const WINDOW_ENTRY_END  = 10;
const PROMPT_FADE_END   = 16;
const CMD_TYPE_START    = 18;
const CMD_TYPE_END      = 44;
const SPINNER_START     = 46;
const SPINNER_END       = 60;
const OUTPUT_START      = 60;
const LINE_STAGGER      = 5;

const TERMINAL_WIDTH    = 720;
const TERMINAL_HEIGHT   = 420;
const CHROME_HEIGHT     = 40;
const FONT_SIZE         = 15;
const LINE_HEIGHT_PX    = 22;
const PADDING           = 20;
const TERMINAL_BG       = '#0d0d0d';
const TERMINAL_CHROME   = '#1c1c1c';
const PROMPT_COLOR_R    = 134;  // rgb components of a terminal green, use as rgba
const PROMPT_COLOR_G    = 239;
const PROMPT_COLOR_B    = 172;
const OUTPUT_OPACITY_START = 0;
const TRAFFIC_RED       = '#FF5F57';
const TRAFFIC_YELLOW    = '#FFBD2E';
const TRAFFIC_GREEN     = '#28C840';
const TRAFFIC_SIZE      = 12;
const TRAFFIC_GAP       = 8;
```

**Animation:**
```ts
const entrySpring = spring({ frame, fps, config: springFast });
const windowY = interpolate(entrySpring, [0, 1], [-60, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const windowOpacity = interpolate(entrySpring, [0, 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const promptOpacity = interpolate(frame, [8, PROMPT_FADE_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const cmd = command ?? 'claude "refactor auth.ts for better error handling"';
const charsShown = Math.floor(interpolate(frame, [CMD_TYPE_START, CMD_TYPE_END], [0, cmd.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

const SPINNER_CHARS = ['|', '/', '-', '\\'];
const spinnerChar = SPINNER_CHARS[Math.floor((frame - SPINNER_START) / 4) % SPINNER_CHARS.length];
const spinnerOpacity = interpolate(frame, [SPINNER_START, SPINNER_START + 4, SPINNER_END - 4, SPINNER_END], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const defaultOutput = [
  '✓ Reading auth.ts (142 lines)',
  '✓ Analysing error patterns...',
  '✓ Applying 6 improvements',
  '  → Wrapped DB calls in try/catch',
  '  → Added typed AppError class',
  '  → Normalised HTTP status codes',
  '',
  '✓ Done in 2.3s',
];
const outputLines = output ?? defaultOutput;
```

**JSX structure:**
```tsx
<AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  <div style={{
    width: TERMINAL_WIDTH, height: TERMINAL_HEIGHT,
    borderRadius: 10, overflow: 'hidden',
    transform: `translateY(${windowY}px)`, opacity: windowOpacity,
    boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
    display: 'flex', flexDirection: 'column',
  }}>
    {/* Chrome */}
    <div style={{
      height: CHROME_HEIGHT, backgroundColor: TERMINAL_CHROME,
      display: 'flex', alignItems: 'center', paddingLeft: 14, gap: TRAFFIC_GAP, flexShrink: 0,
    }}>
      {[TRAFFIC_RED, TRAFFIC_YELLOW, TRAFFIC_GREEN].map((c, i) => (
        <div key={i} style={{ width: TRAFFIC_SIZE, height: TRAFFIC_SIZE, borderRadius: '50%', backgroundColor: c }} />
      ))}
      <span style={{ flex: 1, textAlign: 'center', fontSize: 12, fontFamily: theme.font.display, color: 'rgba(255,255,255,0.35)', marginRight: 48 }}>
        bash — 80×24
      </span>
    </div>

    {/* Terminal body */}
    <div style={{
      flex: 1, backgroundColor: TERMINAL_BG, padding: PADDING,
      fontFamily: 'monospace', fontSize: FONT_SIZE, lineHeight: `${LINE_HEIGHT_PX}px`,
      color: 'rgba(255,255,255,0.85)',
      overflow: 'hidden',
    }}>
      {/* Prompt line */}
      <div style={{ opacity: promptOpacity, display: 'flex', gap: 8 }}>
        <span style={{ color: `rgb(${PROMPT_COLOR_R},${PROMPT_COLOR_G},${PROMPT_COLOR_B})` }}>~</span>
        <span style={{ color: `rgb(${PROMPT_COLOR_R},${PROMPT_COLOR_G},${PROMPT_COLOR_B})` }}>$</span>
        <span>{cmd.slice(0, charsShown)}</span>
        {frame < SPINNER_START && Math.floor(frame / 6) % 2 === 0 && (
          <span style={{ display: 'inline-block', width: 8, height: FONT_SIZE, backgroundColor: `rgb(${PROMPT_COLOR_R},${PROMPT_COLOR_G},${PROMPT_COLOR_B})`, verticalAlign: 'middle' }} />
        )}
      </div>

      {/* Spinner */}
      <div style={{ opacity: spinnerOpacity, color: `rgb(${PROMPT_COLOR_R},${PROMPT_COLOR_G},${PROMPT_COLOR_B})` }}>
        {spinnerChar} Working...
      </div>

      {/* Output lines */}
      {outputLines.map((line, i) => {
        const lineOpacity = interpolate(frame, [OUTPUT_START + i * LINE_STAGGER, OUTPUT_START + i * LINE_STAGGER + 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const lineY = interpolate(frame, [OUTPUT_START + i * LINE_STAGGER, OUTPUT_START + i * LINE_STAGGER + 8], [8, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const isSuccess = line.startsWith('✓');
        const isIndent  = line.startsWith('  →');
        return (
          <div key={i} style={{
            opacity: lineOpacity,
            transform: `translateY(${lineY}px)`,
            color: isSuccess ? `rgb(${PROMPT_COLOR_R},${PROMPT_COLOR_G},${PROMPT_COLOR_B})` : isIndent ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.85)',
          }}>
            {line}
          </div>
        );
      })}
    </div>
  </div>
</AbsoluteFill>
```

**Root.tsx entry:**
```tsx
<Composition id="Terminal" component={TerminalScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: true }} />
```

---

### DashboardRevealScene

**Concept:** Linear/Vercel-style analytics dashboard. Three stat cards slide up staggered (MRR, Users, Uptime). Each card's number counts up from 0. Below, a simple sparkline chart animates its path drawing from left to right using SVG `strokeDashoffset`.

**Props:** `stats?: Array<{label: string, value: number, prefix?: string, suffix?: string, change?: string}>`, `dark?: boolean`, `bg?: string`

**Module-scope constants:**
```ts
const CARD_STAGGER       = 10;
const COUNT_START        = 14;
const COUNT_END          = 58;
const CHART_DRAW_START   = 18;
const CHART_DRAW_END     = 72;

const CARD_WIDTH         = 280;
const CARD_HEIGHT        = 130;
const CARD_RADIUS        = 14;
const CARD_PADDING       = 24;
const CARD_GAP           = 24;
const VALUE_SIZE         = 38;
const LABEL_SIZE         = 13;
const CHANGE_SIZE        = 13;
const CHART_HEIGHT       = 80;
const CHART_WIDTH        = 880;
const CHART_STROKE_WIDTH = 2.5;
const CHART_PATH_LENGTH  = 880;  // approximation for dasharray
const CHART_AREA_OPACITY = 0.08;
```

**Animation:**
```ts
const defaultStats = [
  { label: 'Monthly Revenue',  value: 48200,  prefix: '$', suffix: '',  change: '+12.4%' },
  { label: 'Active Users',     value: 12840,  prefix: '',  suffix: '',  change: '+8.1%'  },
  { label: 'Uptime',           value: 99.98,  prefix: '',  suffix: '%', change: '30 days' },
];
const statsData = stats ?? defaultStats;

// Per-card spring
const cardSprings = statsData.map((_, i) => spring({ frame: Math.max(0, frame - i * CARD_STAGGER), fps, config: springFast }));
const cardYs  = cardSprings.map(s => interpolate(s, [0, 1], [50, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
const cardOps = cardSprings.map(s => interpolate(s, [0, 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

// Number count-up
const countedValues = statsData.map(stat =>
  interpolate(frame, [COUNT_START, COUNT_END], [0, stat.value], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
);

// Chart dash
const chartProgress = interpolate(frame, [CHART_DRAW_START, CHART_DRAW_END], [CHART_PATH_LENGTH, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
```

**SVG chart path** — use a fixed realistic-looking path (module-scope constant):
```ts
const CHART_PATH_D = 'M0,64 C80,60 120,20 200,30 C280,40 320,50 400,18 C480,-10 520,10 600,22 C680,34 720,50 800,38 C840,32 860,36 880,34';
```

**JSX structure:**
```tsx
<AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 }}>

  {/* Stat cards row */}
  <div style={{ display: 'flex', gap: CARD_GAP }}>
    {statsData.map((stat, i) => {
      const raw = countedValues[i];
      const formatted = stat.value >= 1000
        ? `${(raw / 1000).toFixed(1)}k`
        : stat.value < 10 ? raw.toFixed(2) : Math.round(raw).toString();
      return (
        <div key={i} style={{
          width: CARD_WIDTH, height: CARD_HEIGHT,
          borderRadius: CARD_RADIUS,
          backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
          border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
          padding: CARD_PADDING,
          transform: `translateY(${cardYs[i]}px)`,
          opacity: cardOps[i],
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <span style={{ fontFamily: theme.font.display, fontSize: LABEL_SIZE, color: dark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)', textTransform: 'uppercase', letterSpacing: 1 }}>
            {stat.label}
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontFamily: theme.font.display, fontSize: VALUE_SIZE, fontWeight: 700, color: textColor }}>
              {stat.prefix}{formatted}{stat.suffix}
            </span>
          </div>
          <span style={{ fontFamily: theme.font.display, fontSize: CHANGE_SIZE, color: accentColor }}>
            {stat.change}
          </span>
        </div>
      );
    })}
  </div>

  {/* Sparkline chart */}
  <div style={{ width: CHART_WIDTH, position: 'relative' }}>
    <svg width={CHART_WIDTH} height={CHART_HEIGHT} viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} overflow="visible">
      {/* Fill area */}
      <path
        d={`${CHART_PATH_D} L880,80 L0,80 Z`}
        fill={accentColor}
        fillOpacity={CHART_AREA_OPACITY}
        strokeWidth={0}
      />
      {/* Stroke line */}
      <path
        d={CHART_PATH_D}
        fill="none"
        stroke={accentColor}
        strokeWidth={CHART_STROKE_WIDTH}
        strokeDasharray={CHART_PATH_LENGTH}
        strokeDashoffset={chartProgress}
        strokeLinecap="round"
      />
    </svg>
  </div>

</AbsoluteFill>
```

**Root.tsx entry:**
```tsx
<Composition id="DashboardReveal" component={DashboardRevealScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: true }} />
```

**Step:** Add both imports + compositions to Root.tsx. Commit: `git commit -m "feat: add Terminal, DashboardReveal scenes"`

---

## Task 4: SearchBarScene + FeatureCardsScene

**Files to create:**
- `src/scenes/SearchBarScene.tsx`
- `src/scenes/FeatureCardsScene.tsx`

---

### SearchBarScene

**Concept:** Perplexity/Arc-style AI omnibar. A floating pill-shaped search bar scales in from 0.8. The query types. A "Searching…" shimmer appears in the bar. Then a result card slides up from below with the answer.

**Props:** `query?: string`, `result?: string`, `dark?: boolean`, `bg?: string`

**Module-scope constants:**
```ts
const BAR_ENTRY_END      = 14;
const TYPE_START         = 16;
const TYPE_END           = 50;
const SEARCHING_START    = 52;
const SEARCHING_END      = 66;
const RESULT_ENTRY_START = 64;
const RESULT_ENTRY_END   = 80;

const BAR_WIDTH          = 700;
const BAR_HEIGHT         = 60;
const BAR_RADIUS         = 30;
const BAR_PADDING_X      = 24;
const RESULT_WIDTH       = 700;
const RESULT_RADIUS      = 16;
const RESULT_PADDING     = 24;
const FONT_SIZE          = 20;
const RESULT_FONT_SIZE   = 16;
const RESULT_LINE_HEIGHT = 24;
const ICON_SIZE          = 28;
const RESULT_GAP         = 60;
```

**Animation:**
```ts
const barSpring = spring({ frame, fps, config: springBounce });
const barScale   = interpolate(barSpring, [0, 1], [0.8, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const barOpacity = interpolate(barSpring, [0, 0.3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const queryStr = query ?? 'What is the best way to structure a Next.js app?';
const charsShown = Math.floor(interpolate(frame, [TYPE_START, TYPE_END], [0, queryStr.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

const searchingOpacity = interpolate(frame, [SEARCHING_START, SEARCHING_START + 4, SEARCHING_END - 4, SEARCHING_END], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const resultSpring = spring({ frame: Math.max(0, frame - RESULT_ENTRY_START), fps, config: springFast });
const resultY = interpolate(resultSpring, [0, 1], [30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const resultOpacity = interpolate(resultSpring, [0, 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const resultText = result ?? 'Use the App Router with a clear separation of server and client components. Keep route handlers in /api, shared UI in /components, and business logic in /lib.';
const cursorVisible = charsShown < queryStr.length && Math.floor(frame / 6) % 2 === 0;
```

**JSX:**
```tsx
<AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: RESULT_GAP }}>

  {/* Search bar */}
  <div style={{
    width: BAR_WIDTH, height: BAR_HEIGHT,
    borderRadius: BAR_RADIUS,
    backgroundColor: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
    border: `1px solid ${dark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.1)'}`,
    display: 'flex', alignItems: 'center', paddingLeft: BAR_PADDING_X, paddingRight: BAR_PADDING_X,
    transform: `scale(${barScale})`, opacity: barOpacity,
    boxShadow: `0 8px 32px rgba(0,0,0,${dark ? 0.4 : 0.08})`,
    gap: 12,
    position: 'relative', overflow: 'hidden',
  }}>
    {/* Searching shimmer overlay */}
    <div style={{
      position: 'absolute', inset: 0, borderRadius: BAR_RADIUS,
      background: `linear-gradient(90deg, transparent 0%, ${accentColor}22 50%, transparent 100%)`,
      opacity: searchingOpacity,
    }} />

    {/* Search icon placeholder */}
    <div style={{ width: ICON_SIZE, height: ICON_SIZE, borderRadius: '50%', backgroundColor: accentColor, flexShrink: 0, opacity: 0.7 }} />

    {/* Typed text */}
    <span style={{ fontFamily: theme.font.display, fontSize: FONT_SIZE, color: textColor, flex: 1, overflow: 'hidden', whiteSpace: 'nowrap' }}>
      {queryStr.slice(0, charsShown)}
      {cursorVisible && <span style={{ opacity: 1 }}>|</span>}
    </span>
  </div>

  {/* Result card */}
  <div style={{
    width: RESULT_WIDTH,
    borderRadius: RESULT_RADIUS,
    backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)'}`,
    padding: RESULT_PADDING,
    transform: `translateY(${resultY}px)`,
    opacity: resultOpacity,
    boxShadow: `0 8px 24px rgba(0,0,0,${dark ? 0.3 : 0.06})`,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: accentColor }} />
      <span style={{ fontFamily: theme.font.display, fontSize: 12, color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>Answer</span>
    </div>
    <p style={{
      fontFamily: theme.font.display, fontSize: RESULT_FONT_SIZE,
      lineHeight: `${RESULT_LINE_HEIGHT}px`,
      color: textColor, margin: 0,
    }}>
      {resultText}
    </p>
  </div>

</AbsoluteFill>
```

**Root.tsx entry:**
```tsx
<Composition id="SearchBar" component={SearchBarScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: true }} />
```

---

### FeatureCardsScene

**Concept:** Four floating feature cards in a 2×2 grid. Each card has a large emoji icon, a bold headline, and a one-line description. Cards stagger up from below with a subtle accent glow behind them. Clean, high-polish — the SaaS pricing-page-as-motion aesthetic.

**Props:** `features?: Array<{icon: string, title: string, desc: string}>`, `dark?: boolean`, `bg?: string`

**Module-scope constants:**
```ts
const CARD_STAGGER      = 8;
const CARD_ENTRY_Y      = 50;

const CARD_WIDTH        = 380;
const CARD_HEIGHT       = 160;
const CARD_RADIUS       = 18;
const CARD_PADDING      = 28;
const GRID_GAP          = 24;
const ICON_SIZE         = 44;
const TITLE_SIZE        = 20;
const TITLE_WEIGHT      = 700;
const DESC_SIZE         = 14;
const DESC_LINE_HEIGHT  = 20;
const GLOW_SIZE         = 200;
const GLOW_OPACITY      = 0.07;
const TITLE_MARGIN_TOP  = 12;
const DESC_MARGIN_TOP   = 6;
```

**Animation (per card, index i):**
```ts
const defaultFeatures = [
  { icon: '⚡', title: 'Instant Responses',  desc: 'Sub-100ms latency on every API call, globally distributed.' },
  { icon: '🔒', title: 'Privacy First',       desc: 'Zero data retention. Your prompts never leave your infra.' },
  { icon: '🧠', title: 'Context Aware',       desc: 'Remembers the thread. No repetition, no lost context.' },
  { icon: '📊', title: 'Built-in Analytics',  desc: 'Usage dashboards, cost tracking, and anomaly alerts.' },
];
const featuresData = features ?? defaultFeatures;

// Per-card spring
const springs = featuresData.map((_, i) =>
  spring({ frame: Math.max(0, frame - i * CARD_STAGGER), fps, config: springFast })
);
const cardYs  = springs.map(s => interpolate(s, [0, 1], [CARD_ENTRY_Y, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
const cardOps = springs.map(s => interpolate(s, [0, 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
const glowOps = springs.map(s => interpolate(s, [0, 1], [0, GLOW_OPACITY], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
```

**JSX:**
```tsx
<AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  {/* 2×2 grid */}
  <div style={{
    display: 'grid',
    gridTemplateColumns: `${CARD_WIDTH}px ${CARD_WIDTH}px`,
    gap: GRID_GAP,
  }}>
    {featuresData.map((feat, i) => (
      <div key={i} style={{
        width: CARD_WIDTH, height: CARD_HEIGHT,
        borderRadius: CARD_RADIUS,
        backgroundColor: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
        padding: CARD_PADDING,
        transform: `translateY(${cardYs[i]}px)`,
        opacity: cardOps[i],
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: -GLOW_SIZE / 2, left: -GLOW_SIZE / 2,
          width: GLOW_SIZE, height: GLOW_SIZE, borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          opacity: glowOps[i],
          pointerEvents: 'none',
        }} />

        <span style={{ fontSize: ICON_SIZE }}>{feat.icon}</span>
        <span style={{
          marginTop: TITLE_MARGIN_TOP,
          fontFamily: theme.font.display, fontSize: TITLE_SIZE, fontWeight: TITLE_WEIGHT,
          color: textColor,
        }}>{feat.title}</span>
        <span style={{
          marginTop: DESC_MARGIN_TOP,
          fontFamily: theme.font.display, fontSize: DESC_SIZE,
          lineHeight: `${DESC_LINE_HEIGHT}px`,
          color: dark ? 'rgba(247,246,243,0.5)' : 'rgba(17,17,16,0.5)',
        }}>{feat.desc}</span>
      </div>
    ))}
  </div>
</AbsoluteFill>
```

**Root.tsx entry:**
```tsx
<Composition id="FeatureCards" component={FeatureCardsScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: true }} />
```

**Step:** Add both imports + compositions to Root.tsx. Commit: `git commit -m "feat: add SearchBar, FeatureCards scenes"`

---

## Task 5: APIRequestScene + NeuralPulseScene

**Files to create:**
- `src/scenes/APIRequestScene.tsx`
- `src/scenes/NeuralPulseScene.tsx`

---

### APIRequestScene

**Concept:** Three-column layout (Request → Processing → Response). Stripe/Vercel edge-function energy. The request JSON box slides in from the left. An animated wire SVG draws from left to the centre. A spinning indicator pulses. Wire continues right. The green response box slides in from the right with a 200 OK badge.

**Props:** `endpoint?: string`, `dark?: boolean`, `bg?: string`

**Module-scope constants:**
```ts
const REQUEST_ENTRY_END   = 14;
const WIRE_L_START        = 16;
const WIRE_L_END          = 30;
const SPIN_START          = 18;
const SPIN_END            = 52;
const WIRE_R_START        = 48;
const WIRE_R_END          = 62;
const RESPONSE_START      = 60;
const RESPONSE_END        = 74;

const BOX_WIDTH           = 260;
const BOX_HEIGHT          = 200;
const BOX_RADIUS          = 12;
const BOX_PADDING         = 16;
const WIRE_LENGTH         = 120;
const WIRE_HEIGHT         = 2;
const CENTRE_NODE_SIZE    = 56;
const CENTRE_NODE_RADIUS  = 28;
const COL_GAP             = WIRE_LENGTH;
const FONT_SIZE_MONO      = 13;
const STATUS_SIZE         = 22;
const ENDPOINT_SIZE       = 14;
const STATUS_OK_COLOR_R   = 52;
const STATUS_OK_COLOR_G   = 211;
const STATUS_OK_COLOR_B   = 153;  // emerald green for 200 OK
```

**Animation:**
```ts
const reqSpring = spring({ frame, fps, config: springFast });
const reqX  = interpolate(reqSpring, [0, 1], [-60, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const reqOp = interpolate(reqSpring, [0, 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const wireLProgress = interpolate(frame, [WIRE_L_START, WIRE_L_END], [0, WIRE_LENGTH], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const wireRProgress = interpolate(frame, [WIRE_R_START, WIRE_R_END], [0, WIRE_LENGTH], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

// Spinner
const spinAngle = interpolate(frame, [SPIN_START, SPIN_END], [0, 360 * 3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const spinnerOp = interpolate(frame, [SPIN_START, SPIN_START + 6, SPIN_END - 6, SPIN_END], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const respSpring = spring({ frame: Math.max(0, frame - RESPONSE_START), fps, config: springFast });
const respX  = interpolate(respSpring, [0, 1], [60, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const respOp = interpolate(respSpring, [0, 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const ep = endpoint ?? 'POST /v1/completions';
```

**JSX structure:**
```tsx
<AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>

    {/* REQUEST box */}
    <div style={{
      width: BOX_WIDTH, height: BOX_HEIGHT, borderRadius: BOX_RADIUS,
      backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
      padding: BOX_PADDING,
      transform: `translateX(${reqX}px)`, opacity: reqOp,
    }}>
      <div style={{ fontFamily: theme.font.display, fontSize: 11, color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Request</div>
      <div style={{ fontFamily: 'monospace', fontSize: FONT_SIZE_MONO, color: textColor, lineHeight: '20px' }}>
        <div style={{ color: accentColor }}>{ep}</div>
        <div style={{ marginTop: 8, opacity: 0.7 }}>{'{'}</div>
        <div style={{ paddingLeft: 16, opacity: 0.7 }}>"model": "claude-3",</div>
        <div style={{ paddingLeft: 16, opacity: 0.7 }}>"max_tokens": 1024,</div>
        <div style={{ paddingLeft: 16, opacity: 0.7 }}>"messages": [...]</div>
        <div style={{ opacity: 0.7 }}>{'}'}</div>
      </div>
    </div>

    {/* Left wire */}
    <div style={{ width: WIRE_LENGTH, height: WIRE_HEIGHT, backgroundColor: accentColor, width: wireLProgress, transition: 'none', flexShrink: 0 }} />

    {/* Centre node */}
    <div style={{
      width: CENTRE_NODE_SIZE, height: CENTRE_NODE_SIZE, borderRadius: CENTRE_NODE_RADIUS,
      backgroundColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
      border: `2px solid ${accentColor}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      opacity: spinnerOp,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        border: `2.5px solid ${accentColor}`,
        borderTopColor: 'transparent',
        transform: `rotate(${spinAngle}deg)`,
      }} />
    </div>

    {/* Right wire */}
    <div style={{ width: wireRProgress, height: WIRE_HEIGHT, backgroundColor: `rgb(${STATUS_OK_COLOR_R},${STATUS_OK_COLOR_G},${STATUS_OK_COLOR_B})`, flexShrink: 0 }} />

    {/* RESPONSE box */}
    <div style={{
      width: BOX_WIDTH, height: BOX_HEIGHT, borderRadius: BOX_RADIUS,
      backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      border: `1px solid rgb(${STATUS_OK_COLOR_R},${STATUS_OK_COLOR_G},${STATUS_OK_COLOR_B})`,
      padding: BOX_PADDING,
      transform: `translateX(${respX}px)`, opacity: respOp,
    }}>
      <div style={{ fontFamily: theme.font.display, fontSize: 11, color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Response</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ fontSize: STATUS_SIZE, fontWeight: 700, fontFamily: theme.font.display, color: `rgb(${STATUS_OK_COLOR_R},${STATUS_OK_COLOR_G},${STATUS_OK_COLOR_B})` }}>200</div>
        <div style={{ fontSize: 13, fontFamily: theme.font.display, color: `rgb(${STATUS_OK_COLOR_R},${STATUS_OK_COLOR_G},${STATUS_OK_COLOR_B})`, opacity: 0.8 }}>OK</div>
      </div>
      <div style={{ fontFamily: 'monospace', fontSize: FONT_SIZE_MONO, color: textColor, lineHeight: '20px' }}>
        <div style={{ opacity: 0.7 }}>{'{'}</div>
        <div style={{ paddingLeft: 16, opacity: 0.7 }}>"id": "msg_01X...",</div>
        <div style={{ paddingLeft: 16, opacity: 0.7 }}>"content": "...",</div>
        <div style={{ paddingLeft: 16, opacity: 0.7 }}>"usage": {'{'} "tokens": 412 {'}'}</div>
        <div style={{ opacity: 0.7 }}>{'}'}</div>
      </div>
    </div>
  </div>
</AbsoluteFill>
```

**Root.tsx entry:**
```tsx
<Composition id="APIRequest" component={APIRequestScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: true }} />
```

---

### NeuralPulseScene

**Concept:** 7 nodes on a dark background connected by edges. Three sequential "pulse" waves travel along different paths (input → hidden → output), each one lighting up the nodes and edges on that path. The visual language of every AI company's marketing site header.

**Props:** `dark?: boolean`, `bg?: string`

**Module-scope constants:**
```ts
const PULSE_DURATION    = 24;
const PULSE_STAGGER     = 20;
const PULSE_COUNT       = 3;

const NODE_SIZE         = 14;
const NODE_GLOW_SIZE    = 48;
const EDGE_STROKE       = 1.5;
const EDGE_BASE_OPACITY = 0.15;
const EDGE_ACTIVE_OP    = 0.9;
const NODE_BASE_OP      = 0.3;
const NODE_ACTIVE_OP    = 1;
const GLOW_BASE_OP      = 0;
const GLOW_ACTIVE_OP    = 0.35;
const CANVAS_W          = 700;
const CANVAS_H          = 400;
```

**Node positions** (module-scope, pixels within 700×400 canvas):
```ts
const NODES = [
  { x: 60,  y: 200 },  // 0 input
  { x: 230, y: 80  },  // 1 hidden-top-left
  { x: 230, y: 200 },  // 2 hidden-mid-left
  { x: 230, y: 320 },  // 3 hidden-bot-left
  { x: 430, y: 130 },  // 4 hidden-top-right
  { x: 430, y: 270 },  // 5 hidden-bot-right
  { x: 600, y: 200 },  // 6 output
];
```

**Edges** (pairs of node indices):
```ts
const EDGES: [number, number][] = [
  [0,1],[0,2],[0,3],
  [1,4],[1,5],[2,4],[2,5],[3,4],[3,5],
  [4,6],[5,6],
];
```

**Pulse paths** (sequences of node indices):
```ts
const PULSE_PATHS = [
  [0, 2, 4, 6],
  [0, 1, 5, 6],
  [0, 3, 5, 6],
];
```

**Animation:** For each pulse `p` (0, 1, 2), starting at frame `p * PULSE_STAGGER`, a "progress" value goes 0→1 over PULSE_DURATION frames. Each edge in the pulse path becomes active as the progress passes through it.

```ts
// Per-pulse progress
const pulseProgress = PULSE_PATHS.map((_, p) =>
  interpolate(frame, [p * PULSE_STAGGER, p * PULSE_STAGGER + PULSE_DURATION], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
);

// For each edge [a,b], it's active in pulse p if that edge is in PULSE_PATHS[p]
// and the pulse progress is past the fractional position of that edge in the path.
// Helper: edgeActiveOpacity(edgeKey, pulseIndex) computed at render time.

// For each node, compute if it's active in any pulse
const nodeActiveOpacity = (nodeIdx: number) => {
  for (let p = 0; p < PULSE_PATHS.length; p++) {
    const pathIdx = PULSE_PATHS[p].indexOf(nodeIdx);
    if (pathIdx < 0) continue;
    const fraction = pathIdx / (PULSE_PATHS[p].length - 1);
    if (pulseProgress[p] >= fraction - 0.1) return NODE_ACTIVE_OP;
  }
  return NODE_BASE_OP;
};
```

**JSX structure:**
```tsx
<AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  <svg width={CANVAS_W} height={CANVAS_H} viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}>

    {/* Draw edges */}
    {EDGES.map(([a, b], i) => {
      const na = NODES[a], nb = NODES[b];
      // Is this edge active in any pulse?
      let edgeOp = EDGE_BASE_OPACITY;
      for (let p = 0; p < PULSE_PATHS.length; p++) {
        const path = PULSE_PATHS[p];
        const idx = path.indexOf(a);
        if (idx >= 0 && path[idx + 1] === b) {
          const fraction = idx / (path.length - 1);
          if (pulseProgress[p] >= fraction) edgeOp = EDGE_ACTIVE_OP;
        }
      }
      return (
        <line key={i}
          x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
          stroke={accentColor}
          strokeWidth={EDGE_STROKE}
          opacity={edgeOp}
        />
      );
    })}

    {/* Draw nodes */}
    {NODES.map((node, i) => {
      const glowOp = nodeActiveOpacity(i) > NODE_BASE_OP ? GLOW_ACTIVE_OP : GLOW_BASE_OP;
      const nodeOp = nodeActiveOpacity(i);
      return (
        <g key={i}>
          {/* Glow circle */}
          <circle cx={node.x} cy={node.y} r={NODE_GLOW_SIZE / 2} fill={accentColor} opacity={glowOp} />
          {/* Node circle */}
          <circle cx={node.x} cy={node.y} r={NODE_SIZE / 2} fill={accentColor} opacity={nodeOp} />
        </g>
      );
    })}

  </svg>
</AbsoluteFill>
```

**Root.tsx entry:**
```tsx
<Composition id="NeuralPulse" component={NeuralPulseScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: true }} />
```

**Step:** Add both imports + compositions to Root.tsx. Commit: `git commit -m "feat: add APIRequest, NeuralPulse scenes"`

---

## Task 6: TypeScript check + AISaaSReel composition

**Step 1:** Run TypeScript check:
```bash
cd "/Users/tim/Desktop/ProgrammaicVideo/Video Version 1/remotion-project" && npx tsc --noEmit 2>&1 | grep "error TS"
```
Expected: 0 errors. Fix any that appear.

**Step 2:** Verify all 10 new compositions in Root.tsx:
```bash
grep 'id="LaptopOpen\|BrowserLoad\|AIStream\|CodeEditor\|Terminal\|DashboardReveal\|SearchBar\|FeatureCards\|APIRequest\|NeuralPulse"' src/Root.tsx
```
Expected: 10 lines.

**Step 3:** Create `src/AISaaSReelVideo.tsx` — stitches all 10 scenes with flash-cut bridges (same pattern as ImpactReelVideo):

```tsx
import React from 'react';
import { AbsoluteFill, Series, interpolate, useCurrentFrame } from 'remotion';
import { theme } from './config/theme';
import { LaptopOpenScene }       from './scenes/LaptopOpenScene';
import { BrowserLoadScene }      from './scenes/BrowserLoadScene';
import { AIStreamScene }         from './scenes/AIStreamScene';
import { CodeEditorScene }       from './scenes/CodeEditorScene';
import { TerminalScene }         from './scenes/TerminalScene';
import { DashboardRevealScene }  from './scenes/DashboardRevealScene';
import { SearchBarScene }        from './scenes/SearchBarScene';
import { FeatureCardsScene }     from './scenes/FeatureCardsScene';
import { APIRequestScene }       from './scenes/APIRequestScene';
import { NeuralPulseScene }      from './scenes/NeuralPulseScene';

const SCENE_DURATION = 90;
const FLASH_DURATION = 5;
const FLASH_PEAK     = 2;

const SceneBridge: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, FLASH_PEAK, FLASH_DURATION], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ backgroundColor: theme.colors.bg, opacity }} />;
};

// Total: 10 × 90 + 9 × 5 = 945 frames (31.5 s)
export const AISaaSReelVideo: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={SCENE_DURATION} name="NeuralPulse">
      <NeuralPulseScene dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="LaptopOpen">
      <LaptopOpenScene url="app.tapid.io" dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="BrowserLoad">
      <BrowserLoadScene url="app.tapid.io/dashboard" dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="AIStream">
      <AIStreamScene dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="CodeEditor">
      <CodeEditorScene dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="Terminal">
      <TerminalScene dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="DashboardReveal">
      <DashboardRevealScene dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="SearchBar">
      <SearchBarScene dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="FeatureCards">
      <FeatureCardsScene dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="APIRequest">
      <APIRequestScene dark />
    </Series.Sequence>
  </Series>
);
```

Register in `src/Root.tsx`:
```tsx
import { AISaaSReelVideo } from './AISaaSReelVideo';
// ...
<Composition id="AISaaSReel" component={AISaaSReelVideo} durationInFrames={945} fps={30} width={1920} height={1080} />
```

**Step 4:** Final commit:
```bash
git add -A && git commit -m "feat: complete 10 AI SaaS scenes + AISaaSReel composition"
```
