import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { PhoneShell, AppHeader, SectionLabel, SCREEN_WIDTH, SCREEN_HEIGHT, getStep, stepFadeUp } from '../components/PhoneShell';

const captions = [
  'Sarah browses available classes from partner studios — live availability, live pricing.',
  'Full class details — duration, instructor, capacity, price. And she can see exactly how many points she\'ll earn.',
  'Stripe handles the payment. The platform fee is applied automatically. Points are queued the moment payment completes.',
  'Confirmed. Booking reference generated. Points land in her account before she even puts her phone away.',
  'The booking sits in her upcoming schedule. Points already credited. She earned rewards without thinking about it.',
];

export const Demo3Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { step, stepFrame } = getStep(frame, 90, 5);

  const renderStep = () => {
    switch (step) {
      case 0: return <Step0 stepFrame={stepFrame} />;
      case 1: return <Step1 stepFrame={stepFrame} />;
      case 2: return <Step2 stepFrame={stepFrame} />;
      case 3: return <Step3 stepFrame={stepFrame} />;
      case 4: return <Step4 stepFrame={stepFrame} />;
      default: return null;
    }
  };

  return (
    <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.colors.bg }}>
      <PhoneShell caption={captions[step]} currentStep={step} totalSteps={5}>
        {renderStep()}
      </PhoneShell>
    </AbsoluteFill>
  );
};

