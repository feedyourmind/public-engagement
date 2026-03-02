"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ── Colors ── */
const ACCENT = "#67d4e8";
const GROWTH = "#52b788";
const X_COLOR = "#ffffff";
const YT_RED = "#ff4444";
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

/* ── Platform Icons (small, for grid pills) ── */

function YouTubeSmallIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="4" fill="#fff" />
      <polygon points="10,8.5 16,12 10,15.5" fill={YT_RED} />
    </svg>
  );
}

function TikTokSmallIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.87a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.3z" fill="#fff"/>
    </svg>
  );
}

function RedditSmallIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" fill="#fff"/>
      <circle cx="8.5" cy="14" r="1.5" fill="#FF4500"/>
      <circle cx="15.5" cy="14" r="1.5" fill="#FF4500"/>
      <path d="M9 17.5c.8.8 1.8 1 3 1s2.2-.2 3-1" stroke="#FF4500" strokeWidth={1.2} strokeLinecap="round" fill="none"/>
      <circle cx="12" cy="7" r="2.5" fill="#FF4500"/>
      <line x1="12" y1="4.5" x2="16" y2="2" stroke="#FF4500" strokeWidth={1.2} strokeLinecap="round"/>
      <circle cx="16.5" cy="2" r="1.2" fill="#FF4500"/>
    </svg>
  );
}

function SubstackSmallIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <path d="M4 5h16v2H4V5zm0 4h16v2H4V9zm0 4h16l-8 7-8-7z" fill="#FF6719"/>
    </svg>
  );
}

function FacebookSmallIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z" fill="#1877F2"/>
    </svg>
  );
}

function ThreadsSmallIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <path d="M15.3 11.36c-.07-.04-.15-.07-.22-.1a6.2 6.2 0 0 0-1.74-5.22A5.53 5.53 0 0 0 9.37 4.5c-2.4.1-4.08 1.56-4.68 4.08l1.94.48c.4-1.68 1.44-2.7 3-2.76a3.4 3.4 0 0 1 2.56.9 4.1 4.1 0 0 1 1.1 2.86 6.64 6.64 0 0 0-2.28-.36c-2.76.04-4.5 1.68-4.46 4.16.02 1.44.7 2.68 1.92 3.48.94.62 2.14.92 3.36.84 1.62-.1 2.86-.76 3.68-1.94.64-.92.98-2.1 1.06-3.58a4.16 4.16 0 0 1 1.68 3.24l1.9-.4a5.96 5.96 0 0 0-3.5-5.14zm-3.62 5.56c-1.28.08-2.62-.56-2.64-2.08-.02-1.32 1.02-2.16 2.7-2.2.72-.02 1.4.08 2.02.28-.08 2.84-1.1 3.92-2.08 4z" fill="#fff"/>
    </svg>
  );
}

function BlueskySmallIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <path d="M12 3C9.5 5 6.5 9.5 6 11.5c-.5 2 .5 3 2 2.5-2 1-2.5 2.5-1 4 1 1 3 1.5 5 0 2 1.5 4 1 5 0 1.5-1.5 1-3-1-4 1.5.5 2.5-.5 2-2.5-.5-2-3.5-6.5-6-8.5z" fill="#0085FF"/>
    </svg>
  );
}

function TelegramSmallIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="#26A5E4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SpotifySmallIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#1DB954"/>
      <path d="M8 15c3-1 6-1 9 1M7.5 12.5c4-1.5 7.5-1 10.5 1M7 10c4.5-1.5 9-1 12 1.5" stroke="#000" strokeWidth={1.5} strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function PodcastSmallIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <path d="M12 1C8.1 1 5 4.1 5 8c0 2.4 1.2 4.5 3 5.7V22h8v-8.3c1.8-1.2 3-3.3 3-5.7 0-3.9-3.1-7-7-7z" fill="#9B59B6"/>
      <circle cx="12" cy="8" r="2" fill="#fff"/>
      <path d="M11 14h2v6h-2z" fill="#fff"/>
    </svg>
  );
}

function PubSmallIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="#5865F2"/>
      <path d="M7 7h10M7 11h10M7 15h6" stroke="#fff" strokeWidth={1.5} strokeLinecap="round"/>
    </svg>
  );
}

/* ── Platform data ── */

