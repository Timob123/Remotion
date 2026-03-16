# Phone Moment Scenes — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build 10 independent, reusable Remotion phone mockup scenes with blank black screens (for video compositing) and unique per-scene ambient effects.

**Architecture:** Each scene is a fully self-contained `.tsx` file — no shared PhoneShell component. All animations are purely frame-based using `useCurrentFrame()`, `spring()`, and `interpolate()` from Remotion. No `useState`, no `useEffect`, no CSS keyframes.

**Tech Stack:** Remotion, React, TypeScript, `../config/theme`, `../hooks/useSceneAnimation`

---

## Reusable Phone Shell Pattern

Every scene uses this exact phone shell (copy verbatim, then add ambient + interaction):

```tsx
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { springFast, springBounce } from '../hooks/useSceneAnimation';

// Props
type PhoneXxxSceneProps = {
  position?: 'center' | 'left' | 'right';
  caption?: string;
  // scene-specific props here
};

export const PhoneXxxScene: React.FC<PhoneXxxSceneProps> = ({
  position = 'center',
  caption,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const xOffset = position === 'left' ? -320 : position === 'right' ? 320 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* ── AMBIENT EFFECT (behind phone) ── */}
      <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `translateX(${xOffset}px)` }}>
        {/* scene-specific ambient divs go here */}
      </div>

      {/* ── PHONE SHELL ── */}
      <div style={{ position: 'relative', transform: `translateX(${xOffset}px)` }}>
        {/* Side buttons */}
        <div style={{ position: 'absolute', right: -14, top: 160, width: 4, height: 60, backgroundColor: '#222', borderRadius: 2 }} />
        <div style={{ position: 'absolute', left: -14, top: 120, width: 4, height: 40, backgroundColor: '#222', borderRadius: 2 }} />
        <div style={{ position: 'absolute', left: -14, top: 175, width: 4, height: 40, backgroundColor: '#222', borderRadius: 2 }} />

        {/* Shell */}
        <div style={{
          width: 400, height: 820,
          border: '10px solid #111110',
          borderRadius: 48,
          backgroundColor: '#111110',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.22)',
        }}>
          {/* Dynamic island */}
          <div style={{
            position: 'absolute', top: 14, left: '50%',
            transform: 'translateX(-50%)',
            width: 90, height: 28,
            backgroundColor: '#000', borderRadius: 14, zIndex: 10,
          }} />

          {/* BLACK SCREEN — user composites video here */}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: '#000000' }} />

          {/* ── INTERACTION LAYER (on screen) ── */}
          {/* scene-specific interaction elements go here, position: 'absolute' */}
        </div>
      </div>

      {/* ── CAPTION ── */}
      {caption && (
        <div style={{
          position: 'absolute',
          bottom: 60,
          left: '50%',
          transform: `translateX(calc(-50% + ${xOffset}px))`,
          fontFamily: theme.font.body,
          fontSize: 18,
          color: theme.colors.textMuted,
          textAlign: 'center',
          maxWidth: 500,
          opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          {caption}
        </div>
      )}
    </AbsoluteFill>
  );
};
```

---

## Task 1: PhoneNotificationScene

**File:** `src/scenes/PhoneNotificationScene.tsx`

**Props:** `position?`, `caption?`, `appName: string`, `message: string`, `time?: string`

**Ambient effect:** 3 concentric indigo pulse rings expanding outward (like sonar). Each ring: `borderRadius: '50%'`, `border: '2px solid #6366F1'`, starts small and grows. Ring 1 starts at frame 0, ring 2 at frame 8, ring 3 at frame 16. Each ring: scale `1→2.5`, opacity `0.5→0`.

```tsx
// Ring pattern (repeat 3× with different delays)
const ring1Scale = interpolate(frame, [0, 60], [1, 2.5], { extrapolateRight: 'clamp' });
const ring1Opacity = interpolate(frame, [0, 60], [0.5, 0], { extrapolateRight: 'clamp' });
// Render:
<div style={{
  position: 'absolute',
  width: 500, height: 500,
  border: '2px solid #6366F1',
  borderRadius: '50%',
  transform: `scale(${ring1Scale})`,
  opacity: ring1Opacity,
}} />
```

