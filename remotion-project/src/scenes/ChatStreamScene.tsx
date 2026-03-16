import React from 'react';
import { AbsoluteFill, spring } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation, springFast } from '../hooks/useSceneAnimation';
import { ChatStreamSceneProps } from '../types';

const CHARS_PER_FRAME = 1.8;
const GAP_FRAMES = 18;

export const ChatStreamScene: React.FC<ChatStreamSceneProps> = ({ messages }) => {
  const { frame, fps } = useSceneAnimation();

  // ── timing ──────────────────────────────────────────────────────────────
  let frameAccum = 8;
  const visibleMessages = messages.map((msg) => {
    const startFrame = frameAccum;
    const charsVisible = Math.floor(Math.max(0, frame - startFrame) * CHARS_PER_FRAME);
    const visible = charsVisible > 0;
    const text = msg.content.slice(0, charsVisible);
    frameAccum += Math.ceil(msg.content.length / CHARS_PER_FRAME) + GAP_FRAMES;
    return {
      ...msg,
      text,
      visible,
      startFrame,
      isComplete: charsVisible >= msg.content.length,
    };
  });

  // ── window entrance ──────────────────────────────────────────────────────
  const windowSpring = spring({ frame: Math.max(0, frame - 0), fps, config: springFast });
  const windowOpacity = windowSpring;
  const windowY = (1 - windowSpring) * 28;

  // ── blinking cursor ──────────────────────────────────────────────────────
  const cursorOpacity = Math.sin(frame * 0.5) > 0 ? 1 : 0;

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
      {/* Chat window */}
      <div
        style={{
          width: 840,
          background: theme.colors.surface,
          borderRadius: theme.radii.lg,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: theme.shadowLg,
          overflow: 'hidden',
          opacity: windowOpacity,
          transform: `translateY(${windowY}px)`,
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 680,
        }}
      >
        {/* ── Window header ─────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '14px 20px',
            borderBottom: `1px solid ${theme.colors.border}`,
            background: theme.colors.surface,
            flexShrink: 0,
          }}
        >
          {/* Accent dot */}
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: theme.radii.full,
              background: theme.colors.accent,
              marginRight: 10,
              flexShrink: 0,
            }}
          />

          {/* Title */}
          <span
            style={{
              fontFamily: theme.font.display,
              fontWeight: theme.font.weights.semibold,
              fontSize: 16,
              color: theme.colors.text,
              flex: 1,
              letterSpacing: '-0.01em',
            }}
          >
            AI Assistant
          </span>

          {/* Status dots */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {['#F87171', '#FBBF24', '#34D399'].map((color, i) => (
              <div
                key={i}
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: theme.radii.full,
                  background: color,
                  opacity: 0.8,
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Messages list ─────────────────────────────────────────── */}
        <div
          style={{
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            overflowY: 'hidden',
            flex: 1,
          }}
        >
          {visibleMessages.map((msg, index) => {
            if (!msg.visible) return null;

            const isUser = msg.role === 'user';
            const isTyping = !msg.isComplete;

            // Per-message slide-up spring
            const msgSpring = spring({
              frame: Math.max(0, frame - msg.startFrame),
              fps,
              config: springFast,
            });
            const msgY = (1 - msgSpring) * 15;
            const msgOpacity = msgSpring;

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: isUser ? 'row-reverse' : 'row',
                  alignItems: 'flex-end',
                  gap: 8,
                  opacity: msgOpacity,
                  transform: `translateY(${msgY}px)`,
                }}
              >
                {/* Assistant avatar */}
                {!isUser && (
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: theme.radii.full,
                      background: theme.colors.accentLight,
                      border: `1.5px solid ${theme.colors.accent}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      flexShrink: 0,
                      marginBottom: 2,
                    }}
                  >
                    🤖
                  </div>
                )}

                {/* Bubble */}
                <div
                  style={{
                    maxWidth: 560,
                    padding: '11px 16px',
                    borderRadius: isUser
                      ? '18px 18px 4px 18px'
                      : '18px 18px 18px 4px',
                    background: isUser ? '#111110' : '#F3F4F6',
                    color: isUser ? '#FFFFFF' : theme.colors.text,
                    fontFamily: theme.font.body,
                    fontSize: 15,
                    fontWeight: theme.font.weights.regular,
                    lineHeight: 1.55,
                    letterSpacing: '-0.005em',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.text}
                  {/* Blinking cursor while typing */}
                  {isTyping && (
                    <span
                      style={{
                        display: 'inline-block',
                        marginLeft: 1,
                        opacity: cursorOpacity,
                        color: isUser ? '#FFFFFF' : theme.colors.accent,
                        fontWeight: theme.font.weights.bold,
                      }}
                    >
                      ▌
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Input bar (decorative) ─────────────────────────────────── */}
        <div
          style={{
            borderTop: `1px solid ${theme.colors.border}`,
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 38,
              borderRadius: theme.radii.full,
              background: '#F9F8F6',
              border: `1px solid ${theme.colors.border}`,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 14,
            }}
          >
            <span
              style={{
                fontFamily: theme.font.body,
                fontSize: 14,
                color: theme.colors.textMuted,
              }}
            >
              Message AI Assistant…
            </span>
          </div>
          {/* Send button */}
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: theme.radii.full,
              background: theme.colors.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M14 8L2 2l2.5 6L2 14l12-6z"
                fill="#fff"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default ChatStreamScene;
