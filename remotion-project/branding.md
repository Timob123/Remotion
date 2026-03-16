---
name: tapid-brand
description: >
  Tapid brand guidelines for video animation, motion design, and visual content creation.
  Use this skill whenever creating, scripting, or directing any Tapid visual asset — including
  Remotion video scripts, motion graphics, social media animations, product demo videos, pitch
  deck animations, explainer videos, or any other moving or static visual content for Tapid.
  Always load this skill before producing any Tapid visual output so colours, typography, motion
  timing, voice and component patterns are applied consistently.
---

# Tapid Brand Guidelines
### Version 1.0 — March 2026

---

## 1. Brand Identity

### Company
**Tapid Ventures Limited** | CRO 782927 | NovaUCD, Dublin

### One-Line Description
Spend rewards infrastructure for independent businesses.

### Tagline Options
- "Set up once. Run forever."
- "Rewards without the work."
- "Built for the independent."

### Brand Personality
Tapid is **clean, confident, and founder-built**. The brand sits between fintech precision and
the warmth of local commerce. It is not corporate. It is not playful startup. It is the tool a
serious operator uses because it works, not because it looks nice.

**Tone attributes:** Direct. Efficient. Grounded. Slightly understated. Let the numbers do the talking.

**Never:** Hype language, exclamation marks used cheaply, buzzwords (disruptive, revolutionary,
game-changing), or anything that sounds like a VC pitch rather than a product.

---

## 2. Logo

### Wordmark
- **Text:** `Tapid` - capital T, lowercase apid
- **Font:** Poppins 700 (Bold)
- **Letter spacing:** -1.5px (tight)
- **Colour (primary):** `#0A0A0A` on light backgrounds
- **Colour (reversed):** `#FFFFFF` on dark backgrounds

### Logo Mark
- The wordmark is followed by a filled circle dot: `Tapid•`
- Dot colour: always `#00A855` (Tapid Green) regardless of background
- Dot size: approximately 22% of cap height
- Dot vertical position: baseline +3px (sits slightly above baseline)
- Do not separate the dot from the wordmark

### Clear Space
- Minimum clear space: 1x the height of the capital T on all sides
- Never crowd the logo against other elements

### Forbidden
- Do not stretch, rotate, or apply effects to the wordmark
- Do not change the dot colour
- Do not use all-caps (`TAPID`)
- Do not use a different font
- Do not add a tagline directly attached to the logo (keep separate)

---

## 3. Colour Palette

### Primary Colours

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Tapid Green** | `#00A855` | 0, 168, 85 | Primary CTA, accents, logo dot, key numbers |
| **Tapid Black** | `#0A0A0A` | 10, 10, 10 | Headlines, body on light, reversed backgrounds |
| **Pure White** | `#FFFFFF` | 255, 255, 255 | Backgrounds, reversed text |

### Secondary Colours

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Surface Grey** | `#F8FAFC` | 248, 250, 252 | Page/slide backgrounds, card fills |
| **Border Grey** | `#E2E8F0` | 226, 232, 240 | Dividers, card borders, rules |
| **Body Text** | `#0F172A` | 15, 23, 42 | Body copy, dark UI text |
| **Muted Text** | `#64748B` | 100, 116, 139 | Secondary text, labels, captions |
| **Light Green** | `#F0FDF4` | 240, 253, 244 | Green tint backgrounds, hover states |
| **Green Border** | `rgba(0,168,85,0.25)` | - | Subtle green borders, callout highlights |

### Colour Rules
- **Primary green is an accent, not a background colour.** Use it for nodes, dots, key numbers,
  CTAs and emphasis - not for large fills.
- **Light backgrounds are default.** Dark mode is acceptable for specific animations but the
  primary brand is light.
- **Never use gradients on the green.** Solid only.
- **Avoid purple, orange, or red as decorative colours.** These appear in data visualisations
  only (Sankey charts, P&L breakdowns) where colour differentiation is functional.

### Data Visualisation Colour Set
When charting multiple series (Sankey, cost breakdowns, bar charts):

