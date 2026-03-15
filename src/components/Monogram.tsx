import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import { loadFont as loadPinyon } from '@remotion/google-fonts/PinyonScript';
import { loadFont as loadCormorant } from '@remotion/google-fonts/CormorantGaramond';
import { generateCosmicDust } from '../utils/particleGenerator';

const { fontFamily: scriptFont } = loadPinyon();
const { fontFamily: serifFont } = loadCormorant();

export const Monogram: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Generate cosmic dust particles around the monogram
  const cosmicDust = useMemo(() => generateCosmicDust(80, width, height), [width, height]);

  // No fade - always visible
  const globalOpacity = 1;
  const initialsOpacity = 1;
  const namesOpacity = 1;
  const dateOpacity = 1;

  // Enhanced scale pulse - monogram breathes more noticeably
  const scalePulse = 1 + 0.08 * Math.sin(((frame * 0.08) * Math.PI) / 180);
  const yOffset = 0;

  // Glow pulse on the text shadow
  const glowIntensity =
    0.8 + 0.3 * Math.sin(((frame * 0.06 + 45) * Math.PI) / 180);

  const textShadow = `
    0 0 10px rgba(0, 212, 255, ${0.4 * glowIntensity}),
    0 0 25px rgba(0, 212, 255, ${0.25 * glowIntensity}),
    0 0 50px rgba(0, 212, 255, ${0.15 * glowIntensity}),
    0 0 80px rgba(0, 180, 220, ${0.08 * glowIntensity})
  `;

  const subtleShadow = `
    0 0 8px rgba(0, 212, 255, ${0.3 * glowIntensity}),
    0 0 20px rgba(0, 212, 255, ${0.15 * glowIntensity})
  `;

  return (
    <AbsoluteFill
      style={{
        opacity: globalOpacity,
        transform: `translateY(${yOffset}px) scale(${scalePulse})`,
        pointerEvents: 'none',
      }}
    >
      {/* Cosmic dust particles around the monogram */}
      {cosmicDust.map((particle) => {
        const twinkle = 0.5 + 0.5 * Math.sin(((frame * particle.twinkleSpeed + particle.twinklePhase) * Math.PI) / 180);
        const driftX = Math.sin((frame * particle.driftSpeedX + particle.twinklePhase) * 0.02) * particle.driftAmplitude;
        const driftY = Math.cos((frame * particle.driftSpeedY + particle.twinklePhase) * 0.015) * particle.driftAmplitude;

        return (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              left: particle.x + driftX,
              top: particle.y + driftY,
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              backgroundColor: particle.color,
              opacity: particle.baseOpacity * twinkle,
              boxShadow: `0 0 ${particle.size * 3}px ${particle.size}px ${particle.color}`,
              filter: particle.blur > 0 ? `blur(${particle.blur}px)` : 'none',
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* Main container centered on screen */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Monogram initials container - matching reference layout */}
        <div
          style={{
            position: 'relative',
            width: 500,
            height: 460,
            opacity: initialsOpacity,
          }}
        >
          {/* Y - upper left, large calligraphic */}
          <div
            style={{
              position: 'absolute',
              left: 40,
              top: -30,
              fontFamily: scriptFont,
              fontSize: 320,
              color: '#FFFFFF',
              textShadow,
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            Y
          </div>

          {/* D - lower right, overlapping with Y */}
          <div
            style={{
              position: 'absolute',
              left: 130,
              top: 130,
              fontFamily: scriptFont,
              fontSize: 320,
              color: '#FFFFFF',
              textShadow,
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            D
          </div>

          {/* YONGHAO & DAWN - positioned to the right, avoiding D overlap */}
          <div
            style={{
              position: 'absolute',
              right: -80,
              top: 50,
              opacity: namesOpacity,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 2,
            }}
          >
            <div
              style={{
                fontFamily: serifFont,
                fontSize: 28,
                color: '#FFFFFF',
                textShadow: subtleShadow,
                letterSpacing: '0.2em',
                fontWeight: 500,
              }}
            >
              YONGHAO
            </div>
            <div
              style={{
                fontFamily: serifFont,
                fontSize: 28,
                color: '#FFFFFF',
                textShadow: subtleShadow,
                letterSpacing: '0.2em',
                fontWeight: 500,
                paddingLeft: 30,
              }}
            >
              &amp;
            </div>
            <div
              style={{
                fontFamily: serifFont,
                fontSize: 28,
                color: '#FFFFFF',
                textShadow: subtleShadow,
                letterSpacing: '0.2em',
                fontWeight: 500,
                paddingLeft: 60,
              }}
            >
              DAWN
            </div>
          </div>

          {/* 21.03.2026 - bottom left */}
          <div
            style={{
              position: 'absolute',
              left: -20,
              bottom: 10,
              opacity: dateOpacity,
              fontFamily: serifFont,
              fontSize: 26,
              color: '#FFFFFF',
              textShadow: subtleShadow,
              letterSpacing: '0.15em',
              fontWeight: 400,
            }}
          >
            21.03.2026
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
