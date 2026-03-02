"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ── Colors ── */
const HERO_GOLD = "#f0b429";
const NEON_RED = "#ff2d55";
const DYSTOPIA_BLUE = "#1a8cff";
const GLITCH_GREEN = "#39ff14";
const DARK_VIOLET = "#8b5cf6";

/* ── Data ── */

interface Experiment {
  name: string;
  tagline: string;
  description: React.ReactNode;
  safetyAngle: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
}

const EXPERIMENTS: Experiment[] = [
  {
    name: "No Plot Armor",
    tagline: "What if the heroes just\u2026 died?",
    description:
      "Popular culture scenes reimagined without plot armor. The Terminator dies in scene 1. The Smurfs get caught immediately. Iconic moments replayed with realistic outcomes \u2014 AI-generated, brutally honest, darkly hilarious.",
    safetyAngle:
      "There is no plot armor for AI safety. Get it wrong and there is no epic battle, no last-minute save \u2014 just dystopia or worse. The entertainment makes the message unforgettable.",
    accent: NEON_RED,
    accentBg: "rgba(255,45,85,0.08)",
    accentBorder: "rgba(255,45,85,0.22)",
  },
  {
    name: "2030",
    tagline: "Five years from now. A family. UBI. Robots.",
    description:
      <>A family living with Universal Basic Income in the near future &mdash; <span className="text-text font-semibold italic">Black Mirror</span> style. Robots like Tesla Optimus handle daily life. Everything looks fine on the surface. Nothing is fine underneath.</>,
    safetyAngle:
      "The normalization of AI-run society makes complacency the default. By the time people notice the loss of agency, it\u2019s already too late.",
    accent: DYSTOPIA_BLUE,
    accentBg: "rgba(26,140,255,0.08)",
    accentBorder: "rgba(26,140,255,0.22)",
  },
  {
    name: "Reality is Broken",
    tagline: "You just watched a lie. And you believed it.",
    description:
      "Popular viral videos \u2014 fails, memes, heartwarming moments \u2014 that towards the end reveal themselves as entirely AI-generated. You cannot trust what you see anymore. Subliminal AI safety messages woven throughout.",
    safetyAngle:
      "If you cannot distinguish reality from AI-generated content, how will society make informed decisions about AI governance? The medium IS the message.",
    accent: GLITCH_GREEN,
    accentBg: "rgba(57,255,20,0.06)",
    accentBorder: "rgba(57,255,20,0.18)",
  },
  {
    name: "Dystopian Intelligence",
    tagline: "Full movies of dark futures. Millions are watching.",
    description:
      "The dark version of the future, visualized with AI-generated video. Full movies depicting futures no one wants to live in. Some channels already doing this are pulling millions of views \u2014 there\u2019s still a huge gap to fill.",
    safetyAngle:
      "When millions consume vivid AI-rendered dystopias, the abstract threat becomes visceral. Entertainment creates the emotional foundation that rational arguments alone cannot.",
    accent: DARK_VIOLET,
    accentBg: "rgba(139,92,246,0.08)",
    accentBorder: "rgba(139,92,246,0.22)",
  },
];

/* ── SVG Icons ── */

function FlaskIcon({ color }: { color: string }) {
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
      <path d="M9 3h6" />
      <path d="M10 3v6.5l-5.5 9a1 1 0 0 0 .86 1.5h13.28a1 1 0 0 0 .86-1.5L14 9.5V3" />
      <path d="M8.5 14h7" />
    </svg>
  );
}

function ShieldOffIcon({ color }: { color: string }) {
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
      <path d="M12 2l7 4v6c0 5.25-3.5 8.25-7 10-3.5-1.75-7-4.75-7-10V6l7-4z" />
      <line x1="4" y1="4" x2="20" y2="20" />
    </svg>
  );
}

function CityIcon({ color }: { color: string }) {
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
      <rect x="1" y="11" width="6" height="11" />
      <rect x="9" y="6" width="6" height="16" />
      <rect x="17" y="2" width="6" height="20" />
      <line x1="1" y1="22" x2="23" y2="22" />
    </svg>
  );
}

function GlitchEyeIcon({ color }: { color: string }) {
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
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
      <line x1="3" y1="3" x2="8" y2="8" />
      <line x1="16" y1="16" x2="21" y2="21" />
    </svg>
  );
}