type PlatformPill = {
  label: string;
  bg: string;
  icon: React.ReactNode;
  stat?: string;
};

const FEATURED_PLATFORMS: PlatformPill[] = [
  { label: "@lethal-intelligence", bg: YT_RED, icon: <YouTubeSmallIcon />, stat: "162K subscribers" },
  { label: "TikTok", bg: "#010101", icon: <TikTokSmallIcon />, stat: "1.1K followers" },
];

const OTHER_PLATFORMS: PlatformPill[] = [
  { label: "r/AIreplacedMe", bg: "#FF4500", icon: <RedditSmallIcon />, stat: "1.3K members" },
  { label: "AI-Ends pub", bg: "#5865F2", icon: <PubSmallIcon /> },
  { label: "Substack", bg: "#FF6719", icon: <SubstackSmallIcon /> },
  { label: "@lethal-intelligence-clips", bg: YT_RED, icon: <YouTubeSmallIcon /> },
  { label: "Facebook", bg: "#1877F2", icon: <FacebookSmallIcon /> },
  { label: "Threads", bg: "#333", icon: <ThreadsSmallIcon /> },
  { label: "Bluesky", bg: "#0085FF", icon: <BlueskySmallIcon /> },
  { label: "Telegram", bg: "#26A5E4", icon: <TelegramSmallIcon /> },
  { label: "Spotify", bg: "#1DB954", icon: <SpotifySmallIcon /> },
  { label: "Podcast", bg: "#9B59B6", icon: <PodcastSmallIcon /> },
];

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
  const allCard3Opacity = useTransform(scrollYProgress, [0.77, 0.80], [0, 1], { clamp: true });
  const allCard3Y = useTransform(scrollYProgress, [0.77, 0.80], [20, 0], { clamp: true });

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
                1 year
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
              5k followers*
            </p>
            <p className="text-base text-text-dim">
              Grown from{" "}
              <span className="font-semibold text-text">zero</span> in just{" "}
              <span className="font-semibold text-text">two months</span>
              {" "}&mdash; experimenting with roughly{" "}
              <span className="font-semibold text-text">85 reels</span>{" "}
              which performed well, cross-posted from our other platforms.
            </p>
            <p className="text-xs text-text-muted/60 mt-3">
              *(put on hold in January &mdash; focus switched to Reddit)
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
            className="text-center mb-6"
            style={{ y: allTitleY }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <GlobeIcon color={GROWTH} />
              <h3 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text">
                All Major Platforms
              </h3>
            </div>
            <p className="text-base sm:text-lg text-text-muted max-w-lg mx-auto leading-relaxed">
              Accounts established across every major platform &mdash;
              ready to be activated.
            </p>
          </motion.div>

          {/* Featured row: YouTube & TikTok */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 max-w-2xl w-full mb-5"
            style={{ opacity: allCard1Opacity, y: allCard1Y }}
          >
            {FEATURED_PLATFORMS.map((p) => (
              <div
                key={p.label}
                className="flex-1 flex items-center gap-4 px-5 py-4 rounded-xl border border-white/[0.08]"
                style={{ background: `${p.bg}22` }}
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: p.bg }}
                >
                  {p.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text leading-tight">{p.label}</p>
                  {p.stat && (
                    <p className="text-lg font-extrabold font-mono" style={{ color: p.bg === "#010101" ? "#fff" : p.bg }}>
                      {p.stat}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Other platforms grid */}
          <motion.div
            className="flex flex-wrap justify-center gap-2.5 max-w-2xl mb-5"
            style={{ opacity: allCard2Opacity, y: allCard2Y }}
          >
            {OTHER_PLATFORMS.map((p) => (
              <div
                key={p.label}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-white"
                style={{ background: p.bg }}
              >
                {p.icon}
                <span>{p.label}</span>
                {p.stat && (
                  <span className="text-xs opacity-80 ml-0.5">{p.stat}</span>
                )}
              </div>
            ))}
          </motion.div>

          {/* Vision statement + on-hold footnote */}
          <motion.div
            className="max-w-2xl w-full p-6 rounded-xl border border-white/[0.08] bg-white/[0.02] text-center"
            style={{ opacity: allCard3Opacity, y: allCard3Y }}
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
            <p className="text-xs text-text-muted/60 mt-4">
              *Broadcasting to all these platforms is currently on hold until we get more resources
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
