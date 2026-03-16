import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { PhoneShell, AppHeader, SectionLabel, getStep, stepFadeUp } from '../components/PhoneShell';

export const Demo4Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { step, stepFrame } = getStep(frame, 90, 4);

  // ── Step 0 — Merchant sends campaign ──────────────────────────────────────
  const renderStep0 = () => {
    const inputAnim = stepFadeUp(stepFrame, 4);
    const detailsAnim = stepFadeUp(stepFrame, 8);
    const budgetAnim = stepFadeUp(stepFrame, 12);
    const ctaAnim = stepFadeUp(stepFrame, 16);
    const press = interpolate(stepFrame, [82, 89], [1, 0.97], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', background: theme.colors.bg, flex: 1, overflow: 'hidden' }}>
        {/* Orientation pill */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 4px' }}>
          <div style={{
            background: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 8,
            padding: '6px 10px',
            fontSize: 10,
            color: theme.colors.textMuted,
            fontFamily: theme.font.body,
          }}>
            Merchant dashboard
          </div>
        </div>

        {/* Manual AppHeader with subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px 8px' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: theme.colors.text, fontFamily: theme.font.display }}>Bewley's Café</div>
            <div style={{ fontSize: 10, color: theme.colors.textMuted, fontFamily: theme.font.body }}>Admin</div>
          </div>
        </div>

        <SectionLabel>New campaign</SectionLabel>

        {/* Campaign form */}
        <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Input field */}
          <div style={{
            background: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 8,
            padding: 10,
            fontSize: 12,
            color: theme.colors.text,
            fontFamily: theme.font.body,
            ...inputAnim,
          }}>
            Double points this Sunday
          </div>

          {/* Detail rows */}
          <div style={{
            background: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 8,
            padding: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            ...detailsAnim,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: theme.colors.textMuted, fontFamily: theme.font.body }}>Duration</span>
              <span style={{ fontSize: 11, color: theme.colors.text, fontFamily: theme.font.body }}>Sunday 10am–6pm</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: theme.colors.textMuted, fontFamily: theme.font.body }}>Audience</span>
              <span style={{ fontSize: 11, color: theme.colors.text, fontFamily: theme.font.body }}>All Bewley's members (284)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: theme.colors.textMuted, fontFamily: theme.font.body }}>Bonus</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#3a9a5c', fontFamily: theme.font.body }}>2× points on all spend</span>
            </div>
          </div>

          {/* Points budget */}
          <div style={{
            background: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 8,
            padding: 10,
            ...budgetAnim,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: theme.colors.textMuted, fontFamily: theme.font.body }}>Points budget</span>
              <span style={{ fontSize: 10, color: theme.colors.textMuted, fontFamily: theme.font.body }}>400 / 1,000 pts</span>
            </div>
            <div style={{ marginTop: 6, width: '100%', height: 6, background: theme.colors.border, borderRadius: 4 }}>
              <div style={{ width: '40%', height: '100%', background: theme.colors.text, borderRadius: 4 }} />
            </div>
          </div>

          {/* CTA button */}
          <div style={{
            ...ctaAnim,
            transform: `${ctaAnim.transform} scale(${press})`,
          }}>
            <div style={{
              width: '100%',
              background: theme.colors.text,
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
              fontFamily: theme.font.display,
              borderRadius: 10,
              padding: 12,
              textAlign: 'center',
              boxSizing: 'border-box',
            }}>
              Send campaign →
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── Step 1 — Push notification on lock screen ─────────────────────────────
  const renderStep1 = () => {
    const notifT = Math.min(1, Math.max(0, (stepFrame - 6) / 12));
    const notifY = (1 - notifT) * -40;
    const notifOpacity = notifT;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', background: '#1C1A17', flex: 1, overflow: 'hidden' }}>
        {/* Time display */}
        <div style={{ paddingTop: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#fff', fontFamily: theme.font.display }}>11:24</div>
          <div style={{ fontSize: 12, color: '#D6D3D1', marginTop: 4, fontFamily: theme.font.body }}>Sunday</div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Notification card */}
        <div style={{
          background: '#292524',
          borderRadius: 12,
          padding: 12,
          margin: '0 12px 40px',
          opacity: notifOpacity,
          transform: `translateY(${notifY}px)`,
        }}>
          {/* Top row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#D6D3D1',
              fontSize: 9,
              padding: '3px 6px',
              borderRadius: 10,
              fontFamily: theme.font.body,
              fontWeight: 700,
              letterSpacing: 0.5,
            }}>
              TAPID
            </div>
            <span style={{ fontSize: 10, color: '#A8A29E', fontFamily: theme.font.body }}>now</span>
          </div>

          {/* Title */}
          <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginTop: 6, fontFamily: theme.font.display }}>
            Double points at Bewley's today
          </div>

          {/* Body */}
          <div style={{ fontSize: 11, color: '#D6D3D1', marginTop: 4, lineHeight: 1.4, fontFamily: theme.font.body }}>
            Earn 2× points on every coffee until 6pm. Today only.
          </div>
        </div>
      </div>
    );
  };

  // ── Step 2 — User visits and spends ──────────────────────────────────────
  const renderStep2 = () => {
    const bannerAnim = stepFadeUp(stepFrame, 4);
    const txAnim = stepFadeUp(stepFrame, 8);
    const showPoints = stepFrame > 25;
    const ptsAnim = stepFadeUp(stepFrame, 26);
    const appliedAnim = stepFadeUp(stepFrame, 27);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', background: theme.colors.bg, flex: 1, overflow: 'hidden' }}>
        <AppHeader title="TAPID" points="1,288 pts" />

        {/* Campaign banner */}
        <div style={{
          margin: '0 12px 8px',
          background: '#FEF3C7',
          borderRadius: 8,
          padding: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          ...bannerAnim,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
              <path d="M7 0 C7 0 12 5 12 9 C12 13 9.5 16 7 16 C4.5 16 2 13 2 9 C2 7 3 5 4 4 C4 6 5 7 6 7 C6 4 5 2 7 0Z" fill="#F97316"/>
            </svg>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#412402', fontFamily: theme.font.display }}>2× points active at Bewley's</span>
          </div>
          <span style={{ fontSize: 10, color: '#B45309', fontFamily: theme.font.body }}>until 6pm</span>
        </div>

        <SectionLabel>Recent</SectionLabel>

        {/* Transaction row */}
        <div style={{
          margin: '0 12px',
          background: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: 10,
          padding: 10,
          display: 'flex',
          alignItems: 'center',
          ...txAnim,
        }}>
          {/* Emoji icon */}
          <span style={{ fontSize: 18 }}>☕</span>

          {/* Middle content */}
          <div style={{ flex: 1, margin: '0 8px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text, fontFamily: theme.font.display }}>Bewley's Café</div>
            <div style={{ fontSize: 10, color: theme.colors.textMuted, fontFamily: theme.font.body }}>€6.20 · just now</div>
          </div>

          {/* Points display */}
          <div>
            {!showPoints ? (
              <span style={{ fontSize: 10, fontStyle: 'italic', color: theme.colors.textMuted, fontFamily: theme.font.body }}>
                matching…
              </span>
            ) : (
              <span style={{ fontSize: 12, fontWeight: 700, color: '#3a9a5c', fontFamily: theme.font.display, ...ptsAnim }}>
                +124 pts
              </span>
            )}
          </div>
        </div>

        {/* Campaign applied label */}
        {showPoints && (
          <div style={{
            fontSize: 10,
            color: '#3a9a5c',
            padding: '4px 12px',
            fontFamily: theme.font.body,
            ...appliedAnim,
          }}>
            2× campaign applied
          </div>
        )}
      </div>
    );
  };

  // ── Step 3 — Campaign results (merchant dashboard) ────────────────────────
  const renderStep3 = () => {
    const cardAnim = stepFadeUp(stepFrame, 5);
    const bottomBarAnim = stepFadeUp(stepFrame, 40);

    const metrics: [string, string][] = [
      ['Customers reached', '284'],
      ['Visits generated', '61'],
      ['Total spend tracked', '€1,840'],
      ['Points awarded', '18,400 pts'],
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', background: theme.colors.bg, flex: 1, overflow: 'hidden' }}>
        {/* Orientation pill */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 4px' }}>
          <div style={{
            background: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 8,
            padding: '6px 10px',
            fontSize: 10,
            color: theme.colors.textMuted,
            fontFamily: theme.font.body,
          }}>
            Merchant dashboard
          </div>
        </div>

        {/* Manual AppHeader with subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px 8px' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: theme.colors.text, fontFamily: theme.font.display }}>Bewley's Café</div>
            <div style={{ fontSize: 10, color: theme.colors.textMuted, fontFamily: theme.font.body }}>Admin</div>
          </div>
        </div>

        {/* Campaign result card */}
        <div style={{
          margin: '0 12px',
          background: '#fff',
          border: '1.5px solid #3a9a5c',
          borderRadius: 12,
          padding: 12,
          ...cardAnim,
        }}>
          {/* Top row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: theme.colors.text, fontFamily: theme.font.display }}>Double points Sunday</span>
            <div style={{
              background: '#DCFCE7',
              color: '#166534',
              fontSize: 10,
              padding: '3px 8px',
              borderRadius: 12,
              fontFamily: theme.font.body,
              fontWeight: 600,
            }}>
              Complete
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: `1px solid ${theme.colors.border}`, margin: '10px 0' }} />

          {/* Metric rows */}
          {metrics.map(([label, value], i) => {
            const rowAnim = stepFadeUp(stepFrame, 12 + i * 6);
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '6px 0',
                  borderBottom: i < 3 ? `1px solid ${theme.colors.border}` : 'none',
                  fontSize: 12,
                  ...rowAnim,
                }}
              >
                <span style={{ color: theme.colors.textMuted, fontFamily: theme.font.body }}>{label}</span>
                <span style={{ fontWeight: 700, color: theme.colors.text, fontFamily: theme.font.display }}>{value}</span>
              </div>
            );
          })}

          {/* Bottom result bar */}
          <div style={{
            marginTop: 8,
            background: theme.colors.bg,
            borderRadius: 8,
            padding: 6,
            textAlign: 'center',
            ...bottomBarAnim,
          }}>
            <span style={{ fontSize: 11, color: '#3a9a5c', fontFamily: theme.font.body }}>
              vs previous Sunday +34% footfall
            </span>
          </div>
        </div>
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      case 0: return renderStep0();
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      default: return renderStep0();
    }
  };

  const captions = [
    "The merchant builds a flash campaign in seconds — audience, duration, bonus multiplier. One tap to send.",
    "The push notification lands on Sarah's lock screen. Targeted, timely, property-branded.",
    "Sarah visits Bewley's and spends €6.20. The 2× multiplier fires automatically — 124 pts instead of 62.",
    "The merchant sees the lift immediately — visits, spend, points awarded. Full campaign attribution, no guesswork.",
  ];

  return (
    <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.colors.bg }}>
      <PhoneShell caption={captions[step]} currentStep={step} totalSteps={4}>
        {renderStep()}
      </PhoneShell>
    </AbsoluteFill>
  );
};
