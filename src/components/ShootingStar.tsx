import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { TOTAL_DURATION, COLORS, WIDTH, HEIGHT } from '../utils/constants';
import { TrailParticle } from '../types';

class SeededRandom {
  private seed: number;
  constructor(seed: number) {
    this.seed = seed;
  }
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

// Orbital mechanics: Kepler's equation solution for elliptical orbit
const calculateOrbitalPosition = (
  progress: number,
  centerX: number,
  centerY: number,
  semiMajorAxis: number,
  semiMinorAxis: number,
  rotation: number,
) => {
  const eccentricity = 0.6;
  const M = progress * 2 * Math.PI;

  let E = M;
  for (let i = 0; i < 5; i++) {
    E = M + eccentricity * Math.sin(E);
  }

  const trueAnomaly = 2 * Math.atan2(
    Math.sqrt(1 + eccentricity) * Math.sin(E / 2),
    Math.sqrt(1 - eccentricity) * Math.cos(E / 2)
  );

  const orbitalX = semiMajorAxis * Math.cos(trueAnomaly);
  const orbitalY = semiMinorAxis * Math.sin(trueAnomaly);

  const rotatedX = orbitalX * Math.cos(rotation) - orbitalY * Math.sin(rotation);
  const rotatedY = orbitalX * Math.sin(rotation) + orbitalY * Math.cos(rotation);

  const zDepth = Math.sin(trueAnomaly);

  return {
    x: centerX + rotatedX,
    y: centerY + rotatedY,
    z: zDepth,
  };
};

/**
 * Binary Star System Physics:
 * Two stars orbit their common center of mass (barycenter)
 * The barycenter itself orbits the monogram
 * This creates a helical/spiral trajectory
 *
 * For equal mass stars: barycenter is at midpoint
 * Stars are 180° out of phase (opposite sides)
 */
const calculateBinaryStarPosition = (
  baryProgress: number,
  binaryAngle: number,
  binaryRadius: number,
  centerX: number,
  centerY: number,
  semiMajorAxis: number,
  semiMinorAxis: number,
  rotation: number,
) => {
  // Barycenter orbits the monogram
  const barycenter = calculateOrbitalPosition(
    baryProgress,
    centerX,
    centerY,
    semiMajorAxis,
    semiMinorAxis,
    rotation
  );

  // Star orbits the barycenter in a circular pattern
  // This creates the helix effect when combined with the main orbit
  const starOffsetX = binaryRadius * Math.cos(binaryAngle);
  const starOffsetY = binaryRadius * Math.sin(binaryAngle);

  return {
    x: barycenter.x + starOffsetX,
    y: barycenter.y + starOffsetY,
    z: barycenter.z,
  };
};

export const ShootingStar: React.FC = () => {
  const frame = useCurrentFrame();

  const centerX = WIDTH / 2;
  const centerY = HEIGHT / 2;

  const semiMajorAxis = 700;
  const semiMinorAxis = 400;
  const orbitRotation = Math.PI * 0.15;

  // Total duration for seamless loop - exactly matches video duration
  const orbitDuration = TOTAL_DURATION; // 900 frames = 30 seconds

  // LINEAR progress for perfect looping - no easing!
  // Frame 0 and frame 900 will have the same position
  const linearProgress = (frame % orbitDuration) / orbitDuration;

  // Binary star system parameters - positioned for seamless loop
  // Stars spawn and merge in the MIDDLE of the video, not near edges
  const spawnStartFrame = 200;   // When star 2 begins spawning
  const spawnEndFrame = 240;     // When star 2 is fully spawned
  const mergeStartFrame = 660;   // When stars begin merging
  const mergeEndFrame = 700;     // When fully merged back to single star

  // Binary orbit radius - stars revolve around their barycenter
  const binaryRadius = 60; // Distance from barycenter to each star

  // Binary orbit speed - creates the helix effect
  // Use TOTAL_DURATION so binary angle is consistent at loop points
  const binaryOrbitsPerMainOrbit = 3; // Complete 3 helix rotations
  const binaryAngle = (frame % orbitDuration) * (2 * Math.PI * binaryOrbitsPerMainOrbit) / orbitDuration;

  // Star 2 opacity (spawning and merging) - use modulo for seamless loop
  const loopedFrame = frame % orbitDuration;
  const star2Opacity = interpolate(
    loopedFrame,
    [spawnStartFrame, spawnEndFrame, mergeStartFrame, mergeEndFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Separation distance - starts at 0, grows to full, then shrinks back
  const separationFactor = interpolate(
    loopedFrame,
    [spawnStartFrame, spawnEndFrame, mergeStartFrame, mergeEndFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Star 1 position - either solo orbit or part of binary system
  const star1Data = loopedFrame >= spawnStartFrame && loopedFrame <= mergeEndFrame
    ? calculateBinaryStarPosition(
        linearProgress,
        binaryAngle,
        binaryRadius * separationFactor,
        centerX,
        centerY,
        semiMajorAxis,
        semiMinorAxis,
        orbitRotation
      )
    : calculateOrbitalPosition(
        linearProgress,
        centerX,
        centerY,
        semiMajorAxis,
        semiMinorAxis,
        orbitRotation
      );

  // Star 2 position - 180° out of phase (opposite side of barycenter)
  const star2Data = calculateBinaryStarPosition(
    linearProgress,
    binaryAngle + Math.PI, // 180° phase offset
    binaryRadius * separationFactor,
    centerX,
    centerY,
    semiMajorAxis,
    semiMinorAxis,
    orbitRotation
  );

  const { x: star1X, y: star1Y, z: zDepth1 } = star1Data;
  const { x: star2X, y: star2Y, z: zDepth2 } = star2Data;

  // Scale based on z-depth
  const baseScale1 = 1.0 + zDepth1 * 0.6;
  const star1Scale = Math.max(0.3, baseScale1);

  const baseScale2 = 1.0 + zDepth2 * 0.6;
  const star2Scale = Math.max(0.3, baseScale2);

  // Calculate tail angles for both stars - using linear progression
  const dt = 1 / orbitDuration; // One frame ahead
  const nextProgress = (linearProgress + dt) % 1;
  const nextBinaryAngle = nextProgress * (2 * Math.PI * binaryOrbitsPerMainOrbit);
  const nextLoopedFrame = (loopedFrame + 1) % orbitDuration;
  const nextSeparation = interpolate(
    nextLoopedFrame,
    [spawnStartFrame, spawnEndFrame, mergeStartFrame, mergeEndFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const nextStar1Data = nextLoopedFrame >= spawnStartFrame && nextLoopedFrame <= mergeEndFrame
    ? calculateBinaryStarPosition(
        nextProgress,
        nextBinaryAngle,
        binaryRadius * nextSeparation,
        centerX,
        centerY,
        semiMajorAxis,
        semiMinorAxis,
        orbitRotation
      )
    : calculateOrbitalPosition(
        nextProgress,
        centerX,
        centerY,
        semiMajorAxis,
        semiMinorAxis,
        orbitRotation
      );

  const nextStar2Data = calculateBinaryStarPosition(
    nextProgress,
    nextBinaryAngle + Math.PI,
    binaryRadius * nextSeparation,
    centerX,
    centerY,
    semiMajorAxis,
    semiMinorAxis,
    orbitRotation
  );

  const dx1 = nextStar1Data.x - star1X;
  const dy1 = nextStar1Data.y - star1Y;
  const tailAngle1 = (Math.atan2(dy1, dx1) * 180) / Math.PI;
  const tailLength1 = Math.max(60, 150 * star1Scale);

  const dx2 = nextStar2Data.x - star2X;
  const dy2 = nextStar2Data.y - star2Y;
  const tailAngle2 = (Math.atan2(dy2, dx2) * 180) / Math.PI;
  const tailLength2 = Math.max(60, 150 * star2Scale);

  const glowPulse = 1 + 0.2 * Math.sin((frame * 0.5 * Math.PI) / 6);

  // Helper function to render a single star
  const renderStar = (
    starX: number,
    starY: number,
    starScale: number,
    zDepth: number,
    opacity: number,
    tailAngle: number,
    tailLength: number,
    starKey: string
  ) => {
    const coreSize = Math.max(4, 10 * starScale);
    const innerGlowSize = Math.max(25, 55 * starScale);
    const outerGlowSize = Math.max(50, 110 * starScale);

    return (
      <React.Fragment key={starKey}>
        {/* Outer glow */}
        <div
          style={{
            position: 'absolute',
            left: starX - outerGlowSize / 2,
            top: starY - outerGlowSize / 2,
            width: outerGlowSize,
            height: outerGlowSize,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${COLORS.starGlow} 0%, ${COLORS.starGlowOuter} 30%, transparent 70%)`,
            opacity: opacity * 0.4 * glowPulse,
            pointerEvents: 'none',
            zIndex: zDepth > 0 ? 10 : 1,
          }}
        />

        {/* Inner glow */}
        <div
          style={{
            position: 'absolute',
            left: starX - innerGlowSize / 2,
            top: starY - innerGlowSize / 2,
            width: innerGlowSize,
            height: innerGlowSize,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(255,255,255,0.9) 0%, ${COLORS.starGlow} 35%, transparent 70%)`,
            opacity: opacity * glowPulse,
            pointerEvents: 'none',
            zIndex: zDepth > 0 ? 11 : 2,
          }}
        />

        {/* Star core */}
        <div
          style={{
            position: 'absolute',
            left: starX - coreSize / 2,
            top: starY - coreSize / 2,
            width: coreSize,
            height: coreSize,
            borderRadius: '50%',
            backgroundColor: COLORS.white,
            opacity: opacity,
            boxShadow: `
              0 0 ${6 * starScale}px ${3 * starScale}px rgba(255, 255, 255, 0.8),
              0 0 ${15 * starScale}px ${8 * starScale}px rgba(0, 212, 255, 0.6),
              0 0 ${40 * starScale}px ${20 * starScale}px rgba(0, 212, 255, 0.3),
              0 0 ${70 * starScale}px ${35 * starScale}px rgba(0, 212, 255, 0.15)
            `,
            pointerEvents: 'none',
            zIndex: zDepth > 0 ? 12 : 3,
          }}
        />

        {/* Tail streak */}
        {starScale > 0.3 && (
          <div
            style={{
              position: 'absolute',
              left: starX,
              top: starY - (1 * starScale),
              width: tailLength,
              height: Math.max(1, 2.5 * starScale),
              background: `linear-gradient(to right, rgba(0, 212, 255, 0.6) 0%, rgba(0, 212, 255, 0.15) 50%, transparent 100%)`,
              opacity: opacity * 0.6,
              transform: `rotate(${tailAngle + 180}deg)`,
              transformOrigin: '0% 50%',
              pointerEvents: 'none',
              zIndex: zDepth > 0 ? 9 : 0,
            }}
          />
        )}
      </React.Fragment>
    );
  };

  // Generate trail particles for star 1 (always present)
  const trailParticles1 = useMemo(() => {
    const rng = new SeededRandom(123);
    const particles: TrailParticle[] = [];
    const spawnInterval = 3;
    const total = Math.floor(orbitDuration / spawnInterval);

    for (let i = 0; i < total; i++) {
      const particleFrame = i * spawnInterval;
      // LINEAR progress for seamless looping - no easing!
      const spawnProgress = particleFrame / orbitDuration;

      // Calculate binary parameters for this frame
      const pBinaryAngle = spawnProgress * (2 * Math.PI * binaryOrbitsPerMainOrbit);
      const pSeparation = interpolate(
        particleFrame,
        [spawnStartFrame, spawnEndFrame, mergeStartFrame, mergeEndFrame],
        [0, 1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      );

      const spawnPos = particleFrame >= spawnStartFrame && particleFrame <= mergeEndFrame
        ? calculateBinaryStarPosition(
            spawnProgress,
            pBinaryAngle,
            binaryRadius * pSeparation,
            centerX,
            centerY,
            semiMajorAxis,
            semiMinorAxis,
            orbitRotation
          )
        : calculateOrbitalPosition(spawnProgress, centerX, centerY, semiMajorAxis, semiMinorAxis, orbitRotation);

      const spawnScale = Math.max(0.3, 1.0 + spawnPos.z * 0.6);

      particles.push({
        id: i,
        x: spawnPos.x,
        y: spawnPos.y,
        spawnFrame: particleFrame,
        size: Math.max(1, (1.5 + rng.next() * 2.5) * spawnScale),
        color: rng.next() > 0.5 ? COLORS.cyan : COLORS.tealGreen,
      });
    }
    return particles;
  }, []);

  // Generate trail particles for star 2 (only when visible)
  const trailParticles2 = useMemo(() => {
    const rng = new SeededRandom(456); // Different seed for variety
    const particles: TrailParticle[] = [];
    const spawnInterval = 3;
    const total = Math.floor(orbitDuration / spawnInterval);

    for (let i = 0; i < total; i++) {
      const particleFrame = i * spawnInterval;
      // LINEAR progress for seamless looping - no easing!
      const spawnProgress = particleFrame / orbitDuration;

      const pBinaryAngle = spawnProgress * (2 * Math.PI * binaryOrbitsPerMainOrbit);
      const pSeparation = interpolate(
        particleFrame,
        [spawnStartFrame, spawnEndFrame, mergeStartFrame, mergeEndFrame],
        [0, 1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      );

      const spawnPos = calculateBinaryStarPosition(
        spawnProgress,
        pBinaryAngle + Math.PI, // 180° offset
        binaryRadius * pSeparation,
        centerX,
        centerY,
        semiMajorAxis,
        semiMinorAxis,
        orbitRotation
      );

      const spawnScale = Math.max(0.3, 1.0 + spawnPos.z * 0.6);

      particles.push({
        id: i + 1000, // Offset ID to avoid conflicts
        x: spawnPos.x,
        y: spawnPos.y,
        spawnFrame: particleFrame,
        size: Math.max(1, (1.5 + rng.next() * 2.5) * spawnScale),
        color: rng.next() > 0.3 ? COLORS.tealGreen : COLORS.cyan, // Different color ratio for star 2
      });
    }
    return particles;
  }, []);

  // Helper function to render trail particles
  const renderTrailParticles = (particles: TrailParticle[], baseOpacity: number = 1) => {
    return particles.map((tp) => {
      const age = frame - tp.spawnFrame;
      let actualAge = age;

      // Handle looping
      if (age < 0) {
        actualAge = age + orbitDuration;
      }

      if (actualAge < 0 || actualAge > 40) return null;

      const trailOpacity = interpolate(
        actualAge,
        [0, 3, 25, 40],
        [0, 0.6, 0.2, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      ) * baseOpacity;

      const driftX = Math.sin(actualAge * 0.1 + tp.id) * 3;
      const driftY = actualAge * 0.5;

      return (
        <div
          key={tp.id}
          style={{
            position: 'absolute',
            left: tp.x + driftX - tp.size / 2,
            top: tp.y + driftY - tp.size / 2,
            width: tp.size,
            height: tp.size,
            borderRadius: '50%',
            backgroundColor: tp.color,
            opacity: trailOpacity,
            boxShadow: `0 0 ${tp.size * 3}px ${tp.size}px ${tp.color}40`,
            pointerEvents: 'none',
          }}
        />
      );
    });
  };

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* Star 1 trail particles */}
      {renderTrailParticles(trailParticles1, 1)}

      {/* Star 2 trail particles (only visible when star 2 is active) */}
      {star2Opacity > 0 && renderTrailParticles(trailParticles2, star2Opacity)}

      {/* Star 1 (always visible) */}
      {renderStar(star1X, star1Y, star1Scale, zDepth1, 1, tailAngle1, tailLength1, 'star1')}

      {/* Star 2 (spawns and merges) */}
      {star2Opacity > 0 && renderStar(star2X, star2Y, star2Scale, zDepth2, star2Opacity, tailAngle2, tailLength2, 'star2')}
    </AbsoluteFill>
  );
};
