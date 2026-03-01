"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  type MotionValue,
} from "framer-motion";

/* ── Story data ─────────────────────────────────────────── */

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
      "85+ short videos addressing very specific denial arguments, released across all platforms\u2014Reddit, X, Threads, Bluesky, YouTube. Any dismissive comment receives a tailored-made response: a link to a playlist of rebuttals by thought-leaders, addressing specifically that comment.",
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
    agreeCount: 85,
    stickingPoint: 62,
    mechanism:
      "Agrees with 85 of 86 Takedowns. Advocates for all of them\u2014except #62, where he provides the optimistic \u201Csteelman.\u201D His millions of admirers discover AI Takedowns exists and get exposed to the best arguments by the best minds in the field.",
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
    agreeCount: 85,
    stickingPoint: 71,
    mechanism:
      "Like Musk, agrees with 85 Takedowns but has a sticking point at #71. His global audience\u2014fans and critics alike\u2014now knows AI Takedowns exists, and that the Humans First movement is THE PATH to action.",
    outcome:
      "Everyone consumes this highly optimized, targeted content. AI safety policy becomes a hot political topic. The Overton window is wide open. The world has changed forever.",
    outcomeHighlight: "The Overton window is wide open.",
  },
];

const ARGUMENT_COUNT = 86;
const GRID_COLS = 14;

/* ── Single argument tile (hook-safe) ───────────────────── */

function ArgTile({
  index,
  x,
  y,
  tileSize,
  isHighlight,
  highlightColor,
  fillProgress,
}: {
  index: number;
  x: number;
  y: number;
  tileSize: number;
  isHighlight: boolean;
  highlightColor: string;
  fillProgress: MotionValue<number>;
}) {
  const tileOpacity = useTransform(
    fillProgress,
    [index / ARGUMENT_COUNT, (index + 1) / ARGUMENT_COUNT],
    [0.08, 0.7]
  );

  return (
    <motion.rect
      x={x}
      y={y}
      width={tileSize}
      height={tileSize}
      rx={3}
      fill={isHighlight ? highlightColor : "#f4a261"}
      style={{ opacity: isHighlight ? 1 : tileOpacity }}
    />
  );
}

/* ── Argument Grid sub-component ────────────────────────── */

function ArgumentGrid({
  fillProgress,
  highlightTile,
  highlightColor = "#e63946",
  tileSize = 18,
  gap = 3,
  className = "",
}: {
  fillProgress: MotionValue<number>;
  highlightTile?: number | null;
  highlightColor?: string;
  tileSize?: number;
  gap?: number;
  className?: string;
}) {
  const rows = Math.ceil(ARGUMENT_COUNT / GRID_COLS);
  const svgW = GRID_COLS * (tileSize + gap) - gap;
  const svgH = rows * (tileSize + gap) - gap;

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      className={className}
      aria-label="86 AI risk denial arguments"
    >
      {Array.from({ length: ARGUMENT_COUNT }, (_, i) => {
        const col = i % GRID_COLS;
        const row = Math.floor(i / GRID_COLS);
        return (
          <ArgTile
            key={i}
            index={i}
            x={col * (tileSize + gap)}
            y={row * (tileSize + gap)}
            tileSize={tileSize}
            isHighlight={highlightTile === i + 1}
            highlightColor={highlightColor}
            fillProgress={fillProgress}
          />
        );
      })}
      {highlightTile && (
        <text
          x={((highlightTile - 1) % GRID_COLS) * (tileSize + gap) + tileSize / 2}
          y={Math.floor((highlightTile - 1) / GRID_COLS) * (tileSize + gap) + tileSize / 2 + 4}
          fill="#fff"
          fontSize={9}
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="var(--font-dm-sans)"
        >
          {highlightTile}
        </text>
      )}
    </svg>
  );
}

/* ── Expert badge ───────────────────────────────────────── */

