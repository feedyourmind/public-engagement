"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

/* ── Colors ── */
const ACCENT = "#67d4e8";
const SECONDARY = "#c084fc";
const GROWTH = "#52b788";
const REDDIT = "#ff4500";

/* ── Animated counter ── */

function AnimatedNumber({
  value,
  format,
}: {
  value: MotionValue<number>;
  format: (n: number) => string;
}) {
  const [display, setDisplay] = useState(() => format(0));
  const fmtRef = useRef(format);
  fmtRef.current = format;

  useEffect(() => {
    return value.on("change", (v) => setDisplay(fmtRef.current(v)));
  }, [value]);

  return <>{display}</>;
}

/* ── SVG Icons ── */

function PulseIcon({ color }: { color: string }) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function ClusterIcon({ color }: { color: string }) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx={12} cy={12} r={3} />
      <circle cx={5} cy={6} r={2} />
      <circle cx={19} cy={6} r={2} />
      <circle cx={5} cy={18} r={2} />
      <circle cx={19} cy={18} r={2} />
      <line x1={9.5} y1={10.5} x2={6.5} y2={7.5} />
      <line x1={14.5} y1={10.5} x2={17.5} y2={7.5} />
      <line x1={9.5} y1={13.5} x2={6.5} y2={16.5} />
      <line x1={14.5} y1={13.5} x2={17.5} y2={16.5} />
    </svg>
  );
}

function ChartIcon({ color }: { color: string }) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1={18} y1={20} x2={18} y2={10} />
      <line x1={12} y1={20} x2={12} y2={4} />
      <line x1={6} y1={20} x2={6} y2={14} />
    </svg>
  );
}

function MegaphoneIcon({ color }: { color: string }) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11l18-5v12L3 13v-2z" />
      <path d="M11.6 16.8a3 3 0 0 1-5.8-1.6" />
    </svg>
  );
}

function ShieldIcon({ color }: { color: string }) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

/* ── Reddit icon (inline) ── */

function RedditIcon({ size = 18 }: { size?: number }) {
  return (
    <img
      src="/reddit-logo.svg"
      alt="Reddit"
      width={size}
      height={size}
      className="inline-block align-middle rounded-full relative -top-[2px]"
    />
  );
}

/* ── Metric card ── */

function MetricCard({
  icon,
  title,
  description,
  accent,
  opacity,
  y,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
}) {
  return (
    <motion.div
      className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
      style={{ opacity, y }}
    >
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h4 className="text-lg font-semibold" style={{ color: accent }}>
          {title}
        </h4>
      </div>
      <p className="text-sm text-text-dim leading-relaxed m-0">{description}</p>
    </motion.div>
  );
}

/* ── Pipeline stage ── */

function PipelineStage({
  title,
  description,
  accent,
  opacity,
  y,
}: {
  title: string;
  description: string;
  accent: string;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
}) {
  return (
    <motion.div
      className="flex-1 p-4 rounded-lg bg-white/[0.03] border border-white/[0.06]"
      style={{
        opacity,
        y,
        borderLeftColor: accent,
        borderLeftWidth: 3,
      }}
    >
      <p className="text-base font-mono font-semibold text-text mb-1">{title}</p>
      <p className="text-xs text-text-dim leading-relaxed m-0">
        {description}
      </p>
    </motion.div>
  );
}

/* ── Main Section ── */

