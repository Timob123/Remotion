# SaaS Scene Library Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build 20 reusable Remotion scene components for SaaS/AI product demo videos, driven by a central config file.

**Architecture:** Flat scene library — 20 independent components each accepting typed props. A `videoConfig.ts` array maps content to scenes, and `Root.tsx` maps that config to Remotion `<Composition>` entries. Shared `theme.ts` and `useSceneAnimation.ts` keep styling and timing consistent.

**Tech Stack:** Remotion 4, React 18, TypeScript 5. No new dependencies required — all animation via Remotion's built-in `spring()`, `interpolate()`, `useCurrentFrame()`.

---

## How to verify each scene

Remotion has no unit test runner. Verification means:
1. Run `npm run dev` in `remotion-project/`
2. Open Remotion Studio at `http://localhost:3000`
3. Navigate to the composition named after the scene
4. Scrub the timeline — check animation plays correctly
5. Check props panel — confirm props update the render

---

## Task 1: Shared Infrastructure

**Files:**
- Create: `src/config/theme.ts`
- Create: `src/hooks/useSceneAnimation.ts`
- Create: `src/types.ts`

**Step 1: Create theme.ts**

```ts
// src/config/theme.ts
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
  spacing: 8,
} as const;
```

**Step 2: Create useSceneAnimation.ts**

```ts
// src/hooks/useSceneAnimation.ts
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const springFast = { mass: 1, stiffness: 200, damping: 20 };
export const springBounce = { mass: 1, stiffness: 180, damping: 14 };
export const springGentle = { mass: 1, stiffness: 120, damping: 18 };

export const useSceneAnimation = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = (delay = 0, config = springFast) =>
    spring({ frame: Math.max(0, frame - delay), fps, config });

  const staggeredSpring = (index: number, baseDelay = 0, config = springFast) =>
    spring({ frame: Math.max(0, frame - baseDelay - index * 4), fps, config });

  const fadeIn = (delay = 0, duration = 15) =>
    interpolate(frame, [delay, delay + duration], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  const slideUp = (delay = 0, config = springFast) => {
    const p = spring({ frame: Math.max(0, frame - delay), fps, config });
    return interpolate(p, [0, 1], [40, 0]);
  };

  return { frame, fps, s, staggeredSpring, fadeIn, slideUp };
};
```

**Step 3: Create types.ts**

```ts
// src/types.ts
export type SceneConfig =
  | { scene: 'HeroScene'; durationInSeconds: number; props: HeroSceneProps }
  | { scene: 'LogoRevealScene'; durationInSeconds: number; props: LogoRevealSceneProps }
  | { scene: 'ProblemScene'; durationInSeconds: number; props: ProblemSceneProps }
  | { scene: 'BeforeAfterScene'; durationInSeconds: number; props: BeforeAfterSceneProps }
  | { scene: 'FeatureCalloutScene'; durationInSeconds: number; props: FeatureCalloutSceneProps }
  | { scene: 'FeatureGridScene'; durationInSeconds: number; props: FeatureGridSceneProps }
  | { scene: 'FeatureListScene'; durationInSeconds: number; props: FeatureListSceneProps }
  | { scene: 'BrowserMockupScene'; durationInSeconds: number; props: BrowserMockupSceneProps }
  | { scene: 'PhoneMockupScene'; durationInSeconds: number; props: PhoneMockupSceneProps }
  | { scene: 'ChatStreamScene'; durationInSeconds: number; props: ChatStreamSceneProps }
  | { scene: 'PromptToOutputScene'; durationInSeconds: number; props: PromptToOutputSceneProps }
  | { scene: 'MetricsScene'; durationInSeconds: number; props: MetricsSceneProps }
  | { scene: 'ChartScene'; durationInSeconds: number; props: ChartSceneProps }
  | { scene: 'TestimonialScene'; durationInSeconds: number; props: TestimonialSceneProps }
  | { scene: 'StepsScene'; durationInSeconds: number; props: StepsSceneProps }
  | { scene: 'TimelineScene'; durationInSeconds: number; props: TimelineSceneProps }
  | { scene: 'ComparisonTableScene'; durationInSeconds: number; props: ComparisonTableSceneProps }
  | { scene: 'SplitCompareScene'; durationInSeconds: number; props: SplitCompareSceneProps }
  | { scene: 'CTAScene'; durationInSeconds: number; props: CTASceneProps }
  | { scene: 'OutroScene'; durationInSeconds: number; props: OutroSceneProps };

// ---- Per-scene prop types ----

export type HeroSceneProps = {
  headline: string;
  subheadline: string;
  ctaText?: string;
  badge?: string;
};

export type LogoRevealSceneProps = {
  brandName: string;
  tagline?: string;
  logoUrl?: string;
};

export type ProblemSceneProps = {
  sectionLabel?: string;
  headline: string;
  painPoints: string[];
};

export type BeforeAfterSceneProps = {
  beforeLabel: string;
  afterLabel: string;
  beforePoints: string[];
  afterPoints: string[];
};

export type FeatureCalloutSceneProps = {
  icon: string;
  title: string;
  description: string;
  bullets?: string[];
};

export type FeatureGridSceneProps = {
  title: string;
  features: { icon: string; title: string; description: string }[];
};

export type FeatureListSceneProps = {
  title: string;
  items: string[];
};

export type BrowserMockupSceneProps = {
  screenshotUrl: string;
  url?: string;
  caption?: string;
};

export type PhoneMockupSceneProps = {
  screenshotUrl: string;
  headline?: string;
  description?: string;
};

export type ChatStreamSceneProps = {
  messages: { role: 'user' | 'assistant'; content: string }[];
};

export type PromptToOutputSceneProps = {
  prompt: string;
  output: string;
};

export type MetricsSceneProps = {
  metrics: { value: string; label: string; prefix?: string; suffix?: string }[];
};

export type ChartSceneProps = {
  title?: string;
  bars: { label: string; value: number; color?: string }[];
};

export type TestimonialSceneProps = {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatarUrl?: string;
};

export type StepsSceneProps = {
  title?: string;
  steps: { title: string; description: string }[];
};

export type TimelineSceneProps = {
  title?: string;
  milestones: { label: string; date?: string; description?: string }[];
};

export type ComparisonTableSceneProps = {
  ourName: string;
  theirName: string;
  features: { label: string; ours: boolean; theirs: boolean }[];
};

export type SplitCompareSceneProps = {
  leftLabel: string;
  rightLabel: string;
  leftPoints: string[];
  rightPoints: string[];
};

export type CTASceneProps = {
  headline: string;
  subheadline?: string;
  ctaText: string;
  url: string;
};

export type OutroSceneProps = {
  brandName: string;
  tagline?: string;
  logoUrl?: string;
  handles?: string[];
  website?: string;
};
```

**Step 4: Commit**

```bash
git add src/config/theme.ts src/hooks/useSceneAnimation.ts src/types.ts
git commit -m "feat: add shared theme, animation hook, and scene types"
```

---

## Task 2: Config Layer + Root Wiring

**Files:**
- Create: `src/config/videoConfig.ts`
- Modify: `src/Root.tsx`

**Step 1: Create videoConfig.ts with placeholder content for all 20 scenes**

