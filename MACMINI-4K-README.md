# Wedding Backdrop - 4K Render Instructions

## For Your Mac Mini

### Prerequisites

1. **Install Node.js** (if not already installed):
   ```bash
   brew install node
   ```

2. **Clone/Transfer the project** to your Mac mini

### Option A: Quick Start (Recommended)

1. Copy the entire `wedding-backdrop` folder to your Mac mini

2. Open Terminal, navigate to the folder:
   ```bash
   cd path/to/wedding-backdrop
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Render in 4K:
   ```bash
   chmod +x render-4k.sh
   ./render-4k.sh
   ```

   Or directly:
   ```bash
   npx remotion render WeddingBackdrop ./outputs/wedding-backdrop-4k.mp4 --width=3840 --height=2160 --crf=20
   ```

### Option B: Adjust Quality

The default settings use CRF 20 (good quality, smaller file). For highest quality:
```bash
npx remotion render WeddingBackdrop ./outputs/wedding-backdrop-4k.mp4 --width=3840 --height=2160 --crf=18
```

For faster render (lower quality):
```bash
npx remotion render WeddingBackdrop ./outputs/wedding-backdrop-4k.mp4 --width=3840 --height=2160 --crf=24
```

### Output Location

The 4K video will be saved to:
```
./outputs/wedding-backdrop-4k.mp4
```

### Rendering Time Estimate

On a Mac mini (M1/M2/M3):
- 4K render: ~5-15 minutes depending on chip
- 1080p render: ~2-5 minutes

### Troubleshooting

If you get memory errors, try:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npx remotion render WeddingBackdrop ./outputs/wedding-backdrop-4k.mp4 --width=3840 --height=2160
```
