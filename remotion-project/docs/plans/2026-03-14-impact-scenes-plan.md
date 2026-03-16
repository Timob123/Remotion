# Apple Keynote Impact Scenes — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build 20 standalone 2-second Apple-keynote-style typographic impact scenes as reusable Remotion components.

**Architecture:** Each scene is a fully self-contained TSX file with module-scope constants, pure frame-based animations, and a shared `dark`/`bg` prop pattern. No shared base component — flat library. All 20 registered in `src/Root.tsx`.

**Tech Stack:** Remotion, React, TypeScript, `../config/theme`, `../hooks/useSceneAnimation`

---

## Shared Pattern (copy into every scene)

```tsx
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast, springBounce } from '../hooks/useSceneAnimation';

// ── MODULE-SCOPE CONSTANTS ──
const DURATION = 60; // 2s @ 30fps — not used at runtime but documents intent

type BaseProps = {
  dark?: boolean;
  bg?: string;
};

// Inside component:
const frame = useCurrentFrame();
const { fps } = useVideoConfig();
const bgColor = bg ?? (dark ? theme.colors.text : theme.colors.bg);
const textColor = dark ? theme.colors.bg : theme.colors.text;
const accentColor = theme.colors.accent;
```

All `interpolate` calls MUST have both clamps:
```ts
{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
```

---

## Task 1: WordSlamScene + HeadlineBuildScene + StatCountScene + ScaleInOutScene

**Files to create:**
- `src/scenes/WordSlamScene.tsx`
- `src/scenes/HeadlineBuildScene.tsx`
- `src/scenes/StatCountScene.tsx`
- `src/scenes/ScaleInOutScene.tsx`

---

### WordSlamScene

**Props:** `word: string`, `dark?: boolean`, `bg?: string`, `size?: number`

**Module-scope constants:**
```ts
const SLAM_DELAY = 0;
const SLAM_SIZE = 140;
const SLAM_WEIGHT = 900;
const SLAM_LETTER_SPACING = -4;
```

**Animation:**
```ts
const slamSpring = spring({ frame, fps, config: springBounce });
const scale = interpolate(slamSpring, [0, 1], [0.08, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const opacity = interpolate(frame, [0, 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
```

**JSX:** `AbsoluteFill` centred, single `div` with `fontSize: size ?? SLAM_SIZE`, `fontFamily: theme.font.display`, `fontWeight: SLAM_WEIGHT`, `letterSpacing: SLAM_LETTER_SPACING`, `color: textColor`, `transform: \`scale(${scale})\``, `opacity`.

**Root.tsx entry:**
```tsx
<Composition id="WordSlam" component={WordSlamScene} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{ word: 'Shipped.', dark: true }} />
```

---

### HeadlineBuildScene

**Props:** `headline: string`, `dark?: boolean`, `bg?: string`, `size?: number`

**Module-scope constants:**
```ts
const WORD_STAGGER = 6;
const HEADLINE_SIZE = 96;
const HEADLINE_WEIGHT = 700;
const HEADLINE_LETTER_SPACING = -2;
const WORD_START_Y = 40;
```

**Animation (per word, index i):**
```ts
const wordDelay = i * WORD_STAGGER;
const wordSpring = spring({ frame: Math.max(0, frame - wordDelay), fps, config: springFast });
const wordY = interpolate(wordSpring, [0, 1], [WORD_START_Y, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const wordOpacity = interpolate(wordSpring, [0, 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
```

**JSX:** Split `headline` on spaces → `words.map((word, i) => ...)` inside a flex-wrap row, each word in its own `span` with translateY + opacity.

**Root.tsx entry:**
```tsx
<Composition id="HeadlineBuild" component={HeadlineBuildScene} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{ headline: 'The fastest way to ship.', dark: false }} />
```

---

### StatCountScene

**Props:** `value: number`, `label: string`, `prefix?: string`, `suffix?: string`, `dark?: boolean`, `bg?: string`

**Module-scope constants:**
```ts
const COUNT_START = 5;
const COUNT_END = 45;
const STAT_SIZE = 160;
const STAT_WEIGHT = 900;
const LABEL_SIZE = 28;
const LABEL_DELAY = 30;
const LABEL_FADE_DURATION = 12;
```

