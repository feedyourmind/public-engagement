"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

/* ── Content categories ── */

const CONTENT_CATEGORIES = [
  {
    icon: "magazine",
    title: "The Magazine",
    description:
      "Curated AI safety content. Read it like the morning paper, not a Twitter doomscroll.",
    accent: "#f4a261",
  },
  {
    icon: "clips",
    title: "Luminary Clips",
    description:
      "Hinton. Bengio. Hendrycks. Russell. Organized video clips from the minds that matter most.",
    accent: "#e07a5f",
  },
  {
    icon: "memes",
    title: "Meme Archive",
    description:
      "The internet's best AI safety memes. Searchable. Shareable. Weaponized humor.",
    accent: "#52b788",
  },
  {
    icon: "microblog",
    title: "Microblog",
    description:
      "The best of X/Twitter, republished. No account needed. Links back to originals.",
    accent: "#67d4e8",
  },
  {
    icon: "letters",
    title: "Open Letters",
    description:
      "Every major open letter on AI risk. One place. Full archive.",
    accent: "#c084fc",
  },
  {
    icon: "search",
    title: "Searchable Archive",
    description:
      "Months of content, organized. Not just what\u2019s trending \u2014 everything that matters.",
    accent: "#f0b429",
  },
  {
    icon: "discover",
    title: "Discovery",
    description:
      "Find key voices you\u2019d never stumble on. Advocates, channels, academics, whistleblowers.",
    accent: "#e07a5f",
  },
  {
    icon: "action",
    title: "Action Paths",
    description:
      "Ready to act? We connect you to Humans First, CTRL AI, PauseAI, and the organizations making change.",
    accent: "#9b2226",
  },
  {
    icon: "community",
    title: "For Everyone",
    description:
      "Not on X? Don\u2019t want to be? The hub brings the best content to you, wherever you are.",
    accent: "#f4a261",
  },
];

/* ── Inline SVG icons ── */

function CategoryIcon({ name, color }: { name: string; color: string }) {
  const props = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "magazine":
      return (
        <svg {...props}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <line x1="8" y1="6" x2="16" y2="6" />
          <line x1="8" y1="10" x2="14" y2="10" />
        </svg>
      );
    case "clips":
      return (
        <svg {...props}>
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      );
    case "memes":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      );
    case "microblog":
      return (
        <svg {...props}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "letters":
      return (
        <svg {...props}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      );
    case "search":
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case "discover":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      );
    case "action":
      return (
        <svg {...props}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "community":
      return (
        <svg {...props}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    default:
      return null;
  }
}

/* ── Gap icon components ── */

