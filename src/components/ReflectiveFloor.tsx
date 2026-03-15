import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { generateFloorDust } from '../utils/particleGenerator';
import { FLOOR_DUST_COUNT } from '../utils/constants';

export const ReflectiveFloor: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const dustParticles = useMemo(
    () => generateFloorDust(FLOOR_DUST_COUNT, width, height, 99),
    [width, height],
  );

  return (
    <AbsoluteFill style={{ opacity: 1, pointerEvents: 'none' }}>
      {/* Subtle floor gradient */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          height: '35%',
          background:
            'linear-gradient(to top, rgba(0, 30, 60, 0.4) 0%, rgba(0, 40, 70, 0.2) 30%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle specular highlight */}
      <div
        style={{
          position: 'absolute',
          left: '20%',
          bottom: 0,
          width: '60%',
          height: '12%',
          background:
            'radial-gradient(ellipse 100% 50% at 50% 100%, rgba(0, 212, 255, 0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Dust particles */}
      {dustParticles.map((p) => {
        const twinkleVal = 0.5 + 0.5 * Math.sin(((frame * p.twinkleSpeed + p.twinklePhase) * Math.PI) / 180);
        const opacity = p.baseOpacity * twinkleVal;
        const driftX = Math.sin(((frame + p.twinklePhase) * 0.02 * Math.PI) / 180) * 15;

        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: p.x + driftX,
              top: p.y,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: p.color,
              opacity,
              boxShadow: `0 0 ${p.size * 3}px ${p.size}px ${p.color}40`,
              filter: 'blur(0.5px)',
              pointerEvents: 'none',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
