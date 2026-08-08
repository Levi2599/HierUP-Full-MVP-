import React from 'react';
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';

/* ── Pulsing glow orbs behind the logo ─────────────── */
function GlowOrb({ size, opacity, pulse }) {
  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.14), transparent 68%)',
        transform: `translate(-50%, -50%) scale(${pulse})`,
        left: '50%',
        top: '42%',
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
}

/* ── Decorative ring ───────────────────────────────── */
function Ring({ radius, delay }) {
  const frame = useCurrentFrame();
  const progress = Math.min(1, Math.max(0, (frame - delay) / 55));
  const eased = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
  const scale = 1 + eased * 0.35;
  const opacity = interpolate(progress, [0, 0.25, 1], [0, 0.35, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        width: radius * 2,
        height: radius * 2,
        borderRadius: '50%',
        border: '1.5px solid rgba(255,255,255,0.6)',
        transform: `translate(-50%, -50%) scale(${scale})`,
        left: '50%',
        top: '38%',
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
}

/* ── End scene ─────────────────────────────────────── */
export function EndScene() {
  const frame = useCurrentFrame();

  const logoEnter = spring({ frame, fps: 30, config: { damping: 16, stiffness: 88 } });
  const ctaEnter = spring({ frame: frame - 16, fps: 30, config: { damping: 18, stiffness: 80 } });
  const urlEnter = spring({ frame: frame - 34, fps: 30, config: { damping: 18, stiffness: 72 } });

  // Gentle glow pulse
  const glowPulse = 1 + interpolate(Math.sin(frame / 22), [-1, 1], [-0.08, 0.08]);

  return (
    <AbsoluteFill className="end-scene">
      {/* Ambient glow orbs */}
      <GlowOrb size={700} opacity={logoEnter * 0.9} pulse={glowPulse} />
      <GlowOrb size={420} opacity={logoEnter * 0.5} pulse={1 / glowPulse} />

      {/* Expanding rings */}
      <Ring radius={220} delay={4} />
      <Ring radius={320} delay={18} />
      <Ring radius={420} delay={32} />

      {/* Logo */}
      <img
        src={staticFile('/brand/hireup-logo-transparent.png')}
        className="end-logo"
        alt="HireUp"
        style={{
          opacity: logoEnter,
          transform: `scale(${0.91 + logoEnter * 0.09})`,
        }}
      />

      {/* CTA headline */}
      <h2
        style={{
          opacity: ctaEnter,
          transform: `translateY(${(1 - ctaEnter) * 18}px)`,
        }}
      >
        Hire smarter. Move faster.
      </h2>

      {/* URL */}
      <p
        style={{
          opacity: urlEnter,
          transform: `translateY(${(1 - urlEnter) * 12}px)`,
        }}
      >
        hireup-ai.vercel.app
      </p>
    </AbsoluteFill>
  );
}