| Series | Hex |
|--------|-----|
| Revenue / primary | `#00A855` |
| Cost of revenue | `#F87171` |
| Gross profit | `#00A855` |
| Salaries / OpEx | `#F59E0B` |
| Sales and GTM | `#EF4444` |
| G and A | `#8B5CF6` |
| EBITDA | `#06B6D4` |
| Infrastructure | `#3B82F6` |
| Neutral flows | `#94A3B8` |

---

## 4. Typography

### Primary Typeface
**Poppins** (Google Fonts) — used across all brand touchpoints.

Import URL: `https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap`

### Type Scale

| Role | Weight | Screen size | Print size | Usage |
|------|--------|------------|------------|-------|
| Display / Hero | 700 | 28-36px | 22-28pt | Main headlines in video, hero text |
| Section Head | 700 | 20-24px | 16-18pt | Section titles, slide headers |
| Sub-head | 600 | 15-18px | 12-14pt | Card titles, callout labels |
| Body | 400 | 12-14px | 10-11pt | Body copy, descriptions |
| Label / Caption | 500-600 | 8-10px | 7-9pt | Data labels, tags, uppercase labels |
| Micro | 400-500 | 7-8px | 6-7pt | Legal, footnotes, fine print |

### Letter Spacing
- Display / hero: `-1px` to `-1.5px` (tight)
- Section heads: `-0.3px` to `0`
- Body: `0` (default)
- Uppercase labels: `+0.1em` to `+0.15em` (open tracking)

### Line Height
- Display: 1.2-1.35
- Body: 1.55-1.65
- Labels: 1.2-1.3

### Typography Rules
- **Never use Arial, Inter, Roboto or system fonts in brand output.** Poppins only.
- **Uppercase is for small labels only** - section headings, stat labels, badge text.
  Never use all-caps for headlines or body copy.
- **Bold means 600-700.** Reserve 700-800 for wordmark and largest display numbers only.

---

## 5. Motion Design Principles

### Core Philosophy
Tapid motion is **purposeful and efficient**. Animations serve clarity, not decoration.
Every motion should reveal information, guide attention, or signal state change.
Avoid motion for motion's sake.

### Timing Tokens

| Token | Duration | Easing | Use |
|-------|----------|--------|-----|
| `instant` | 0ms | - | State changes with no transition |
| `fast` | 150ms | `ease-out` | Hover states, micro-interactions |
| `standard` | 300ms | `ease-in-out` | UI transitions, card reveals |
| `enter` | 400-500ms | `cubic-bezier(0.16,1,0.3,1)` | Elements entering the scene |
| `exit` | 200-250ms | `ease-in` | Elements leaving the scene |
| `slow` | 600-800ms | `cubic-bezier(0.16,1,0.3,1)` | Hero animations, section transitions |
| `stagger` | 80-120ms | - | Delay between sequential items |

### Easing Reference
- **Enter (springy):** `cubic-bezier(0.16, 1, 0.3, 1)` - fast acceleration, gentle settle
- **Exit:** `ease-in` or `cubic-bezier(0.4, 0, 1, 1)` - quick departure
- **Standard:** `ease-in-out` - balanced, neutral
- **Never use linear easing** for UI animations. Linear feels mechanical.

### Motion Patterns

#### Fade + Translate (primary entry pattern)
```
opacity: 0 -> 1
translateY: 16px -> 0
duration: 400-500ms
easing: cubic-bezier(0.16,1,0.3,1)
```

#### Scale Reveal (for numbers and callouts)
```
opacity: 0 -> 1
scale: 0.92 -> 1
duration: 400ms
easing: cubic-bezier(0.16,1,0.3,1)
```

#### Stagger (for lists and grids)
```
item_1: delay 0ms
item_2: delay 80ms
item_3: delay 160ms
item_n: delay n * 80ms
```

#### Number Counter
Stats and key figures count up when they enter:
- Duration: 800ms-1200ms total
- Easing: `ease-out` (fast start, slow finish)
- Integers: count by whole numbers
- Decimals: count to 1dp

#### Green Dot Pulse (logo animation)
1. Wordmark fades/slides in (400ms)
2. Green dot scales 0 to 1.15 then settles to 1 (300ms, spring easing)
3. Optional: brief green glow pulse (`box-shadow: 0 0 12px #00A855`, 600ms)