function BookOpenIcon({ color }: { color: string }) {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function ShareIcon({ color }: { color: string }) {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx={18} cy={5} r={3} />
      <circle cx={6} cy={12} r={3} />
      <circle cx={18} cy={19} r={3} />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

/* ── Content card with staggered scroll reveal ── */

function ContentCard({
  category,
  index,
  scrollYProgress,
}: {
  category: (typeof CONTENT_CATEGORIES)[number];
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const cardStart = 0.50 + index * 0.012;
  const cardOpacity = useTransform(
    scrollYProgress,
    [cardStart, cardStart + 0.03],
    [0, 1],
    { clamp: true }
  );
  const cardY = useTransform(
    scrollYProgress,
    [cardStart, cardStart + 0.03],
    [30, 0],
    { clamp: true }
  );

  return (
    <motion.div
      className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
      style={{ opacity: cardOpacity, y: cardY }}
    >
      <div className="flex items-center gap-3 mb-2">
        <CategoryIcon name={category.icon} color={category.accent} />
        <h4 className="text-base font-semibold" style={{ color: category.accent }}>
          {category.title}
        </h4>
      </div>
      <p className="text-sm text-text-dim leading-relaxed m-0">
        {category.description}
      </p>
    </motion.div>
  );
}

/* ── Main section ── */

export default function Section07_TheHub() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  /* Section envelope */
  const sectionOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.03, 0.88, 0.94],
    [0, 1, 1, 0]
  );

  /* ── Phase A: Hero (holds longer) ── */
  const heroOpacity = useTransform(
    scrollYProgress,
    [0.02, 0.05, 0.28, 0.33],
    [0, 1, 1, 0]
  );
  const heroY = useTransform(scrollYProgress, [0.02, 0.05], [40, 0]);
  const imageOpacity = useTransform(
    scrollYProgress,
    [0.07, 0.12],
    [0, 1],
    { clamp: true }
  );
  const imageScale = useTransform(
    scrollYProgress,
    [0.07, 0.12],
    [0.92, 1],
    { clamp: true }
  );

  /* ── Phase A2: The Gap ── */
  const gapOpacity = useTransform(
    scrollYProgress,
    [0.28, 0.33, 0.46, 0.51],
    [0, 1, 1, 0]
  );
  const gapTitleY = useTransform(scrollYProgress, [0.28, 0.33], [30, 0]);
  const gap1Opacity = useTransform(
    scrollYProgress,
    [0.32, 0.36],
    [0, 1],
    { clamp: true }
  );
  const gap1Y = useTransform(scrollYProgress, [0.32, 0.36], [25, 0], {
    clamp: true,
  });
  const gap2Opacity = useTransform(
    scrollYProgress,
    [0.35, 0.39],
    [0, 1],
    { clamp: true }
  );
  const gap2Y = useTransform(scrollYProgress, [0.35, 0.39], [25, 0], {
    clamp: true,
  });

  /* ── Phase B: Grid ── */
  const gridOpacity = useTransform(
    scrollYProgress,
    [0.46, 0.52, 0.72, 0.78],
    [0, 1, 1, 0]
  );
  const gridTitleOpacity = useTransform(
    scrollYProgress,
    [0.46, 0.51],
    [0, 1],
    { clamp: true }
  );
  const gridTitleY = useTransform(scrollYProgress, [0.46, 0.51], [30, 0]);

  return (
    <section
      ref={sectionRef}
      id="the-hub"
      className="relative"
      style={{ height: "450vh" }}
    >
      <motion.div
        className="sticky top-12 h-[calc(100vh-3rem)] flex items-center justify-center overflow-hidden"
        style={{ opacity: sectionOpacity }}
      >
        {/* ── Phase A: Hero ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-start px-4 pt-4"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          {/* Hero banner image — cropped top, wider landscape feel */}
          <motion.div
            className="relative w-full max-w-5xl mb-4 overflow-hidden rounded-xl"
            style={{ opacity: imageOpacity, scale: imageScale }}
          >
            <div className="absolute -inset-6 rounded-2xl bg-gradient-to-b from-white/[0.08] to-transparent blur-2xl z-0" />
            <img
              src="/the-hub-screenshot.jpg"
              alt="The Hub — lethalintelligence.ai"
              className="relative w-full border border-white/[0.1] shadow-2xl brightness-[0.6] contrast-[1.03]"
              style={{ marginTop: "-5%" }}
            />
          </motion.div>

          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text text-center leading-tight tracking-tight mb-3">
            The Hub
          </h2>
          <p className="text-xl sm:text-2xl text-text-muted text-center max-w-2xl leading-relaxed mb-2">
            The one-stop destination for everything
            <br />
            <span className="font-semibold text-text">AI Risk Awareness</span> related.
          </p>
          <p className="text-base sm:text-lg text-text-dim text-center max-w-xl leading-relaxed">
            Curated content from across the entire internet &mdash; organized,
            searchable, and ready to consume or share.
          </p>
        </motion.div>

        {/* ── Phase A2: Filling the Gap ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16"
          style={{ opacity: gapOpacity }}
        >
          <motion.div className="text-center mb-8" style={{ y: gapTitleY }}>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-text mb-2">
              Filling a Massive Gap
            </h3>
            <p className="text-sm text-text-muted max-w-lg mx-auto">
              There are great academic resources, long-form blogs, and scattered
              social media posts &mdash; but nothing that ties it all together
              into one accessible experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl w-full">
            {/* Gap 1: Content consumption */}
            <motion.div
              className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              style={{ opacity: gap1Opacity, y: gap1Y }}
            >
              <div className="flex items-center gap-3 mb-4">
                <BookOpenIcon color="#f4a261" />
                <h4 className="text-base font-semibold" style={{ color: "#f4a261" }}>
                  No Place to Just&hellip; Read
                </h4>
              </div>
              <p className="text-sm text-text-dim leading-relaxed m-0 mb-3">
                Want to casually consume AI safety content the way you&rsquo;d
                read <span className="text-text-muted">The Economist</span> or your
                favorite magazine? Right now, that doesn&rsquo;t exist.
              </p>
              <p className="text-sm text-text-dim leading-relaxed m-0 mb-3">
                The best content is scattered across social media feeds, buried in
                long rationalist blogs, locked behind academic jargon, or{" "}
                <span className="text-text-muted italic">lost the moment you scroll
                past it</span>. Videos from luminaries? Search a dozen platforms.
                Today&rsquo;s best memes? Dig through Reddit noise. A great X post you
                saw last week? Gone in your feed forever.
              </p>
              <p className="text-sm text-text-muted leading-relaxed m-0 font-medium">
                There&rsquo;s no immersive, magazine-like experience for AI safety
                &mdash; just chaos. Until now.
              </p>
            </motion.div>

            {/* Gap 2: Shareable resources */}
            <motion.div
              className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              style={{ opacity: gap2Opacity, y: gap2Y }}
            >
              <div className="flex items-center gap-3 mb-4">
                <ShareIcon color="#67d4e8" />
                <h4 className="text-base font-semibold" style={{ color: "#67d4e8" }}>
                  No Place to Find &amp; Share
                </h4>
              </div>
              <p className="text-sm text-text-dim leading-relaxed m-0 mb-3">
                Already alarmed about AI risk and want to spread the word? Finding
                the perfect meme, the most powerful video clip, or the clearest
                explainer means maintaining your own scattered system of bookmarks
                across a hundred different sources.
              </p>
              <p className="text-sm text-text-dim leading-relaxed m-0 mb-3">
                There&rsquo;s no single place where an advocate can go to find the
                best curated resources &mdash; ready to share with one click. No
                arsenal of content organized by type, by topic, by impact.
              </p>
              <p className="text-sm text-text-muted leading-relaxed m-0 font-medium">
                The Hub is that arsenal. The best memes, videos, explainers, and
                posts from across the entire internet &mdash; curated, organized,
                and always at your fingertips.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Phase B: Content Grid ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16"
          style={{ opacity: gridOpacity }}
        >
          <motion.h3
            className="font-heading text-2xl sm:text-3xl font-bold text-text text-center mb-2"
            style={{ opacity: gridTitleOpacity, y: gridTitleY }}
          >
            One destination. Everything that matters.
          </motion.h3>
          <motion.p
            className="text-sm text-text-muted text-center max-w-lg mb-8"
            style={{ opacity: gridTitleOpacity }}
          >
            A magazine-like experience for AI safety &mdash; not the chaos of
            social media.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl w-full">
            {CONTENT_CATEGORIES.map((cat, i) => (
              <ContentCard
                key={cat.title}
                category={cat}
                index={i}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}
