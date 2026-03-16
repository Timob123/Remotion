import React from 'react';
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
import { DemoVideo } from './DemoVideo';
import { Demo2Scene } from './scenes/Demo2Scene';
import { Demo3Scene } from './scenes/Demo3Scene';
import { Demo4Scene } from './scenes/Demo4Scene';
import { PhoneNotificationScene } from './scenes/PhoneNotificationScene';
import { PhoneTypingScene } from './scenes/PhoneTypingScene';
import { PhoneIncomingCallScene } from './scenes/PhoneIncomingCallScene';
import { PhoneAppOpenScene } from './scenes/PhoneAppOpenScene';
import { PhoneLoadingScene } from './scenes/PhoneLoadingScene';
import { PhoneTapRippleScene } from './scenes/PhoneTapRippleScene';
import { PhoneSwipeScene } from './scenes/PhoneSwipeScene';
import { PhoneBadgeUpdateScene } from './scenes/PhoneBadgeUpdateScene';
import { PhoneLockScreenScene } from './scenes/PhoneLockScreenScene';
import { PhoneScreenshotScene } from './scenes/PhoneScreenshotScene';
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
import { LaptopOpenScene } from './scenes/LaptopOpenScene';
import { BrowserLoadScene } from './scenes/BrowserLoadScene';
import { AIStreamScene } from './scenes/AIStreamScene';
import { CodeEditorScene } from './scenes/CodeEditorScene';
import { TerminalScene } from './scenes/TerminalScene';
import { DashboardRevealScene } from './scenes/DashboardRevealScene';
import { SearchBarScene } from './scenes/SearchBarScene';
import { FeatureCardsScene } from './scenes/FeatureCardsScene';
import { ImpactReelVideo } from './ImpactReelVideo';
import { AISaaSReelVideo } from './AISaaSReelVideo';
import { BookingReelVideo } from './BookingReelVideo';
import { TapidIntroVideo } from './TapidIntroVideo';
import { APIRequestScene } from './scenes/APIRequestScene';
import { NeuralPulseScene } from './scenes/NeuralPulseScene';
import { CalendarTapScene } from './scenes/CalendarTapScene';
import { DateRangeScene } from './scenes/DateRangeScene';
import { SlotSelectionScene } from './scenes/SlotSelectionScene';
import { BookingConfirmedScene } from './scenes/BookingConfirmedScene';
import { BookingCountdownScene } from './scenes/BookingCountdownScene';
import { MapPinDropScene } from './scenes/MapPinDropScene';
import { NearbyVenueScene } from './scenes/NearbyVenueScene';
import { PayTapScene } from './scenes/PayTapScene';
import { ReceiptUnfurlScene } from './scenes/ReceiptUnfurlScene';
import { ReminderPingScene } from './scenes/ReminderPingScene';
import { WaitlistScene } from './scenes/WaitlistScene';
import { RescheduleDragScene } from './scenes/RescheduleDragScene';
import { BookingWaveScene } from './scenes/BookingWaveScene';
import { TableLayoutScene } from './scenes/TableLayoutScene';
import { CalendarScrollScene } from './scenes/CalendarScrollScene';
import { BookingBarChartScene } from './scenes/BookingBarChartScene';
import { RevenueLineScene } from './scenes/RevenueLineScene';
import { DonutFillScene } from './scenes/DonutFillScene';
import { HeatmapScene } from './scenes/HeatmapScene';
import { FunnelScene } from './scenes/FunnelScene';

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

