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

export type Demo2SceneProps = Record<string, never>;
export type Demo3SceneProps = Record<string, never>;
export type Demo4SceneProps = Record<string, never>;

export type SceneConfig =
  | { scene: 'Demo2Scene'; durationInSeconds: number; props: Demo2SceneProps }
  | { scene: 'Demo3Scene'; durationInSeconds: number; props: Demo3SceneProps }
  | { scene: 'Demo4Scene'; durationInSeconds: number; props: Demo4SceneProps }
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
