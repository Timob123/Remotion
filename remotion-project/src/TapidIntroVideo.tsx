import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Poppins';

// ── Font ──────────────────────────────────────────────────────────────────────
const { fontFamily: POPPINS } = loadFont('normal', {
  weights: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

// ── Brand tokens ──────────────────────────────────────────────────────────────
const BG          = '#F8FAFC';
const INK         = '#0A0A0A';
const BODY        = '#0F172A';
const MUTED       = '#64748B';
const GREEN       = '#00A855';
const GREEN_LIGHT = '#F0FDF4';
const GREEN_BORDER = 'rgba(0,168,85,0.25)';
const BORDER      = '#E2E8F0';
const WHITE       = '#FFFFFF';

// ── Spring config (Tapid primary feel) ───────────────────────────────────────
const SP = { damping: 20, stiffness: 80, mass: 1 };
// Snappier for the dot pop
const SP_DOT = { damping: 12, stiffness: 100, mass: 1 };

// ── Timing (30fps · 450 frames = 15s) ────────────────────────────────────────
//  S1 — Logo reveal         0 → 90f
const S1_ICON_START = 0;
const S1_WORDMARK_START = 18;
const S1_WORDMARK_STAGGER = 4;   // frames per letter
const LOGO_LETTERS = ['T', 'a', 'p', 'i', 'd'];
const S1_WORDMARK_END = S1_WORDMARK_START + LOGO_LETTERS.length * S1_WORDMARK_STAGGER + 12;
const S1_DOT_START = S1_WORDMARK_END - 4;
const S1_TAGLINE_START = S1_DOT_START + 18;
const S1_DIVIDER_START = S1_TAGLINE_START + 14;

//  S2 — Section label + description    80 → 200f
const S2_LABEL_START = 90;
const S2_LINE_START  = 100;
const S2_BODY_START  = 116;

//  S3 — Stat callouts       190 → 330f
const S3_STAT1_START = 195;
const S3_STAT2_START = 222;
const S3_STAT3_START = 249;

//  S4 — Flow line + stat    310 → 390f
const S4_LINE_START  = 315;
const S4_LINE_END    = 345;
const S4_STAT_START  = 348;

//  S5 — CTA                 380 → 450f
const S5_URL_START   = 385;
const S5_DOT_START   = 402;

const FADE_OUT_START = 432;
const FADE_OUT_END   = 450;

// ── Safe zone ─────────────────────────────────────────────────────────────────
const SAFE = 80; // px inset

// ── Helpers ───────────────────────────────────────────────────────────────────
function useSp(delay: number, cfg = SP) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: Math.max(0, frame - delay), fps, config: cfg });
}

