import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const springFast = { mass: 1, stiffness: 200, damping: 20 };
export const springBounce = { mass: 1, stiffness: 180, damping: 14 };
export const springGentle = { mass: 1, stiffness: 120, damping: 18 };

export const useSceneAnimation = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = (delay = 0, config = springFast) =>
    spring({ frame: Math.max(0, frame - delay), fps, config });

  const staggeredSpring = (index: number, baseDelay = 0, config = springFast) =>
    spring({ frame: Math.max(0, frame - baseDelay - index * 5), fps, config });

  const fadeIn = (delay = 0, duration = 15) =>
    interpolate(frame, [delay, delay + duration], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  const slideUp = (delay = 0, distance = 40, config = springFast) => {
    const p = spring({ frame: Math.max(0, frame - delay), fps, config });
    return interpolate(p, [0, 1], [distance, 0]);
  };

  return { frame, fps, s, staggeredSpring, fadeIn, slideUp };
};
