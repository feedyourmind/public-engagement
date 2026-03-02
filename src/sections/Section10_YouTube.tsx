"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ── Colors ── */
const YT_RED = "#ff4444";
const ACCENT = "#67d4e8";
const PODCAST = "#8b5cf6";
const GOLD = "#f0b429";
const GROWTH = "#52b788";

/* ── SVG Icons ── */

function FilmIcon({ color }: { color: string }) {
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
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
      <line x1="17" y1="17" x2="22" y2="17" />
    </svg>
  );
}

function MicIcon({ color }: { color: string }) {
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
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function SparklesIcon({ color }: { color: string }) {
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
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z" />
      <path d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5L5 17z" />
    </svg>
  );
}

function FactoryIcon({ color }: { color: string }) {
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
      <path d="M2 20V8l4-4v6l4-4v6l4-4v6l4-4v6h4v4H2z" />
    </svg>
  );
}

/* ── YouTube Play Button ── */

function YouTubeIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="4" fill={YT_RED} />
      <polygon points="10,8.5 16,12 10,15.5" fill="#fff" />
    </svg>
  );
}

/* ── Main Section ── */

export default function Section10_YouTube() {
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

  /* ── Phase A: The Animated Film (Hero) ── */
  const heroOpacity = useTransform(
    scrollYProgress,
    [0.02, 0.06, 0.22, 0.26],
    [0, 1, 1, 0]
  );
  const heroTitleY = useTransform(scrollYProgress, [0.02, 0.06], [40, 0]);
  const heroStat1Opacity = useTransform(scrollYProgress, [0.08, 0.11], [0, 1], { clamp: true });
  const heroStat1Y = useTransform(scrollYProgress, [0.08, 0.11], [20, 0], { clamp: true });
  const heroStat2Opacity = useTransform(scrollYProgress, [0.11, 0.14], [0, 1], { clamp: true });
  const heroStat2Y = useTransform(scrollYProgress, [0.11, 0.14], [20, 0], { clamp: true });
  const heroStat3Opacity = useTransform(scrollYProgress, [0.14, 0.17], [0, 1], { clamp: true });
  const heroStat3Y = useTransform(scrollYProgress, [0.14, 0.17], [20, 0], { clamp: true });

  /* ── Phase B: The Paradox ── */
  const paradoxOpacity = useTransform(
    scrollYProgress,
    [0.24, 0.28, 0.44, 0.48],
    [0, 1, 1, 0]
  );
  const paradoxTitleY = useTransform(scrollYProgress, [0.24, 0.28], [40, 0]);
  const paradoxCard1Opacity = useTransform(scrollYProgress, [0.30, 0.33], [0, 1], { clamp: true });
  const paradoxCard1Y = useTransform(scrollYProgress, [0.30, 0.33], [20, 0], { clamp: true });
  const paradoxCard2Opacity = useTransform(scrollYProgress, [0.34, 0.37], [0, 1], { clamp: true });
  const paradoxCard2Y = useTransform(scrollYProgress, [0.34, 0.37], [20, 0], { clamp: true });

  /* ── Phase C: Podcasting & Short Content ── */
  const podcastOpacity = useTransform(
    scrollYProgress,
    [0.46, 0.50, 0.68, 0.72],
    [0, 1, 1, 0]
  );
  const podcastTitleY = useTransform(scrollYProgress, [0.46, 0.50], [40, 0]);
  const podCard1Opacity = useTransform(scrollYProgress, [0.52, 0.55], [0, 1], { clamp: true });
  const podCard1Y = useTransform(scrollYProgress, [0.52, 0.55], [20, 0], { clamp: true });
  const podCard2Opacity = useTransform(scrollYProgress, [0.55, 0.58], [0, 1], { clamp: true });
  const podCard2Y = useTransform(scrollYProgress, [0.55, 0.58], [20, 0], { clamp: true });
  const podCard3Opacity = useTransform(scrollYProgress, [0.58, 0.61], [0, 1], { clamp: true });
  const podCard3Y = useTransform(scrollYProgress, [0.58, 0.61], [20, 0], { clamp: true });

  /* ── Phase D: The Investment ── */
  const investOpacity = useTransform(
    scrollYProgress,
    [0.70, 0.74, 0.92, 0.96],
    [0, 1, 1, 0]
  );
  const investTitleY = useTransform(scrollYProgress, [0.70, 0.74], [40, 0]);
  const investCard1Opacity = useTransform(scrollYProgress, [0.76, 0.79], [0, 1], { clamp: true });
  const investCard1Y = useTransform(scrollYProgress, [0.76, 0.79], [20, 0], { clamp: true });
  const investCard2Opacity = useTransform(scrollYProgress, [0.80, 0.83], [0, 1], { clamp: true });
  const investCard2Y = useTransform(scrollYProgress, [0.80, 0.83], [20, 0], { clamp: true });
  const investCard3Opacity = useTransform(scrollYProgress, [0.84, 0.87], [0, 1], { clamp: true });
  const investCard3Y = useTransform(scrollYProgress, [0.84, 0.87], [20, 0], { clamp: true });

  return (
    <section
      ref={sectionRef}
      id="youtube"
      className="relative"
      style={{ height: "500vh" }}
    >
      <motion.div
        className="sticky top-12 h-[calc(100vh-3rem)] flex items-center justify-center overflow-hidden"
        style={{ opacity: sectionOpacity }}
      >
        {/* ── Phase A: The Animated Film ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            className="text-center mb-8"
            style={{ y: heroTitleY }}
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <YouTubeIcon size={56} />
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text">
                YouTube &amp; Long-Form Content
              </h2>
            </div>
            <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
              An animated film that became a cult classic in the AI safety community &mdash;
              made by just two people, on a passion-project budget.
            </p>
          </motion.div>

          {/* Stats row */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl w-full">
            <motion.div
              className="flex-1 p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center"
              style={{ opacity: heroStat1Opacity, y: heroStat1Y }}
            >
              <p className="text-3xl sm:text-4xl font-extrabold font-mono mb-2" style={{ color: YT_RED }}>
                Cult Following
              </p>
              <p className="text-sm text-text-muted">
                Not a week goes by without a thank-you from a stranger saying it needs to be seen by millions
              </p>
            </motion.div>

            <motion.div
              className="flex-1 p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center"
              style={{ opacity: heroStat2Opacity, y: heroStat2Y }}
            >
              <p className="text-3xl sm:text-4xl font-extrabold font-mono mb-2" style={{ color: ACCENT }}>
                Raving Reviews
              </p>
              <p className="text-sm text-text-muted">
                The full AI safety argument explained visually &mdash; accessible, engaging, and comprehensive
              </p>
            </motion.div>

            <motion.div
              className="flex-1 p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center"
              style={{ opacity: heroStat3Opacity, y: heroStat3Y }}
            >
              <p className="text-3xl sm:text-4xl font-extrabold font-mono mb-2" style={{ color: GOLD }}>
                2 People
              </p>
              <p className="text-sm text-text-muted">
                Produced entirely by two people working part-time &mdash; a pure passion project
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Phase B: The Paradox ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16"
          style={{ opacity: paradoxOpacity }}
        >
          <motion.div
            className="text-center mb-8"
            style={{ y: paradoxTitleY }}
          >
            <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-text mb-4">
              The X-Risk Content Paradox
            </h3>
            <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
              The deeper you go on the X-Risk spectrum, the harder it is for people
              to engage with the arguments.
            </p>
          </motion.div>

          <div className="flex flex-col gap-4 max-w-2xl w-full">
            <motion.div
              className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              style={{ opacity: paradoxCard1Opacity, y: paradoxCard1Y }}
            >
              <div className="flex items-start gap-4">
                <FilmIcon color={YT_RED} />
                <div>
                  <p className="text-base sm:text-lg font-semibold text-text mb-2">
                    Heavy educational content doesn&rsquo;t spread like entertainment
                  </p>
                  <p className="text-sm text-text-dim leading-relaxed m-0">
                    Even presented in the most visually engaging, accessible way possible,
                    a deep explanation of the Yudkowskian model is not something the
                    un-worried will naturally seek out. The concepts are complex. The
                    stakes are abstract. Entertainment will always have easier reach.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              style={{ opacity: paradoxCard2Opacity, y: paradoxCard2Y }}
            >
              <div className="flex items-start gap-4">
                <SparklesIcon color={ACCENT} />
                <div>
                  <p className="text-base sm:text-lg font-semibold text-text mb-2">
                    But this is exactly why the distribution pipeline matters
                  </p>
                  <p className="text-sm text-text-dim leading-relaxed m-0">
                    If the content can&rsquo;t find its audience through entertainment
                    algorithms alone, you build the system that puts it in front of the
                    right people. The social media distribution engine bridges the gap
                    between deep, important content and the audiences that need it most.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Phase C: Podcasting & Short Content ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16"
          style={{ opacity: podcastOpacity }}
        >
          <motion.div
            className="text-center mb-8"
            style={{ y: podcastTitleY }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <MicIcon color={PODCAST} />
              <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-text">
                Podcasting &amp; Short-Form Content
              </h3>
            </div>
            <p className="text-base sm:text-lg text-text-muted max-w-xl mx-auto leading-relaxed">
              Expanding the format range &mdash; from weekly shows to daily micro-content.
            </p>
          </motion.div>

          <div className="flex flex-col gap-4 max-w-3xl w-full">
            <motion.div
              className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              style={{ opacity: podCard1Opacity, y: podCard1Y }}
            >
              <div className="flex items-start gap-4">
                <MicIcon color={PODCAST} />
                <div>
                  <p className="text-base font-semibold text-text mb-1">
                    Doom Debates &amp; Warning Shots{" "}
                    <span className="text-xs font-normal text-text-dim">&mdash; active now</span>
                  </p>
                  <p className="text-sm text-text-dim leading-relaxed m-0">
                    A weekly podcast with two other sizable creators, building a growing
                    audience. Conversations with many others are in the works &mdash;
                    Dan Fagiela, Michael, and more.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              style={{ opacity: podCard2Opacity, y: podCard2Y }}
            >
              <div className="flex items-start gap-4">
                <SparklesIcon color={GOLD} />
                <div>
                  <p className="text-base font-semibold text-text mb-1">
                    More Podcasting at Higher Frequency
                  </p>
                  <p className="text-sm text-text-dim leading-relaxed m-0">
                    Once bandwidth frees up from building the team and platform workflows,
                    podcasting scales up significantly. Multiple formats planned, with
                    short content that performs well on TikTok and other platforms.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              style={{ opacity: podCard3Opacity, y: podCard3Y }}
            >
              <div className="flex items-start gap-4">
                <SparklesIcon color={YT_RED} />
                <div>
                  <p className="text-base font-semibold text-text mb-1">
                    Daily Twitter Commentary
                  </p>
                  <p className="text-sm text-text-dim leading-relaxed m-0">
                    A short daily analysis from curated Twitter threads &mdash; agile,
                    authentic, influencer-style commentary. No studio feel, just real
                    reactions to what&rsquo;s happening every day. The raw material never
                    runs out.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Phase D: The Investment ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16"
          style={{ opacity: investOpacity }}
        >
          <motion.div
            className="text-center mb-8"
            style={{ y: investTitleY }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <FactoryIcon color={GROWTH} />
              <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-text">
                Building the Content Engine
              </h3>
            </div>
            <p className="text-base sm:text-lg text-text-muted max-w-xl mx-auto leading-relaxed">
              The most important investment isn&rsquo;t paying for content &mdash;
              it&rsquo;s building the capacity to create it.
            </p>
          </motion.div>

          <div className="flex flex-col gap-4 max-w-3xl w-full">
            {/* The Goose metaphor */}
            <motion.div
              className="p-6 rounded-xl border text-center"
              style={{
                opacity: investCard1Opacity,
                y: investCard1Y,
                borderColor: "rgba(240,180,41,0.3)",
                background: "rgba(240,180,41,0.04)",
              }}
            >
              <p className="text-lg sm:text-xl font-semibold text-text mb-3">
                Paying for content ={" "}
                <span className="text-text-muted font-normal">expense</span>
              </p>
              <p className="text-lg sm:text-xl font-semibold mb-3" style={{ color: GOLD }}>
                Building content capacity = investment
              </p>
              <p className="text-sm text-text-dim leading-relaxed m-0">
                Outsourced content is a one-time transaction. In-house content creation
                muscle is the goose that lays golden eggs &mdash; a gift that keeps on giving.
              </p>
            </motion.div>

            {/* AI tools unlock */}
            <motion.div
              className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              style={{ opacity: investCard2Opacity, y: investCard2Y }}
            >
              <div className="flex items-start gap-4">
                <SparklesIcon color={ACCENT} />
                <div>
                  <p className="text-base font-semibold text-text mb-1">
                    AI Video Tools Change Everything
                  </p>
                  <p className="text-sm text-text-dim leading-relaxed m-0">
                    The latest AI video generation tools make it possible to execute
                    creative vision at a fraction of the previous cost. A backlog of
                    animated scripts is ready to produce &mdash; real magic waiting to
                    be unleashed.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Bottleneck */}
            <motion.div
              className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              style={{ opacity: investCard3Opacity, y: investCard3Y }}
            >
              <div className="flex items-start gap-4">
                <FactoryIcon color={GROWTH} />
                <div>
                  <p className="text-base font-semibold text-text mb-1">
                    The Bottleneck: Low-Cost Production Resources
                  </p>
                  <p className="text-sm text-text-dim leading-relaxed m-0">
                    The creativity and scripts exist. The ideas are there. What&rsquo;s
                    needed is basic, low-cost resources for video editing and production
                    to increase throughput. Once the workflows and team are in place, the
                    focus shifts back to creating high-quality original content at scale.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
