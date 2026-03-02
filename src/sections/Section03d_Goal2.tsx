"use client";

import { useRef, useMemo, useCallback, useState, useEffect } from "react";
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
import {
  interpolatePresetMonotonic,
  computeCumulativeAreas,
} from "@/utils/interpolatePreset";
import { computeSquareSegments } from "@/utils/funnelLayout";
import Goal2GridCanvas from "@/components/Goal2GridCanvas";
import FloatingBox from "@/components/FloatingBox";
import type { PresetParams } from "@/types";

/* ── Constants ── */

const EXTRACTION_COUNT = 15;
const GRID_COLS = 100;
const GRID_ROWS = 10;
const TOTAL = 1000;
const ALARMED_SEGMENT = 5;
const ALARMED_COLOR = "#6b1114";
const ANIMATION_END_SCROLL = 0.88;

/**
 * Target positions for floating boxes — ratios (0–1) of stage width/height.
 * Distributed randomly across the entire stage area.
 */
const STAGE_TARGETS = [
  // All positions avoid the LI logo zone (left ~20%, vertical middle)
  { rx: 0.30, ry: 0.18 },
  { rx: 0.78, ry: 0.14 },
  { rx: 0.45, ry: 0.65 },
  { rx: 0.91, ry: 0.40 },
  { rx: 0.32, ry: 0.85 },
  { rx: 0.63, ry: 0.28 },
  { rx: 0.22, ry: 0.12 },
  { rx: 0.55, ry: 0.82 },
  { rx: 0.85, ry: 0.60 },
  { rx: 0.38, ry: 0.42 },
  { rx: 0.94, ry: 0.22 },
  { rx: 0.25, ry: 0.72 },
  { rx: 0.72, ry: 0.74 },
  { rx: 0.50, ry: 0.10 },
  { rx: 0.76, ry: 0.48 },
];

/** Max growth scale per box (earlier boxes grow larger — stars grow substantially) */
const BOX_MAX_SCALES = [
  5.0, 4.7, 4.4, 4.1, 3.8, 3.5, 3.3, 3.1, 2.9, 2.7, 2.5, 2.3, 2.1, 1.9,
  1.7,
];

/** Max ring rotation per box (varied for visual interest) */
const BOX_MAX_ROTATIONS = [
  420, 390, 360, 450, 380, 410, 370, 440, 350, 400, 430, 360, 390, 420, 380,
];

/* ── Helpers ── */

/** Pick 15 grid indices from segment 5, spread across rows, rightmost first */
function pickExtractionIndices(segMap: Uint8Array): number[] {
  const byRow: number[][] = Array.from({ length: GRID_ROWS }, () => []);
  for (let i = 0; i < TOTAL; i++) {
    if (segMap[i] === ALARMED_SEGMENT) {
      byRow[Math.floor(i / GRID_COLS)].push(i);
    }
  }

  const picked: number[] = [];
  const rowPointers = byRow.map((arr) => arr.length - 1);
  let rowCursor = 0;

  while (picked.length < EXTRACTION_COUNT) {
    const row = rowCursor % GRID_ROWS;
    if (rowPointers[row] >= 0) {
      picked.push(byRow[row][rowPointers[row]]);
      rowPointers[row]--;
    }
    rowCursor++;
    if (rowCursor > GRID_ROWS * 20) break;
  }

  return picked;
}

/** Compute per-box scroll timing (staggered over morph range) */
function computeBoxTimings(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const flightStart = 0.15 + (i / count) * 0.50;
    const flightEnd = flightStart + 0.04;
    return { flightStart, flightEnd };
  });
}

/* ── Inner component (inside nested DistributionProvider) ── */

