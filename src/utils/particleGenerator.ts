import { Particle, LightRay, AuroraBand } from '../types';
import { COLORS, LIGHT_RAY_COUNT } from './constants';

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

export const generateParticles = (
  count: number,
  width: number,
  height: number,
  seed: number = 42,
): Particle[] => {
  const rng = new SeededRandom(seed);
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    let x = rng.next() * width;
    let y = rng.next() * height;

    // Push particles out of center zone (reserve for monogram)
    const inCenterX = x > width * 0.3 && x < width * 0.7;
    const inCenterY = y > height * 0.3 && y < height * 0.7;
    if (inCenterX && inCenterY) {
      x =
        rng.next() > 0.5
          ? rng.next() * width * 0.25
          : width * 0.75 + rng.next() * width * 0.25;
    }

    // Varied sizes: tiny pinpoints, medium, large soft glows
    const sizeRoll = rng.next();
    let size: number;
    let blur: number;
    if (sizeRoll < 0.4) {
      size = 0.8 + rng.next() * 1.5;
      blur = 0;
    } else if (sizeRoll < 0.75) {
      size = 2 + rng.next() * 3;
      blur = 0.5 + rng.next() * 0.5;
    } else {
      size = 4 + rng.next() * 4;
      blur = 1 + rng.next() * 1.5;
    }

    // Varied brightness
    const brightnessRoll = rng.next();
    let baseOpacity: number;
    if (brightnessRoll < 0.3) {
      baseOpacity = 0.15 + rng.next() * 0.2;
    } else if (brightnessRoll < 0.7) {
      baseOpacity = 0.4 + rng.next() * 0.3;
    } else {
      baseOpacity = 0.7 + rng.next() * 0.3;
    }

    // Faster twinkling with more variety (was 0.5-2.0)
    const twinkleSpeed = 1.5 + rng.next() * 4.0;

    particles.push({
      id: i,
      x,
      y,
      size,
      baseOpacity,
      twinkleSpeed,
      twinklePhase: rng.next() * 360,
      color: rng.next() > 0.65 ? COLORS.cyan : COLORS.white,
      driftSpeedX: (rng.next() - 0.5) * 0.06,
      driftSpeedY: (rng.next() - 0.5) * 0.04,
      driftAmplitude: 5 + rng.next() * 20,
      blur,
    });
  }

  return particles;
};

export const generateFloorDust = (
  count: number,
  width: number,
  height: number,
  seed: number = 99,
): Particle[] => {
  const rng = new SeededRandom(seed);
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    const sizeRoll = rng.next();
    const size = sizeRoll < 0.5 ? 1 + rng.next() * 2 : 2.5 + rng.next() * 3;
    const blur = sizeRoll < 0.5 ? 0.3 : 0.8 + rng.next();

    particles.push({
      id: i + 1000,
      x: rng.next() * width,
      y: height * 0.72 + rng.next() * height * 0.26,
      size,
      baseOpacity: 0.25 + rng.next() * 0.5,
      twinkleSpeed: 0.8 + rng.next() * 2.0,
      twinklePhase: rng.next() * 360,
      color: rng.next() > 0.5 ? COLORS.cyan : COLORS.tealGreen,
      driftSpeedX: (rng.next() - 0.5) * 0.03,
      driftSpeedY: 0,
      driftAmplitude: 8 + rng.next() * 15,
      blur,
    });
  }

  return particles;
};

export const generateLightRays = (
  width: number,
  seed: number = 77,
): LightRay[] => {
  const rng = new SeededRandom(seed);
  const rays: LightRay[] = [];

  for (let i = 0; i < LIGHT_RAY_COUNT; i++) {
    const baseX = (i / LIGHT_RAY_COUNT) * width;
    rays.push({
      id: i,
      x: baseX + (rng.next() - 0.5) * 100,
      width: 4 + rng.next() * 8,
      rotation: (rng.next() - 0.5) * 3,
      pulsePhase: rng.next() * 360,
      baseOpacity: 0.18 + rng.next() * 0.17,
    });
  }

  return rays;
};

// Aurora Borealis bands - horizontal curtains of light that slither
export const generateAuroraBands = (
  width: number,
  height: number,
  seed: number = 77,
): AuroraBand[] => {
  const rng = new SeededRandom(seed);
  const bands: AuroraBand[] = [];
  const bandCount = 6; // Reduced for performance

  // Aurora color palettes - real northern lights colors (green/teal/cyan)
  const colorPalettes = [
    { start: 'rgba(0,255,150,', mid: 'rgba(0,220,120,', r: 0, g: 220, b: 120 },
    { start: 'rgba(0,200,255,', mid: 'rgba(0,180,220,', r: 0, g: 180, b: 220 },
    { start: 'rgba(50,255,150,', mid: 'rgba(0,220,130,', r: 50, g: 220, b: 150 },
    { start: 'rgba(0,255,200,', mid: 'rgba(0,200,180,', r: 0, g: 200, b: 180 },
  ];

  for (let i = 0; i < bandCount; i++) {
    const palette = colorPalettes[i % colorPalettes.length];
    const yPercent = 0.15 + (i / bandCount) * 0.45;

    bands.push({
      id: i,
      baseY: height * yPercent,
      wavePhase: rng.next() * 360,
      speed: 0.8 + rng.next() * 1.0,
      amplitude: 60 + rng.next() * 80,
      opacity: 0.9 + rng.next() * 0.1,
      colorStart: palette.start,
      colorMid: palette.mid,
      blur: 0, // Not used
      tilt: 0, // Not used
      rgbR: palette.r,
      rgbG: palette.g,
      rgbB: palette.b,
    });
  }

  return bands;
};

// Cosmic dust particles specifically for around the monogram - ethereal glowing particles
export const generateCosmicDust = (
  count: number,
  width: number,
  height: number,
  seed: number = 42,
): Particle[] => {
  const rng = new SeededRandom(seed);
  const particles: Particle[] = [];
  const centerX = width / 2;
  const centerY = height / 2;

  for (let i = 0; i < count; i++) {
    // Distribute around the center (monogram area)
    const angle = rng.next() * Math.PI * 2;
    const distance = 150 + rng.next() * 350; // Around the monogram

    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance * 0.7; // Slight vertical compression

    // Varied sizes for cosmic dust effect
    const sizeRoll = rng.next();
    let size: number;
    let blur: number;
    if (sizeRoll < 0.5) {
      size = 1 + rng.next() * 2;
      blur = 0;
    } else if (sizeRoll < 0.8) {
      size = 2 + rng.next() * 3;
      blur = 0.3 + rng.next() * 0.5;
    } else {
      size = 4 + rng.next() * 4;
      blur = 0.8 + rng.next() * 1;
    }

    // Cosmic colors - cyan, white, subtle purple
    const colorRoll = rng.next();
    let color: string;
    if (colorRoll < 0.5) {
      color = COLORS.cyan;
    } else if (colorRoll < 0.85) {
      color = COLORS.white;
    } else {
      color = 'rgba(180, 140, 255, 0.9)'; // Subtle purple
    }

    particles.push({
      id: i + 2000,
      x,
      y,
      size,
      baseOpacity: 0.3 + rng.next() * 0.5,
      twinkleSpeed: 0.8 + rng.next() * 2.5,
      twinklePhase: rng.next() * 360,
      color,
      driftSpeedX: (rng.next() - 0.5) * 0.04,
      driftSpeedY: (rng.next() - 0.5) * 0.03,
      driftAmplitude: 10 + rng.next() * 25,
      blur,
    });
  }

  return particles;
};
