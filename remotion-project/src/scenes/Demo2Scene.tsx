import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { theme } from '../config/theme';
import {
  PhoneShell,
  AppHeader,
  SectionLabel,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  getStep,
  stepFadeUp,
} from '../components/PhoneShell';

// ─── Step 0 — Rewards screen ─────────────────────────────────────────────────

const Step0Screen: React.FC<{ stepFrame: number }> = ({ stepFrame }) => {
  const card1Anim = stepFadeUp(stepFrame, 5, 20);
  const card2AnimBase = stepFadeUp(stepFrame, 12, 20);
  const card2Anim = {
    ...card2AnimBase,
    opacity: card2AnimBase.opacity * 0.5,
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      background: theme.colors.bg,
    }}>
      <AppHeader title="TAPID" points="1,288 pts" />
      <SectionLabel>Your rewards</SectionLabel>

      {/* Cards area */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '0 12px',
        gap: 10,
        overflowY: 'hidden',
      }}>
        {/* Card 1 — Unlocked */}
        <div style={{
          ...card1Anim,
          background: theme.colors.surface,
          borderRadius: 12,
          padding: 12,
          border: `1px solid ${theme.colors.border}`,
          borderLeft: '2px solid #3a9a5c',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
              fontSize: 13,
              fontWeight: 700,
              color: theme.colors.text,
              fontFamily: theme.font.body,
            }}>Free coffee</span>
            <span style={{
              background: '#DCFCE7',
              color: '#166534',
              fontSize: 10,
              padding: '4px 8px',
              borderRadius: 14,
              fontFamily: theme.font.body,
              fontWeight: 600,
            }}>Unlocked</span>
          </div>
          <div style={{
            fontSize: 11,
            color: theme.colors.textMuted,
            fontFamily: theme.font.body,
            marginTop: 4,
          }}>Bewley's Café · redeem at the counter</div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
            <span style={{
              fontSize: 11,
              color: theme.colors.textMuted,
              fontFamily: theme.font.body,
            }}>500 pts</span>
            <button style={{
              background: theme.colors.text,
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '6px 8px',
              fontSize: 10,
              fontFamily: theme.font.body,
              fontWeight: 600,
              cursor: 'pointer',
            }}>Redeem →</button>
          </div>
        </div>

        {/* Card 2 — Locked */}
        <div style={{
          ...card2Anim,
          background: theme.colors.surface,
          borderRadius: 12,
          padding: 12,
          border: `1px solid ${theme.colors.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
              fontSize: 13,
              fontWeight: 700,
              color: theme.colors.text,
              fontFamily: theme.font.body,
            }}>Free class</span>
            <span style={{
              background: '#F3F4F6',
              color: theme.colors.textMuted,
              fontSize: 10,
              padding: '4px 8px',
              borderRadius: 14,
              fontFamily: theme.font.body,
              fontWeight: 600,
            }}>Locked</span>
          </div>
          <div style={{
            fontSize: 11,
            color: theme.colors.textMuted,
            fontFamily: theme.font.body,
            marginTop: 4,
          }}>The Foundry Gym · 200 pts to go</div>
          {/* Progress bar */}
          <div style={{
            width: '100%',
            height: 4,
            background: '#E5E7EB',
            borderRadius: 6,
            marginTop: 10,
          }}>
            <div style={{
              width: '60%',
              height: '100%',
              background: theme.colors.text,
              borderRadius: 6,
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Step 1 — Confirm redemption ─────────────────────────────────────────────

const Step1Screen: React.FC<{ stepFrame: number }> = ({ stepFrame }) => {
  const modalAnim = stepFadeUp(stepFrame, 5, 24);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      background: theme.colors.bg,
      padding: 18,
      boxSizing: 'border-box',
    }}>
      <AppHeader title="TAPID" points="1,288 pts" />

      {/* Modal card */}
      <div style={{
        ...modalAnim,
        background: theme.colors.surface,
        border: `1.5px solid ${theme.colors.border}`,
        borderRadius: 16,
        padding: 20,
        marginTop: 12,
      }}>
        {/* Coffee emoji */}
        <div style={{ textAlign: 'center', fontSize: 28 }}>☕</div>

        <div style={{
          fontSize: 14,
          fontWeight: 700,
          textAlign: 'center',
          marginTop: 8,
          color: theme.colors.text,
          fontFamily: theme.font.display,
        }}>Redeem reward</div>
        <div style={{
          fontSize: 12,
          color: theme.colors.textMuted,
          textAlign: 'center',
          fontFamily: theme.font.body,
          marginTop: 2,
        }}>Free coffee</div>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${theme.colors.border}`, margin: '12px 0' }} />

        {/* Detail rows */}
        {[
          { label: 'Merchant', value: "Bewley's Café", valueStyle: {} },
          { label: 'Points used', value: '−500 pts', valueStyle: { color: '#A32D2D' } },
          { label: 'Remaining', value: '788 pts', valueStyle: {} },
        ].map(({ label, value, valueStyle }) => (
          <div key={label} style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 0',
            fontSize: 11,
            fontFamily: theme.font.body,
            color: theme.colors.textMuted,
          }}>
            <span>{label}</span>
            <span style={{ fontWeight: 700, color: theme.colors.text, ...valueStyle }}>{value}</span>
          </div>
        ))}

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${theme.colors.border}`, margin: '12px 0' }} />

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
          <button style={{
            width: '100%',
            background: theme.colors.text,
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '12px 0',
            fontSize: 12,
            fontWeight: 700,
            fontFamily: theme.font.body,
            cursor: 'pointer',
            boxSizing: 'border-box',
          }}>Confirm redemption</button>
          <button style={{
            width: '100%',
            background: 'transparent',
            color: theme.colors.textMuted,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 10,
            padding: '12px 0',
            fontSize: 12,
            fontFamily: theme.font.body,
            cursor: 'pointer',
            boxSizing: 'border-box',
          }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// ─── Step 2 — QR code ────────────────────────────────────────────────────────

const Step2Screen: React.FC<{ stepFrame: number }> = ({ stepFrame }) => {
  const scaleVal = interpolate(stepFrame, [0, 15], [0.8, 1], { extrapolateRight: 'clamp' });
  const opacityVal = interpolate(stepFrame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  const totalSecs = 298 - Math.floor(stepFrame / 30);
  const mins = Math.floor(Math.max(0, totalSecs) / 60);
  const secs = Math.max(0, totalSecs) % 60;
  const countdown = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      background: '#1C1A17',
    }}>
      <AppHeader title="TAPID" dark={true} />

      {/* Centered content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
      }}>
        <div style={{
          opacity: opacityVal,
          transform: `scale(${scaleVal})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}>
          <div style={{ fontSize: 11, color: '#D6D3D1', fontFamily: theme.font.body, textAlign: 'center' }}>
            Show this to staff
          </div>

          {/* QR placeholder */}
          <div style={{
            width: 120,
            height: 120,
            background: '#fff',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="90" height="90" viewBox="0 0 90 90">
              {/* Corner squares */}
              <rect x="5" y="5" width="22" height="22" rx="3" fill="#111" />
              <rect x="63" y="5" width="22" height="22" rx="3" fill="#111" />
              <rect x="5" y="63" width="22" height="22" rx="3" fill="#111" />
              {/* Inner dots */}
              <rect x="10" y="10" width="12" height="12" rx="2" fill="white" />
              <rect x="68" y="10" width="12" height="12" rx="2" fill="white" />
              <rect x="10" y="68" width="12" height="12" rx="2" fill="white" />
              {/* Random data dots */}
              <rect x="34" y="5" width="6" height="6" fill="#111" />
              <rect x="42" y="5" width="6" height="6" fill="#111" />
              <rect x="34" y="13" width="6" height="6" fill="#111" />
              <rect x="50" y="13" width="6" height="6" fill="#111" />
              <rect x="34" y="34" width="6" height="6" fill="#111" />
              <rect x="42" y="42" width="6" height="6" fill="#111" />
              <rect x="50" y="34" width="6" height="6" fill="#111" />
              <rect x="34" y="50" width="6" height="6" fill="#111" />
              <rect x="5" y="34" width="6" height="6" fill="#111" />
              <rect x="13" y="42" width="6" height="6" fill="#111" />
              <rect x="5" y="50" width="6" height="6" fill="#111" />
            </svg>
          </div>

          <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#fff',
            fontFamily: theme.font.display,
            textAlign: 'center',
          }}>Bewley's Café</div>

          <div style={{
            fontSize: 11,
            color: '#D6D3D1',
            fontFamily: theme.font.body,
            textAlign: 'center',
          }}>Free coffee · 1 use</div>

          {/* Countdown */}
          <div style={{
            fontSize: 12,
            color: '#EF9F27',
            fontFamily: theme.font.body,
            fontVariantNumeric: 'tabular-nums',
            textAlign: 'center',
          }}>Expires in {countdown}</div>
        </div>
      </div>
    </div>
  );
};