```ts
// src/config/videoConfig.ts
import { SceneConfig } from '../types';

export const FPS = 30;

export const scenes: SceneConfig[] = [
  {
    scene: 'HeroScene',
    durationInSeconds: 4,
    props: {
      badge: 'New in 2025',
      headline: 'The AI platform\nthat ships faster.',
      subheadline: 'Automate your workflows and focus on what matters.',
      ctaText: 'Get started free',
    },
  },
  {
    scene: 'LogoRevealScene',
    durationInSeconds: 3,
    props: { brandName: 'Acme AI', tagline: 'Build. Ship. Repeat.' },
  },
  {
    scene: 'ProblemScene',
    durationInSeconds: 5,
    props: {
      sectionLabel: 'The old way',
      headline: 'Your team wastes hours every week.',
      painPoints: [
        'Manually copying data between tools',
        'Waiting on slow approval chains',
        'No visibility into what\'s actually happening',
      ],
    },
  },
  {
    scene: 'BeforeAfterScene',
    durationInSeconds: 5,
    props: {
      beforeLabel: 'Before',
      afterLabel: 'After',
      beforePoints: ['Manual exports', 'Scattered spreadsheets', 'Delayed reports'],
      afterPoints: ['Automated pipelines', 'Single source of truth', 'Real-time dashboards'],
    },
  },
  {
    scene: 'FeatureCalloutScene',
    durationInSeconds: 4,
    props: {
      icon: '⚡',
      title: 'Blazing fast responses',
      description: 'Serve every request under 100ms with our edge-distributed inference network.',
      bullets: ['99.9% uptime SLA', 'Global CDN', 'Auto-scaling'],
    },
  },
  {
    scene: 'FeatureGridScene',
    durationInSeconds: 5,
    props: {
      title: 'Everything you need',
      features: [
        { icon: '🤖', title: 'AI Automation', description: 'Let AI handle the repetitive work' },
        { icon: '📊', title: 'Analytics', description: 'Deep insights on every interaction' },
        { icon: '🔗', title: 'Integrations', description: 'Connect 100+ tools in one click' },
        { icon: '🔒', title: 'Enterprise Security', description: 'SOC2 Type II certified' },
      ],
    },
  },
  {
    scene: 'FeatureListScene',
    durationInSeconds: 4,
    props: {
      title: 'Built for teams that move fast',
      items: [
        'Deploy in under 5 minutes',
        'No infrastructure to manage',
        'Unlimited API calls on Pro',
        'Priority support included',
        'SSO and SCIM provisioning',
      ],
    },
  },
  {
    scene: 'BrowserMockupScene',
    durationInSeconds: 5,
    props: {
      screenshotUrl: 'https://placehold.co/1200x750/ffffff/e5e7eb?text=Dashboard',
      url: 'app.acme.ai/dashboard',
      caption: 'Your command center for everything',
    },
  },
  {
    scene: 'PhoneMockupScene',
    durationInSeconds: 5,
    props: {
      screenshotUrl: 'https://placehold.co/390x844/ffffff/e5e7eb?text=Mobile+App',
      headline: 'Works everywhere.',
      description: 'Native apps for iOS and Android with full feature parity.',
    },
  },
  {
    scene: 'ChatStreamScene',
    durationInSeconds: 8,
    props: {
      messages: [
        { role: 'user', content: 'Summarize last week\'s sales report' },
        { role: 'assistant', content: 'Last week you closed 24 deals totalling $148,000 — up 32% from the prior week. Top performer: Sarah Chen with $42,000.' },
        { role: 'user', content: 'Which deals are at risk this quarter?' },
        { role: 'assistant', content: 'I found 3 deals at risk: Contoso ($28K), Fabrikam ($15K), and Northwind ($9K). All have had no activity in 14+ days.' },
      ],
    },
  },
  {
    scene: 'PromptToOutputScene',
    durationInSeconds: 6,
    props: {
      prompt: 'Write a follow-up email to the Contoso deal',
      output: 'Hi James, just following up on our conversation last week. I wanted to share how three similar companies in your space have seen a 40% reduction in manual work within 60 days...',
    },
  },
  {
    scene: 'MetricsScene',
    durationInSeconds: 4,
    props: {
      metrics: [
        { value: '10', suffix: 'x', label: 'Faster than manual' },
        { value: '99.9', suffix: '%', label: 'Uptime SLA' },
        { prefix: '<', value: '2', suffix: 'min', label: 'Time to deploy' },
      ],
    },
  },
  {
    scene: 'ChartScene',
    durationInSeconds: 5,
    props: {
      title: 'Revenue growth after adoption',
      bars: [
        { label: 'Q1', value: 40 },
        { label: 'Q2', value: 65 },
        { label: 'Q3', value: 90 },
        { label: 'Q4', value: 100, color: '#6366f1' },
      ],
    },
  },
  {
    scene: 'TestimonialScene',
    durationInSeconds: 5,
    props: {
      quote: 'We cut our reporting time from 3 hours to 10 minutes. I wish we\'d found this tool two years ago.',
      name: 'Sarah Chen',
      role: 'Head of Operations',
      company: 'Contoso',
    },
  },
  {
    scene: 'StepsScene',
    durationInSeconds: 5,
    props: {
      title: 'Up and running in 3 steps',
      steps: [
        { title: 'Connect', description: 'Link your existing tools in one click' },
        { title: 'Configure', description: 'Set your workflows with plain language' },
        { title: 'Ship', description: 'Go live instantly, no engineering required' },
      ],
    },
  },
  {
    scene: 'TimelineScene',
    durationInSeconds: 5,
    props: {
      title: 'Your path to launch',
      milestones: [
        { label: 'Sign up', date: 'Day 1', description: 'Free trial, no credit card' },
        { label: 'Integrate', date: 'Day 2', description: 'Connect your tools' },
        { label: 'Go live', date: 'Day 5', description: 'First automation running' },
        { label: 'Scale', date: 'Day 30', description: 'Full team onboarded' },
      ],
    },
  },
  {
    scene: 'ComparisonTableScene',
    durationInSeconds: 5,
    props: {
      ourName: 'Acme AI',
      theirName: 'The Others',
      features: [
        { label: 'AI-native workflows', ours: true, theirs: false },
        { label: 'Real-time sync', ours: true, theirs: false },
        { label: 'No-code setup', ours: true, theirs: true },
        { label: 'SOC2 certified', ours: true, theirs: true },
        { label: 'Unlimited API calls', ours: true, theirs: false },
        { label: '24/7 support', ours: true, theirs: false },
      ],
    },
  },
  {
    scene: 'SplitCompareScene',
    durationInSeconds: 4,
    props: {
      leftLabel: 'Without Acme',
      rightLabel: 'With Acme',
      leftPoints: ['Hours of manual work', 'Siloed data', 'Slow decisions', 'Burnt-out team'],
      rightPoints: ['Fully automated', 'Single source of truth', 'Instant insights', 'Team focused on growth'],
    },
  },
  {
    scene: 'CTAScene',
    durationInSeconds: 4,
    props: {
      headline: 'Start shipping faster today.',
      subheadline: 'Free 14-day trial. No credit card required.',
      ctaText: 'Get started free →',
      url: 'acme.ai',
    },
  },
  {
    scene: 'OutroScene',
    durationInSeconds: 4,
    props: {
      brandName: 'Acme AI',
      tagline: 'Build. Ship. Repeat.',
      website: 'acme.ai',
      handles: ['@acmeai'],
    },
  },
];
```

**Step 2: Update Root.tsx to map scenes config to Compositions**

Replace the contents of `src/Root.tsx` with:

```tsx
// src/Root.tsx
import { Composition } from 'remotion';
import { scenes, FPS } from './config/videoConfig';
import { HeroScene } from './scenes/HeroScene';
import { LogoRevealScene } from './scenes/LogoRevealScene';
import { ProblemScene } from './scenes/ProblemScene';
import { BeforeAfterScene } from './scenes/BeforeAfterScene';
import { FeatureCalloutScene } from './scenes/FeatureCalloutScene';
import { FeatureGridScene } from './scenes/FeatureGridScene';
import { FeatureListScene } from './scenes/FeatureListScene';
import { BrowserMockupScene } from './scenes/BrowserMockupScene';
import { PhoneMockupScene } from './scenes/PhoneMockupScene';
import { ChatStreamScene } from './scenes/ChatStreamScene';
import { PromptToOutputScene } from './scenes/PromptToOutputScene';
import { MetricsScene } from './scenes/MetricsScene';
import { ChartScene } from './scenes/ChartScene';
import { TestimonialScene } from './scenes/TestimonialScene';
import { StepsScene } from './scenes/StepsScene';
import { TimelineScene } from './scenes/TimelineScene';
import { ComparisonTableScene } from './scenes/ComparisonTableScene';
import { SplitCompareScene } from './scenes/SplitCompareScene';
import { CTAScene } from './scenes/CTAScene';
import { OutroScene } from './scenes/OutroScene';

const SCENE_MAP: Record<string, React.ComponentType<any>> = {
  HeroScene,
  LogoRevealScene,
  ProblemScene,
  BeforeAfterScene,
  FeatureCalloutScene,
  FeatureGridScene,
  FeatureListScene,
  BrowserMockupScene,
  PhoneMockupScene,
  ChatStreamScene,
  PromptToOutputScene,
  MetricsScene,
  ChartScene,
  TestimonialScene,
  StepsScene,
  TimelineScene,
  ComparisonTableScene,
  SplitCompareScene,
  CTAScene,
  OutroScene,
};

export const RemotionRoot = () => {
  return (
    <>
      {scenes.map((config, i) => {
        const Component = SCENE_MAP[config.scene];
        return (
          <Composition
            key={`${config.scene}-${i}`}
            id={config.scene}
            component={Component}
            durationInFrames={config.durationInSeconds * FPS}
            fps={FPS}
            width={1920}
            height={1080}
            defaultProps={config.props}
          />
        );
      })}
    </>
  );
};
```

