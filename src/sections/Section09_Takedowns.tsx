"use client";

import { useRef, useState, memo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useInView,
  AnimatePresence,
  type MotionValue,
} from "framer-motion";
import {
  SKEPTICISMS,
  clusterMap,
  TOTAL_COUNT,
} from "@/data/skepticisms";

/* ── Story data (for Part 2) ─────────────────────────────── */

const STORIES = [
  {
    character: "Paul",
    role: "Emily\u2019s husband",
    accent: "#2d6a4f",
    accentBg: "rgba(45,106,79,0.15)",
    accentBorder: "rgba(82,183,136,0.2)",
    denial: `"Don\u2019t worry, actual superintelligence will not happen for the next 100 years. AGI will be delayed by the massive infrastructure requirements\u2014the need for extensive new data centers and power plants. There will not be enough energy on the planet to power it."`,
    argNumber: 10,
    argLabel: "Infrastructure delays make ASI impossible",
    experts: ["Dan Hendrycks", "Max Tegmark"],
    mechanism:
      "Emily introduces the AI Takedowns page. They navigate to argument #10. Dan Hendrycks\u2019 response plays first\u2014sharp, concise, 5 minutes. Then Max Tegmark offers a different angle. The playlist continues with more luminaries, all targeting this SPECIFIC sticking point.",
    outcome:
      "Paul realizes his theory is shaky. He watches more Takedowns, grows curious about the Humans First movement, and a few weeks later joins Emily in spreading AI risk awareness.",
    outcomeHighlight: "Fully converted. Joins the movement.",
  },
  {
    character: "Peter",
    role: "Paul\u2019s colleague",
    accent: "#52b788",
    accentBg: "rgba(82,183,136,0.12)",
    accentBorder: "rgba(82,183,136,0.2)",
    denial: `"If AI becomes super-intelligent, it will be good. Intelligence yields moral goodness. Smarter people make better moral choices."`,
    argNumber: 24,
    argLabel: "Intelligence yields moral goodness",
    secondDenial: `"Okay, but AI can\u2019t want things. \u2018Wanting\u2019 is a uniquely human trait tied to biology and consciousness."`,
    secondArgNumber: 43,
    secondArgLabel: "AI can\u2019t truly \u2018want\u2019 things",
    experts: ["Max Tegmark", "Dan Hendrycks"],
    mechanism:
      "Paul shares playlist #24. Peter watches each luminary give a 5-minute analysis. He counters with another argument\u2014Paul responds with playlist #43. Nobel laureates and top scientists make their case.",
    outcome:
      "That night, Peter can\u2019t sleep. He spends hours reading, watching long interviews, and exploring content like the Lethal Intelligence movie. Weeks later, he becomes a leader in the Humans First movement.",
    outcomeHighlight: "Becomes a movement leader.",
  },
  {
    character: "Organizations",
    role: "Inter-org coordination",
    accent: "#f4a261",
    accentBg: "rgba(244,162,97,0.12)",
    accentBorder: "rgba(244,162,97,0.25)",
    denial: null,
    argNumber: null,
    argLabel: null,
    experts: [],
    mechanism:
      "Contributing to this library is one of the lowest-effort, highest-impact things any organization can do. Michael conducts podcast-style sessions with each participant. Arguments are shared in advance. Recordings are cut into clips targeting each specific argument.",
    outcome:
      "Once a few well-recognized names participate, momentum builds. This collaborative project sparks conversations across the ecosystem, fostering a sense of shared vision and collective effort. The bonds between organizations strengthen.",
    outcomeHighlight: "Unity across the AI safety ecosystem.",
  },
  {
    character: "The Movement",
    role: "Humans First deployment",
    accent: "#e07a5f",
    accentBg: "rgba(224,122,95,0.12)",
    accentBorder: "rgba(224,122,95,0.25)",
    denial: null,
    argNumber: null,
    argLabel: null,
    experts: [],
    mechanism:
      "100+ short videos addressing very specific denial arguments, released across all platforms\u2014Reddit, X, Threads, Bluesky, YouTube. Any dismissive comment receives a tailored-made response: a link to a playlist of rebuttals by thought-leaders, addressing specifically that comment.",
    outcome:
      "An infinite content glitch: endless original, high-quality AI safety content. The library is alive\u2014new responses added every two weeks, community voting surfaces the most convincing for each argument. Volunteers master the best arguments and deploy them in live conversations.",
    outcomeHighlight: "The most powerful tool in our arsenal.",
  },
  {
    character: "Elon Musk",
    role: "Industry leader",
    accent: "#67d4e8",
    accentBg: "rgba(103,212,232,0.10)",
    accentBorder: "rgba(103,212,232,0.2)",
    denial: `"ASI will value us because of curiosity. An unaligned ASI would preserve humanity out of a drive for learning, given the complexity of 8 billion humans. ASI will be like a benevolent scientist, fascinated by our social webs and behaviors."`,
    argNumber: 62,
    argLabel: "ASI will preserve us out of curiosity",
    experts: [],
    agreeCount: 100,
    stickingPoint: 62,
    mechanism:
      "Agrees with 100 of 101 Takedowns. Advocates for all of them\u2014except #62, where he provides the optimistic \u201Csteelman.\u201D His millions of admirers discover AI Takedowns exists and get exposed to the best arguments by the best minds in the field.",
    outcome:
      "Each of those millions of followers has their own specific sticking point. The ultimate rebuttal to their argument finds them\u2014optimized to convince, delivered by the best minds. They don\u2019t stand a chance resisting conversion.",
    outcomeHighlight: "Millions onboarded in droves.",
  },
  {
    character: "Emmanuel Macron",
    role: "World leader",
    accent: "#c084fc",
    accentBg: "rgba(192,132,252,0.10)",
    accentBorder: "rgba(192,132,252,0.2)",
    denial: `"China will build ASI due to game theory. International coordination is doomed because China will race ahead, driven by a prisoner\u2019s dilemma. Just like Cold War arms races, mutual distrust leads to inevitable escalation."`,
    argNumber: 71,
    argLabel: "China will build ASI regardless (game theory)",
    experts: [],
    agreeCount: 100,
    stickingPoint: 71,
    mechanism:
      "Like Musk, agrees with 100 Takedowns but has a sticking point at #71. His global audience\u2014fans and critics alike\u2014now knows AI Takedowns exists, and that the Humans First movement is THE PATH to action.",
    outcome:
      "Everyone consumes this highly optimized, targeted content. AI safety policy becomes a hot political topic. The Overton window is wide open. The world has changed forever.",
    outcomeHighlight: "The Overton window is wide open.",
  },
];

