export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const TOTAL_DURATION = 900; // 30 seconds - longer loop

// Phase timing (in frames)
export const PHASE_1_START = 0;
export const PHASE_1_END = 120;

export const PHASE_2_START = 90;
export const SHOOTING_STAR_DURATION = 200; // Longer shooting star arc
export const PHASE_2_END = PHASE_2_START + SHOOTING_STAR_DURATION;

export const MONOGRAM_START = 300; // Monogram begins fading in
export const PHASE_3_START = 280; // Light rays + floor begin
export const PHASE_3_END = 750;

export const LOOP_FADE_START = 820; // Start fading near end
export const LOOP_FADE_END = TOTAL_DURATION;

// Colors
export const COLORS = {
  black: '#000000',
  darkBlue: '#001a33',
  darkTeal: '#002840',
  darkBlueGreen: '#001a28',
  white: '#FFFFFF',
  cyan: '#00D4FF',
  tealGreen: '#00FFB8',
  starGlow: 'rgba(0, 212, 255, 0.8)',
  starGlowOuter: 'rgba(0, 212, 255, 0.3)',
} as const;

// Particle config
export const PARTICLE_COUNT_SPARSE = 120;
export const FLOOR_DUST_COUNT = 45;
export const TRAIL_PARTICLE_COUNT = 50;
export const LIGHT_RAY_COUNT = 13;

// Shooting star orbits around center (monogram at 960, 540)
export const STAR_WAYPOINTS = {
  t: [0.0, 0.08, 0.16, 0.24, 0.32, 0.40, 0.48, 0.56, 0.64, 0.72, 0.80, 0.88, 0.95, 1.0],
  // Orbiting around center (960, 540) - spiral path
  x: [100, 200, 400, 650, 900, 1150, 1400, 1550, 1500, 1300, 1050, 850, 700, 960],
  y: [1000, 900, 750, 550, 400, 300, 280, 350, 480, 600, 680, 700, 650, 540],
  scale: [0.15, 0.4, 0.8, 1.3, 1.8, 2.2, 2.5, 2.3, 1.8, 1.3, 0.9, 0.6, 0.3, 0.0],
};
