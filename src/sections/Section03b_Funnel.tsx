"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useDistribution } from "@/context/DistributionContext";
import DistributionChart from "@/components/DistributionChart";
import FunnelCanvas from "@/components/FunnelCanvas";
import FunnelOrgLabels from "@/components/FunnelOrgLabels";
import { computeFunnelPositions } from "@/utils/funnelLayout";

/* Height reserved for the chart before it collapses */
const CHART_MAX_H = 150;

export default function Section03b_Funnel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { segments, segmentAreas } = useDistribution();
  const [canvasW, setCanvasW] = useState(600);
  const [canvasH, setCanvasH] = useState(500);

  /* Track canvas container width + available area height */
  useEffect(() => {
    const area = areaRef.current;
    const container = containerRef.current;
    if (!area || !container) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === container) {
          const w = entry.contentRect.width;
          if (w > 0) setCanvasW(Math.round(w));
        }
        if (entry.target === area) {
          const h = entry.contentRect.height;
          if (h > 0) setCanvasH(Math.round(Math.max(300, h - 20)));
        }
      }
    });
    ro.observe(container);
    ro.observe(area);
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
  // 0.50–0.62  funnel slides left, chart collapses
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

  // Slide funnel left
  const slideProgress = useTransform(
    scrollYProgress,
    [0.50, 0.62],
    [0, 1],
    { clamp: true }
  );

  const funnelX = useTransform(slideProgress, [0, 1], ["0%", "-25%"]);
  const funnelScale = useTransform(slideProgress, [0, 1], [1, 0.90]);

  // Chart fades + collapses; title stays visible
  const chartOpacity = useTransform(slideProgress, [0, 0.3], [1, 0]);
  const chartMaxHeight = useTransform(
    slideProgress,
    [0, 0.4],
    [CHART_MAX_H, 0],
    { clamp: true }
  );

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

  // Funnel dimensions derived from canvas size
  const funnel = useMemo(() => ({
    topWidth: canvasW - 20,
    bottomWidth: Math.max(16, Math.round(canvasW * 0.03)),
    height: canvasH - 10,
    topY: 5,
    centerX: canvasW / 2,
  }), [canvasW, canvasH]);

  const bandBoundaries = useMemo(() => {
    const result = computeFunnelPositions(
      segmentAreas,
      canvasW,
      canvasH,
      funnel
    );
    return result.bandBoundaries;
  }, [segmentAreas, canvasW, canvasH, funnel]);

  return (
    <section
      ref={sectionRef}
      id="funnel"
      className="relative"
      style={{ height: "450vh" }}
    >
      <motion.div
        className="sticky top-12 h-[calc(100vh-3rem)] flex flex-col items-center overflow-hidden px-4 sm:px-8 lg:px-16"
        style={{ opacity: sectionOpacity }}
      >
        {/* Funnel side — slides left and scales */}
        <motion.div
          className="flex flex-col items-center w-full flex-1 min-h-0"
          style={{
            x: funnelX,
            scale: funnelScale,
            transformOrigin: "center center",
          }}
        >
          {/* Title — stays visible above funnel */}
          <div className="mb-2 text-center shrink-0 pt-4">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text mb-1">
              The Conversion Funnel
            </h2>
            <p className="text-sm text-text-muted leading-relaxed max-w-xl mx-auto">
              The same population, reshaped — from widespread dismissal at the
              top to a small core of alarmed voices at the bottom.
            </p>
          </div>

          {/* Chart — fades + collapses during slide to free space */}
          <motion.div
            className="w-full max-w-[40vw] mx-auto overflow-hidden shrink-0"
            style={{ opacity: chartOpacity, maxHeight: chartMaxHeight }}
          >
            <DistributionChart
              showBoundaries={false}
              showLabels={true}
              interactive={false}
              height={130}
            />
          </motion.div>

          {/* Canvas area — fills remaining vertical space */}
          <div
            ref={areaRef}
            className="flex-1 min-h-0 flex items-center justify-center w-full"
          >
            <div ref={containerRef} className="w-full max-w-[40vw]">
              <div
                className="relative overflow-visible"
                style={{ width: canvasW, height: canvasH }}
              >
                <FunnelCanvas
                  segments={segments}
                  segmentAreas={segmentAreas}
                  morphProgress={morphProgress}
                  width={canvasW}
                  height={canvasH}
                  funnel={funnel}
                />
                <FunnelOrgLabels
                  labelProgress={labelProgress}
                  bandBoundaries={bandBoundaries}
                  funnelWidth={canvasW}
                  funnelHeight={canvasH}
                />
              </div>
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
              Through memes, short videos, animated explainers, long-form
              educational content, clips from luminaries, and all manner
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
