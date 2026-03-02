"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

/* ── Constants ── */

const POLITICIAN_COUNT = 30;
const BREAKAWAY_POL = 2;
const STATIC_POL = POLITICIAN_COUNT - BREAKAWAY_POL;

const PUBLIC_COUNT = 280;
const PUBLIC_COLS = 28;
const BREAKAWAY_PUB = 10;
const STATIC_PUB = PUBLIC_COUNT - BREAKAWAY_PUB;

const POLITICIAN_COLOR = "#f4a261";
const PUBLIC_COLOR = "#888";
const XRISK_COLOR = "#e07a5f";

// Topic labels — staggered on two rows to avoid overlap
const TOPIC_LABELS = [
  { text: "Immigration", x: 240, y: 48 },
  { text: "Culture Wars", x: 350, y: 48 },
  { text: "Gender Rights", x: 290, y: 62 },
  { text: "Economy", x: 400, y: 62 },
];

// SVG layout
const VW = 800;
const GROUP_CENTER_X = 310;
const RIGHT_X = 640;
const POLITICIAN_Y = 100;
const PUBLIC_START_Y = 250;
const POL_SPACING_X = 28;
const POL_SPACING_Y = 30;
const POL_COLS = 10;
const PUB_SPACING_X = 17;
const PUB_SPACING_Y = 17;
const POL_SIZE = 22;
const PUB_SIZE = 10;

/* ── SVG person icon ── */

function PersonIcon({
  x,
  y,
  size,
  color,
}: {
  x: number;
  y: number;
  size: number;
  color: string;
}) {
  const headR = size * 0.22;
  const bodyW = size * 0.45;
  const bodyH = size * 0.5;
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx={0} cy={-size * 0.28} r={headR} fill={color} />
      <path
        d={`M${-bodyW / 2},${-size * 0.02} Q0,${bodyH * 0.15} ${bodyW / 2},${-size * 0.02} L${bodyW * 0.4},${bodyH} L${-bodyW * 0.4},${bodyH} Z`}
        fill={color}
      />
    </g>
  );
}

/* ── Position helpers ── */

function gridPositions(
  count: number,
  cols: number,
  centerX: number,
  startY: number,
  spacingX: number,
  spacingY: number,
) {
  const actualCols = Math.min(cols, count);
  const gridW = (actualCols - 1) * spacingX;
  const offsetX = centerX - gridW / 2;
  return Array.from({ length: count }, (_, i) => ({
    x: offsetX + (i % cols) * spacingX,
    y: startY + Math.floor(i / cols) * spacingY,
  }));
}

function rowPositions(count: number, centerX: number, y: number, spacing: number) {
  const startX = centerX - ((count - 1) * spacing) / 2;
  return Array.from({ length: count }, (_, i) => ({
    x: startX + i * spacing,
    y,
  }));
}

/* ── Hook: add two MotionValues ── */

function useMotionAdd(a: MotionValue<number>, b: MotionValue<number>) {
  return useTransform([a, b], ([va, vb]: number[]) => va + vb);
}

/* ── Animated figure ── */

function MovingFigure({
  startPos,
  targetPos,
  progress,
  retreatTarget,
  retreatProgress,
  size,
  color,
}: {
  startPos: { x: number; y: number };
  targetPos: { x: number; y: number };
  progress: MotionValue<number>;
  retreatTarget?: { x: number; y: number };
  retreatProgress?: MotionValue<number>;
  size: number;
  color: string;
}) {
  const oMoveX = useTransform(progress, [0, 1], [0, targetPos.x - startPos.x]);
  const oMoveY = useTransform(progress, [0, 1], [0, targetPos.y - startPos.y]);

  const oRetreatX = useTransform(
    retreatProgress ?? progress,
    [0, 1],
    [0, retreatTarget ? retreatTarget.x - targetPos.x : 0],
  );
  const oRetreatY = useTransform(
    retreatProgress ?? progress,
    [0, 1],
    [0, retreatTarget ? retreatTarget.y - targetPos.y : 0],
  );

  const totalX = useMotionAdd(oMoveX, oRetreatX);
  const totalY = useMotionAdd(oMoveY, oRetreatY);

  return (
    <motion.g style={{ x: totalX, y: totalY }}>
      <PersonIcon x={startPos.x} y={startPos.y} size={size} color={color} />
    </motion.g>
  );
}

/* ── Pre-compute positions ── */

// Politicians in a grid (2 rows of 10) — rightmost 2 of row 1 are breakaway
const allPolPositions = gridPositions(POLITICIAN_COUNT, POL_COLS, GROUP_CENTER_X, POLITICIAN_Y, POL_SPACING_X, POL_SPACING_Y);
const staticPolPositions = allPolPositions.slice(0, STATIC_POL);
const breakawayPolStart = allPolPositions.slice(STATIC_POL);

// Breakaway politicians target: right side
const breakawayPolTarget = rowPositions(BREAKAWAY_POL, RIGHT_X, POLITICIAN_Y + 10, POL_SPACING_X);