**Animation:**
```ts
const countedValue = Math.round(
  interpolate(frame, [COUNT_START, COUNT_END], [0, value], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
);
const statOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const labelOpacity = interpolate(frame, [LABEL_DELAY, LABEL_DELAY + LABEL_FADE_DURATION], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
```

**JSX:** Centred column. Top row: `prefix` (smaller, muted) + `countedValue` + `suffix` (smaller). Below: `label` in `LABEL_SIZE` muted. All use `fontFamily: theme.font.display`.

**Root.tsx entry:**
```tsx
<Composition id="StatCount" component={StatCountScene} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{ value: 99, label: 'uptime', suffix: '%', dark: true }} />
```

---

### ScaleInOutScene

**Props:** `word: string`, `dark?: boolean`, `bg?: string`, `size?: number`

**Module-scope constants:**
```ts
const SCALE_IN_END = 20;
const SCALE_START_FACTOR = 4;
const SCALE_SIZE = 140;
const SCALE_WEIGHT = 900;
const SCALE_LETTER_SPACING = -4;
```

**Animation:**
```ts
const scaleSpring = spring({ frame, fps, config: springFast });
const scale = interpolate(scaleSpring, [0, 1], [SCALE_START_FACTOR, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
```

**JSX:** Same as WordSlamScene but scale goes large→small instead of tiny→normal.

**Root.tsx entry:**
```tsx
<Composition id="ScaleInOut" component={ScaleInOutScene} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{ word: 'Focus.', dark: false }} />
```

**Step:** After creating all 4 files, add all 4 imports and compositions to `src/Root.tsx`. Commit: `git commit -m "feat: add WordSlam, HeadlineBuild, StatCount, ScaleInOut scenes"`

---

## Task 2: LetterDropScene + MaskRevealScene + OverlineScene + SplitRevealScene

**Files to create:**
- `src/scenes/LetterDropScene.tsx`
- `src/scenes/MaskRevealScene.tsx`
- `src/scenes/OverlineScene.tsx`
- `src/scenes/SplitRevealScene.tsx`

---

### LetterDropScene

**Props:** `word: string`, `dark?: boolean`, `bg?: string`, `size?: number`

**Module-scope constants:**
```ts
const LETTER_STAGGER = 3;
const LETTER_SIZE = 140;
const LETTER_WEIGHT = 900;
const LETTER_DROP_DISTANCE = -120;
const LETTER_SPACING_PX = -4;
```

**Animation (per letter, index i):**
```ts
const letterDelay = i * LETTER_STAGGER;
const letterSpring = spring({ frame: Math.max(0, frame - letterDelay), fps, config: springBounce });
const letterY = interpolate(letterSpring, [0, 1], [LETTER_DROP_DISTANCE, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const letterOpacity = interpolate(letterSpring, [0, 0.3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
```

**JSX:** Split `word` into `[...word]` chars. Flex row, each char in its own `span`, `display: 'inline-block'`, `transform: \`translateY(${letterY}px)\``, `opacity: letterOpacity`. Font: `LETTER_SIZE`, weight `LETTER_WEIGHT`, spacing `LETTER_SPACING_PX`.

**Root.tsx entry:**
```tsx
<Composition id="LetterDrop" component={LetterDropScene} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{ word: 'IMPACT', dark: true }} />
```

---

### MaskRevealScene

**Props:** `text: string`, `subtext?: string`, `dark?: boolean`, `bg?: string`

**Module-scope constants:**
```ts
const MASK_SPEED_START = 5;
const MASK_SPEED_END = 30;
const TEXT_SIZE = 96;
const TEXT_WEIGHT = 700;
const SUBTEXT_SIZE = 28;
const SUBTEXT_DELAY = 20;
```

**Animation:**
A mask div (`position: 'absolute'`, same bg colour as scene, full height) slides from `left: 0` to `left: 100%` via `interpolate`:
```ts
const maskLeft = interpolate(frame, [MASK_SPEED_START, MASK_SPEED_END], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
// mask covers text, slides right revealing it
```

**JSX:**
- Text div (centred, `position: 'relative'`, `overflow: 'hidden'`):
  - Inner text at full opacity always
  - Mask div: `position: 'absolute', top: 0, bottom: 0, left: 0`, `width: \`${100 - maskLeft}%\``, `backgroundColor: bgColor`, `transformOrigin: 'left'`
