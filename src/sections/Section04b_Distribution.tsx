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
        <h4 className="text-sm font-semibold" style={{ color: accent }}>
          {title}
        </h4>
      </div>
      <p className="text-xs text-text-dim leading-relaxed m-0">{description}</p>
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
      <p className="text-xs font-mono font-semibold text-text mb-1">{title}</p>
      <p className="text-[10px] text-text-dim leading-relaxed m-0">
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
    [0.0, 0.04, 0.92, 0.98],
    [0, 1, 1, 0]
  );

  /* ── Phase A: Hero ── */
  const heroOpacity = useTransform(
    scrollYProgress,
    [0.02, 0.06, 0.22, 0.28],
    [0, 1, 1, 0]
  );
  const heroY = useTransform(scrollYProgress, [0.02, 0.06], [40, 0]);
  const iconScale = useTransform(scrollYProgress, [0.02, 0.08], [0.6, 1], {
    clamp: true,
  });
  const iconGlowOpacity = useTransform(
    scrollYProgress,
    [0.04, 0.1],
    [0, 0.6],
    { clamp: true }
  );
  const statCounter = useTransform(scrollYProgress, [0.1, 0.16], [0, 9], {
    clamp: true,
  });
  const statOpacity = useTransform(scrollYProgress, [0.1, 0.14], [0, 1], {
    clamp: true,
  });

  /* ── Phase B: Resonance Intelligence ── */
  const intelligenceOpacity = useTransform(
    scrollYProgress,
    [0.24, 0.3, 0.46, 0.52],
    [0, 1, 1, 0]
  );
  const intelligenceTitleY = useTransform(
    scrollYProgress,
    [0.24, 0.3],
    [30, 0]
  );

  const card1Opacity = useTransform(scrollYProgress, [0.28, 0.32], [0, 1], {
    clamp: true,
  });
  const card1Y = useTransform(scrollYProgress, [0.28, 0.32], [20, 0], {
    clamp: true,
  });
  const card2Opacity = useTransform(scrollYProgress, [0.3, 0.34], [0, 1], {
    clamp: true,
  });
  const card2Y = useTransform(scrollYProgress, [0.3, 0.34], [20, 0], {
    clamp: true,
  });
  const card3Opacity = useTransform(scrollYProgress, [0.32, 0.36], [0, 1], {
    clamp: true,
  });
  const card3Y = useTransform(scrollYProgress, [0.32, 0.36], [20, 0], {
    clamp: true,
  });
  const resonanceTextOpacity = useTransform(
    scrollYProgress,
    [0.36, 0.4],
    [0, 1],
    { clamp: true }
  );

  /* ── Phase C: Production Pipeline ── */
  const pipelineOpacity = useTransform(
    scrollYProgress,
    [0.48, 0.54, 0.7, 0.76],
    [0, 1, 1, 0]
  );
  const pipelineTitleY = useTransform(
    scrollYProgress,
    [0.48, 0.54],
    [30, 0]
  );

  const stage1Opacity = useTransform(scrollYProgress, [0.52, 0.55], [0, 1], {
    clamp: true,
  });
  const stage1Y = useTransform(scrollYProgress, [0.52, 0.55], [20, 0], {
    clamp: true,
  });
  const stage2Opacity = useTransform(scrollYProgress, [0.54, 0.57], [0, 1], {
    clamp: true,
  });
  const stage2Y = useTransform(scrollYProgress, [0.54, 0.57], [20, 0], {
    clamp: true,
  });
  const stage3Opacity = useTransform(scrollYProgress, [0.56, 0.59], [0, 1], {
    clamp: true,
  });
  const stage3Y = useTransform(scrollYProgress, [0.56, 0.59], [20, 0], {
    clamp: true,
  });
  const stage4Opacity = useTransform(scrollYProgress, [0.58, 0.61], [0, 1], {
    clamp: true,
  });
  const stage4Y = useTransform(scrollYProgress, [0.58, 0.61], [20, 0], {
    clamp: true,
  });
  const rolesOpacity = useTransform(scrollYProgress, [0.6, 0.64], [0, 1], {
    clamp: true,
  });
  const badgeOpacity = useTransform(scrollYProgress, [0.62, 0.66], [0, 1], {
    clamp: true,
  });

  /* ── Phase D: Platform Ownership ── */
  const ownershipOpacity = useTransform(
    scrollYProgress,
    [0.72, 0.78, 0.92, 0.98],
    [0, 1, 1, 0]
  );
  const ownershipTitleY = useTransform(
    scrollYProgress,
    [0.72, 0.78],
    [40, 0]
  );
  const growthBarWidth = useTransform(scrollYProgress, [0.78, 0.84], [0, 100], {
    clamp: true,
  });
  const growthBarFill = useTransform(growthBarWidth, (v) => `${v * 0.3}%`);
  const memberCounter = useTransform(
    scrollYProgress,
    [0.78, 0.84],
    [0, 30000],
    { clamp: true }
  );
  const goalOpacity = useTransform(scrollYProgress, [0.82, 0.86], [0, 1], {
    clamp: true,
  });
  const benefit1Opacity = useTransform(scrollYProgress, [0.84, 0.88], [0, 1], {
    clamp: true,
  });
  const benefit1Y = useTransform(scrollYProgress, [0.84, 0.88], [20, 0], {
    clamp: true,
  });
  const benefit2Opacity = useTransform(scrollYProgress, [0.86, 0.9], [0, 1], {
    clamp: true,
  });
  const benefit2Y = useTransform(scrollYProgress, [0.86, 0.9], [20, 0], {
    clamp: true,
  });

  return (
    <section
      ref={sectionRef}
      id="distribution"
      className="relative"
      style={{ height: "400vh" }}
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
          <div className="relative mb-8">
            <motion.div
              className="absolute inset-0 rounded-full blur-3xl"
              style={{
                background: `radial-gradient(circle, ${ACCENT}40, transparent 70%)`,
                opacity: iconGlowOpacity,
                scale: 1.5,
              }}
            />
            <motion.img
              src="/distribution-icon.png"
              alt="Distribution Engine"
              className="w-28 h-28 sm:w-36 sm:h-36 relative z-10 drop-shadow-2xl"
              style={{ scale: iconScale }}
            />
          </div>

          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text text-center leading-tight tracking-tight mb-4">
            The Distribution Engine
          </h2>
          <p className="text-lg sm:text-xl text-text-muted text-center max-w-2xl leading-relaxed mb-8">
            Reddit-native infrastructure for AI safety content at scale
          </p>

          {/* Animated stat */}
          <motion.div className="text-center" style={{ opacity: statOpacity }}>
            <div className="flex items-baseline justify-center gap-1">
              <span
                className="text-5xl sm:text-6xl font-extrabold font-mono"
                style={{ color: ACCENT }}
              >
                ~
                <AnimatedNumber
                  value={statCounter}
                  format={(n) => n.toFixed(1)}
                />
                M
              </span>
            </div>
            <p className="text-sm text-text-muted mt-2">
              views per month &mdash; and growing
            </p>
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
            className="text-sm text-text-muted text-center max-w-xl leading-relaxed"
            style={{ opacity: resonanceTextOpacity }}
          >
            Take viral content that has proven performance &mdash; either on
            other platforms or in other communities &mdash; create{" "}
            <span className="text-text font-medium">variations</span>, and
            distribute to the{" "}
            <span className="text-text font-medium">targeted audiences</span>{" "}
            where we know it will perform best. The cluster intelligence
            allows someone completely unfamiliar to use these connections the
            same way an expert would &mdash; because the knowledge is now in
            the system, not just in someone&rsquo;s head.
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
              <p className="text-[9px] uppercase tracking-widest text-text-dim mb-0.5">
                Creators
              </p>
              <p className="text-[10px] text-text-muted">
                Taste &amp; content craft
              </p>
            </div>
            <div className="w-px h-8 border-l border-dashed border-white/20" />
            <div className="flex-1 text-center py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <p className="text-[9px] uppercase tracking-widest text-text-dim mb-0.5">
                Distributors
              </p>
              <p className="text-[10px] text-text-muted">
                System-guided placement
              </p>
            </div>
          </motion.div>

          {/* Safe workflow badge */}
          <motion.div
            className="mt-6 px-5 py-2 rounded-full border border-white/10"
            style={{ opacity: badgeOpacity }}
          >
            <p className="text-xs text-text-muted">
              <span style={{ color: GROWTH }} className="font-semibold">
                &bull;
              </span>{" "}
              Roles are separated &mdash; lower risk, no personal exposure,
              fully organic
            </p>
          </motion.div>
        </motion.div>

        {/* ── Phase D: Platform Ownership ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16"
          style={{ opacity: ownershipOpacity }}
        >
          <motion.div
            className="text-center mb-8"
            style={{ y: ownershipTitleY }}
          >
            {/* Reddit-style title */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <svg width={28} height={28} viewBox="0 0 24 24">
                <circle cx={12} cy={12} r={10} fill={REDDIT} />
                <circle cx={8.5} cy={11} r={1.5} fill="white" />
                <circle cx={15.5} cy={11} r={1.5} fill="white" />
                <path
                  d="M8.5 15.5 Q12 18 15.5 15.5"
                  fill="none"
                  stroke="white"
                  strokeWidth={1.2}
                  strokeLinecap="round"
                />
              </svg>
              <h3 className="font-heading text-3xl sm:text-4xl font-bold text-text">
                r/AIDangers
              </h3>
            </div>
            <p className="text-sm text-text-muted">
              Our own platform. Zero to{" "}
              <span className="font-semibold" style={{ color: GROWTH }}>
                30,000 members
              </span>{" "}
              in six months.
            </p>
          </motion.div>

          {/* Growth bar */}
          <div className="w-full max-w-2xl mb-6">
            <div className="flex justify-between text-xs text-text-dim mb-2">
              <span>0</span>
              <motion.span
                style={{ opacity: goalOpacity }}
                className="font-semibold"
              >
                <span style={{ color: GROWTH }}>
                  <AnimatedNumber
                    value={memberCounter}
                    format={(n) => {
                      if (n >= 1000)
                        return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
                      return Math.round(n).toString();
                    }}
                  />
                </span>{" "}
                members
              </motion.span>
              <motion.span
                style={{ opacity: goalOpacity, color: "#f4a261" }}
                className="font-semibold"
              >
                1M goal
              </motion.span>
            </div>
            <div className="relative h-3 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: growthBarFill,
                  background: `linear-gradient(90deg, ${GROWTH}, ${ACCENT})`,
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
                  No Ban Risk
                </h4>
              </div>
              <p className="text-xs text-text-dim leading-relaxed m-0">
                No risk of being taken down or banned by other community owners.
                Permanent infrastructure for the movement.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
