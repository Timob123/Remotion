import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadSans } from "@remotion/google-fonts/DMSans";

// ── Fonts ──────────────────────────────────────────────────────────────────────
const { fontFamily: SERIF } = loadSerif();                // Instrument Serif (400 normal + italic)
const { fontFamily: SANS } = loadSans("normal", {        // DM Sans
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

// ── Design tokens — warm light mode ───────────────────────────────────────────
const BG         = "#F9F6F0";           // warm parchment
const INK        = "#1C1917";           // warm near-black
const INK_DIM    = "#78716C";           // warm-500
const INK_FAINT  = "rgba(28,25,23,0.18)";
const TERRA      = "#C96442";           // Claude terra cotta
const TERRA_PALE = "#F5E4DA";           // very light peach
const VIOLET     = "#7C5AC6";           // soft purple accent
const SUCCESS    = "#15803D";
const ERR        = "rgba(220,38,38,0.75)";
const CARD       = "rgba(255,255,255,0.80)";
const BORDER     = "rgba(28,25,23,0.08)";
const MONO       = "'SF Mono','Cascadia Code','Fira Code',monospace";

// ── Timing  (30 fps · 450 frames = 15 s) ─────────────────────────────────────
//  S1 — Brand intro    0 → 95f
const S1_BADGE   = 5;
const S1_LOGO_ST = 20;      // letters stagger +5f each
const S1_LINE    = 56;
const S1_H1      = 70;
const S1_H2      = 86;
const S1_OUT_S   = 76;
const S1_OUT_E   = 100;

//  S2 — The Problem    85 → 195f
const S2_IN_S    = 85;
const S2_IN_E    = 108;
const S2_HEAD    = 98;
const S2_SUB     = 116;
const S2_P1      = 130;
const S2_P2      = 152;
const S2_P3      = 174;
const S2_OUT_S   = 172;
const S2_OUT_E   = 198;

//  S3 — AI Demo    184 → 306f
const S3_IN_S    = 184;
const S3_IN_E    = 206;
const S3_HEAD    = 192;
const S3_BUBBLE  = 210;
const S3_TYPE_ST = 218;
const S3_QUERY   = "Book dinner at Nobu, Friday 8pm";   // 31 chars
const S3_TYPE_SP = 2;        // frames per char → 62f typing
const S3_TYPE_END = S3_TYPE_ST + S3_QUERY.length * S3_TYPE_SP;   // 280
const S3_PROC_ST  = S3_TYPE_END + 6;    // 286
const S3_PROC_DUR = 18;
const S3_CONFIRM  = S3_PROC_ST + S3_PROC_DUR;    // 304
const S3_OUT_S   = 288;
const S3_OUT_E   = 312;

//  S4 — Capabilities   300 → 394f
const S4_IN_S    = 300;
const S4_IN_E    = 322;
const S4_LABEL   = 312;
const S4_R1      = 328;
const S4_R2      = 352;
const S4_R3      = 376;
const S4_OUT_S   = 378;
const S4_OUT_E   = 400;

//  S5 — CTA    388 → 450f
const S5_IN_S    = 388;
const S5_IN_E    = 412;
const S5_URL     = 400;
const S5_TAG     = 420;
const S5_LINE    = 436;

const FADE_S = 436;
const FADE_E = 450;

// ── Core helpers ───────────────────────────────────────────────────────────────
function useSp(
  delay: number,
  cfg: { damping?: number; stiffness?: number; mass?: number } = {}
) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 200, ...cfg } });
}