- Subtext fades in below at `SUBTEXT_DELAY`.

**Root.tsx entry:**
```tsx
<Composition id="MaskReveal" component={MaskRevealScene} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{ text: 'Instant delivery.', subtext: 'No waiting.', dark: false }} />
```

---

### OverlineScene

**Props:** `text: string`, `subtext?: string`, `dark?: boolean`, `bg?: string`

**Module-scope constants:**
```ts
const LINE_DRAW_START = 0;
const LINE_DRAW_END = 18;
const LINE_HEIGHT_PX = 3;
const LINE_MARGIN_BOTTOM = 20;
const TEXT_FADE_START = 14;
const TEXT_FADE_END = 28;
const TEXT_SIZE = 72;
const TEXT_WEIGHT = 700;
const SUBTEXT_FADE_START = 26;
const SUBTEXT_FADE_END = 40;
const SUBTEXT_SIZE = 24;
```

**Animation:**
```ts
const lineWidth = interpolate(frame, [LINE_DRAW_START, LINE_DRAW_END], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const textOpacity = interpolate(frame, [TEXT_FADE_START, TEXT_FADE_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const subtextOpacity = interpolate(frame, [SUBTEXT_FADE_START, SUBTEXT_FADE_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
```

**JSX:** Centred column.
- Line: `height: LINE_HEIGHT_PX`, `backgroundColor: accentColor`, `width: \`${lineWidth}%\``, `marginBottom: LINE_MARGIN_BOTTOM`
- Text below: `TEXT_SIZE`, bold, `textOpacity`
- Subtext: muted colour, `SUBTEXT_SIZE`, `subtextOpacity`

**Root.tsx entry:**
```tsx
<Composition id="Overline" component={OverlineScene} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{ text: 'Redesigned.', subtext: 'From the ground up.', dark: true }} />
```

---

### SplitRevealScene

**Props:** `text: string`, `dark?: boolean`, `bg?: string`

**Module-scope constants:**
```ts
const SPLIT_TRAVEL = 60;
const SPLIT_START = 0;
const SPLIT_PEAK = 15;
const SPLIT_RETURN = 35;
const TEXT_SIZE = 120;
const TEXT_WEIGHT = 900;
const TEXT_LETTER_SPACING = -3;
```

**Animation:**
Text is rendered twice (top half clip + bottom half clip). Each half moves in opposite directions then snaps back:
```ts
const splitProgress = interpolate(frame, [SPLIT_START, SPLIT_PEAK, SPLIT_RETURN], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const topY = interpolate(splitProgress, [0, 1], [0, -SPLIT_TRAVEL]);
const bottomY = interpolate(splitProgress, [0, 1], [0, SPLIT_TRAVEL]);
```

**JSX:** `position: 'relative'` wrapper. Render text twice:
- Top half: `overflow: 'hidden'`, `clipPath: 'inset(0 0 50% 0)'`, `transform: \`translateY(${topY}px)\``
- Bottom half: `overflow: 'hidden'`, `clipPath: 'inset(50% 0 0 0)'`, `transform: \`translateY(${bottomY}px)\``

**Root.tsx entry:**
```tsx
<Composition id="SplitReveal" component={SplitRevealScene} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{ text: 'Beautiful.', dark: false }} />
```

**Step:** Add all 4 imports + compositions to Root.tsx. Commit: `git commit -m "feat: add LetterDrop, MaskReveal, Overline, SplitReveal scenes"`

---

## Task 3: WordFocusScene + StackBuildScene + FlashCutScene + PunchlineScene

**Files to create:**
- `src/scenes/WordFocusScene.tsx`
- `src/scenes/StackBuildScene.tsx`
- `src/scenes/FlashCutScene.tsx`
- `src/scenes/PunchlineScene.tsx`

---

### WordFocusScene

**Props:** `word: string`, `subtext?: string`, `dark?: boolean`, `bg?: string`

**Module-scope constants:**
```ts
const BLUR_START_PX = 20;
const BLUR_END_FRAME = 25;
const FOCUS_SIZE = 120;
const FOCUS_WEIGHT = 700;
const FOCUS_LETTER_SPACING = -3;
const SUBTEXT_DELAY = 28;
const SUBTEXT_SIZE = 24;
```

