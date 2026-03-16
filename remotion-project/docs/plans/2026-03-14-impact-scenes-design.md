# Apple Keynote Impact Scenes — Design Document
**Date:** 2026-03-14

## Overview

20 standalone 2-second (~60 frame) impact scenes in the style of Apple keynote presentations. Each scene is a self-contained typographic/visual moment — a word slams in, a number counts up, text reveals from behind a mask. They are prop-driven, reusable, and accept a `dark` boolean + optional `bg` colour override.

---

## Goals

- Each scene is exactly ~60 frames (2s @ 30fps)
- Standalone — not connectors, just punchy standalone moments
- Prop-driven: `dark?: boolean`, `bg?: string`, plus scene-specific content props
- All animations purely frame-based (no useState, no useEffect, no CSS keyframes)
- All magic numbers at MODULE SCOPE as named constants
- Theme tokens used throughout (`theme.colors.text`, `theme.colors.accent`, etc.)

---

## The 20 Scenes

| # | Component | Description | Props |
|---|-----------|-------------|-------|
| 1 | `WordSlamScene` | Word scales 0.1→1 with extreme springBounce snap | `word: string` |
| 2 | `HeadlineBuildScene` | Multi-word phrase, each word pops in staggered 6 frames | `headline: string` |
| 3 | `StatCountScene` | Number counts 0→N in 40 frames, label fades below | `value: number`, `label: string`, `prefix?: string`, `suffix?: string` |
| 4 | `ScaleInOutScene` | Word starts at 4× scale, shrinks to 1×, slight overshoot | `word: string` |
| 5 | `LetterDropScene` | Letters fall from above one by one, spring-land into position | `word: string` |
| 6 | `MaskRevealScene` | Bg-coloured bar slides left→right exposing text | `text: string`, `subtext?: string` |
| 7 | `OverlineScene` | Thin accent line draws across, text fades in beneath | `text: string`, `subtext?: string` |
| 8 | `SplitRevealScene` | Text split at centre — top flies up, bottom down, both snap back | `text: string` |
| 9 | `WordFocusScene` | Text blurred (20px→0), sharpens into focus | `word: string`, `subtext?: string` |
| 10 | `StackBuildScene` | 3 lines stack vertically, each slides from right staggered | `lines: string[]` |
| 11 | `FlashCutScene` | White flash frame 0→4, bg settles, text spring-enters | `text: string`, `subtext?: string` |
| 12 | `PunchlineScene` | Big text hits frame 0, supporting text fades in frame 18 | `headline: string`, `sub: string` |
| 13 | `TitleCardScene` | Black letterbox bars animate in top+bottom, text fades centre | `title: string`, `subtitle?: string` |
| 14 | `OutlineToFillScene` | Text as stroke outline first, then fills solid | `word: string` |
| 15 | `WordSweepScene` | Words streak from right at high speed, decelerate to stop | `words: string[]` |
| 16 | `CountdownScene` | 3→2→1, each number slams in/out, hard cuts every 20 frames | `from?: number` |
| 17 | `HighlightScene` | Text appears, accent underline draws under a key word | `text: string`, `highlight: string` |
| 18 | `BoldCentreScene` | Single word, Poppins black weight, scales 0.6→1, soft glow | `word: string` |
| 19 | `CinematicTextScene` | Text fades in slow (0–30), letterbox bars slide in to frame | `text: string`, `subtext?: string` |
| 20 | `ExitBlazeScene` | Content appears (0–30), then blasts upward off screen at frame 40 | `text: string`, `subtext?: string` |

---

## Shared Props Pattern

```ts
type BaseImpactProps = {
  dark?: boolean;   // false = theme.colors.bg, true = theme.colors.text
  bg?: string;      // overrides dark entirely
}
```

- `dark=false`: bg = `theme.colors.bg` (`#F7F6F3`), text = `theme.colors.text` (`#111110`)
- `dark=true`: bg = `theme.colors.text` (`#111110`), text = `theme.colors.bg` (`#F7F6F3`)
- `bg` prop: custom bg color, text colour auto-inverted based on `dark`

---

## Typography

- Display/headline font: `theme.font.display` (Poppins)
- Body/sub font: `theme.font.body` (Poppins)
- Headline sizes: 96–160px for single words, 48–72px for phrases
- Weight: 700–900 (black) for impact words, 400–500 for subtitles
- Letter-spacing: -2px to -4px for large display text

---

## Animation Conventions

- `springBounce` (`stiffness: 180, damping: 14`) — slams, drops, overshoot
- `springFast` (`stiffness: 200, damping: 20`) — snappy reveals
- `interpolate` with both `extrapolateLeft/Right: 'clamp'` on all calls
- Blur: `style={{ filter: \`blur(${blurPx}px)\` }}` driven by `interpolate`
- Duration: scenes are 60 frames total, content animates in first 20–40 frames, holds

---

## File Locations

```
src/scenes/
  WordSlamScene.tsx
  HeadlineBuildScene.tsx
  StatCountScene.tsx
  ScaleInOutScene.tsx
  LetterDropScene.tsx
  MaskRevealScene.tsx
  OverlineScene.tsx
  SplitRevealScene.tsx
  WordFocusScene.tsx
  StackBuildScene.tsx
  FlashCutScene.tsx
  PunchlineScene.tsx
  TitleCardScene.tsx
  OutlineToFillScene.tsx
  WordSweepScene.tsx
  CountdownScene.tsx
  HighlightScene.tsx
  BoldCentreScene.tsx
  CinematicTextScene.tsx
  ExitBlazeScene.tsx
```

All scenes registered in `src/Root.tsx` as `<Composition>` entries with `durationInFrames={60}`, `fps={30}`, `width={1920}`, `height={1080}`.
