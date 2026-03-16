# SaaS Scene Library — Design Doc
Date: 2026-03-13

## Overview

A library of 20 reusable Remotion scene components for SaaS/AI product demo and promo videos (ChatGPT, OpenAI, Linear-style). Scenes are props-driven and controlled by a central config layer so content can be swapped without touching component code.

## Visual Aesthetic

- **Style:** Clean minimal light — Linear/Notion/Vercel inspired
- **Background:** `#f5f5f5` (off-white), cards on `#ffffff`
- **Typography:** Inter / system-ui, sharp weight contrast
- **Accent:** `#6366f1` (indigo)
- **Shadows:** Subtle — `0 4px 24px rgba(0,0,0,0.08)`
- **Radius:** 12px cards, 20px larger surfaces

## Animation Style

Snappy & modern:
- Spring physics via Remotion's `spring()`
- Staggered reveals — each item delayed by `index * 4` frames
- Quick cuts between scenes
- No long eases or slow fades

Shared spring configs:
- `springFast` — stiffness 200, damping 20 (text/icon reveals)
- `springBounce` — stiffness 180, damping 14 (card pop-in)

## Architecture

**Approach: Flat scene library** — 20 independent scene components, each self-contained with typed props. A single `videoConfig.ts` maps content to scenes.

### File Structure

```
src/
  scenes/
    HeroScene.tsx
    LogoRevealScene.tsx
    ProblemScene.tsx
    BeforeAfterScene.tsx
    FeatureCalloutScene.tsx
    FeatureGridScene.tsx
    FeatureListScene.tsx
    BrowserMockupScene.tsx
    PhoneMockupScene.tsx
    ChatStreamScene.tsx
    PromptToOutputScene.tsx
    MetricsScene.tsx
    ChartScene.tsx
    TestimonialScene.tsx
    StepsScene.tsx
    TimelineScene.tsx
    ComparisonTableScene.tsx
    SplitCompareScene.tsx
    CTAScene.tsx
    OutroScene.tsx
  config/
    videoConfig.ts      ← all content lives here
    theme.ts            ← shared design tokens
  hooks/
    useSceneAnimation.ts
  Root.tsx              ← maps config to Compositions
```

## The 20 Scenes

### Intro

**1. HeroScene**
- Layout: Centered, full bleed
- Content: Badge (optional pill label), large headline, subheadline, CTA button
- Animation: Badge fades in → headline words spring up staggered → subheadline → CTA button bounces in
- Props: `{ headline, subheadline, ctaText?, badge? }`

**2. LogoRevealScene**
- Layout: Centered
- Content: Logo image or text mark + brand name beneath
- Animation: Logo scales from 0.8 → 1 with spring, name fades up beneath
- Props: `{ logoUrl?, brandName, tagline? }`

### Problem Statement

**3. ProblemScene**
- Layout: Left-aligned, headline top, 3 pain points below
- Content: Section label ("The old way"), headline, 3 items each with ✗ icon + text
- Animation: Headline springs in → items stagger down with ✗ icons
- Props: `{ sectionLabel?, headline, painPoints: string[] }`

**4. BeforeAfterScene**
- Layout: Two columns split by animated vertical divider
- Content: Left = "Before" card with old workflow, Right = "After" card with new
- Animation: Divider line draws from top → left panel slides from left → right panel slides from right
- Props: `{ beforeLabel, afterLabel, beforePoints: string[], afterPoints: string[] }`

### Feature Highlights

**5. FeatureCalloutScene**
- Layout: Two-column — large icon/graphic left, text right
- Content: Icon (emoji or SVG), feature title, 2–3 sentence description, optional sub-bullets
- Animation: Icon springs in left → title + body stagger in from right
- Props: `{ icon, title, description, bullets?: string[] }`

**6. FeatureGridScene**
- Layout: 2×2 or 1×3 card grid, centered
- Content: Section title above, each card has icon + title + short description
- Animation: Title in first → cards pop in with staggered springBounce
- Props: `{ title, features: { icon, title, description }[] }`

**7. FeatureListScene**
- Layout: Left-aligned list, centered on screen
- Content: Section title, 4–6 checklist items with ✓ icons
- Animation: Title in → each row slides in from left with checkmark drawing
- Props: `{ title, items: string[] }`

### UI Mockup

**8. BrowserMockupScene**
- Layout: Browser chrome frame (traffic lights, URL bar) containing a screenshot
- Content: Screenshot image, optional caption below frame
- Animation: Frame springs up from bottom → screenshot fades in inside → subtle upward float
- Props: `{ screenshotUrl, url?, caption? }`

**9. PhoneMockupScene**
- Layout: Phone frame centered or offset with supporting text
- Content: Phone frame, screenshot, optional headline beside it
- Animation: Phone springs up → subtle idle float loop → text fades in beside
- Props: `{ screenshotUrl, headline?, description? }`

