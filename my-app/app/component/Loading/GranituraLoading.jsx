"use client";

import { useEffect, useRef, useState } from "react";
import { Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";

// const display = Fraunces({ subsets: ["latin"], weight: ["600"], style: ["normal"], axes: ["opsz"] });
const display = Fraunces({
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz"],
});
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["500"] });
const sans = Inter({ subsets: ["latin"], weight: ["500", "600"] });

/**
 * GraniteLoader — HD edition
 * A full-screen loading sequence for Granitura (granite / Italian marble / natural stone).
 *
 * The wordmark reads as a raw-cut slab being polished under a quarry lamp: a matte
 * chiseled outline is swept left-to-right by a warm, specular "wet polish" pass that
 * tracks load progress exactly, leaving a glossy, light-catching finish behind it.
 * A layered vein field (fine hairline cracks + bold mineral seams) and a fine grain
 * pass give the surface a photographic, high-resolution feel instead of a flat gradient.
 * The batch/lot readout is real information — the block being processed — not a
 * decorative counter.
 *
 * Usage:
 *   <GraniteLoader duration={3200} onComplete={() => setLoading(false)} />
 *
 * Props:
 *   duration    number    total time in ms for the simulated load (default 3200)
 *   onComplete  function  called once the load finishes (fires ~500ms after 100%)
 *   label       string    the wordmark text (default "GRANITURA")
 *   lot         string    batch/lot code shown as authentic provenance detail
 */
