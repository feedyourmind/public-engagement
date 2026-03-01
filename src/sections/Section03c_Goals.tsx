"use client";

import { useRef, useCallback } from "react";
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
import LethalIntelligenceIcon from "@/components/LethalIntelligenceIcon";
import { interpolatePreset } from "@/utils/interpolatePreset";
import type { PresetParams } from "@/types";

/* ── Inner component (inside nested provider) ── */

function GoalsSectionInner({
  morphProgress,
  sectionOpacity,
  goalParams,
  realityParams,
}: {
  morphProgress: MotionValue<number>;
  sectionOpacity: MotionValue<number>;
  goalParams: PresetParams;
  realityParams: PresetParams;
}) {
  const { applyPreset } = useDistribution();

  useMotionValueEvent(morphProgress, "change", (t) => {
    applyPreset(interpolatePreset(realityParams, goalParams, t));
  });

  return (
    <motion.div
      className="sticky top-0 h-screen flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16"
      style={{ opacity: sectionOpacity }}
    >
      <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text mb-2 text-center">
        Lethal Intelligence Goals
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-6 text-center">
        <div className="text-sm text-text-muted">
          <span className="font-semibold text-text">1.</span> Change the shape
          of the curve
        </div>
        <div className="text-sm text-text-muted">
          <span className="font-semibold text-text">2.</span> Risk Awareness
          Force &mdash; self-feeding hypergrow feedback loop
        </div>
      </div>

      <div className="relative w-full max-w-3xl">
        <LethalIntelligenceIcon morphProgress={morphProgress} />

        <DistributionChart
          showBoundaries={false}
          showLabels={true}
          interactive={false}
          height={360}
        />
        <DistributionGrid />
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

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const sectionOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.08, 0.85, 0.95],
    [0, 1, 1, 0],
  );

  const morphProgress = useTransform(
    scrollYProgress,
    [0.15, 0.75],
    [0, 1],
    { clamp: true },
  );

  const noop = useCallback(() => {}, []);

  return (
    <section
      ref={sectionRef}
      id="goals"
      className="relative"
      style={{ height: "400vh" }}
    >
      <DistributionProvider initialPreset={realityParams} onParamsChange={noop}>
        <GoalsSectionInner
          morphProgress={morphProgress}
          sectionOpacity={sectionOpacity}
          goalParams={goalParams}
          realityParams={realityParams}
        />
      </DistributionProvider>
    </section>
  );
}