**Animation:**
```ts
const blurPx = interpolate(frame, [0, BLUR_END_FRAME], [BLUR_START_PX, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const subtextOpacity = interpolate(frame, [SUBTEXT_DELAY, SUBTEXT_DELAY + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
```

**JSX:** Centred column. Word `div` with `style={{ filter: \`blur(${blurPx}px)\`, opacity }}`. Subtext below with `subtextOpacity`.

**Root.tsx entry:**
```tsx
<Composition id="WordFocus" component={WordFocusScene} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{ word: 'Clarity.', subtext: 'No compromises.', dark: false }} />
```

---

### StackBuildScene

**Props:** `lines: string[]`, `dark?: boolean`, `bg?: string`

**Module-scope constants:**
```ts
const LINE_STAGGER = 10;
const LINE_SLIDE_X = 80;
const LINE_SIZE = 64;
const LINE_WEIGHT = 700;
const LINE_LETTER_SPACING = -2;
const MAX_LINES = 3;
```

**Animation (per line, index i):**
```ts
const lineDelay = i * LINE_STAGGER;
const lineSpring = spring({ frame: Math.max(0, frame - lineDelay), fps, config: springFast });
const lineX = interpolate(lineSpring, [0, 1], [LINE_SLIDE_X, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const lineOpacity = interpolate(lineSpring, [0, 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
```

**JSX:** Centred column, `lines.slice(0, MAX_LINES).map((line, i) => ...)` each in a `div` with `transform: \`translateX(${lineX}px)\``, `opacity: lineOpacity`.

**Root.tsx entry:**
```tsx
<Composition id="StackBuild" component={StackBuildScene} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{ lines: ['Build faster.', 'Ship smarter.', 'Grow bigger.'], dark: true }} />
```

---

### FlashCutScene

**Props:** `text: string`, `subtext?: string`, `dark?: boolean`, `bg?: string`

**Module-scope constants:**
```ts
const FLASH_PEAK = 4;
const FLASH_FADE_END = 16;
const TEXT_SPRING_DELAY = 6;
const TEXT_SIZE = 96;
const TEXT_WEIGHT = 700;
const SUBTEXT_DELAY = 20;
const SUBTEXT_SIZE = 28;
```

**Animation:**
```ts
const flashOpacity = interpolate(frame, [0, FLASH_PEAK, FLASH_FADE_END], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const textSpring = spring({ frame: Math.max(0, frame - TEXT_SPRING_DELAY), fps, config: springBounce });
const textScale = interpolate(textSpring, [0, 1], [0.85, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const textOpacity = interpolate(textSpring, [0, 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const subtextOpacity = interpolate(frame, [SUBTEXT_DELAY, SUBTEXT_DELAY + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
```

**JSX:**
- `AbsoluteFill` with `bgColor`
- White flash overlay: `position: 'absolute', inset: 0, backgroundColor: '#fff', opacity: flashOpacity, pointerEvents: 'none', zIndex: 10`
- Text centred: `transform: \`scale(${textScale})\``, `opacity: textOpacity`
- Subtext below: `subtextOpacity`

**Root.tsx entry:**
```tsx
<Composition id="FlashCut" component={FlashCutScene} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{ text: 'Now.', subtext: 'Available today.', dark: true }} />
```

---

### PunchlineScene

**Props:** `headline: string`, `sub: string`, `dark?: boolean`, `bg?: string`

**Module-scope constants:**
```ts
const HEADLINE_SPRING_DELAY = 0;
const SUB_FADE_START = 18;
const SUB_FADE_END = 30;
const HEADLINE_SIZE = 120;
const HEADLINE_WEIGHT = 900;
const HEADLINE_LETTER_SPACING = -3;
const SUB_SIZE = 32;
const SUB_MARGIN_TOP = 24;
```

**Animation:**
```ts
const headlineSpring = spring({ frame, fps, config: springBounce });
const headlineY = interpolate(headlineSpring, [0, 1], [50, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const headlineOpacity = interpolate(headlineSpring, [0, 0.3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const subOpacity = interpolate(frame, [SUB_FADE_START, SUB_FADE_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
```

