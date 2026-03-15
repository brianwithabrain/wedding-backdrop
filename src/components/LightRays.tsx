import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { generateAuroraBands } from '../utils/particleGenerator';
import { TOTAL_DURATION, LOOP_FADE_START, LOOP_FADE_END } from '../utils/constants';

export const LightRays: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Aurora bands
  const auroraBands = useMemo(() => generateAuroraBands(width, height, 77), [width, height]);

  // Fade in at start and fade out at end for seamless loop
  const fadeIn = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [LOOP_FADE_START, LOOP_FADE_END], [1, 0], { extrapolateLeft: 'clamp' });
  const loopFade = Math.min(fadeIn, fadeOut);

  // Wave motion - creates flowing, undulating movement
  const createWaveMotion = (baseSpeed: number, phaseOffset: number) => {
    // Multiple sine waves combined for organic motion
    const wave1 = Math.sin((frame * baseSpeed * 0.015) + phaseOffset) * 120;
    const wave2 = Math.sin((frame * baseSpeed * 0.025) + phaseOffset * 1.5) * 60;
    const wave3 = Math.sin((frame * baseSpeed * 0.035) + phaseOffset * 0.7) * 30;
    return wave1 + wave2 + wave3;
  };

  return (
    <AbsoluteFill style={{ opacity: loopFade, pointerEvents: 'none' }}>
      {/* Layer 1: Background wave sweep - flowing wave motion */}
      <div
        style={{
          position: 'absolute',
          left: createWaveMotion(1.0, 0),
          top: -height * 0.1 + Math.sin(frame * 0.02) * 40,
          width: width * 1.8,
          height: height * 0.7,
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,255,150,0.15) 30%, rgba(0,200,255,0.20) 50%, rgba(0,255,150,0.12) 70%, transparent 100%)',
          opacity: (0.8 + 0.2 * Math.sin(frame * 0.03)),
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          filter: 'blur(40px)',
          transform: `rotate(${Math.sin(frame * 0.015) * 2}deg)`,
        }}
      />

      {/* Layer 2: Curtain-like aurora bands - flowing wave motion */}
      {auroraBands.map((band, index) => {
        // Flowing wave motion - multiple frequencies for organic movement
        const horizontalWave = createWaveMotion(0.8 + index * 0.1, band.wavePhase);

        // Vertical curtain flow - undulating up and down
        const verticalWave =
          Math.sin((frame * 0.02 + index * 0.5) * 1.0) * 40 +
          Math.sin((frame * 0.035 + index * 0.3) * 1.0) * 25 +
          Math.sin((frame * 0.05 + index * 0.7) * 1.0) * 15;

        // Pulse effect - breathing aurora
        const pulse = 0.7 + 0.4 * Math.sin((frame * 0.04 + band.wavePhase) * 1.0);

        return (
          <div
            key={band.id}
            style={{
              position: 'absolute',
              left: horizontalWave - width * 0.3,
              top: band.baseY + verticalWave - height * 0.6,
              width: width * 2,
              height: height * 0.8,
              background: `linear-gradient(180deg, transparent 0%, ${band.colorStart}0.20 25%, ${band.colorMid}0.35 45%, ${band.colorMid}0.25 60%, transparent 100%)`,
              opacity: pulse * band.opacity * 5.0,
              pointerEvents: 'none',
              mixBlendMode: 'screen',
              filter: 'blur(20px)',
              transform: `skewX(${-5 + Math.sin(frame * 0.02 + index) * 4}deg)`,
            }}
          />
        );
      })}

      {/* Layer 3: Moving ripple waves - flowing across the sky */}
      {[0, 1, 2].map((i) => {
        // Wave-like horizontal movement with vertical undulation
        const waveProgress = (frame * (1.2 + i * 0.4)) % TOTAL_DURATION;
        const rippleX = createWaveMotion(1.0 + i * 0.3, i * Math.PI * 0.5);
        const rippleY = height * 0.25 +
          Math.sin(frame * 0.025 + i * 1.2) * 50 +
          Math.sin(frame * 0.04 + i * 0.8) * 30;
        const rippleOpacity = 0.15 * (1 - i / 4);

        return (
          <div
            key={`ripple-${i}`}
            style={{
              position: 'absolute',
              left: rippleX + width * 0.1,
              top: rippleY,
              width: width * 0.25,
              height: height * 0.12,
              background: `radial-gradient(ellipse ${width * 0.12}px ${height * 0.06}px at 50% 50%, rgba(0,255,180,${rippleOpacity}) 0%, rgba(0,200,255,${rippleOpacity * 0.5}) 40%, transparent 70%)`,
              opacity: 0.5 + 0.5 * Math.sin(frame * 0.06 + i * 2),
              pointerEvents: 'none',
              mixBlendMode: 'screen',
              filter: 'blur(25px)',
            }}
          />
        );
      })}

      {/* Layer 4: Ambient glow */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '80%',
          background: 'radial-gradient(ellipse 180% 70% at 50% 30%, rgba(0,255,180,0.20) 0%, rgba(0,220,255,0.12) 25%, transparent 50%)',
          pointerEvents: 'none',
          mixBlendMode: 'screen',
        }}
      />

      {/* Layer 5: Vertical light beams - swaying like curtains */}
      {[0, 1, 2, 3].map((i) => {
        const beamX = width * (0.15 + i * 0.22);
        // Multi-frequency wave for organic swaying motion
        const beamWave =
          Math.sin(frame * 0.02 + i * 1.2) * 40 +
          Math.sin(frame * 0.035 + i * 0.8) * 25;
        const beamOpacity = 0.12 + 0.06 * Math.sin(frame * 0.05 + i * 2);

        return (
          <div
            key={`beam-${i}`}
            style={{
              position: 'absolute',
              left: beamX + beamWave,
              top: -height * 0.05,
              width: 50 + i * 15,
              height: height * 0.65,
              background: `linear-gradient(180deg, transparent 0%, rgba(0,255,180,${beamOpacity}) 20%, rgba(0,220,255,${beamOpacity * 1.2}) 40%, transparent 100%)`,
              pointerEvents: 'none',
              mixBlendMode: 'screen',
              filter: 'blur(30px)',
              transform: `scaleY(${1 + Math.sin(frame * 0.03 + i) * 0.1})`,
            }}
          />
        );
      })}

    </AbsoluteFill>
  );
};