/* ─── Step 0: Discover classes ─── */
const Step0: React.FC<{ stepFrame: number }> = ({ stepFrame }) => {
  const card1 = stepFadeUp(stepFrame, 5, 18);
  const card2 = stepFadeUp(stepFrame, 12, 18);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: theme.colors.bg, flex: 1, overflow: 'hidden' }}>
      <AppHeader title="TAPID" points="1,288 pts" />

      {/* Tab bar */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 8, padding: '0 14px', marginBottom: 8 }}>
        <div style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, color: theme.colors.textMuted, background: 'transparent' }}>
          Rewards
        </div>
        <div style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, color: '#fff', background: theme.colors.text }}>
          Visits
        </div>
      </div>

      <SectionLabel>Classes near you</SectionLabel>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', padding: '0 12px', gap: 10 }}>
        {/* Card 1 */}
        <div style={{
          ...card1,
          background: '#fff',
          border: `1.5px solid ${theme.colors.border}`,
          borderRadius: 12,
          padding: 12,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: theme.colors.text, fontFamily: theme.font.display }}>Vinyasa Flow</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: theme.colors.text, fontFamily: theme.font.display }}>€14</span>
          </div>
          <div style={{ fontSize: 11, color: theme.colors.textMuted, marginTop: 2, fontFamily: theme.font.body }}>
            Sukha Yoga · Ranelagh
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
            <span style={{ fontSize: 10, color: theme.colors.textMuted, fontFamily: theme.font.body }}>Tomorrow · 7:30am</span>
            <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: 10, padding: '3px 10px', borderRadius: 10, fontFamily: theme.font.body }}>
              6 spots left
            </span>
          </div>
          {/* Progress bar */}
          <div style={{ width: '100%', height: 4, background: '#E5E7EB', borderRadius: 6, marginTop: 8 }}>
            <div style={{ width: '70%', height: '100%', background: '#EF9F27', borderRadius: 6 }} />
          </div>
        </div>

        {/* Card 2 */}
        <div style={{
          ...card2,
          background: '#fff',
          border: `1.5px solid ${theme.colors.border}`,
          borderRadius: 12,
          padding: 12,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: theme.colors.text, fontFamily: theme.font.display }}>Power Pilates</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: theme.colors.text, fontFamily: theme.font.display }}>€16</span>
          </div>
          <div style={{ fontSize: 11, color: theme.colors.textMuted, marginTop: 2, fontFamily: theme.font.body }}>
            Core Studios · Rathmines
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
            <span style={{ fontSize: 10, color: theme.colors.textMuted, fontFamily: theme.font.body }}>Tomorrow · 9:00am</span>
            <span style={{ background: '#FEE2E2', color: '#991B1B', fontSize: 10, padding: '3px 10px', borderRadius: 10, fontFamily: theme.font.body }}>
              2 spots left
            </span>
          </div>
          {/* Progress bar */}
          <div style={{ width: '100%', height: 4, background: '#E5E7EB', borderRadius: 6, marginTop: 8 }}>
            <div style={{ width: '90%', height: '100%', background: '#EF4444', borderRadius: 6 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Step 1: Class detail ─── */
const Step1: React.FC<{ stepFrame: number }> = ({ stepFrame }) => {
  const mainAnim = stepFadeUp(stepFrame, 3, 18);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: theme.colors.bg, flex: 1, overflow: 'hidden', ...mainAnim }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '48px 14px 10px' }}>
        <span style={{ fontSize: 16, color: theme.colors.textMuted, cursor: 'pointer', fontFamily: theme.font.body }}>←</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: theme.colors.text, flex: 1, textAlign: 'center', fontFamily: theme.font.display }}>
          Vinyasa Flow
        </span>
        <span style={{ fontSize: 16, opacity: 0 }}>←</span>
      </div>

      {/* Hero block */}
      <div style={{
        margin: '0 12px',
        background: theme.colors.bg,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: 12,
        height: 80,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
      }}>
        <span style={{ fontSize: 24 }}>🧘</span>
        <div style={{ fontSize: 12, fontWeight: 700, textAlign: 'center', color: theme.colors.text, fontFamily: theme.font.display, marginTop: 4 }}>
          Sukha Yoga
        </div>
        <div style={{ fontSize: 10, color: theme.colors.textMuted, textAlign: 'center', fontFamily: theme.font.body }}>
          Ranelagh, Dublin 6
        </div>
      </div>

      {/* Detail rows */}
      <div style={{ margin: '8px 12px 0', fontSize: 11, fontFamily: theme.font.body }}>
        {[
          { left: '📅 Tomorrow, Wednesday', right: '7:30am – 8:30am', rightStyle: { color: theme.colors.textMuted } },
          { left: '👤 Instructor', right: "Maya O'Sullivan", rightStyle: { color: theme.colors.textMuted } },
          { left: '🎫 Price', right: '€14.00 per class', rightStyle: { fontWeight: 700, color: theme.colors.text } },
          { left: '👥 Spots', right: '6 of 10 remaining', rightStyle: { color: theme.colors.textMuted } },
        ].map((row, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 0',
            borderBottom: `1px solid ${theme.colors.border}`,
            color: theme.colors.text,
          }}>
            <span>{row.left}</span>
            <span style={row.rightStyle}>{row.right}</span>
          </div>
        ))}
      </div>

      {/* Loyalty callout */}
      <div style={{
        margin: '8px 12px 0',
        background: theme.colors.bg,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: 8,
        padding: 8,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }}>
        <span style={{
          background: theme.colors.text,
          color: '#fff',
          fontSize: 9,
          padding: '3px 6px',
          borderRadius: 10,
          fontFamily: theme.font.display,
          fontWeight: 700,
        }}>
          TAPID
        </span>
        <span style={{ fontSize: 11, color: theme.colors.textMuted, fontFamily: theme.font.body }}>
          Earn 140 pts for this booking
        </span>
      </div>

      {/* CTA */}
      <div style={{ flex: 1 }} />
      <div style={{
        margin: '0 12px 16px',
        background: theme.colors.text,
        color: '#fff',
        fontSize: 12,
        fontWeight: 700,
        textAlign: 'center',
        borderRadius: 10,
        padding: '12px 0',
        fontFamily: theme.font.display,
        cursor: 'pointer',
      }}>
        Book this class →
      </div>
    </div>
  );
};