**JSX:** Centred column. Headline `div` with `translateY + opacity`. Sub `div` below with `opacity`.

**Root.tsx entry:**
```tsx
<Composition id="Punchline" component={PunchlineScene} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{ headline: 'Game over.', sub: 'For your competitors.', dark: true }} />
```

**Step:** Add all 4 to Root.tsx. Commit: `git commit -m "feat: add WordFocus, StackBuild, FlashCut, Punchline scenes"`

---

## Task 4: TitleCardScene + OutlineToFillScene + WordSweepScene + CountdownScene

**Files to create:**
- `src/scenes/TitleCardScene.tsx`
- `src/scenes/OutlineToFillScene.tsx`
- `src/scenes/WordSweepScene.tsx`
- `src/scenes/CountdownScene.tsx`

---

### TitleCardScene

**Props:** `title: string`, `subtitle?: string`, `dark?: boolean`, `bg?: string`

**Module-scope constants:**
```ts
const BAR_HEIGHT = 80;
const BAR_DRAW_END = 20;
const TEXT_FADE_START = 16;
const TEXT_FADE_END = 30;
const TITLE_SIZE = 72;
const TITLE_WEIGHT = 700;
const SUBTITLE_SIZE = 24;
const SUBTITLE_MARGIN_TOP = 12;
```

**Animation:**
```ts
const barScale = interpolate(frame, [0, BAR_DRAW_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const textOpacity = interpolate(frame, [TEXT_FADE_START, TEXT_FADE_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
```

**JSX:**
- Top bar: `position: 'absolute', top: 0, left: 0, right: 0, height: BAR_HEIGHT, backgroundColor: '#000', transform: \`scaleY(${barScale})\`, transformOrigin: 'top'`
- Bottom bar: same but `bottom: 0, transformOrigin: 'bottom'`
- Centred text: `title` + `subtitle`, `textOpacity`

**Root.tsx entry:**
```tsx
<Composition id="TitleCard" component={TitleCardScene} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{ title: 'Chapter One', subtitle: 'The beginning.', dark: false }} />
```

---

### OutlineToFillScene

**Props:** `word: string`, `dark?: boolean`, `bg?: string`

**Module-scope constants:**
```ts
const OUTLINE_PHASE_END = 20;
const FILL_PHASE_START = 20;
const FILL_PHASE_END = 35;
const WORD_SIZE = 140;
const WORD_WEIGHT = 900;
const STROKE_WIDTH = 2;
const LETTER_SPACING = -4;
```

**Animation:**
```ts
const entrySpring = spring({ frame, fps, config: springFast });
const scale = interpolate(entrySpring, [0, 1], [0.7, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
// Outline → fill: crossfade two layers
const fillOpacity = interpolate(frame, [FILL_PHASE_START, FILL_PHASE_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const outlineOpacity = interpolate(frame, [FILL_PHASE_START, FILL_PHASE_END], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
```

**JSX:** Two stacked absolutely-positioned text divs (same content, same size):
- Outline layer: `color: 'transparent'`, `WebkitTextStroke: \`${STROKE_WIDTH}px ${textColor}\``, `opacity: outlineOpacity`
- Fill layer: `color: textColor`, `opacity: fillOpacity`
Both wrapped in a `position: 'relative'` container with `transform: \`scale(${scale})\``.

**Root.tsx entry:**
```tsx
<Composition id="OutlineToFill" component={OutlineToFillScene} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{ word: 'BOLD', dark: true }} />
```

---

### WordSweepScene

**Props:** `words: string[]`, `dark?: boolean`, `bg?: string`

**Module-scope constants:**
```ts
const WORD_STAGGER = 8;
const SWEEP_DISTANCE = 200;
const WORD_SIZE = 80;
const WORD_WEIGHT = 700;
const WORD_LETTER_SPACING = -2;
const MAX_WORDS = 4;
```

**Animation (per word, index i):**
```ts
const wordDelay = i * WORD_STAGGER;
const wordSpring = spring({ frame: Math.max(0, frame - wordDelay), fps, config: springFast });
const wordX = interpolate(wordSpring, [0, 1], [SWEEP_DISTANCE, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const wordOpacity = interpolate(wordSpring, [0, 0.3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
```

**JSX:** Left-aligned column (max-width 1200px, centred). Each word in its own `div` with `transform: \`translateX(${wordX}px)\``, `opacity`.