/* ── Precomputed lookups ─────────────────────────────────── */

const GRID_COLS = 10;
const tileColors = SKEPTICISMS.map(
  (s) => clusterMap[s.clusterId]?.color ?? "#888"
);
const indexToCluster = SKEPTICISMS.map((s) => clusterMap[s.clusterId]);

/* ── Single grid tile (memo'd for perf) ──────────────────── */

const SkeptTile = memo(function SkeptTile({
  index,
  x,
  y,
  size,
  color,
  fillProgress,
}: {
  index: number;
  x: number;
  y: number;
  size: number;
  color: string;
  fillProgress: MotionValue<number>;
}) {
  const t = index / TOTAL_COUNT;
  const opacity = useTransform(fillProgress, [t - 0.003, t + 0.003], [0.08, 0.7]);
  return (
    <motion.rect
      x={x}
      y={y}
      width={size}
      height={size}
      rx={3}
      fill={color}
      style={{ opacity }}
    />
  );
});

/* ── Memoized tile layer ─────────────────────────────────── */

const MemoizedTiles = memo(function MemoizedTiles({
  fillProgress,
  tileSize,
  gap,
}: {
  fillProgress: MotionValue<number>;
  tileSize: number;
  gap: number;
}) {
  return (
    <>
      {SKEPTICISMS.map((_, i) => (
        <SkeptTile
          key={i}
          index={i}
          x={(i % GRID_COLS) * (tileSize + gap)}
          y={Math.floor(i / GRID_COLS) * (tileSize + gap)}
          size={tileSize}
          color={tileColors[i]}
          fillProgress={fillProgress}
        />
      ))}
    </>
  );
});

/* ── Grid component ──────────────────────────────────────── */

