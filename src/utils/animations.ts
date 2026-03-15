import { interpolate, Easing } from 'remotion';

const SMOOTH_BEZIER = Easing.bezier(0.4, 0.0, 0.2, 1);

export const fadeIn = (
  frame: number,
  startFrame: number,
  duration: number,
): number => {
  return interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: SMOOTH_BEZIER,
  });
};

export const fadeOut = (
  frame: number,
  startFrame: number,
  duration: number,
): number => {
  return interpolate(frame, [startFrame, startFrame + duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: SMOOTH_BEZIER,
  });
};

export const twinkle = (
  frame: number,
  speed: number,
  phase: number,
): number => {
  return 0.5 + 0.5 * Math.sin(((frame * speed + phase) * Math.PI) / 180);
};