/* ─── Step 2: Payment ─── */
const Step2: React.FC<{ stepFrame: number }> = ({ stepFrame }) => {
  const summaryAnim = stepFadeUp(stepFrame, 5, 18);
  const labelAnim = stepFadeUp(stepFrame, 10, 12);
  const payRowAnim = stepFadeUp(stepFrame, 12, 14);
  const ptsAnim = stepFadeUp(stepFrame, 16, 14);

  const btnScale = interpolate(stepFrame, [82, 89], [1, 0.97], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: theme.colors.bg, flex: 1, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '48px 14px 10px' }}>
        <span style={{ fontSize: 16, color: theme.colors.textMuted, fontFamily: theme.font.body }}>←</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: theme.colors.text, flex: 1, textAlign: 'center', fontFamily: theme.font.display }}>
          Payment
        </span>
        <span style={{ fontSize: 16, opacity: 0 }}>←</span>
      </div>

      {/* Summary card */}
      <div style={{
        ...summaryAnim,
        margin: '0 12px',
        background: '#fff',
        border: `1.5px solid ${theme.colors.border}`,
        borderRadius: 12,
        padding: 12,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: theme.colors.text, fontFamily: theme.font.display }}>
          Vinyasa Flow
        </div>
        <div style={{ fontSize: 11, color: theme.colors.textMuted, marginTop: 2, fontFamily: theme.font.body }}>
          Sukha Yoga · Tomorrow 7:30am
        </div>
        <div style={{ height: 1, background: theme.colors.border, margin: '10px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: theme.colors.text, fontFamily: theme.font.body, marginBottom: 4 }}>
          <span>Class fee</span>
          <span>€14.00</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: theme.colors.textMuted, fontFamily: theme.font.body }}>
          <span>Platform fee</span>
          <span>€0.55</span>
        </div>
        <div style={{ height: 1, background: theme.colors.border, margin: '10px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: theme.colors.text, fontFamily: theme.font.display }}>
          <span>Total</span>
          <span>€14.55</span>
        </div>
      </div>

      {/* Pay with label */}
      <div style={{ ...labelAnim, fontSize: 11, color: theme.colors.textMuted, padding: '10px 12px 6px', fontFamily: theme.font.body }}>
        Pay with
      </div>

      {/* Payment row */}
      <div style={{
        ...payRowAnim,
        margin: '0 12px',
        background: theme.colors.bg,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: 8,
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }}>
        <span style={{ fontSize: 16 }}>💳</span>
        <span style={{ fontSize: 12, flex: 1, color: theme.colors.text, fontFamily: theme.font.body }}>Visa ···· 4242</span>
        <span style={{
          background: '#F3F4F6',
          color: theme.colors.textMuted,
          fontSize: 9,
          padding: '3px 6px',
          borderRadius: 10,
          fontFamily: theme.font.body,
        }}>
          Default
        </span>
      </div>

      {/* Points preview */}
      <div style={{
        ...ptsAnim,
        margin: '8px 12px 0',
        background: theme.colors.bg,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: 8,
        padding: 8,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: 10, color: theme.colors.textMuted, fontFamily: theme.font.body }}>After payment:</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#3a9a5c', fontFamily: theme.font.display }}>+140 pts to your Tapid balance</span>
      </div>

      {/* CTA */}
      <div style={{ flex: 1 }} />
      <div style={{
        margin: '0 12px 16px',
        background: theme.colors.text,
        color: '#fff',
        fontSize: 13,
        fontWeight: 700,
        textAlign: 'center',
        borderRadius: 10,
        padding: '14px 0',
        fontFamily: theme.font.display,
        cursor: 'pointer',
        transform: `scale(${btnScale})`,
      }}>
        Pay €14.55
      </div>
    </div>
  );
};

/* ─── Step 3: Booking confirmed ─── */
const Step3: React.FC<{ stepFrame: number }> = ({ stepFrame }) => {
  const CIRC = 175.9;
  const circleP = interpolate(stepFrame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const checkP = interpolate(stepFrame, [8, 22], [0, 1], { extrapolateRight: 'clamp' });
  const textOpacity = interpolate(stepFrame, [16, 26], [0, 1], { extrapolateRight: 'clamp' });
  const bottomCard = stepFadeUp(stepFrame, 22, 16);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: '#1C1A17', flex: 1, overflow: 'hidden' }}>
      {/* Centered stack */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        padding: 18,
      }}>
        {/* Animated checkmark */}
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle
            cx="30" cy="30" r="28"
            fill="none" stroke="white" strokeWidth="2"
            strokeDasharray={CIRC}
            strokeDashoffset={(1 - circleP) * CIRC}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '30px 30px' }}
          />
          <path
            d="M18 30 L26 38 L42 22"
            fill="none" stroke="white" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="30"
            strokeDashoffset={(1 - checkP) * 30}
          />
        </svg>

        <div style={{ opacity: textOpacity, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: '100%' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: theme.font.display }}>
            Booking confirmed
          </div>
          <div style={{ fontSize: 11, color: '#D6D3D1', fontFamily: theme.font.body }}>
            Vinyasa Flow · Tomorrow 7:30am
          </div>
          <div style={{ height: 1, background: '#44403C', width: '100%' }} />
          <div style={{ fontSize: 11, color: '#D6D3D1', fontFamily: theme.font.body }}>
            Sukha Yoga, Ranelagh
          </div>
          <div style={{
            background: 'rgba(239,159,39,0.2)',
            color: '#EF9F27',
            fontSize: 10,
            padding: '4px 10px',
            borderRadius: 12,
            fontFamily: theme.font.body,
            fontWeight: 600,
          }}>
            +140 pts added
          </div>
        </div>
      </div>

      {/* Bottom card */}
      <div style={{
        ...bottomCard,
        background: '#292524',
        borderRadius: 12,
        padding: 12,
        margin: '0 0 16px',
      }}>
        <div style={{ fontSize: 9, color: '#A8A29E', fontFamily: theme.font.body, marginBottom: 4 }}>
          Your booking reference
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'monospace', letterSpacing: '0.05em', marginBottom: 4 }}>
          TXN-7842-SK
        </div>
        <div style={{ fontSize: 10, color: '#A8A29E', fontFamily: theme.font.body }}>
          Show this at the studio
        </div>
      </div>
    </div>
  );
};

