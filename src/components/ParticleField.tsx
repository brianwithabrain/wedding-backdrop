import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { generateParticles } from '../utils/particleGenerator';
import { twinkle } from '../utils/animations';
import { PARTICLE_COUNT_SPARSE, LOOP_FADE_START, TOTAL_DURATION } from '../utils/constants';

export const ParticleField: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const particles = useMemo(
    () => generateParticles(PARTICLE_COUNT_SPARSE, width, height, 42),
    [width, height],
  );

  // Global particle field opacity: fade in at start, fade out for loop
  const fieldOpacity = interpolate(
    frame,
    [0, 40, LOOP_FADE_START, TOTAL_DURATION],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill style={{ opacity: fieldOpacity }}>
      {particles.map((p) => {
        const twinkleVal = twinkle(frame, p.twinkleSpeed, p.twinklePhase);
        const opacity = p.baseOpacity * twinkleVal;

        // Gentle drift movement
        const driftX =
          Math.sin(((frame * p.driftSpeedX + p.twinklePhase) * Math.PI) / 180) *
          p.driftAmplitude;
        const driftY =
          Math.cos(((frame * p.driftSpeedY + p.twinklePhase * 0.7) * Math.PI) / 180) *
          p.driftAmplitude * 0.6;

        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: p.x + driftX,
              top: p.y + driftY,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: p.color,
              opacity,
              boxShadow:
                p.color === '#00D4FF'
                  ? `0 0 ${p.size * 3}px ${p.size * 1.2}px rgba(0, 212, 255, 0.35)`
                  : `0 0 ${p.size * 2}px ${p.size * 0.8}px rgba(255, 255, 255, 0.25)`,
              filter: p.blur > 0 ? `blur(${p.blur}px)` : undefined,
              pointerEvents: 'none',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
