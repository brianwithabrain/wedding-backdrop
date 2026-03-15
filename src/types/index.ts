export type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
  // Movement properties
  driftSpeedX: number;
  driftSpeedY: number;
  driftAmplitude: number;
  blur: number;
};

export type TrailParticle = {
  id: number;
  x: number;
  y: number;
  spawnFrame: number;
  size: number;
  color: string;
};

export type LightRay = {
  id: number;
  x: number;
  width: number;
  rotation: number;
  pulsePhase: number;
  baseOpacity: number;
};

export type AuroraBand = {
  id: number;
  baseY: number;
  wavePhase: number;
  speed: number;
  amplitude: number;
  opacity: number;
  colorStart: string;
  colorMid: string;
  blur: number;
  tilt: number;
  rgbR: number;
  rgbG: number;
  rgbB: number;
};

export type WeddingBackdropProps = {
  particleCount?: number;
  enableLightRays?: boolean;
};