const totalFrames = scenes.reduce((sum, s) => sum + s.durationInSeconds * FPS, 0);

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="DemoVideo"
        component={DemoVideo}
        durationInFrames={totalFrames}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="PhoneNotification"
        component={PhoneNotificationScene}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          appName: 'Messages',
          message: 'Hey, are you free tonight?',
          time: 'now',
          caption: 'Push notification arrives instantly.',
        }}
      />
      <Composition
        id="PhoneTyping"
        component={PhoneTypingScene}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          contactName: 'Sarah',
          caption: 'Typing indicator — seamless live feedback.',
        }}
      />
      <Composition
        id="PhoneIncomingCall"
        component={PhoneIncomingCallScene}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          callerName: 'Alex Johnson',
          callerSubtitle: 'Mobile',
          caption: 'Incoming call — green ripple draws attention.',
        }}
      />
      <Composition
        id="PhoneAppOpen"
        component={PhoneAppOpenScene}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          appIcon: '⚡',
          appName: 'Tapid',
          caption: 'App launches instantly.',
        }}
      />
      <Composition
        id="PhoneLoading"
        component={PhoneLoadingScene}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          label: 'Processing...',
          progress: 0.7,
          caption: 'Loading state — processing in progress.',
        }}
      />
      <Composition
        id="PhoneTapRipple"
        component={PhoneTapRippleScene}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ caption: 'Tap registered — instant haptic response.' }}
      />
      <Composition
        id="PhoneSwipe"
        component={PhoneSwipeScene}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ direction: 'left', caption: 'Swipe to dismiss — fluid gesture response.' }}
      />
      <Composition
        id="PhoneBadgeUpdate"
        component={PhoneBadgeUpdateScene}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ appIcon: '⚡', fromCount: 0, toCount: 3, caption: 'Badge updates in real time.' }}
      />
      <Composition
        id="PhoneLockScreen"
        component={PhoneLockScreenScene}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ time: '9:41', date: 'Saturday, March 14', notificationText: 'New message from Alex', caption: 'Lock screen — at a glance.' }}
      />
      <Composition
        id="PhoneScreenshot"
        component={PhoneScreenshotScene}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ caption: 'Screenshot — captured.' }}
      />
      <Composition
        id="WordSlam"
        component={WordSlamScene}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ word: 'Shipped.', dark: true }}
      />
      <Composition
        id="HeadlineBuild"
        component={HeadlineBuildScene}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ headline: 'The fastest way to ship.', dark: false }}
      />
      <Composition
        id="StatCount"
        component={StatCountScene}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ value: 99, label: 'uptime', suffix: '%', dark: true }}
      />
      <Composition
        id="ScaleInOut"
        component={ScaleInOutScene}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ word: 'Focus.', dark: false }}
      />
      <Composition
        id="LetterDrop"
        component={LetterDropScene}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ word: 'IMPACT', dark: true }}
      />
      <Composition
        id="MaskReveal"
        component={MaskRevealScene}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ text: 'Instant delivery.', subtext: 'No waiting.', dark: false }}
      />
      <Composition
        id="Overline"
        component={OverlineScene}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ text: 'Redesigned.', subtext: 'From the ground up.', dark: true }}
      />
      <Composition
        id="SplitReveal"
        component={SplitRevealScene}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ text: 'Beautiful.', dark: false }}
      />
      <Composition
        id="WordFocus"
        component={WordFocusScene}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ word: 'Clarity.', subtext: 'No compromises.', dark: false }}
      />
      <Composition
        id="StackBuild"
        component={StackBuildScene}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ lines: ['Build faster.', 'Ship smarter.', 'Grow bigger.'], dark: true }}
      />
      <Composition
        id="FlashCut"
        component={FlashCutScene}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ text: 'Now.', subtext: 'Available today.', dark: true }}
      />
      <Composition
        id="Punchline"
        component={PunchlineScene}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ headline: 'Game over.', sub: 'For your competitors.', dark: true }}
      />
      <Composition
        id="TitleCard"
        component={TitleCardScene}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ title: 'Chapter One', subtitle: 'The beginning.', dark: false }}
      />
      <Composition
        id="OutlineToFill"
        component={OutlineToFillScene}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ word: 'BOLD', dark: true }}
      />
      <Composition
        id="WordSweep"
        component={WordSweepScene}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ words: ['Simple.', 'Powerful.', 'Yours.'], dark: false }}
      />
      <Composition
        id="Countdown"
        component={CountdownScene}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ from: 3, dark: true }}
      />
      <Composition
        id="Highlight"
        component={HighlightScene}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ text: 'Built for speed.', highlight: 'speed', dark: false }}
      />
      <Composition
        id="BoldCentre"
        component={BoldCentreScene}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ word: 'YES.', dark: true }}
      />
      <Composition
        id="CinematicText"
        component={CinematicTextScene}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ text: 'A NEW ERA', subtext: 'BEGINS NOW', dark: true }}
      />
      <Composition
        id="ExitBlaze"
        component={ExitBlazeScene}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ text: 'See you out there.', subtext: 'tapid.io', dark: false }}
      />
      <Composition
        id="LaptopOpen"
        component={LaptopOpenScene}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ url: 'app.tapid.io', dark: true }}
      />
      <Composition
        id="BrowserLoad"
        component={BrowserLoadScene}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ url: 'app.tapid.io/dashboard', dark: true }}
      />
      <Composition
        id="AIStream"
        component={AIStreamScene}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ dark: true }}
      />
      <Composition
        id="CodeEditor"
        component={CodeEditorScene}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ dark: true }}
      />
      <Composition
        id="Terminal"
        component={TerminalScene}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ dark: true }}
      />
      <Composition
        id="DashboardReveal"
        component={DashboardRevealScene}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ dark: true }}
      />
      <Composition
        id="SearchBar"
        component={SearchBarScene}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ dark: true }}
      />
      <Composition
        id="FeatureCards"
        component={FeatureCardsScene}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ dark: true }}
      />
      {/* Impact Reel — all 20 scenes stitched with flash-cut transitions */}
      <Composition
        id="ImpactReel"
        component={ImpactReelVideo}
        durationInFrames={1276}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* AI SaaS Reel — 10 AI-themed scenes */}
      <Composition
        id="AISaaSReel"
        component={AISaaSReelVideo}
        durationInFrames={945}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="APIRequest"
        component={APIRequestScene}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ dark: true }}
      />
      <Composition
        id="NeuralPulse"
        component={NeuralPulseScene}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ dark: true }}
      />
      {/* Tapid brand intro — 9:16 portrait, 15s */}
      <Composition
        id="TapidIntro"
        component={TapidIntroVideo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* Booking Reel — 20 booking + chart scenes */}
      <Composition id="BookingReel" component={BookingReelVideo} durationInFrames={1895} fps={30} width={1920} height={1080} />
      {/* ── Booking scenes ── */}
      <Composition id="CalendarTap" component={CalendarTapScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: false }} />
      <Composition id="DateRange" component={DateRangeScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: false }} />
      <Composition id="SlotSelection" component={SlotSelectionScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: false }} />
      <Composition id="BookingConfirmed" component={BookingConfirmedScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: false }} />
      <Composition id="BookingCountdown" component={BookingCountdownScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: false }} />
      <Composition id="MapPinDrop" component={MapPinDropScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: false }} />
      <Composition id="NearbyVenue" component={NearbyVenueScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: false }} />
      <Composition id="PayTap" component={PayTapScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: false }} />
      <Composition id="ReceiptUnfurl" component={ReceiptUnfurlScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: false }} />
      <Composition id="ReminderPing" component={ReminderPingScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: false }} />
      <Composition id="Waitlist" component={WaitlistScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: false }} />
      <Composition id="RescheduleDrag" component={RescheduleDragScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: false }} />
      <Composition id="BookingWave" component={BookingWaveScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: false }} />
      <Composition id="TableLayout" component={TableLayoutScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: false }} />
      <Composition id="CalendarScroll" component={CalendarScrollScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: false }} />
      {/* ── Chart scenes ── */}
      <Composition id="BookingBarChart" component={BookingBarChartScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: false }} />
      <Composition id="RevenueLine" component={RevenueLineScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: false }} />
      <Composition id="DonutFill" component={DonutFillScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: false }} />
      <Composition id="Heatmap" component={HeatmapScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: false }} />
      <Composition id="Funnel" component={FunnelScene} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ dark: false }} />
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
