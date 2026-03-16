import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../config/theme';

// ── Timing constants ──────────────────────────────────────────────────────────
const PULSE_DURATION  = 24;
const PULSE_STAGGER   = 20;
const PULSE_COUNT     = 3;

// ── Visual constants ──────────────────────────────────────────────────────────
const NODE_SIZE        = 14;
const NODE_GLOW_SIZE   = 48;
const EDGE_STROKE      = 1.5;
const EDGE_BASE_OPACITY = 0.15;
const EDGE_ACTIVE_OP   = 0.9;
const NODE_BASE_OP     = 0.3;
const NODE_ACTIVE_OP   = 1;
const GLOW_BASE_OP     = 0;
const GLOW_ACTIVE_OP   = 0.35;
const CANVAS_W         = 700;
const CANVAS_H         = 400;

// ── Node positions (pixels within 700×400 canvas) ─────────────────────────────
const NODES = [
  { x: 60,  y: 200 },  // 0 input
  { x: 230, y: 80  },  // 1 hidden-top-left
  { x: 230, y: 200 },  // 2 hidden-mid-left
  { x: 230, y: 320 },  // 3 hidden-bot-left
  { x: 430, y: 130 },  // 4 hidden-top-right
  { x: 430, y: 270 },  // 5 hidden-bot-right
  { x: 600, y: 200 },  // 6 output
];

// ── Edges (pairs of node indices) ─────────────────────────────────────────────
const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3],
  [1, 4], [1, 5], [2, 4], [2, 5], [3, 4], [3, 5],
  [4, 6], [5, 6],
];

// ── Pulse paths (sequences of node indices) ───────────────────────────────────
const PULSE_PATHS = [
  [0, 2, 4, 6],
  [0, 1, 5, 6],
  [0, 3, 5, 6],
];

interface NeuralPulseSceneProps {
  dark?: boolean;
  bg?: string;
}

export const NeuralPulseScene: React.FC<NeuralPulseSceneProps> = ({
  dark = false,
  bg,
}) => {
  const frame = useCurrentFrame();

  const bgColor     = bg ?? (dark ? theme.colors.text : theme.colors.bg);
  const accentColor = theme.colors.accent;

  // Per-pulse progress (0 → 1)
  const pulseProgress = Array.from({ length: PULSE_COUNT }, (_, p) =>
    interpolate(
      frame,
      [p * PULSE_STAGGER, p * PULSE_STAGGER + PULSE_DURATION],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    ),
  );

  const nodeActiveOpacity = (nodeIdx: number): number => {
    for (let p = 0; p < PULSE_PATHS.length; p++) {
      const pathIdx = PULSE_PATHS[p].indexOf(nodeIdx);
      if (pathIdx < 0) continue;
      const fraction = pathIdx / (PULSE_PATHS[p].length - 1);
      if (pulseProgress[p] >= fraction - 0.1) return NODE_ACTIVE_OP;
    }
    return NODE_BASE_OP;
  };

  const edgeActiveOpacity = (a: number, b: number): number => {
    for (let p = 0; p < PULSE_PATHS.length; p++) {
      const path = PULSE_PATHS[p];
      const idx = path.indexOf(a);
      if (idx >= 0 && path[idx + 1] === b) {
        const fraction = idx / (path.length - 1);
        if (pulseProgress[p] >= fraction) return EDGE_ACTIVE_OP;
      }
    }
    return EDGE_BASE_OPACITY;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={CANVAS_W} height={CANVAS_H} viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}>

        {/* Edges */}
        {EDGES.map(([a, b], i) => {
          const na = NODES[a];
          const nb = NODES[b];
          const edgeOp = edgeActiveOpacity(a, b);
          return (
            <line
              key={i}
              x1={na.x} y1={na.y}
              x2={nb.x} y2={nb.y}
              stroke={accentColor}
              strokeWidth={EDGE_STROKE}
              opacity={edgeOp}
            />
          );
        })}

        {/* Nodes */}
        {NODES.map((node, i) => {
          const nodeOp = nodeActiveOpacity(i);
          const glowOp = nodeOp > NODE_BASE_OP ? GLOW_ACTIVE_OP : GLOW_BASE_OP;
          return (
            <g key={i}>
              {/* Glow */}
              <circle
                cx={node.x} cy={node.y}
                r={NODE_GLOW_SIZE / 2}
                fill={accentColor}
                opacity={glowOp}
              />
              {/* Node */}
              <circle
                cx={node.x} cy={node.y}
                r={NODE_SIZE / 2}
                fill={accentColor}
                opacity={nodeOp}
              />
            </g>
          );
        })}

      </svg>
    </AbsoluteFill>
  );
};
