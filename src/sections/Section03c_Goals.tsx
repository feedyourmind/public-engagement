"use client";

import { useRef, useMemo, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import {
  DistributionProvider,
  useDistribution,
} from "@/context/DistributionContext";
import { useVariation } from "@/context/VariationContext";
import DistributionChart from "@/components/DistributionChart";
import DistributionGrid from "@/components/DistributionGrid";
import SegmentLegend from "@/components/SegmentLegend";
import LethalIntelligenceIcon from "@/components/LethalIntelligenceIcon";
import {
  interpolatePresetMonotonic,
  computeCumulativeAreas,
} from "@/utils/interpolatePreset";
import type { PresetParams } from "@/types";

/* ── Inner component (inside nested provider) ── */

function GoalsSectionInner({
  morphProgress,
  textProgress,
  sectionOpacity,
  scrollYProgress,
  goalParams,
  realityParams,
  realityCumAreas,
  goalCumAreas,
}: {
  morphProgress: MotionValue<number>;
  textProgress: MotionValue<number>;
  sectionOpacity: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
  goalParams: PresetParams;
  realityParams: PresetParams;
  realityCumAreas: number[];
  goalCumAreas: number[];
}) {
  const { applyPreset } = useDistribution();

  /* Sunlight glow — starts from icon, expands across chart white area */
  const glowOpacity = useTransform(morphProgress, [0, 0.15, 0.5, 0.8, 1], [0, 0.25, 0.6, 0.85, 0.95]);
  const glowScale = useTransform(morphProgress, [0, 0.3, 0.7, 1], [0.15, 0.8, 2.5, 4.5]);

  /* Text animation — after sticky, shrinks and slides into chart overlay */
  const textY = useTransform(textProgress, [0, 1], [0, 80]);
  const textScale = useTransform(textProgress, [0, 1], [1, 0.6]);
  const textColor = useTransform(textProgress, [0, 1], ["#f0ece2", "#444444"]);
  const textMutedColor = useTransform(textProgress, [0, 1], ["#888888", "#666666"]);
  const descOpacity = useTransform(textProgress, [0, 0.5], [1, 0]);

  useMotionValueEvent(morphProgress, "change", (t) => {
    applyPreset(
      interpolatePresetMonotonic(
        realityParams,
        goalParams,
        t,
        realityCumAreas,
        goalCumAreas,
      ),
    );
  });

  return (
    <motion.div
      className="sticky top-12 h-[calc(100vh-3rem)] flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16"
      style={{ opacity: sectionOpacity }}
    >
      {/* Title + description — starts above chart, animates into chart overlay */}
      <motion.div
        className="relative z-10 text-center mb-2 pointer-events-none"
        style={{
          y: textY,
          scale: textScale,
          transformOrigin: "center bottom",
        }}
      >
        <motion.h2
          className="font-heading text-3xl sm:text-4xl font-bold mb-2"
          style={{ color: textColor }}
        >
          Goal 1: Change the Shape of the Curve
        </motion.h2>
        <motion.p
          className="text-sm max-w-xl mx-auto"
          style={{ color: textMutedColor, opacity: descOpacity }}
        >
          Shift public perception so more people recognise the severity of AI risk
          — moving the distribution curve from complacency toward concern.
        </motion.p>
      </motion.div>

      <div className="relative w-full max-w-5xl">
        {/* Sunlight glow — behind chart, spills into dark background */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            zIndex: 0,
            top: -120,
            left: -120,
            width: 700,
            height: 450,
            opacity: glowOpacity,
            scale: glowScale,
            transformOrigin: "160px 160px",
            background:
              "radial-gradient(ellipse 60% 50% at 30% 40%, rgba(255,245,180,1) 0%, rgba(255,240,150,0.75) 20%, rgba(255,235,130,0.4) 45%, rgba(255,230,100,0.12) 70%, transparent 85%)",
            filter: "blur(30px)",
          }}
        />

        {/* Chart content — opaque backgrounds sit on top of glow */}
        <div className="relative z-1">
          <LethalIntelligenceIcon morphProgress={morphProgress} scrollYProgress={scrollYProgress} />
          <DistributionChart
            showBoundaries={false}
            showLabels={true}
            interactive={false}
          />
          <DistributionGrid />
        </div>

        <div className="relative z-1 mt-8">
          <SegmentLegend />
        </div>
      </div>
    </motion.div>
  );
}

/* ── Outer wrapper (provides scroll values + nested provider) ── */

export default function Section03c_Goals() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { goalParams } = useVariation();
  const { location, scale, shape, boundaries, zoom, pan } = useDistribution();

  // Capture the current reality params from the outer context (includes DB zoom/pan)
  const realityParams: PresetParams = { loc: location, sc: scale, sh: shape, boundaries, zoom, pan };

  // Pre-compute cumulative CDF values at boundaries (stable across scroll frames)
  const realityCumAreas = useMemo(
    () => computeCumulativeAreas(realityParams),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location, scale, shape, ...boundaries, zoom, pan],
  );
  const goalCumAreas = useMemo(
    () => computeCumulativeAreas(goalParams),
    [goalParams],
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const sectionOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.05, 0.92, 0.98],
    [0, 1, 1, 0],
  );

  const morphProgress = useTransform(
    scrollYProgress,
    [0.15, 0.40, 0.55, 0.65, 0.75],
    [0, 0.6, 0.85, 0.95, 1],
    { clamp: true },
  );

  // Text shrinks into chart after section becomes sticky
  const textProgress = useTransform(
    scrollYProgress,
    [0.12, 0.25],
    [0, 1],
    { clamp: true },
  );

  const noop = useCallback(() => {}, []);

  return (
    <section
      ref={sectionRef}
      id="goals"
      className="relative mt-32"
      style={{ height: "600vh" }}
    >
      <DistributionProvider initialPreset={realityParams} onParamsChange={noop}>
        <GoalsSectionInner
          morphProgress={morphProgress}
          textProgress={textProgress}
          sectionOpacity={sectionOpacity}
          scrollYProgress={scrollYProgress}
          goalParams={goalParams}
          realityParams={realityParams}
          realityCumAreas={realityCumAreas}
          goalCumAreas={goalCumAreas}
        />
      </DistributionProvider>
    </section>
  );
}