**Root.tsx entry:**
```tsx
<Composition id="WordSweep" component={WordSweepScene} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{ words: ['Simple.', 'Powerful.', 'Yours.'], dark: false }} />
```

---

### CountdownScene

**Props:** `from?: number` (default 3), `dark?: boolean`, `bg?: string`

**Module-scope constants:**
```ts
const FRAMES_PER_NUMBER = 20;
const NUMBER_SIZE = 200;
const NUMBER_WEIGHT = 900;
const NUMBER_LETTER_SPACING = -6;
const SLAM_SCALE_START = 1.4;
```

**Animation:**
```ts
const totalNumbers = from ?? 3;
const currentIndex = Math.min(Math.floor(frame / FRAMES_PER_NUMBER), totalNumbers - 1);
const stepFrame = frame % FRAMES_PER_NUMBER;
const currentNumber = totalNumbers - currentIndex;

const numSpring = spring({ frame: stepFrame, fps, config: springBounce });
const numScale = interpolate(numSpring, [0, 1], [SLAM_SCALE_START, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const numOpacity = interpolate(stepFrame, [0, 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
```

**JSX:** Centred single number `div` showing `currentNumber`, `transform: \`scale(${numScale})\``, `opacity: numOpacity`.

**Root.tsx entry:**
```tsx
<Composition id="Countdown" component={CountdownScene} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{ from: 3, dark: true }} />
```

**Step:** Add all 4 to Root.tsx. Commit: `git commit -m "feat: add TitleCard, OutlineToFill, WordSweep, Countdown scenes"`

---

## Task 5: HighlightScene + BoldCentreScene + CinematicTextScene + ExitBlazeScene

**Files to create:**
- `src/scenes/HighlightScene.tsx`
- `src/scenes/BoldCentreScene.tsx`
- `src/scenes/CinematicTextScene.tsx`
- `src/scenes/ExitBlazeScene.tsx`

---

### HighlightScene

**Props:** `text: string`, `highlight: string`, `dark?: boolean`, `bg?: string`

**Module-scope constants:**
```ts
const TEXT_FADE_START = 0;
const TEXT_FADE_END = 14;
const UNDERLINE_DRAW_START = 16;
const UNDERLINE_DRAW_END = 32;
const TEXT_SIZE = 80;
const TEXT_WEIGHT = 700;
const UNDERLINE_HEIGHT = 6;
const UNDERLINE_RADIUS = 3;
const LETTER_SPACING = -2;
```

**Animation:**
```ts
const textOpacity = interpolate(frame, [TEXT_FADE_START, TEXT_FADE_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const underlineWidth = interpolate(frame, [UNDERLINE_DRAW_START, UNDERLINE_DRAW_END], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
```

**JSX:** Centred text. Render `text` — find `highlight` substring and wrap it in a `position: 'relative'` span. Inside that span, an absolute `div` at bottom: `height: UNDERLINE_HEIGHT`, `backgroundColor: accentColor`, `borderRadius: UNDERLINE_RADIUS`, `width: \`${underlineWidth}%\``. The text span must have `display: 'inline-block'` for the absolute child.

**Root.tsx entry:**
```tsx
<Composition id="Highlight" component={HighlightScene} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{ text: 'Built for speed.', highlight: 'speed', dark: false }} />
```

---

### BoldCentreScene

**Props:** `word: string`, `dark?: boolean`, `bg?: string`

**Module-scope constants:**
```ts
const GLOW_OPACITY = 0.12;
const GLOW_SIZE = 800;
const ENTRY_SCALE_START = 0.6;
const WORD_SIZE = 160;
const WORD_WEIGHT = 900;
const WORD_LETTER_SPACING = -5;
```

**Animation:**
```ts
const entrySpring = spring({ frame, fps, config: springBounce });
const scale = interpolate(entrySpring, [0, 1], [ENTRY_SCALE_START, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const opacity = interpolate(entrySpring, [0, 0.3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const glowOpacity = interpolate(entrySpring, [0, 1], [0, GLOW_OPACITY], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
```

