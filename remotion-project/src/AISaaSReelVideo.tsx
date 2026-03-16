import React from 'react';
import { AbsoluteFill, Series, interpolate, useCurrentFrame } from 'remotion';
import { theme } from './config/theme';
import { LaptopOpenScene }      from './scenes/LaptopOpenScene';
import { BrowserLoadScene }     from './scenes/BrowserLoadScene';
import { AIStreamScene }        from './scenes/AIStreamScene';
import { CodeEditorScene }      from './scenes/CodeEditorScene';
import { TerminalScene }        from './scenes/TerminalScene';
import { DashboardRevealScene } from './scenes/DashboardRevealScene';
import { SearchBarScene }       from './scenes/SearchBarScene';
import { FeatureCardsScene }    from './scenes/FeatureCardsScene';
import { APIRequestScene }      from './scenes/APIRequestScene';
import { NeuralPulseScene }     from './scenes/NeuralPulseScene';

const SCENE_DURATION = 90;
const FLASH_DURATION = 5;
const FLASH_PEAK     = 2;

const SceneBridge: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, FLASH_PEAK, FLASH_DURATION],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  return <AbsoluteFill style={{ backgroundColor: theme.colors.bg, opacity }} />;
};

// Total: 10 × 90 + 9 × 5 = 945 frames (31.5 s)
export const AISaaSReelVideo: React.FC = () => (
  <Series>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="NeuralPulse">
      <NeuralPulseScene dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="LaptopOpen">
      <LaptopOpenScene url="app.tapid.io" dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="BrowserLoad">
      <BrowserLoadScene url="app.tapid.io/dashboard" dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="AIStream">
      <AIStreamScene dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="CodeEditor">
      <CodeEditorScene dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="Terminal">
      <TerminalScene dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="DashboardReveal">
      <DashboardRevealScene dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="SearchBar">
      <SearchBarScene dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="FeatureCards">
      <FeatureCardsScene dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="APIRequest">
      <APIRequestScene dark />
    </Series.Sequence>

  </Series>
);
