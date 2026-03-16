import { SceneConfig } from '../types';

export const FPS = 30;

export const scenes: SceneConfig[] = [
  { scene: 'Demo2Scene', durationInSeconds: 15, props: {} },
  { scene: 'Demo3Scene', durationInSeconds: 15, props: {} },
  { scene: 'Demo4Scene', durationInSeconds: 12, props: {} },
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
        { label: 'Q4', value: 100, color: '#6366F1' },
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
