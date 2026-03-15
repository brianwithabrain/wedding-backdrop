import React from 'react';
import { Composition } from 'remotion';
import { WeddingBackdrop } from './WeddingBackdrop';
import { FPS, WIDTH, HEIGHT, TOTAL_DURATION } from './utils/constants';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="WeddingBackdrop"
        component={WeddingBackdrop}
        durationInFrames={TOTAL_DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