// ─── Step 3 — Redeemed ───────────────────────────────────────────────────────

const Step3Screen: React.FC<{ stepFrame: number }> = ({ stepFrame }) => {
  const CIRC = 175.9;
  const circleP = interpolate(stepFrame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const checkP = interpolate(stepFrame, [8, 22], [0, 1], { extrapolateRight: 'clamp' });
  const textOpacity = interpolate(stepFrame, [18, 28], [0, 1], { extrapolateRight: 'clamp' });

  const balanceAnim = stepFadeUp(stepFrame, 20, 20);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      background: theme.colors.bg,
    }}>
      <AppHeader title="TAPID" points="788 pts" />

      {/* Centered content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: 18,
        boxSizing: 'border-box',
      }}>
        {/* Animated checkmark circle */}
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle
            cx="30" cy="30" r="28"
            fill="none"
            stroke="#3a9a5c"
            strokeWidth="2"
            strokeDasharray={CIRC}
            strokeDashoffset={(1 - circleP) * CIRC}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '30px 30px' }}
          />
          <path
            d="M18 30 L26 38 L42 22"
            fill="none"
            stroke="#3a9a5c"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="30"
            strokeDashoffset={(1 - checkP) * 30}
          />
        </svg>

        <div style={{ opacity: textOpacity, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{
            fontSize: 14,
            fontWeight: 700,
            color: theme.colors.text,
            fontFamily: theme.font.display,
            textAlign: 'center',
          }}>Redeemed</div>
          <div style={{
            fontSize: 11,
            color: theme.colors.textMuted,
            fontFamily: theme.font.body,
            textAlign: 'center',
          }}>Free coffee · Bewley's Café</div>
          <div style={{
            fontSize: 10,
            color: theme.colors.textMuted,
            fontFamily: theme.font.body,
            textAlign: 'center',
          }}>Today at 11:42am</div>
        </div>

        {/* Balance card */}
        <div style={{
          ...balanceAnim,
          background: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: 12,
          padding: 14,
          width: '100%',
          boxSizing: 'border-box',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12,
            fontFamily: theme.font.body,
            color: theme.colors.textMuted,
            marginBottom: 8,
          }}>
            <span>Points spent</span>
            <span style={{ color: '#A32D2D', fontWeight: 600 }}>−500 pts</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 13,
            fontFamily: theme.font.body,
            color: theme.colors.text,
            fontWeight: 700,
          }}>
            <span>New balance</span>
            <span>788 pts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Step 4 — Home updated ───────────────────────────────────────────────────

