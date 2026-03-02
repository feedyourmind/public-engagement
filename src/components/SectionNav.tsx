"use client";

import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";

/* ── Nav dots (left rail + progress bar active state) ── */
const NAV_SECTIONS = [
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
  { id: "influencer-deals", label: "Influencers" },
  { id: "concerned", label: "Concerned" },
  { id: "conclusion", label: "Conclusion" },
];

/* ── Every section on the page, in scroll order — drives URL hash ── */
const ALL_SECTIONS = [
  "spectrum",
  "segments",
  "funnel",
  "goals",
  "goal2",
  "grassroots",
  "comparisons",
  "comparisons-tpot",
  "comparisons-aisafety",
  "strategies",
  "meet-people",
  "distribution",
  "resonance-intelligence",
  "production-pipeline",
  "aidangers",
  "platforms",
  "twitter",
  "instagram",
  "all-platforms",
  "the-hub",
  "hub-gap",
  "hub-content",
  "conversion-journey",
  "ai-ends-pub",
  "pub-value",
  "pub-activities",
  "pub-color-coding",
  "pub-tables",
  "pub-name",
  "pub-grab-a-chair",
  "takedowns",
  "targeted-skepticisms",
  "100-sticking-points",
  "organic-engine",
  "persona-stories",
  "story-paul",
  "story-peter",
  "story-organizations",
  "story-the-movement",
  "story-elon-musk",
  "story-emmanuel-macron",
  "youtube",
  "animated-content",
  "xrisk-paradox",
  "podcasting",
  "content-engine",
  "wild-experiments",
  "no-plot-armor",
  "exp-2030",
  "reality-is-broken",
  "dystopian-intelligence",
  "experiments-summary",
  "influencer-deals",
  "niche-truck",
  "niche-school",
  "niche-code",
  "endless-opportunities",
  "concerned",
  "conclusion",
];

/* Map granular-only IDs to the nearest nav dot */
const NAV_IDS = new Set(NAV_SECTIONS.map((s) => s.id));
function toNavId(id: string): string {
  if (NAV_IDS.has(id)) return id;
  // Walk backwards through ALL_SECTIONS to find the closest nav-level parent
  const idx = ALL_SECTIONS.indexOf(id);
  for (let i = idx - 1; i >= 0; i--) {
    if (NAV_IDS.has(ALL_SECTIONS[i])) return ALL_SECTIONS[i];
  }
  return ALL_SECTIONS[0];
}

export default function SectionNav() {
  const { scrollYProgress } = useScroll();
  const [activeId, setActiveId] = useState<string>(ALL_SECTIONS[0]);

  useEffect(() => {
    let ticking = false;

    const updateActive = () => {
      const threshold = window.scrollY + window.innerHeight * 0.4;
      let current = ALL_SECTIONS[0];

      for (const id of ALL_SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= threshold) {
          current = id;
        }
      }

      setActiveId(current);
      if (window.location.hash !== `#${current}`) {
        history.replaceState(null, "", `#${current}`);
      }
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

    // On initial load, scroll to the section indicated by the URL hash
    const hash = window.location.hash.slice(1);
    if (hash) {
      const target = document.getElementById(hash);
      if (target) {
        requestAnimationFrame(() => {
          const y = target.getBoundingClientRect().top + window.scrollY - 56;
          window.scrollTo({ top: y, behavior: "smooth" });
        });
      }
    }

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
        {NAV_SECTIONS.map((s) => {
          const isActive = toNavId(activeId) === s.id;
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