**Step 3: Verify it compiles (scenes don't exist yet — expect import errors, that's OK)**

```bash
cd remotion-project && npm run dev
```
Expected: TypeScript import errors for missing scene files. This is fine — we'll add them next.

**Step 4: Commit**

```bash
git add src/config/videoConfig.ts src/Root.tsx
git commit -m "feat: add config layer and Root wiring for 20 scenes"
```

---

## Task 3: Intro Scenes (HeroScene, LogoRevealScene)

**Files:**
- Create: `src/scenes/HeroScene.tsx`
- Create: `src/scenes/LogoRevealScene.tsx`

**Step 1: Create HeroScene.tsx**

```tsx
// src/scenes/HeroScene.tsx
import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation, springBounce } from '../hooks/useSceneAnimation';
import { HeroSceneProps } from '../types';

export const HeroScene: React.FC<HeroSceneProps> = ({ headline, subheadline, ctaText, badge }) => {
  const { s, staggeredSpring, fadeIn } = useSceneAnimation();

  const badgeOpacity = fadeIn(0, 10);
  const headlineY = interpolate(staggeredSpring(0, 8), [0, 1], [50, 0]);
  const headlineOpacity = staggeredSpring(0, 8);
  const subY = interpolate(staggeredSpring(1, 8), [0, 1], [30, 0]);
  const subOpacity = staggeredSpring(1, 8);
  const ctaScale = s(24, springBounce);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center', fontFamily: theme.font.family }}>
      <div style={{ textAlign: 'center', maxWidth: 900, padding: '0 60px' }}>
        {badge && (
          <div style={{
            display: 'inline-block',
            opacity: badgeOpacity,
            background: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radii.full,
            padding: '6px 18px',
            fontSize: theme.font.sizes.xs,
            fontWeight: theme.font.weights.medium,
            color: theme.colors.accent,
            marginBottom: 28,
            boxShadow: theme.shadow,
          }}>
            {badge}
          </div>
        )}
        <div style={{
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
          fontSize: theme.font.sizes.xxl,
          fontWeight: theme.font.weights.black,
          color: theme.colors.text,
          lineHeight: 1.05,
          letterSpacing: '-2px',
          marginBottom: 24,
          whiteSpace: 'pre-line',
        }}>
          {headline}
        </div>
        <div style={{
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
          fontSize: theme.font.sizes.md,
          color: theme.colors.textMuted,
          fontWeight: theme.font.weights.regular,
          lineHeight: 1.6,
          marginBottom: 40,
        }}>
          {subheadline}
        </div>
        {ctaText && (
          <div style={{
            display: 'inline-block',
            transform: `scale(${ctaScale})`,
            background: theme.colors.text,
            color: '#fff',
            padding: '16px 36px',
            borderRadius: theme.radii.full,
            fontSize: theme.font.sizes.sm,
            fontWeight: theme.font.weights.semibold,
            letterSpacing: '-0.3px',
          }}>
            {ctaText}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
```

**Step 2: Create LogoRevealScene.tsx**

```tsx
// src/scenes/LogoRevealScene.tsx
import React from 'react';
import { AbsoluteFill, Img, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation, springBounce } from '../hooks/useSceneAnimation';
import { LogoRevealSceneProps } from '../types';

export const LogoRevealScene: React.FC<LogoRevealSceneProps> = ({ brandName, tagline, logoUrl }) => {
  const { s, fadeIn } = useSceneAnimation();

  const logoScale = interpolate(s(0, springBounce), [0, 1], [0.7, 1]);
  const logoOpacity = s(0);
  const nameOpacity = fadeIn(12, 12);
  const nameY = interpolate(s(12), [0, 1], [20, 0]);
  const taglineOpacity = fadeIn(22, 12);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center', fontFamily: theme.font.family }}>
      <div style={{ textAlign: 'center' }}>
        {logoUrl ? (
          <Img src={logoUrl} style={{ width: 120, height: 120, opacity: logoOpacity, transform: `scale(${logoScale})`, marginBottom: 24 }} />
        ) : (
          <div style={{
            width: 100, height: 100,
            background: theme.colors.text,
            borderRadius: theme.radii.lg,
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            margin: '0 auto 24px',
          }} />
        )}
        <div style={{
          opacity: nameOpacity,
          transform: `translateY(${nameY}px)`,
          fontSize: theme.font.sizes.xl,
          fontWeight: theme.font.weights.black,
          color: theme.colors.text,
          letterSpacing: '-1.5px',
        }}>
          {brandName}
        </div>
        {tagline && (
          <div style={{
            opacity: taglineOpacity,
            fontSize: theme.font.sizes.sm,
            color: theme.colors.textMuted,
            marginTop: 12,
            fontWeight: theme.font.weights.medium,
          }}>
            {tagline}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
```

**Step 3: Verify in Remotion Studio**

Open `http://localhost:3000`, navigate to `HeroScene` and `LogoRevealScene`. Scrub timeline. Check text springs in correctly.

**Step 4: Commit**

```bash
git add src/scenes/HeroScene.tsx src/scenes/LogoRevealScene.tsx
git commit -m "feat: add HeroScene and LogoRevealScene"
```

---

## Task 4: Problem Scenes (ProblemScene, BeforeAfterScene)

**Files:**
- Create: `src/scenes/ProblemScene.tsx`
- Create: `src/scenes/BeforeAfterScene.tsx`

**Step 1: Create ProblemScene.tsx**

```tsx
// src/scenes/ProblemScene.tsx
import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation } from '../hooks/useSceneAnimation';
import { ProblemSceneProps } from '../types';

export const ProblemScene: React.FC<ProblemSceneProps> = ({ sectionLabel, headline, painPoints }) => {
  const { staggeredSpring, fadeIn } = useSceneAnimation();

  const labelOpacity = fadeIn(0, 10);
  const headlineY = interpolate(staggeredSpring(0, 8), [0, 1], [30, 0]);
  const headlineOpacity = staggeredSpring(0, 8);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center', fontFamily: theme.font.family }}>
      <div style={{ maxWidth: 800, width: '100%', padding: '0 80px' }}>
        {sectionLabel && (
          <div style={{
            opacity: labelOpacity,
            fontSize: theme.font.sizes.xs,
            fontWeight: theme.font.weights.semibold,
            color: theme.colors.danger,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: 20,
          }}>
            {sectionLabel}
          </div>
        )}
        <div style={{
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
          fontSize: theme.font.sizes.xl,
          fontWeight: theme.font.weights.bold,
          color: theme.colors.text,
          lineHeight: 1.15,
          letterSpacing: '-1px',
          marginBottom: 48,
        }}>
          {headline}
        </div>
        {painPoints.map((point, i) => {
          const itemOpacity = staggeredSpring(i, 20);
          const itemY = interpolate(staggeredSpring(i, 20), [0, 1], [20, 0]);
          return (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              opacity: itemOpacity,
              transform: `translateY(${itemY}px)`,
              marginBottom: 20,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: '#fef2f2', border: `1.5px solid ${theme.colors.danger}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, color: theme.colors.danger, flexShrink: 0,
                fontWeight: theme.font.weights.bold,
              }}>
                ✕
              </div>
              <div style={{ fontSize: theme.font.sizes.md, color: theme.colors.text, fontWeight: theme.font.weights.medium }}>
                {point}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
