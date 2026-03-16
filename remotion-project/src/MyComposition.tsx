import {AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig, Easing, random} from 'remotion';

// Generate star positions (consistent across frames)
const generateStars = (count: number, seed: number) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const x = random(`star-x-${i}-${seed}`) * 100;
    const y = random(`star-y-${i}-${seed}`) * 100;
    const size = random(`star-size-${i}-${seed}`) * 3 + 1;
    const opacity = random(`star-opacity-${i}-${seed}`) * 0.8 + 0.2;
    const twinkleSpeed = random(`star-speed-${i}-${seed}`) * 0.02 + 0.01;
    stars.push({x, y, size, opacity, twinkleSpeed});
  }
  return stars;
};

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, width, height} = useVideoConfig();
  const stars = generateStars(150, 1);

  // Animated cosmic background gradient
  const gradientRotation = frame * 0.2;
  const gradientOpacity = interpolate(
    frame,
    [0, 30, durationInFrames - 30, durationInFrames],
    [0, 1, 1, 0],
    {easing: Easing.ease}
  );

  // Main title animation
  const titleOpacity = interpolate(
    frame,
    [30, 60, durationInFrames - 60, durationInFrames - 30],
    [0, 1, 1, 0],
    {easing: Easing.ease}
  );

  const titleScale = interpolate(
    frame,
    [30, 60],
    [0.7, 1],
    {easing: Easing.out(Easing.back(1.2))}
  );

  const titleY = interpolate(
    frame,
    [30, 60],
    [80, 0],
    {easing: Easing.out(Easing.cubic)}
  );

  const titleGlow = interpolate(
    frame,
    [30, 60, durationInFrames - 60, durationInFrames - 30],
    [0, 1, 1, 0],
    {easing: Easing.ease}
  );

  // Subtitle animation
  const subtitleOpacity = interpolate(
    frame,
    [70, 100, durationInFrames - 60, durationInFrames - 30],
    [0, 1, 1, 0],
    {easing: Easing.ease}
  );

  const subtitleY = interpolate(
    frame,
    [70, 100],
    [40, 0],
    {easing: Easing.out(Easing.cubic)}
  );

  // Particle effects
  const particleCount = 20;
  const particles = Array.from({length: particleCount}, (_, i) => {
    const progress = (frame + i * 5) % durationInFrames;
    const x = interpolate(
      progress,
      [0, durationInFrames],
      [random(`particle-x-${i}`) * width, random(`particle-x2-${i}`) * width],
      {easing: Easing.linear}
    );
    const y = interpolate(
      progress,
      [0, durationInFrames],
      [random(`particle-y-${i}`) * height, random(`particle-y2-${i}`) * height],
      {easing: Easing.linear}
    );
    const size = random(`particle-size-${i}`) * 4 + 2;
    const opacity = interpolate(
      progress,
      [0, durationInFrames * 0.3, durationInFrames * 0.7, durationInFrames],
      [0, 1, 1, 0],
      {easing: Easing.ease}
    );
    return {x, y, size, opacity};
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000011',
        overflow: 'hidden',
      }}
    >
      {/* Cosmic gradient background */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${gradientRotation}deg, 
            rgba(15, 23, 42, ${gradientOpacity}) 0%, 
            rgba(30, 41, 59, ${gradientOpacity * 0.8}) 25%,
            rgba(51, 65, 85, ${gradientOpacity * 0.6}) 50%,
            rgba(30, 41, 59, ${gradientOpacity * 0.8}) 75%,
            rgba(15, 23, 42, ${gradientOpacity}) 100%)`,
          opacity: gradientOpacity,
        }}
      />

      {/* Animated stars */}
      {stars.map((star, i) => {
        const twinkle = Math.sin(frame * star.twinkleSpeed) * 0.3 + 0.7;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              opacity: star.opacity * twinkle * gradientOpacity,
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.opacity * 0.5})`,
            }}
          />
        );
      })}

      {/* Floating particles */}
      {particles.map((particle, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(147, 197, 253, 0.8), rgba(59, 130, 246, 0.4))',
            opacity: particle.opacity * 0.6,
            filter: 'blur(1px)',
          }}
        />
      ))}

      {/* Nebula-like background effects */}
      <div
        style={{
          position: 'absolute',
          width: '60%',
          height: '60%',
          left: '20%',
          top: '20%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%)',
          opacity: gradientOpacity * 0.5,
          filter: 'blur(80px)',
          transform: `rotate(${frame * 0.1}deg)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '50%',
          height: '50%',
          right: '10%',
          bottom: '10%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent 70%)',
          opacity: gradientOpacity * 0.4,
          filter: 'blur(80px)',
          transform: `rotate(${-frame * 0.15}deg)`,
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 50,
          zIndex: 10,
        }}
      >
        {/* Main title with glow effect */}
        <div
          style={{
            fontSize: 140,
            fontWeight: 800,
            color: '#ffffff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            letterSpacing: '-0.03em',
            opacity: titleOpacity,
            transform: `scale(${titleScale}) translateY(${titleY}px)`,
            textAlign: 'center',
            textShadow: `
              0 0 20px rgba(147, 197, 253, ${titleGlow * 0.8}),
              0 0 40px rgba(99, 102, 241, ${titleGlow * 0.6}),
              0 0 60px rgba(139, 92, 246, ${titleGlow * 0.4}),
              0 4px 20px rgba(0, 0, 0, 0.5)
            `,
          }}
        >
          Stargazer
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 300,
            color: 'rgba(255, 255, 255, 0.9)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            letterSpacing: '0.05em',
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            textAlign: 'center',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
          }}
        >
          Exploring the cosmos of creativity
        </div>
      </div>
    </AbsoluteFill>
  );
};
