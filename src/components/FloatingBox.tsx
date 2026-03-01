"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

interface FloatingBoxProps {
  /** Grid cell origin (px, relative to container top-left) */
  startX: number;
  startY: number;
  /** Cluster target (px, relative to container top-left) */
  targetX: number;
  targetY: number;
  /** Parent scrollYProgress to derive all animations from */
  scrollYProgress: MotionValue<number>;
  /** Scroll value [0–1] when this box starts flying */
  flightStart: number;
  /** Scroll value [0–1] when this box arrives at target */
  flightEnd: number;
  /** Scroll value [0–1] when the animation ends */
  animationEnd: number;
  /** Maximum scale this box reaches (earlier boxes → bigger) */
  maxScale: number;
  /** Maximum ring rotation degrees */
  maxRotation: number;
  /** Shared glow intensity MotionValue (0→1) */
  glowIntensity: MotionValue<number>;
  /** Base cell size in px */
  cellSize: number;
  /** Box index (for visual variety + unique gradient IDs) */
  index: number;
  /** Color */
  color: string;
}

export default function FloatingBox({
  startX,
  startY,
  targetX,
  targetY,
  scrollYProgress,
  flightStart,
  flightEnd,
  animationEnd,
  maxScale,
  maxRotation,
  glowIntensity,
  cellSize,
  index,
  color,
}: FloatingBoxProps) {
  // Flight progress: 0 = in grid, 1 = arrived
  const flightProgress = useTransform(
    scrollYProgress,
    [flightStart, flightEnd],
    [0, 1],
    { clamp: true },
  );

  // Star transformation: box stays as red square for a beat, then transforms
  // Delay 3% scroll after arrival, then transition over 4% scroll
  const starProgress = useTransform(
    scrollYProgress,
    [flightEnd + 0.03, flightEnd + 0.07],
    [0, 1],
    { clamp: true },
  );

  // Growth after arrival
  const growthScale = useTransform(
    scrollYProgress,
    [flightEnd, animationEnd],
    [1, maxScale],
    { clamp: true },
  );

  // Ring rotation after arrival
  const ringRotation = useTransform(
    scrollYProgress,
    [flightEnd, animationEnd],
    [0, maxRotation],
    { clamp: true },
  );

  // Bezier flight path
  const controlY = Math.min(startY, targetY) - 80 - (index % 3) * 30;

  const boxX = useTransform(flightProgress, (t) => {
    return startX + (targetX - startX) * t;
  });

  const boxY = useTransform(flightProgress, (t) => {
    return (
      (1 - t) * (1 - t) * startY +
      2 * (1 - t) * t * controlY +
      t * t * targetY
    );
  });

  // Visibility: hidden until flight starts
  const visibility = useTransform(flightProgress, (t) =>
    t <= 0 ? "hidden" : "visible",
  );

  // Ring: fades in during flight, stays visible with square, then dims as star takes over
  const ringOpacity = useTransform(
    scrollYProgress,
    [flightEnd - 0.01, flightEnd, flightEnd + 0.03, flightEnd + 0.08],
    [0, 0.7, 0.7, 0.15],
  );

  // Red square fades out as star takes over
  const squareOpacity = useTransform(starProgress, [0, 0.6], [1, 0]);

  // ── Star glow layers (replace the old single glow) ──

  // Bright white-hot core — small, very bright, reaches full quickly
  const coreOpacity = useTransform(starProgress, [0, 0.3, 1], [0, 0.85, 1]);

  // Mid glow — warm golden, medium size, strong from the start
  const midGlowOpacity = useTransform(
    starProgress,
    [0, 0.2, 1],
    [0.05, 0.7, 0.95],
  );

  // Outer halo — large soft bloom, starts strong, intensifies with shared glowIntensity
  const outerBaseOpacity = useTransform(
    starProgress,
    [0, 0.3, 1],
    [0.05, 0.5, 0.75],
  );
  const outerGlowBoost = useTransform(
    glowIntensity,
    [0, 0.3, 0.7, 1],
    [1.0, 1.5, 2.2, 3.0],
  );

  const ringSize = 48;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        x: boxX,
        y: boxY,
        scale: growthScale,
        visibility,
        transformOrigin: "center center",
        zIndex: 20 + index,
      }}
    >
      {/* Layer 1: Outer halo — large soft bloom (star atmosphere) */}
      <motion.div
        className="absolute rounded-full"
        style={{
          top: -cellSize * 5,
          left: -cellSize * 5,
          width: cellSize * 11,
          height: cellSize * 11,
          opacity: outerBaseOpacity,
          scale: outerGlowBoost,
          background:
            "radial-gradient(circle, rgba(255,245,180,0.8) 0%, rgba(255,235,140,0.4) 20%, rgba(255,220,100,0.15) 45%, transparent 70%)",
          filter: "blur(14px)",
          mixBlendMode: "screen",
        }}
      />

      {/* Layer 2: Mid glow — warm golden (star corona) */}
      <motion.div
        className="absolute rounded-full"
        style={{
          top: -cellSize * 2.5,
          left: -cellSize * 2.5,
          width: cellSize * 6,
          height: cellSize * 6,
          opacity: midGlowOpacity,
          background:
            "radial-gradient(circle, rgba(255,250,220,1) 0%, rgba(255,240,170,0.7) 20%, rgba(255,230,120,0.3) 50%, transparent 70%)",
          filter: "blur(5px)",
          mixBlendMode: "screen",
        }}
      />

      {/* Layer 3: Bright white-hot core (the "star" point) */}
      <motion.div
        className="absolute rounded-full"
        style={{
          top: -cellSize * 0.5,
          left: -cellSize * 0.5,
          width: cellSize * 2,
          height: cellSize * 2,
          opacity: coreOpacity,
          background:
            "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,252,240,0.95) 25%, rgba(255,245,200,0.5) 55%, transparent 80%)",
          filter: "blur(1px)",
          mixBlendMode: "screen",
        }}
      />

      {/* Rotating dashed ring — dims as star brightens */}
      <motion.svg
        className="absolute"
        width={ringSize}
        height={ringSize}
        viewBox="0 0 48 48"
        style={{
          top: -(ringSize - cellSize) / 2,
          left: -(ringSize - cellSize) / 2,
          rotate: ringRotation,
          opacity: ringOpacity,
        }}
      >
        <defs>
          <linearGradient
            id={`ring-grad-${index}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#f4a261" />
            <stop offset="50%" stopColor="#e6994a" />
            <stop offset="100%" stopColor="#d4880a" />
          </linearGradient>
        </defs>
        <circle
          cx={24}
          cy={24}
          r={22}
          fill="none"
          stroke={`url(#ring-grad-${index})`}
          strokeWidth={1.2}
          strokeDasharray="6 4"
        />
        {Array.from({ length: 8 }).map((_, ti) => {
          const angle = (ti * 45 * Math.PI) / 180;
          return (
            <line
              key={ti}
              x1={24 + 19 * Math.cos(angle)}
              y1={24 + 19 * Math.sin(angle)}
              x2={24 + 22 * Math.cos(angle)}
              y2={24 + 22 * Math.sin(angle)}
              stroke="#e6994a"
              strokeWidth={1.5}
              strokeLinecap="round"
              opacity={0.5}
            />
          );
        })}
      </motion.svg>

      {/* The red square — fades out as it becomes a star */}
      <motion.div
        style={{
          width: cellSize,
          height: cellSize,
          backgroundColor: color,
          borderRadius: 2,
          opacity: squareOpacity,
        }}
      />
    </motion.div>
  );
}
