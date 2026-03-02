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
import {
  interpolatePresetMonotonic,
  computeCumulativeAreas,
} from "@/utils/interpolatePreset";
import {
  FALLBACK_PRESET_VALUES,
  SYSTEM_PRESET_KEYS,
} from "@/presets/systemPresetKeys";
import type { PresetParams } from "@/types";

/* ── Morph sequence definition ──────────────────────────── */

interface MorphPhase {
  from: PresetParams;
  to: PresetParams;
  fromCum: number[];
  toCum: number[];
  start: number;
  end: number;
}

function buildMorphSequence(presets: {
  reality: PresetParams;
  tpot: PresetParams;
  aiSafety: PresetParams;
  goal: PresetParams;
}): MorphPhase[] {
  const { reality, tpot, aiSafety, goal } = presets;

  const cumR = computeCumulativeAreas(reality);
  const cumT = computeCumulativeAreas(tpot);
  const cumA = computeCumulativeAreas(aiSafety);
  const cumG = computeCumulativeAreas(goal);

  // Scroll timeline — Goal must complete before section fade-out (~0.90):
  // 0.05–0.12  Hold Reality (initial)
  // 0.12–0.22  Reality → T-Pot
  // 0.22–0.27  Hold T-Pot
  // 0.27–0.37  T-Pot → Reality
  // 0.37–0.40  Hold Reality
  // 0.40–0.50  Reality → AI Safety
  // 0.50–0.55  Hold AI Safety
  // 0.55–0.65  AI Safety → Reality
  // 0.65–0.68  Hold Reality
  // 0.68–0.78  Reality → Goal
  // 0.78–1.00  Hold Goal (final state — visible through fade-out)

  return [
    { from: reality,  to: tpot,     fromCum: cumR, toCum: cumT, start: 0.12, end: 0.22 },
    { from: tpot,     to: tpot,     fromCum: cumT, toCum: cumT, start: 0.22, end: 0.27 },
    { from: tpot,     to: reality,  fromCum: cumT, toCum: cumR, start: 0.27, end: 0.37 },
    { from: reality,  to: reality,  fromCum: cumR, toCum: cumR, start: 0.37, end: 0.40 },
    { from: reality,  to: aiSafety, fromCum: cumR, toCum: cumA, start: 0.40, end: 0.50 },
    { from: aiSafety, to: aiSafety, fromCum: cumA, toCum: cumA, start: 0.50, end: 0.55 },
    { from: aiSafety, to: reality,  fromCum: cumA, toCum: cumR, start: 0.55, end: 0.65 },
    { from: reality,  to: reality,  fromCum: cumR, toCum: cumR, start: 0.65, end: 0.68 },
    { from: reality,  to: goal,     fromCum: cumR, toCum: cumG, start: 0.68, end: 0.78 },
    { from: goal,     to: goal,     fromCum: cumG, toCum: cumG, start: 0.78, end: 1.00 },
  ];
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

/* ── Inner component (inside nested DistributionProvider) ─ */

function ConclusionInner({
  sectionOpacity,
  phases,
  scrollYProgress,
}: {
  sectionOpacity: MotionValue<number>;
  phases: MorphPhase[];
  scrollYProgress: MotionValue<number>;
}) {
  const { applyPreset } = useDistribution();

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    for (const phase of phases) {
      if (progress >= phase.start && progress <= phase.end) {
        const range = phase.end - phase.start;
        const localT = range > 0 ? smoothstep((progress - phase.start) / range) : 0;
        applyPreset(
          interpolatePresetMonotonic(
            phase.from,
            phase.to,
            localT,
            phase.fromCum,
            phase.toCum,
          ),
        );
        return;
      }
    }
    // Before first phase — stay at reality
    if (progress < phases[0].start) {
      applyPreset(phases[0].from);
    }
  });

  return (
    <motion.div
      className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
      style={{ opacity: sectionOpacity }}
    >
      <div className="px-4 sm:px-8 lg:px-16 max-w-5xl mx-auto w-full">
        {/* Title + mission text */}
        <div className="mb-4 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text mb-3">
            Where Do We Go From Here?
          </h2>
          <p className="text-base sm:text-lg text-text font-heading font-semibold leading-relaxed max-w-2xl mx-auto mb-2">
            The single most important work — and my personal mission — is
            to influence the shape of this curve,{" "}
            <span className="text-cautious">before it&apos;s too late.</span>
          </p>
          <p className="text-sm text-text-muted leading-relaxed max-w-xl mx-auto">
            This will be the most decisive factor of what version of the
            future we land on.
          </p>
        </div>

        {/* Chart — real DistributionChart with proper zoom/pan/boundaries */}
        <DistributionChart
          showBoundaries={true}
          showLabels={true}
          interactive={false}
        />

        {/* Qualifier + nav */}
        <div className="mt-6 text-center">
          <p className="text-xs text-text-dim italic mb-5">
            This is a qualitative, perception-based visualization — not
            derived from empirical survey data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#spectrum"
              className="px-6 py-3 rounded-full border border-cautious/30 text-cautious text-sm font-medium hover:bg-cautious/10 transition-colors"
            >
              Explore Again
            </a>
            <a
              href="#intro"
              className="px-6 py-3 rounded-full border border-white/10 text-text-muted text-sm font-medium hover:bg-white/5 transition-colors"
            >
              Back to Top
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main section ────────────────────────────────────────── */

export default function Section06_Conclusion() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { getPresetByKey, goalParams } = useVariation();
  const { location, scale, shape, boundaries, zoom, pan } = useDistribution();

  // Capture live reality params from the outer context (includes DB zoom/pan)
  const realityParams: PresetParams = useMemo(
    () => ({ loc: location, sc: scale, sh: shape, boundaries, zoom, pan }),
    [location, scale, shape, boundaries, zoom, pan],
  );

  // Resolve preset params from DB (with fallbacks)
  const tpotParams: PresetParams = useMemo(() => {
    const p = getPresetByKey(SYSTEM_PRESET_KEYS.TPOT_PERCEPTION);
    if (p) return { loc: p.loc, sc: p.sc, sh: p.sh, boundaries: p.boundaries, zoom: p.zoom, pan: p.pan };
    return FALLBACK_PRESET_VALUES[SYSTEM_PRESET_KEYS.TPOT_PERCEPTION];
  }, [getPresetByKey]);

  const aiSafetyParams: PresetParams = useMemo(() => {
    const p = getPresetByKey(SYSTEM_PRESET_KEYS.AI_SAFETY_COMMUNITY);
    if (p) return { loc: p.loc, sc: p.sc, sh: p.sh, boundaries: p.boundaries, zoom: p.zoom, pan: p.pan };
    return FALLBACK_PRESET_VALUES[SYSTEM_PRESET_KEYS.AI_SAFETY_COMMUNITY];
  }, [getPresetByKey]);

  // Build the morph sequence with pre-computed cumulative areas
  const phases = useMemo(
    () => buildMorphSequence({
      reality: realityParams,
      tpot: tpotParams,
      aiSafety: aiSafetyParams,
      goal: goalParams,
    }),
    [realityParams, tpotParams, aiSafetyParams, goalParams],
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const sectionOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.04, 0.90, 0.96],
    [0, 1, 1, 0],
  );

  const noop = useCallback(() => {}, []);

  return (
    <section id="conclusion">
      <div
        ref={sectionRef}
        className="relative"
        style={{ height: "500vh" }}
      >
        <DistributionProvider initialPreset={realityParams} onParamsChange={noop}>
          <ConclusionInner
            sectionOpacity={sectionOpacity}
            phases={phases}
            scrollYProgress={scrollYProgress}
          />
        </DistributionProvider>
      </div>
    </section>
  );
}