export default function GraniteLoader({
  duration = 3200,
  onComplete,
  label = "GRANITURA",
  lot = "VG-24.07",
}) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setProgress(100);
      setDone(true);
      onComplete?.();
      return;
    }

    function tick(ts) {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const pct = Math.round(eased * 100);
      setProgress(pct);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDone(true);
        window.setTimeout(() => onComplete?.(), 750);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [duration, onComplete]);

  const stage =
    progress < 20
      ? "Selecting the block"
      : progress < 50
      ? "Cutting the slab"
      : progress < 80
      ? "Honing the surface"
      : progress < 100
      ? "Polishing to a shine"
      : "Ready";

  const letters = label.split("");

  return (
    <div className={`gt-loader ${done ? "gt-done" : ""} ${sans.className}`} role="status" aria-live="polite">
      {/* layered stone surface */}
      <div className="gt-surface" aria-hidden="true" />

      <div className="gt-veins" aria-hidden="true">
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="gt-turb-fine" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.006 0.01" numOctaves="3" seed="7" result="n1" />
              <feDisplacementMap in="SourceGraphic" in2="n1" scale="70" />
            </filter>
            <filter id="gt-turb-bold" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.003 0.006" numOctaves="2" seed="19" result="n2" />
              <feDisplacementMap in="SourceGraphic" in2="n2" scale="110" />
            </filter>
            <filter id="gt-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="grain" />
              <feColorMatrix in="grain" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.05 0" />
            </filter>
            <radialGradient id="gt-glow" cx="30%" cy="22%" r="60%">
              <stop offset="0%" stopColor="var(--gold-light)" stopOpacity="0.16" />
              <stop offset="100%" stopColor="var(--gold-light)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect x="0" y="0" width="1200" height="800" fill="url(#gt-glow)" />

          <g filter="url(#gt-turb-bold)" fill="none" strokeLinecap="round">
            <path d="M -100 140 C 260 220, 440 30, 700 170 S 1160 270, 1320 150" stroke="var(--gold)" strokeWidth="2" opacity="0.22" />
            <path d="M -80 560 C 230 480, 520 660, 800 500 S 1200 580, 1340 520" stroke="var(--gold-light)" strokeWidth="1.6" opacity="0.16" />
            <path d="M 900 -60 C 740 240, 1040 380, 850 660 S 1060 880, 950 1000" stroke="var(--sage)" strokeWidth="1.3" opacity="0.13" />
          </g>

          <g filter="url(#gt-turb-fine)" fill="none" strokeLinecap="round">
            <path d="M -60 260 C 200 300, 380 180, 640 280 S 1040 340, 1260 240" stroke="var(--gold-light)" strokeWidth="0.75" opacity="0.20" />
            <path d="M 60 640 C 300 600, 460 720, 700 640 S 1080 700, 1220 660" stroke="var(--sage)" strokeWidth="0.6" opacity="0.16" />
            <path d="M 200 -40 C 320 220, 160 360, 380 620 S 420 840, 300 960" stroke="var(--gold)" strokeWidth="0.6" opacity="0.15" />
            <path d="M 980 40 C 860 260, 1080 420, 920 660 S 1060 860, 980 980" stroke="var(--gold-light)" strokeWidth="0.5" opacity="0.12" />
          </g>

          <rect x="0" y="0" width="1200" height="800" filter="url(#gt-grain)" />
        </svg>
      </div>

      <div className="gt-sheen" aria-hidden="true" />
      <div className="gt-vignette" aria-hidden="true" />
      <div className="gt-frame" aria-hidden="true" />

      <div className="gt-content">
        <p className={`gt-eyebrow ${sans.className}`}>Italian Marble &amp; Granite &middot; Natural Stone</p>

        <h1 className={`gt-word ${display.className}`} aria-label={label}>
          <span className="gt-word-base">
            {letters.map((ch, i) => (
              <span key={`b-${i}`}>{ch === " " ? "\u00A0" : ch}</span>
            ))}
          </span>
          <span className="gt-word-shine" style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}>
            {letters.map((ch, i) => (
              <span key={`s-${i}`}>{ch === " " ? "\u00A0" : ch}</span>
            ))}
          </span>
          <span className="gt-flare" style={{ left: `${progress}%` }} aria-hidden="true" />
          <span className="gt-edge" style={{ left: `${progress}%` }} />
        </h1>

        <div className="gt-track">
          <div className="gt-track-groove" />
          <div className="gt-track-fill" style={{ width: `${progress}%` }} />
          <div className="gt-marker" style={{ left: `${progress}%` }}>
            <svg viewBox="0 0 20 20" width="13" height="13">
              <polygon points="10,0 20,10 10,20 0,10" />
            </svg>
          </div>
        </div>

        <div className="gt-status">
          <span className="gt-stage">{stage}</span>
          <span className="gt-dot" aria-hidden="true" />
          <span className={`gt-lot ${mono.className}`}>LOT&nbsp;{lot}</span>
          <span className="gt-dot" aria-hidden="true" />
          <span className={`gt-count ${mono.className}`}>{String(progress).padStart(2, "0")}%</span>
        </div>
      </div>

      <style jsx>{`
        :root {
          --stone-black: #0a120d;
          --green-deep: #122a1e;
          --green-mid: #1f4230;
          --green-light: #4a8a5e;
          --sage: #bcd4c4;
          --frost: #eef5f0;
          --cream: #f4efe2;
          --gold: #b8935e;
          --gold-light: #dfc292;
          --text-muted: #9db3a5;
        }

        .gt-loader {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--stone-black);
          overflow: hidden;
          z-index: 9999;
          transition: opacity 0.6s ease 0.1s, visibility 0.6s ease 0.1s;
        }
        .gt-loader.gt-done {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .gt-surface {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(120% 90% at 22% 12%, rgba(74, 138, 94, 0.28) 0%, transparent 55%),
            radial-gradient(90% 80% at 82% 88%, rgba(184, 147, 94, 0.14) 0%, transparent 50%),
            radial-gradient(140% 140% at 50% 30%, var(--green-mid) 0%, var(--green-deep) 45%, var(--stone-black) 82%);
        }

        .gt-veins {
          position: absolute;
          inset: -12%;
          width: 124%;
          height: 124%;
          mix-blend-mode: soft-light;
        }
        .gt-veins svg {
          width: 100%;
          height: 100%;
        }

        .gt-sheen {
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, transparent 30%, rgba(255, 255, 255, 0.05) 45%, transparent 60%);
          mix-blend-mode: screen;
          pointer-events: none;
        }

        .gt-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(78% 68% at 50% 46%, transparent 38%, rgba(6, 14, 10, 0.6) 100%);
          pointer-events: none;
        }

        .gt-frame {
          position: absolute;
          inset: 18px;
          border: 1px solid rgba(223, 194, 146, 0.16);
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.25), inset 0 0 40px rgba(0, 0, 0, 0.35);
          pointer-events: none;
        }
        @media (max-width: 640px) {
          .gt-frame {
            inset: 10px;
          }
        }

        .gt-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(1rem, 3vw, 1.6rem);
          padding: 1.5rem;
          text-align: center;
        }

        .gt-eyebrow {
          margin: 0;
          font-size: clamp(0.62rem, 1.1vw, 0.72rem);
          font-weight: 600;
          letter-spacing: 0.22em;
          color: var(--sage);
          opacity: 0.75;
          text-transform: uppercase;
        }

        .gt-word {
          position: relative;
          margin: 0;
          font-weight: 600;
          font-size: clamp(2.6rem, 9.5vw, 6.8rem);
          letter-spacing: 0.03em;
          line-height: 1;
          white-space: nowrap;
          font-variation-settings: "opsz" 72;
        }
        .gt-word-base {
          display: block;
          color: transparent;
          -webkit-text-stroke: 1px rgba(188, 212, 196, 0.4);
          filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.35));
        }
        .gt-word-shine {
          position: absolute;
          inset: 0;
          display: block;
          background: linear-gradient(
            100deg,
            var(--gold) 0%,
            var(--gold-light) 32%,
            var(--cream) 48%,
            #fffaf0 52%,
            var(--gold-light) 68%,
            var(--gold) 100%
          );
          background-size: 240% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: gt-shimmer 3.6s ease-in-out infinite;
          transition: clip-path 0.15s linear;
          filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.25));
        }
        .gt-flare {
          position: absolute;
          top: 50%;
          width: 46px;
          height: 220%;
          background: radial-gradient(closest-side, rgba(255, 250, 235, 0.55), transparent 70%);
          transform: translate(-50%, -50%);
          filter: blur(2px);
          transition: left 0.15s linear;
          pointer-events: none;
        }
        .gt-edge {
          position: absolute;
          top: -6%;
          height: 112%;
          width: 2px;
          background: linear-gradient(var(--cream), var(--gold-light));
          box-shadow: 0 0 16px 3px rgba(223, 194, 146, 0.7);
          transform: translateX(-1px);
          transition: left 0.15s linear;
        }

        @keyframes gt-shimmer {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 240% 50%;
          }
        }

        .gt-track {
          position: relative;
          width: min(320px, 60vw);
          height: 6px;
          margin-top: 0.2rem;
        }
        .gt-track-groove {
          position: absolute;
          inset: 0;
          border-radius: 3px;
          background: rgba(6, 12, 9, 0.55);
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.6), inset 0 -1px 0 rgba(188, 212, 196, 0.08);
        }
        .gt-track-fill {
          position: absolute;
          top: 1.5px;
          left: 1.5px;
          bottom: 1.5px;
          background: linear-gradient(90deg, var(--green-light), var(--gold-light) 85%);
          border-radius: 2px;
          transition: width 0.15s linear;
          box-shadow: 0 0 8px rgba(223, 194, 146, 0.5);
        }
        .gt-marker {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%) rotate(0deg);
          color: var(--cream);
          transition: left 0.15s linear;
          filter: drop-shadow(0 0 5px rgba(223, 194, 146, 0.85));
          animation: gt-spin 5s linear infinite;
        }
        .gt-marker svg {
          display: block;
          fill: currentColor;
        }
        @keyframes gt-spin {
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        .gt-status {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .gt-stage {
          font-size: clamp(0.7rem, 1.2vw, 0.8rem);
          font-weight: 500;
          letter-spacing: 0.05em;
          color: var(--sage);
          opacity: 0.9;
        }
        .gt-lot {
          font-size: 0.68rem;
          letter-spacing: 0.06em;
          color: var(--text-muted);
          opacity: 0.7;
        }
        .gt-count {
          font-size: 0.78rem;
          font-variant-numeric: tabular-nums;
          color: var(--gold-light);
          letter-spacing: 0.04em;
        }
        .gt-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--text-muted);
          opacity: 0.5;
        }

        @media (prefers-reduced-motion: reduce) {
          .gt-word-shine,
          .gt-marker {
            animation: none;
          }
          .gt-loader,
          .gt-edge,
          .gt-flare,
          .gt-track-fill,
          .gt-marker {
            transition: none;
          }
        }

        @media (max-width: 480px) {
          .gt-word {
            letter-spacing: 0.01em;
          }
          .gt-status {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}