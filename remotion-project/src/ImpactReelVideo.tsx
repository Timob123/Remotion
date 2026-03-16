import React from 'react';
import { AbsoluteFill, Series, interpolate, useCurrentFrame } from 'remotion';
import { theme } from './config/theme';
import { WordSlamScene } from './scenes/WordSlamScene';
import { HeadlineBuildScene } from './scenes/HeadlineBuildScene';
import { StatCountScene } from './scenes/StatCountScene';
import { ScaleInOutScene } from './scenes/ScaleInOutScene';
import { LetterDropScene } from './scenes/LetterDropScene';
import { MaskRevealScene } from './scenes/MaskRevealScene';
import { OverlineScene } from './scenes/OverlineScene';
import { SplitRevealScene } from './scenes/SplitRevealScene';
import { WordFocusScene } from './scenes/WordFocusScene';
import { StackBuildScene } from './scenes/StackBuildScene';
import { FlashCutScene } from './scenes/FlashCutScene';
import { PunchlineScene } from './scenes/PunchlineScene';
import { TitleCardScene } from './scenes/TitleCardScene';
import { OutlineToFillScene } from './scenes/OutlineToFillScene';
import { WordSweepScene } from './scenes/WordSweepScene';
import { CountdownScene } from './scenes/CountdownScene';
import { HighlightScene } from './scenes/HighlightScene';
import { BoldCentreScene } from './scenes/BoldCentreScene';
import { CinematicTextScene } from './scenes/CinematicTextScene';
import { ExitBlazeScene } from './scenes/ExitBlazeScene';

// ── MODULE-SCOPE CONSTANTS ──
const SCENE_DURATION = 60;   // 2 s @ 30 fps
const FLASH_DURATION = 4;    // brief flash-cut bridge
const FLASH_PEAK    = 2;    // frame where flash is full white

/** Brief white flash between scenes — Apple-style hard cut with snap */
const SceneBridge: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, FLASH_PEAK, FLASH_DURATION],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, opacity }} />
  );
};

// ── TOTAL: 20 × SCENE_DURATION + 19 × FLASH_DURATION = 1276 frames (≈ 42.5 s) ──
export const ImpactReelVideo: React.FC = () => (
  <Series>

    {/* 1 — Countdown: dramatic opener */}
    <Series.Sequence durationInFrames={SCENE_DURATION} name="Countdown">
      <CountdownScene from={3} dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge">
      <SceneBridge />
    </Series.Sequence>

    {/* 2 — WordSlam */}
    <Series.Sequence durationInFrames={SCENE_DURATION} name="WordSlam">
      <WordSlamScene word="Shipped." dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge">
      <SceneBridge />
    </Series.Sequence>

    {/* 3 — HeadlineBuild */}
    <Series.Sequence durationInFrames={SCENE_DURATION} name="HeadlineBuild">
      <HeadlineBuildScene headline="The fastest way to ship." />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge">
      <SceneBridge />
    </Series.Sequence>

    {/* 4 — StatCount */}
    <Series.Sequence durationInFrames={SCENE_DURATION} name="StatCount">
      <StatCountScene value={99} label="uptime" suffix="%" dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge">
      <SceneBridge />
    </Series.Sequence>

    {/* 5 — ScaleInOut */}
    <Series.Sequence durationInFrames={SCENE_DURATION} name="ScaleInOut">
      <ScaleInOutScene word="Focus." />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge">
      <SceneBridge />
    </Series.Sequence>

    {/* 6 — LetterDrop */}
    <Series.Sequence durationInFrames={SCENE_DURATION} name="LetterDrop">
      <LetterDropScene word="IMPACT" dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge">
      <SceneBridge />
    </Series.Sequence>

    {/* 7 — MaskReveal */}
    <Series.Sequence durationInFrames={SCENE_DURATION} name="MaskReveal">
      <MaskRevealScene text="Instant delivery." subtext="No waiting." />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge">
      <SceneBridge />
    </Series.Sequence>

    {/* 8 — Overline */}
    <Series.Sequence durationInFrames={SCENE_DURATION} name="Overline">
      <OverlineScene text="Redesigned." subtext="From the ground up." dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge">
      <SceneBridge />
    </Series.Sequence>

    {/* 9 — SplitReveal */}
    <Series.Sequence durationInFrames={SCENE_DURATION} name="SplitReveal">
      <SplitRevealScene text="Beautiful." />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge">
      <SceneBridge />
    </Series.Sequence>

    {/* 10 — WordFocus */}
    <Series.Sequence durationInFrames={SCENE_DURATION} name="WordFocus">
      <WordFocusScene word="Clarity." subtext="No compromises." />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge">
      <SceneBridge />
    </Series.Sequence>

    {/* 11 — StackBuild */}
    <Series.Sequence durationInFrames={SCENE_DURATION} name="StackBuild">
      <StackBuildScene lines={['Build faster.', 'Ship smarter.', 'Grow bigger.']} dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge">
      <SceneBridge />
    </Series.Sequence>

    {/* 12 — FlashCut */}
    <Series.Sequence durationInFrames={SCENE_DURATION} name="FlashCut">
      <FlashCutScene text="Now." subtext="Available today." dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge">
      <SceneBridge />
    </Series.Sequence>

    {/* 13 — Punchline */}
    <Series.Sequence durationInFrames={SCENE_DURATION} name="Punchline">
      <PunchlineScene headline="Game over." sub="For your competitors." dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge">
      <SceneBridge />
    </Series.Sequence>

    {/* 14 — TitleCard */}
    <Series.Sequence durationInFrames={SCENE_DURATION} name="TitleCard">
      <TitleCardScene title="Chapter One" subtitle="The beginning." />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge">
      <SceneBridge />
    </Series.Sequence>

    {/* 15 — OutlineToFill */}
    <Series.Sequence durationInFrames={SCENE_DURATION} name="OutlineToFill">
      <OutlineToFillScene word="BOLD" dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge">
      <SceneBridge />
    </Series.Sequence>

    {/* 16 — WordSweep */}
    <Series.Sequence durationInFrames={SCENE_DURATION} name="WordSweep">
      <WordSweepScene words={['Simple.', 'Powerful.', 'Yours.']} />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge">
      <SceneBridge />
    </Series.Sequence>

    {/* 17 — Highlight */}
    <Series.Sequence durationInFrames={SCENE_DURATION} name="Highlight">
      <HighlightScene text="Built for speed." highlight="speed" />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge">
      <SceneBridge />
    </Series.Sequence>

    {/* 18 — BoldCentre */}
    <Series.Sequence durationInFrames={SCENE_DURATION} name="BoldCentre">
      <BoldCentreScene word="YES." dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge">
      <SceneBridge />
    </Series.Sequence>

    {/* 19 — CinematicText */}
    <Series.Sequence durationInFrames={SCENE_DURATION} name="CinematicText">
      <CinematicTextScene text="A NEW ERA" subtext="BEGINS NOW" dark />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge">
      <SceneBridge />
    </Series.Sequence>

    {/* 20 — ExitBlaze: finale */}
    <Series.Sequence durationInFrames={SCENE_DURATION} name="ExitBlaze">
      <ExitBlazeScene text="See you out there." subtext="tapid.io" />
    </Series.Sequence>

  </Series>
);