function SkeptGrid({
  fillProgress,
  activeIndex,
  className = "",
}: {
  fillProgress: MotionValue<number>;
  activeIndex: number;
  className?: string;
}) {
  const tileSize = 24;
  const gap = 4;
  const rows = Math.ceil(TOTAL_COUNT / GRID_COLS);
  const svgW = GRID_COLS * (tileSize + gap) - gap;
  const svgH = rows * (tileSize + gap) - gap;

  const col = activeIndex % GRID_COLS;
  const row = Math.floor(activeIndex / GRID_COLS);
  const color = tileColors[activeIndex] ?? "#fff";

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      className={className}
      aria-label="100 AI risk denial arguments grid"
    >
      <defs>
        <filter id="tileGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <MemoizedTiles
        fillProgress={fillProgress}
        tileSize={tileSize}
        gap={gap}
      />

      {/* Active tile glow */}
      <rect
        x={col * (tileSize + gap) - 3}
        y={row * (tileSize + gap) - 3}
        width={tileSize + 6}
        height={tileSize + 6}
        rx={5}
        fill={color}
        filter="url(#tileGlow)"
        opacity={0.95}
      />
      {/* Active tile border ring */}
      <rect
        x={col * (tileSize + gap) - 1}
        y={row * (tileSize + gap) - 1}
        width={tileSize + 2}
        height={tileSize + 2}
        rx={4}
        fill="none"
        stroke="#fff"
        strokeWidth={1.5}
        opacity={0.5}
      />
    </svg>
  );
}

/* ── Detail panel ────────────────────────────────────────── */

