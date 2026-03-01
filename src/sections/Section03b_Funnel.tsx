"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useDistribution } from "@/context/DistributionContext";
import DistributionChart from "@/components/DistributionChart";
import FunnelCanvas from "@/components/FunnelCanvas";
import FunnelOrgLabels from "@/components/FunnelOrgLabels";
import {
  computeFunnelPositions,
  DEFAULT_FUNNEL,
} from "@/utils/funnelLayout";

const CANVAS_H = 500;

export default function Section03b_Funnel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { segments, segmentAreas } = useDistribution();
  const [canvasW, setCanvasW] = useState(768);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 0) setCanvasW(Math.round(w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // ── Phase timings ──────────────────────────────────────────────
  // 0.00–0.05  fade in
  // 0.06–0.30  grid → funnel morph
  // 0.32–0.48  org labels appear
  // 0.50–0.62  funnel slides left + shrinks
  // 0.58–0.68  Lethal Intelligence text fades in
  // 0.90–0.97  fade out

  const sectionOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.05, 0.90, 0.97],
    [0, 1, 1, 0]
  );

  const morphProgress = useTransform(
    scrollYProgress,
    [0.06, 0.30],
    [0, 1],
    { clamp: true }
  );

  const labelProgress = useTransform(
    scrollYProgress,
    [0.32, 0.48],
    [0, 1],
    { clamp: true }
  );

  // Slide funnel left + shrink
  const slideProgress = useTransform(
    scrollYProgress,
    [0.50, 0.62],
    [0, 1],
    { clamp: true }
  );

  const funnelX = useTransform(slideProgress, [0, 1], ["0%", "-18%"]);
  const funnelScale = useTransform(slideProgress, [0, 1], [1, 0.70]);
  // Hide title/chart as funnel slides
  const headerOpacity = useTransform(slideProgress, [0, 0.3], [1, 0]);

  // Text panel fades in
  const textOpacity = useTransform(
    scrollYProgress,
    [0.58, 0.68],
    [0, 1],
    { clamp: true }
  );
  const textY = useTransform(
    scrollYProgress,
    [0.58, 0.68],
    [40, 0],
    { clamp: true }
  );

  // Funnel dimensions scaled to container width
  const funnel = useMemo(() => ({
    ...DEFAULT_FUNNEL,
    topWidth: canvasW - 40,
    centerX: canvasW / 2,
  }), [canvasW]);

  const bandBoundaries = useMemo(() => {
    const result = computeFunnelPositions(
      segmentAreas,
      canvasW,
      CANVAS_H,
      funnel
    );
    return result.bandBoundaries;
  }, [segmentAreas, canvasW, funnel]);

  return (
    <section
      ref={sectionRef}
      id="funnel"
      className="relative"
      style={{ height: "450vh" }}
    >
      <motion.div
        className="sticky top-0 h-screen flex items-center justify-center px-4 sm:px-8 lg:px-16 overflow-hidden"
        style={{ opacity: sectionOpacity }}
      >
        {/* Funnel side — slides left and shrinks */}
        <motion.div
          className="flex flex-col items-center w-full"
          style={{
            x: funnelX,
            scale: funnelScale,
            transformOrigin: "center center",
          }}
        >
          {/* Title + subtitle — fade out during slide */}
          <motion.div className="mb-4 text-center" style={{ opacity: headerOpacity }}>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text mb-2">
              The Conversion Funnel
            </h2>
            <p className="text-sm text-text-muted leading-relaxed max-w-xl mx-auto">
              The same population, reshaped — from widespread dismissal at the
              top to a small core of alarmed voices at the bottom.
            </p>
          </motion.div>

          {/* Chart + Canvas container */}
          <div ref={containerRef} className="w-full max-w-3xl">
            {/* Chart fades out during slide */}
            <motion.div style={{ opacity: headerOpacity }}>
              <DistributionChart
                showBoundaries={false}
                showLabels={true}
                interactive={false}
                height={130}
              />
            </motion.div>

            <div
              className="relative overflow-visible"
              style={{ width: canvasW, height: CANVAS_H }}
            >
              <FunnelCanvas
                segments={segments}
                segmentAreas={segmentAreas}
                morphProgress={morphProgress}
                width={canvasW}
                height={CANVAS_H}
                funnel={funnel}
              />
              <FunnelOrgLabels
                labelProgress={labelProgress}
                bandBoundaries={bandBoundaries}
                funnelWidth={canvasW}
                funnelHeight={CANVAS_H}
              />
            </div>
          </div>
        </motion.div>

        {/* Lethal Intelligence text panel — right side */}
        <motion.div
          className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-[38%] max-w-md"
          style={{ opacity: textOpacity, y: textY }}
        >
          <h3
            className="font-heading text-2xl sm:text-3xl font-bold mb-4"
            style={{ color: "#52b788" }}
          >
            Lethal Intelligence
          </h3>
          <div className="space-y-3 text-sm sm:text-base text-text-muted leading-relaxed">
            <p>
              Lethal Intelligence sits at the very top of the conversion funnel,
              targeting the general public. It doesn&apos;t assume people are
              already on board with the premise — instead, it aims to{" "}
              <span className="text-text font-medium">lure them in</span>.
            </p>
            <p>
              Through memes, short videos, animated explainers, and all manner
              of visually engaging, viral content, it sparks curiosity and
              interest — guiding people through the journey from casual
              dismissal to genuine concern.
            </p>
            <p>
              It operates across every layer of awareness: from those who
              haven&apos;t thought about AI risk at all, to those already
              leaning cautious. The goal is to move them{" "}
              <span className="text-text font-medium">down the funnel</span>,
              one step at a time.
            </p>
            <p>
              In essence, Lethal Intelligence is a{" "}
              <span className="text-text font-medium">router</span> — it
              onboards, enlists, and activates people who are ready to act.
              Once activated, they&apos;re handed off to{" "}
              <span style={{ color: "#e07a5f" }} className="font-medium">
                Humans First
              </span>{" "}
              to channel that energy into action.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
