"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { SEGMENTS } from "@/utils/segments";

/* ── Funnel data (same as Section04a_Strategies) ── */

const FUNNEL_BANDS = [
  {
    color: SEGMENTS[0].color,
    items: ["Memes", "Viral clips", "AI-generated funny videos", "Shock & humor content"],
  },
  {
    color: SEGMENTS[1].color,
    items: ["AI capability demos", "Robot acrobatics", "Disturbing AI videos", "Dystopian AI content"],
  },
  {
    color: SEGMENTS[2].color,
    items: ["Animated explainers", "Tech-oligarch criticism", "Environmental impact", "AI safety interviews"],
  },
  {
    color: SEGMENTS[3].color,
    items: ["Podcasts", "Documentary clips", "CEO / luminary interviews", "Online courses"],
  },
  {
    color: SEGMENTS[4].color,
    items: ["Academic papers", "Research evidence", "Debates & rational arguments", "Misalignment data"],
  },
  {
    color: SEGMENTS[5].color,
    items: ["Discord servers", "Community meetings", "Direct action groups", "Volunteering networks"],
  },
];

/* ── Narrative stages (5 for funnel, "The Key" moves to final phase) ── */

const NARRATIVE_STAGES = [
  {
    title: "Infiltration",
    text: "We infiltrate communities that have nothing to do with AI risk. Pizza lovers, gaming communities, meme pages \u2014 it doesn\u2019t matter. We seed AI memes and content that sparks curiosity. A laugh, a shock, a \u201Cwait, really?\u201D moment. Into the funnel they go.",
  },
  {
    title: "Immersion",
    text: "Once they land in The Hub, they get immersed. They subscribe to our socials and the newsletter. Our memes keep hitting their feed. They keep coming back to The Hub \u2014 and they keep getting more and more of its content.",
  },
  {
    title: "Evidence",
    text: "They explore deeper. They see more and more evidence of things they start feeling might be a real problem. Perspectives they haven\u2019t thought about before. Each visit plants another seed. Deeper in the conversion they go.",
  },
  {
    title: "Conversion",
    text: "The more time they spend in The Hub, the more they move on the X-Risk index. This is where casual curiosity quietly transforms into genuine understanding \u2014 not because an expert told them to worry, but because it makes sense to them.",
  },
  {
    title: "Activation",
    text: "They join the AI Risk Awareness Force \u2014 spreading memes and social content to their own circle of influence. They join Humans First to put their energy into action. Once they exit the funnel, they become the funnel for others.",
  },
];

const THE_KEY_TEXT =
  "Without The Hub, they\u2019d see one video or meme and forget about it the next moment. But with deep, self-driven immersion \u2014 arriving at conclusions on their own because it makes sense, not because someone told them \u2014 their motivation becomes unstoppable. There is nothing stopping them.";

/* ── SVG dimensions ── */

const SVG_W = 750;
const SVG_H = 620;
const FUNNEL_TOP_W = 300;
const FUNNEL_BOT_W = 50;
const FUNNEL_CX = 170;
const FUNNEL_TOP_Y = 50;
const FUNNEL_BOT_Y = 570;
const FUNNEL_H = FUNNEL_BOT_Y - FUNNEL_TOP_Y;
const BAND_H = FUNNEL_H / FUNNEL_BANDS.length;

function funnelWidthAtY(y: number) {
  const t = (y - FUNNEL_TOP_Y) / FUNNEL_H;
  return FUNNEL_TOP_W - (FUNNEL_TOP_W - FUNNEL_BOT_W) * t;
}

/* ── Scroll progress ranges ── */

// Keywords highlight when the person is in that band
const BAND_RANGES = [
  [0.10, 0.20],
  [0.20, 0.30],
  [0.30, 0.42],
  [0.42, 0.54],
  [0.54, 0.64],
  [0.64, 0.72],
];

// 5 narrative stages — no overlap (±0.02 fade, 0.04 gap between)
const NARRATIVE_RANGES = [
  [0.10, 0.19],
  [0.23, 0.32],
  [0.36, 0.45],
  [0.49, 0.58],
  [0.62, 0.68],
];