function xFade(f: number, inR: [number, number], outR?: [number, number]) {
  const fi = interpolate(f, inR, [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  if (!outR) return fi;
  const fo = interpolate(f, outR, [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  return Math.min(fi, fo);
}

function up(p: number, d = 28) {
  return {
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [d, 0])}px)`,
  };
}

// ── Warm ambient wash (light mode aurora) ─────────────────────────────────────
const WarmWash: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const orbs = [
    { r: 900, cx: 50 + 12 * Math.sin(t * 0.18), cy: 42 + 10 * Math.cos(t * 0.14), c: "rgba(201,100,66,0.07)" },
    { r: 700, cx: 72 + 14 * Math.cos(t * 0.22), cy: 68 + 12 * Math.sin(t * 0.19), c: "rgba(124,90,198,0.05)" },
    { r: 600, cx: 28 + 10 * Math.sin(t * 0.16 + 1.2), cy: 24 + 14 * Math.cos(t * 0.21 + 0.6), c: "rgba(220,175,130,0.07)" },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {orbs.map((o, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: o.r, height: o.r,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${o.c} 0%, transparent 70%)`,
            left: `${o.cx}%`, top: `${o.cy}%`,
            transform: "translate(-50%,-50%)",
            filter: "blur(90px)",
            pointerEvents: "none",
          }}
        />
      ))}
    </div>
  );
};

// ── Subtle grain (multiply for light) ─────────────────────────────────────────
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 3) % 800;
  return (
    <svg
      style={{
        position: "absolute", inset: 0,
        mixBlendMode: "multiply",
        opacity: 0.035,
        pointerEvents: "none",
      }}
      width="100%" height="100%"
    >
      <filter id={`gr${seed}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="4" seed={seed} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#gr${seed})`} />
    </svg>
  );
};

// ── SVG line-draw ──────────────────────────────────────────────────────────────
const Line: React.FC<{ delay: number; len?: number; color?: string }> = ({
  delay, len = 240, color = TERRA,
}) => {
  const p = useSp(delay);
  const offset = interpolate(p, [0, 1], [len, 0]);
  return (
    <svg width={len} height={4} style={{ overflow: "visible" }}>
      <line
        x1={0} y1={2} x2={len} y2={2}
        stroke={color} strokeWidth={2} strokeLinecap="round"
        strokeDasharray={len} strokeDashoffset={offset}
      />
    </svg>
  );
};

// ── Clip-path reveal ──────────────────────────────────────────────────────────
const Rev: React.FC<{
  delay: number;
  children: React.ReactNode;
  from?: "bottom" | "left";
}> = ({ delay, children, from = "bottom" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const pct = interpolate(p, [0, 1], [100, 0]);
  const clip = from === "bottom"
    ? `inset(0 0 ${pct}% 0)`
    : `inset(0 ${pct}% 0 0)`;
  return (
    <div style={{ overflow: "hidden" }}>
      <div style={{ clipPath: clip }}>{children}</div>
    </div>
  );
};

// ── Per-letter 3D kinetic logo (Instrument Serif italic) ───────────────────────
const CHARS = ["t", "a", "p", "i", "d"];

const LogoLetter: React.FC<{ ch: string; delay: number; size: number }> = ({
  ch, delay, size,
}) => {
  const p = useSp(delay, { damping: 145, stiffness: 115 });
  return (
    <span
      style={{
        display: "inline-block",
        transform: `translateY(${interpolate(p, [0, 1], [size * 0.65, 0])}px) rotateX(${interpolate(p, [0, 1], [80, 0])}deg)`,
        transformOrigin: "50% 90%",
        opacity: interpolate(p, [0, 0.2], [0, 1], { extrapolateRight: "clamp" }),
        fontFamily: SERIF,
        fontStyle: "italic",
        fontSize: size,
        fontWeight: 400,
        color: INK,
        lineHeight: 1,
        letterSpacing: `${-size * 0.01}px`,
      }}
    >
      {ch}
    </span>
  );
};

const KineticLogo: React.FC<{ startDelay?: number; size?: number }> = ({
  startDelay = S1_LOGO_ST,
  size = 132,
}) => (
  <div style={{ display: "flex", perspective: "800px" }}>
    {CHARS.map((ch, i) => (
      <LogoLetter key={i} ch={ch} delay={startDelay + i * 5} size={size} />
    ))}
  </div>
);

// ── Terra pill badge ───────────────────────────────────────────────────────────
const Pill: React.FC<{ delay: number; children: React.ReactNode }> = ({
  delay, children,
}) => {
  const p = useSp(delay, { damping: 220 });
  return (
    <div
      style={{
        ...up(p, 14),
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 18px",
        borderRadius: 100,
        border: `1px solid rgba(201,100,66,0.40)`,
        background: TERRA_PALE,
        fontFamily: SANS,
        fontSize: 11,
        fontWeight: 700,
        color: TERRA,
        letterSpacing: "3.5px",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 1 — BRAND INTRO
// ═══════════════════════════════════════════════════════════════════════════════
const Scene1: React.FC = () => (
  <AbsoluteFill>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 32,
      }}
    >
      <Pill delay={S1_BADGE}>AI · Booking</Pill>

      <div style={{ marginBottom: 8 }}>
        <KineticLogo />
      </div>

      {/* Terra cotta line */}
      <Line delay={S1_LINE} len={260} />

      <Rev delay={S1_H1}>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 36,
            fontWeight: 600,
            color: INK,
            letterSpacing: "-0.6px",
            textAlign: "center",
          }}
        >
          AI Booking,
        </div>
      </Rev>
      <Rev delay={S1_H2}>
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 44,
            fontWeight: 400,
            color: TERRA,
            letterSpacing: "-0.5px",
            textAlign: "center",
          }}
        >
          Reimagined.
        </div>
      </Rev>
    </div>
  </AbsoluteFill>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 2 — THE PROBLEM
