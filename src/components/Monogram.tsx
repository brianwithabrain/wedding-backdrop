import React, { useMemo } from 'react';
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { generateCosmicDust } from '../utils/particleGenerator';

const MONOGRAM_ASSET = staticFile('monogram-vector.svg');
const MONOGRAM_WIDTH = 743;
const MONOGRAM_HEIGHT = 640;
const HELVETICA_LT_PRO = '"Helvetica LT Pro", ".Helvetica LT MM", "Helvetica LT Std", Helvetica, "Helvetica Neue", Arial, sans-serif';

export const Monogram: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Generate cosmic dust particles around the monogram
  const cosmicDust = useMemo(() => generateCosmicDust(80, width, height), [width, height]);

  const fillPulse = 0.94 + 0.06 * Math.sin(((frame * 0.08 + 12) * Math.PI) / 180);
  const glowPulse = 0.82 + 0.18 * Math.sin(((frame * 0.06 + 45) * Math.PI) / 180);
  const monogramWidth = width * 0.405;
  const monogramHeight = (monogramWidth * MONOGRAM_HEIGHT) / MONOGRAM_WIDTH;

  return (
    <AbsoluteFill
      style={{
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
          width: monogramWidth,
          height: monogramHeight,
        }}
      >
        <svg
          viewBox={`0 0 ${MONOGRAM_WIDTH} ${MONOGRAM_HEIGHT}`}
          aria-label="Wedding monogram"
          style={{
            width: '100%',
            height: '100%',
            opacity: 1,
            overflow: 'visible',
            display: 'block',
          }}
        >
          <defs>
            <mask
              id="monogram-mask"
              x="0"
              y="0"
              width={MONOGRAM_WIDTH}
              height={MONOGRAM_HEIGHT}
              maskUnits="userSpaceOnUse"
              style={{maskType: 'alpha'}}
            >
              <image
                href={MONOGRAM_ASSET}
                x="0"
                y="0"
                width={MONOGRAM_WIDTH}
                height={MONOGRAM_HEIGHT}
                preserveAspectRatio="xMidYMid meet"
              />
            </mask>

            <filter
              id="monogram-glow"
              x="-40%"
              y="-40%"
              width="180%"
              height="180%"
              colorInterpolationFilters="sRGB"
            >
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="2.5"
                floodColor="#ffffff"
                floodOpacity={0.24 + (0.18 * glowPulse)}
              />
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="7"
                floodColor="#dff8ff"
                floodOpacity={0.10 + (0.12 * glowPulse)}
              />
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="14"
                floodColor="#7fe7ff"
                floodOpacity={0.11 + (0.18 * glowPulse)}
              />
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="26"
                floodColor="#00d4ff"
                floodOpacity={0.08 + (0.14 * glowPulse)}
              />
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="44"
                floodColor="#1496ff"
                floodOpacity={0.04 + (0.09 * glowPulse)}
              />
            </filter>

          </defs>

          <rect
            x="0"
            y="0"
            width={MONOGRAM_WIDTH}
            height={MONOGRAM_HEIGHT}
            fill="#ffffff"
            opacity={fillPulse}
            mask="url(#monogram-mask)"
            filter="url(#monogram-glow)"
          />
        </svg>

        <div
          style={{
            position: 'absolute',
            left: (39 / MONOGRAM_WIDTH) * monogramWidth,
            top: (429 / MONOGRAM_HEIGHT) * monogramHeight,
            color: '#ffffff',
            fontFamily: HELVETICA_LT_PRO,
            fontSize: (37 / MONOGRAM_WIDTH) * monogramWidth,
            fontWeight: 700,
            letterSpacing: '0.11em',
            lineHeight: 1,
            whiteSpace: 'nowrap',
            WebkitFontSmoothing: 'antialiased',
            textRendering: 'geometricPrecision',
          }}
        >
          21.03.2026
        </div>

        <div
          style={{
            position: 'absolute',
            left: (519 / MONOGRAM_WIDTH) * monogramWidth,
            top: (133 / MONOGRAM_HEIGHT) * monogramHeight,
            width: (181 / MONOGRAM_WIDTH) * monogramWidth,
            color: '#ffffff',
            fontFamily: HELVETICA_LT_PRO,
            fontSize: (31 / MONOGRAM_WIDTH) * monogramWidth,
            fontWeight: 700,
            letterSpacing: '0.145em',
            lineHeight: 1,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            WebkitFontSmoothing: 'antialiased',
            textRendering: 'geometricPrecision',
          }}
        >
          YONGHAO
        </div>

        <div
          style={{
            position: 'absolute',
            left: (596 / MONOGRAM_WIDTH) * monogramWidth,
            top: (167 / MONOGRAM_HEIGHT) * monogramHeight,
            width: (38 / MONOGRAM_WIDTH) * monogramWidth,
            color: '#ffffff',
            fontFamily: HELVETICA_LT_PRO,
            fontSize: (28 / MONOGRAM_WIDTH) * monogramWidth,
            fontWeight: 700,
            lineHeight: 1,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            WebkitFontSmoothing: 'antialiased',
            textRendering: 'geometricPrecision',
          }}
        >
          &
        </div>

        <div
          style={{
            position: 'absolute',
            left: (570 / MONOGRAM_WIDTH) * monogramWidth,
            top: (201 / MONOGRAM_HEIGHT) * monogramHeight,
            width: (105 / MONOGRAM_WIDTH) * monogramWidth,
            color: '#ffffff',
            fontFamily: HELVETICA_LT_PRO,
            fontSize: (31 / MONOGRAM_WIDTH) * monogramWidth,
            fontWeight: 700,
            letterSpacing: '0.145em',
            lineHeight: 1,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            WebkitFontSmoothing: 'antialiased',
            textRendering: 'geometricPrecision',
          }}
        >
          DAWN
        </div>
      </div>
    </AbsoluteFill>
  );
};
