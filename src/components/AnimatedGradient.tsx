import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export const AnimatedGradient: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle glow that stays constant
  const glowIntensity = 0.3;

  return (
    <AbsoluteFill>
      {/* Base gradient - always visible */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(160deg, #000a15 0%, #001a33 25%, #002840 50%, #001a28 75%, #000a12 100%)',
        }}
      />

      {/* Radial center glow for depth */}
      <AbsoluteFill
        style={{
          opacity: glowIntensity,
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0, 60, 90, 0.5) 0%, rgba(0, 30, 50, 0.2) 40%, transparent 70%)',
        }}
      />

      {/* Vignette - subtle */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
