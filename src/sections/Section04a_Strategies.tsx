"use client";

import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { SEGMENTS } from "@/utils/segments";

/* ── SVG dimensions ──────────────────────────────────────── */
const W = 900;
const H = 370;
const PAD = { top: 60, right: 40, bottom: 50, left: 40 };
const CW = W - PAD.left - PAD.right; // 820
const CH = H - PAD.top - PAD.bottom; // 260

const sx = (t: number) => PAD.left + t * CW;
const sy = (v: number) => PAD.top + CH * (1 - v);

/* ── Curve math ──────────────────────────────────────────── */
const STEPS = 200;

function reachFn(t: number) {
  return Math.exp(-3.5 * t);
}
function impactFn(t: number) {
  return Math.pow(t, 3);
}
function totalFn(t: number) {
  return reachFn(t) * impactFn(t);
}

function generatePath(fn: (t: number) => number, steps: number) {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    return `${i === 0 ? "M" : "L"}${sx(t).toFixed(1)},${sy(fn(t)).toFixed(1)}`;
  }).join(" ");
}

function generateAreaPath(fn: (t: number) => number, steps: number) {
  // Normalize to 0-1 range
  let maxY = 0;
  const pts = Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const y = fn(t);
    if (y > maxY) maxY = y;
    return { t, y };
  });
  const line = pts
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"}${sx(p.t).toFixed(1)},${sy(maxY > 0 ? (p.y / maxY) * 0.85 : 0).toFixed(1)}`
    )
    .join(" ");
  return `${line} L${sx(1).toFixed(1)},${sy(0).toFixed(1)} L${sx(0).toFixed(1)},${sy(0).toFixed(1)} Z`;
}

/* ── Segment bands ───────────────────────────────────────── */
const BANDS = SEGMENTS.map((seg, i) => ({
  id: seg.id,
  color: seg.color,
  x0: i / SEGMENTS.length,
  x1: (i + 1) / SEGMENTS.length,
}));

/* ── Colors ──────────────────────────────────────────────── */
const REACH_COLOR = "#67d4e8";
const IMPACT_COLOR = "#f0b429";
const TOTAL_COLOR = "#c084fc";

/* ── Example data ────────────────────────────────────────── */
const EXAMPLES = {
  left: {
    title: "\u201CTech oligarchs are bad\u201D",
    reachLabel: "5M views",
    reachBar: 1.0,
    impactLabel: "0.20 activation rate",
    impactBar: 0.20,
    totalLabel: "~1M activated",
    xPos: 0.12,
  },
  right: {
    title: "\u201CAI could end civilization\u201D",
    reachLabel: "50K views",
    reachBar: 0.15,
    impactLabel: "0.85 activation rate",
    impactBar: 0.85,
    totalLabel: "~42.5K activated",
    xPos: 0.82,
  },
};

/* ── Peak of total-impact curve ──────────────────────────── */
const totalPts = Array.from({ length: STEPS + 1 }, (_, i) => {
  const t = i / STEPS;
  return { t, y: totalFn(t) };
});
const totalMax = Math.max(...totalPts.map((p) => p.y));
const peakPt = totalPts.reduce((a, b) => (b.y > a.y ? b : a));
const PEAK_T = peakPt.t;
const PEAK_Y = (peakPt.y / totalMax) * 0.85;

