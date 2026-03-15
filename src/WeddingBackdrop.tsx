import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { AnimatedGradient } from './components/AnimatedGradient';
import { ParticleField } from './components/ParticleField';
import { ShootingStar } from './components/ShootingStar';
import { LightRays } from './components/LightRays';
import { ReflectiveFloor } from './components/ReflectiveFloor';
import { Monogram } from './components/Monogram';
import { TOTAL_DURATION } from './utils/constants';

export const WeddingBackdrop: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#001020' }}>
      {/* Layer 1: Animated gradient background (always visible) */}
      <AnimatedGradient />

      {/* Layer 2: Twinkling particle field (always present) */}
      <ParticleField />

      {/* Layer 3: Shooting star - orbital path around monogram (always visible) */}
      <ShootingStar />

      {/* Layer 4: Reflective floor (always visible) */}
      <ReflectiveFloor />

      {/* Layer 5: Monogram with cosmic dust (always visible) */}
      <Monogram />

      {/* Layer 6: Aurora Borealis / Northern Lights - on top for visibility (always visible) */}
      <LightRays />
    </AbsoluteFill>
  );
};