export default function Section04b_Distribution() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  /* ── Section envelope ── */
  const sectionOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.03, 0.94, 0.98],
    [0, 1, 1, 0]
  );

  /* ── Phase A: Hero (extended for 3-stage counter) ── */
  const heroOpacity = useTransform(
    scrollYProgress,
    [0.02, 0.05, 0.34, 0.38],
    [0, 1, 1, 0]
  );
  const heroY = useTransform(scrollYProgress, [0.02, 0.05], [40, 0]);
  const iconScale = useTransform(scrollYProgress, [0.02, 0.07], [0.6, 1], {
    clamp: true,
  });
  const iconGlowOpacity = useTransform(
    scrollYProgress,
    [0.04, 0.08],
    [0, 0.6],
    { clamp: true }
  );

  /* Stats 3-stage progression */
  const statsContainerOpacity = useTransform(
    scrollYProgress,
    [0.08, 0.10, 0.34, 0.38],
    [0, 1, 1, 0],
    { clamp: true }
  );

  // Counter 1: views per month
  const counter1 = useTransform(scrollYProgress, [0.09, 0.15], [0, 9], {
    clamp: true,
  });
  const counter1Opacity = useTransform(
    scrollYProgress,
    [0.08, 0.10],
    [0, 1],
    { clamp: true }
  );

  // Arrow 1 + "aiming for"
  const arrow1Opacity = useTransform(
    scrollYProgress,
    [0.16, 0.19],
    [0, 1],
    { clamp: true }
  );

  // Counter 2: views per week
  const counter2 = useTransform(scrollYProgress, [0.19, 0.25], [0, 9], {
    clamp: true,
  });
  const counter2Opacity = useTransform(
    scrollYProgress,
    [0.19, 0.21],
    [0, 1],
    { clamp: true }
  );

  // Arrow 2 + "soon, eventually"
  const arrow2Opacity = useTransform(
    scrollYProgress,
    [0.26, 0.29],
    [0, 1],
    { clamp: true }
  );

  // Counter 3: views per day
  const counter3 = useTransform(scrollYProgress, [0.29, 0.35], [0, 9], {
    clamp: true,
  });
  const counter3Opacity = useTransform(
    scrollYProgress,
    [0.29, 0.31],
    [0, 1],
    { clamp: true }
  );

  // Horizontal shift: center stat1 → shift left so stat2 is centered, stat3 appears to its right
  const statsShift = useTransform(
    scrollYProgress,
    [0.09, 0.15, 0.18, 0.25, 0.28, 0.35],
    [300, 300, 0, 0, 0, 0]
  );

  /* ── Phase B: Resonance Intelligence ── */
  const intelligenceOpacity = useTransform(
    scrollYProgress,
    [0.36, 0.40, 0.54, 0.58],
    [0, 1, 1, 0]
  );
  const intelligenceTitleY = useTransform(
    scrollYProgress,
    [0.36, 0.40],
    [30, 0]
  );

  const card1Opacity = useTransform(scrollYProgress, [0.39, 0.42], [0, 1], {
    clamp: true,
  });
  const card1Y = useTransform(scrollYProgress, [0.39, 0.42], [20, 0], {
    clamp: true,
  });
  const card2Opacity = useTransform(scrollYProgress, [0.41, 0.44], [0, 1], {
    clamp: true,
  });
  const card2Y = useTransform(scrollYProgress, [0.41, 0.44], [20, 0], {
    clamp: true,
  });
  const card3Opacity = useTransform(scrollYProgress, [0.43, 0.46], [0, 1], {
    clamp: true,
  });
  const card3Y = useTransform(scrollYProgress, [0.43, 0.46], [20, 0], {
    clamp: true,
  });
  const resonanceTextOpacity = useTransform(
    scrollYProgress,
    [0.46, 0.50],
    [0, 1],
    { clamp: true }
  );

  /* ── Phase C: Production Pipeline ── */
  const pipelineOpacity = useTransform(
    scrollYProgress,
    [0.54, 0.58, 0.90, 0.95],
    [0, 1, 1, 0]
  );
  const pipelineTitleY = useTransform(
    scrollYProgress,
    [0.54, 0.58],
    [30, 0]
  );

  const stage1Opacity = useTransform(scrollYProgress, [0.57, 0.60], [0, 1], {
    clamp: true,
  });
  const stage1Y = useTransform(scrollYProgress, [0.57, 0.60], [20, 0], {
    clamp: true,
  });
  const stage2Opacity = useTransform(scrollYProgress, [0.59, 0.62], [0, 1], {
    clamp: true,
  });
  const stage2Y = useTransform(scrollYProgress, [0.59, 0.62], [20, 0], {
    clamp: true,
  });
  const stage3Opacity = useTransform(scrollYProgress, [0.61, 0.64], [0, 1], {
    clamp: true,
  });
  const stage3Y = useTransform(scrollYProgress, [0.61, 0.64], [20, 0], {
    clamp: true,
  });
  const stage4Opacity = useTransform(scrollYProgress, [0.63, 0.66], [0, 1], {
    clamp: true,
  });
  const stage4Y = useTransform(scrollYProgress, [0.63, 0.66], [20, 0], {
    clamp: true,
  });
  const rolesOpacity = useTransform(scrollYProgress, [0.65, 0.68], [0, 1], {
    clamp: true,
  });
  const badgeOpacity = useTransform(scrollYProgress, [0.67, 0.70], [0, 1], {
    clamp: true,
  });

  /* ── Phase D: r/AIDangers (own scroll area below) ── */
  const aidangersRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: adScrollY } = useScroll({
    target: aidangersRef,
    offset: ["start end", "end start"],
  });

  /* Green bar fills fast to 30K */
  const greenBarWidth = useTransform(adScrollY, [0.25, 0.40], [0, 30], { clamp: true });
  const greenBarFill = useTransform(greenBarWidth, (v) => `${v}%`);

  /* Golden bar continues from 30K to 1M */
  const goldenBarWidth = useTransform(adScrollY, [0.45, 0.60], [0, 70], { clamp: true });
  const goldenBarFill = useTransform(goldenBarWidth, (v) => `${v}%`);

  /* Fixed counter: 0 → 30K */
  const fixedCounter = useTransform(adScrollY, [0.25, 0.40], [0, 30000], { clamp: true });

  /* Trailing counter: 30K → 1M */
  const trailingCounter = useTransform(adScrollY, [0.45, 0.60], [30000, 1000000], { clamp: true });

  /* Trailing counter position */
  const trailingLeft = useTransform(goldenBarWidth, (w) => `${30 + w}%`);

  /* Trailing counter opacity */
  const trailingOpacity = useTransform(adScrollY, [0.45, 0.47], [0, 1], { clamp: true });

  /* Counter color for trailing label */
  const trailingColor = useTransform(adScrollY, [0.45, 0.60], [ACCENT, "#f4a261"]);

  const goalOpacity = useTransform(adScrollY, [0.38, 0.43], [0, 1], { clamp: true });
  const benefit1Opacity = useTransform(adScrollY, [0.55, 0.60], [0, 1], { clamp: true });
  const benefit1Y = useTransform(adScrollY, [0.55, 0.60], [20, 0], { clamp: true });
  const benefit2Opacity = useTransform(adScrollY, [0.58, 0.63], [0, 1], { clamp: true });
  const benefit2Y = useTransform(adScrollY, [0.58, 0.63], [20, 0], { clamp: true });

  return (
    <>
    <section
      ref={sectionRef}
      id="distribution"
      className="relative"
      style={{ height: "180vh" }}
    >
      <motion.div
        className="sticky top-12 h-[calc(100vh-3rem)] flex items-center justify-center overflow-hidden"
        style={{ opacity: sectionOpacity }}
      >
        {/* ── Phase A: Hero ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-4"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          {/* Icon with glow */}
          <div className="relative mb-6">
            <motion.div
              className="absolute inset-0 rounded-full blur-3xl"
              style={{
                background: `radial-gradient(circle, ${ACCENT}40, transparent 70%)`,
                opacity: iconGlowOpacity,
                scale: 1.5,
              }}
            />
            <motion.img
              src="/banger-logo1.webp"
              alt="Distribution Engine"
              className="w-28 h-28 sm:w-36 sm:h-36 relative z-10 drop-shadow-2xl"
              style={{ scale: iconScale }}
            />
          </div>

          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text text-center leading-tight tracking-tight mb-3">
            The Distribution Engine
          </h2>
          <p className="text-lg sm:text-xl text-text-muted text-center max-w-2xl leading-relaxed mb-6">
            A scientific, data-driven infrastructure that applies
            gradient-descent-like optimization dynamics to content distribution
            &mdash; a recursively improving feedback loop that increases
            throughput, resonance, and virality every single day
          </p>

          {/* Stats 3-stage progression */}
          <motion.div
            className="w-full overflow-hidden"
            style={{ opacity: statsContainerOpacity }}
          >
            {/* "Cross Platform" header above stats */}
            <div className="text-center mb-4">
              <p className="text-sm sm:text-base uppercase tracking-widest font-bold mb-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Cross Platform
              </p>
              <p className="text-xs text-text-muted mb-2">
                Soon to be applied to X, Instagram, TikTok &amp; all major platforms
              </p>
              <p className="text-base sm:text-lg text-text-muted">
                Started with{" "}
                <RedditIcon size={50} />
                <span style={{ color: REDDIT }} className="font-semibold -ml-2">
                  Reddit
                </span>:
              </p>
            </div>

            {/* Sliding stats row */}
            <div className="flex justify-center">
              <motion.div
                className="flex items-center gap-4 sm:gap-6 w-max"
                style={{ x: statsShift }}
              >
                {/* Stat 1: per month */}
                <motion.div
                  className="text-center flex-shrink-0"
                  style={{ opacity: counter1Opacity }}
                >
                  <span
                    className="text-4xl sm:text-5xl font-extrabold font-mono"
                    style={{ color: ACCENT }}
                  >
                    ~
                    <AnimatedNumber
                      value={counter1}
                      format={(n) => n.toFixed(1)}
                    />
                    M
                  </span>
                  <p className="text-base sm:text-lg font-bold text-text mt-1">
                    views per month
                  </p>
                </motion.div>

                {/* Arrow 1: aiming for */}
                <motion.div
                  className="flex flex-col items-center justify-end flex-shrink-0 self-stretch pb-1"
                  style={{ opacity: arrow1Opacity }}
                >
                  <span className="text-xs sm:text-sm font-semibold text-text-muted whitespace-nowrap leading-tight">
                    aiming for
                  </span>
                  <span
                    className="text-2xl sm:text-3xl leading-none"
                    style={{ color: ACCENT }}
                  >
                    &rarr;
                  </span>
                </motion.div>

                {/* Stat 2: per week */}
                <motion.div
                  className="text-center flex-shrink-0"
                  style={{ opacity: counter2Opacity }}
                >
                  <span
                    className="text-4xl sm:text-5xl font-extrabold font-mono"
                    style={{ color: ACCENT }}
                  >
                    ~
                    <AnimatedNumber
                      value={counter2}
                      format={(n) => n.toFixed(1)}
                    />
                    M
                  </span>
                  <p className="text-base sm:text-lg font-bold text-text mt-1">
                    views per week
                  </p>
                </motion.div>

                {/* Arrow 2: no hard ceiling */}
                <motion.div
                  className="flex flex-col items-center justify-end flex-shrink-0 self-stretch pb-1"
                  style={{ opacity: arrow2Opacity }}
                >
                  <span className="text-xs sm:text-sm font-semibold text-text-muted whitespace-nowrap leading-tight">
                    no hard ceiling
                  </span>
                  <span
                    className="text-2xl sm:text-3xl leading-none"
                    style={{ color: ACCENT }}
                  >
                    &rarr;
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-text-muted whitespace-nowrap leading-tight">
                    could eventually reach
                  </span>
                </motion.div>

                {/* Stat 3: per day */}
                <motion.div
                  className="text-center flex-shrink-0"
                  style={{ opacity: counter3Opacity }}
                >
                  <span
                    className="text-4xl sm:text-5xl font-extrabold font-mono"
                    style={{ color: ACCENT }}
                  >
                    ~
                    <AnimatedNumber
                      value={counter3}
                      format={(n) => n.toFixed(1)}
                    />
                    M
                  </span>
                  <p className="text-base sm:text-lg font-bold text-text mt-1">views per day</p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Phase B: Resonance Intelligence ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16"
          style={{ opacity: intelligenceOpacity }}
        >
          <motion.div
            className="text-center mb-8"
            style={{ y: intelligenceTitleY }}
          >
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-text mb-2">
              Resonance Intelligence
            </h3>
            <p className="text-sm text-text-muted max-w-lg mx-auto">
              Statistically significant signal about what AI safety content
              resonates with completely diverse communities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full mb-8">
            <MetricCard
              icon={<PulseIcon color={ACCENT} />}
              title="Content Resonance"
              description="Track how AI safety content performs across communities with completely different interests and perspectives."
              accent={ACCENT}
              opacity={card1Opacity}
              y={card1Y}
            />
            <MetricCard
              icon={<ClusterIcon color={SECONDARY} />}
              title="Growth Clusters"
              description="Community-content networks that capture which content performs where. The connections grow stronger every day — yielding increasingly measurable signal as we use it."
              accent={SECONDARY}
              opacity={card2Opacity}
              y={card2Y}
            />
            <MetricCard
              icon={<ChartIcon color={GROWTH} />}
              title="Cross-Community Analytics"
              description="Powerful analytics cutting across different dimensions of engagement, reach, and sentiment."
              accent={GROWTH}
              opacity={card3Opacity}
              y={card3Y}
            />
          </div>

          <motion.p
            className="text-base text-text-muted text-center max-w-xl leading-relaxed"
            style={{ opacity: resonanceTextOpacity }}
          >
            Take viral content that has proven performance &mdash; either on
            other platforms or in other communities &mdash; create{" "}
            <span className="text-text font-medium">variations</span>, and
            distribute to the{" "}
            <span className="text-text font-medium">targeted audiences</span>{" "}
            where we know it will perform best. The cluster intelligence allows
            someone completely unfamiliar to use these connections the same way
            an expert would &mdash; because the knowledge is now in the system,
            not just in someone&rsquo;s head.
          </motion.p>
        </motion.div>

        {/* ── Phase C: The Production Pipeline ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16"
          style={{ opacity: pipelineOpacity }}
        >
          <motion.div
            className="text-center mb-8"
            style={{ y: pipelineTitleY }}
          >
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-text mb-2">
              The Production Pipeline
            </h3>
            <p className="text-sm text-text-muted max-w-lg mx-auto">
              A workflow that is completely safe, organic, and will never be seen
              as spam.
            </p>
          </motion.div>

          {/* Pipeline stages */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 max-w-4xl w-full mb-6">
            <PipelineStage
              title="Content Intelligence"
              description="Identify high-performing content across platforms and communities"
              accent={ACCENT}
              opacity={stage1Opacity}
              y={stage1Y}
            />
            <div className="hidden sm:flex items-center text-text-dim text-lg">
              &rarr;
            </div>
            <PipelineStage
              title="Variation Creation"
              description="Create fresh variations using resonance intelligence"
              accent={SECONDARY}
              opacity={stage2Opacity}
              y={stage2Y}
            />
            <div className="hidden sm:flex items-center text-text-dim text-lg">
              &rarr;
            </div>
            <PipelineStage
              title="Queue System"
              description="Precise recommendations — pick from the queue, get exact instructions on where to post"
              accent={GROWTH}
              opacity={stage3Opacity}
              y={stage3Y}
            />
            <div className="hidden sm:flex items-center text-text-dim text-lg">
              &rarr;
            </div>
            <PipelineStage
              title="Targeted Distribution"
              description="Surgically targeted delivery to communities where it will resonate most"
              accent="#f4a261"
              opacity={stage4Opacity}
              y={stage4Y}
            />
          </div>

          {/* Creator / Distributor separation */}
          <motion.div
            className="flex items-center gap-4 max-w-3xl w-full"
            style={{ opacity: rolesOpacity }}
          >
            <div className="flex-1 text-center py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <p className="text-sm uppercase tracking-widest text-text-dim mb-0.5">
                Creators
              </p>
              <p className="text-sm text-text-muted">
                Taste &amp; content craft
              </p>
            </div>
            <div className="w-px h-8 border-l border-dashed border-white/20" />
            <div className="flex-1 text-center py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <p className="text-sm uppercase tracking-widest text-text-dim mb-0.5">
                Distributors
              </p>
              <p className="text-sm text-text-muted">
                System-guided placement
              </p>
            </div>
          </motion.div>

          {/* Safe workflow badge */}
          <motion.div
            className="mt-6 px-5 py-2 rounded-full border border-white/10"
            style={{ opacity: badgeOpacity }}
          >
            <p className="text-sm text-text-muted">
              <span style={{ color: GROWTH }} className="font-semibold">
                &bull;
              </span>{" "}
              Roles are separated &mdash; lower risk, no personal exposure,
              fully organic
            </p>
          </motion.div>
        </motion.div>

      </motion.div>
    </section>

    {/* ── r/AIDangers — normal scroll, sticky title + animated bar ── */}
    <section
      ref={aidangersRef}
      className="relative"
      style={{ height: "250vh" }}
    >
      <div className="sticky top-12 h-[calc(100vh-3rem)] flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16">
        {/* Reddit-style title */}
        <div className="flex items-center justify-center -gap-1 mb-3">
          <img
            src="/reddit-logo.svg"
            alt="Reddit"
            width={90}
            height={90}
            style={{ marginRight: '-10px' }}
            className="rounded-full"
          />
          <h3 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-text">
            r/AIDangers
          </h3>
        </div>
        <p className="text-base sm:text-lg text-text-muted text-center">
          Our own platform. Zero to{" "}
          <span className="font-semibold" style={{ color: GROWTH }}>
            30,000 members
          </span>{" "}
          in six months.
        </p>
        <p className="text-sm text-text-dim mt-3 max-w-xl mx-auto leading-relaxed text-center">
          Roughly <span className="font-semibold text-text">~2,700 posts</span> of
          serious video clips sourced from AI-safety interviews and
          documentaries, plus news and article links &mdash; and roughly{" "}
          <span className="font-semibold text-text">~2,000 posts</span> of
          mainly memetic content like original memes and less serious video
          clips, aimed at younger audiences receptive to memes and viral content.
        </p>
        <p className="text-sm text-text-dim mt-2 max-w-md mx-auto leading-relaxed text-center">
          Once the workflow, team, and distribution pipeline are fully in
          place, growth should become exponential.
        </p>

        {/* Growth bar */}
        <div className="w-full max-w-2xl mb-6 mt-8">
          <div className="relative text-xs text-text-dim mb-2">
            <span className="absolute left-0">0</span>
            {/* Fixed 30K label at the 30% mark */}
            <motion.span
              style={{ opacity: goalOpacity, left: "30%", transform: "translateX(-50%)" }}
              className="absolute font-semibold"
            >
              <span style={{ color: GROWTH }}>
                <AnimatedNumber
                  value={fixedCounter}
                  format={(n) => {
                    if (n >= 10000)
                      return `${Math.round(n / 1000)}K`;
                    if (n >= 1000)
                      return `${(n / 1000).toFixed(1)}K`;
                    return Math.round(n).toString();
                  }}
                />
              </span>{" "}
              members
            </motion.span>
            {/* Trailing counter follows the golden bar edge */}
            <motion.span
              style={{ opacity: trailingOpacity, left: trailingLeft, transform: "translateX(-50%)" }}
              className="absolute font-semibold"
            >
              <motion.span style={{ color: trailingColor }}>
                <AnimatedNumber
                  value={trailingCounter}
                  format={(n) => {
                    if (n >= 999000) return "1M";
                    if (n >= 10000)
                      return `${Math.round(n / 1000)}K`;
                    if (n >= 1000)
                      return `${(n / 1000).toFixed(1)}K`;
                    return Math.round(n).toString();
                  }}
                />
              </motion.span>
            </motion.span>
            <motion.span
              style={{ opacity: goalOpacity, color: "#f4a261" }}
              className="absolute right-0 font-semibold"
            >
              1M goal
            </motion.span>
            {/* Spacer to maintain row height */}
            <span className="invisible">0</span>
          </div>
          <div className="relative h-3 rounded-full bg-white/[0.06] overflow-hidden">
            {/* Green bar: 0 → 30K */}
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: greenBarFill,
                background: `linear-gradient(90deg, ${GROWTH}, ${ACCENT})`,
              }}
            />
            {/* Golden bar: 30K → 1M */}
            <motion.div
              className="absolute inset-y-0 rounded-r-full"
              style={{
                left: "30%",
                width: goldenBarFill,
                background: `linear-gradient(90deg, ${ACCENT}, #f4a261)`,
              }}
            />
            {/* Goal marker at right edge */}
            <motion.div
              className="absolute right-0 inset-y-0 w-0.5 bg-white/20"
              style={{ opacity: goalOpacity }}
            />
          </div>
          <motion.div
            className="flex justify-between text-[10px] text-text-dim mt-1.5"
            style={{ opacity: goalOpacity }}
          >
            <span>6 months of growth</span>
            <span>End of 2026</span>
          </motion.div>
        </div>

        {/* Ownership benefit cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
          <motion.div
            className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
            style={{ opacity: benefit1Opacity, y: benefit1Y }}
          >
            <div className="flex items-center gap-3 mb-3">
              <MegaphoneIcon color="#f4a261" />
              <h4
                className="text-sm font-semibold"
                style={{ color: "#f4a261" }}
              >
                Own the Platform
              </h4>
            </div>
            <p className="text-xs text-text-dim leading-relaxed m-0">
              A platform we own and control. Broadcast any content we deem
              important without dependency on other community owners.
            </p>
          </motion.div>

          <motion.div
            className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
            style={{ opacity: benefit2Opacity, y: benefit2Y }}
          >
            <div className="flex items-center gap-3 mb-3">
              <ShieldIcon color={GROWTH} />
              <h4
                className="text-sm font-semibold"
                style={{ color: GROWTH }}
              >
                Full Control / No Risk
              </h4>
            </div>
            <p className="text-xs text-text-dim leading-relaxed m-0">
              No risk of being taken down or banned by other community owners.
              Permanent infrastructure for the movement.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
    </>
  );
}
