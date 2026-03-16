import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { theme } from '../config/theme';
import { useSceneAnimation, springFast } from '../hooks/useSceneAnimation';
import { StepsSceneProps } from '../types';

export const StepsScene: React.FC<StepsSceneProps> = ({ title, steps }) => {
  const { s, fadeIn, slideUp } = useSceneAnimation();

  // Title animation
  const titleSpring = s(0, springFast);
  const titleOpacity = Math.min(1, titleSpring * 1.8);
  const titleY = slideUp(0, 30);

  // Per-step delays: step 0 at frame 12, step 1 at frame 32, step 2 at frame 52
  // Connector 0→1 draws during frames 22–32, connector 1→2 during 42–52
  const stepDelay = (i: number) => 12 + i * 20;
  const connectorDelay = (i: number) => 22 + i * 20; // between step i and i+1

  const stepSpring = (i: number) => s(stepDelay(i), springFast);
  const stepOpacity = (i: number) => Math.min(1, stepSpring(i) * 1.8);
  const stepY = (i: number) => interpolate(stepSpring(i), [0, 1], [36, 0]);
  const stepScale = (i: number) => interpolate(stepSpring(i), [0, 1], [0.88, 1]);

  const connectorSpring = (i: number) => s(connectorDelay(i), springFast);
  const connectorScaleX = (i: number) =>
    interpolate(connectorSpring(i), [0, 1], [0, 1]);
  const connectorOpacity = (i: number) =>
    Math.min(1, connectorSpring(i) * 2);

  const displaySteps = steps.slice(0, 3);
  // How many connectors we need (steps - 1, capped at 2 for 3 steps)
  const connectorCount = Math.max(0, displaySteps.length - 1);

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
      {/* Subtle background accent ring */}
      <div
        style={{
          position: 'absolute',
          width: 700,
          height: 700,
          borderRadius: '50%',
          border: `1px solid ${theme.colors.border}`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 1080,
          padding: '0 60px',
          gap: 0,
        }}
      >
        {/* Title */}
        {title && (
          <div
            style={{
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              marginBottom: 64,
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

        {/* Steps row with connectors */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: '100%',
            gap: 0,
          }}
        >
          {displaySteps.map((step, i) => (
            <React.Fragment key={i}>
              {/* Step column */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: 220,
                  flexShrink: 0,
                  opacity: stepOpacity(i),
                  transform: `translateY(${stepY(i)}px) scale(${stepScale(i)})`,
                }}
              >
                {/* Number circle */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    backgroundColor: theme.colors.text,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 22,
                    boxShadow: theme.shadowLg,
                  }}
                >
                  <span
                    style={{
                      fontFamily: theme.font.display,
                      fontSize: 22,
                      fontWeight: theme.font.weights.bold,
                      color: '#FFFFFF',
                      lineHeight: 1,
                    }}
                  >
                    {i + 1}
                  </span>
                </div>

                {/* Step title */}
                <h3
                  style={{
                    fontFamily: theme.font.display,
                    fontSize: 22,
                    fontWeight: theme.font.weights.semibold,
                    color: theme.colors.text,
                    margin: '0 0 12px 0',
                    textAlign: 'center',
                    letterSpacing: '-0.2px',
                    lineHeight: 1.25,
                  }}
                >
                  {step.title}
                </h3>

                {/* Step description */}
                <p
                  style={{
                    fontFamily: theme.font.body,
                    fontSize: 16,
                    fontWeight: theme.font.weights.regular,
                    color: theme.colors.textMuted,
                    margin: 0,
                    textAlign: 'center',
                    lineHeight: 1.6,
                    maxWidth: 180,
                  }}
                >
                  {step.description}
                </p>
              </div>

              {/* Connector between steps */}
              {i < connectorCount && (
                <div
                  style={{
                    flex: 1,
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 1,
                    minWidth: 40,
                    maxWidth: 120,
                    paddingBottom: 0,
                    // Align with the center of the step circles (which are 56px tall + 22px margin)
                    // The circles sit at the top of each column, so align to top of row + half circle
                    alignSelf: 'flex-start',
                    marginTop: 27, // half of 56px circle to vertically center
                    position: 'relative',
                  }}
                >
                  {/* Dashed connector line */}
                  <div
                    style={{
                      width: '100%',
                      height: 2,
                      position: 'relative',
                      overflow: 'hidden',
                      transformOrigin: 'left center',
                      transform: `scaleX(${connectorScaleX(i)})`,
                      opacity: connectorOpacity(i),
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `repeating-linear-gradient(
                          to right,
                          ${theme.colors.border} 0px,
                          ${theme.colors.border} 8px,
                          transparent 8px,
                          transparent 16px
                        )`,
                      }}
                    />
                  </div>

                  {/* Arrow tip */}
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 0,
                      height: 0,
                      borderTop: '5px solid transparent',
                      borderBottom: '5px solid transparent',
                      borderLeft: `7px solid ${theme.colors.border}`,
                      opacity: connectorOpacity(i),
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