function SkeptDetail({ activeIndex }: { activeIndex: number }) {
  const item = SKEPTICISMS[activeIndex];
  const cluster = indexToCluster[activeIndex];

  return (
    <div className="relative min-h-[180px] sm:min-h-[220px]">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {/* Cluster badge */}
          <div className="mb-4">
            <span
              className="text-[11px] font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full"
              style={{
                color: cluster?.color,
                background: cluster?.colorDim,
              }}
            >
              {cluster?.label}
            </span>
          </div>

          {/* Title */}
          <h4 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-text leading-tight mb-3">
            {item.title}
          </h4>

          {/* Description */}
          <p className="text-sm sm:text-base text-text-muted leading-relaxed">
            &ldquo;{item.description}&rdquo;
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── Lazy-loaded GIF hero ────────────────────────────────── */

function TakedownsHero() {
  const ref = useRef<HTMLDivElement>(null);
  // Start loading the GIF when ~600px before it enters the viewport
  const isNear = useInView(ref, { once: true, margin: "600px 0px 600px 0px" });

  return (
    <div
      ref={ref}
      className="px-4 sm:px-8 lg:px-16 pt-20 pb-0 max-w-5xl mx-auto text-center"
    >
      {/* GIF container — fixed aspect ratio placeholder to prevent layout shift */}
      <div
        className="relative w-full max-w-sm mx-auto rounded-xl overflow-hidden border border-white/[0.08]"
        style={{
          background: "rgba(255,255,255,0.02)",
          aspectRatio: "16 / 9",
        }}
      >
        {isNear ? (
          <img
            src="/takedowns-intro.gif"
            alt="AI Takedowns concept — targeted rebuttals matching denial arguments with expert responses"
            className="w-full h-full object-cover"
          />
        ) : (
          /* Placeholder while GIF hasn't started loading */
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-cautious animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Organic Growth Engine (recovered section) ───────────── */

function OrganicGrowthHook() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div
      ref={ref}
      className="relative z-10 px-4 sm:px-8 lg:px-16 py-20 max-w-3xl mx-auto"
    >
      <motion.div
        className="flex flex-col items-center text-center"
        style={{
          opacity: isInView ? 1 : 0,
          y: isInView ? 0 : 50,
          transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <h3 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text leading-tight tracking-tight mb-6">
          The Ultimate Organic Growth Engine
        </h3>
        <p className="text-lg sm:text-xl text-text-muted max-w-2xl leading-relaxed mb-10">
          The ultimate organic growth engine for AI safety awareness.
        </p>

        {/* The key insight */}
        <div
          className="rounded-xl p-5 sm:p-6 text-left max-w-2xl w-full mb-6"
          style={{
            background: "rgba(244,162,97,0.08)",
            border: "1px solid rgba(244,162,97,0.2)",
          }}
        >
          <p className="text-sm sm:text-base text-text leading-relaxed mb-3">
            Imagine a library of highly targeted playlists&mdash;each one a
            precision-crafted collection of expert rebuttals addressing one
            specific AI risk denial argument.
          </p>
          <p className="text-sm sm:text-base text-text leading-relaxed">
            Now imagine our promoters in every comment thread on Reddit, X,
            YouTube, Bluesky&mdash;responding to dismissive comments with a{" "}
            <span
              className="inline-flex items-center gap-1.5 font-semibold"
              style={{
                color: "#f4a261",
                textShadow: "0 0 12px rgba(244,162,97,0.35)",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                className="inline-block shrink-0 -mt-px"
              >
                <circle cx="12" cy="12" r="10" stroke="#f4a261" strokeWidth="2" fill="none" />
                <circle cx="12" cy="12" r="6" stroke="#f4a261" strokeWidth="2" fill="none" />
                <circle cx="12" cy="12" r="2.5" fill="#f4a261" />
              </svg>
              laser-targeted
            </span>{" "}
            link to the exact playlist that addresses that specific
            argument.
          </p>
        </div>

        {/* The punchline */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl w-full">
          <div
            className="flex-1 rounded-lg p-4 text-center"
            style={{
              background: "rgba(82,183,136,0.1)",
              border: "1px solid rgba(82,183,136,0.2)",
            }}
          >
            <p className="text-xs text-text-dim uppercase tracking-widest mb-1">
              Not spam
            </p>
            <p className="text-sm text-text font-medium">
              The link is spot-on. It&rsquo;s pure value for every reader.
            </p>
          </div>
          <div
            className="flex-1 rounded-lg p-4 text-center"
            style={{
              background: "rgba(224,122,95,0.1)",
              border: "1px solid rgba(224,122,95,0.2)",
            }}
          >
            <p className="text-xs text-text-dim uppercase tracking-widest mb-1">
              Organic inbound
            </p>
            <p className="text-sm text-text font-medium">
              The purest form of organic traffic. Growth without limit.
            </p>
          </div>
        </div>

        {/* Scaling the engine */}
        <div
          className="rounded-xl p-5 sm:p-6 text-left max-w-2xl w-full mt-8"
          style={{
            background: "rgba(82,183,136,0.08)",
            border: "1px solid rgba(82,183,136,0.2)",
          }}
        >
          <p className="text-sm sm:text-base text-text leading-relaxed mb-3">
            And the best part? This organic engine scales effortlessly.
            Every new promoter who joins the movement multiplies our
            reach&mdash;distributing these{" "}
            <span className="font-semibold text-text">
              hyper-relevant, perfectly matched links
            </span>{" "}
            into conversations that are already happening.
          </p>
          <p className="text-sm sm:text-base text-text-muted leading-relaxed">
            More promoters = more high-relevancy links deployed = more
            organic traffic = more conversions. No ad spend. No algorithms
            to fight. Just the right rebuttal, in the right thread, at the
            right time.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Story card ──────────────────────────────────────────── */

function StoryCard({
  story,
}: {
  story: (typeof STORIES)[number];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className="rounded-xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderLeft: `3px solid ${story.accent}`,
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 40,
        transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div className="p-5 sm:p-7">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: story.accentBg,
              border: `1px solid ${story.accentBorder}`,
            }}
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" fill={story.accent} />
              <path
                d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                fill={story.accent}
              />
            </svg>
          </div>
          <div>
            <h4 className="text-base font-semibold text-text">
              {story.character}
            </h4>
            <p className="text-sm text-text-dim">{story.role}</p>
          </div>
          {story.argNumber && (
            <span
              className="ml-auto text-sm font-mono px-2.5 py-1 rounded"
              style={{
                background: story.accentBg,
                color: story.accent,
              }}
            >
              #{story.argNumber}
            </span>
          )}
        </div>

        {/* Denial quote */}
        {story.denial && (
          <div
            className="rounded-lg px-4 sm:px-5 py-3.5 mb-5 text-sm leading-relaxed italic text-text-muted"
            style={{
              background: "rgba(255,255,255,0.03)",
              borderLeft: `2px solid ${story.accent}40`,
            }}
          >
            {story.denial}
          </div>
        )}

        {/* Second denial (Peter only) */}
        {"secondDenial" in story && story.secondDenial && (
          <div
            className="rounded-lg px-4 sm:px-5 py-3.5 mb-5 text-sm leading-relaxed italic text-text-muted"
            style={{
              background: "rgba(255,255,255,0.03)",
              borderLeft: `2px solid ${story.accent}40`,
            }}
          >
            <span
              className="not-italic font-mono text-sm mr-2 px-1.5 py-0.5 rounded"
              style={{
                background: story.accentBg,
                color: story.accent,
              }}
            >
              #{(story as (typeof STORIES)[1]).secondArgNumber}
            </span>
            {story.secondDenial}
          </div>
        )}

        {/* Leader agreement indicator */}
        {"agreeCount" in story && story.agreeCount && (
          <div className="flex items-center gap-2 mb-5">
            <div className="flex gap-[2px]">
              {Array.from({ length: TOTAL_COUNT }, (_, i) => (
                <div
                  key={i}
                  className="rounded-sm"
                  style={{
                    width: 4,
                    height: 12,
                    background:
                      i + 1 ===
                      (story as (typeof STORIES)[4]).stickingPoint
                        ? "#e63946"
                        : story.accent,
                    opacity:
                      i + 1 ===
                      (story as (typeof STORIES)[4]).stickingPoint
                        ? 1
                        : 0.6,
                  }}
                />
              ))}
            </div>
            <span className="text-sm text-text-dim ml-1">
              {story.agreeCount}/{TOTAL_COUNT} agreed &middot; sticking point{" "}
              <span className="text-[#e63946] font-mono">
                #{(story as (typeof STORIES)[4]).stickingPoint}
              </span>
            </span>
          </div>
        )}

        {/* Mechanism */}
        <p className="text-sm text-text-muted leading-relaxed mb-5">
          {story.mechanism}
        </p>

        {/* Expert badges */}
        {story.experts.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {story.experts.map((expert) => (
              <div
                key={expert}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm"
                style={{
                  background: "rgba(224,122,95,0.12)",
                  border: "1px solid rgba(224,122,95,0.2)",
                }}
              >
                <svg
                  width={12}
                  height={12}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <polygon
                    points="5 3 19 12 5 21 5 3"
                    fill="#e07a5f"
                  />
                </svg>
                <span className="text-text-muted">{expert}</span>
              </div>
            ))}
          </div>
        )}

        {/* Outcome */}
        <div
          className="rounded-lg px-4 sm:px-5 py-4 text-sm"
          style={{
            background: story.accentBg,
            border: `1px solid ${story.accentBorder}`,
          }}
        >
          <span
            className="font-semibold"
            style={{ color: story.accent }}
          >
            Outcome:
          </span>{" "}
          <span className="text-text-muted">{story.outcome}</span>
          <p className="mt-2 font-semibold text-text text-base">
            {story.outcomeHighlight}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main section ────────────────────────────────────────── */

export default function Section09_Takedowns() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  /* ── Section envelope ── */
  const sectionOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.02, 0.96, 1.0],
    [0, 1, 1, 0]
  );

  /* ── Phase A: Intro — sticking-point explanation ── */
  const introOpacity = useTransform(
    scrollYProgress,
    [0.01, 0.03, 0.14, 0.18],
    [0, 1, 1, 0]
  );
  const introY = useTransform(scrollYProgress, [0.01, 0.03], [40, 0]);
  const introSub1 = useTransform(
    scrollYProgress,
    [0.04, 0.07],
    [0, 1],
    { clamp: true }
  );
  const introSub2 = useTransform(
    scrollYProgress,
    [0.07, 0.10],
    [0, 1],
    { clamp: true }
  );

  /* ── Phase B: Grid walkthrough ── */
  const gridPhaseOpacity = useTransform(
    scrollYProgress,
    [0.16, 0.21, 0.95, 0.99],
    [0, 1, 1, 0]
  );
  const gridTitleY = useTransform(scrollYProgress, [0.16, 0.21], [30, 0]);
  const fillProgress = useTransform(
    scrollYProgress,
    [0.22, 0.88],
    [0, 1],
    { clamp: true }
  );

  /* Track active index — only re-render on actual change */
  useMotionValueEvent(fillProgress, "change", (latest) => {
    const idx = Math.max(
      0,
      Math.min(Math.floor(latest * TOTAL_COUNT), TOTAL_COUNT - 1)
    );
    if (idx !== activeIndexRef.current) {
      activeIndexRef.current = idx;
      setActiveIndex(idx);
    }
  });

  return (
    <section id="takedowns">
      {/* ── Part 0: Title + GIF hero ── */}
      <TakedownsHero />

      {/* ── Part 1: Scroll-driven animated area ── */}
      <div
        ref={sectionRef}
        className="relative"
        style={{ height: "1800vh" }}
      >
        <motion.div
          className="sticky top-12 h-[calc(100vh-3rem)] flex items-center justify-center overflow-hidden"
          style={{ opacity: sectionOpacity }}
        >
          {/* ── Phase A: Intro ── */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8"
            style={{ opacity: introOpacity, y: introY }}
          >
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text text-center leading-tight tracking-tight mb-8">
              Targeted Skepticisms
            </h2>

            <div className="max-w-2xl space-y-5">
              <p className="text-base sm:text-lg text-text-muted leading-relaxed text-center">
                Every single person has their very own unique sticking
                point&mdash;one specific reason they believe everything will
                turn out fine. Because they think they&rsquo;ve figured it
                out, every time they&rsquo;re exposed to content about AI
                risk, they simply tune out. They don&rsquo;t really listen,
                because deep down they feel they already know better.
              </p>

              <motion.div
                className="rounded-xl p-5 text-center"
                style={{
                  opacity: introSub1,
                  background: "rgba(244,162,97,0.08)",
                  border: "1px solid rgba(244,162,97,0.2)",
                }}
              >
                <p className="text-lg sm:text-xl text-text font-heading font-bold">
                  I have documented 100+ of these denial arguments and
                  skepticisms.
                </p>
              </motion.div>

              <motion.p
                className="text-base sm:text-lg text-text-muted leading-relaxed text-center"
                style={{ opacity: introSub1 }}
              >
                What works for one person doesn&rsquo;t work for another.
                They have a different sticking point. After years of
                extensive debate, I&rsquo;ve found that{" "}
                <span className="text-text font-semibold">
                  everyone gives a different reason
                </span>{" "}
                why AI risk isn&rsquo;t real.
              </motion.p>

              <motion.p
                className="text-base sm:text-lg text-text-muted leading-relaxed text-center"
                style={{ opacity: introSub2 }}
              >
                For someone to become truly alarmed, they have to process{" "}
                <span className="text-text font-semibold">
                  every single argument
                </span>
                &mdash;and find that none of them holds up. Only then do
                they understand: there is no silver bullet, and the risk
                is very real.
              </motion.p>
            </div>
          </motion.div>

          {/* ── Phase B: Grid walkthrough ── */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 lg:px-16"
            style={{ opacity: gridPhaseOpacity }}
          >
            <div className="flex flex-col lg:flex-row items-center lg:items-center gap-6 lg:gap-12 max-w-5xl w-full">
              {/* Left — grid + counter */}
              <div className="w-full lg:w-[42%] flex flex-col items-center">
                <motion.h3
                  className="font-heading text-lg sm:text-xl lg:text-2xl font-bold text-text text-center mb-1"
                  style={{ y: gridTitleY }}
                >
                  100+ Denial Arguments
                </motion.h3>
                <motion.p
                  className="text-xs text-text-dim text-center mb-5"
                  style={{ y: gridTitleY }}
                >
                  Each box = one skepticism, colored by category.
                </motion.p>

                <SkeptGrid
                  fillProgress={fillProgress}
                  activeIndex={activeIndex}
                  className="w-full max-w-[280px] sm:max-w-xs"
                />

                {/* Progress bar + counter */}
                <div className="mt-4 w-full max-w-[280px] sm:max-w-xs">
                  <div className="flex justify-between text-[11px] text-text-dim font-mono mb-1.5">
                    <span>
                      {activeIndex + 1} / {TOTAL_COUNT}
                    </span>
                    <span
                      style={{
                        color: indexToCluster[activeIndex]?.color,
                      }}
                    >
                      {indexToCluster[activeIndex]?.label}
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-150 ease-out"
                      style={{
                        width: `${((activeIndex + 1) / TOTAL_COUNT) * 100}%`,
                        background: indexToCluster[activeIndex]?.color,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Right — detail panel */}
              <div className="w-full lg:w-[58%] flex flex-col justify-center">
                <SkeptDetail activeIndex={activeIndex} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Part 1.5: Organic Growth Engine ── */}
      <OrganicGrowthHook />

      {/* ── Part 2: Flowing story cards ── */}
      <div className="relative z-10 px-4 sm:px-8 lg:px-16 pt-6 pb-20 max-w-3xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-10">
          <h3 className="font-heading text-3xl sm:text-4xl font-bold text-text mb-3">
            Short Stories Featuring Personas
          </h3>
          <p className="text-base text-text-muted leading-relaxed max-w-xl mx-auto">
            Each story shows how targeted takedowns convert skeptics into
            advocates.
          </p>
        </div>

        {/* Characters intro */}
        <div
          className="rounded-xl p-5 sm:p-6 mb-10"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <h4 className="text-base font-semibold text-text mb-1">
            About the characters
          </h4>
          <p className="text-sm text-text-dim mb-4 italic">
            All names below are fictional and chosen at random. Think of them
            as roles, not specific people.
          </p>
          <div className="space-y-2.5">
            <div className="flex gap-3 text-sm">
              <span className="text-text font-medium shrink-0 w-36">Emily</span>
              <span className="text-text-muted">Exposed to Lethal Intelligence content, she became curious, learned more, and joined the &ldquo;Humans First&rdquo; movement.</span>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="text-text font-medium shrink-0 w-36">Paul</span>
              <span className="text-text-muted">Emily&rsquo;s husband. Dismisses AI risk for a specific reason.</span>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="text-text font-medium shrink-0 w-36">Peter</span>
              <span className="text-text-muted">Paul&rsquo;s colleague. Disagrees with Paul&rsquo;s reasoning, but is also dismissive of existential risk for a different reason.</span>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="text-text font-medium shrink-0 w-36">Dan Hendrycks</span>
              <span className="text-text-muted">A prominent AI safety advocate.</span>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="text-text font-medium shrink-0 w-36">Max Tegmark</span>
              <span className="text-text-muted">A prominent AI safety advocate.</span>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="text-text font-medium shrink-0 w-36">Elon Musk</span>
              <span className="text-text-muted">A famous industry leader.</span>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="text-text font-medium shrink-0 w-36">Emmanuel Macron</span>
              <span className="text-text-muted">A well-known politician.</span>
            </div>
          </div>
        </div>

        {/* Story cards — single column */}
        <div className="flex flex-col gap-6">
          {STORIES.map((story) => (
            <StoryCard key={story.character} story={story} />
          ))}
        </div>

        <div className="text-center mt-20">
          <p className="text-2xl sm:text-4xl lg:text-5xl text-text leading-snug font-heading font-extrabold mb-4">
            Every Dismissal Has an Answer
          </p>
          <p className="text-base sm:text-lg lg:text-xl text-text-muted leading-relaxed max-w-2xl mx-auto">
            100+ targeted video rebuttal collections / playlists.
            <br />
            Created by thought leaders, AI experts, and AI safety advocates.
          </p>
          <div className="w-16 h-px bg-white/10 mx-auto my-5" />
          <p className="text-base sm:text-lg lg:text-xl text-text-muted leading-relaxed max-w-2xl mx-auto">
            Deployed everywhere.
            <br />
            The audience decides, surfaces the best to the top.
          </p>
          <div className="w-16 h-px bg-white/10 mx-auto my-5" />
          <p className="text-lg sm:text-xl lg:text-2xl font-heading font-bold leading-snug max-w-2xl mx-auto" style={{ color: "#f4a261" }}>
            The end of plausible denial.
          </p>
        </div>
      </div>
    </section>
  );
}
