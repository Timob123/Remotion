import React from 'react';
import { theme } from '../config/theme';

export const PHONE_WIDTH = 400;
export const PHONE_HEIGHT = 820;
export const PHONE_BORDER = 10;
export const SCREEN_WIDTH = PHONE_WIDTH - PHONE_BORDER * 2;
export const SCREEN_HEIGHT = PHONE_HEIGHT - PHONE_BORDER * 2;

type PhoneShellProps = {
  children: React.ReactNode;
  caption: string;
  currentStep: number;
  totalSteps: number;
};

export const PhoneShell: React.FC<PhoneShellProps> = ({
  children,
  caption,
  currentStep,
  totalSteps,
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 28,
    }}>
      {/* Phone shell */}
      <div style={{
        width: PHONE_WIDTH,
        height: PHONE_HEIGHT,
        background: '#1A1917',
        borderRadius: 52,
        padding: PHONE_BORDER,
        boxShadow: '0 40px 100px rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.06)',
        position: 'relative',
        flexShrink: 0,
      }}>
        {/* Dynamic island */}
        <div style={{
          position: 'absolute',
          top: PHONE_BORDER + 12,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 100,
          height: 28,
          background: '#1A1917',
          borderRadius: 20,
          zIndex: 10,
        }} />

        {/* Screen */}
        <div style={{
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          borderRadius: 42,
          overflow: 'hidden',
          position: 'relative',
          background: theme.colors.bg,
        }}>
          {children}
        </div>

        {/* Side buttons (decorative) */}
        <div style={{ position: 'absolute', left: -3, top: 140, width: 3, height: 40, background: '#333', borderRadius: '2px 0 0 2px' }} />
        <div style={{ position: 'absolute', left: -3, top: 192, width: 3, height: 60, background: '#333', borderRadius: '2px 0 0 2px' }} />
        <div style={{ position: 'absolute', left: -3, top: 264, width: 3, height: 60, background: '#333', borderRadius: '2px 0 0 2px' }} />
        <div style={{ position: 'absolute', right: -3, top: 200, width: 3, height: 80, background: '#333', borderRadius: '0 2px 2px 0' }} />
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} style={{
            width: i === currentStep ? 20 : 7,
            height: 7,
            borderRadius: 4,
            background: i === currentStep ? theme.colors.text : theme.colors.border,
            transition: 'none',
          }} />
        ))}
      </div>

      {/* Caption */}
      <div style={{
        maxWidth: 640,
        textAlign: 'center',
        fontSize: 15,
        color: theme.colors.textMuted,
        fontFamily: theme.font.body,
        fontWeight: 400,
        lineHeight: 1.55,
        paddingTop: 4,
      }}>
        {caption}
      </div>
    </div>
  );
};

// Shared screen layout helpers
export const AppHeader: React.FC<{
  title?: string;
  points?: string;
  dark?: boolean;
  subtitle?: string;
}> = ({ title = 'TAPID', points, dark = false, subtitle }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '48px 18px 10px',
    flexShrink: 0,
  }}>
    <div>
      <div style={{
        fontSize: 16,
        fontWeight: 700,
        letterSpacing: '0.08em',
        color: dark ? '#F5F4F2' : theme.colors.text,
        fontFamily: theme.font.display,
      }}>{title}</div>
      {subtitle && <div style={{ fontSize: 11, color: dark ? '#A8A29E' : theme.colors.textMuted, fontFamily: theme.font.body }}>{subtitle}</div>}
    </div>
    {points && (
      <div style={{
        background: dark ? '#292524' : theme.colors.text,
        color: dark ? '#F5F4F2' : '#fff',
        borderRadius: 20,
        padding: '4px 10px',
        fontSize: 12,
        fontWeight: 600,
        fontFamily: theme.font.body,
      }}>{points}</div>
    )}
  </div>
);

export const SectionLabel: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({ children, dark }) => (
  <div style={{
    fontSize: 11,
    fontWeight: 600,
    color: dark ? '#A8A29E' : theme.colors.textMuted,
    fontFamily: theme.font.body,
    padding: '4px 18px 8px',
    letterSpacing: '0.04em',
    flexShrink: 0,
  }}>{children}</div>
);

// Frame-based step utilities
export const getStep = (frame: number, framesPerStep: number, totalSteps: number) => {
  const step = Math.min(Math.floor(frame / framesPerStep), totalSteps - 1);
  const stepFrame = frame - step * framesPerStep;
  return { step, stepFrame };
};

// Fade-in from Y within a step
export const stepFadeUp = (stepFrame: number, delay = 0, distance = 20): { opacity: number; transform: string } => {
  const t = Math.min(1, Math.max(0, (stepFrame - delay) / 15));
  const eased = 1 - Math.pow(1 - t, 3);
  return {
    opacity: eased,
    transform: `translateY(${distance * (1 - eased)}px)`,
  };
};
