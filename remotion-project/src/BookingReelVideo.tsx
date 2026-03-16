import React from 'react';
import { AbsoluteFill, Series, interpolate, useCurrentFrame } from 'remotion';
import { theme } from './config/theme';
import { CalendarTapScene }     from './scenes/CalendarTapScene';
import { DateRangeScene }       from './scenes/DateRangeScene';
import { SlotSelectionScene }   from './scenes/SlotSelectionScene';
import { BookingConfirmedScene } from './scenes/BookingConfirmedScene';
import { BookingCountdownScene } from './scenes/BookingCountdownScene';
import { MapPinDropScene }      from './scenes/MapPinDropScene';
import { NearbyVenueScene }     from './scenes/NearbyVenueScene';
import { PayTapScene }          from './scenes/PayTapScene';
import { ReceiptUnfurlScene }   from './scenes/ReceiptUnfurlScene';
import { ReminderPingScene }    from './scenes/ReminderPingScene';
import { WaitlistScene }        from './scenes/WaitlistScene';
import { RescheduleDragScene }  from './scenes/RescheduleDragScene';
import { BookingWaveScene }     from './scenes/BookingWaveScene';
import { TableLayoutScene }     from './scenes/TableLayoutScene';
import { CalendarScrollScene }  from './scenes/CalendarScrollScene';
import { BookingBarChartScene } from './scenes/BookingBarChartScene';
import { RevenueLineScene }     from './scenes/RevenueLineScene';
import { DonutFillScene }       from './scenes/DonutFillScene';
import { HeatmapScene }         from './scenes/HeatmapScene';
import { FunnelScene }          from './scenes/FunnelScene';

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

// Total: 20 × 90 + 19 × 5 = 1895 frames (63.2 s)
export const BookingReelVideo: React.FC = () => (
  <Series>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="CalendarTap">
      <CalendarTapScene />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="CalendarScroll">
      <CalendarScrollScene />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="DateRange">
      <DateRangeScene />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="SlotSelection">
      <SlotSelectionScene />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="BookingCountdown">
      <BookingCountdownScene />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="MapPinDrop">
      <MapPinDropScene />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="NearbyVenue">
      <NearbyVenueScene />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="TableLayout">
      <TableLayoutScene />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="ReminderPing">
      <ReminderPingScene />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="Waitlist">
      <WaitlistScene />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="PayTap">
      <PayTapScene />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="RescheduleDrag">
      <RescheduleDragScene />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="ReceiptUnfurl">
      <ReceiptUnfurlScene />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="BookingConfirmed">
      <BookingConfirmedScene />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="BookingWave">
      <BookingWaveScene />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="BookingBarChart">
      <BookingBarChartScene />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="RevenueLine">
      <RevenueLineScene />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="DonutFill">
      <DonutFillScene />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="Heatmap">
      <HeatmapScene />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FLASH_DURATION} name="Bridge"><SceneBridge /></Series.Sequence>

    <Series.Sequence durationInFrames={SCENE_DURATION} name="Funnel">
      <FunnelScene />
    </Series.Sequence>

  </Series>
);