function DarkGlobeIcon({ color }: { color: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

const ICONS = [ShieldOffIcon, CityIcon, GlitchEyeIcon, DarkGlobeIcon];

/* ── Main Section ── */

export default function Section11_WildExperiments() {
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

  /* ── Phase A: Hero / Strategy ── */
  const heroOpacity = useTransform(
    scrollYProgress,
    [0.02, 0.06, 0.16, 0.20],
    [0, 1, 1, 0]
  );
  const heroTitleY = useTransform(scrollYProgress, [0.02, 0.06], [40, 0]);
  const heroBullet1Opacity = useTransform(scrollYProgress, [0.07, 0.10], [0, 1], { clamp: true });
  const heroBullet1Y = useTransform(scrollYProgress, [0.07, 0.10], [20, 0], { clamp: true });
  const heroBullet2Opacity = useTransform(scrollYProgress, [0.10, 0.13], [0, 1], { clamp: true });
  const heroBullet2Y = useTransform(scrollYProgress, [0.10, 0.13], [20, 0], { clamp: true });
  const heroBullet3Opacity = useTransform(scrollYProgress, [0.13, 0.16], [0, 1], { clamp: true });
  const heroBullet3Y = useTransform(scrollYProgress, [0.13, 0.16], [20, 0], { clamp: true });

  /* ── Phase B: No Plot Armor ── */
  const exp1Opacity = useTransform(scrollYProgress, [0.18, 0.22, 0.32, 0.36], [0, 1, 1, 0]);
  const exp1TitleY = useTransform(scrollYProgress, [0.18, 0.22], [40, 0]);
  const exp1DescOpacity = useTransform(scrollYProgress, [0.23, 0.26], [0, 1], { clamp: true });
  const exp1DescY = useTransform(scrollYProgress, [0.23, 0.26], [20, 0], { clamp: true });
  const exp1SafetyOpacity = useTransform(scrollYProgress, [0.26, 0.29], [0, 1], { clamp: true });
  const exp1SafetyY = useTransform(scrollYProgress, [0.26, 0.29], [20, 0], { clamp: true });

  /* ── Phase C: 2030 ── */
  const exp2Opacity = useTransform(scrollYProgress, [0.34, 0.38, 0.48, 0.52], [0, 1, 1, 0]);
  const exp2TitleY = useTransform(scrollYProgress, [0.34, 0.38], [40, 0]);
  const exp2DescOpacity = useTransform(scrollYProgress, [0.39, 0.42], [0, 1], { clamp: true });
  const exp2DescY = useTransform(scrollYProgress, [0.39, 0.42], [20, 0], { clamp: true });
  const exp2SafetyOpacity = useTransform(scrollYProgress, [0.42, 0.45], [0, 1], { clamp: true });
  const exp2SafetyY = useTransform(scrollYProgress, [0.42, 0.45], [20, 0], { clamp: true });

  /* ── Phase D: Reality is Broken ── */
  const exp3Opacity = useTransform(scrollYProgress, [0.50, 0.54, 0.64, 0.68], [0, 1, 1, 0]);
  const exp3TitleY = useTransform(scrollYProgress, [0.50, 0.54], [40, 0]);
  const exp3DescOpacity = useTransform(scrollYProgress, [0.55, 0.58], [0, 1], { clamp: true });
  const exp3DescY = useTransform(scrollYProgress, [0.55, 0.58], [20, 0], { clamp: true });
  const exp3SafetyOpacity = useTransform(scrollYProgress, [0.58, 0.61], [0, 1], { clamp: true });
  const exp3SafetyY = useTransform(scrollYProgress, [0.58, 0.61], [20, 0], { clamp: true });

  /* ── Phase E: Dystopian Intelligence ── */
  const exp4Opacity = useTransform(scrollYProgress, [0.66, 0.70, 0.80, 0.84], [0, 1, 1, 0]);
  const exp4TitleY = useTransform(scrollYProgress, [0.66, 0.70], [40, 0]);
  const exp4DescOpacity = useTransform(scrollYProgress, [0.71, 0.74], [0, 1], { clamp: true });
  const exp4DescY = useTransform(scrollYProgress, [0.71, 0.74], [20, 0], { clamp: true });
  const exp4SafetyOpacity = useTransform(scrollYProgress, [0.74, 0.77], [0, 1], { clamp: true });
  const exp4SafetyY = useTransform(scrollYProgress, [0.74, 0.77], [20, 0], { clamp: true });

  /* ── Phase F: Summary ── */
  const summaryOpacity = useTransform(scrollYProgress, [0.82, 0.86, 0.92, 0.96], [0, 1, 1, 0]);
  const summaryTitleY = useTransform(scrollYProgress, [0.82, 0.86], [40, 0]);

  /* Collect per-experiment animation values */
  const expAnimations = [
    { opacity: exp1Opacity, titleY: exp1TitleY, descOpacity: exp1DescOpacity, descY: exp1DescY, safetyOpacity: exp1SafetyOpacity, safetyY: exp1SafetyY },
    { opacity: exp2Opacity, titleY: exp2TitleY, descOpacity: exp2DescOpacity, descY: exp2DescY, safetyOpacity: exp2SafetyOpacity, safetyY: exp2SafetyY },
    { opacity: exp3Opacity, titleY: exp3TitleY, descOpacity: exp3DescOpacity, descY: exp3DescY, safetyOpacity: exp3SafetyOpacity, safetyY: exp3SafetyY },
    { opacity: exp4Opacity, titleY: exp4TitleY, descOpacity: exp4DescOpacity, descY: exp4DescY, safetyOpacity: exp4SafetyOpacity, safetyY: exp4SafetyY },
  ];

  return (
    <section
      ref={sectionRef}
      id="wild-experiments"
      className="relative"
      style={{ height: "600vh" }}
    >
      {/* Scroll position markers for hash navigation */}
      <div id="no-plot-armor" className="absolute" style={{ top: "18%" }} />
      <div id="exp-2030" className="absolute" style={{ top: "34%" }} />
      <div id="reality-is-broken" className="absolute" style={{ top: "50%" }} />
      <div id="dystopian-intelligence" className="absolute" style={{ top: "66%" }} />
      <div id="experiments-summary" className="absolute" style={{ top: "82%" }} />

      <motion.div
        className="sticky top-12 h-[calc(100vh-3rem)] flex items-center justify-center overflow-hidden"
        style={{ opacity: sectionOpacity }}
      >
        {/* ── Phase A: Hero / Strategy ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16"
          style={{ opacity: heroOpacity }}
        >
          <motion.div className="text-center mb-8" style={{ y: heroTitleY }}>
            <div className="flex items-center justify-center gap-4 mb-4">
              <FlaskIcon color={HERO_GOLD} />
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text">
                Wild Experiments
              </h2>
            </div>
            <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
              AI-generated content unlocks extremely viral potential &mdash; millions of views,
              millions of followers. But these experiments need several degrees of freedom
              to go as wild as they need.
            </p>
          </motion.div>

          <div className="flex flex-col gap-4 max-w-2xl w-full">
            <motion.div
              className="p-5 rounded-xl border text-center"
              style={{
                opacity: heroBullet1Opacity,
                y: heroBullet1Y,
                borderColor: "rgba(240,180,41,0.25)",
                background: "rgba(240,180,41,0.04)",
              }}
            >
              <p className="text-base sm:text-lg font-semibold text-text mb-1">
                Decoupled from Main Brands
              </p>
              <p className="text-sm text-text-dim leading-relaxed m-0">
                These experiments should not be common knowledge as linked to our main assets.
                They need freedom to be bold, provocative, and unapologetically viral.
              </p>
            </motion.div>

            <motion.div
              className="p-5 rounded-xl border text-center"
              style={{
                opacity: heroBullet2Opacity,
                y: heroBullet2Y,
                borderColor: "rgba(240,180,41,0.25)",
                background: "rgba(240,180,41,0.04)",
              }}
            >
              <p className="text-base sm:text-lg font-semibold text-text mb-1">
                Grow Experimental Platforms
              </p>
              <p className="text-sm text-text-dim leading-relaxed m-0">
                Build massive audiences through entertainment first. When the time is right,
                leverage those platforms to promote AI safety content to people who already trust you.
              </p>
            </motion.div>

            <motion.div
              className="p-5 rounded-xl border text-center"
              style={{
                opacity: heroBullet3Opacity,
                y: heroBullet3Y,
                borderColor: "rgba(240,180,41,0.25)",
                background: "rgba(240,180,41,0.04)",
              }}
            >
              <p className="text-base sm:text-lg font-semibold text-text mb-1">
                Infiltrate Through Entertainment
              </p>
              <p className="text-sm text-text-dim leading-relaxed m-0">
                It&rsquo;s much easier to reach new communities with viral fan content than by
                beating the doomer drum all day. No one wants to listen about sad or scary stuff &mdash;
                but everyone watches wild content.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Phases B–E: Experiment Cards ── */}
        {EXPERIMENTS.map((exp, i) => {
          const anim = expAnimations[i];
          const Icon = ICONS[i];
          return (
            <motion.div
              key={exp.name}
              className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16"
              style={{ opacity: anim.opacity }}
            >
              {/* Title + Tagline */}
              <motion.div className="text-center mb-6" style={{ y: anim.titleY }}>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Icon color={exp.accent} />
                  <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-text">
                    {exp.name}
                  </h3>
                </div>
                <p
                  className="text-base sm:text-lg italic max-w-xl mx-auto"
                  style={{ color: exp.accent }}
                >
                  {exp.tagline}
                </p>
              </motion.div>

              <div className="flex flex-col gap-4 max-w-3xl w-full">
                {/* Description */}
                <motion.div
                  className="p-5 rounded-xl"
                  style={{
                    opacity: anim.descOpacity,
                    y: anim.descY,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderLeft: `3px solid ${exp.accent}`,
                  }}
                >
                  <p className="text-sm sm:text-base text-text-muted leading-relaxed m-0">
                    {exp.description}
                  </p>
                </motion.div>

                {/* AI Safety Angle */}
                <motion.div
                  className="p-5 rounded-xl"
                  style={{
                    opacity: anim.safetyOpacity,
                    y: anim.safetyY,
                    background: exp.accentBg,
                    border: `1px solid ${exp.accentBorder}`,
                  }}
                >
                  <p
                    className="text-xs uppercase tracking-widest mb-2 font-semibold"
                    style={{ color: exp.accent }}
                  >
                    AI Safety Angle
                  </p>
                  <p className="text-sm sm:text-base text-text leading-relaxed font-medium m-0">
                    {exp.safetyAngle}
                  </p>
                </motion.div>

              </div>
            </motion.div>
          );
        })}

        {/* ── Phase F: Summary ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16"
          style={{ opacity: summaryOpacity }}
        >
          <motion.div className="text-center mb-8" style={{ y: summaryTitleY }}>
            <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-text mb-4">
              Grow First. Convert Later.
            </h3>
            <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
              Build platforms of millions through entertainment. When the time is right,
              introduce AI safety content to an audience that already trusts you.
            </p>
          </motion.div>

          {/* 2x2 experiment tile grid */}
          <div className="grid grid-cols-2 gap-3 max-w-md w-full">
            {EXPERIMENTS.map((exp) => (
              <div
                key={exp.name}
                className="p-4 rounded-lg text-center"
                style={{
                  background: exp.accentBg,
                  border: `1px solid ${exp.accentBorder}`,
                }}
              >
                <p
                  className="text-sm font-semibold m-0"
                  style={{ color: exp.accent }}
                >
                  {exp.name}
                </p>
              </div>
            ))}
          </div>

          {/* More ideas placeholder tiles */}
          <div className="grid grid-cols-2 gap-3 max-w-md w-full mt-3">
            {[
              { bg: "rgba(244,162,97,0.08)", border: "rgba(244,162,97,0.22)", color: "#f4a261" },
              { bg: "rgba(82,183,136,0.08)", border: "rgba(82,183,136,0.22)", color: "#52b788" },
              { bg: "rgba(103,212,232,0.08)", border: "rgba(103,212,232,0.22)", color: "#67d4e8" },
              { bg: "rgba(224,122,95,0.08)", border: "rgba(224,122,95,0.22)", color: "#e07a5f" },
            ].map((tile, i) => (
              <div
                key={i}
                className="p-4 rounded-lg text-center"
                style={{
                  background: tile.bg,
                  border: `1px solid ${tile.border}`,
                }}
              >
                <p
                  className="text-lg font-semibold m-0 tracking-widest"
                  style={{ color: tile.color }}
                >
                  &hellip;
                </p>
              </div>
            ))}
          </div>

          <p className="text-sm text-text-dim mt-4">
            Many more ideas in the works.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