**Interaction layer:** White notification banner slides in from `y: -120` to `y: 16` using `spring({ frame: Math.max(0, frame - 8), fps, config: springFast })`. Banner: `position: 'absolute'`, `top: 50`, `left: 12`, `right: 12`, white bg, `borderRadius: 16`, `padding: '10px 14px'`, `boxShadow: '0 4px 20px rgba(0,0,0,0.3)'`. Inside: small app name row (12px muted) + message row (14px bold) + time right-aligned (11px muted).

**Step 1:** Create the file with complete implementation above.

**Step 2:** Register in `src/Root.tsx` — add a new `<Composition>` with `id="PhoneNotification"`, `component={PhoneNotificationScene}`, `durationInFrames={120}`, `fps={30}`, `width={1920}`, `height={1080}`, `defaultProps={{ appName: 'Messages', message: 'Hey, are you free tonight?', time: 'now', caption: 'Push notification arrives instantly.' }}`.

**Step 3:** Run `cd remotion-project && npx remotion studio` and open `http://localhost:3000`. Navigate to `PhoneNotification` composition and scrub through frames 0–120 to verify rings expand and banner slides in.

**Step 4:** Commit — `git add src/scenes/PhoneNotificationScene.tsx src/Root.tsx && git commit -m "feat: add PhoneNotificationScene"`

---

## Task 2: PhoneTypingScene

**File:** `src/scenes/PhoneTypingScene.tsx`

**Props:** `position?`, `caption?`, `contactName?: string`

**Ambient effect:** Soft amber radial glow behind phone. Single `div` with `background: 'radial-gradient(ellipse, rgba(251,191,36,0.18) 0%, transparent 70%)'`, `width: 700, height: 700`. Opacity pulses: `Math.sin(frame * 0.08) * 0.3 + 0.7` (gentle breathing).

**Interaction layer:** Chat bubble at `bottom: 80`, `left: 20`. White rounded pill `borderRadius: 20`, `padding: '12px 18px'`, `boxShadow: '0 2px 12px rgba(0,0,0,0.15)'`. Slides up from `y: 40` at frame 10. Inside: 3 dots side by side, each 10px circle, `backgroundColor: '#6B6963'`. Each dot opacity: `Math.sin(frame * 0.15 + i * 1.2) * 0.4 + 0.6`. Contact name label above bubble: `fontSize: 12`, muted, fades in at frame 5.

**Step 1:** Create the file. **Step 2:** Register composition `id="PhoneTyping"`, `durationInFrames={120}`. **Step 3:** Verify in Studio. **Step 4:** Commit.

---

## Task 3: PhoneIncomingCallScene

**File:** `src/scenes/PhoneIncomingCallScene.tsx`

**Props:** `position?`, `caption?`, `callerName: string`, `callerSubtitle?: string`

**Ambient effect:** 3 green ripple rings (same pattern as Task 1 but green `#22C55E`, larger base size `600×600`, and slower: scale `1→3`, frames 0→90 staggered by 20 frames each).

**Interaction layer:** Green call bar slides up from bottom. `position: 'absolute'`, `bottom: 0`, `left: 0`, `right: 0`, `height: 200`, `backgroundColor: '#16A34A'`, `borderRadius: '24px 24px 0 0'`, `padding: 24`. Slides from `y: 200` to `y: 0` at frame 12 with `springFast`. Inside (vertically centred): caller name 18px bold white, subtitle 13px muted stone-200, then row with red phone (✕) circle button left and green phone (✓) circle button right. Buttons: 56px circles, white bg with coloured icon.

**Step 1:** Create. **Step 2:** Register `id="PhoneIncomingCall"`, `durationInFrames={150}`. **Step 3:** Verify. **Step 4:** Commit.

---

## Task 4: PhoneAppOpenScene

**File:** `src/scenes/PhoneAppOpenScene.tsx`

**Props:** `position?`, `caption?`, `appIcon: string` (emoji), `appName: string`

**Ambient effect:** Radial burst — 8 thin lines radiating outward from centre at frame 0, fading quickly. Each line: `position: 'absolute'`, `width: 2, height: 120`, `backgroundColor: theme.colors.accent`, `transformOrigin: 'bottom centre'`, rotated `i * 45` degrees, `translateY(-80px)`. Opacity: `interpolate(frame, [0, 20], [0.6, 0], { extrapolateRight: 'clamp' })`.

**Interaction layer:** App icon block centred on screen. 80×80px rounded square (`borderRadius: 20`) with `backgroundColor: '#6366F1'`, emoji at 40px inside. App name below in white 14px. Whole block: scale from `0.4→1` with `springBounce` at frame 4, opacity from `0→1` frames 4–16.

