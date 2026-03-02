"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ── Colors ── */
const ACCENT = "#67d4e8";
const GROWTH = "#52b788";
const X_COLOR = "#ffffff";
const IG_GRADIENT = "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)";

/* ── SVG Icons ── */

function RocketIcon({ color }: { color: string }) {
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
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function GlobeIcon({ color }: { color: string }) {
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
      <circle cx={12} cy={12} r={10} />
      <line x1={2} y1={12} x2={22} y2={12} />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function InstagramIcon({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <defs>
        <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f09433" />
          <stop offset="25%" stopColor="#e6683c" />
          <stop offset="50%" stopColor="#dc2743" />
          <stop offset="75%" stopColor="#cc2366" />
          <stop offset="100%" stopColor="#bc1888" />
        </linearGradient>
      </defs>
      <rect x={2} y={2} width={20} height={20} rx={5} stroke="url(#ig-grad)" strokeWidth={1.5} fill="none" />
      <circle cx={12} cy={12} r={5} stroke="url(#ig-grad)" strokeWidth={1.5} fill="none" />
      <circle cx={17.5} cy={6.5} r={1.25} fill="url(#ig-grad)" />
    </svg>
  );
}

/* ── Main Section ── */

export default function Section04c_Platforms() {
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

  /* ── Phase A: X / Twitter ── */
  const xOpacity = useTransform(
    scrollYProgress,
    [0.02, 0.06, 0.30, 0.34],
    [0, 1, 1, 0]
  );
  const xTitleY = useTransform(scrollYProgress, [0.02, 0.06], [40, 0]);
  const xStat1Opacity = useTransform(scrollYProgress, [0.08, 0.11], [0, 1], { clamp: true });
  const xStat1Y = useTransform(scrollYProgress, [0.08, 0.11], [20, 0], { clamp: true });
  const xStat2Opacity = useTransform(scrollYProgress, [0.11, 0.14], [0, 1], { clamp: true });
  const xStat2Y = useTransform(scrollYProgress, [0.11, 0.14], [20, 0], { clamp: true });
  const xStat3Opacity = useTransform(scrollYProgress, [0.14, 0.17], [0, 1], { clamp: true });
  const xStat3Y = useTransform(scrollYProgress, [0.14, 0.17], [20, 0], { clamp: true });
  const xPipelineOpacity = useTransform(scrollYProgress, [0.18, 0.22], [0, 1], { clamp: true });
  const xPipelineY = useTransform(scrollYProgress, [0.18, 0.22], [20, 0], { clamp: true });

  /* ── Phase B: Instagram ── */
  const igOpacity = useTransform(
    scrollYProgress,
    [0.32, 0.36, 0.60, 0.64],
    [0, 1, 1, 0]
  );
  const igTitleY = useTransform(scrollYProgress, [0.32, 0.36], [40, 0]);
  const igStat1Opacity = useTransform(scrollYProgress, [0.38, 0.41], [0, 1], { clamp: true });
  const igStat1Y = useTransform(scrollYProgress, [0.38, 0.41], [20, 0], { clamp: true });
  const igPipelineOpacity = useTransform(scrollYProgress, [0.44, 0.48], [0, 1], { clamp: true });
  const igPipelineY = useTransform(scrollYProgress, [0.44, 0.48], [20, 0], { clamp: true });

  /* ── Phase C: All Platforms ── */
  const allOpacity = useTransform(
    scrollYProgress,
    [0.62, 0.66, 0.92, 0.96],
    [0, 1, 1, 0]
  );
  const allTitleY = useTransform(scrollYProgress, [0.62, 0.66], [40, 0]);
  const allCard1Opacity = useTransform(scrollYProgress, [0.68, 0.71], [0, 1], { clamp: true });
  const allCard1Y = useTransform(scrollYProgress, [0.68, 0.71], [20, 0], { clamp: true });
  const allCard2Opacity = useTransform(scrollYProgress, [0.72, 0.75], [0, 1], { clamp: true });
  const allCard2Y = useTransform(scrollYProgress, [0.72, 0.75], [20, 0], { clamp: true });

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: "400vh" }}
    >
      <motion.div
        className="sticky top-12 h-[calc(100vh-3rem)] flex items-center justify-center overflow-hidden"
        style={{ opacity: sectionOpacity }}
      >
        {/* ── Phase A: X / Twitter ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16"
          style={{ opacity: xOpacity }}
        >
          <motion.div
            className="text-center mb-8"
            style={{ y: xTitleY }}
          >
            <div className="flex items-center justify-center mb-4">
              <img
                src="/x-logo.jpg"
                alt="X"
                width={100}
                height={100}
                className="rounded-2xl"
                style={{ filter: "invert(1)" }}
              />
            </div>
            <p className="text-base sm:text-lg text-text-muted max-w-lg mx-auto leading-relaxed">
              Built over the past year without any distribution system,
              growth strategy or infrastructure.
            </p>
          </motion.div>

          {/* Stats row */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl w-full mb-8">
            <motion.div
              className="flex-1 p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center"
              style={{ opacity: xStat1Opacity, y: xStat1Y }}
            >
              <p className="text-4xl sm:text-5xl font-extrabold font-mono mb-2" style={{ color: X_COLOR }}>
                ~12K
              </p>
              <p className="text-base text-text-muted">followers</p>
            </motion.div>

            <motion.div
              className="flex-1 p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center"
              style={{ opacity: xStat2Opacity, y: xStat2Y }}
            >
              <p className="text-4xl sm:text-5xl font-extrabold font-mono mb-2" style={{ color: X_COLOR }}>
                ~4,000
              </p>
              <p className="text-base text-text-muted">posts &mdash; mostly original content</p>
            </motion.div>

            <motion.div
              className="flex-1 p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center"
              style={{ opacity: xStat3Opacity, y: xStat3Y }}
            >
              <p className="text-4xl sm:text-5xl font-extrabold font-mono mb-2" style={{ color: ACCENT }}>
                1 year*
              </p>
              <p className="text-base text-text-muted">of growth, trying different approaches &mdash; no concrete system used</p>
              <p className="text-xs text-text-muted/60 mt-2">*(stopped working on it around October &mdash; focus switched to Reddit)</p>
            </motion.div>
          </div>

          {/* Pipeline integration note */}
          <motion.div
            className="max-w-3xl w-full p-6 rounded-xl border border-white/[0.08] bg-white/[0.02]"
            style={{ opacity: xPipelineOpacity, y: xPipelineY }}
          >
            <div className="flex items-start gap-4">
              <RocketIcon color={ACCENT} />
              <div>
                <p className="text-base sm:text-lg font-semibold text-text mb-2">
                  Soon to be integrated into the Distribution Pipeline
                </p>
                <p className="text-sm sm:text-base text-text-dim leading-relaxed m-0">
                  X is about to become part of the full distribution workflow.
                  With the same resonance intelligence and targeted distribution
                  that powers Reddit, growth is expected to{" "}
                  <span className="font-semibold" style={{ color: ACCENT }}>
                    accelerate many times over
                  </span>.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Phase B: Instagram ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16"
          style={{ opacity: igOpacity }}
        >
          <motion.div
            className="text-center mb-8"
            style={{ y: igTitleY }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <InstagramIcon size={76} />
              <h3 className="font-heading text-3xl sm:text-4xl font-bold text-text">
                Instagram
              </h3>
            </div>
            <p className="text-base sm:text-lg text-text-muted max-w-lg mx-auto leading-relaxed">
              The newest addition to our platform presence.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="max-w-lg w-full p-8 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center mb-8"
            style={{ opacity: igStat1Opacity, y: igStat1Y }}
          >
            <p className="text-5xl sm:text-6xl font-extrabold font-mono mb-3" style={{ background: IG_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              5,000
            </p>
            <p className="text-lg text-text-muted mb-1">
              followers
            </p>
            <p className="text-base text-text-dim">
              Grown from{" "}
              <span className="font-semibold text-text">zero</span> in just{" "}
              <span className="font-semibold text-text">two months</span>
            </p>
          </motion.div>

          {/* Pipeline integration note */}
          <motion.div
            className="max-w-3xl w-full p-6 rounded-xl border border-white/[0.08] bg-white/[0.02]"
            style={{ opacity: igPipelineOpacity, y: igPipelineY }}
          >
            <div className="flex items-start gap-4">
              <RocketIcon color="#dc2743" />
              <div>
                <p className="text-base sm:text-lg font-semibold text-text mb-2">
                  Distribution Pipeline Integration Coming Soon
                </p>
                <p className="text-sm sm:text-base text-text-dim leading-relaxed m-0">
                  Once Instagram becomes part of the distribution pipeline and
                  workflow, the same systematic approach is expected to{" "}
                  <span className="font-semibold" style={{ color: "#dc2743" }}>
                    accelerate growth significantly
                  </span>{" "}
                  &mdash; just as it has with Reddit.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Phase C: All Platforms ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16"
          style={{ opacity: allOpacity }}
        >
          <motion.div
            className="text-center mb-8"
            style={{ y: allTitleY }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <GlobeIcon color={GROWTH} />
              <h3 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text">
                All Major Platforms
              </h3>
            </div>
            <p className="text-base sm:text-lg text-text-muted max-w-lg mx-auto leading-relaxed">
              Placeholder accounts are established across every major platform &mdash;
              ready to be activated.
            </p>
          </motion.div>

          {/* Platform grid */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 max-w-2xl mb-8"
            style={{ opacity: allCard1Opacity, y: allCard1Y }}
          >
            {["YouTube", "TikTok", "LinkedIn", "Facebook", "Threads", "Bluesky", "Mastodon"].map((platform) => (
              <div
                key={platform}
                className="px-5 py-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-base text-text-muted"
              >
                {platform}
              </div>
            ))}
          </motion.div>

          {/* Vision statement */}
          <motion.div
            className="max-w-2xl w-full p-6 rounded-xl border border-white/[0.08] bg-white/[0.02] text-center"
            style={{ opacity: allCard2Opacity, y: allCard2Y }}
          >
            <p className="text-base sm:text-lg text-text leading-relaxed">
              All platforms will be brought into the fold, riding the wave of{" "}
              <span className="font-bold" style={{ color: GROWTH }}>
                hyper-growth
              </span>{" "}
              throughout the upcoming months. As each platform joins the
              distribution pipeline, the compounding effect across all channels
              creates an{" "}
              <span className="font-bold" style={{ color: ACCENT }}>
                unstoppable cross-platform presence
              </span>.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
