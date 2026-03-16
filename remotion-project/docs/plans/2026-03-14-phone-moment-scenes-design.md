# Phone Moment Scenes — Design Document
**Date:** 2026-03-14

## Overview

10 independent, reusable Remotion scene components that each show a single phone interaction moment. The phone screen is left **pure black (`#000000`)** so the user can composite their own video into it in post. Each scene has a unique ambient effect behind the phone and a lightweight UI interaction layer on top of the screen.

---

## Goals

- Each scene is self-contained — no shared PhoneShell component dependency
- Screen area stays `#000000` for easy video compositing
- iPhone-realistic shell consistent with existing 20-scene library
- Dynamic per-scene ambient effect (not a generic glow)
- `position` prop shifts phone left/centre/right with caption below
- All animations are purely frame-based (no `useEffect`, no `useState`)

---

## The 10 Scenes

| # | Component | Ambient Effect | Interaction Layer |
|---|-----------|---------------|-------------------|
| 1 | `PhoneNotificationScene` | Expanding indigo pulse rings | Notification banner slides down from top |
| 2 | `PhoneTypingScene` | Soft amber glow pulses in/out | Three-dot typing bubble floats in |
| 3 | `PhoneIncomingCallScene` | Green ripple waves radiating out | Green call bar slides up from bottom |
| 4 | `PhoneAppOpenScene` | Fast radial burst then fades | App icon scales up, screen snaps on |
| 5 | `PhoneLoadingScene` | Slow rotating halo arc | Spinner + progress bar on screen |
| 6 | `PhoneTapRippleScene` | Single ripple burst at tap point | Circle ripple expands from screen centre |
| 7 | `PhoneSwipeScene` | Horizontal motion blur streak | Ghost trail slides beside phone |
| 8 | `PhoneBadgeUpdateScene` | Quick indigo pop flash | Red badge number ticks up on app icon |
| 9 | `PhoneLockScreenScene` | Cool blue-grey moonlight radial | Lock screen: time, date, notification |
| 10 | `PhoneScreenshotScene` | White bloom flash then fades | Screen flashes white (shutter visual) |

---

## Props Shape (per scene)

```ts
type PhoneXxxSceneProps = {
  position?: 'center' | 'left' | 'right'  // default: 'center'
  caption?: string
  // scene-specific props listed below
}
```

### Scene-specific props

- **PhoneNotificationScene:** `appName`, `message`, `time?`
- **PhoneTypingScene:** `contactName?`
- **PhoneIncomingCallScene:** `callerName`, `callerSubtitle?`
- **PhoneAppOpenScene:** `appIcon`, `appName`
- **PhoneLoadingScene:** `label?`, `progress?` (0–1, animates to this value)
- **PhoneTapRippleScene:** `rippleColor?`
- **PhoneSwipeScene:** `direction?` (`'left' | 'right'`, default `'left'`)
- **PhoneBadgeUpdateScene:** `appIcon`, `fromCount?`, `toCount`
- **PhoneLockScreenScene:** `time?`, `date?`, `notificationText?`
- **PhoneScreenshotScene:** no scene-specific props

---

## Phone Shell Spec

- **Width:** 400px | **Height:** 820px
- **Shell border:** 10px solid `#111110`
- **Border radius:** 48px
- **Screen area:** fills inside shell, `#000000`
- **Dynamic island:** 90×28px near-black pill, centred at top of screen, `z-index` above screen
- **Side buttons:** decorative 4px-wide raised bars on right edge (power) and left edge (volume ×2)
- **Shadow:** `0 32px 80px rgba(0,0,0,0.22)`

---

## Position Prop Behaviour

| Value | Phone x-offset | Caption alignment |
|-------|---------------|-------------------|
| `center` | 0 (centred) | Centred below phone |
| `left` | −320px from centre | Left-aligned |
| `right` | +320px from centre | Right-aligned |

---

## Animation Conventions

- Use `useCurrentFrame()` + `useVideoConfig()` from Remotion
- Use `spring()` and `interpolate()` from Remotion — no CSS keyframes
- Ambient effects use `interpolate(frame, ...)` for radial scale/opacity
- Interaction layers use `spring({ frame: frame - delay, fps, config: springFast })`
- `springFast`: `{ stiffness: 200, damping: 20 }`
- `springBounce`: `{ stiffness: 180, damping: 14 }`

---

## File Locations

```
src/scenes/
  PhoneNotificationScene.tsx
  PhoneTypingScene.tsx
  PhoneIncomingCallScene.tsx
  PhoneAppOpenScene.tsx
  PhoneLoadingScene.tsx
  PhoneTapRippleScene.tsx
  PhoneSwipeScene.tsx
  PhoneBadgeUpdateScene.tsx
  PhoneLockScreenScene.tsx
  PhoneScreenshotScene.tsx
```

All scenes import from `../config/theme` and `remotion` only.