**Step 1:** Create. **Step 2:** Register `id="PhoneAppOpen"`, `durationInFrames={90}`. **Step 3:** Verify. **Step 4:** Commit.

---

## Task 5: PhoneLoadingScene

**File:** `src/scenes/PhoneLoadingScene.tsx`

**Props:** `position?`, `caption?`, `label?: string`, `progress?: number` (0–1, default 0.7)

**Ambient effect:** Rotating halo — SVG circle, `r=280`, `stroke='#6366F1'`, `strokeWidth=3`, `strokeOpacity=0.15`, full circle. On top: second arc `r=280`, `stroke='#6366F1'`, `strokeWidth=3`, `strokeDasharray='140 1619'` (short arc). Rotate with `transform: \`rotate(${frame * 2}deg)\`` on a wrapping div.

**Interaction layer:** Centred vertically on screen. SVG spinner: 48px circle with `strokeDasharray` of arc rotating with `frame * 4` degrees transform. Label below (if provided): 14px white, fades in at frame 10. Thin progress bar: `position: 'absolute'`, `bottom: 100`, `left: 30, right: 30`, `height: 3`, `backgroundColor: 'rgba(255,255,255,0.15)'`, filled portion `width: ${progress * 100}%`, `backgroundColor: '#6366F1'`, animates from 0 to `progress` over frames 10–60 with `interpolate`.

**Step 1:** Create. **Step 2:** Register `id="PhoneLoading"`, `durationInFrames={120}`. **Step 3:** Verify. **Step 4:** Commit.

---

## Task 6: PhoneTapRippleScene

**File:** `src/scenes/PhoneTapRippleScene.tsx`

**Props:** `position?`, `caption?`, `rippleColor?: string` (default `'#6366F1'`)

**Ambient effect:** Same single-ring burst as the on-screen ripple but larger (800×800, lower opacity 0.15, slower fade frames 0→80).

**Interaction layer:** Single ripple circle centred on screen. `position: 'absolute'`, centred with `top: '50%', left: '50%', transform: 'translate(-50%,-50%)'`. Circle: `border: \`2px solid ${rippleColor}\``, `borderRadius: '50%'`. Scale: `interpolate(frame, [5, 50], [0.05, 2], { extrapolateRight: 'clamp' })` × 300px base size. Opacity: `interpolate(frame, [5, 50], [0.8, 0], { extrapolateRight: 'clamp' })`. Small dot at centre: 12px circle, rippleColor fill, fades from `1→0` frames 5–20.

**Step 1:** Create. **Step 2:** Register `id="PhoneTapRipple"`, `durationInFrames={90}`. **Step 3:** Verify. **Step 4:** Commit.

---

## Task 7: PhoneSwipeScene

**File:** `src/scenes/PhoneSwipeScene.tsx`

**Props:** `position?`, `caption?`, `direction?: 'left' | 'right'` (default `'left'`)

**Ambient effect:** Horizontal motion blur streak — 3 thin horizontal lines beside the phone on the swipe side. Each line: `height: 2`, `backgroundColor: theme.colors.accent`, `opacity: 0.15`, widths 80/60/40px staggered vertically ±20px. They animate from `opacity 0→0.4→0` over frames 8–30–50. Direction determines which side they appear (`left` = lines appear on right side of phone, `right` = left side).

**Interaction layer:** Ghost card on screen slides horizontally. A white semi-transparent card `backgroundColor: 'rgba(255,255,255,0.06)'`, `borderRadius: 12`, `width: 300, height: 180`, centred vertically, translates from `x: 0` to `x: direction === 'left' ? -320 : 320` over frames 8–40 with `spring({ frame: Math.max(0, frame - 8), fps, config: springFast })` → `interpolate(p, [0,1], [0, dir])`.

**Step 1:** Create. **Step 2:** Register `id="PhoneSwipe"`, `durationInFrames={90}`. **Step 3:** Verify. **Step 4:** Commit.

---

## Task 8: PhoneBadgeUpdateScene

**File:** `src/scenes/PhoneBadgeUpdateScene.tsx`

**Props:** `position?`, `caption?`, `appIcon: string` (emoji), `fromCount?: number` (default 0), `toCount: number`