```

**Step 2: Create BeforeAfterScene.tsx**

```tsx
// src/scenes/BeforeAfterScene.tsx
import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation } from '../hooks/useSceneAnimation';
import { BeforeAfterSceneProps } from '../types';

export const BeforeAfterScene: React.FC<BeforeAfterSceneProps> = ({ beforeLabel, afterLabel, beforePoints, afterPoints }) => {
  const { s, staggeredSpring, fadeIn } = useSceneAnimation();

  const dividerScale = s(0);
  const leftX = interpolate(s(6), [0, 1], [-60, 0]);
  const rightX = interpolate(s(6), [0, 1], [60, 0]);
  const panelOpacity = s(6);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, fontFamily: theme.font.family, flexDirection: 'row' }}>
      {/* Left panel - Before */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 60px 80px 100px', opacity: panelOpacity, transform: `translateX(${leftX}px)` }}>
        <div style={{ fontSize: theme.font.sizes.xs, fontWeight: theme.font.weights.semibold, color: theme.colors.danger, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 20 }}>
          {beforeLabel}
        </div>
        {beforePoints.map((point, i) => {
          const o = staggeredSpring(i, 12);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: o, marginBottom: 16 }}>
              <span style={{ color: theme.colors.danger, fontSize: 18, fontWeight: theme.font.weights.bold }}>✕</span>
              <span style={{ fontSize: theme.font.sizes.sm, color: theme.colors.text }}>{point}</span>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div style={{ width: 2, background: theme.colors.border, transform: `scaleY(${dividerScale})`, transformOrigin: 'top', alignSelf: 'stretch', margin: '60px 0' }} />

      {/* Right panel - After */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 100px 80px 60px', opacity: panelOpacity, transform: `translateX(${rightX}px)` }}>
        <div style={{ fontSize: theme.font.sizes.xs, fontWeight: theme.font.weights.semibold, color: theme.colors.success, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 20 }}>
          {afterLabel}
        </div>
        {afterPoints.map((point, i) => {
          const o = staggeredSpring(i, 12);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: o, marginBottom: 16 }}>
              <span style={{ color: theme.colors.success, fontSize: 18, fontWeight: theme.font.weights.bold }}>✓</span>
              <span style={{ fontSize: theme.font.sizes.sm, color: theme.colors.text, fontWeight: theme.font.weights.medium }}>{point}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
```

**Step 3: Commit**

```bash
git add src/scenes/ProblemScene.tsx src/scenes/BeforeAfterScene.tsx
git commit -m "feat: add ProblemScene and BeforeAfterScene"
```

---

## Task 5: Feature Scenes (FeatureCalloutScene, FeatureGridScene, FeatureListScene)

**Files:**
- Create: `src/scenes/FeatureCalloutScene.tsx`
- Create: `src/scenes/FeatureGridScene.tsx`
- Create: `src/scenes/FeatureListScene.tsx`

**Step 1: Create FeatureCalloutScene.tsx**

```tsx
// src/scenes/FeatureCalloutScene.tsx
import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation, springBounce } from '../hooks/useSceneAnimation';
import { FeatureCalloutSceneProps } from '../types';

export const FeatureCalloutScene: React.FC<FeatureCalloutSceneProps> = ({ icon, title, description, bullets }) => {
  const { s, staggeredSpring } = useSceneAnimation();

  const iconScale = interpolate(s(0, springBounce), [0, 1], [0.5, 1]);
  const iconOpacity = s(0);
  const titleY = interpolate(s(10), [0, 1], [30, 0]);
  const titleOpacity = s(10);
  const descOpacity = s(18);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center', fontFamily: theme.font.family }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 80, maxWidth: 1200, padding: '0 100px', width: '100%' }}>
        {/* Icon */}
        <div style={{
          fontSize: 120,
          opacity: iconOpacity,
          transform: `scale(${iconScale})`,
          flexShrink: 0,
          lineHeight: 1,
        }}>
          {icon}
        </div>
        {/* Text */}
        <div style={{ flex: 1 }}>
          <div style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontSize: theme.font.sizes.xl,
            fontWeight: theme.font.weights.bold,
            color: theme.colors.text,
            letterSpacing: '-1px',
            marginBottom: 20,
          }}>
            {title}
          </div>
          <div style={{ opacity: descOpacity, fontSize: theme.font.sizes.md, color: theme.colors.textMuted, lineHeight: 1.6, marginBottom: bullets ? 28 : 0 }}>
            {description}
          </div>
          {bullets && bullets.map((b, i) => {
            const o = staggeredSpring(i, 24);
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: o, marginBottom: 12 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: theme.colors.accent, flexShrink: 0 }} />
                <span style={{ fontSize: theme.font.sizes.sm, color: theme.colors.text, fontWeight: theme.font.weights.medium }}>{b}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

**Step 2: Create FeatureGridScene.tsx**

```tsx
// src/scenes/FeatureGridScene.tsx
import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation, springBounce } from '../hooks/useSceneAnimation';
import { FeatureGridSceneProps } from '../types';

export const FeatureGridScene: React.FC<FeatureGridSceneProps> = ({ title, features }) => {
  const { s, staggeredSpring } = useSceneAnimation();

  const titleOpacity = s(0);
  const titleY = interpolate(s(0), [0, 1], [20, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center', fontFamily: theme.font.family }}>
      <div style={{ maxWidth: 1100, width: '100%', padding: '0 80px' }}>
        <div style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)`, fontSize: theme.font.sizes.lg, fontWeight: theme.font.weights.bold, color: theme.colors.text, letterSpacing: '-0.5px', marginBottom: 48, textAlign: 'center' }}>
          {title}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(features.length, 2)}, 1fr)`, gap: 24 }}>
          {features.map((f, i) => {
            const cardScale = interpolate(staggeredSpring(i, 12, springBounce), [0, 1], [0.9, 1]);
            const cardOpacity = staggeredSpring(i, 12);
            return (
              <div key={i} style={{
                background: theme.colors.surface,
                borderRadius: theme.radii.md,
                padding: '32px',
                boxShadow: theme.shadow,
                border: `1px solid ${theme.colors.border}`,
                opacity: cardOpacity,
                transform: `scale(${cardScale})`,
              }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{f.icon}</div>
                <div style={{ fontSize: theme.font.sizes.sm, fontWeight: theme.font.weights.semibold, color: theme.colors.text, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: theme.font.sizes.xs, color: theme.colors.textMuted, lineHeight: 1.5 }}>{f.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

**Step 3: Create FeatureListScene.tsx**

```tsx
// src/scenes/FeatureListScene.tsx
import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation } from '../hooks/useSceneAnimation';
import { FeatureListSceneProps } from '../types';

export const FeatureListScene: React.FC<FeatureListSceneProps> = ({ title, items }) => {
  const { s, staggeredSpring } = useSceneAnimation();

  const titleOpacity = s(0);
  const titleY = interpolate(s(0), [0, 1], [20, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center', fontFamily: theme.font.family }}>
      <div style={{ maxWidth: 700, width: '100%', padding: '0 80px' }}>
        <div style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)`, fontSize: theme.font.sizes.lg, fontWeight: theme.font.weights.bold, color: theme.colors.text, letterSpacing: '-0.5px', marginBottom: 40 }}>
          {title}
        </div>
        {items.map((item, i) => {
          const itemOpacity = staggeredSpring(i, 12);
          const itemX = interpolate(staggeredSpring(i, 12), [0, 1], [-30, 0]);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: itemOpacity, transform: `translateX(${itemX}px)`, marginBottom: 20 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: '#f0fdf4', border: `1.5px solid ${theme.colors.success}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, color: theme.colors.success, flexShrink: 0,
                fontWeight: theme.font.weights.bold,
              }}>
                ✓
              </div>
              <div style={{ fontSize: theme.font.sizes.md, color: theme.colors.text, fontWeight: theme.font.weights.medium }}>
                {item}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
