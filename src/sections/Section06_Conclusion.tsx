"use client";

import { useRef, useMemo, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { genCurve } from "@/utils/math";
import { SEGMENTS } from "@/utils/segments";
import {
  FALLBACK_PRESET_VALUES,
  SYSTEM_PRESET_KEYS,
} from "@/presets/systemPresetKeys";

/* ── Preset references ──────────────────────────────────── */

const R = FALLBACK_PRESET_VALUES[SYSTEM_PRESET_KEYS.REALITY];
const T = FALLBACK_PRESET_VALUES[SYSTEM_PRESET_KEYS.TPOT_PERCEPTION];
const A = FALLBACK_PRESET_VALUES[SYSTEM_PRESET_KEYS.AI_SAFETY_COMMUNITY];
const G = FALLBACK_PRESET_VALUES[SYSTEM_PRESET_KEYS.GOAL];

/* ── Keyframes for curve morphing ───────────────────────── */

interface MorphKeyframe {
  t: number;
  loc: number;
  sc: number;
  sh: number;
  zoom: number;
  pan: number;
  boundaries: number[];
}

function kf(t: number, preset: typeof R): MorphKeyframe {
  return {
    t,
    loc: preset.loc,
    sc: preset.sc,
    sh: preset.sh,
    zoom: preset.zoom,
    pan: preset.pan,
    boundaries: preset.boundaries,
  };
}

const KEYFRAMES: MorphKeyframe[] = [
  kf(0.05, R),
  kf(0.15, R),
  kf(0.25, T),
  kf(0.30, T),
  kf(0.40, R),
  kf(0.45, R),
  kf(0.55, A),
  kf(0.60, A),
  kf(0.70, R),
  kf(0.75, R),
  kf(0.85, G),
  kf(0.95, G),
];

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

interface InterpolatedParams {
  loc: number;
  sc: number;
  sh: number;
  zoom: number;
  pan: number;
  boundaries: number[];
}

function interpolateKeyframes(progress: number): InterpolatedParams {
  const clamped = Math.max(0, Math.min(1, progress));
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    const kf0 = KEYFRAMES[i];
    const kf1 = KEYFRAMES[i + 1];
    if (clamped >= kf0.t && clamped <= kf1.t) {
      const range = kf1.t - kf0.t;
      const p = range > 0 ? smoothstep((clamped - kf0.t) / range) : 0;
      return {
        loc: kf0.loc + (kf1.loc - kf0.loc) * p,
        sc: kf0.sc + (kf1.sc - kf0.sc) * p,
        sh: kf0.sh + (kf1.sh - kf0.sh) * p,
        zoom: kf0.zoom + (kf1.zoom - kf0.zoom) * p,
        pan: kf0.pan + (kf1.pan - kf0.pan) * p,
        boundaries: kf0.boundaries.map(
          (b, j) => b + (kf1.boundaries[j] - b) * p
        ),
      };
    }
  }
  const last = KEYFRAMES[KEYFRAMES.length - 1];
  return {
    loc: last.loc,
    sc: last.sc,
    sh: last.sh,
    zoom: last.zoom,
    pan: last.pan,
    boundaries: [...last.boundaries],
  };
}

/* ── SVG Chart dimensions (same as DistributionChart) ───── */

const W = 900;
const H = 310;
const PAD = { top: 10, right: 30, bottom: 40, left: 20 };
const CW = W - PAD.left - PAD.right;
const CH = H - PAD.top - PAD.bottom;

/* View range constants (matching DistributionContext) */
const MATH_MIN = -1.5;
const MATH_MAX = 5;
const VIEW_HALF = (MATH_MAX - MATH_MIN) / 2;

/* ── Self-contained morphing chart ──────────────────────── */

