# Wedding Backdrop Video

A beautiful animated wedding backdrop featuring northern lights with flowing wave motion, elegant monogram, particles, and light effects. Created with Remotion.

## Features

- **Northern Lights**: Flowing wave animation with multi-frequency motion
- **Seamless Loop**: Identical start/end frames with smooth fade in/out
- **4K Ready**: Supports 3840x2160 resolution
- **Elegant Design**: Monogram, particle effects, light rays, and reflective floor

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd wedding-backdrop

# Install dependencies
npm install
```

### Preview

```bash
# Start preview server
npm start
```

This opens a browser window where you can scrub through the timeline and preview the animation.

### Render Video

**1080p render (default):**
```bash
npm run render
```

**4K render:**
```bash
chmod +x render-4k.sh
./render-4k.sh
```

**Custom render:**
```bash
npx remotion render WeddingBackdrop output.mp4 --width=3840 --height=2160 --crf=20
```

### Render Settings

- `--crf`: Quality (lower = better, 18-24 recommended)
  - 18: Highest quality, larger file
  - 20: High quality (recommended)
  - 22: Good quality
  - 24: Smaller file, lower quality

## Project Structure

```
wedding-backdrop/
├── src/
│   ├── WeddingBackdrop.tsx       # Main composition
│   ├── Root.tsx                  # Remotion root
│   ├── index.ts                  # Entry point
│   ├── components/
│   │   ├── AnimatedGradient.tsx  # Background gradient
│   │   ├── LightRays.tsx         # Northern lights (wave motion)
│   │   ├── ParticleField.tsx     # Twinkling particles
│   │   ├── ShootingStar.tsx      # Orbital shooting star
│   │   ├── Monogram.tsx          # Center monogram
│   │   └── ReflectiveFloor.tsx   # Floor with reflection
│   ├── utils/
│   │   ├── constants.ts          # Configuration
│   │   ├── animations.ts         # Animation helpers
│   │   └── particleGenerator.ts  # Particle generation
│   └── types/
│       └── index.ts              # TypeScript types
├── package.json
├── tsconfig.json
└── README.md
```

## Customization

### Colors

Edit `src/utils/constants.ts`:

```typescript
export const COLORS = {
  darkBlue: '#001a33',
  cyan: '#00D4FF',
  tealGreen: '#00FFB8',
  // ... modify colors here
};
```

### Duration

Change video length in `src/utils/constants.ts`:

```typescript
export const TOTAL_DURATION = 900; // frames (30 seconds at 30fps)
```

### Northern Lights Wave Speed

Adjust wave motion in `src/components/LightRays.tsx`:

```typescript
const createWaveMotion = (baseSpeed: number, phaseOffset: number) => {
  const wave1 = Math.sin((frame * baseSpeed * 0.015) + phaseOffset) * 120;
  // Increase/decrease multipliers to change speed
};
```

## Troubleshooting

### Memory Issues

If rendering fails with memory errors:

```bash
NODE_OPTIONS="--max-old-space-size=4096" npx remotion render WeddingBackdrop output.mp4
```

### Slow Rendering

- Reduce quality: `--crf=24`
- Lower resolution: `--width=1920 --height=1080`
- Increase concurrency: `--concurrency=2` (use cautiously)

### Preview Not Working

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Tech Stack

- [Remotion](https://www.remotion.dev/) - Video creation in React
- TypeScript
- React

## License

MIT

## Credits

Created with Remotion and designed for wedding backdrop displays.