const Step4Screen: React.FC<{ stepFrame: number }> = ({ stepFrame }) => {
  const card1Anim = stepFadeUp(stepFrame, 5, 20);
  const card2AnimBase = stepFadeUp(stepFrame, 12, 20);
  const card2Anim = {
    ...card2AnimBase,
    opacity: card2AnimBase.opacity * 0.5,
  };

  const pulse = interpolate(stepFrame, [0, 5, 10, 15], [1, 1.18, 1, 1], { extrapolateRight: 'clamp' });

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      background: theme.colors.bg,
    }}>
      {/* Header with pulsing badge — rendered manually so we can apply pulse */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '48px 18px 10px',
        flexShrink: 0,
      }}>
        <div style={{
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: theme.colors.text,
          fontFamily: theme.font.display,
        }}>TAPID</div>
        <div style={{
          background: theme.colors.text,
          color: '#fff',
          borderRadius: 20,
          padding: '4px 10px',
          fontSize: 12,
          fontWeight: 600,
          fontFamily: theme.font.body,
          transform: `scale(${pulse})`,
          transformOrigin: 'center',
        }}>788 pts</div>
      </div>

      <SectionLabel>Your rewards</SectionLabel>

      {/* Cards area */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '0 12px',
        gap: 10,
      }}>
        {/* Card 1 — Bewley's now locked/reset */}
        <div>
          <div style={{
            ...card1Anim,
            background: theme.colors.surface,
            borderRadius: 12,
            padding: 12,
            border: `1px solid ${theme.colors.border}`,
            opacity: card1Anim.opacity * 0.5,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{
                fontSize: 13,
                fontWeight: 700,
                color: theme.colors.text,
                fontFamily: theme.font.body,
              }}>Free coffee</span>
              <span style={{
                background: '#F3F4F6',
                color: theme.colors.textMuted,
                fontSize: 10,
                padding: '4px 8px',
                borderRadius: 14,
                fontFamily: theme.font.body,
                fontWeight: 600,
              }}>Locked</span>
            </div>
            <div style={{
              fontSize: 11,
              color: theme.colors.textMuted,
              fontFamily: theme.font.body,
              marginTop: 4,
            }}>Bewley's Café · redeem at the counter</div>
            {/* Progress bar at 0% */}
            <div style={{
              width: '100%',
              height: 4,
              background: '#E5E7EB',
              borderRadius: 6,
              marginTop: 10,
            }}>
              <div style={{
                width: '0%',
                height: '100%',
                background: theme.colors.text,
                borderRadius: 6,
              }} />
            </div>
          </div>
          {/* Last redeemed label */}
          <div style={{
            fontSize: 10,
            color: theme.colors.textMuted,
            fontFamily: theme.font.body,
            padding: '4px 4px 0',
            opacity: card1Anim.opacity,
          }}>Last redeemed today</div>
        </div>

        {/* Card 2 — The Foundry Gym (unchanged) */}
        <div style={{
          ...card2Anim,
          background: theme.colors.surface,
          borderRadius: 12,
          padding: 12,
          border: `1px solid ${theme.colors.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
              fontSize: 13,
              fontWeight: 700,
              color: theme.colors.text,
              fontFamily: theme.font.body,
            }}>Free class</span>
            <span style={{
              background: '#F3F4F6',
              color: theme.colors.textMuted,
              fontSize: 10,
              padding: '4px 8px',
              borderRadius: 14,
              fontFamily: theme.font.body,
              fontWeight: 600,
            }}>Locked</span>
          </div>
          <div style={{
            fontSize: 11,
            color: theme.colors.textMuted,
            fontFamily: theme.font.body,
            marginTop: 4,
          }}>The Foundry Gym · 200 pts to go</div>
          <div style={{
            width: '100%',
            height: 4,
            background: '#E5E7EB',
            borderRadius: 6,
            marginTop: 10,
          }}>
            <div style={{
              width: '60%',
              height: '100%',
              background: theme.colors.text,
              borderRadius: 6,
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Step captions ────────────────────────────────────────────────────────────

const CAPTIONS = [
  "Sarah has enough points for a free coffee at Bewley's — the reward just unlocked automatically.",
  "Sarah taps Redeem — she sees exactly what she's spending and what she'll have left.",
  "A QR code appears instantly — Sarah shows it to the barista. No app account needed on the merchant side.",
  "The barista scans. The redemption is confirmed server-side and the points are deducted instantly.",
  "Balance updates everywhere instantly. The reward resets — Sarah starts earning toward her next free coffee.",
];

// ─── Main component ───────────────────────────────────────────────────────────

export const Demo2Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { step, stepFrame } = getStep(frame, 90, 5);

  const screenContent = (() => {
    switch (step) {
      case 0: return <Step0Screen stepFrame={stepFrame} />;
      case 1: return <Step1Screen stepFrame={stepFrame} />;
      case 2: return <Step2Screen stepFrame={stepFrame} />;
      case 3: return <Step3Screen stepFrame={stepFrame} />;
      case 4: return <Step4Screen stepFrame={stepFrame} />;
      default: return <Step0Screen stepFrame={stepFrame} />;
    }
  })();

  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        background: theme.colors.bg,
      }}>
        <PhoneShell
          caption={CAPTIONS[step]}
          currentStep={step}
          totalSteps={5}
        >
          {screenContent}
        </PhoneShell>
      </div>
    </AbsoluteFill>
  );
};
