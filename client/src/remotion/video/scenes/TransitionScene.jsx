import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

export function TransitionScene() {
  const frame = useCurrentFrame();

  // Ease in-out quad
  const ease = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

  // Phase 1 (0→20): gradient panel sweeps IN from left
  const coverP = ease(Math.min(1, Math.max(0, frame / 20)));
  const coverRight = coverP * 1920;

  // Phase 2 (22→44): panel sweeps OUT to the right
  const uncoverP = ease(Math.min(1, Math.max(0, (frame - 22) / 22)));
  const uncoverLeft = uncoverP * 1920;

  // Panel sits between uncoverLeft and coverRight
  const panelL = uncoverLeft;
  const panelW = Math.max(coverRight - uncoverLeft, 0);

  // Label: "עכשיו מצד המגייס" appears when panel is near full-width
  const labelOpacity = interpolate(frame, [17, 22, 30, 40], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Shimmer line across the panel edge
  const lineOpacity = interpolate(frame, [0, 4, 40, 45], [0, 0.9, 0.9, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      {/* Gradient wipe panel */}
      <div
        style={{
          position: 'absolute',
          left: panelL,
          top: 0,
          width: panelW,
          height: '100%',
          background: 'linear-gradient(135deg, #143268 0%, #3157d5 52%, #0f766e 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Internal shimmer highlight on leading edge */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 80,
            height: '100%',
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
            opacity: lineOpacity,
          }}
        />
      </div>

      {/* Centered label — visible when panel is full-width */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 18,
          opacity: labelOpacity,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontFamily: 'Inter, Arial, sans-serif',
            direction: 'ltr',
          }}
        >
          HireUp AI
        </div>
        <div
          dir="rtl"
          style={{
            color: '#ffffff',
            fontSize: 54,
            fontWeight: 900,
            fontFamily: 'Inter, Arial, sans-serif',
            letterSpacing: '-0.5px',
          }}
        >
          עכשיו מצד המגייס
        </div>
      </div>
    </AbsoluteFill>
  );
}