function ExpertBadge({
  name,
  delay,
  scrollYProgress,
  startAt,
}: {
  name: string;
  delay: number;
  scrollYProgress: MotionValue<number>;
  startAt: number;
}) {
  const opacity = useTransform(
    scrollYProgress,
    [startAt + delay, startAt + delay + 0.04],
    [0, 1],
    { clamp: true }
  );
  const x = useTransform(
    scrollYProgress,
    [startAt + delay, startAt + delay + 0.04],
    [30, 0],
    { clamp: true }
  );

  return (
    <motion.div
      className="flex items-center gap-2 px-3 py-2 rounded-lg"
      style={{
        opacity,
        x,
        background: "rgba(224,122,95,0.15)",
        border: "1px solid rgba(224,122,95,0.25)",
      }}
    >
      {/* Play icon */}
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
        <polygon points="5 3 19 12 5 21 5 3" fill="#e07a5f" />
      </svg>
      <span className="text-xs text-text font-medium">{name}</span>
      <span className="text-xs text-text-dim">5 min</span>
    </motion.div>
  );
}

/* ── Platform icon ──────────────────────────────────────── */

function PlatformIcon({
  name,
  color,
}: {
  name: string;
  color: string;
}) {
  const iconProps = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03]">
      {name === "YouTube" && (
        <svg {...iconProps}>
          <polygon points="5 3 19 12 5 21 5 3" fill={color} stroke="none" />
        </svg>
      )}
      {name === "Reddit" && (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6" />
          <circle cx="9" cy="14" r="1" fill={color} stroke="none" />
          <circle cx="15" cy="14" r="1" fill={color} stroke="none" />
        </svg>
      )}
      {name === "X / Twitter" && (
        <svg {...iconProps}>
          <path d="M4 4l16 16M20 4L4 20" />
        </svg>
      )}
      {name === "Bluesky" && (
        <svg {...iconProps}>
          <path d="M12 3C8 7 4 10 4 14a4 4 0 008 0 4 4 0 008 0c0-4-4-7-8-11z" />
        </svg>
      )}
      <span className="text-xs text-text-muted">{name}</span>
    </div>
  );
}

/* ── Story card (flowing section) ───────────────────────── */