**Ambient effect:** Quick indigo pop flash — single div `background: 'radial-gradient(ellipse, rgba(99,102,241,0.25) 0%, transparent 60%)'`, `width: 600, height: 600`. Scale: `interpolate(frame, [0, 8, 20], [0.8, 1.1, 1], { extrapolateRight: 'clamp' })`. Opacity: `interpolate(frame, [0, 4, 30], [0, 1, 0.3], { extrapolateRight: 'clamp' })`.

**Interaction layer:** App icon on screen — same as Task 4 (80px rounded square, emoji). Badge: `position: 'absolute'`, `top: -8, right: -8`, `minWidth: 24, height: 24`, `backgroundColor: '#EF4444'`, `borderRadius: 12`, `color: '#fff'`, `fontSize: 12`, `fontWeight: 700`. Badge count: `fromCount` at frame 0, switches to `toCount` at frame 15. Badge scale pulses: `spring({ frame: Math.max(0, frame - 14), fps, config: springBounce })` → `interpolate(p, [0,1], [0.3, 1])`.

**Step 1:** Create. **Step 2:** Register `id="PhoneBadgeUpdate"`, `durationInFrames={90}`. **Step 3:** Verify. **Step 4:** Commit.

---

## Task 9: PhoneLockScreenScene

**File:** `src/scenes/PhoneLockScreenScene.tsx`

**Props:** `position?`, `caption?`, `time?: string` (default `'9:41'`), `date?: string` (default `'Saturday, March 14'`), `notificationText?: string`

**Ambient effect:** Cool moonlight radial — `background: 'radial-gradient(ellipse, rgba(148,163,184,0.12) 0%, transparent 65%)'`, `width: 700, height: 700`. Static (no animation). Subtle second ring: `border: '1px solid rgba(148,163,184,0.08)'`, `width: 500, height: 500`, `borderRadius: '50%'`.

**Interaction layer:** Dark lock screen UI on black. Time: centred at `top: 180`, white, 72px Poppins bold (use `theme.font.display`), fades in at frame 8. Date: below time, 16px muted stone-300 (`#D1D5DB`), fades in at frame 14. Notification card (if `notificationText`): white semi-transparent `backgroundColor: 'rgba(255,255,255,0.12)'`, `backdropFilter: 'blur(10px)'`, `borderRadius: 16`, `padding: 16`, appears at `bottom: 200`, slides up from `y: 20` at frame 20. Lock icon SVG (simple padlock path or just 🔒 emoji at 24px) centred above time.

**Step 1:** Create. **Step 2:** Register `id="PhoneLockScreen"`, `durationInFrames={150}`. **Step 3:** Verify. **Step 4:** Commit.

---

## Task 10: PhoneScreenshotScene

**File:** `src/scenes/PhoneScreenshotScene.tsx`

**Props:** `position?`, `caption?`

**Ambient effect:** White bloom flash — full-scene white overlay `position: 'absolute', inset: 0`, `backgroundColor: '#fff'`, opacity: `interpolate(frame, [8, 12, 28], [0, 0.85, 0], { extrapolateRight: 'clamp' })`. Additionally a second subtler bloom behind the phone: `background: 'radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, transparent 55%)'`, `width: 600, height: 600`, same opacity curve.

**Interaction layer:** Screen flash — inside the phone screen, white fill `position: 'absolute', inset: 0, backgroundColor: '#fff'`, opacity: `interpolate(frame, [8, 12, 24], [0, 1, 0], { extrapolateRight: 'clamp' })`. Corner bracket indicators (simulating a screenshot UI): 4 small white `3px` L-shaped borders at screen corners, `position: 'absolute'`, 20px arms. Fade out with the flash. Shutter "click" visual: thin white horizontal line `height: 2, left: 0, right: 0` sweeps from `top: 0` to `top: 820` between frames 8–20 (`interpolate(frame, [8, 20], [0, 820])`), opacity 0.6.

**Step 1:** Create. **Step 2:** Register `id="PhoneScreenshot"`, `durationInFrames={90}`. **Step 3:** Verify. **Step 4:** Commit.

---

## Final Task: Cleanup & Export

**Step 1:** Open `src/Root.tsx`, verify all 10 new compositions are registered with correct `fps={30}`, `width={1920}`, `height={1080}`.

**Step 2:** Open `src/config/videoConfig.ts`, add entries for all 10 scenes so they appear in the config-driven system alongside the original 20.

**Step 3:** Run `npx remotion studio` and spot-check all 10 in the studio — scrub each one end-to-end.

**Step 4:** Final commit:
```bash
git add -A
git commit -m "feat: add 10 phone moment scenes with ambient effects"
```
