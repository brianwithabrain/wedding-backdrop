#!/bin/bash
# 4K Render Script for Wedding Backdrop
# Run this on your Mac mini to render the video in 4K resolution

# Navigate to project directory
cd "$(dirname "$0")"

# Render in 4K (3840x2160)
npx remotion render WeddingBackdrop ./outputs/wedding-backdrop-4k.mp4 \
  --width=3840 \
  --height=2160 \
  --crf=20 \
  --concurrency=4

echo "4K render complete! Output: ./outputs/wedding-backdrop-4k.mp4"