/* ── Keyword group sub-component ── */

function KeywordGroup({
  band,
  bandIndex,
  scrollYProgress,
}: {
  band: (typeof FUNNEL_BANDS)[number];
  bandIndex: number;
  scrollYProgress: MotionValue<number>;
}) {
  const [rangeStart, rangeEnd] = BAND_RANGES[bandIndex];
  const opacity = useTransform(
    scrollYProgress,
    [rangeStart - 0.03, rangeStart, rangeEnd, rangeEnd + 0.03],
    [0.2, 1, 1, 0.2]
  );

  const bandY = FUNNEL_TOP_Y + bandIndex * BAND_H;
  const bandMidY = bandY + BAND_H / 2;
  const kw_x = FUNNEL_CX + FUNNEL_TOP_W / 2 + 30;
  const lineH = 16;
  const groupStartY = bandMidY - ((band.items.length - 1) * lineH) / 2;

  return (
    <motion.g style={{ opacity }}>
      {band.items.map((item, j) => (
        <text
          key={j}
          x={kw_x}
          y={groupStartY + j * lineH}
          fill={band.color}
          fontSize={11}
          fontFamily="var(--font-dm-sans)"
          textAnchor="start"
          dominantBaseline="middle"
        >
          {item}
        </text>
      ))}
      <line
        x1={FUNNEL_CX + funnelWidthAtY(bandMidY) / 2}
        y1={bandMidY}
        x2={kw_x - 8}
        y2={bandMidY}
        stroke={band.color}
        strokeWidth={1}
        strokeDasharray="3 3"
        opacity={0.4}
      />
    </motion.g>
  );
}

/* ── Narrative stage sub-component ── */

function NarrativeStage({
  stage,
  stageIndex,
  scrollYProgress,
}: {
  stage: (typeof NARRATIVE_STAGES)[number];
  stageIndex: number;
  scrollYProgress: MotionValue<number>;
}) {
  const [fadeIn, fadeOut] = NARRATIVE_RANGES[stageIndex];
  const opacity = useTransform(
    scrollYProgress,
    [fadeIn - 0.02, fadeIn, fadeOut, fadeOut + 0.02],
    [0, 1, 1, 0]
  );
  const y = useTransform(scrollYProgress, [fadeIn - 0.02, fadeIn], [25, 0]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center px-2 sm:px-6"
      style={{ opacity, y }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: FUNNEL_BANDS[Math.min(stageIndex, FUNNEL_BANDS.length - 1)].color }}
      >
        {stage.title}
      </p>
      <p className="text-sm sm:text-base text-text-muted leading-relaxed">
        {stage.text}
      </p>
    </motion.div>
  );
}

/* ── Falling person — thick pictogram with cross-fading poses ── */

const FIG_COLOR = "#f0ece2";
const HEAD_R = 8;
const BODY_W = 7;
const LIMB_W = 5.5;

interface Pose {
  head: [number, number];
  shoulder: [number, number];
  hip: [number, number];
  lHand: [number, number];
  rHand: [number, number];
  lFoot: [number, number];
  rFoot: [number, number];
}

const FALLING_POSES: Pose[] = [
  // Pose 0 — Leaning back, right arm reaching up
  {
    head: [-4, -22], shoulder: [0, -12], hip: [5, 8],
    lHand: [-20, -2], rHand: [12, -26],
    lFoot: [-6, 26], rFoot: [18, 20],
  },
  // Pose 1 — Spread eagle, classic freefall
  {
    head: [2, -20], shoulder: [0, -10], hip: [-2, 10],
    lHand: [-24, -6], rHand: [24, -2],
    lFoot: [-16, 26], rFoot: [18, 24],
  },
  // Pose 2 — Tumbling sideways, asymmetric
  {
    head: [8, -18], shoulder: [4, -8], hip: [-4, 10],
    lHand: [-18, -16], rHand: [22, 4],
    lFoot: [-18, 20], rFoot: [4, 28],
  },
  // Pose 3 — Diving forward, arms back
  {
    head: [-6, -20], shoulder: [-2, -10], hip: [4, 10],
    lHand: [-18, 6], rHand: [14, -20],
    lFoot: [18, 18], rFoot: [-2, 28],
  },
  // Pose 4 — Star/X pose, fully spread
  {
    head: [0, -22], shoulder: [0, -12], hip: [0, 6],
    lHand: [-24, -18], rHand: [24, -14],
    lFoot: [-18, 24], rFoot: [20, 22],
  },
  // Pose 5 — Curling inward, arms near head (exiting)
  {
    head: [2, -18], shoulder: [0, -8], hip: [-2, 12],
    lHand: [-10, -22], rHand: [14, -20],
    lFoot: [-8, 28], rFoot: [10, 26],
  },
];

