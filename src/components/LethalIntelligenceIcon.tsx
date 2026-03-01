"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

interface LethalIntelligenceIconProps {
  morphProgress: MotionValue<number>;
}

export default function LethalIntelligenceIcon({
  morphProgress,
}: LethalIntelligenceIconProps) {
  const outerRotate = useTransform(morphProgress, [0, 1], [0, 540]);
  const innerRotate = useTransform(morphProgress, [0, 1], [0, -360]);
  const glowOpacity = useTransform(morphProgress, [0, 0.3, 0.7, 1], [0.15, 0.6, 0.8, 0.5]);
  const glowScale = useTransform(morphProgress, [0, 0.5, 1], [0.8, 1.2, 1.0]);

  return (
    <div className="absolute top-2 left-2 z-10" style={{ width: 72, height: 72 }}>
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
          background: "radial-gradient(circle, #f4a261 0%, #e6994a 30%, transparent 70%)",
          filter: "blur(12px)",
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
          const x1 = 36 + 30 * Math.cos(angle);
          const y1 = 36 + 30 * Math.sin(angle);
          const x2 = 36 + 34 * Math.cos(angle);
          const y2 = 36 + 34 * Math.sin(angle);
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
          boxShadow: "0 0 12px 4px rgba(244,162,97,0.4), inset 0 0 8px 2px rgba(244,162,97,0.2)",
          pointerEvents: "none",
        }}
      />

      {/* Static logo in center */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://cdn.lethalintelligence.ai/img/2025/06/03095501/Logo_2-scaled-e1748946443487.jpg"
        alt="Lethal Intelligence"
        width={48}
        height={48}
        className="rounded-full absolute"
        style={{ top: 12, left: 12 }}
      />
    </div>
  );
}
