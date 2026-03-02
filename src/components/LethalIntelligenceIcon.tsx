"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

interface LethalIntelligenceIconProps {
  morphProgress: MotionValue<number>;
  scrollYProgress?: MotionValue<number>;
}

export default function LethalIntelligenceIcon({
  morphProgress,
  scrollYProgress,
}: LethalIntelligenceIconProps) {
  // Use scrollYProgress for rotation so rings keep spinning through the hold period
  const rotationSource = scrollYProgress ?? morphProgress;
  const outerRotate = useTransform(
    rotationSource,
    scrollYProgress ? [0.15, 0.92] : [0, 1],
    [0, 700],
  );
  const innerRotate = useTransform(
    rotationSource,
    scrollYProgress ? [0.15, 0.92] : [0, 1],
    [0, -460],
  );
  const iconScale = useTransform(morphProgress, [0, 0.5, 1], [1, 1.3, 1.7]);
  const iconX = useTransform(morphProgress, [0, 0.5, 1], [0, 40, 90]);
  const iconY = useTransform(morphProgress, [0, 0.5, 1], [0, 25, 50]);
  const glowOpacity = useTransform(morphProgress, [0, 0.3, 0.7, 1], [0.2, 0.5, 0.7, 0.6]);
  const glowScale = useTransform(morphProgress, [0, 0.5, 1], [0.8, 1.1, 1.0]);

  return (
    <motion.div
      className="absolute top-4 left-4 z-10"
      style={{ width: 72, height: 72, scale: iconScale, x: iconX, y: iconY, transformOrigin: "center center" }}
    >
      {/* Golden glow — large soft bloom behind everything */}
      <motion.div
        className="absolute rounded-full"
        style={{
          top: -8,
          left: -8,
          width: 88,
          height: 88,
          opacity: glowOpacity,
          scale: glowScale,
          background: "radial-gradient(circle, rgba(255,250,210,0.9) 0%, rgba(255,245,180,0.5) 30%, transparent 70%)",
          filter: "blur(10px)",
        }}
      />

      {/* Outer dashed ring — golden, spins clockwise */}
      <motion.svg
        className="absolute inset-0"
        width={72}
        height={72}
        viewBox="0 0 72 72"
        style={{ rotate: outerRotate }}
      >
        <defs>
          <linearGradient id="gold-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f4a261" />
            <stop offset="50%" stopColor="#e6994a" />
            <stop offset="100%" stopColor="#d4880a" />
          </linearGradient>
        </defs>
        <circle
          cx={36}
          cy={36}
          r={34}
          fill="none"
          stroke="url(#gold-ring)"
          strokeWidth={1.5}
          strokeDasharray="8 5"
          opacity={0.7}
        />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = Math.round((36 + 30 * Math.cos(angle)) * 100) / 100;
          const y1 = Math.round((36 + 30 * Math.sin(angle)) * 100) / 100;
          const x2 = Math.round((36 + 34 * Math.cos(angle)) * 100) / 100;
          const y2 = Math.round((36 + 34 * Math.sin(angle)) * 100) / 100;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#e6994a"
              strokeWidth={2}
              strokeLinecap="round"
              opacity={0.6}
            />
          );
        })}
      </motion.svg>

      {/* Inner segmented ring — golden, spins counter-clockwise */}
      <motion.svg
        className="absolute inset-0"
        width={72}
        height={72}
        viewBox="0 0 72 72"
        style={{ rotate: innerRotate }}
      >
        <circle
          cx={36}
          cy={36}
          r={28}
          fill="none"
          stroke="#d4880a"
          strokeWidth={1}
          strokeDasharray="4 8"
          opacity={0.4}
        />
      </motion.svg>

      {/* Inner warm glow ring hugging the logo */}
      <motion.div
        className="absolute rounded-full"
        style={{
          top: 8,
          left: 8,
          width: 56,
          height: 56,
          opacity: glowOpacity,
          boxShadow: "0 0 12px 4px rgba(255,250,210,0.4), inset 0 0 8px 2px rgba(255,245,180,0.2)",
          pointerEvents: "none",
        }}
      />

      {/* Static logo in center */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/lethalintelligence-logo.jpg"
        alt="Lethal Intelligence"
        width={48}
        height={48}
        className="rounded-full absolute"
        style={{ top: 12, left: 12 }}
      />
    </motion.div>
  );
}