// Compressed pose ranges for funnel phase (0.08-0.72)
const POSE_RANGES: [number, number][] = [
  [0.08, 0.20],
  [0.19, 0.32],
  [0.31, 0.44],
  [0.43, 0.56],
  [0.55, 0.66],
  [0.65, 0.74],
];

function StaticPose({ pose }: { pose: Pose }) {
  return (
    <>
      <circle cx={pose.head[0]} cy={pose.head[1]} r={HEAD_R} fill={FIG_COLOR} />
      <line
        x1={pose.shoulder[0]} y1={pose.shoulder[1]}
        x2={pose.hip[0]} y2={pose.hip[1]}
        stroke={FIG_COLOR} strokeWidth={BODY_W} strokeLinecap="round"
      />
      <line
        x1={pose.shoulder[0]} y1={pose.shoulder[1]}
        x2={pose.lHand[0]} y2={pose.lHand[1]}
        stroke={FIG_COLOR} strokeWidth={LIMB_W} strokeLinecap="round"
      />
      <line
        x1={pose.shoulder[0]} y1={pose.shoulder[1]}
        x2={pose.rHand[0]} y2={pose.rHand[1]}
        stroke={FIG_COLOR} strokeWidth={LIMB_W} strokeLinecap="round"
      />
      <line
        x1={pose.hip[0]} y1={pose.hip[1]}
        x2={pose.lFoot[0]} y2={pose.lFoot[1]}
        stroke={FIG_COLOR} strokeWidth={LIMB_W} strokeLinecap="round"
      />
      <line
        x1={pose.hip[0]} y1={pose.hip[1]}
        x2={pose.rFoot[0]} y2={pose.rFoot[1]}
        stroke={FIG_COLOR} strokeWidth={LIMB_W} strokeLinecap="round"
      />
    </>
  );
}

function FallingPoseLayer({
  pose,
  poseIndex,
  scrollYProgress,
}: {
  pose: Pose;
  poseIndex: number;
  scrollYProgress: MotionValue<number>;
}) {
  const [start, end] = POSE_RANGES[poseIndex];
  const isFirst = poseIndex === 0;
  const isLast = poseIndex === FALLING_POSES.length - 1;
  const fade = 0.012;

  const opacity = useTransform(
    scrollYProgress,
    isFirst
      ? [0, start, end - fade, end]
      : isLast
        ? [start, start + fade, end - fade, end]
        : [start, start + fade, end - fade, end],
    isFirst
      ? [1, 1, 1, 0]
      : [0, 1, 1, 0]
  );

  return (
    <motion.g style={{ opacity }}>
      <StaticPose pose={pose} />
    </motion.g>
  );
}

