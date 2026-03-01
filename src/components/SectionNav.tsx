"use client";

import { motion, useScroll } from "framer-motion";

const SECTIONS = [
  { id: "intro", label: "Intro" },
  { id: "spectrum", label: "Spectrum" },
  { id: "segments", label: "Segments" },
  { id: "funnel", label: "Funnel" },
  { id: "goals", label: "Goals" },
  { id: "comparisons", label: "Comparisons" },
  { id: "concerned", label: "Concerned" },
  { id: "conclusion", label: "Conclusion" },
];

export default function SectionNav() {
  const { scrollYProgress } = useScroll();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Progress bar */}
      <motion.div
        className="fixed top-12 left-0 right-0 h-0.5 bg-cautious origin-left z-40"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Side nav — desktop only */}
      <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className="group flex items-center gap-3 bg-transparent border-none cursor-pointer"
            aria-label={`Scroll to ${s.label}`}
          >
            <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-cautious transition-colors" />
            <span className="text-[10px] uppercase tracking-widest text-white/0 group-hover:text-white/60 transition-colors font-body">
              {s.label}
            </span>
          </button>
        ))}
      </nav>
    </>
  );
}