// ═══════════════════════════════════════════════════════════════════════════════

const StrikeItem: React.FC<{ delay: number; label: string }> = ({
  delay, label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const strike = spring({
    frame: frame - (delay + 20),
    fps,
    config: { damping: 200 },
  });

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        opacity: interpolate(appear, [0, 1], [0, 1]),
        transform: `translateX(${interpolate(appear, [0, 1], [-28, 0])}px)`,
      }}
    >
      <span
        style={{
          fontFamily: SANS,
          fontSize: 32,
          fontWeight: 600,
          color: INK_DIM,
          letterSpacing: "-0.4px",
        }}
      >
        {label}
      </span>
      <div
        style={{
          position: "absolute",
          top: "52%",
          left: -2,
          height: 2.5,
          width: `${interpolate(strike, [0, 1], [0, 107])}%`,
          background: ERR,
          borderRadius: 1,
          marginTop: -1,
        }}
      />
    </div>
  );
};

const Scene2: React.FC = () => (
  <AbsoluteFill>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
        padding: "0 72px",
      }}
    >
      <Rev delay={S2_HEAD}>
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 72,
            fontWeight: 400,
            color: INK,
            letterSpacing: "-1px",
            lineHeight: 0.95,
            marginBottom: 22,
          }}
        >
          Booking<br />is broken.
        </div>
      </Rev>

      <Rev delay={S2_SUB}>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 22,
            fontWeight: 500,
            color: INK_DIM,
            letterSpacing: "-0.2px",
            marginBottom: 56,
          }}
        >
          The old way costs you time.
        </div>
      </Rev>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <StrikeItem delay={S2_P1} label="On hold for 20 minutes" />
        <StrikeItem delay={S2_P2} label="Filling out endless forms" />
        <StrikeItem delay={S2_P3} label="Playing phone tag all day" />
      </div>
    </div>
  </AbsoluteFill>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 3 — AI DEMO
// ═══════════════════════════════════════════════════════════════════════════════

const ProcDots: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const pf = frame - startFrame;
  if (pf < 0 || pf >= S3_PROC_DUR) return null;
  return (
    <div style={{ display: "flex", gap: 9, alignItems: "center", height: 20 }}>
      {[0, 6, 12].map((off, i) => {
        const lf = pf - off;
        const cycle = lf > 0 ? Math.sin((lf / S3_PROC_DUR) * Math.PI * 3) : 0;
        const scale = interpolate(cycle, [-1, 1], [0.55, 1.35]);
        return (
          <div
            key={i}
            style={{
              width: 9, height: 9,
              borderRadius: "50%",
              background: TERRA,
              transform: `scale(${lf < 0 ? 0 : scale})`,
              opacity: lf < 0 ? 0 : 0.75,
            }}
          />
        );
      })}
    </div>
  );
};

