"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { genCurve, integrate } from "@/utils/math";
import { SEGMENTS } from "@/utils/segments";
import type { CurvePoint, PresetParams } from "@/types";

const W = 900;
const H = 330;
const PAD = { top: 10, right: 30, bottom: 40, left: 20 };
const CW = W - PAD.left - PAD.right;
const CH = H - PAD.top - PAD.bottom;

interface ComparisonChartProps {
  realityParams: PresetParams;
  comparisonParams: PresetParams;
  /** Large colored title word, e.g. "TPOT" */
  titleMain: string;
  /** Static subtitle shown from the start */
  titlePart1: string;
  /** Colored subtitle that fades in during transition */
  titlePart2: string;
  /** Accent color for comparison curve, title, legend, and box border */
  accentColor: string;
  /** Legend label for the comparison curve */
  comparisonLabel: string;
}

// Math range (same as DistributionContext)
const MATH_MIN = -1.5;
const MATH_MAX = 5;
const VIEW_HALF = (MATH_MAX - MATH_MIN) / 2; // 3.25

const GRID_TOTAL = 1000;
const GRID_COLS = 100;
const GRID_ROWS = 10;

// Compute centroid (center of mass) — same algorithm as DistributionContext
function computeCentroid(curve: CurvePoint[]) {
  let sumXY = 0,
    sumY = 0;
  for (const p of curve) {
    sumXY += p.x * p.y;
    sumY += p.y;
  }
  return sumY > 0 ? sumXY / sumY : (MATH_MIN + MATH_MAX) / 2;
}

