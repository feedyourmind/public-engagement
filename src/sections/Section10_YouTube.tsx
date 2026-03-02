"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

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
    [0.02, 0.05, 0.15, 0.18],
    [0, 1, 1, 0]
  );
  const heroTitleY = useTransform(scrollYProgress, [0.02, 0.05], [40, 0]);
  const heroStat1Opacity = useTransform(scrollYProgress, [0.07, 0.09], [0, 1], { clamp: true });
  const heroStat1Y = useTransform(scrollYProgress, [0.07, 0.09], [20, 0], { clamp: true });
  const heroStat2Opacity = useTransform(scrollYProgress, [0.09, 0.11], [0, 1], { clamp: true });
  const heroStat2Y = useTransform(scrollYProgress, [0.09, 0.11], [20, 0], { clamp: true });
  const heroStat3Opacity = useTransform(scrollYProgress, [0.11, 0.13], [0, 1], { clamp: true });
  const heroStat3Y = useTransform(scrollYProgress, [0.11, 0.13], [20, 0], { clamp: true });

  /* ── Phase B: Animation Production ── */
  const prodOpacity = useTransform(
    scrollYProgress,
    [0.17, 0.20, 0.33, 0.36],
    [0, 1, 1, 0]
  );
  const prodTitleY = useTransform(scrollYProgress, [0.17, 0.20], [40, 0]);
  const prodCard1Opacity = useTransform(scrollYProgress, [0.22, 0.25], [0, 1], { clamp: true });
  const prodCard1Y = useTransform(scrollYProgress, [0.22, 0.25], [20, 0], { clamp: true });
  const prodCard2Opacity = useTransform(scrollYProgress, [0.25, 0.28], [0, 1], { clamp: true });
  const prodCard2Y = useTransform(scrollYProgress, [0.25, 0.28], [20, 0], { clamp: true });
  const prodCard3Opacity = useTransform(scrollYProgress, [0.28, 0.31], [0, 1], { clamp: true });
  const prodCard3Y = useTransform(scrollYProgress, [0.28, 0.31], [20, 0], { clamp: true });

  /* ── Phase C: The Paradox ── */
  const paradoxOpacity = useTransform(
    scrollYProgress,
    [0.35, 0.38, 0.50, 0.53],
    [0, 1, 1, 0]
  );
  const paradoxTitleY = useTransform(scrollYProgress, [0.35, 0.38], [40, 0]);
  const paradoxCard1Opacity = useTransform(scrollYProgress, [0.40, 0.43], [0, 1], { clamp: true });
  const paradoxCard1Y = useTransform(scrollYProgress, [0.40, 0.43], [20, 0], { clamp: true });
  const paradoxCard2Opacity = useTransform(scrollYProgress, [0.44, 0.47], [0, 1], { clamp: true });
  const paradoxCard2Y = useTransform(scrollYProgress, [0.44, 0.47], [20, 0], { clamp: true });

  /* ── Phase D: Podcasting & Short Content ── */
  const podcastOpacity = useTransform(
    scrollYProgress,
    [0.52, 0.55, 0.70, 0.73],
    [0, 1, 1, 0]
  );
  const podcastTitleY = useTransform(scrollYProgress, [0.52, 0.55], [40, 0]);
  const podCard1Opacity = useTransform(scrollYProgress, [0.57, 0.59], [0, 1], { clamp: true });
  const podCard1Y = useTransform(scrollYProgress, [0.57, 0.59], [20, 0], { clamp: true });
  const podCard2Opacity = useTransform(scrollYProgress, [0.59, 0.61], [0, 1], { clamp: true });
  const podCard2Y = useTransform(scrollYProgress, [0.59, 0.61], [20, 0], { clamp: true });
  const podCard3Opacity = useTransform(scrollYProgress, [0.61, 0.63], [0, 1], { clamp: true });
  const podCard3Y = useTransform(scrollYProgress, [0.61, 0.63], [20, 0], { clamp: true });
  const podCard4Opacity = useTransform(scrollYProgress, [0.63, 0.65], [0, 1], { clamp: true });
  const podCard4Y = useTransform(scrollYProgress, [0.63, 0.65], [20, 0], { clamp: true });

  /* ── Phase E: The Investment ── */
  const investOpacity = useTransform(
    scrollYProgress,
    [0.72, 0.75, 0.92, 0.95],
    [0, 1, 1, 0]
  );
  const investTitleY = useTransform(scrollYProgress, [0.72, 0.75], [40, 0]);
  const investCard1Opacity = useTransform(scrollYProgress, [0.77, 0.80], [0, 1], { clamp: true });
  const investCard1Y = useTransform(scrollYProgress, [0.77, 0.80], [20, 0], { clamp: true });
  const investCard2Opacity = useTransform(scrollYProgress, [0.80, 0.83], [0, 1], { clamp: true });
  const investCard2Y = useTransform(scrollYProgress, [0.80, 0.83], [20, 0], { clamp: true });
  const investCard3Opacity = useTransform(scrollYProgress, [0.83, 0.86], [0, 1], { clamp: true });
  const investCard3Y = useTransform(scrollYProgress, [0.83, 0.86], [20, 0], { clamp: true });

  return (
    <section
      ref={sectionRef}
      id="youtube"
      className="relative"
      style={{ height: "600vh" }}
    >
      {/* Invisible scroll anchors for URL hash navigation */}
      <div id="animated-content" className="absolute" style={{ top: "20%" }} />
      <div id="xrisk-paradox" className="absolute" style={{ top: "38%" }} />
      <div id="podcasting" className="absolute" style={{ top: "55%" }} />
      <div id="content-engine" className="absolute" style={{ top: "75%" }} />

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
            className="text-center mb-4"
            style={{ y: heroTitleY }}
          >
            <div className="flex items-center justify-center gap-4 mb-3">
              <YouTubeIcon size={48} />
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text">
                YouTube &amp; Long-Form Content
              </h2>
            </div>
            <p className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto leading-relaxed">
              It all started with the Lethal Intelligence Guide. The best crash course to the lethal dangers of upcoming Autonomous
              and General Artificial Intelligence systems (AGI).
            </p>
            <div className="flex gap-6 max-w-2xl mx-auto mt-3">
              <p className="flex-1 text-sm sm:text-base text-text-muted leading-relaxed text-center">
                <span className="font-semibold text-text">Part 1:</span> A comprehensive and nuanced dissection of the problem &mdash;
                how the race to AGI risks wiping out all value, present and future.
              </p>
              <p className="flex-1 text-sm sm:text-base text-text-muted leading-relaxed text-center">
                <span className="font-semibold text-text">Part 2:</span> The complete picture &mdash; includes a takeover scenario
                and all the remaining dimensions of the problem.
              </p>
            </div>
          </motion.div>

          {/* Thumbnail image */}
          <div className="mb-4 max-w-xl w-full">
            <Image
              src="/films.jpg"
              alt="Lethal AI Guide Part 1 and Part 2 thumbnails"
              width={708}
              height={348}
              className="w-full h-auto rounded-xl"
            />
          </div>

          {/* Stats row */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-4xl w-full">
            <motion.div
              className="flex-1 p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center"
              style={{ opacity: heroStat1Opacity, y: heroStat1Y }}
            >
              <p className="text-lg sm:text-xl font-extrabold font-mono mb-2" style={{ color: YT_RED }}>
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
              <p className="text-lg sm:text-xl font-extrabold font-mono mb-2" style={{ color: ACCENT }}>
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
              <p className="text-lg sm:text-xl font-extrabold font-mono mb-2" style={{ color: GOLD }}>
                Pure Passion Project
              </p>
              <p className="text-sm text-text-muted">
                Produced entirely by just two people working part-time with extremely constrained resources
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Phase B: Animation Production ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16"
          style={{ opacity: prodOpacity }}
        >
          <motion.div
            className="text-center mb-6"
            style={{ y: prodTitleY }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <FilmIcon color={GOLD} />
              <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-text">
                Animated Content &amp; What&rsquo;s Next
              </h3>
            </div>
            <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
              Every frame hand-crafted without AI &mdash; an enormous effort
              under extremely constrained resources.
            </p>
          </motion.div>

          <div className="flex flex-col gap-4 max-w-3xl w-full">
            <motion.div
              className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              style={{ opacity: prodCard1Opacity, y: prodCard1Y }}
            >
              <div className="flex items-start gap-4">
                <FilmIcon color={YT_RED} />
                <div>
                  <p className="text-base font-semibold text-text mb-1">
                    Hand-Crafted, No AI
                  </p>
                  <p className="text-sm text-text-dim leading-relaxed m-0">
                    The Lethal Intelligence films were produced entirely without AI-generated content.
                    At this level of quality, with just two people working part-time, production
                    took an extraordinarily long time. Every animation, every visual &mdash;
                    painstakingly crafted by hand.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              style={{ opacity: prodCard2Opacity, y: prodCard2Y }}
            >
              <div className="flex items-start gap-4">
                <SparklesIcon color={ACCENT} />
                <div>
                  <p className="text-base font-semibold text-text mb-1">
                    Short Animated Stories{" "}
                    <span className="text-xs font-semibold" style={{ color: GROWTH }}>&mdash; already live</span>
                  </p>
                  <p className="text-sm text-text-dim leading-relaxed mb-3">
                    Beyond the main films, we&rsquo;ve already produced a series of short
                    animated stories that audiences have loved.
                    We want to produce many, many more &mdash; there&rsquo;s a very long list
                    of ideas, just waiting for the resources and time to bring them to life.
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {[
                      { id: "pAdTiz3UmIo", title: "Facing St. Peter at the Pearly Gates" },
                      { id: "gmC-MSwSQ-8", title: "Stephen Hawking Quotes on AI" },
                      { id: "mDwP6uTQNRA", title: "How Can Smart AI Harm Me?" },
                      { id: "P3hzEJ2gJY0", title: "The Anti-AI Protest Movement" },
                      { id: "18Wgj6iH_a8", title: "The First AI Millionaire" },
                      { id: "JhmKc-8gce4", title: "Appreciate the Small Things" },
                      { id: "GWEGwID7SE0", title: "Doctor, I Think AI Will Lead to the End of the World" },
                    ].map((v) => (
                      <a
                        key={v.id}
                        href={`https://www.youtube.com/watch?v=${v.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg overflow-hidden hover:ring-2 hover:ring-white/20 transition-all"
                        title={v.title}
                      >
                        <img
                          src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                          alt={v.title}
                          className="w-full h-auto"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              style={{ opacity: prodCard3Opacity, y: prodCard3Y }}
            >
              <div className="flex items-start gap-4">
                <SparklesIcon color={GOLD} />
                <div>
                  <p className="text-base font-semibold text-text mb-1">
                    AI Tools Will Change Everything
                  </p>
                  <p className="text-sm text-text-dim leading-relaxed m-0">
                    With rapid advances in AI-generated video, we can now produce animated
                    content dramatically faster. There&rsquo;s a deep backlog of exciting
                    scripts just itching to get out there &mdash; powerful stories ready to be
                    picked up and produced. It&rsquo;s now a matter of bandwidth and resources
                    to unlock them.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Phase C: The Paradox ── */}
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
                    Warning Shots{" "}
                    <span className="text-xs font-semibold" style={{ color: GROWTH }}>&mdash; active now (31 episodes as of March 1st)</span>
                  </p>
                  <p className="text-sm text-text-dim leading-relaxed m-0">
                    A weekly podcast with two other sizable creators (Liron Shapira
                    from Doom Debates and John Sherman from ARN), building a growing
                    audience.
                    <br />
                    Discussions about potential collaborations with many others are in the works &mdash;
                    Liam Elkins from Siliconversations, Dan Faggella from Trajectory,
                    Micha&euml;l Trazzi from Inside View, Liv Boeree from Win-Win
                    and more.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              style={{ opacity: podCard2Opacity, y: podCard2Y }}
            >
              <div className="flex items-start gap-4">
                <SparklesIcon color={YT_RED} />
                <div>
                  <p className="text-base font-semibold text-text mb-1">
                    Events Horizon
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

            <motion.div
              className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              style={{ opacity: podCard3Opacity, y: podCard3Y }}
            >
              <div className="flex items-start gap-4">
                <SparklesIcon color="#f4a261" />
                <div>
                  <p className="text-base font-semibold text-text mb-1">
                    AI Takedowns
                  </p>
                  <p className="text-sm text-text-dim leading-relaxed m-0">
                    100+ targeted video rebuttals &mdash; short, expert-led responses
                    to every specific AI risk denial argument. Deployed as playlists
                    across all platforms, each one precision-matched to a skeptic&rsquo;s
                    sticking point. The most powerful conversion tool in our arsenal.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              style={{ opacity: podCard4Opacity, y: podCard4Y }}
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