function StoryCard({ story, index }: { story: (typeof STORIES)[number]; index: number }) {
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
      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          {/* Person silhouette */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: story.accentBg, border: `1px solid ${story.accentBorder}` }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" fill={story.accent} />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill={story.accent} />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text">{story.character}</h4>
            <p className="text-xs text-text-dim">{story.role}</p>
          </div>
          {story.argNumber && (
            <span
              className="ml-auto text-xs font-mono px-2 py-0.5 rounded"
              style={{ background: story.accentBg, color: story.accent }}
            >
              #{story.argNumber}
            </span>
          )}
        </div>

        {/* Denial quote */}
        {story.denial && (
          <div
            className="rounded-lg px-4 py-3 mb-4 text-xs leading-relaxed italic text-text-muted"
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
            className="rounded-lg px-4 py-3 mb-4 text-xs leading-relaxed italic text-text-muted"
            style={{
              background: "rgba(255,255,255,0.03)",
              borderLeft: `2px solid ${story.accent}40`,
            }}
          >
            <span
              className="not-italic font-mono text-xs mr-2 px-1.5 py-0.5 rounded"
              style={{ background: story.accentBg, color: story.accent }}
            >
              #{(story as typeof STORIES[1]).secondArgNumber}
            </span>
            {story.secondDenial}
          </div>
        )}

        {/* Leader agreement indicator */}
        {"agreeCount" in story && story.agreeCount && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-[2px]">
              {Array.from({ length: 86 }, (_, i) => (
                <div
                  key={i}
                  className="rounded-sm"
                  style={{
                    width: 4,
                    height: 12,
                    background:
                      i + 1 === (story as typeof STORIES[4]).stickingPoint
                        ? "#e63946"
                        : story.accent,
                    opacity: i + 1 === (story as typeof STORIES[4]).stickingPoint ? 1 : 0.6,
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-text-dim ml-1">
              {story.agreeCount}/86 agreed &middot; sticking point{" "}
              <span className="text-[#e63946] font-mono">
                #{(story as typeof STORIES[4]).stickingPoint}
              </span>
            </span>
          </div>
        )}

        {/* Mechanism */}
        <p className="text-xs text-text-muted leading-relaxed mb-4">
          {story.mechanism}
        </p>

        {/* Expert badges */}
        {story.experts.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {story.experts.map((expert) => (
              <div
                key={expert}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs"
                style={{
                  background: "rgba(224,122,95,0.12)",
                  border: "1px solid rgba(224,122,95,0.2)",
                }}
              >
                <svg width={10} height={10} viewBox="0 0 24 24" fill="none">
                  <polygon points="5 3 19 12 5 21 5 3" fill="#e07a5f" />
                </svg>
                <span className="text-text-muted">{expert}</span>
              </div>
            ))}
          </div>
        )}

        {/* Outcome */}
        <div
          className="rounded-lg px-4 py-3 text-xs"
          style={{
            background: story.accentBg,
            border: `1px solid ${story.accentBorder}`,
          }}
        >
          <span className="font-semibold" style={{ color: story.accent }}>
            Outcome:
          </span>{" "}
          <span className="text-text-muted">{story.outcome}</span>
          <p className="mt-1.5 font-semibold text-text text-sm">
            {story.outcomeHighlight}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main section ───────────────────────────────────────── */

export default function Section09_Takedowns() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  /* ── Section envelope ── */
  const sectionOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.04, 0.90, 0.96],
    [0, 1, 1, 0]
  );

  /* ── Phase A: Organic growth hook ── */
  const hookOpacity = useTransform(
    scrollYProgress,
    [0.02, 0.06, 0.16, 0.20],
    [0, 1, 1, 0]
  );
  const hookY = useTransform(scrollYProgress, [0.02, 0.06], [50, 0]);
  const hookSubOpacity = useTransform(
    scrollYProgress,
    [0.08, 0.12],
    [0, 1],
    { clamp: true }
  );

  /* ── Phase B: Hero + argument grid ── */
  const heroOpacity = useTransform(
    scrollYProgress,
    [0.18, 0.23, 0.34, 0.38],
    [0, 1, 1, 0]
  );
  const heroY = useTransform(scrollYProgress, [0.18, 0.23], [40, 0]);
  const gridFillA = useTransform(scrollYProgress, [0.24, 0.34], [0, 1], {
    clamp: true,
  });
  const counterOpacity = useTransform(
    scrollYProgress,
    [0.30, 0.34],
    [0, 1],
    { clamp: true }
  );

  /* ── Phase C: The Mechanism ── */
  const mechOpacity = useTransform(
    scrollYProgress,
    [0.36, 0.42, 0.58, 0.64],
    [0, 1, 1, 0]
  );
  const mechTitleY = useTransform(scrollYProgress, [0.36, 0.42], [30, 0]);

  const denialOpacity = useTransform(
    scrollYProgress,
    [0.40, 0.45],
    [0, 1],
    { clamp: true }
  );
  const denialX = useTransform(scrollYProgress, [0.40, 0.45], [-40, 0], {
    clamp: true,
  });

  const arrowOpacity = useTransform(
    scrollYProgress,
    [0.45, 0.50],
    [0, 1],
    { clamp: true }
  );
  const arrowScale = useTransform(
    scrollYProgress,
    [0.45, 0.50],
    [0.5, 1],
    { clamp: true }
  );

  /* ── Phase D: The Scale ── */
  const scaleOpacity = useTransform(
    scrollYProgress,
    [0.62, 0.68, 0.86, 0.92],
    [0, 1, 1, 0]
  );
  const scaleTitleY = useTransform(scrollYProgress, [0.62, 0.68], [30, 0]);
  const gridFillC = useTransform(scrollYProgress, [0.68, 0.78], [0, 1], {
    clamp: true,
  });
  const platformsOpacity = useTransform(
    scrollYProgress,
    [0.76, 0.82],
    [0, 1],
    { clamp: true }
  );
  const growthPulse = useTransform(
    scrollYProgress,
    [0.80, 0.82, 0.84, 0.86],
    [1, 1.03, 1, 1.02]
  );

  return (
    <section id="takedowns">
      {/* ── Part 1: Scroll-driven animated area ── */}
      <div
        ref={sectionRef}
        className="relative"
        style={{ height: "500vh" }}
      >
        <motion.div
          className="sticky top-12 h-[calc(100vh-3rem)] flex items-center justify-center overflow-hidden"
          style={{ opacity: sectionOpacity }}
        >
          {/* ── Phase A: Organic Growth Hook ── */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8"
            style={{ opacity: hookOpacity, y: hookY }}
          >
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text text-center leading-tight tracking-tight mb-6">
              AI Takedowns
            </h2>
            <p className="text-lg sm:text-xl text-text-muted text-center max-w-2xl leading-relaxed mb-8">
              The ultimate organic growth engine for AI safety awareness.
            </p>

            <motion.div
              className="max-w-2xl w-full space-y-5"
              style={{ opacity: hookSubOpacity }}
            >
              {/* The key insight */}
              <div
                className="rounded-xl p-5 sm:p-6"
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
                  YouTube, Bluesky&mdash;responding to dismissive comments with a
                  link to the exact playlist that addresses that specific
                  argument.
                </p>
              </div>

              {/* The punchline */}
              <div className="flex flex-col sm:flex-row gap-4">
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
            </motion.div>
          </motion.div>

          {/* ── Phase B: Hero + argument grid ── */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-4"
            style={{ opacity: heroOpacity, y: heroY }}
          >
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-text text-center mb-3">
              86 Denial Arguments. 86 Expert Takedowns.
            </h3>
            <p className="text-sm text-text-muted text-center max-w-xl leading-relaxed mb-8">
              The definitive collection of rebuttals to AI risk denial&mdash;short,
              targeted video responses by the best minds in the field.
            </p>

            {/* Argument grid */}
            <ArgumentGrid
              fillProgress={gridFillA}
              className="w-full max-w-md sm:max-w-lg mb-6"
            />

            {/* Counter */}
            <motion.p
              className="text-sm text-text-dim text-center font-mono tracking-wider"
              style={{ opacity: counterOpacity }}
            >
              Each tile = one denial argument, matched with expert rebuttals.
            </motion.p>
          </motion.div>

          {/* ── Phase C: The Mechanism ── */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16"
            style={{ opacity: mechOpacity }}
          >
            <motion.h3
              className="font-heading text-2xl sm:text-3xl font-bold text-text text-center mb-2"
              style={{ y: mechTitleY }}
            >
              How It Works
            </motion.h3>
            <motion.p
              className="text-sm text-text-muted text-center max-w-lg mb-10"
              style={{ y: mechTitleY }}
            >
              Every specific denial argument is matched with targeted expert
              responses.
            </motion.p>

            {/* Flow: Denial → Takedowns → Expert responses */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 max-w-4xl w-full">
              {/* Denial argument */}
              <motion.div
                className="flex-1 rounded-xl p-4 sm:p-5 max-w-xs"
                style={{
                  opacity: denialOpacity,
                  x: denialX,
                  background: "rgba(45,106,79,0.15)",
                  border: "1px solid rgba(82,183,136,0.2)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-dismissive/20 text-unconcerned">
                    #10
                  </span>
                  <span className="text-xs text-text-muted font-medium">
                    Denial Argument
                  </span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed italic">
                  &ldquo;Infrastructure requirements will delay AGI for 100
                  years&hellip;&rdquo;
                </p>
              </motion.div>

              {/* Arrow / connection */}
              <motion.div
                className="flex flex-col items-center gap-1"
                style={{ opacity: arrowOpacity, scale: arrowScale }}
              >
                <svg
                  width={40}
                  height={40}
                  viewBox="0 0 40 40"
                  className="text-cautious hidden sm:block"
                >
                  <path
                    d="M8 20h18m0 0l-6-6m6 6l-6 6"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                <svg
                  width={40}
                  height={40}
                  viewBox="0 0 40 40"
                  className="text-cautious sm:hidden"
                >
                  <path
                    d="M20 8v18m0 0l-6-6m6 6l6-6"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                <span className="text-[10px] text-cautious font-semibold tracking-widest uppercase">
                  Takedown
                </span>
              </motion.div>

              {/* Expert responses */}
              <div className="flex-1 flex flex-col gap-2 max-w-xs">
                <ExpertBadge
                  name="Dan Hendrycks"
                  delay={0}
                  scrollYProgress={scrollYProgress}
                  startAt={0.47}
                />
                <ExpertBadge
                  name="Max Tegmark"
                  delay={0.03}
                  scrollYProgress={scrollYProgress}
                  startAt={0.47}
                />
                <ExpertBadge
                  name="Elon Musk"
                  delay={0.06}
                  scrollYProgress={scrollYProgress}
                  startAt={0.47}
                />
                <ExpertBadge
                  name="Emmanuel Macron"
                  delay={0.09}
                  scrollYProgress={scrollYProgress}
                  startAt={0.47}
                />
              </div>
            </div>
          </motion.div>

          {/* ── Phase D: The Scale ── */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16"
            style={{ opacity: scaleOpacity }}
          >
            <motion.h3
              className="font-heading text-2xl sm:text-3xl font-bold text-text text-center mb-2"
              style={{ y: scaleTitleY }}
            >
              Deployed Everywhere
            </motion.h3>
            <motion.p
              className="text-sm text-text-muted text-center max-w-lg mb-8"
              style={{ y: scaleTitleY }}
            >
              Any dismissive comment, on any platform, receives a tailored
              playlist response from the best minds in the field.
            </motion.p>

            {/* Argument grid — all lit up */}
            <motion.div style={{ scale: growthPulse }}>
              <ArgumentGrid
                fillProgress={gridFillC}
                className="w-full max-w-sm sm:max-w-md mb-6"
              />
            </motion.div>

            {/* Platform badges */}
            <motion.div
              className="flex flex-wrap justify-center gap-2 sm:gap-3"
              style={{ opacity: platformsOpacity }}
            >
              <PlatformIcon name="YouTube" color="#e07a5f" />
              <PlatformIcon name="Reddit" color="#f4a261" />
              <PlatformIcon name="X / Twitter" color="#f0ece2" />
              <PlatformIcon name="Bluesky" color="#67d4e8" />
            </motion.div>

            <motion.p
              className="text-xs text-text-dim text-center mt-6 italic"
              style={{ opacity: platformsOpacity }}
            >
              85+ videos and growing. New responses every two weeks. Community-ranked.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Part 2: Flowing story cards ── */}
      <div className="relative z-10 px-4 sm:px-8 lg:px-16 pt-16 pb-20 max-w-5xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-12">
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-text mb-3">
            The Stories
          </h3>
          <p className="text-sm text-text-muted leading-relaxed max-w-xl mx-auto">
            What follows is a set of short stories featuring personas to
            demonstrate the impact. Each story shows how targeted takedowns
            convert skeptics into advocates.
          </p>
        </div>

        {/* Story cards — 2-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {STORIES.map((story, i) => (
            <StoryCard key={story.character} story={story} index={i} />
          ))}
        </div>

        {/* Closing statement */}
        <div className="text-center mt-16">
          <p className="text-lg sm:text-2xl text-text leading-snug font-heading font-bold mb-3">
            Every Dismissal Has an Answer
          </p>
          <p className="text-sm text-text-muted leading-relaxed max-w-xl mx-auto">
            86 targeted video rebuttals. Created by thought leaders. Deployed
            everywhere. The end of plausible denial.
          </p>
        </div>
      </div>
    </section>
  );
}