/* ── Example callout sub-component ───────────────────────── */
function ExampleCallout({
  example,
  reachBarScale,
  impactBarScale,
  impactOpacity,
}: {
  example: (typeof EXAMPLES)["left"];
  reachBarScale: MotionValue<number>;
  impactBarScale: MotionValue<number>;
  impactOpacity: MotionValue<number>;
}) {
  const reachW = useTransform(reachBarScale, [0, 1], [0, example.reachBar * 130]);
  const impactW = useTransform(
    impactBarScale,
    [0, 1],
    [0, example.impactBar * 130]
  );

  return (
    <div
      style={{
        fontSize: 11,
        color: "#f0ece2",
        background: "rgba(13,13,20,0.92)",
        borderRadius: 8,
        padding: "10px 12px",
        border: "1px solid rgba(255,255,255,0.1)",
        fontFamily: "var(--font-dm-sans)",
      }}
    >
      <div
        style={{
          fontWeight: 600,
          marginBottom: 8,
          lineHeight: 1.3,
          fontSize: 12,
        }}
      >
        {example.title}
      </div>

      {/* Reach bar */}
      <div style={{ marginBottom: 6 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 9,
            color: "#888",
            marginBottom: 2,
          }}
        >
          <span>Reach</span>
          <span>{example.reachLabel}</span>
        </div>
        <motion.div
          style={{
            height: 6,
            borderRadius: 3,
            backgroundColor: REACH_COLOR,
            width: reachW,
          }}
        />
      </div>

      {/* Impact bar — appears when yellow line draws */}
      <motion.div style={{ opacity: impactOpacity }}>
        <div style={{ marginBottom: 6 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 9,
              color: "#888",
              marginBottom: 2,
            }}
          >
            <span>Impact / person</span>
            <span>{example.impactLabel}</span>
          </div>
          <motion.div
            style={{
              height: 6,
              borderRadius: 3,
              backgroundColor: IMPACT_COLOR,
              width: impactW,
            }}
          />
        </div>

        {/* Total */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 6,
            marginTop: 6,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
          }}
        >
          <span style={{ color: "#888" }}>Total activated</span>
          <span style={{ fontWeight: 700, color: TOTAL_COLOR }}>
            {example.totalLabel}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Content funnel data ─────────────────────────────────── */
const FUNNEL_BANDS = [
  {
    color: SEGMENTS[0].color, // #2d6a4f
    items: ["Memes", "Viral clips", "AI-generated funny videos", "Shock & humor content"],
  },
  {
    color: SEGMENTS[1].color, // #52b788
    items: ["AI capability demos", "Robot acrobatics", "Disturbing AI videos", "Dystopian AI content"],
  },
  {
    color: SEGMENTS[2].color, // #f4a261
    items: ["Animated explainers", "Tech-oligarch criticism", "Environmental impact", "AI safety interviews"],
  },
  {
    color: SEGMENTS[3].color, // #e07a5f
    items: ["Podcasts", "Documentary clips", "CEO / luminary interviews", "Online courses"],
  },
  {
    color: SEGMENTS[4].color, // #b5280f
    items: ["Academic papers", "Research evidence", "Debates & rational arguments", "Misalignment data"],
  },
  {
    color: SEGMENTS[5].color, // #6b1114
    items: ["Discord servers", "Community meetings", "Direct action groups", "Volunteering networks"],
  },
];

/* Funnel spans the full section width; straight-line taper */
const FUNNEL_W = 900;
const FUNNEL_H = 500;
const FUNNEL_TOP_W = 880; // nearly fills viewBox at top
const FUNNEL_BOT_W = 80;
const FUNNEL_CX = FUNNEL_W / 2;

function funnelWidthAtY(y: number) {
  // Straight-line taper — single angle from top to bottom
  const t = y / FUNNEL_H;
  return FUNNEL_TOP_W - (FUNNEL_TOP_W - FUNNEL_BOT_W) * t;
}

function ContentFunnel() {
  const bandH = FUNNEL_H / FUNNEL_BANDS.length;

  return (
    <svg
      viewBox={`0 0 ${FUNNEL_W} ${FUNNEL_H + 40}`}
      className="w-full block"
      preserveAspectRatio="xMidYMid meet"
      aria-label="Content funnel — types of content at each X-risk level"
    >
      {FUNNEL_BANDS.map((band, i) => {
        const y0 = i * bandH;
        const y1 = (i + 1) * bandH;
        const w0 = funnelWidthAtY(y0);
        const w1 = funnelWidthAtY(y1);
        const xl0 = FUNNEL_CX - w0 / 2;
        const xr0 = FUNNEL_CX + w0 / 2;
        const xl1 = FUNNEL_CX - w1 / 2;
        const xr1 = FUNNEL_CX + w1 / 2;
        const midW = (w0 + w1) / 2;

        return (
          <g key={i}>
            {/* Band fill */}
            <path
              d={`M${xl0},${y0} L${xr0},${y0} L${xr1},${y1} L${xl1},${y1} Z`}
              fill={band.color}
              opacity={0.55}
            />
            {/* Separator line (except last band) */}
            {i < FUNNEL_BANDS.length - 1 && (
              <line
                x1={xl1}
                y1={y1}
                x2={xr1}
                y2={y1}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth={1}
              />
            )}
            {/* Text labels — shifted left so they stay clear of the text overlay */}
            {band.items.map((item, j) => {
              const lineH = bandH / (band.items.length + 0.6);
              const textY = y0 + lineH * (j + 0.9);
              return (
                <text
                  key={j}
                  x={FUNNEL_CX}
                  y={textY}
                  textAnchor="middle"
                  fill="#f0ece2"
                  fontSize={midW > 200 ? 12 : 10}
                  fontFamily="var(--font-dm-sans)"
                  opacity={0.85}
                >
                  {item}
                </text>
              );
            })}
          </g>
        );
      })}
      {/* Side labels */}
      <text
        x={12}
        y={24}
        fill="#888"
        fontSize={10}
        fontFamily="var(--font-dm-sans)"
        textAnchor="start"
      >
        Easy to share
      </text>
      <text
        x={FUNNEL_CX}
        y={FUNNEL_H + 25}
        fill="#888"
        fontSize={12}
        fontFamily="var(--font-dm-sans)"
        textAnchor="middle"
      >
        Deep commitment
      </text>
    </svg>
  );
}

/* ── Main section ────────────────────────────────────────── */
export default function Section04a_Strategies() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const slowScrollRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: scrollAreaRef,
    offset: ["start end", "end start"],
  });

  // Half-speed scroll for header + boxes area
  const { scrollYProgress: slowProgress } = useScroll({
    target: slowScrollRef,
    offset: ["start end", "end start"],
  });
  // Push content down as page scrolls up, counteracting half the scroll distance.
  // Total travel = 130vh + 100vh = 230vh. Header reaches viewport center at ~50vh/230vh ≈ 0.22.
  // No parallax before that → normal scroll until "Strategies" is centered, then half-speed.
  const slowY = useTransform(slowProgress, (v) => {
    if (typeof window === "undefined") return 0;
    const vh = window.innerHeight;
    const threshold = 50 / 230; // header at viewport center (~0.22)
    if (v <= threshold) return 0;
    const t = (v - threshold) / (1 - threshold);
    return t * 0.9 * vh;
  });

  /* ── Phase timings (recalibrated for 400vh scroll area) ──
   * Total travel = 400vh + 100vh = 500vh
   * Sticky pins at progress ~0.20 (100vh / 500vh)
   * Usable sticky range: 0.20–0.80
   *
   * 0.08–0.13  section + title fade in (faster, less dead space)
   * 0.14–0.30  spectrum bands + reach curve draws
   * 0.17–0.38  reach explanation boxes (sequential)
   * 0.21–0.34  callout cards + bars appear
   * 0.36–0.52  impact-per-person curve draws
   * 0.36–0.59  impact explanation boxes (sequential)
   * 0.55–0.59  callouts + explanation boxes fade out
   * 0.58–0.70  total-impact filled area + text + dot
   * 0.70–0.80  total impact visible, then sticky ends
   * ───────────────────────────────────────────────────── */

  // Section envelope — fades in earlier for less dead space
  const sectionOpacity = useTransform(
    scrollYProgress,
    [0.08, 0.13],
    [0, 1],
    { clamp: true }
  );

  // Title — fades in quickly after section appears
  const titleOpacity = useTransform(
    scrollYProgress,
    [0.10, 0.14],
    [0, 1],
    { clamp: true }
  );
  const titleY = useTransform(scrollYProgress, [0.10, 0.14], [40, 0]);

  // Spectrum bands
  const bandsOpacity = useTransform(
    scrollYProgress,
    [0.14, 0.19],
    [0, 0.15],
    { clamp: true }
  );

  // Reach curve
  const reachPathLength = useTransform(
    scrollYProgress,
    [0.17, 0.30],
    [0, 1],
    { clamp: true }
  );
  const reachLabelOpacity = useTransform(
    scrollYProgress,
    [0.26, 0.30],
    [0, 1],
    { clamp: true }
  );
  // 1) High-reach box (left green) — first, as blue line starts; stays until impact boxes fade
  const reachTextOpacity = useTransform(
    scrollYProgress,
    [0.17, 0.22, 0.55, 0.59],
    [0, 1, 1, 0]
  );
  // 2) Low-reach box (right red) — shortly after; stays until impact boxes fade
  const reachRightTextOpacity = useTransform(
    scrollYProgress,
    [0.24, 0.29, 0.55, 0.59],
    [0, 1, 1, 0]
  );

  // Impact curve
  const impactPathLength = useTransform(
    scrollYProgress,
    [0.36, 0.52],
    [0, 1],
    { clamp: true }
  );
  const impactLabelOpacity = useTransform(
    scrollYProgress,
    [0.47, 0.52],
    [0, 1],
    { clamp: true }
  );
  // 3) Low-impact box (left green) — as yellow line starts
  const impactLeftTextOpacity = useTransform(
    scrollYProgress,
    [0.36, 0.40, 0.55, 0.59],
    [0, 1, 1, 0]
  );
  // 4) High-impact box (right gold) — last to appear
  const impactTextOpacity = useTransform(
    scrollYProgress,
    [0.43, 0.48, 0.55, 0.59],
    [0, 1, 1, 0]
  );

  // Example callout cards (overlaid on chart) — span both reach + impact phases
  const leftCalloutOpacity = useTransform(
    scrollYProgress,
    [0.21, 0.26, 0.55, 0.59],
    [0, 1, 1, 0]
  );
  const rightCalloutOpacity = useTransform(
    scrollYProgress,
    [0.24, 0.30, 0.55, 0.59],
    [0, 1, 1, 0]
  );
  // Reach bars — animate with the blue line phase
  const leftReachBarScale = useTransform(
    scrollYProgress,
    [0.21, 0.30],
    [0, 1],
    { clamp: true }
  );
  const rightReachBarScale = useTransform(
    scrollYProgress,
    [0.24, 0.34],
    [0, 1],
    { clamp: true }
  );

  // Impact bars — animate with the yellow line phase
  const leftImpactBarScale = useTransform(
    scrollYProgress,
    [0.36, 0.45],
    [0, 1],
    { clamp: true }
  );
  const rightImpactBarScale = useTransform(
    scrollYProgress,
    [0.36, 0.45],
    [0, 1],
    { clamp: true }
  );

  // Impact section opacity in callout cards — fade in when yellow line starts
  const leftImpactSectionOpacity = useTransform(
    scrollYProgress,
    [0.36, 0.40],
    [0, 1],
    { clamp: true }
  );
  const rightImpactSectionOpacity = useTransform(
    scrollYProgress,
    [0.36, 0.40],
    [0, 1],
    { clamp: true }
  );

  // Total impact area
  const totalAreaOpacity = useTransform(
    scrollYProgress,
    [0.58, 0.66],
    [0, 0.45],
    { clamp: true }
  );
  const totalTextOpacity = useTransform(
    scrollYProgress,
    [0.61, 0.68],
    [0, 1],
    { clamp: true }
  );
  const peakDotScale = useTransform(
    scrollYProgress,
    [0.64, 0.70],
    [0, 1],
    { clamp: true }
  );

  /* ── Paths (memoized) ─────────────────────────────────── */
  const reachPath = useMemo(() => generatePath(reachFn, STEPS), []);
  const impactPath = useMemo(() => generatePath(impactFn, STEPS), []);
  const totalAreaPath = useMemo(() => generateAreaPath(totalFn, STEPS), []);

  return (
    <section id="strategies">
      {/* ── Half-speed scroll wrapper: 130vh tall, content translates at 0.5× scroll rate ── */}
      <div ref={slowScrollRef} className="relative overflow-hidden" style={{ height: "130vh" }}>
        <motion.div style={{ y: slowY }}>
          {/* ── Section header ── */}
          <div className="py-24 px-4 sm:px-8 lg:px-16 text-center">
            <h2 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-text">
              Strategies
            </h2>
          </div>

          {/* ── Three strategic priorities ── */}
          <div className="px-4 sm:px-8 lg:px-16 pb-16 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Organic growth */}
              <div
                className="rounded-xl p-4 border"
                style={{
                  background: "rgba(82,183,136,0.08)",
                  borderColor: "rgba(82,183,136,0.2)",
                }}
              >
                <p className="text-base font-semibold mb-1.5" style={{ color: "#52b788" }}>
                  Organic Growth
                </p>
                <p className="text-sm text-text-muted leading-relaxed">
                  The gift that keeps on giving. Every person who truly grasps the
                  risk becomes a broadcaster in their own right&nbsp;&mdash;
                  reaching audiences no ad budget ever could.
                </p>
              </div>

              {/* Cross-pollination */}
              <div
                className="rounded-xl p-4 border"
                style={{
                  background: "rgba(192,132,252,0.08)",
                  borderColor: "rgba(192,132,252,0.2)",
                }}
              >
                <p className="text-base font-semibold mb-1.5" style={{ color: "#c084fc" }}>
                  Cross-Pollinate Distribution
                </p>
                <p className="text-sm text-text-muted leading-relaxed">
                  Maximize every piece of content that has already proven it can go
                  viral. A story that blew up on r/openai gets posted to
                  r/anthropic. A viral X thread becomes an Instagram
                  carousel for a creator with a matching audience.
                  Proven content, new eyeballs.
                </p>
              </div>

              {/* In-house muscle */}
              <div
                className="rounded-xl p-4 border"
                style={{
                  background: "rgba(224,122,95,0.08)",
                  borderColor: "rgba(224,122,95,0.2)",
                }}
              >
                <p className="text-base font-semibold mb-1.5" style={{ color: "#e07a5f" }}>
                  Build In-House Muscle
                </p>
                <p className="text-sm text-text-muted leading-relaxed">
                  Don&rsquo;t outsource the movement. Develop internal capabilities
                  &nbsp;&mdash; content creators, community managers, data
                  analysts&nbsp;&mdash; so the mission stays authentic and
                  self-sustaining.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Scroll-driven animated area ── */}
      <div
        ref={scrollAreaRef}
        className="relative"
        style={{ height: "400vh" }}
      >
        <motion.div
          className="sticky top-12 z-20 h-[calc(100vh-3rem)] flex flex-col items-center justify-start pt-8 px-4 sm:px-8 lg:px-16 overflow-hidden bg-bg"
          style={{ opacity: sectionOpacity }}
        >
          {/* ── Title — persistent above chart ── */}
          <motion.div
            className="w-full max-w-3xl text-center mb-4 z-20 shrink-0"
            style={{ opacity: titleOpacity, y: titleY }}
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text mb-2">
              The Engagement Trade-Off
            </h2>
            <p className="text-sm text-text-muted leading-relaxed">
              Why easy-to-share content and real-world impact pull in opposite
              directions&nbsp;&mdash; and what it means for strategy.
            </p>
          </motion.div>

          {/* ── Reach explanation row (above chart) ── */}
          <div className="w-full max-w-4xl shrink-0 mb-2">
            <div className="grid grid-cols-2 gap-x-4">
              <motion.div
                className="pointer-events-none"
                style={{ opacity: reachTextOpacity }}
              >
                <p
                  className="text-xs text-text-muted leading-relaxed rounded-lg p-2.5"
                  style={{
                    background: "rgba(45,106,79,0.15)",
                    border: "1px solid rgba(82,183,136,0.2)",
                  }}
                >
                  <span style={{ color: "#52b788" }} className="font-semibold">
                    Reach
                  </span>{" "}
                  peaks at low X-risk. Content about tech billionaires, job loss,
                  or AI bias goes viral easily.
                </p>
              </motion.div>
              <motion.div
                className="pointer-events-none"
                style={{ opacity: reachRightTextOpacity }}
              >
                <p
                  className="text-xs text-text-muted leading-relaxed rounded-lg p-2.5"
                  style={{
                    background: "rgba(107,17,20,0.18)",
                    border: "1px solid rgba(155,34,38,0.25)",
                  }}
                >
                  <span style={{ color: "#e07a5f" }} className="font-semibold">
                    Reach drops off
                  </span>{" "}
                  at high X-risk. Existential risk sounds like sci-fi&nbsp;&mdash;
                  abstract, not relatable.
                </p>
              </motion.div>
            </div>
          </div>

          {/* ── SVG chart with callout cards overlaid ── */}
          <div className="w-full max-w-4xl relative shrink-0">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full block"
              aria-label="Engagement vs Impact trade-off"
            >
              {/* Segment background bands */}
              {BANDS.map((band) => (
                <motion.rect
                  key={band.id}
                  x={sx(band.x0)}
                  y={PAD.top}
                  width={(band.x1 - band.x0) * CW}
                  height={CH}
                  fill={band.color}
                  style={{ opacity: bandsOpacity }}
                />
              ))}

              {/* X axis line */}
              <line
                x1={PAD.left}
                y1={sy(0)}
                x2={PAD.left + CW}
                y2={sy(0)}
                stroke="#555"
                strokeWidth="1"
              />

              {/* X-axis labels */}
              <text
                x={sx(0.02)}
                y={sy(0) + 22}
                fill="#888"
                fontSize="10"
                fontFamily="var(--font-dm-sans)"
                textAnchor="start"
              >
                Easy to go viral
              </text>
              <text
                x={sx(0.98)}
                y={sy(0) + 22}
                fill="#888"
                fontSize="10"
                fontFamily="var(--font-dm-sans)"
                textAnchor="end"
              >
                Hard to resonate
              </text>
              <text
                x={sx(0.5)}
                y={sy(0) + 38}
                fill="#555"
                fontSize="10"
                fontFamily="var(--font-dm-sans)"
                textAnchor="middle"
              >
                X-Risk Spectrum &rarr;
              </text>

              {/* Total impact filled area */}
              <motion.path
                d={totalAreaPath}
                fill={TOTAL_COLOR}
                style={{ opacity: totalAreaOpacity }}
              />

              {/* Reach curve */}
              <motion.path
                d={reachPath}
                fill="none"
                stroke={REACH_COLOR}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ pathLength: reachPathLength }}
              />

              {/* Impact per person curve */}
              <motion.path
                d={impactPath}
                fill="none"
                stroke={IMPACT_COLOR}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ pathLength: impactPathLength }}
              />

              {/* ── Legend ── */}
              <motion.g style={{ opacity: reachLabelOpacity }}>
                <line
                  x1={W - 175}
                  y1={PAD.top + 14}
                  x2={W - 150}
                  y2={PAD.top + 14}
                  stroke={REACH_COLOR}
                  strokeWidth={3}
                />
                <text
                  x={W - 145}
                  y={PAD.top + 18}
                  fill={REACH_COLOR}
                  fontSize="11"
                  fontFamily="var(--font-dm-sans)"
                >
                  Reach (views)
                </text>
              </motion.g>
              <motion.g style={{ opacity: impactLabelOpacity }}>
                <line
                  x1={W - 175}
                  y1={PAD.top + 32}
                  x2={W - 150}
                  y2={PAD.top + 32}
                  stroke={IMPACT_COLOR}
                  strokeWidth={3}
                />
                <text
                  x={W - 145}
                  y={PAD.top + 36}
                  fill={IMPACT_COLOR}
                  fontSize="11"
                  fontFamily="var(--font-dm-sans)"
                >
                  Impact per person
                </text>
              </motion.g>

              {/* ── Example annotation dashed lines ── */}
              <motion.line
                x1={sx(EXAMPLES.left.xPos)}
                y1={PAD.top}
                x2={sx(EXAMPLES.left.xPos)}
                y2={sy(0)}
                stroke="#fff"
                strokeWidth="1"
                strokeDasharray="4 3"
                style={{ opacity: leftCalloutOpacity }}
              />
              <motion.line
                x1={sx(EXAMPLES.right.xPos)}
                y1={PAD.top}
                x2={sx(EXAMPLES.right.xPos)}
                y2={sy(0)}
                stroke="#fff"
                strokeWidth="1"
                strokeDasharray="4 3"
                style={{ opacity: rightCalloutOpacity }}
              />

              {/* Peak dot on total impact curve */}
              <motion.circle
                cx={sx(PEAK_T)}
                cy={sy(PEAK_Y)}
                r={6}
                fill={TOTAL_COLOR}
                stroke="#fff"
                strokeWidth={2}
                style={{
                  scale: peakDotScale,
                  opacity: totalAreaOpacity,
                }}
              />
            </svg>

            {/* ── Callout cards overlaid on chart (positioned at vertical middle, pushed to edges) ── */}
            <motion.div
              className="absolute left-0 pointer-events-none"
              style={{ opacity: leftCalloutOpacity, top: "35%", width: "22%" }}
            >
              <ExampleCallout
                example={EXAMPLES.left}
                reachBarScale={leftReachBarScale}
                impactBarScale={leftImpactBarScale}
                impactOpacity={leftImpactSectionOpacity}
              />
            </motion.div>
            <motion.div
              className="absolute right-0 pointer-events-none"
              style={{ opacity: rightCalloutOpacity, top: "35%", width: "22%" }}
            >
              <ExampleCallout
                example={EXAMPLES.right}
                reachBarScale={rightReachBarScale}
                impactBarScale={rightImpactBarScale}
                impactOpacity={rightImpactSectionOpacity}
              />
            </motion.div>
          </div>

          {/* ── Below-chart area (impact explanation boxes + total impact text) ── */}
          <div className="w-full max-w-4xl relative mt-2 shrink-0">
            {/* Impact explanation row */}
            <div className="grid grid-cols-2 gap-x-4">
              <motion.div
                className="pointer-events-none"
                style={{ opacity: impactLeftTextOpacity }}
              >
                <p
                  className="text-xs text-text-muted leading-relaxed rounded-lg p-2.5"
                  style={{
                    background: "rgba(45,106,79,0.15)",
                    border: "1px solid rgba(82,183,136,0.2)",
                  }}
                >
                  <span style={{ color: "#52b788" }} className="font-semibold">
                    Low impact
                  </span>{" "}
                  at low X-risk. Nobody takes to the streets just because they
                  dislike Zuckerberg.
                </p>
              </motion.div>
              <motion.div
                className="pointer-events-none"
                style={{ opacity: impactTextOpacity }}
              >
                <p
                  className="text-xs text-text-muted leading-relaxed rounded-lg p-2.5"
                  style={{
                    background: "rgba(107,17,20,0.18)",
                    border: "1px solid rgba(155,34,38,0.25)",
                  }}
                >
                  <span style={{ color: IMPACT_COLOR }} className="font-semibold">
                    Impact per person
                  </span>{" "}
                  rises exponentially toward high X-risk. Those who grasp it will
                  move heaven and earth.
                </p>
              </motion.div>
            </div>

            {/* Total impact text — overlays the same area after boxes fade out */}
            <motion.div
              className="absolute inset-0 flex items-start justify-center z-20 pointer-events-none"
              style={{ opacity: totalTextOpacity }}
            >
              <div className="max-w-lg text-center">
                <p className="text-sm text-text leading-relaxed bg-bg/80 rounded-lg p-4 border border-white/10">
                  <span style={{ color: TOTAL_COLOR }} className="font-semibold">
                    Total Impact
                  </span>{" "}
                  = Reach &times; Impact per Person. Each unit of attention invested
                  in high x-risk content delivers exponentially more real-world
                  change than easy viral content.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ── Normal flow: conclusion + strategy (scrolls naturally) ── */}
      <div className="relative z-30 bg-bg px-4 sm:px-8 lg:px-16 pt-10 pb-20 max-w-7xl mx-auto -mt-[11vh]">
        {/* Conclusion — full width */}
        <div className="text-center mb-8">
          <p className="text-lg sm:text-2xl text-text leading-snug font-heading font-bold mb-2">
            This is why we cannot ignore the high X-risk side of the spectrum.
          </p>
          <p className="text-sm sm:text-base text-text-muted leading-relaxed">
            Not because it&rsquo;s easy
          </p>
          <p className="text-sm sm:text-base text-text-muted leading-relaxed mt-1 max-w-lg mx-auto">
            but because each person who responds to this content becomes
            a force multiplier that no amount of viral content can match.
          </p>
        </div>

        {/* Strategy heading — full width */}
        <p id="meet-people" className="text-2xl sm:text-3xl lg:text-4xl text-text leading-snug font-heading font-bold mb-6 mt-20 text-center">
          The Strategy: Meet People Where They Are
        </p>

        {/* Funnel + text — funnel spans full width, text overlaid on right */}
        <div className="relative overflow-hidden">
          {/* Funnel background — shifted left so it centers under the labels */}
          <div style={{ transform: "translateX(-22%)" }}>
            <ContentFunnel />
          </div>

          {/* Text overlay — sits over the right portion of the funnel */}
          <div className="lg:absolute lg:top-0 lg:h-full lg:w-[42%] flex items-center" style={{ left: "55%" }}>
            <div className="py-6 lg:py-0 lg:pl-4 lg:pr-4 rounded-xl" style={{ background: "rgba(13,13,20,0.82)", padding: "24px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-base text-text-muted leading-relaxed mb-4">
                The best approach is to strategically target different audiences
                with content at different levels of X-risk seriousness and academic
                rigor. When infiltrating communities online&nbsp;&mdash; for
                example broadcasting across thousands of subreddit
                communities&nbsp;&mdash; people who are unaware of the risks are
                not ready to be hit head-on with existential horrors.
              </p>
              <p className="text-base text-text-muted leading-relaxed mb-4">
                They respond more to{" "}
                <span className="text-text font-medium">
                  humour, playful memes, tech-oligarch clips, and environmental
                  impact
                </span>
                . These are the entry points.
              </p>
              <p className="text-base text-text-muted leading-relaxed">
                Once they become members of{" "}
                <span className="text-text font-medium">AIDangers</span> and other
                Lethal Intelligence platforms, they get increasingly exposed to the
                real darkness&nbsp;&mdash; guided through the journey of becoming
                truly alarmed. And then most of the work is done, because they will
                do anything in their power to have an impact themselves: join the{" "}
                <span className="text-text font-medium">
                  AI Risk Awareness Force
                </span>
                , commit volunteering work to groups like{" "}
                <span className="text-text font-medium">Human First</span>, and
                become advocates in their own right.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