#### Flow Lines (transaction/data flow animations)
When showing open banking transaction detection:
- Dashed line draws left to right
- Colour: `#00A855` at 60% opacity
- Speed: 400-600ms per segment
- Filled dot appears at endpoint after line completes

---

## 6. Video Format Specs

### Social / LinkedIn (primary)
- **Dimensions:** 1080x1920px (9:16) or 1080x1080px (1:1)
- **Duration:** 15-45 seconds
- **Frame rate:** 30fps
- **Safe zone:** 80px inset all edges

### Demo / Investor (secondary)
- **Dimensions:** 1920x1080px (16:9)
- **Duration:** 60-120 seconds
- **Frame rate:** 60fps for UI demos, 30fps for narrative
- **Safe zone:** 60px inset all edges

### Story / Reel
- **Dimensions:** 1080x1920px (9:16)
- **Duration:** 7-15 seconds
- **Frame rate:** 30fps

---

## 7. Animation Scenes - Tapid Product Demos

### Scene 1: Auto Points Award
**Concept:** Customer pays at a cafe. Tapid detects the payment automatically. Points awarded.

**Flow:**
1. Phone showing cafe payment notification (0.5s)
2. Open banking feed detects transaction - green pulse from payment icon (0.8s)
3. "Points awarded" card slides up from bottom, Tapid Green fill (0.6s)
4. Points counter increments with number animation (1.2s)
5. Merchant dashboard updates quietly in background (0.4s)

**Key visual:** Green connection line between bank feed and points card.
Zero scanning. Zero tapping. Fully automatic.

### Scene 2: Reward Redemption
**Concept:** Customer redeems points via QR code.

**Flow:**
1. Customer points tally shown (0.3s)
2. "Redeem" tap - QR code expands from centre (0.5s, scale + fade)
3. Merchant scans - green checkmark pulse (0.4s)
4. Points deducted with confetti burst in Tapid Green (0.8s)
5. "See you next time" message fades in (0.5s)

### Scene 3: Class Booking (Tapid Visits)
**Concept:** Studio owner sets up classes, customer books, auto reward triggers.

**Flow:**
1. Studio dashboard - class schedule grid enters with stagger (0.8s)
2. Customer books via embedded widget (0.6s)
3. Stripe payment processes - animated card icon (0.5s)
4. Visit reward automatically issued - same green pulse pattern (0.6s)
5. Owner dashboard: "1 new booking" notification (0.4s)

### Scene 4: Flash Campaign
**Concept:** Merchant sends push notification to at-risk customers.

**Flow:**
1. Dashboard showing "At Risk: 12 customers" in amber (0.5s)
2. Merchant taps "Send Flash Campaign" (0.3s)
3. Push notification card expands - Tapid branded (0.6s)
4. Notification delivered counter increments (0.8s)
5. Customer re-engagement - green "returned" indicator (0.5s)

---

## 8. UI Component Patterns (for mockup animations)

### Cards
- Background: `#FFFFFF`
- Border: `1px solid #E2E8F0`
- Border radius: `10-12px`
- Shadow: `0 1px 4px rgba(0,0,0,0.06)`
- Padding: `16-20px`

### Primary CTA Button
- Background: `#00A855`
- Text: `#FFFFFF`, Poppins 600, 12-13px
- Border radius: `6-8px`
- Padding: `10px 20px`
- Hover state: `#008f47`
- No border

### Stat Callout
- Number: Poppins 700, 18-22px, `#00A855`
- Label: Poppins 500, 9-10px, `#64748B`, uppercase, tracked
- Background: `#F0FDF4`
- Border: `1px solid rgba(0,168,85,0.25)`
- Border radius: `8px`

### Section Label (uppercase tag)
- Font: Poppins 700, 7.5-9px
- Colour: `#00A855`
- Letter spacing: `0.12-0.16em`
- Text transform: uppercase
- Followed by horizontal rule: `1px solid #E2E8F0`

### Notification / Toast
- Background: `#0F172A`
- Text: `#FFFFFF`
- Accent bar: `3px left border, #00A855`
- Border radius: `8px`
- Entry: `translateY(20px) -> 0`, 400ms spring easing

---

## 9. Voice and Copy

