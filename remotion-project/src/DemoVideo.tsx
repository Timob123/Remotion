import React from 'react';
import { Series } from 'remotion';
import { scenes, FPS } from './config/videoConfig';
import { Demo2Scene } from './scenes/Demo2Scene';
import { Demo3Scene } from './scenes/Demo3Scene';
import { Demo4Scene } from './scenes/Demo4Scene';
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SCENE_MAP: Record<string, React.ComponentType<any>> = {
  Demo2Scene,
  Demo3Scene,
  Demo4Scene,
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

export const DemoVideo: React.FC = () => {
  return (
    <Series>
      {scenes.map((config, i) => {
        const Component = SCENE_MAP[config.scene];
        return (
          <Series.Sequence
            key={`${config.scene}-${i}`}
            durationInFrames={config.durationInSeconds * FPS}
            name={config.scene}
          >
            <Component {...config.props} />
          </Series.Sequence>
        );
      })}
    </Series>
  );
};