/* ─── Step 4: Home post-booking ─── */
const Step4: React.FC<{ stepFrame: number }> = ({ stepFrame }) => {
  const pulse = interpolate(stepFrame, [0, 5, 10, 15], [1, 1.18, 1, 1], { extrapolateRight: 'clamp' });
  const upcomingCard = stepFadeUp(stepFrame, 8, 16);
  const merchantCards = stepFadeUp(stepFrame, 14, 16);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: theme.colors.bg, flex: 1, overflow: 'hidden' }}>
      {/* Manual header with pulsing badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '48px 18px 10px' }}>
        <div style={{
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: theme.colors.text,
          fontFamily: theme.font.display,
        }}>
          TAPID
        </div>
        <div style={{
          display: 'inline-block',
          transform: `scale(${pulse})`,
          background: theme.colors.text,
          color: '#fff',
          borderRadius: 20,
          padding: '4px 10px',
          fontSize: 12,
          fontWeight: 600,
          fontFamily: theme.font.body,
        }}>
          1,428 pts
        </div>
      </div>

      <SectionLabel>Upcoming</SectionLabel>

      {/* Upcoming card */}
      <div style={{
        ...upcomingCard,
        margin: '0 12px',
        background: '#fff',
        borderTop: `1px solid ${theme.colors.border}`,
        borderRight: `1px solid ${theme.colors.border}`,
        borderBottom: `1px solid ${theme.colors.border}`,
        borderLeft: '2px solid #3a9a5c',
        borderRadius: 12,
        padding: 12,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: theme.colors.text, fontFamily: theme.font.display }}>Vinyasa Flow</span>
          <span style={{ fontSize: 11, color: theme.colors.textMuted, fontFamily: theme.font.body }}>Tomorrow</span>
        </div>
        <div style={{ fontSize: 11, color: theme.colors.textMuted, marginTop: 4, fontFamily: theme.font.body }}>
          7:30am · Sukha Yoga
        </div>
        <div style={{ fontSize: 10, color: theme.colors.accent, textAlign: 'right', marginTop: 6, fontFamily: theme.font.body }}>
          Add to calendar
        </div>
      </div>

      <div style={{ marginTop: 8, fontSize: 11, color: theme.colors.textMuted, padding: '0 12px', fontFamily: theme.font.body }}>Merchants</div>

      {/* Merchant cards */}
      <div style={{ ...merchantCards, display: 'flex', flexDirection: 'column', padding: '0 12px', gap: 8, opacity: (merchantCards.opacity as number) * 0.7 }}>
        <div style={{
          background: '#fff',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: 12,
          padding: 10,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text, fontFamily: theme.font.display }}>Bewley's Café</div>
          <div style={{ fontSize: 10, color: theme.colors.textMuted, marginTop: 2, fontFamily: theme.font.body }}>Rewards available</div>
        </div>
        <div style={{
          background: '#fff',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: 12,
          padding: 10,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text, fontFamily: theme.font.display }}>The Foundry Gym</div>
          <div style={{ fontSize: 10, color: theme.colors.textMuted, marginTop: 2, fontFamily: theme.font.body }}>200 pts to go</div>
        </div>
      </div>
    </div>
  );
};
