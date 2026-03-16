import React from 'react';
import { AbsoluteFill, spring, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation, springFast, springGentle } from '../hooks/useSceneAnimation';
import { PromptToOutputSceneProps } from '../types';

const CHARS_PER_FRAME = 2.2;
const PROMPT_START = 8;

export const PromptToOutputScene: React.FC<PromptToOutputSceneProps> = ({ prompt, output }) => {
  const { frame, fps } = useSceneAnimation();

  // ── timing ──────────────────────────────────────────────────────────────
  const promptEnd = PROMPT_START + Math.ceil(prompt.length / CHARS_PER_FRAME);
  const thinkingStart = promptEnd + 4;
  const thinkingEnd = thinkingStart + 22;
  const outputStart = thinkingEnd + 4;

  const promptChars = Math.floor(Math.max(0, frame - PROMPT_START) * CHARS_PER_FRAME);
  const visiblePrompt = prompt.slice(0, promptChars);
  const promptIsTyping = promptChars < prompt.length;
  const promptDone = promptChars >= prompt.length;

  const showThinking = frame >= thinkingStart && frame < thinkingEnd;

  const outputChars = Math.floor(Math.max(0, frame - outputStart) * CHARS_PER_FRAME);
  const visibleOutput = output.slice(0, outputChars);
  const outputIsTyping = outputChars < output.length && frame >= outputStart;
  const showOutput = frame >= outputStart;

  // ── blinking cursor ──────────────────────────────────────────────────────
  const cursorOpacity = Math.sin(frame * 0.5) > 0 ? 1 : 0;

  // ── window entrance ──────────────────────────────────────────────────────
  const windowSpring = spring({ frame: Math.max(0, frame), fps, config: springFast });
  const windowOpacity = windowSpring;
  const windowY = (1 - windowSpring) * 30;

  // ── arrow appearance (when prompt is done) ───────────────────────────────
  const arrowSpring = spring({
    frame: Math.max(0, frame - promptEnd),
    fps,
    config: springFast,
  });
  const arrowOpacity = arrowSpring;
  const arrowY = (1 - arrowSpring) * 10;
  // Pulse scale when thinking
  const arrowPulse = showThinking
    ? 1 + Math.sin(frame * 0.35) * 0.08
    : 1;

  // ── output card entrance ──────────────────────────────────────────────────
  const outputCardSpring = spring({
    frame: Math.max(0, frame - (thinkingEnd - 6)),
    fps,
    config: springGentle,
  });
  const outputCardOpacity = outputCardSpring;
  const outputCardY = (1 - outputCardSpring) * 20;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bg,
        fontFamily: theme.font.body,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 880,
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          opacity: windowOpacity,
          transform: `translateY(${windowY}px)`,
        }}
      >
        {/* ── Prompt card ───────────────────────────────────────────── */}
        <div
          style={{
            background: theme.colors.surface,
            borderRadius: `${theme.radii.lg}px ${theme.radii.lg}px ${theme.radii.md}px ${theme.radii.md}px`,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadow,
            padding: '28px 32px',
          }}
        >
          {/* Label */}
          <div
            style={{
              fontFamily: theme.font.body,
              fontSize: 12,
              fontWeight: theme.font.weights.semibold,
              color: theme.colors.textMuted,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            Your Prompt
          </div>

          {/* Prompt text */}
          <div
            style={{
              fontFamily: theme.font.body,
              fontSize: 17,
              fontWeight: theme.font.weights.regular,
              color: theme.colors.text,
              lineHeight: 1.6,
              letterSpacing: '-0.01em',
              minHeight: 28,
            }}
          >
            {visiblePrompt}
            {promptIsTyping && (
              <span
                style={{
                  display: 'inline-block',
                  marginLeft: 1,
                  opacity: cursorOpacity,
                  color: theme.colors.accent,
                  fontWeight: theme.font.weights.bold,
                }}
              >
                ▌
              </span>
            )}
          </div>
        </div>

        {/* ── Arrow connector ───────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px 0',
            opacity: arrowOpacity,
            transform: `translateY(${arrowY}px) scale(${arrowPulse})`,
          }}
        >
          {/* Vertical stem */}
          <div
            style={{
              width: 2,
              height: 18,
              background: promptDone ? theme.colors.accent : theme.colors.border,
              borderRadius: 1,
              transition: 'background 0.3s',
              opacity: arrowOpacity,
            }}
          />
          {/* Chevron / arrowhead */}
          <svg
            width="22"
            height="14"
            viewBox="0 0 22 14"
            fill="none"
            style={{ marginTop: -1 }}
          >
            <path
              d="M1 1L11 12L21 1"
              stroke={promptDone ? theme.colors.accent : theme.colors.border}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* ── Output card ───────────────────────────────────────────── */}
        <div
          style={{
            background: '#F8F7FF',
            borderRadius: `${theme.radii.md}px ${theme.radii.md}px ${theme.radii.lg}px ${theme.radii.lg}px`,
            border: `1px solid ${theme.colors.border}`,
            borderLeft: `3px solid ${theme.colors.accent}`,
            boxShadow: theme.shadow,
            padding: '28px 32px',
            opacity: showThinking || showOutput ? outputCardOpacity : 0,
            transform: `translateY(${outputCardY}px)`,
            minHeight: 120,
          }}
        >
          {/* Label */}
          <div
            style={{
              fontFamily: theme.font.body,
              fontSize: 12,
              fontWeight: theme.font.weights.semibold,
              color: theme.colors.accent,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            AI Output
          </div>

          {/* Thinking dots */}
          {showThinking && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: theme.radii.full,
                      background: theme.colors.accent,
                      opacity: Math.sin(frame * 0.3 + i * 1.2) * 0.5 + 0.5,
                    }}
                  />
                ))}
              </div>
              <span
                style={{
                  fontFamily: theme.font.body,
                  fontSize: 14,
                  color: theme.colors.textMuted,
                  fontWeight: theme.font.weights.medium,
                  letterSpacing: '-0.005em',
                }}
              >
                Generating…
              </span>
            </div>
          )}

          {/* Output text */}
          {showOutput && (
            <div
              style={{
                fontFamily: theme.font.body,
                fontSize: 17,
                fontWeight: theme.font.weights.regular,
                color: theme.colors.text,
                lineHeight: 1.65,
                letterSpacing: '-0.01em',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {visibleOutput}
              {outputIsTyping && (
                <span
                  style={{
                    display: 'inline-block',
                    marginLeft: 1,
                    opacity: cursorOpacity,
                    color: theme.colors.accent,
                    fontWeight: theme.font.weights.bold,
                  }}
                >
                  ▌
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default PromptToOutputScene;
