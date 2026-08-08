import React from 'react';
import { Composition } from 'remotion';
import { HireUpProductDemo } from './video/HireUpProductDemo';

export function RemotionRoot() {
  return (
    <Composition
      id="HireUpProductDemo"
      component={HireUpProductDemo}
      durationInFrames={1800}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        includeMusic: true,
        includeCaptions: true,
      }}
    />
  );
}