```

**Step 4: Commit**

```bash
git add src/scenes/FeatureCalloutScene.tsx src/scenes/FeatureGridScene.tsx src/scenes/FeatureListScene.tsx
git commit -m "feat: add FeatureCalloutScene, FeatureGridScene, FeatureListScene"
```

---

## Task 6: UI Mockup Scenes (BrowserMockupScene, PhoneMockupScene)

**Files:**
- Create: `src/scenes/BrowserMockupScene.tsx`
- Create: `src/scenes/PhoneMockupScene.tsx`

**Step 1: Create BrowserMockupScene.tsx**

```tsx
// src/scenes/BrowserMockupScene.tsx
import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation } from '../hooks/useSceneAnimation';
import { BrowserMockupSceneProps } from '../types';

export const BrowserMockupScene: React.FC<BrowserMockupSceneProps> = ({ screenshotUrl, url, caption }) => {
  const { s, fadeIn } = useSceneAnimation();
  const frame = useCurrentFrame();

  const frameY = interpolate(s(0), [0, 1], [80, 0]);
  const frameOpacity = s(0);
  const float = Math.sin(frame / 40) * 4;
  const captionOpacity = fadeIn(20, 10);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center', fontFamily: theme.font.family, flexDirection: 'column' }}>
      <div style={{ opacity: frameOpacity, transform: `translateY(${frameY + float}px)`, width: 1100, boxShadow: '0 32px 80px rgba(0,0,0,0.14)', borderRadius: theme.radii.lg, overflow: 'hidden', border: `1px solid ${theme.colors.border}` }}>
        {/* Browser chrome */}
        <div style={{ background: '#f0f0f0', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: `1px solid ${theme.colors.border}` }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
          {url && (
            <div style={{ flex: 1, marginLeft: 12, background: theme.colors.surface, borderRadius: 6, padding: '4px 12px', fontSize: 12, color: theme.colors.textMuted, fontFamily: theme.font.family }}>
              {url}
            </div>
          )}
        </div>
        {/* Screenshot */}
        <Img src={screenshotUrl} style={{ width: '100%', display: 'block' }} />
      </div>
      {caption && (
        <div style={{ opacity: captionOpacity, marginTop: 28, fontSize: theme.font.sizes.sm, color: theme.colors.textMuted, fontFamily: theme.font.family }}>
          {caption}
        </div>
      )}
    </AbsoluteFill>
  );
};
```

**Step 2: Create PhoneMockupScene.tsx**

```tsx
// src/scenes/PhoneMockupScene.tsx
import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation } from '../hooks/useSceneAnimation';
import { PhoneMockupSceneProps } from '../types';