const ConfirmedBadge: React.FC<{ delay: number }> = ({ delay }) => {
  const p = useSp(delay, { damping: 200, stiffness: 120 });
  return (
    <div
      style={{
        ...up(p, 18),
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 20px",
        borderRadius: 14,
        border: `1px solid rgba(21,128,61,0.25)`,
        background: "rgba(21,128,61,0.06)",
      }}
    >
      <div
        style={{
          width: 32, height: 32,
          borderRadius: "50%",
          background: SUCCESS,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          color: "#fff",
          flexShrink: 0,
          transform: `scale(${interpolate(p, [0, 1], [0, 1])})`,
        }}
      >
        ✓
      </div>
      <div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 20,
            fontWeight: 700,
            color: INK,
            letterSpacing: "-0.3px",
          }}
        >
          Reservation confirmed
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 13,
            color: SUCCESS,
            marginTop: 3,
          }}
        >
          Booked in 1.8 seconds
        </div>
      </div>
    </div>
  );
};

const DemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localType = frame - S3_TYPE_ST;
  const charsShown = Math.max(
    0,
    Math.min(S3_QUERY.length, Math.floor(localType / S3_TYPE_SP))
  );
  const typingDone = charsShown >= S3_QUERY.length;
  const cursorOn = !typingDone && localType >= 0 && Math.floor(localType / 12) % 2 === 0;
  const showDots = typingDone && frame >= S3_PROC_ST && frame < S3_CONFIRM;

  const bubbleP = spring({ frame: frame - S3_BUBBLE, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          padding: "0 64px",
          gap: 36,
        }}
      >
        {/* Headline */}
        <Rev delay={S3_HEAD}>
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 52,
              fontWeight: 400,
              color: INK,
              letterSpacing: "-0.8px",
              lineHeight: 1.08,
            }}
          >
            You ask.<br />
            <span style={{ color: TERRA }}>tapid</span> delivers.
          </div>
        </Rev>

        {/* Chat card */}
        <div
          style={{
            background: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: 28,
            padding: "32px",
            boxShadow: "0 8px 40px rgba(28,25,23,0.08)",
            ...up(bubbleP, 24),
          }}
        >
          <div
            style={{
              fontFamily: SANS,
              fontSize: 10,
              fontWeight: 700,
              color: TERRA,
              letterSpacing: "4px",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            tapid ai
          </div>

          {/* Typewriter query */}
          <div
            style={{
              fontFamily: MONO,
              fontSize: 22,
              color: INK,
              letterSpacing: "-0.2px",
              lineHeight: 1.5,
              minHeight: 66,
            }}
          >
            {localType >= 0 && (
              <>
                <span style={{ color: INK_FAINT }}>&gt; </span>
                {S3_QUERY.slice(0, charsShown)}
                {cursorOn && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 2,
                      height: "1em",
                      background: TERRA,
                      verticalAlign: "text-bottom",
                      marginLeft: 2,
                    }}
                  />
                )}
              </>
            )}
          </div>

          {showDots && <ProcDots startFrame={S3_PROC_ST} />}
          {frame >= S3_CONFIRM && <ConfirmedBadge delay={S3_CONFIRM} />}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 4 — CAPABILITIES
// ═══════════════════════════════════════════════════════════════════════════════

