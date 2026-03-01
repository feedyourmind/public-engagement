"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import DistributionChart from "@/components/DistributionChart";
import DistributionGrid from "@/components/DistributionGrid";
import { SEGMENTS } from "@/utils/segments";

const SEGMENT_NARRATIVES = [
  {
    id: "dismissive",
    title: "The Dismissive",
    text: "This group sees AI risk as essentially zero. Technology, they argue, is neutral — or even inherently beneficial. Historical precedent shows that every major technology was met with unfounded fear. AI is no different.",
  },
  {
    id: "unconcerned",
    title: "The Unconcerned",
    text: "They acknowledge risks exist, but believe existing institutions — markets, governments, courts — are well-equipped to handle them. Innovation should not be stifled by speculative fears.",
  },
  {
    id: "cautious",
    title: "The Cautiously Optimistic",
    text: "Real risks demand real attention, but careful governance can keep things on track. This is the most common position: optimistic about AI's potential while insisting on guardrails, standards, and oversight.",
  },
  {
    id: "concerned-current",
    title: "Concerned About Current Risks",
    text: "Worried about risks already materializing today — pervasive surveillance, mass job displacement, algorithmic bias amplifying inequality, and AI-generated misinformation eroding trust in shared reality.",
  },
  {
    id: "concerned-future",
    title: "Concerned About Future Risks",
    text: "Looking further ahead: AI-enabled bioterrorism, dystopian social control, power consolidating into an AI oligarchy, and autonomous weapons making war frictionless and perpetual.",
  },
  {
    id: "alarmed",
    title: "The Alarmed",
    text: "AI poses a genuine existential threat. The current trajectory — racing toward superintelligence without adequate safety — leads to catastrophe. Some in this group give humanity less than even odds of surviving the century.",
  },
];

export default function Section03_ZoomedSegments() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const setTitleRef = useCallback(
    (el: HTMLDivElement | null, i: number) => {
      titleRefs.current[i] = el;
    },
    []
  );

  useEffect(() => {
    const handleScroll = () => {
      const gridEl = gridRef.current;
      if (!gridEl) return;

      // Threshold = top of the distribution grid
      const threshold = gridEl.getBoundingClientRect().top;

      let newIndex = 0;
      for (let i = 0; i < titleRefs.current.length; i++) {
        const el = titleRefs.current[i];
        if (!el) continue;
        if (el.getBoundingClientRect().top < threshold) {
          newIndex = i;
        }
      }
      setActiveIndex(newIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeSegment = SEGMENTS[Math.max(0, Math.min(activeIndex, 5))];

  return (
    <section
      id="segments"
      ref={sectionRef}
      className="px-4 sm:px-8 lg:px-16 py-20 max-w-5xl mx-auto"
    >
      <div className="mb-12">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text mb-3">
          Who Thinks What?
        </h2>
        <p className="text-sm text-text-muted leading-relaxed max-w-xl">
          Scroll through each segment of the spectrum to understand the
          perspective behind the position.
        </p>
      </div>

      <div className="lg:flex lg:gap-12">
        {/* Sticky chart */}
        <div className="lg:w-1/2 lg:sticky lg:top-[20vh] lg:self-start mb-8 lg:mb-0">
          <DistributionChart
            highlightSegments={[activeSegment.id]}
            dimOtherSegments={true}
            showBoundaries={false}
            showLabels={true}
            interactive={false}
          />
          <div ref={gridRef}>
            <DistributionGrid
              highlightSegmentId={activeSegment.id}
              interactive={false}
            />
          </div>
          <div className="mt-4 flex gap-1.5 justify-center">
            {SEGMENTS.map((seg, i) => (
              <div
                key={seg.id}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: activeIndex === i ? 24 : 8,
                  background:
                    activeIndex === i ? seg.color : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Scrolling narratives */}
        <div className="lg:w-1/2">
          {SEGMENT_NARRATIVES.map((item, i) => (
            <motion.div
              key={item.id}
              className="min-h-[25vh] flex items-center"
              initial={{ opacity: 0.3 }}
              whileInView={{ opacity: 1 }}
              viewport={{ margin: "-40%" }}
              transition={{ duration: 0.5 }}
            >
              <div className="py-4">
                <div
                  ref={(el) => setTitleRef(el, i)}
                  className="flex items-center gap-3 mb-4"
                >
                  <div
                    className="w-4 h-4 rounded"
                    style={{ background: SEGMENTS[i].color }}
                  />
                  <h3
                    className="font-heading text-2xl font-bold"
                    style={{ color: SEGMENTS[i].color }}
                  >
                    {item.title}
                  </h3>
                </div>
                <p className="text-base text-text-muted leading-relaxed">
                  {item.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