function Goal2Inner({
  morphProgress,
  sectionOpacity,
  scrollYProgress,
  textProgress,
  goalParams,
  realityParams,
  realityCumAreas,
  goalCumAreas,
}: {
  morphProgress: MotionValue<number>;
  sectionOpacity: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
  textProgress: MotionValue<number>;
  goalParams: PresetParams;
  realityParams: PresetParams;
  realityCumAreas: number[];
  goalCumAreas: number[];
}) {
  const { applyPreset, segments, segmentAreas } = useDistribution();

  /* ── Container sizing ── */
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(800);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerW(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cellSize = containerW / GRID_COLS;
  const gridH = GRID_ROWS * cellSize;
  // Stage area height — roughly matches chart proportions (2:1 aspect)
  const stageH = Math.max(250, Math.round(containerW * 0.35));

  /* ── Morph distribution on scroll ── */
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

  /* ── Extraction indices (from goal state, stable) ── */
  const extractionIndices = useMemo(() => {
    const cumAreas = [0, ...goalCumAreas, 1.0];
    const areas: number[] = [];
    for (let i = 1; i < cumAreas.length; i++) {
      areas.push((cumAreas[i] - cumAreas[i - 1]) * 100);
    }
    const goalSegMap = computeSquareSegments(areas);
    return pickExtractionIndices(goalSegMap);
  }, [goalCumAreas]);

  /* ── LI logo transforms ── */
  const liScale = useTransform(scrollYProgress, [0.08, 0.85], [1.0, 2.2], {
    clamp: true,
  });
  // Rotation driven by full scrollYProgress so it NEVER stops spinning
  const outerRotate = useTransform(scrollYProgress, [0.08, 0.90], [0, 1080]);
  const innerRotate = useTransform(scrollYProgress, [0.08, 0.90], [0, -720]);
  const liGlowOpacity = useTransform(
    scrollYProgress,
    [0.08, 0.40, 0.65, 0.82],
    [0.2, 0.5, 0.7, 1.0],
  );
  const liGlowScale = useTransform(
    scrollYProgress,
    [0.08, 0.50, 0.80],
    [0.8, 1.2, 1.5],
  );

  /* ── Title animation (slides into stage overlay like Goal 1) ── */
  const titleY = useTransform(textProgress, [0, 1], [-60, 12]);
  // Only reveal once the sticky has caught (text block scrolled away)
  const titleOpacity = useTransform(scrollYProgress, [0.08, 0.12], [0, 1], { clamp: true });
  const subtitleOpacity = useTransform(textProgress, [0.3, 1], [0, 1]);

  /* ── Shared glow intensity for all floating boxes ── */
  /* Starts earlier (0.30) so stars shine brightly for most of the animation */
  const glowIntensity = useTransform(
    scrollYProgress,
    [0.30, 0.55, 0.82],
    [0, 0.5, 1],
    { clamp: true },
  );

  /* ── Three-pillar box transforms ── */
  const pillarScale = useTransform(
    scrollYProgress,
    [0.10, 0.50, 0.80],
    [1.0, 1.08, 1.2],
    { clamp: true },
  );
  const pillarNumberScale = useTransform(
    scrollYProgress,
    [0.10, 0.50, 0.80],
    [1.0, 1.6, 2.4],
    { clamp: true },
  );
  const pillarGlow = useTransform(
    scrollYProgress,
    [0.10, 0.50, 0.80],
    [0, 0.3, 0.7],
    { clamp: true },
  );
  const pillarBorderColor = useTransform(
    scrollYProgress,
    [0.10, 0.50, 0.80],
    ["rgba(255,255,255,0.06)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0.18)"],
  );
  const pillarBoxShadow = useTransform(pillarGlow, (v) =>
    `0 0 ${v * 20}px ${v * 6}px rgba(255,250,210,${v * 0.3}), inset 0 0 ${v * 10}px rgba(255,250,210,${v * 0.1})`
  );

  /* ── Washout overlay ── */
  const washoutOpacity = useTransform(
    scrollYProgress,
    [0.78, 0.90],
    [0, 1],
    { clamp: true },
  );
  const washoutCoreOpacity = useTransform(
    washoutOpacity,
    [0.5, 1],
    [0, 0.85],
  );

  /* ── Per-box data ── */
  const boxTimings = useMemo(() => computeBoxTimings(EXTRACTION_COUNT), []);

  return (
    <motion.div
      className="sticky top-12 h-[calc(100vh-3rem)] flex flex-col items-center justify-start px-4 sm:px-8 lg:px-16 pt-0"
      style={{ opacity: sectionOpacity }}
    >
      <div ref={containerRef} className="relative w-full max-w-5xl">
        {/* ── Title overlay (slides into stage area like Goal 1) ── */}
        <motion.div
          className="absolute left-0 right-0 z-20 pointer-events-none px-4 flex items-baseline gap-6"
          style={{ y: titleY, top: 0, opacity: titleOpacity }}
        >
          <motion.h2
            className="font-heading text-2xl sm:text-3xl font-bold whitespace-nowrap"
            style={{ color: "#f0ece2" }}
          >
            Goal 2: Risk Awareness Force
          </motion.h2>
          <motion.p
            className="text-sm sm:text-base whitespace-nowrap text-text-muted"
            style={{ opacity: subtitleOpacity }}
          >
            Self-feeding hypergrowth feedback loop
          </motion.p>
        </motion.div>

        {/* ── LI Logo (left side of stage area) ── */}
        <motion.div
          className="absolute z-10"
          style={{
            left: "5%",
            top: stageH / 2 - 36,
            width: 72,
            height: 72,
            scale: liScale,
            transformOrigin: "center center",
          }}
        >
          {/* Golden glow bloom */}
          <motion.div
            className="absolute rounded-full"
            style={{
              top: -8,
              left: -8,
              width: 88,
              height: 88,
              opacity: liGlowOpacity,
              scale: liGlowScale,
              background:
                "radial-gradient(circle, rgba(255,250,210,0.9) 0%, rgba(255,245,180,0.5) 30%, transparent 70%)",
              filter: "blur(10px)",
            }}
          />

          {/* Outer dashed ring — clockwise */}
          <motion.svg
            className="absolute inset-0"
            width={72}
            height={72}
            viewBox="0 0 72 72"
            style={{ rotate: outerRotate }}
          >
            <defs>
              <linearGradient
                id="g2-gold-ring"
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
              cx={36}
              cy={36}
              r={34}
              fill="none"
              stroke="url(#g2-gold-ring)"
              strokeWidth={1.5}
              strokeDasharray="8 5"
              opacity={0.7}
            />
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const cos = Math.cos(angle);
              const sin = Math.sin(angle);
              return (
                <line
                  key={i}
                  x1={Math.round((36 + 30 * cos) * 100) / 100}
                  y1={Math.round((36 + 30 * sin) * 100) / 100}
                  x2={Math.round((36 + 34 * cos) * 100) / 100}
                  y2={Math.round((36 + 34 * sin) * 100) / 100}
                  stroke="#e6994a"
                  strokeWidth={2}
                  strokeLinecap="round"
                  opacity={0.6}
                />
              );
            })}
          </motion.svg>

          {/* Inner segmented ring — counter-clockwise */}
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

          {/* Inner warm glow ring */}
          <motion.div
            className="absolute rounded-full"
            style={{
              top: 8,
              left: 8,
              width: 56,
              height: 56,
              opacity: liGlowOpacity,
              boxShadow:
                "0 0 12px 4px rgba(255,250,210,0.4), inset 0 0 8px 2px rgba(255,245,180,0.2)",
              pointerEvents: "none",
            }}
          />

          {/* Static logo */}
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

        {/* ── Floating Boxes (copies — grid below keeps all its boxes) ── */}
        {extractionIndices.map((gridIdx, i) => {
          const col = gridIdx % GRID_COLS;
          const row = Math.floor(gridIdx / GRID_COLS);
          // Start from the grid cell position (grid sits below the stage)
          const startX = col * cellSize;
          const startY = stageH + row * cellSize;
          // Target: random position within the stage area
          const targetX = STAGE_TARGETS[i].rx * containerW;
          const targetY = STAGE_TARGETS[i].ry * stageH;

          return (
            <FloatingBox
              key={i}
              startX={startX}
              startY={startY}
              targetX={targetX}
              targetY={targetY}
              scrollYProgress={scrollYProgress}
              flightStart={boxTimings[i].flightStart}
              flightEnd={boxTimings[i].flightEnd}
              animationEnd={ANIMATION_END_SCROLL}
              maxScale={BOX_MAX_SCALES[i]}
              maxRotation={BOX_MAX_ROTATIONS[i]}
              glowIntensity={glowIntensity}
              cellSize={cellSize}
              index={i}
              color={ALARMED_COLOR}
            />
          );
        })}

        {/* ── Bordered container: stage area + grid ── */}
        <div className="rounded-xl border border-white/10 overflow-hidden">
          {/* Stage area — dark, same proportions as chart */}
          <div
            className="relative"
            style={{
              height: stageH,
              background: "rgba(13,13,20,0.95)",
            }}
          />

          {/* Grid Canvas — all boxes remain (copies fly, originals stay) */}
          <div className="border-t border-white/8">
            <Goal2GridCanvas
              segments={segments}
              segmentAreas={segmentAreas}
              morphProgress={morphProgress}
              width={containerW}
              height={gridH}
            />
          </div>
        </div>

        {/* ── Washout Overlay — golden light covers stage + grid ── */}
        <motion.div
          className="absolute inset-0 z-40 pointer-events-none rounded-xl"
          style={{
            opacity: washoutOpacity,
            background:
              "radial-gradient(ellipse 80% 60% at 50% 35%, rgba(255,250,210,1) 0%, rgba(255,245,180,0.95) 25%, rgba(255,240,150,0.7) 50%, rgba(255,230,100,0.4) 75%, transparent 100%)",
          }}
        />

        {/* Washout core — pure white center */}
        <motion.div
          className="absolute inset-0 z-50 pointer-events-none rounded-xl"
          style={{
            opacity: washoutCoreOpacity,
            background:
              "radial-gradient(circle at 50% 35%, white 0%, rgba(255,255,250,0.6) 25%, transparent 55%)",
          }}
        />
      </div>

      {/* ── Three pillars — always visible during animation ── */}
      <motion.div
        className="rounded-xl bg-white/3 overflow-hidden w-full max-w-5xl mt-4"
        style={{
          scale: pillarScale,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: pillarBorderColor,
          boxShadow: pillarBoxShadow,
        }}
      >
        <div className="grid sm:grid-cols-3 text-center">
          {[
            {
              num: "1",
              text: "Make AI risk a dinner-table conversation \u2014 critical mass creates unstoppable momentum.",
            },
            {
              num: "2",
              text: "Every advocate becomes a missionary \u2014 each conversation plants a seed, turning bystanders into crusaders.",
            },
            {
              num: "3",
              text: "Preachers of awareness drive media coverage, policy discussion, and public demand for AI safety.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.num}
              className="p-4"
              style={i > 0 ? { borderLeftWidth: 1, borderLeftStyle: "solid" as const, borderLeftColor: pillarBorderColor } : undefined}
            >
              <motion.div
                className="mb-2 font-heading font-bold text-cautious origin-center"
                style={{ scale: pillarNumberScale }}
              >
                {item.num}
              </motion.div>
              <p className="text-sm text-text-muted leading-relaxed">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Outer wrapper (scroll values + nested provider) ── */

export default function Section03d_Goal2() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { goalParams } = useVariation();
  const { location, scale, shape, boundaries, zoom, pan } = useDistribution();

  const realityParams: PresetParams = {
    loc: location,
    sc: scale,
    sh: shape,
    boundaries,
    zoom,
    pan,
  };

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
    [0.0, 0.06, 0.88, 0.96],
    [0, 1, 1, 0],
  );

  const morphProgress = useTransform(
    scrollYProgress,
    [0.08, 0.55],
    [0, 1],
    { clamp: true },
  );

  // Title slides into stage overlay before morph begins
  const textProgress = useTransform(
    scrollYProgress,
    [0.04, 0.14],
    [0, 1],
    { clamp: true },
  );

  const noop = useCallback(() => {}, []);

  return (
    <section
      ref={sectionRef}
      id="goal2"
      className="relative"
      style={{ height: "600vh" }}
    >
      {/* ── Descriptive text (scrolls normally before sticky catches) ── */}
      <div className="px-4 sm:px-8 lg:px-16 pt-16 max-w-4xl mx-auto" style={{ paddingBottom: 30 }}>
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text mb-4 text-center">
          Goal 2: Risk Awareness Force
        </h2>

        <p className="text-lg text-text-muted text-center leading-relaxed max-w-2xl mx-auto mb-2">
          Grow a community of passionate supporters.
        </p>
        <p className="text-base text-text-muted text-center leading-relaxed max-w-2xl mx-auto mb-8">
          Every concerned citizen who reaches the end of the conversion funnel
          becomes a crusader that starts a chain reaction.
        </p>

      </div>

      {/* ── Sticky animation ── */}
      <DistributionProvider initialPreset={realityParams} onParamsChange={noop}>
        <Goal2Inner
          morphProgress={morphProgress}
          sectionOpacity={sectionOpacity}
          scrollYProgress={scrollYProgress}
          textProgress={textProgress}
          goalParams={goalParams}
          realityParams={realityParams}
          realityCumAreas={realityCumAreas}
          goalCumAreas={goalCumAreas}
        />
      </DistributionProvider>
    </section>
  );
}