const StatRow: React.FC<{
  delay: number;
  stat: string;
  label: string;
  sub: string;
  isLast?: boolean;
}> = ({ delay, stat, label, sub, isLast }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const lp = spring({ frame: frame - (delay + 3), fps, config: { damping: 200 } });

  return (
    <div
      style={{
        opacity: interpolate(p, [0, 1], [0, 1]),
        transform: `translateX(${interpolate(p, [0, 1], [-40, 0])}px)`,
        paddingTop: 36,
        paddingBottom: isLast ? 0 : 36,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0, left: 0,
          height: 1,
          width: `${interpolate(lp, [0, 1], [0, 100])}%`,
          background: INK_FAINT,
        }}
      />
      <div
        style={{
          fontFamily: SANS,
          fontSize: 12,
          fontWeight: 700,
          color: TERRA,
          letterSpacing: "4px",
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        {stat}
      </div>
      <div
        style={{
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: 62,
          fontWeight: 400,
          color: INK,
          letterSpacing: "-0.5px",
          lineHeight: 0.9,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontSize: 20,
          fontWeight: 500,
          color: INK_DIM,
          marginTop: 12,
          letterSpacing: "-0.1px",
        }}
      >
        {sub}
      </div>
    </div>
  );
};

const Scene4: React.FC = () => (
  <AbsoluteFill>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
        padding: "0 72px",
      }}
    >
      <Rev delay={S4_LABEL}>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 11,
            fontWeight: 700,
            color: TERRA,
            letterSpacing: "5px",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          tapid handles it all
        </div>
      </Rev>

      <StatRow delay={S4_R1} stat="47,000+" label="Restaurants" sub="Any cuisine. Any city. Instantly." />
      <StatRow delay={S4_R2} stat="12,000+" label="Hotels" sub="Room preferences remembered." />
      <StatRow delay={S4_R3} stat="180,000+" label="Appointments" sub="From GP to grooming, done." isLast />
    </div>
  </AbsoluteFill>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 5 — CTA
// ═══════════════════════════════════════════════════════════════════════════════

const CTAUrl: React.FC = () => {
  const p = useSp(S5_URL, { damping: 170, stiffness: 108 });
  return (
    <div
      style={{
        ...up(p, 52),
        fontFamily: SERIF,
        fontStyle: "italic",
        fontSize: 104,
        fontWeight: 400,
        color: INK,
        letterSpacing: "-1px",
        lineHeight: 1,
        textAlign: "center",
      }}
    >
      tapid<span style={{ color: TERRA }}>.</span>app
    </div>
  );
};

const Scene5: React.FC = () => (
  <AbsoluteFill>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 32,
      }}
    >
      <CTAUrl />

      <Rev delay={S5_TAG}>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 22,
            fontWeight: 500,
            color: INK_DIM,
            letterSpacing: "-0.2px",
            textAlign: "center",
          }}
        >
          Start booking smarter. Free to try.
        </div>
      </Rev>

      <Line delay={S5_LINE} len={180} />
    </div>
  </AbsoluteFill>
);

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export const TapidVideo2: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const s1 = xFade(frame, [0, 1], [S1_OUT_S, S1_OUT_E]);
  const s2 = xFade(frame, [S2_IN_S, S2_IN_E], [S2_OUT_S, S2_OUT_E]);
  const s3 = xFade(frame, [S3_IN_S, S3_IN_E], [S3_OUT_S, S3_OUT_E]);
  const s4 = xFade(frame, [S4_IN_S, S4_IN_E], [S4_OUT_S, S4_OUT_E]);
  const s5 = xFade(frame, [S5_IN_S, S5_IN_E]);

  const globalOpacity = interpolate(frame, [FADE_S, FADE_E], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      <div style={{ opacity: globalOpacity, position: "absolute", inset: 0 }}>
        <WarmWash />
        <Grain />

        <AbsoluteFill style={{ opacity: s1 }}><Scene1 /></AbsoluteFill>
        <AbsoluteFill style={{ opacity: s2 }}><Scene2 /></AbsoluteFill>
        <AbsoluteFill style={{ opacity: s3 }}><DemoScene /></AbsoluteFill>
        <AbsoluteFill style={{ opacity: s4 }}><Scene4 /></AbsoluteFill>
        <AbsoluteFill style={{ opacity: s5 }}><Scene5 /></AbsoluteFill>
      </div>
    </AbsoluteFill>
  );
};
