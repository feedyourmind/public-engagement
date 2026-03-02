"use client";

import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";

const SECTIONS = [
  { id: "spectrum", label: "Spectrum" },
  { id: "segments", label: "Segments" },
  { id: "funnel", label: "Funnel" },
  { id: "goals", label: "Goals" },
  { id: "grassroots", label: "Grassroots" },
  { id: "comparisons", label: "Perceptions" },
  { id: "strategies", label: "Strategies" },
  { id: "distribution", label: "Distribution" },
  { id: "the-hub", label: "The Hub" },
  { id: "conversion-journey", label: "Conversion" },
  { id: "ai-ends-pub", label: "The Community" },
  { id: "takedowns", label: "Takedowns" },
  { id: "youtube", label: "YouTube" },
  { id: "wild-experiments", label: "Experiments" },
  { id: "concerned", label: "Concerned" },
  { id: "conclusion", label: "Conclusion" },
];

export default function SectionNav() {
  const { scrollYProgress } = useScroll();
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    let ticking = false;

    const updateActive = () => {
      const threshold = window.scrollY + window.innerHeight * 0.4;
      let current = SECTIONS[0].id;

      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el && el.offsetTop <= threshold) {
          current = section.id;
        }
      }

      setActiveId(current);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateActive);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateActive();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 56;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <>
      {/* Progress bar */}
      <motion.div
        className="fixed top-12 left-0 right-0 h-0.5 bg-cautious origin-left z-40"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Side nav — desktop only */}
      <nav className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col">
        {SECTIONS.map((s) => {
          const isActive = activeId === s.id;
          return (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="group flex items-center gap-3 bg-transparent border-none cursor-pointer py-1.5 pl-6 pr-8"
              aria-label={`Scroll to ${s.label}`}
            >
              <div
                className={`w-2 h-2 rounded-full transition-colors ${
                  isActive
                    ? "bg-cautious"
                    : "bg-white/20 group-hover:bg-cautious"
                }`}
              />
              <span
                className={`text-[10px] uppercase tracking-widest transition-colors font-body ${
                  isActive
                    ? "text-white/70"
                    : "text-white/0 group-hover:text-white/60"
                }`}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
