import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import Icon from '../../components/ui/icons';
import { CandidateScene } from './scenes/CandidateScene';
import { RecruiterScene } from './scenes/RecruiterScene';
import { TransitionScene } from './scenes/TransitionScene';
import { EndScene } from './scenes/EndScene';

export const COLORS = {
  bg: '#f6f8fb',
  bgSoft: '#eef4f8',
  surface: '#ffffff',
  text: '#102033',
  muted: '#607086',
  border: '#dbe3ec',
  primary: '#3157d5',
  primaryDark: '#143268',
  primarySoft: '#eef3ff',
  secondary: '#0f766e',
  secondarySoft: '#e8f7f4',
  success: '#168455',
  warning: '#a16207',
  danger: '#c2413a',
};

export function BrandLockup({ compact = false, light = false }) {
  return (
    <div className="hup-brand" dir="ltr">
      <span className="hup-brand-symbol">
        <img src={staticFile('/brand/hireup-internal-symbol-white.png')} alt="HireUp" />
      </span>
      {!compact && (
        <span className="hup-brand-text" style={{ color: light ? '#fff' : COLORS.text }}>
          Hire<span>Up</span>
        </span>
      )}
    </div>
  );
}

export function SceneCaption({ text, frameStart, frameEnd, top = 820 }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [frameStart, frameStart + 10, frameEnd - 10, frameEnd],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const y = interpolate(frame, [frameStart, frameStart + 14], [18, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      className="hup-caption"
      dir="rtl"
      style={{ top, opacity, transform: `translateX(-50%) translateY(${y}px)` }}
    >
      {text}
    </div>
  );
}

function Background() {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 18;
  const pulse = interpolate(Math.sin(frame / 38), [-1, 1], [0.45, 0.85]);

  return (
    <AbsoluteFill className="hup-bg">
      <div className="hup-grid" />
      <div
        className="hup-glow hup-glow-a"
        style={{ transform: `translate(${drift}px, ${-drift}px)`, opacity: pulse }}
      />
      <div
        className="hup-glow hup-glow-b"
        style={{ transform: `translate(${-drift}px, ${drift}px)`, opacity: 0.5 }}
      />
    </AbsoluteFill>
  );
}

function OpeningTitle() {
  const frame = useCurrentFrame();
  const logo = spring({ frame, fps: 30, config: { damping: 16, stiffness: 90 } });
  const title = spring({ frame: frame - 8, fps: 30, config: { damping: 18, stiffness: 80 } });
  const sub = spring({ frame: frame - 22, fps: 30, config: { damping: 18, stiffness: 70 } });
  const out = interpolate(frame, [80, 108], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div className="hup-opening" style={{ opacity: out }}>
      <div style={{ transform: `scale(${0.92 + logo * 0.08})`, opacity: logo }}>
        <BrandLockup light />
      </div>
      <h1
        dir="rtl"
        style={{ opacity: title, transform: `translateY(${(1 - title) * 20}px)` }}
      >
        ראיון חכם. פשוט מהנייד.
      </h1>
      <p
        dir="rtl"
        style={{ opacity: sub, transform: `translateY(${(1 - sub) * 14}px)` }}
      >
        תרגול ריאלי, משוב מהיר, והתקדמות שנשמרת.
      </p>
    </div>
  );
}

/*
  To add background music:
  1. Place a royalty-free WAV/MP3 at: public/remotion/hireup-bg-music.mp3
  2. Add this import at the top: import { Audio } from 'remotion';
  3. Uncomment the line below inside HireUpProductDemo.
*/

export function HireUpProductDemo({ includeMusic = true, includeCaptions = true }) {
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill className="hup-video" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
      <Background />

      {/* <Audio src={staticFile('/remotion/hireup-bg-music.mp3')} volume={0.12} /> */}

      {/* Candidate journey — 0:00–0:30 */}
      <Sequence from={0} durationInFrames={900}>
        <CandidateScene includeCaptions={includeCaptions} />
      </Sequence>

      {/* Scene transition — 0:29.5–0:31 */}
      <Sequence from={885} durationInFrames={45}>
        <TransitionScene />
      </Sequence>

      {/* Recruiter journey — 0:30–0:56 */}
      <Sequence from={900} durationInFrames={780}>
        <RecruiterScene includeCaptions={includeCaptions} />
      </Sequence>

      {/* End card — 0:56–1:00 */}
      <Sequence from={1680} durationInFrames={durationInFrames - 1680}>
        <EndScene />
      </Sequence>

      {/* Opening splash — overlaid on top, frames 0-115 */}
      <Sequence from={0} durationInFrames={115}>
        <OpeningTitle />
      </Sequence>

      {/* Persistent watermark */}
      <div className="hup-topmark">
        <BrandLockup />
        <span>
          <Icon name="shield" size={18} /> AI Interview Coach
        </span>
      </div>
    </AbsoluteFill>
  );
}