function MorphingChart({
  loc,
  sc,
  sh,
  zoom,
  pan,
  boundaries,
}: InterpolatedParams) {
  /* Compute centroid (center of mass) — same as DistributionContext */
  const baseCurve = useMemo(
    () => genCurve(loc, sc, sh, MATH_MIN, MATH_MAX, 300),
    [loc, sc, sh]
  );

  const centroid = useMemo(() => {
    let sumXY = 0,
      sumY = 0;
    for (const p of baseCurve) {
      sumXY += p.x * p.y;
      sumY += p.y;
    }
    return sumY > 0 ? sumXY / sumY : (MATH_MIN + MATH_MAX) / 2;
  }, [baseCurve]);

  /* Dynamic view range centered on centroid */
  const viewCenter = centroid + pan;
  const xMin = viewCenter - VIEW_HALF * zoom;
  const xMax = viewCenter + VIEW_HALF * zoom;

  /* Generate curve covering full visible + math range */
  const dataMin = Math.min(MATH_MIN, xMin);
  const dataMax = Math.max(MATH_MAX, xMax);
  const curveData = useMemo(
    () => genCurve(loc, sc, sh, dataMin, dataMax, 600),
    [loc, sc, sh, dataMin, dataMax]
  );

  const yMax = useMemo(
    () => Math.max(...curveData.map((p) => p.y)) * 1.15,
    [curveData]
  );

  const sx = useCallback(
    (x: number) => PAD.left + ((x - xMin) / (xMax - xMin)) * CW,
    [xMin, xMax]
  );

  const sy = useCallback(
    (y: number) => PAD.top + CH - (y / yMax) * CH,
    [yMax]
  );

  const curvePath = useMemo(
    () =>
      curveData
        .filter((p) => p.x >= xMin && p.x <= xMax)
        .map(
          (p, i) =>
            `${i === 0 ? "M" : "L"}${sx(p.x).toFixed(2)},${sy(p.y).toFixed(2)}`
        )
        .join(" "),
    [curveData, sx, sy, xMin, xMax]
  );

  const fills = useMemo(() => {
    const all = [MATH_MIN, ...boundaries, MATH_MAX];
    return SEGMENTS.map((seg, i) => {
      const s = Math.max(all[i], xMin);
      const e = Math.min(all[i + 1], xMax);
      if (e <= s) return null;
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
  }, [curveData, boundaries, sx, sy, xMin, xMax]);

  return (
    <div
      className="bg-chart-bg rounded-t-xl shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
      style={{ padding: "12px 16px 0" }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full block"
        aria-label="AI X-Risk Distribution — morphing between perspectives"
      >
        {/* Segment fills */}
        {fills.map(
          (f) =>
            f && (
              <path
                key={f.id}
                d={f.path}
                fill={f.colorLight}
                stroke="none"
              />
            )
        )}

        {/* Main curve */}
        <path
          d={curvePath}
          fill="none"
          stroke="#1a1a2e"
          strokeWidth="2.5"
          strokeLinejoin="round"
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
          Perceived Level of AI Risk →
        </text>

        {/* Boundaries */}
        {boundaries.map((bx, i) => {
          if (bx < xMin || bx > xMax) return null;
          const px = sx(bx);
          return (
            <line
              key={i}
              x1={px}
              y1={PAD.top}
              x2={px}
              y2={sy(0)}
              stroke="#1a1a2e"
              strokeWidth="1.5"
              strokeDasharray="6,4"
              opacity="0.5"
            />
          );
        })}

        {/* Segment labels */}
        {fills.map((f) => {
          if (!f) return null;
          const colLeft = sx(f.s);
          const colRight = sx(f.e);
          const colWidth = colRight - colLeft;
          if (colWidth < 20) return null;
          const midX = (f.s + f.e) / 2;
          const midPt = curveData.reduce(
            (b, p) =>
              Math.abs(p.x - midX) < Math.abs(b.x - midX) ? p : b,
            curveData[0]
          );
          const level = f.idx % 3;
          const staggerOffset = level * 20;
          const baseY = Math.min(sy(midPt.y * 0.35), sy(0) - 65);
          const labelY = baseY + staggerOffset;
          return (
            <foreignObject
              key={f.id + "_l"}
              x={colLeft}
              y={labelY - 6}
              width={colWidth}
              height={50}
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
                  wordWrap: "break-word",
                  overflowWrap: "normal",
                  wordBreak: "keep-all",
                  opacity: 0.85,
                  padding: "0 3px",
                }}
              >
                {f.label}
              </div>
            </foreignObject>
          );
        })}
      </svg>
    </div>
  );
}

/* ── Main section ────────────────────────────────────────── */

export default function Section06_Conclusion() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const [curveParams, setCurveParams] = useState<InterpolatedParams>({
    loc: R.loc,
    sc: R.sc,
    sh: R.sh,
    zoom: R.zoom,
    pan: R.pan,
    boundaries: [...R.boundaries],
  });

  /* Section envelope (fade in / out) */
  const sectionOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.04, 0.90, 0.96],
    [0, 1, 1, 0]
  );

  /* Track scroll → interpolate curve params */
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const result = interpolateKeyframes(latest);
    setCurveParams((prev) => {
      if (
        Math.abs(prev.loc - result.loc) > 0.001 ||
        Math.abs(prev.sc - result.sc) > 0.001 ||
        Math.abs(prev.sh - result.sh) > 0.001 ||
        Math.abs(prev.zoom - result.zoom) > 0.001 ||
        Math.abs(prev.pan - result.pan) > 0.001
      ) {
        return result;
      }
      return prev;
    });
  });

  return (
    <section id="conclusion">
      <div
        ref={sectionRef}
        className="relative"
        style={{ height: "500vh" }}
      >
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
                to influence the shape of this curve.
              </p>
              <p className="text-lg sm:text-xl text-cautious font-heading font-bold mb-1">
                Before it&apos;s too late.
              </p>
              <p className="text-sm text-text-muted leading-relaxed max-w-xl mx-auto">
                This will be the most decisive factor of what version of the
                future we land on.
              </p>
            </div>

            {/* Morphing chart */}
            <MorphingChart {...curveParams} />

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
      </div>
    </section>
  );
}