// Public in a grid
const allPubPositions = gridPositions(PUBLIC_COUNT, PUBLIC_COLS, GROUP_CENTER_X, PUBLIC_START_Y, PUB_SPACING_X, PUB_SPACING_Y);
const staticPubPositions = allPubPositions.slice(0, STATIC_PUB);
const breakawayPubStart = allPubPositions.slice(STATIC_PUB);

// Breakaway public target: right side, below breakaway politicians
const breakawayPubTarget = gridPositions(BREAKAWAY_PUB, 5, RIGHT_X, PUBLIC_START_Y, PUB_SPACING_X, PUB_SPACING_Y);

/* ── Main component ── */

export default function Section03e_Grassroots() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  /* ── Section opacity ── */
  const sectionOpacity = useTransform(scrollYProgress, [0.0, 0.04, 0.93, 0.98], [0, 1, 1, 0]);

  /* ── Text phase (waits for sticky to engage ~0.18, then holds) ── */
  const textOpacity = useTransform(scrollYProgress, [0.15, 0.19, 0.30, 0.35], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0.15, 0.19], [30, 0]);

  /* ── Animation area ── */
  const animOpacity = useTransform(scrollYProgress, [0.34, 0.38, 0.78, 0.83], [0, 1, 1, 0]);

  /* ── Topic labels above static group ── */
  const labelsOpacity = useTransform(scrollYProgress, [0.38, 0.42, 0.78, 0.83], [0, 1, 1, 0]);

  /* ── Sequence: X-Risk label first → public moves → politicians move ── */

  // 1. AI X-Risk label appears first
  const xriskLabelOpacity = useTransform(scrollYProgress, [0.40, 0.44, 0.78, 0.83], [0, 1, 1, 0]);

  // 2. Public breakaway moves right (first)
  const publicBreakawayProgress = useTransform(scrollYProgress, [0.44, 0.50], [0, 1], { clamp: true });

  // 3. Politicians breakaway moves right (starts after public finishes)
  const polBreakawayProgress = useTransform(scrollYProgress, [0.52, 0.58], [0, 1], { clamp: true });

  /* ── "Next Election Cycle" text drops in ── */
  const electionOpacity = useTransform(scrollYProgress, [0.57, 0.61, 0.70, 0.74], [0, 1, 1, 0]);
  const electionY = useTransform(scrollYProgress, [0.57, 0.61], [-30, 0], { clamp: true });

  /* ── X mark appears over breakaway politicians ── */
  const xMarkOpacity = useTransform(scrollYProgress, [0.62, 0.65, 0.70, 0.74], [0, 1, 1, 0]);

  /* ── Politicians retreat back to group ── */
  const retreatProgress = useTransform(scrollYProgress, [0.66, 0.71], [0, 1], { clamp: true });

  /* ── Breakaway politicians fade out as they retreat ── */
  const breakawayPolOpacity = useTransform(scrollYProgress, [0.66, 0.71], [1, 0], { clamp: true });

  /* ── X-Risk label falls after politicians leave ── */
  const xriskFallY = useTransform(scrollYProgress, [0.71, 0.76], [0, 80], { clamp: true });
  const xriskRotate = useTransform(scrollYProgress, [0.71, 0.76], [0, 18], { clamp: true });

  /* ── Closing text ── */
  const closingOpacity = useTransform(scrollYProgress, [0.80, 0.84, 0.89, 0.93], [0, 1, 1, 0]);
  const closingY = useTransform(scrollYProgress, [0.80, 0.84], [30, 0]);

  return (
    <section
      ref={sectionRef}
      id="grassroots"
      className="relative"
      style={{ height: "250vh" }}
    >
      <motion.div
        className="sticky top-12 h-[calc(100vh-3rem)] flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16"
        style={{ opacity: sectionOpacity }}
      >
        {/* ── Part 1: Text reveals ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-start pt-[18vh] px-4"
          style={{ opacity: textOpacity, y: textY }}
        >
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text mb-6 text-center">
            Why Does Grassroots Change Matter?
          </h2>
          <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-2xl text-center">
            Politicians lead from behind. They don&apos;t shape public opinion —
            they follow it. Without massive demand from the general public,
            the decision-makers we need simply won&apos;t exist.
          </p>
        </motion.div>

        {/* ── Part 2: Politician/Public animation ── */}
        <motion.div
          className="w-full max-w-4xl"
          style={{ opacity: animOpacity }}
        >
          <svg
            viewBox={`0 0 ${VW} 440`}
            className="w-full h-auto"
            style={{ maxHeight: "calc(100vh - 10rem)" }}
          >
            {/* ── Topic labels — staggered on two rows ── */}
            <motion.g style={{ opacity: labelsOpacity }}>
              {TOPIC_LABELS.map((label) => (
                <text
                  key={label.text}
                  x={label.x}
                  y={label.y}
                  fill="#666"
                  fontSize={10}
                  fontFamily="var(--font-dm-sans)"
                  textAnchor="middle"
                  letterSpacing="0.04em"
                >
                  {label.text}
                </text>
              ))}
            </motion.g>

            {/* ── AI X-Risk label (right side) — appears first, falls when abandoned ── */}
            <motion.g
              style={{
                opacity: xriskLabelOpacity,
                y: xriskFallY,
                rotate: xriskRotate,
              }}
            >
              <text
                x={RIGHT_X}
                y={POLITICIAN_Y - 40}
                fill={XRISK_COLOR}
                fontSize={13}
                fontWeight="bold"
                fontFamily="var(--font-dm-sans)"
                textAnchor="middle"
                letterSpacing="0.05em"
              >
                AI X-Risk
              </text>
            </motion.g>

            {/* ── Row labels (left-aligned to public grid edge) ── */}
            <text
              x={GROUP_CENTER_X - ((PUBLIC_COLS - 1) * PUB_SPACING_X) / 2}
              y={POLITICIAN_Y - 25}
              fill="#555"
              fontSize={9}
              fontFamily="var(--font-dm-sans)"
              textAnchor="start"
              letterSpacing="0.1em"
            >
              POLITICIANS
            </text>
            <line
              x1={80}
              y1={POLITICIAN_Y + POL_SPACING_Y * 2 + 25}
              x2={VW - 80}
              y2={POLITICIAN_Y + POL_SPACING_Y * 2 + 25}
              stroke="#333"
              strokeWidth={0.5}
              strokeDasharray="4 4"
              opacity={0.3}
            />
            <text
              x={GROUP_CENTER_X - ((PUBLIC_COLS - 1) * PUB_SPACING_X) / 2}
              y={PUBLIC_START_Y - 15}
              fill="#555"
              fontSize={9}
              fontFamily="var(--font-dm-sans)"
              textAnchor="start"
              letterSpacing="0.1em"
            >
              GENERAL PUBLIC
            </text>

            {/* ── Static politicians (18, stay in place) ── */}
            {staticPolPositions.map((pos, i) => (
              <PersonIcon
                key={`spol-${i}`}
                x={pos.x}
                y={pos.y}
                size={POL_SIZE}
                color={POLITICIAN_COLOR}
              />
            ))}

            {/* ── Breakaway politicians (2, move right → retreat → fade) ── */}
            <motion.g style={{ opacity: breakawayPolOpacity }}>
              {breakawayPolStart.map((startPos, i) => (
                <MovingFigure
                  key={`bpol-${i}`}
                  startPos={startPos}
                  targetPos={breakawayPolTarget[i]}
                  progress={polBreakawayProgress}
                  retreatTarget={startPos}
                  retreatProgress={retreatProgress}
                  size={POL_SIZE}
                  color={POLITICIAN_COLOR}
                />
              ))}
            </motion.g>

            {/* ── X mark over breakaway politicians ── */}
            <motion.g style={{ opacity: xMarkOpacity }}>
              {breakawayPolTarget.map((pos, i) => (
                <g key={`x-${i}`} transform={`translate(${pos.x},${pos.y - POL_SIZE * 0.8})`}>
                  <line x1={-8} y1={-8} x2={8} y2={8} stroke="#e63946" strokeWidth={2.5} strokeLinecap="round" />
                  <line x1={8} y1={-8} x2={-8} y2={8} stroke="#e63946" strokeWidth={2.5} strokeLinecap="round" />
                </g>
              ))}
            </motion.g>

            {/* ── Static public (94, stay in place) ── */}
            {staticPubPositions.map((pos, i) => (
              <PersonIcon
                key={`spub-${i}`}
                x={pos.x}
                y={pos.y}
                size={PUB_SIZE}
                color={PUBLIC_COLOR}
              />
            ))}

            {/* ── Breakaway public (6, move right and STAY) ── */}
            {breakawayPubStart.map((startPos, i) => (
              <MovingFigure
                key={`bpub-${i}`}
                startPos={startPos}
                targetPos={breakawayPubTarget[i]}
                progress={publicBreakawayProgress}
                size={PUB_SIZE}
                color={PUBLIC_COLOR}
              />
            ))}

            {/* ── "Next Election Cycle" text ── */}
            <motion.g style={{ opacity: electionOpacity, y: electionY }}>
              <text
                x={VW / 2}
                y={15}
                fill="#aaa"
                fontSize={12}
                fontWeight="bold"
                fontFamily="var(--font-dm-sans)"
                textAnchor="middle"
                letterSpacing="0.08em"
              >
                NEXT ELECTION CYCLE
              </text>
              <line
                x1={VW / 2 - 90}
                y1={20}
                x2={VW / 2 + 90}
                y2={20}
                stroke="#aaa"
                strokeWidth={0.5}
                opacity={0.5}
              />
            </motion.g>
          </svg>
        </motion.div>

        {/* ── Closing text ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-4"
          style={{ opacity: closingOpacity, y: closingY }}
        >
          <p className="text-xl sm:text-3xl text-text leading-snug max-w-3xl text-center font-heading font-bold">
            Without public demand, the leaders we need won&apos;t exist.
          </p>
          <p className="text-base sm:text-lg text-text-muted mt-6 max-w-2xl text-center">
            This is why grassroots change matters — and why Lethal Intelligence
            works to build the awareness that creates the demand.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
