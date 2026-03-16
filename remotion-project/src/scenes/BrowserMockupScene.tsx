import React from 'react';
import { AbsoluteFill, Img } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation, springFast } from '../hooks/useSceneAnimation';
import { BrowserMockupSceneProps } from '../types';

export const BrowserMockupScene: React.FC<BrowserMockupSceneProps> = ({
  screenshotUrl,
  url,
  caption,
}) => {
  const { frame, s, fadeIn } = useSceneAnimation();

  // Frame spring: enters from y=80, springFast at delay 0
  const frameSpring = s(0, springFast);
  const frameY = (1 - frameSpring) * 80;
  const frameOpacity = frameSpring;

  // Idle float offset
  const floatY = Math.sin(frame / 45) * 5;

  // Caption fade at delay 20
  const captionOpacity = fadeIn(20, 15);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 60,
      }}
    >
      {/* Browser frame wrapper */}
      <div
        style={{
          transform: `translateY(${frameY + floatY}px)`,
          opacity: frameOpacity,
          width: '100%',
          maxWidth: 1050,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Browser frame */}
        <div
          style={{
            width: '100%',
            backgroundColor: theme.colors.surface,
            borderRadius: 22,
            boxShadow: '0 32px 80px rgba(0,0,0,0.14)',
            border: `1px solid ${theme.colors.border}`,
            overflow: 'hidden',
          }}
        >
          {/* Chrome bar */}
          <div
            style={{
              backgroundColor: '#F0EDE8',
              height: 44,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: 16,
              paddingRight: 16,
              gap: 8,
              flexShrink: 0,
            }}
          >
            {/* Traffic lights */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#FF5F57',
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#FEBC2E',
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#28C840',
                }}
              />
            </div>

            {/* URL bar */}
            {url && (
              <div
                style={{
                  flex: 1,
                  backgroundColor: theme.colors.surface,
                  borderRadius: 6,
                  paddingTop: 5,
                  paddingBottom: 5,
                  paddingLeft: 10,
                  paddingRight: 10,
                  marginLeft: 12,
                }}
              >
                <span
                  style={{
                    fontFamily: theme.font.body,
                    fontSize: 12,
                    color: theme.colors.textMuted,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'block',
                  }}
                >
                  {url}
                </span>
              </div>
            )}
          </div>

          {/* Screenshot */}
          <div style={{ width: '100%', display: 'block', lineHeight: 0 }}>
            <Img
              src={screenshotUrl}
              style={{
                width: '100%',
                display: 'block',
              }}
            />
          </div>
        </div>

        {/* Caption */}
        {caption && (
          <div
            style={{
              marginTop: 28,
              opacity: captionOpacity,
            }}
          >
            <span
              style={{
                fontFamily: theme.font.body,
                fontSize: 18,
                color: theme.colors.textMuted,
                textAlign: 'center',
                display: 'block',
              }}
            >
              {caption}
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