### AI / Typing

**10. ChatStreamScene**
- Layout: Centered chat window (rounded container, light bg)
- Content: Alternating user/assistant message bubbles, typed in sequentially
- Animation: Each bubble slides up and fades in → assistant messages type character by character
- Props: `{ messages: { role: 'user' | 'assistant', content: string }[] }`

**11. PromptToOutputScene**
- Layout: Single centered input box → expands to output
- Content: User types prompt → thinking dots animate → output streams in
- Animation: Cursor types prompt → "..." thinking indicator → output text streams word by word
- Props: `{ prompt, output, thinkingDuration? }`

### Stats / Metrics

**12. MetricsScene**
- Layout: 3 large stat blocks side by side
- Content: Each block has a large animated number + label beneath
- Animation: All three count up simultaneously from 0 with spring easing
- Props: `{ metrics: { value, label, prefix?, suffix? }[] }`

**13. ChartScene**
- Layout: Bar chart centered, labels below bars, optional title above
- Content: 4–6 bars, each with label and value
- Animation: Bars grow from 0 height with springBounce, staggered left to right
- Props: `{ title?, bars: { label, value, color? }[] }`

### Social Proof

**14. TestimonialScene**
- Layout: Centered card, quote marks, avatar bottom-left
- Content: Large quote text, avatar image, name, role, company
- Animation: Card springs up → quote fades in → avatar + name slide in from left
- Props: `{ quote, name, role, company, avatarUrl? }`

### How It Works

**15. StepsScene**
- Layout: 3 columns with connector lines between them
- Content: Step number (circled), title, short description per step
- Animation: Step 1 springs in → connector line draws → step 2 springs in → repeat
- Props: `{ steps: { title, description }[] }`

**16. TimelineScene**
- Layout: Horizontal timeline line with nodes
- Content: Line with 3–5 milestone nodes, label + date below each
- Animation: Line draws left to right → nodes pop in sequentially → labels fade up
- Props: `{ milestones: { label, date?, description? }[] }`

### Comparison

**17. ComparisonTableScene**
- Layout: Table with feature rows, two columns (us vs them)
- Content: Feature list, ✓/✗ per column, our column highlighted
- Animation: Header in → rows tick in one by one with ✓ or ✗ appearing
- Props: `{ ourName, theirName, features: { label, ours: boolean, theirs: boolean }[] }`

**18. SplitCompareScene**
- Layout: Two equal columns with label at top of each
- Content: Each column has a title, 3–4 bullet points
- Animation: Left column slides from left → right column slides from right simultaneously
- Props: `{ leftLabel, rightLabel, leftPoints: string[], rightPoints: string[] }`

### Outro / CTA

**19. CTAScene**
- Layout: Centered, bold, minimal
- Content: Headline, subheadline, prominent button, URL below
- Animation: Headline springs in large → subheadline fades → button bounces in → URL appears
- Props: `{ headline, subheadline?, ctaText, url }`

**20. OutroScene**
- Layout: Centered logo lockup
- Content: Logo, tagline, social handles or website, subtle background
- Animation: Everything fades in together → holds → gentle fade out at end
- Props: `{ logoUrl?, brandName, tagline?, handles?: string[], website? }`

## Shared Systems

### theme.ts
```ts
export const theme = {
  colors: {
    bg: '#f5f5f5',
    surface: '#ffffff',
    text: '#0a0a0a',
    textMuted: '#6b7280',
    accent: '#6366f1',
    success: '#22c55e',
    danger: '#ef4444',
    border: '#e5e7eb',
  },
  font: {
    family: "Inter, system-ui, -apple-system, sans-serif",
    sizes: { xs: 14, sm: 18, md: 24, lg: 36, xl: 56, xxl: 80 },
    weights: { regular: 400, medium: 500, semibold: 600, bold: 700, black: 900 },
  },
  radii: { sm: 8, md: 12, lg: 20, full: 9999 },
  shadow: '0 4px 24px rgba(0,0,0,0.08)',
  spacing: 8, // base unit
}
```

### useSceneAnimation.ts
Returns `t` (0→1 interpolation), spring values, and a `stagger(index)` helper. All scenes use this for consistent timing.

### videoConfig.ts
```ts
export const scenes: SceneConfig[] = [
  { id: 'hero',    scene: 'HeroScene',    durationInSeconds: 4, props: { ... } },
  { id: 'problem', scene: 'ProblemScene', durationInSeconds: 5, props: { ... } },
  // ...
]
```

Root.tsx maps this array to `<Composition>` entries automatically.

## Success Criteria

- All 20 scenes render without errors in Remotion Studio
- Each scene accepts props and renders correctly with placeholder content
- Swapping content in `videoConfig.ts` alone changes the full video
- No scene depends on another scene's internals
- Animations feel snappy — nothing feels sluggish or over-animated