### Headlines
- Active voice always
- No em-dashes (use plain hyphen or restructure the sentence)
- No exclamation marks in product or investor copy
- Lead with the benefit, not the feature

**Good:** "Every payment detected. Zero effort from your staff."
**Bad:** "Introducing our revolutionary AI-powered rewards platform!"

### Numbers
- Use `€` not `EUR`
- Format: `€21.99`, `€871k`, `€1.32M`
- Percentages: `98%` not `98 percent`
- Always use real numbers - never approximate with "many" or "lots"

### Product Names (exact capitalisation always)
- `Tapid Rewards` - capital T, capital R
- `Tapid Visits` - capital T, capital V
- `Tapid` alone - refers to the platform or company
- Never `tapid`, never `TAPID`

### Forbidden Words
- "loyal" / "loyalty" - Tapid uses **rewards**
- "disruptive" / "revolutionary" / "game-changing"
- "seamless" (overused in fintech)
- "leverage" used metaphorically
- "synergy" / "ecosystem" unless very specific

---

## 10. Music and Sound (Video)

### Music Style
- Minimal, modern, slightly ambient
- Tempo: 90-110 BPM for product demos; 70-85 BPM for investor/brand content
- No vocals in product demo videos
- No aggressive beats or drops - clean progression

### Sound Design
- Transaction detected: soft digital chime, single note C or E, ~200ms
- Points awarded: ascending two-note tone (minor third up), clean and brief
- Booking confirmed: soft success tone, warm
- Push notification: neutral tap sound

### Volume Levels
- Music beds under VO: -18 to -20 dB
- Music beds without VO: -12 dB
- UI sounds: -10 to -12 dB
- Keep audio centred - no hard panning

---

## 11. Remotion-Specific Notes

### Composition Defaults
```js
export const tapidComposition = {
  width: 1080,
  height: 1920,   // 9:16; swap to 1920x1080 for landscape
  fps: 30,
  durationInFrames: 450,  // 15 seconds default
};
```

### Font Loading
```js
import { loadFont } from "@remotion/google-fonts/Poppins";
const { fontFamily } = loadFont();
// Use fontFamily in all text style objects
```

### Spring Config (primary Tapid animation feel)
```js
import { spring } from "remotion";
const value = spring({
  fps,
  frame,
  config: {
    damping: 20,
    stiffness: 80,
    mass: 1,
  },
});
```

### Fade + Translate Helper
```js
import { interpolate, useCurrentFrame } from "remotion";
const frame = useCurrentFrame();

const opacity = interpolate(frame, [0, 15], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
const translateY = interpolate(frame, [0, 15], [16, 0], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
// Apply: style={{ opacity, transform: `translateY(${translateY}px)` }}
```

### Stagger Helper
```js
// 3 frames (100ms at 30fps) between each item
const STAGGER = 3;
const frameForItem = (index) => Math.max(0, frame - index * STAGGER);
```

### Green Dot Pulse
```js
const dotScale = spring({
  fps,
  frame,
  from: 0,
  to: 1,
  config: { damping: 12, stiffness: 100 },
});
// Apply: style={{ transform: `scale(${dotScale})`, color: "#00A855" }}
```

### Number Counter
```js
const countedValue = interpolate(
  frame,
  [0, 36],  // 0 to 1.2s at 30fps
  [0, targetValue],
  {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  }
);
```

---

## 12. Quick Reference - Brand Don'ts

| Never Do | Reason |
|----------|--------|
| Write `EUR` instead of `€` | Off-brand, verbose |
| Use em-dashes in copy | Style rule - use hyphens |
| Use "loyalty" for Tapid's product | Tapid uses "rewards" |
| Write `tapid` lowercase in copy | Always `Tapid` |
| Use Inter, Roboto or Arial | Poppins only |
| Apply gradients to the green | Solid colour only |
| Use exclamation marks in headlines | Tone is confident, not excitable |
| Animate with linear easing | Always use spring or ease curves |
| Use purple as a primary accent | Data viz only |
| Show competitor names in animations | Legal and brand risk |

---

*Tapid Brand Guidelines v1.0 - March 2026*
*Tapid Ventures Limited - tim@tapid.ie - tapid.ie*