export const PhoneMockupScene: React.FC<PhoneMockupSceneProps> = ({ screenshotUrl, headline, description }) => {
  const { s, fadeIn } = useSceneAnimation();
  const frame = useCurrentFrame();

  const phoneY = interpolate(s(0), [0, 1], [80, 0]);
  const phoneOpacity = s(0);
  const float = Math.sin(frame / 40) * 5;
  const textOpacity = fadeIn(18, 12);
  const textX = interpolate(fadeIn(18, 12), [0, 1], [20, 0]);

  const hasText = headline || description;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center', fontFamily: theme.font.family, flexDirection: 'row', gap: 80 }}>
      {/* Phone */}
      <div style={{ opacity: phoneOpacity, transform: `translateY(${phoneY + float}px)`, width: 300, height: 620, background: theme.colors.surface, borderRadius: 44, border: `8px solid ${theme.colors.text}`, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.18)', flexShrink: 0, position: 'relative' }}>
        {/* Notch */}
        <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 80, height: 24, background: theme.colors.text, borderRadius: 12, zIndex: 2 }} />
        <Img src={screenshotUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      {/* Text */}
      {hasText && (
        <div style={{ opacity: textOpacity, transform: `translateX(${textX}px)`, maxWidth: 400 }}>
          {headline && (
            <div style={{ fontSize: theme.font.sizes.xl, fontWeight: theme.font.weights.bold, color: theme.colors.text, letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 16 }}>
              {headline}
            </div>
          )}
          {description && (
            <div style={{ fontSize: theme.font.sizes.sm, color: theme.colors.textMuted, lineHeight: 1.6 }}>
              {description}
            </div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};
```

**Step 3: Commit**

```bash
git add src/scenes/BrowserMockupScene.tsx src/scenes/PhoneMockupScene.tsx
git commit -m "feat: add BrowserMockupScene and PhoneMockupScene"
```

---

## Task 7: AI / Typing Scenes (ChatStreamScene, PromptToOutputScene)

**Files:**
- Create: `src/scenes/ChatStreamScene.tsx`
- Create: `src/scenes/PromptToOutputScene.tsx`

**Step 1: Create ChatStreamScene.tsx**

```tsx
// src/scenes/ChatStreamScene.tsx
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { ChatStreamSceneProps } from '../types';

const CHARS_PER_FRAME = 1.5;
const MESSAGE_GAP_FRAMES = 20;

export const ChatStreamScene: React.FC<ChatStreamSceneProps> = ({ messages }) => {
  const frame = useCurrentFrame();

  // Calculate which characters are visible per message
  let frameAccum = 10;
  const visibleMessages = messages.map((msg) => {
    const startFrame = frameAccum;
    const charsToShow = Math.floor(Math.max(0, frame - startFrame) * CHARS_PER_FRAME);
    const visible = charsToShow > 0;
    const text = msg.content.slice(0, charsToShow);
    frameAccum += Math.ceil(msg.content.length / CHARS_PER_FRAME) + MESSAGE_GAP_FRAMES;
    return { ...msg, text, visible, startFrame };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center', fontFamily: theme.font.family }}>
      <div style={{ width: 800, background: theme.colors.surface, borderRadius: theme.radii.lg, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadow, padding: '32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 20, borderBottom: `1px solid ${theme.colors.border}` }}>
          <div style={{ width: 32, height: 32, background: theme.colors.text, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🤖</div>
          <span style={{ fontWeight: theme.font.weights.semibold, fontSize: theme.font.sizes.sm, color: theme.colors.text }}>AI Assistant</span>
        </div>
        {/* Messages */}
        {visibleMessages.map((msg, i) =>
          msg.visible ? (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '75%',
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.role === 'user' ? theme.colors.text : '#f3f4f6',
                color: msg.role === 'user' ? '#fff' : theme.colors.text,
                fontSize: theme.font.sizes.xs,
                lineHeight: 1.6,
                fontWeight: theme.font.weights.regular,
              }}>
                {msg.text}
                {msg.text.length < msg.content.length && (
                  <span style={{ opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0 }}>▌</span>
                )}
              </div>
            </div>
          ) : null
        )}
      </div>
    </AbsoluteFill>
  );
};
```

**Step 2: Create PromptToOutputScene.tsx**

```tsx
// src/scenes/PromptToOutputScene.tsx
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { PromptToOutputSceneProps } from '../types';

const PROMPT_START = 10;
const CHARS_PER_FRAME = 2;

export const PromptToOutputScene: React.FC<PromptToOutputSceneProps> = ({ prompt, output }) => {
  const frame = useCurrentFrame();

  const promptEnd = PROMPT_START + Math.ceil(prompt.length / CHARS_PER_FRAME);
  const thinkingStart = promptEnd + 5;
  const thinkingEnd = thinkingStart + 25;
  const outputStart = thinkingEnd + 5;

  const promptChars = Math.floor(Math.max(0, frame - PROMPT_START) * CHARS_PER_FRAME);
  const visiblePrompt = prompt.slice(0, promptChars);

  const showThinking = frame >= thinkingStart && frame < thinkingEnd;
  const thinkingDot = Math.floor((frame - thinkingStart) / 8) % 4;

  const outputChars = Math.floor(Math.max(0, frame - outputStart) * CHARS_PER_FRAME);
  const visibleOutput = output.slice(0, outputChars);

  const containerOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center', fontFamily: theme.font.family }}>
      <div style={{ width: 900, opacity: containerOpacity }}>
        {/* Prompt input */}
        <div style={{ background: theme.colors.surface, border: `1.5px solid ${frame >= promptEnd ? theme.colors.accent : theme.colors.border}`, borderRadius: theme.radii.md, padding: '20px 24px', marginBottom: 20, boxShadow: theme.shadow }}>
          <div style={{ fontSize: theme.font.sizes.xs, color: theme.colors.textMuted, marginBottom: 8, fontWeight: theme.font.weights.medium }}>Your prompt</div>
          <div style={{ fontSize: theme.font.sizes.sm, color: theme.colors.text, lineHeight: 1.6 }}>
            {visiblePrompt}
            {promptChars < prompt.length && <span style={{ opacity: Math.sin(frame * 0.4) > 0 ? 1 : 0 }}>|</span>}
          </div>
        </div>

        {/* Thinking indicator */}
        {showThinking && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px', marginBottom: 20 }}>
            {[0, 1, 2].map(d => (
              <div key={d} style={{ width: 8, height: 8, borderRadius: '50%', background: theme.colors.accent, opacity: thinkingDot === d ? 1 : 0.3, transition: 'opacity 0.1s' }} />
            ))}
            <span style={{ fontSize: theme.font.sizes.xs, color: theme.colors.textMuted }}>Generating...</span>
          </div>
        )}

        {/* Output */}
        {frame >= outputStart && (
          <div style={{ background: '#f8f7ff', border: `1.5px solid ${theme.colors.accent}`, borderRadius: theme.radii.md, padding: '20px 24px', boxShadow: theme.shadow }}>
            <div style={{ fontSize: theme.font.sizes.xs, color: theme.colors.accent, marginBottom: 8, fontWeight: theme.font.weights.semibold }}>AI Output</div>
            <div style={{ fontSize: theme.font.sizes.sm, color: theme.colors.text, lineHeight: 1.6 }}>
              {visibleOutput}
              {outputChars < output.length && <span style={{ opacity: Math.sin(frame * 0.4) > 0 ? 1 : 0 }}>▌</span>}
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
```

**Step 3: Commit**

```bash
git add src/scenes/ChatStreamScene.tsx src/scenes/PromptToOutputScene.tsx
git commit -m "feat: add ChatStreamScene and PromptToOutputScene"
```

---

## Task 8: Stats Scenes (MetricsScene, ChartScene)

**Files:**
- Create: `src/scenes/MetricsScene.tsx`
- Create: `src/scenes/ChartScene.tsx`

**Step 1: Create MetricsScene.tsx**

```tsx
// src/scenes/MetricsScene.tsx
import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation } from '../hooks/useSceneAnimation';
import { MetricsSceneProps } from '../types';

export const MetricsScene: React.FC<MetricsSceneProps> = ({ metrics }) => {
  const { s, staggeredSpring, fadeIn } = useSceneAnimation();

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center', fontFamily: theme.font.family }}>
      <div style={{ display: 'flex', gap: 60, alignItems: 'center', justifyContent: 'center' }}>
        {metrics.map((m, i) => {
          const spring = staggeredSpring(i, 8);
          const y = interpolate(spring, [0, 1], [50, 0]);
          const opacity = spring;
          return (
            <div key={i} style={{ textAlign: 'center', opacity, transform: `translateY(${y}px)` }}>
              <div style={{ fontSize: theme.font.sizes.xxl, fontWeight: theme.font.weights.black, color: theme.colors.text, lineHeight: 1, letterSpacing: '-3px' }}>
                {m.prefix && <span style={{ fontSize: theme.font.sizes.xl, color: theme.colors.textMuted }}>{m.prefix}</span>}
                {m.value}
                {m.suffix && <span style={{ fontSize: theme.font.sizes.xl, color: theme.colors.accent }}>{m.suffix}</span>}
              </div>
              <div style={{ fontSize: theme.font.sizes.sm, color: theme.colors.textMuted, marginTop: 12, fontWeight: theme.font.weights.medium }}>
                {m.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
```

**Step 2: Create ChartScene.tsx**

```tsx
// src/scenes/ChartScene.tsx
import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation, springBounce } from '../hooks/useSceneAnimation';
import { ChartSceneProps } from '../types';

export const ChartScene: React.FC<ChartSceneProps> = ({ title, bars }) => {
  const { s, staggeredSpring } = useSceneAnimation();

  const maxValue = Math.max(...bars.map(b => b.value));
  const titleOpacity = s(0);
  const CHART_HEIGHT = 320;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center', fontFamily: theme.font.family, flexDirection: 'column', gap: 40 }}>
      {title && (
        <div style={{ opacity: titleOpacity, fontSize: theme.font.sizes.lg, fontWeight: theme.font.weights.bold, color: theme.colors.text, letterSpacing: '-0.5px' }}>
          {title}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28, height: CHART_HEIGHT }}>
        {bars.map((bar, i) => {
          const spring = staggeredSpring(i, 8, springBounce);
          const barHeight = interpolate(spring, [0, 1], [0, (bar.value / maxValue) * CHART_HEIGHT]);
          const opacity = spring;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: theme.font.sizes.xs, fontWeight: theme.font.weights.semibold, color: bar.color || theme.colors.accent, opacity }}>
                {bar.value}%
              </div>
              <div style={{
                width: 80,
                height: barHeight,
                background: bar.color || theme.colors.accent,
                borderRadius: `${theme.radii.sm}px ${theme.radii.sm}px 0 0`,
                opacity,
              }} />
              <div style={{ fontSize: theme.font.sizes.xs, color: theme.colors.textMuted, fontWeight: theme.font.weights.medium }}>
                {bar.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
```

**Step 3: Commit**

```bash
git add src/scenes/MetricsScene.tsx src/scenes/ChartScene.tsx
git commit -m "feat: add MetricsScene and ChartScene"
```

---

## Task 9: Social Proof + How It Works (TestimonialScene, StepsScene, TimelineScene)

**Files:**
- Create: `src/scenes/TestimonialScene.tsx`
- Create: `src/scenes/StepsScene.tsx`
- Create: `src/scenes/TimelineScene.tsx`

**Step 1: Create TestimonialScene.tsx**

```tsx
// src/scenes/TestimonialScene.tsx
import React from 'react';
import { AbsoluteFill, Img, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation } from '../hooks/useSceneAnimation';
import { TestimonialSceneProps } from '../types';

export const TestimonialScene: React.FC<TestimonialSceneProps> = ({ quote, name, role, company, avatarUrl }) => {
  const { s, fadeIn } = useSceneAnimation();

  const cardScale = interpolate(s(0), [0, 1], [0.95, 1]);
  const cardOpacity = s(0);
  const quoteOpacity = fadeIn(12, 14);
  const avatarX = interpolate(fadeIn(24, 12), [0, 1], [-20, 0]);
  const avatarOpacity = fadeIn(24, 12);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center', fontFamily: theme.font.family }}>
      <div style={{ maxWidth: 780, background: theme.colors.surface, borderRadius: theme.radii.lg, padding: '60px', boxShadow: '0 8px 48px rgba(0,0,0,0.10)', border: `1px solid ${theme.colors.border}`, opacity: cardOpacity, transform: `scale(${cardScale})` }}>
        {/* Quote mark */}
        <div style={{ fontSize: 80, color: theme.colors.accent, lineHeight: 1, marginBottom: 24, fontFamily: 'Georgia, serif', opacity: 0.3 }}>"</div>
        {/* Quote text */}
        <div style={{ opacity: quoteOpacity, fontSize: theme.font.sizes.md, color: theme.colors.text, lineHeight: 1.6, fontWeight: theme.font.weights.medium, marginBottom: 40, letterSpacing: '-0.2px' }}>
          {quote}
        </div>
        {/* Author */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: avatarOpacity, transform: `translateX(${avatarX}px)` }}>
          {avatarUrl ? (
            <Img src={avatarUrl} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: theme.colors.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fff', fontWeight: theme.font.weights.bold }}>
              {name[0]}
            </div>
          )}
          <div>
            <div style={{ fontSize: theme.font.sizes.sm, fontWeight: theme.font.weights.semibold, color: theme.colors.text }}>{name}</div>
            <div style={{ fontSize: theme.font.sizes.xs, color: theme.colors.textMuted }}>{role}, {company}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

**Step 2: Create StepsScene.tsx**

```tsx
// src/scenes/StepsScene.tsx
import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation, springBounce } from '../hooks/useSceneAnimation';
import { StepsSceneProps } from '../types';

export const StepsScene: React.FC<StepsSceneProps> = ({ title, steps }) => {
  const { s, staggeredSpring } = useSceneAnimation();

  const titleOpacity = s(0);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center', fontFamily: theme.font.family, flexDirection: 'column', gap: 60 }}>
      {title && (
        <div style={{ opacity: titleOpacity, fontSize: theme.font.sizes.lg, fontWeight: theme.font.weights.bold, color: theme.colors.text, letterSpacing: '-0.5px' }}>
          {title}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
        {steps.map((step, i) => {
          const spring = staggeredSpring(i, 8, springBounce);
          const opacity = spring;
          const y = interpolate(spring, [0, 1], [30, 0]);
          const lineWidth = i < steps.length - 1 ? interpolate(staggeredSpring(i, 16), [0, 1], [0, 120]) : 0;

          return (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 200, opacity, transform: `translateY(${y}px)` }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: theme.colors.text, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: theme.font.sizes.sm, fontWeight: theme.font.weights.bold, marginBottom: 20 }}>
                  {i + 1}
                </div>
                <div style={{ fontSize: theme.font.sizes.sm, fontWeight: theme.font.weights.semibold, color: theme.colors.text, textAlign: 'center', marginBottom: 8 }}>{step.title}</div>
                <div style={{ fontSize: theme.font.sizes.xs, color: theme.colors.textMuted, textAlign: 'center', lineHeight: 1.5 }}>{step.description}</div>
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: lineWidth, height: 2, background: theme.colors.border, marginTop: 25, flexShrink: 0 }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
```

**Step 3: Create TimelineScene.tsx**

```tsx
// src/scenes/TimelineScene.tsx
import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation, springBounce } from '../hooks/useSceneAnimation';
import { TimelineSceneProps } from '../types';

export const TimelineScene: React.FC<TimelineSceneProps> = ({ title, milestones }) => {
  const { s, staggeredSpring } = useSceneAnimation();

  const titleOpacity = s(0);
  const lineWidth = interpolate(s(6), [0, 1], [0, 100]);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center', fontFamily: theme.font.family, flexDirection: 'column', gap: 64 }}>
      {title && (
        <div style={{ opacity: titleOpacity, fontSize: theme.font.sizes.lg, fontWeight: theme.font.weights.bold, color: theme.colors.text, letterSpacing: '-0.5px' }}>
          {title}
        </div>
      )}
      <div style={{ position: 'relative', width: 900 }}>
        {/* Line */}
        <div style={{ position: 'absolute', top: 20, left: 20, height: 2, background: theme.colors.border, width: `${lineWidth}%`, transition: 'none' }} />
        {/* Nodes */}
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          {milestones.map((m, i) => {
            const spring = staggeredSpring(i, 12, springBounce);
            const opacity = spring;
            const nodeScale = interpolate(spring, [0, 1], [0, 1]);
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: theme.colors.surface, border: `2.5px solid ${theme.colors.text}`, transform: `scale(${nodeScale})`, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: theme.colors.text }} />
                </div>
                {m.date && <div style={{ fontSize: theme.font.sizes.xs, color: theme.colors.accent, fontWeight: theme.font.weights.semibold, marginBottom: 4 }}>{m.date}</div>}
                <div style={{ fontSize: theme.font.sizes.xs, fontWeight: theme.font.weights.semibold, color: theme.colors.text, textAlign: 'center' }}>{m.label}</div>
                {m.description && <div style={{ fontSize: 12, color: theme.colors.textMuted, textAlign: 'center', marginTop: 4, maxWidth: 120, lineHeight: 1.4 }}>{m.description}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

**Step 4: Commit**

```bash
git add src/scenes/TestimonialScene.tsx src/scenes/StepsScene.tsx src/scenes/TimelineScene.tsx
git commit -m "feat: add TestimonialScene, StepsScene, and TimelineScene"
```

---

## Task 10: Comparison Scenes (ComparisonTableScene, SplitCompareScene)

**Files:**
- Create: `src/scenes/ComparisonTableScene.tsx`
- Create: `src/scenes/SplitCompareScene.tsx`

**Step 1: Create ComparisonTableScene.tsx**

```tsx
// src/scenes/ComparisonTableScene.tsx
import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation } from '../hooks/useSceneAnimation';
import { ComparisonTableSceneProps } from '../types';

export const ComparisonTableScene: React.FC<ComparisonTableSceneProps> = ({ ourName, theirName, features }) => {
  const { s, staggeredSpring } = useSceneAnimation();

  const headerOpacity = s(0);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center', fontFamily: theme.font.family }}>
      <div style={{ width: 800, background: theme.colors.surface, borderRadius: theme.radii.lg, overflow: 'hidden', boxShadow: theme.shadow, border: `1px solid ${theme.colors.border}` }}>
        {/* Header row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 160px', background: theme.colors.text, opacity: headerOpacity }}>
          <div style={{ padding: '20px 28px', color: '#fff', fontSize: theme.font.sizes.sm, fontWeight: theme.font.weights.semibold }}>Feature</div>
          <div style={{ padding: '20px 28px', color: theme.colors.accent, fontSize: theme.font.sizes.sm, fontWeight: theme.font.weights.bold, textAlign: 'center', background: 'rgba(99,102,241,0.2)' }}>{ourName}</div>
          <div style={{ padding: '20px 28px', color: 'rgba(255,255,255,0.5)', fontSize: theme.font.sizes.sm, fontWeight: theme.font.weights.semibold, textAlign: 'center' }}>{theirName}</div>
        </div>
        {/* Feature rows */}
        {features.map((f, i) => {
          const rowOpacity = staggeredSpring(i, 8);
          const rowX = interpolate(staggeredSpring(i, 8), [0, 1], [-20, 0]);
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 160px 160px', borderBottom: `1px solid ${theme.colors.border}`, opacity: rowOpacity, transform: `translateX(${rowX}px)` }}>
              <div style={{ padding: '16px 28px', fontSize: theme.font.sizes.xs, color: theme.colors.text, fontWeight: theme.font.weights.medium }}>{f.label}</div>
              <div style={{ padding: '16px 28px', textAlign: 'center', background: 'rgba(99,102,241,0.04)', fontSize: 18, color: f.ours ? theme.colors.success : theme.colors.danger }}>{f.ours ? '✓' : '✕'}</div>
              <div style={{ padding: '16px 28px', textAlign: 'center', fontSize: 18, color: f.theirs ? theme.colors.success : theme.colors.danger }}>{f.theirs ? '✓' : '✕'}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
```

**Step 2: Create SplitCompareScene.tsx**

```tsx
// src/scenes/SplitCompareScene.tsx
import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation } from '../hooks/useSceneAnimation';
import { SplitCompareSceneProps } from '../types';

export const SplitCompareScene: React.FC<SplitCompareSceneProps> = ({ leftLabel, rightLabel, leftPoints, rightPoints }) => {
  const { s, staggeredSpring } = useSceneAnimation();

  const leftX = interpolate(s(0), [0, 1], [-80, 0]);
  const rightX = interpolate(s(0), [0, 1], [80, 0]);
  const panelOpacity = s(0);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center', fontFamily: theme.font.family, gap: 40, flexDirection: 'row' }}>
      {/* Left */}
      <div style={{ flex: 1, maxWidth: 500, background: '#fef2f2', borderRadius: theme.radii.lg, padding: '44px 48px', border: `1px solid #fecaca`, opacity: panelOpacity, transform: `translateX(${leftX}px)` }}>
        <div style={{ fontSize: theme.font.sizes.xs, fontWeight: theme.font.weights.bold, color: theme.colors.danger, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 28 }}>{leftLabel}</div>
        {leftPoints.map((p, i) => {
          const o = staggeredSpring(i, 10);
          return (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16, opacity: o }}>
              <span style={{ color: theme.colors.danger, fontSize: 16, fontWeight: theme.font.weights.bold, flexShrink: 0, marginTop: 1 }}>✕</span>
              <span style={{ fontSize: theme.font.sizes.sm, color: '#7f1d1d', lineHeight: 1.4 }}>{p}</span>
            </div>
          );
        })}
      </div>

      {/* Right */}
      <div style={{ flex: 1, maxWidth: 500, background: '#f0fdf4', borderRadius: theme.radii.lg, padding: '44px 48px', border: `1px solid #bbf7d0`, opacity: panelOpacity, transform: `translateX(${rightX}px)` }}>
        <div style={{ fontSize: theme.font.sizes.xs, fontWeight: theme.font.weights.bold, color: theme.colors.success, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 28 }}>{rightLabel}</div>
        {rightPoints.map((p, i) => {
          const o = staggeredSpring(i, 10);
          return (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16, opacity: o }}>
              <span style={{ color: theme.colors.success, fontSize: 16, fontWeight: theme.font.weights.bold, flexShrink: 0, marginTop: 1 }}>✓</span>
              <span style={{ fontSize: theme.font.sizes.sm, color: '#14532d', lineHeight: 1.4 }}>{p}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
```

**Step 3: Commit**

```bash
git add src/scenes/ComparisonTableScene.tsx src/scenes/SplitCompareScene.tsx
git commit -m "feat: add ComparisonTableScene and SplitCompareScene"
```

---

## Task 11: Outro Scenes (CTAScene, OutroScene)

**Files:**
- Create: `src/scenes/CTAScene.tsx`
- Create: `src/scenes/OutroScene.tsx`

**Step 1: Create CTAScene.tsx**

```tsx
// src/scenes/CTAScene.tsx
import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation, springBounce } from '../hooks/useSceneAnimation';
import { CTASceneProps } from '../types';

export const CTAScene: React.FC<CTASceneProps> = ({ headline, subheadline, ctaText, url }) => {
  const { s, fadeIn } = useSceneAnimation();

  const headlineY = interpolate(s(0), [0, 1], [50, 0]);
  const headlineOpacity = s(0);
  const subOpacity = fadeIn(14, 12);
  const btnScale = interpolate(s(22, springBounce), [0, 1], [0.8, 1]);
  const btnOpacity = s(22, springBounce);
  const urlOpacity = fadeIn(34, 10);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center', fontFamily: theme.font.family }}>
      <div style={{ textAlign: 'center', maxWidth: 800, padding: '0 80px' }}>
        <div style={{ opacity: headlineOpacity, transform: `translateY(${headlineY}px)`, fontSize: theme.font.sizes.xxl, fontWeight: theme.font.weights.black, color: theme.colors.text, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 24 }}>
          {headline}
        </div>
        {subheadline && (
          <div style={{ opacity: subOpacity, fontSize: theme.font.sizes.md, color: theme.colors.textMuted, marginBottom: 44, lineHeight: 1.5 }}>
            {subheadline}
          </div>
        )}
        <div style={{ display: 'inline-block', opacity: btnOpacity, transform: `scale(${btnScale})`, background: theme.colors.accent, color: '#fff', padding: '18px 44px', borderRadius: theme.radii.full, fontSize: theme.font.sizes.sm, fontWeight: theme.font.weights.bold, letterSpacing: '-0.2px', marginBottom: 28 }}>
          {ctaText}
        </div>
        <div style={{ opacity: urlOpacity, fontSize: theme.font.sizes.xs, color: theme.colors.textMuted, fontWeight: theme.font.weights.medium }}>
          {url}
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

**Step 2: Create OutroScene.tsx**

```tsx
// src/scenes/OutroScene.tsx
import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation } from '../hooks/useSceneAnimation';
import { OutroSceneProps } from '../types';

export const OutroScene: React.FC<OutroSceneProps> = ({ brandName, tagline, logoUrl, handles, website }) => {
  const { fadeIn } = useSceneAnimation();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeInOpacity = fadeIn(0, 20);
  // Fade out in last 20 frames
  const fadeOutOpacity = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = Math.min(fadeInOpacity, fadeOutOpacity);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center', fontFamily: theme.font.family, opacity }}>
      <div style={{ textAlign: 'center' }}>
        {logoUrl ? (
          <Img src={logoUrl} style={{ width: 80, height: 80, marginBottom: 20 }} />
        ) : (
          <div style={{ width: 72, height: 72, background: theme.colors.text, borderRadius: theme.radii.md, margin: '0 auto 20px' }} />
        )}
        <div style={{ fontSize: theme.font.sizes.xl, fontWeight: theme.font.weights.black, color: theme.colors.text, letterSpacing: '-1.5px', marginBottom: 12 }}>
          {brandName}
        </div>
        {tagline && (
          <div style={{ fontSize: theme.font.sizes.sm, color: theme.colors.textMuted, marginBottom: 32 }}>
            {tagline}
          </div>
        )}
        {(website || handles) && (
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            {website && (
              <div style={{ fontSize: theme.font.sizes.xs, color: theme.colors.accent, fontWeight: theme.font.weights.medium }}>
                {website}
              </div>
            )}
            {handles?.map((h, i) => (
              <div key={i} style={{ fontSize: theme.font.sizes.xs, color: theme.colors.textMuted }}>
                {h}
              </div>
            ))}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
```

**Step 3: Commit**

```bash
git add src/scenes/CTAScene.tsx src/scenes/OutroScene.tsx
git commit -m "feat: add CTAScene and OutroScene"
```

---

## Task 12: Final Verification

**Step 1: Start Remotion Studio and check all 20 compositions load**

```bash
cd remotion-project && npm run dev
```

Open `http://localhost:3000`. You should see 20 compositions in the left sidebar.

**Step 2: Check each scene**

Navigate to each composition and scrub the timeline. Verify:
- No TypeScript errors in terminal
- Each scene renders content from `videoConfig.ts`
- Animations play correctly (elements spring in, stagger works)
- No blank/empty scenes

**Step 3: Verify content swap**

In `src/config/videoConfig.ts`, change the `headline` in `HeroScene` to something different. Save the file. Remotion Studio should hot-reload and show the new text without any code changes to the component.

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete 20-scene SaaS scene library"
```

---

## Quick Reference

| Scene | File | Duration |
|-------|------|----------|
| HeroScene | `src/scenes/HeroScene.tsx` | 4s |
| LogoRevealScene | `src/scenes/LogoRevealScene.tsx` | 3s |
| ProblemScene | `src/scenes/ProblemScene.tsx` | 5s |
| BeforeAfterScene | `src/scenes/BeforeAfterScene.tsx` | 5s |
| FeatureCalloutScene | `src/scenes/FeatureCalloutScene.tsx` | 4s |
| FeatureGridScene | `src/scenes/FeatureGridScene.tsx` | 5s |
| FeatureListScene | `src/scenes/FeatureListScene.tsx` | 4s |
| BrowserMockupScene | `src/scenes/BrowserMockupScene.tsx` | 5s |
| PhoneMockupScene | `src/scenes/PhoneMockupScene.tsx` | 5s |
| ChatStreamScene | `src/scenes/ChatStreamScene.tsx` | 8s |
| PromptToOutputScene | `src/scenes/PromptToOutputScene.tsx` | 6s |
| MetricsScene | `src/scenes/MetricsScene.tsx` | 4s |
| ChartScene | `src/scenes/ChartScene.tsx` | 5s |
| TestimonialScene | `src/scenes/TestimonialScene.tsx` | 5s |
| StepsScene | `src/scenes/StepsScene.tsx` | 5s |
| TimelineScene | `src/scenes/TimelineScene.tsx` | 5s |
| ComparisonTableScene | `src/scenes/ComparisonTableScene.tsx` | 5s |
| SplitCompareScene | `src/scenes/SplitCompareScene.tsx` | 4s |
| CTAScene | `src/scenes/CTAScene.tsx` | 4s |
| OutroScene | `src/scenes/OutroScene.tsx` | 4s |