export default function ComparisonChart({
  realityParams,
  comparisonParams,
  titleMain,
  titlePart1,
  titlePart2,
  accentColor,
  comparisonLabel,
}: ComparisonChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showComparisonLabels, setShowComparisonLabels] = useState(false);
  const [zoomProgress, setZoomProgress] = useState(0);

  // Extract curve params from props
  const REALITY = useMemo(() => ({ loc: realityParams.loc, sc: realityParams.sc, sh: realityParams.sh }), [realityParams]);
  const REALITY_BOUNDARIES = realityParams.boundaries;
  const COMPARISON = useMemo(() => ({ loc: comparisonParams.loc, sc: comparisonParams.sc, sh: comparisonParams.sh }), [comparisonParams]);
  const COMPARISON_BOUNDARIES = comparisonParams.boundaries;

  // Scroll progress tracks the tall outer container
  // With 300vh height + 100vh viewport = 400vh total scroll distance
  // Progress ~0.25 = sticky starts, ~0.75 = sticky ends
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // --- Scroll-driven motion values ---

  // Overall section opacity (fade in on enter, fade out before unstick)
  const sectionOpacity = useTransform(scrollYProgress, [0.0, 0.06, 0.70, 0.80], [0, 1, 1, 0]);

  // Phase 1: Reality draws in as chart enters viewport (before sticky)
  const bubbleCurveLength = useTransform(scrollYProgress, [0.04, 0.16], [0, 1]);
  const boundaryOpacity = useTransform(scrollYProgress, [0.06, 0.14], [0, 0.3]);

  // Phase 2: Reality fills visible (start at 1, fade out soon after sticky)
  const bubbleFillOpacity = useTransform(scrollYProgress, [0.28, 0.35], [1, 0]);

  // Phase 3: Transition — starts almost immediately after becoming sticky (~0.25)
  // Reality line stays black; no stroke transition needed
  const part2TitleOpacity = useTransform(scrollYProgress, [0.32, 0.40], [0, 1]);
  const publicCurveLength = useTransform(scrollYProgress, [0.34, 0.44], [0, 1]);
  const publicFillOpacity = useTransform(scrollYProgress, [0.36, 0.44], [0, 1]);
  const legendOpacity = useTransform(scrollYProgress, [0.40, 0.46], [0, 1]);

  // Grid and boxes are always visible — no fade-in needed

  // Switch segment labels and animate zoom during transition
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setShowComparisonLabels(v > 0.36);
    // Zoom interpolates from Reality → comparison viewport (0.28 to 0.44)
    const raw = Math.max(0, Math.min(1, (v - 0.28) / (0.44 - 0.28)));
    setZoomProgress(Math.round(raw * 20) / 20); // quantize to 20 steps
  });

  // Generate full-range curves for math (integration etc.)
  const realityCurveFull = useMemo(
    () => genCurve(REALITY.loc, REALITY.sc, REALITY.sh, MATH_MIN, MATH_MAX, 600),
    [REALITY]
  );
  const comparisonCurveFull = useMemo(
    () => genCurve(COMPARISON.loc, COMPARISON.sc, COMPARISON.sh, MATH_MIN, MATH_MAX, 600),
    [COMPARISON]
  );

  // Compute both viewports, then interpolate based on scroll progress
  const realityViewport = useMemo(() => {
    const zoom = realityParams.zoom ?? 1;
    const pan = realityParams.pan ?? 0;
    const center = computeCentroid(realityCurveFull) + pan;
    return { xMin: center - VIEW_HALF * zoom, xMax: center + VIEW_HALF * zoom };
  }, [realityCurveFull, realityParams.zoom, realityParams.pan]);

  const comparisonViewport = useMemo(() => {
    const zoom = comparisonParams.zoom ?? 1;
    const pan = comparisonParams.pan ?? 0;
    const center = computeCentroid(comparisonCurveFull) + pan;
    return { xMin: center - VIEW_HALF * zoom, xMax: center + VIEW_HALF * zoom };
  }, [comparisonCurveFull, comparisonParams.zoom, comparisonParams.pan]);

  // Interpolate viewport from Reality → comparison as scroll progresses
  const { xMin, xMax } = useMemo(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    return {
      xMin: lerp(realityViewport.xMin, comparisonViewport.xMin, zoomProgress),
      xMax: lerp(realityViewport.xMax, comparisonViewport.xMax, zoomProgress),
    };
  }, [realityViewport, comparisonViewport, zoomProgress]);

  // Generate curves covering the visible range
  const realityCurve = useMemo(
    () => genCurve(REALITY.loc, REALITY.sc, REALITY.sh, xMin, xMax, 600),
    [REALITY, xMin, xMax]
  );
  const compCurve = useMemo(
    () => genCurve(COMPARISON.loc, COMPARISON.sc, COMPARISON.sh, xMin, xMax, 600),
    [COMPARISON, xMin, xMax]
  );

  // Shared y-axis scale from both curves
  const yMax = useMemo(() => {
    const rMax = Math.max(...realityCurve.map((p) => p.y));
    const tMax = Math.max(...compCurve.map((p) => p.y));
    return Math.max(rMax, tMax) * 1.15;
  }, [realityCurve, compCurve]);

  const sx = useCallback(
    (x: number) => PAD.left + ((x - xMin) / (xMax - xMin)) * CW,
    [xMin, xMax]
  );
  const sy = useCallback(
    (y: number) => PAD.top + CH - (y / yMax) * CH,
    [yMax]
  );

  const toPath = useCallback(
    (data: CurvePoint[]) =>
      data
        .map(
          (p, i) =>
            `${i === 0 ? "M" : "L"}${sx(p.x).toFixed(2)},${sy(p.y).toFixed(2)}`
        )
        .join(" "),
    [sx, sy]
  );

  const realityPath = useMemo(() => toPath(realityCurve), [toPath, realityCurve]);
  const compPath = useMemo(() => toPath(compCurve), [toPath, compCurve]);

  // Segment fill paths — each distribution uses its own boundaries
  const makeSegmentFills = useCallback(
    (curveData: CurvePoint[], boundaries: number[]) => {
      const all = [xMin, ...boundaries, xMax];
      return SEGMENTS.map((seg, i) => {
        const s = all[i],
          e = all[i + 1];
        const pts = curveData.filter((p) => p.x >= s && p.x <= e);
        if (pts.length < 2) return null;
        const path =
          `M${sx(pts[0].x).toFixed(2)},${sy(0)} ` +
          pts
            .map((p) => `L${sx(p.x).toFixed(2)},${sy(p.y).toFixed(2)}`)
            .join(" ") +
          ` L${sx(pts[pts.length - 1].x).toFixed(2)},${sy(0)} Z`;
        return { ...seg, path, s, e, idx: i };
      });
    },
    [sx, sy]
  );

  const realityFills = useMemo(
    () => makeSegmentFills(realityCurve, REALITY_BOUNDARIES),
    [makeSegmentFills, realityCurve]
  );
  const compFills = useMemo(
    () => makeSegmentFills(compCurve, COMPARISON_BOUNDARIES),
    [makeSegmentFills, compCurve]
  );

  // Percentages — use full-range curves for accurate integration
  const computePercentages = useCallback(
    (fullCurve: CurvePoint[], boundaries: number[]) => {
      const total = integrate(fullCurve, MATH_MIN, MATH_MAX);
      const all = [MATH_MIN, ...boundaries, MATH_MAX];
      return SEGMENTS.map((_, i) => {
        const a = integrate(fullCurve, all[i], all[i + 1]);
        return total > 0 ? (a / total) * 100 : 0;
      });
    },
    []
  );

  const realityPcts = useMemo(
    () => computePercentages(realityCurveFull, REALITY_BOUNDARIES),
    [computePercentages, realityCurveFull]
  );
  const compPcts = useMemo(
    () => computePercentages(compCurve, COMPARISON_BOUNDARIES),
    [computePercentages, compCurve]
  );

  // Grid squares — compute for both distributions, switch with scroll
  const computeGrid = useCallback((pcts: number[]) => {
    const counts = pcts.map((pct) => Math.round((pct / 100) * GRID_TOTAL));
    let diff = GRID_TOTAL - counts.reduce((a, b) => a + b, 0);
    const largest = counts.indexOf(Math.max(...counts));
    counts[largest] += diff;
    const arr: number[] = [];
    counts.forEach((count, i) => {
      for (let j = 0; j < count; j++) arr.push(i);
    });
    return arr;
  }, []);
  const realityGridSquares = useMemo(() => computeGrid(realityPcts), [computeGrid, realityPcts]);
  const compGridSquares = useMemo(() => computeGrid(compPcts), [computeGrid, compPcts]);

  // Active fills/pcts/boundaries for labels (switches mid-scroll)
  const activeFills = showComparisonLabels ? compFills : realityFills;
  const activePcts = showComparisonLabels ? compPcts : realityPcts;
  const activeCurve = showComparisonLabels ? compCurve : realityCurve;
  const activeBoundaries = showComparisonLabels ? COMPARISON_BOUNDARIES : REALITY_BOUNDARIES;

  return (
    <div ref={containerRef} className="relative" style={{ height: "300vh" }}>
      <div className="sticky top-12" style={{ height: "calc(100vh - 3rem)" }}>
        <motion.div
          className="flex flex-col justify-center h-full px-4 sm:px-8 lg:px-16 max-w-5xl mx-auto"
          style={{ opacity: sectionOpacity }}
        >
          {/* SVG Chart with title inside */}
          <div
            className="bg-chart-bg rounded-t-xl shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
            style={{ padding: "12px 16px 0" }}
          >
            {/* Animated two-part title — inside chart area */}
            <div className="text-center pt-2 pb-3">
              <span className="font-heading text-2xl sm:text-3xl font-bold" style={{ color: accentColor }}>{titleMain}</span>
              <span className="text-xs sm:text-sm text-black/70 font-semibold tracking-wider uppercase ml-3">
                {titlePart1}
              </span>
              <motion.span
                className="text-xs sm:text-sm font-bold tracking-wider uppercase ml-1"
                style={{ opacity: part2TitleOpacity, color: accentColor }}
              >
                {titlePart2}
              </motion.span>
            </div>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full block"
              aria-label={`${titleMain} Distribution Comparison`}
            >
              {/* Reality segment fills — visible initially, fade out mid-scroll */}
              {realityFills.map(
                (f) =>
                  f && (
                    <motion.path
                      key={`reality-fill-${f.id}`}
                      d={f.path}
                      fill={f.colorLight}
                      stroke="none"
                      style={{ opacity: bubbleFillOpacity, pointerEvents: "none" }}
                    />
                  )
              )}

              {/* Comparison segment fills — fade in mid-scroll */}
              {compFills.map(
                (f) =>
                  f && (
                    <motion.path
                      key={`comp-fill-${f.id}`}
                      d={f.path}
                      fill={f.colorLight}
                      stroke="none"
                      style={{ opacity: publicFillOpacity, pointerEvents: "none" }}
                    />
                  )
              )}

              {/* Boundary dashed lines */}
              {activeBoundaries.map((bx, i) => {
                const px = sx(bx);
                return (
                  <motion.line
                    key={`boundary-${i}`}
                    x1={px}
                    y1={PAD.top}
                    x2={px}
                    y2={sy(0)}
                    stroke="#1a1a2e"
                    strokeWidth="1.5"
                    strokeDasharray="6,4"
                    style={{ opacity: boundaryOpacity }}
                  />
                );
              })}

              {/* Comparison curve line — draws in mid-scroll */}
              <motion.path
                d={compPath}
                fill="none"
                stroke={accentColor}
                strokeWidth="2.5"
                strokeLinejoin="round"
                style={{ pathLength: publicCurveLength }}
              />

              {/* Reality curve line — black, draws in on entry */}
              <motion.path
                d={realityPath}
                fill="none"
                stroke="#1a1a2e"
                strokeWidth="2.5"
                strokeLinejoin="round"
                style={{ pathLength: bubbleCurveLength }}
              />

              {/* X axis */}
              <line
                x1={sx(xMin)}
                y1={sy(0)}
                x2={sx(xMax)}
                y2={sy(0)}
                stroke="#555"
                strokeWidth="1"
              />

              {/* Axis labels */}
              <text
                x={sx(xMin) + 10}
                y={sy(0) + 38}
                textAnchor="start"
                fill="#888"
                fontSize="11"
                fontFamily="var(--font-dm-sans), sans-serif"
              >
                Zero Risk
              </text>
              <text
                x={sx(xMax) - 10}
                y={sy(0) + 38}
                textAnchor="end"
                fill="#888"
                fontSize="11"
                fontFamily="var(--font-dm-sans), sans-serif"
              >
                Existential Risk
              </text>
              <text
                x={sx((xMin + xMax) / 2)}
                y={sy(0) + 38}
                textAnchor="middle"
                fill="#aaa"
                fontSize="10"
                fontFamily="var(--font-dm-sans), sans-serif"
              >
                Perceived Level of AI Risk &rarr;
              </text>

              {/* Segment labels with percentages */}
              {activeFills.map((f) => {
                if (!f) return null;
                const colLeft = sx(f.s);
                const colRight = sx(f.e);
                const colWidth = colRight - colLeft;
                const midX = (f.s + f.e) / 2;
                const midPt = activeCurve.reduce(
                  (b, p) =>
                    Math.abs(p.x - midX) < Math.abs(b.x - midX) ? p : b,
                  activeCurve[0]
                );
                const level = f.idx % 3;
                const staggerOffset = level * 20;
                const baseY = Math.min(sy(midPt.y * 0.35), sy(0) - 65);
                const labelY = baseY + staggerOffset;
                const pct = activePcts[f.idx];
                return (
                  <foreignObject
                    key={`label-${f.id}`}
                    x={colLeft}
                    y={labelY - 6}
                    width={colWidth}
                    height={55}
                    style={{ pointerEvents: "none", overflow: "visible" }}
                  >
                    <div
                      style={{
                        textAlign: "center",
                        color: f.color,
                        fontSize: "8px",
                        fontWeight: 700,
                        fontFamily: "var(--font-dm-sans), sans-serif",
                        textTransform: "uppercase",
                        letterSpacing: "0.4px",
                        lineHeight: 1.3,
                        padding: "0 3px",
                        opacity: 0.85,
                      }}
                    >
                      {f.label}
                      <br />
                      <span style={{ fontSize: "10px" }}>
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                  </foreignObject>
                );
              })}

              {/* Legend — fades in with the comparison chart */}
              <motion.g style={{ opacity: legendOpacity }}>
                <line
                  x1={W - PAD.right - 200}
                  y1={PAD.top + 8}
                  x2={W - PAD.right - 180}
                  y2={PAD.top + 8}
                  stroke="#1a1a2e"
                  strokeWidth="2.5"
                />
                <text
                  x={W - PAD.right - 175}
                  y={PAD.top + 12}
                  fill="#1a1a2e"
                  fontSize="9"
                  fontWeight="600"
                  fontFamily="var(--font-dm-sans), sans-serif"
                >
                  Reality
                </text>
                <line
                  x1={W - PAD.right - 200}
                  y1={PAD.top + 24}
                  x2={W - PAD.right - 180}
                  y2={PAD.top + 24}
                  stroke={accentColor}
                  strokeWidth="2.5"
                />
                <text
                  x={W - PAD.right - 175}
                  y={PAD.top + 28}
                  fill={accentColor}
                  fontSize="9"
                  fontWeight="600"
                  fontFamily="var(--font-dm-sans), sans-serif"
                >
                  {comparisonLabel}
                </text>
              </motion.g>
            </svg>
          </div>

          {/* Grid below chart — always visible, switches Reality → comparison */}
          <div className="rounded-b-xl overflow-hidden bg-white">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
                gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
              }}
            >
              {(showComparisonLabels ? compGridSquares : realityGridSquares).map((segIdx, i) => (
                <div
                  key={i}
                  className="aspect-square transition-colors duration-500"
                  style={{
                    backgroundColor: SEGMENTS[segIdx].color,
                    opacity: 0.7,
                    border: "1px solid #fff",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Segment percentage boxes — always visible, switches Reality → comparison */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mt-3">
            {SEGMENTS.map((seg, i) => (
              <div
                key={seg.id}
                className="rounded-lg px-2 py-2 text-center transition-all duration-500"
                style={{
                  background: showComparisonLabels ? `${accentColor}10` : "rgba(255,255,255,0.04)",
                  border: showComparisonLabels ? `1px solid ${accentColor}66` : `1px solid ${seg.color}40`,
                  boxShadow: showComparisonLabels ? `0 0 6px ${accentColor}33` : "none",
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-sm mx-auto mb-1"
                  style={{ background: seg.color }}
                />
                <div
                  className="font-mono text-sm font-medium transition-all duration-500"
                  style={{
                    color: "var(--color-text)",
                  }}
                >
                  {activePcts[i].toFixed(0)}%
                </div>
                <div
                  className="text-[8px] font-bold uppercase tracking-wider mt-0.5"
                  style={{ color: seg.color }}
                >
                  {seg.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
