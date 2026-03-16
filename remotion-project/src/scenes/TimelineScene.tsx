import { AbsoluteFill, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation, springFast, springBounce } from '../hooks/useSceneAnimation';
import { TimelineSceneProps } from '../types';

const TIMELINE_WIDTH = 900;

export const TimelineScene: React.FC<TimelineSceneProps> = ({ title, milestones }) => {
  const { s, fadeIn, slideUp } = useSceneAnimation();

  // Title
  const titleOpacity = fadeIn(0, 14);
  const titleY = slideUp(0, 24);

  // Timeline line draws from left
  const lineSpring = s(8, springFast);
  const lineScaleX = interpolate(lineSpring, [0, 1], [0, 1]);

  // Nodes staggered — each node starts after line has begun drawing
  // Base delay 18, then +8 per node
  const nodeDelay = (i: number) => 18 + i * 10;
  const nodeSpring = (i: number) => s(nodeDelay(i), springBounce);
  const nodeScale = (i: number) => interpolate(nodeSpring(i), [0, 1], [0, 1]);
  const nodeOpacity = (i: number) => Math.min(1, nodeSpring(i) * 2);

  const count = milestones.length;

  // Distribute nodes evenly across TIMELINE_WIDTH
  // For n milestones: node i sits at position i / (n - 1) * TIMELINE_WIDTH
  // Edge case: single milestone → center
  const nodeX = (i: number): number => {
    if (count <= 1) return TIMELINE_WIDTH / 2;
    return (i / (count - 1)) * TIMELINE_WIDTH;
  };

  // Alternate labels: even indices → date above + label below; keep consistent
  // Design: date above, label + description below the line

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background decorative grid */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 60,
          width: 140,
          height: 140,
          backgroundImage: `radial-gradient(circle, ${theme.colors.border} 1.5px, transparent 1.5px)`,
          backgroundSize: '18px 18px',
          opacity: 0.45,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          right: 60,
          width: 140,
          height: 140,
          backgroundImage: `radial-gradient(circle, ${theme.colors.border} 1.5px, transparent 1.5px)`,
          backgroundSize: '18px 18px',
          opacity: 0.35,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {/* Title */}
        {title && (
          <div
            style={{
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              marginBottom: 72,
            }}
          >
            <h1
              style={{
                fontFamily: theme.font.display,
                fontSize: 40,
                fontWeight: theme.font.weights.bold,
                color: theme.colors.text,
                margin: 0,
                letterSpacing: '-0.5px',
                textAlign: 'center',
              }}
            >
              {title}
            </h1>
          </div>
        )}

        {/* Timeline container */}
        <div
          style={{
            position: 'relative',
            width: TIMELINE_WIDTH,
            // Total height: date label above (50px) + node (44px) + labels below (90px)
            height: 220,
          }}
        >
          {/* The horizontal line */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 72, // aligns with center of 44px node: date area ~50px + half node 22px = 72
              width: TIMELINE_WIDTH,
              height: 2,
              backgroundColor: theme.colors.text,
              transformOrigin: 'left center',
              transform: `scaleX(${lineScaleX})`,
            }}
          />

          {/* Nodes */}
          {milestones.map((milestone, i) => {
            const x = nodeX(i);
            const scale = nodeScale(i);
            const opacity = nodeOpacity(i);

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: x,
                  top: 0,
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: 150,
                }}
              >
                {/* Date — above the line */}
                <div
                  style={{
                    height: 44,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    paddingBottom: 6,
                    opacity,
                  }}
                >
                  {milestone.date && (
                    <span
                      style={{
                        fontFamily: theme.font.body,
                        fontSize: 12,
                        fontWeight: theme.font.weights.semibold,
                        color: theme.colors.accent,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        textAlign: 'center',
                        lineHeight: 1.2,
                      }}
                    >
                      {milestone.date}
                    </span>
                  )}
                </div>

                {/* Node circle — sits on the line */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    backgroundColor: theme.colors.surface,
                    border: `2.5px solid ${theme.colors.text}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `scale(${scale})`,
                    opacity,
                    boxShadow: theme.shadow,
                    flexShrink: 0,
                    zIndex: 1,
                  }}
                >
                  {/* Inner dot */}
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: theme.colors.accent,
                    }}
                  />
                </div>

                {/* Label + description — below the line */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    marginTop: 10,
                    opacity,
                  }}
                >
                  <span
                    style={{
                      fontFamily: theme.font.display,
                      fontSize: 16,
                      fontWeight: theme.font.weights.semibold,
                      color: theme.colors.text,
                      textAlign: 'center',
                      lineHeight: 1.25,
                      maxWidth: 130,
                    }}
                  >
                    {milestone.label}
                  </span>
                  {milestone.description && (
                    <span
                      style={{
                        fontFamily: theme.font.body,
                        fontSize: 13,
                        fontWeight: theme.font.weights.regular,
                        color: theme.colors.textMuted,
                        textAlign: 'center',
                        lineHeight: 1.45,
                        maxWidth: 130,
                      }}
                    >
                      {milestone.description}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