**JSX:**
- Glow behind: `position: 'absolute'`, `width: GLOW_SIZE, height: GLOW_SIZE`, `borderRadius: '50%'`, `background: \`radial-gradient(ellipse, ${accentColor} 0%, transparent 70%)\``, `opacity: glowOpacity`
- Word: `transform: \`scale(${scale})\``, `opacity`, `fontSize: WORD_SIZE`, `fontWeight: WORD_WEIGHT`, `letterSpacing: WORD_LETTER_SPACING`

**Root.tsx entry:**
```tsx
<Composition id="BoldCentre" component={BoldCentreScene} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{ word: 'YES.', dark: true }} />
```

---

### CinematicTextScene

**Props:** `text: string`, `subtext?: string`, `dark?: boolean`, `bg?: string`

**Module-scope constants:**
```ts
const TEXT_FADE_START = 0;
const TEXT_FADE_END = 30;
const BAR_SLIDE_START = 32;
const BAR_SLIDE_END = 50;
const BAR_HEIGHT = 80;
const TEXT_SIZE = 64;
const TEXT_WEIGHT = 500;
const TEXT_LETTER_SPACING = 4;
const SUBTEXT_SIZE = 20;
const SUBTEXT_MARGIN_TOP = 16;
const SUBTEXT_LETTER_SPACING = 8;
```

**Animation:**
```ts
const textOpacity = interpolate(frame, [TEXT_FADE_START, TEXT_FADE_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const barScale = interpolate(frame, [BAR_SLIDE_START, BAR_SLIDE_END], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
```

**JSX:** Text centred, slightly wide letter-spacing (cinematic feel). Bars at top/bottom with `scaleY` from 0→1 after text is established.

**Root.tsx entry:**
```tsx
<Composition id="CinematicText" component={CinematicTextScene} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{ text: 'A NEW ERA', subtext: 'BEGINS NOW', dark: true }} />
```

---

### ExitBlazeScene

**Props:** `text: string`, `subtext?: string`, `dark?: boolean`, `bg?: string`

**Module-scope constants:**
```ts
const ENTRY_END = 20;
const HOLD_END = 38;
const EXIT_START = 40;
const EXIT_END = 55;
const EXIT_TRAVEL = -1200;
const TEXT_SIZE = 96;
const TEXT_WEIGHT = 700;
const TEXT_LETTER_SPACING = -2;
const SUBTEXT_DELAY = 14;
const SUBTEXT_SIZE = 28;
```

**Animation:**
```ts
const entrySpring = spring({ frame, fps, config: springFast });
const entryY = interpolate(entrySpring, [0, 1], [60, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const entryOpacity = interpolate(entrySpring, [0, 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const exitY = interpolate(frame, [EXIT_START, EXIT_END], [0, EXIT_TRAVEL], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const exitOpacity = interpolate(frame, [EXIT_START, EXIT_START + 8], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

// Combine: entry controls until EXIT_START, then exit takes over
const translateY = frame < EXIT_START ? entryY : exitY;
const opacity = frame < EXIT_START ? entryOpacity : exitOpacity;
const subtextOpacity = interpolate(frame, [SUBTEXT_DELAY, SUBTEXT_DELAY + 12], [0, frame < EXIT_START ? 1 : 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
```

**JSX:** Centred column with `transform: \`translateY(${translateY}px)\``, `opacity`. Text + subtext inside.

**Root.tsx entry:**
```tsx
<Composition id="ExitBlaze" component={ExitBlazeScene} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{ text: 'See you out there.', subtext: 'tapid.io', dark: false }} />
```

**Step:** Add all 4 to Root.tsx. Commit: `git commit -m "feat: add Highlight, BoldCentre, CinematicText, ExitBlaze scenes"`

---

## Task 6: TypeScript check + final commit

**Step 1:** Run TypeScript check:
```bash
cd "/Users/tim/Desktop/ProgrammaicVideo/Video Version 1/remotion-project" && npx tsc --noEmit 2>&1 | grep "error TS"
```
Expected: 0 errors. Fix any that appear (usually missing imports or wrong prop types).

**Step 2:** Verify all 20 compositions appear in Root.tsx — count with:
```bash
grep -c "Composition id=" src/Root.tsx
```
Expected: at least 20 new IDs present.

**Step 3:** Final commit:
```bash
git add -A && git commit -m "feat: complete 20 Apple keynote impact scenes"
```