function fadeSlide(frame: number, start: number, dy = 16) {
  const op = interpolate(frame, [start, start + 14], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const ty = interpolate(frame, [start, start + 14], [dy, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return { opacity: op, transform: `translateY(${ty}px)` };
}

// ── Green dot (logo mark) ─────────────────────────────────────────────────────
const GreenDot: React.FC<{ delay: number; size: number }> = ({ delay, size }) => {
  const p = useSp(delay, SP_DOT);
  const scale = interpolate(p, [0, 0.7, 1], [0, 1.18, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const frame = useCurrentFrame();
  // Brief glow after pop
  const glowProgress = interpolate(frame, [delay + 8, delay + 28], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const glowOp = interpolate(glowProgress, [0, 0.4, 1], [0, 0.6, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <span style={{ display: 'inline-block', position: 'relative', marginLeft: 2, verticalAlign: 'baseline', marginBottom: size * 0.06 }}>
      {/* Glow */}
      <span style={{
        position: 'absolute',
        width: size * 2.5, height: size * 2.5,
        borderRadius: '50%',
        backgroundColor: GREEN,
        opacity: glowOp,
        top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        filter: 'blur(8px)',
        pointerEvents: 'none',
      }} />
      {/* Dot */}
      <span style={{
        display: 'inline-block',
        width: size, height: size,
        borderRadius: '50%',
        backgroundColor: GREEN,
        transform: `scale(${scale})`,
        verticalAlign: 'middle',
      }} />
    </span>
  );
};

// ── Wordmark letter ────────────────────────────────────────────────────────────
const WordmarkLetter: React.FC<{ ch: string; delay: number; fontSize: number }> = ({ ch, delay, fontSize }) => {
  const p = useSp(delay, SP);
  const ty = interpolate(p, [0, 1], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const op = interpolate(p, [0, 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <span style={{
      display: 'inline-block',
      fontFamily: POPPINS,
      fontSize,
      fontWeight: 700,
      color: INK,
      letterSpacing: '-1.5px',
      lineHeight: 1.2,
      opacity: op,
      transform: `translateY(${ty}px)`,
    }}>
      {ch}
    </span>
  );
};

// ── Stat callout card ──────────────────────────────────────────────────────────
const StatCallout: React.FC<{
  delay: number;
  number: string;
  label: string;
}> = ({ delay, number, label }) => {
  const p = useSp(delay, SP);
  const op = interpolate(p, [0, 0.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scale = interpolate(p, [0, 1], [0.92, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{
      opacity: op,
      transform: `scale(${scale})`,
      backgroundColor: GREEN_LIGHT,
      border: `1px solid ${GREEN_BORDER}`,
      borderRadius: 8,
      padding: '16px 20px',
      flex: 1,
    }}>
      <div style={{ fontFamily: POPPINS, fontSize: 22, fontWeight: 700, color: GREEN, lineHeight: 1.2 }}>
        {number}
      </div>
      <div style={{ fontFamily: POPPINS, fontSize: 9, fontWeight: 600, color: MUTED, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 6, lineHeight: 1.3 }}>
        {label}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// MAIN VIDEO
// ══════════════════════════════════════════════════════════════════════════════
export const TapidIntroVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Global fade out
  const globalOp = interpolate(frame, [FADE_OUT_START, FADE_OUT_END], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // S2 elements
  const s2LabelStyle = fadeSlide(frame, S2_LABEL_START);
  const s2BodyStyle  = fadeSlide(frame, S2_BODY_START);
  const dividerW = interpolate(frame, [S1_DIVIDER_START, S1_DIVIDER_START + 20], [0, 100], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const s2LineW = interpolate(frame, [S2_LINE_START, S2_LINE_START + 18], [0, 100], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // S4 flow line
  const flowLineW = interpolate(frame, [S4_LINE_START, S4_LINE_END], [0, 100], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const flowDotOp = interpolate(frame, [S4_LINE_END, S4_LINE_END + 8], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const s4StatStyle = fadeSlide(frame, S4_STAT_START);

  // Counted value for the flow stat
  const countedPct = Math.round(
    interpolate(frame, [S4_STAT_START, S4_STAT_START + 36], [0, 98], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      easing: Easing.out(Easing.ease),
    })
  );

  // S5 CTA
  const urlStyle = fadeSlide(frame, S5_URL_START, 24);

  // Tagline
  const taglineStyle = fadeSlide(frame, S1_TAGLINE_START);

  // Dot size = 22% of wordmark cap height
  const WORDMARK_SIZE = 80;
  const DOT_SIZE = Math.round(WORDMARK_SIZE * 0.22);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <div style={{ opacity: globalOp, position: 'absolute', inset: 0 }}>

        {/* ── MAIN CONTENT COLUMN ── */}
        <div style={{
          position: 'absolute',
          inset: 0,
          paddingLeft: SAFE,
          paddingRight: SAFE,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>

          {/* ─ S1: Logo ─ */}
          <div style={{ marginBottom: 40 }}>
            {/* Icon mark */}
            {(() => {
              const iconP = spring({ frame: Math.max(0, frame - S1_ICON_START), fps, config: SP_DOT });
              const iconScale = interpolate(iconP, [0, 0.7, 1], [0, 1.08, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              const iconOp = interpolate(iconP, [0, 0.3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              return (
                <div style={{ marginBottom: 24, opacity: iconOp, transform: `scale(${iconScale})`, transformOrigin: 'left center' }}>
                  <Img src={staticFile('assets/Tapid1024.png')} style={{ width: 72, height: 72 }} />
                </div>
              );
            })()}
            {/* Wordmark */}
            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 8 }}>
              {LOGO_LETTERS.map((ch, i) => (
                <WordmarkLetter
                  key={i}
                  ch={ch}
                  delay={S1_WORDMARK_START + i * S1_WORDMARK_STAGGER}
                  fontSize={WORDMARK_SIZE}
                />
              ))}
              <GreenDot delay={S1_DOT_START} size={DOT_SIZE} />
            </div>

            {/* Divider under logo */}
            <div style={{ height: 1, backgroundColor: BORDER, width: `${dividerW}%` }} />

            {/* Tagline */}
            <div style={{ ...taglineStyle, marginTop: 16 }}>
              <span style={{ fontFamily: POPPINS, fontSize: 18, fontWeight: 500, color: MUTED, letterSpacing: '-0.3px' }}>
                Set up once. Run forever.
              </span>
            </div>
          </div>

          {/* ─ S2: Section label + description ─ */}
          <div style={{ marginBottom: 48 }}>
            {/* Section label */}
            <div style={{ ...s2LabelStyle, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ fontFamily: POPPINS, fontSize: 9, fontWeight: 700, color: GREEN, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Spend Rewards Infrastructure
              </span>
            </div>
            {/* Rule */}
            <div style={{ height: 1, backgroundColor: BORDER, width: `${s2LineW}%`, marginBottom: 20 }} />
            {/* Body */}
            <div style={s2BodyStyle}>
              <p style={{ fontFamily: POPPINS, fontSize: 14, fontWeight: 400, color: BODY, lineHeight: 1.6, margin: 0 }}>
                Every payment detected automatically.<br />
                Zero effort from your staff.<br />
                Built for independent businesses.
              </p>
            </div>
          </div>

          {/* ─ S3: Stat callouts ─ */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 48 }}>
            <StatCallout delay={S3_STAT1_START} number="98%" label="Payments detected automatically" />
            <StatCallout delay={S3_STAT2_START} number="€0" label="Scanning hardware required" />
            <StatCallout delay={S3_STAT3_START} number="5 min" label="Time to go live" />
          </div>

          {/* ─ S4: Flow animation + counted stat ─ */}
          <div style={{ marginBottom: 56 }}>
            {/* Flow line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 20 }}>
              <div style={{ height: 2, width: `${flowLineW}%`, backgroundColor: GREEN, opacity: 0.6, borderRadius: 1 }} />
              {flowDotOp > 0 && (
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  backgroundColor: GREEN,
                  opacity: flowDotOp,
                  flexShrink: 0,
                  boxShadow: `0 0 8px ${GREEN}`,
                }} />
              )}
            </div>
            {/* Stat */}
            <div style={s4StatStyle}>
              <div style={{ fontFamily: POPPINS, fontSize: 48, fontWeight: 700, color: GREEN, letterSpacing: '-1px', lineHeight: 1 }}>
                {countedPct}%
              </div>
              <div style={{ fontFamily: POPPINS, fontSize: 10, fontWeight: 600, color: MUTED, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 8 }}>
                of payments detected — no scanning, no tapping
              </div>
            </div>
          </div>

          {/* ─ S5: CTA ─ */}
          <div style={urlStyle}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: POPPINS, fontSize: 28, fontWeight: 700, color: INK, letterSpacing: '-1px', display: 'flex', alignItems: 'baseline', gap: 3 }}>
                tapid
                <span style={{ color: GREEN, fontSize: 28 }}>.</span>
                ie
              </div>
            </div>
            <div style={{ display: 'inline-block', backgroundColor: GREEN, borderRadius: 7, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}>
              <span style={{ fontFamily: POPPINS, fontSize: 13, fontWeight: 600, color: WHITE, letterSpacing: '0' }}>
                Start for free
              </span>
            </div>
          </div>

        </div>

        {/* ── BOTTOM FOOTER BAR ── */}
        <div style={{
          position: 'absolute',
          bottom: SAFE,
          left: SAFE,
          right: SAFE,
          opacity: interpolate(frame, [S5_URL_START + 10, S5_URL_START + 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <div style={{ height: 1, backgroundColor: BORDER, marginBottom: 16 }} />
          <div style={{ fontFamily: POPPINS, fontSize: 11, fontWeight: 500, color: MUTED }}>
            Tapid Ventures Limited · NovaUCD, Dublin · tapid.ie
          </div>
        </div>

      </div>
    </AbsoluteFill>
  );
};