function FallingPerson({
  personY,
  scrollYProgress,
}: {
  personY: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
}) {
  return (
    <motion.g style={{ y: personY }}>
      <g transform={`translate(${FUNNEL_CX}, 0)`}>
        {FALLING_POSES.map((pose, i) => (
          <FallingPoseLayer
            key={i}
            pose={pose}
            poseIndex={i}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </g>
    </motion.g>
  );
}

/* ── Final phase: standing figure with golden glow ── */

// Standing pose — upright, arms raised holding the light
const STANDING_POSE: Pose = {
  head: [0, -26],
  shoulder: [0, -16],
  hip: [0, 6],
  lHand: [-14, -22],
  rHand: [14, -22],
  lFoot: [-8, 28],
  rFoot: [8, 28],
};

function FinalPhase({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const phaseOpacity = useTransform(
    scrollYProgress,
    [0.72, 0.77, 0.92, 0.96],
    [0, 1, 1, 0]
  );
  const phaseY = useTransform(scrollYProgress, [0.72, 0.77], [40, 0]);

  // Golden glow — intensifies over time
  const glowOpacity = useTransform(
    scrollYProgress,
    [0.77, 0.82, 0.88, 0.92],
    [0.15, 0.5, 0.85, 1.0]
  );
  const glowScale = useTransform(
    scrollYProgress,
    [0.77, 0.88, 0.92],
    [0.6, 1.2, 1.6]
  );

  // "The Key" text fades in after the badge
  const keyOpacity = useTransform(
    scrollYProgress,
    [0.80, 0.84, 0.92, 0.96],
    [0, 1, 1, 0]
  );
  const keyY = useTransform(scrollYProgress, [0.80, 0.84], [20, 0]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8"
      style={{ opacity: phaseOpacity, y: phaseY }}
    >
      {/* Badge: figure + glow + title */}
      <div className="flex items-center gap-6 sm:gap-8 mb-10">
        {/* Figure with glow */}
        <div className="relative shrink-0" style={{ width: 72, height: 90 }}>
          {/* Outer golden bloom */}
          <motion.div
            className="absolute rounded-full"
            style={{
              top: -20,
              left: -14,
              width: 100,
              height: 100,
              opacity: glowOpacity,
              scale: glowScale,
              background:
                "radial-gradient(circle, rgba(255,250,210,0.9) 0%, rgba(255,245,180,0.5) 30%, transparent 70%)",
              filter: "blur(12px)",
            }}
          />
          {/* Mid glow ring */}
          <motion.div
            className="absolute rounded-full"
            style={{
              top: -10,
              left: -2,
              width: 76,
              height: 76,
              opacity: glowOpacity,
              background:
                "radial-gradient(circle, rgba(244,162,97,0.6) 0%, rgba(244,162,97,0.15) 50%, transparent 80%)",
              filter: "blur(6px)",
            }}
          />
          {/* Golden circle the figure "holds" */}
          <motion.div
            className="absolute rounded-full border-2"
            style={{
              top: 2,
              left: 14,
              width: 44,
              height: 44,
              opacity: glowOpacity,
              borderColor: "rgba(244,162,97,0.8)",
              background:
                "radial-gradient(circle, rgba(255,250,210,0.7) 0%, rgba(244,162,97,0.3) 60%, transparent 100%)",
              boxShadow:
                "0 0 16px 6px rgba(255,250,210,0.4), inset 0 0 10px 3px rgba(255,245,180,0.25)",
            }}
          />
          {/* The standing figure */}
          <svg
            viewBox="-30 -34 60 70"
            width={72}
            height={90}
            className="relative z-10"
          >
            <StaticPose pose={STANDING_POSE} />
          </svg>
        </div>

        {/* Title text */}
        <div>
          <p
            className="text-lg sm:text-xl lg:text-2xl font-heading font-bold leading-tight"
            style={{ color: "#f0ece2" }}
          >
            AI Risk Awareness Force
          </p>
          <p
            className="text-sm sm:text-base font-semibold mt-1"
            style={{ color: "#f4a261" }}
          >
            New Member
          </p>
        </div>
      </div>

      {/* The Key text */}
      <motion.div
        className="max-w-lg text-center"
        style={{ opacity: keyOpacity, y: keyY }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: "#f4a261" }}
        >
          The Key
        </p>
        <p className="text-sm sm:text-base text-text-muted leading-relaxed">
          {THE_KEY_TEXT}
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ── Main section ── */

export default function Section07b_ConversionJourney() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  /* Section envelope */
  const sectionOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.04, 0.94, 0.98],
    [0, 1, 1, 0]
  );

  /* Title */
  const titleOpacity = useTransform(
    scrollYProgress,
    [0.04, 0.09, 0.92, 0.96],
    [0, 1, 1, 0]
  );
  const titleY = useTransform(scrollYProgress, [0.04, 0.09], [30, 0]);

  /* Funnel + keywords fade in/out (gone before final phase) */
  const funnelOpacity = useTransform(
    scrollYProgress,
    [0.06, 0.10, 0.70, 0.76],
    [0, 1, 1, 0]
  );

  /* Person vertical position: from above funnel to below */
  const personY = useTransform(
    scrollYProgress,
    [0.08, 0.72],
    [FUNNEL_TOP_Y - 50, FUNNEL_BOT_Y + 40]
  );

  return (
    <section
      ref={sectionRef}
      id="conversion-journey"
      className="relative"
      style={{ height: "900vh" }}
    >
      <motion.div
        className="sticky top-12 h-[calc(100vh-3rem)] flex flex-col items-center justify-start overflow-hidden bg-bg"
        style={{ opacity: sectionOpacity }}
      >
        {/* Title */}
        <motion.div
          className="w-full text-center pt-4 pb-2 shrink-0 z-10"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-text mb-1">
            The Conversion Journey
          </h2>
          <p className="text-sm text-text-muted max-w-lg mx-auto">
            How casual curiosity becomes unstoppable conviction.
          </p>
        </motion.div>

        {/* Funnel phase: funnel (left) + narrative (right) */}
        <motion.div
          className="flex flex-col lg:flex-row items-stretch flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 gap-2 lg:gap-4 min-h-0"
          style={{ opacity: funnelOpacity }}
        >
          {/* Left: SVG funnel + person + keywords */}
          <div className="w-full lg:w-[60%] flex items-center justify-center min-h-0">
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              className="w-full h-full max-h-[calc(100vh-10rem)]"
              preserveAspectRatio="xMidYMid meet"
              aria-label="Conversion funnel with animated falling person"
            >
              {/* Funnel bands */}
              {FUNNEL_BANDS.map((band, i) => {
                const y0 = FUNNEL_TOP_Y + i * BAND_H;
                const y1 = FUNNEL_TOP_Y + (i + 1) * BAND_H;
                const w0 = funnelWidthAtY(y0);
                const w1 = funnelWidthAtY(y1);
                const xl0 = FUNNEL_CX - w0 / 2;
                const xr0 = FUNNEL_CX + w0 / 2;
                const xl1 = FUNNEL_CX - w1 / 2;
                const xr1 = FUNNEL_CX + w1 / 2;

                return (
                  <g key={i}>
                    <path
                      d={`M${xl0},${y0} L${xr0},${y0} L${xr1},${y1} L${xl1},${y1} Z`}
                      fill={band.color}
                      opacity={0.45}
                    />
                    {i < FUNNEL_BANDS.length - 1 && (
                      <line
                        x1={xl1} y1={y1} x2={xr1} y2={y1}
                        stroke="rgba(255,255,255,0.2)" strokeWidth={1}
                      />
                    )}
                  </g>
                );
              })}

              {/* Side labels */}
              <text
                x={FUNNEL_CX - FUNNEL_TOP_W / 2} y={FUNNEL_TOP_Y - 10}
                fill="#666" fontSize={10} fontFamily="var(--font-dm-sans)" textAnchor="start"
              >
                Easy to share
              </text>
              <text
                x={FUNNEL_CX} y={FUNNEL_BOT_Y + 20}
                fill="#666" fontSize={10} fontFamily="var(--font-dm-sans)" textAnchor="middle"
              >
                Deep commitment
              </text>

              {/* Keyword groups */}
              {FUNNEL_BANDS.map((band, i) => (
                <KeywordGroup
                  key={i}
                  band={band}
                  bandIndex={i}
                  scrollYProgress={scrollYProgress}
                />
              ))}

              {/* Falling person */}
              <FallingPerson
                personY={personY}
                scrollYProgress={scrollYProgress}
              />
            </svg>
          </div>

          {/* Right: Narrative text */}
          <div className="w-full lg:w-[40%] relative min-h-50 lg:min-h-0">
            {NARRATIVE_STAGES.map((stage, i) => (
              <NarrativeStage
                key={i}
                stage={stage}
                stageIndex={i}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </motion.div>

        {/* Final phase: figure with golden glow + "The Key" */}
        <FinalPhase scrollYProgress={scrollYProgress} />
      </motion.div>
    </section>
  );
}
