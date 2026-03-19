"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, useScroll } from "framer-motion";
import type { SectionEntry } from "@/config/sections";

interface SectionNavProps {
  sections: SectionEntry[];
}

export default function SectionNav({ sections }: SectionNavProps) {
  const { scrollYProgress } = useScroll();
  const [activeId, setActiveId] = useState<string>("top");

  const navSections = useMemo(
    () =>
      sections
        .filter((s) => s.navLabel)
        .map((s) => ({ id: s.navId, label: s.navLabel })),
    [sections],
  );

  const allSections = useMemo(
    () => ["top", ...sections.flatMap((s) => s.subIds)],
    [sections],
  );

  const navIds = useMemo(() => new Set(navSections.map((s) => s.id)), [navSections]);

  const toNavId = (id: string): string => {
    if (navIds.has(id)) return id;
    const idx = allSections.indexOf(id);
    for (let i = idx - 1; i >= 0; i--) {
      if (navIds.has(allSections[i])) return allSections[i];
    }
    return allSections[0];
  };

  useEffect(() => {
    let ticking = false;

    const updateActive = () => {
      const threshold = window.scrollY + window.innerHeight * 0.4;
      let current = "top";

      for (const id of allSections) {
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

    // On initial load: if no hash or #top, set #top and stay put.
    // Otherwise scroll to the requested section.
    const hash = window.location.hash.slice(1);
    if (!hash || hash === "top") {
      history.replaceState(null, "", "#top");
    } else if (allSections.includes(hash)) {
      const target = document.getElementById(hash);
      if (target) {
        requestAnimationFrame(() => {
          const y = target.getBoundingClientRect().top + window.scrollY - 56;
          window.scrollTo({ top: y, behavior: "smooth" });
        });
      }
      setActiveId(hash);
    }

    return () => window.removeEventListener("scroll", onScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {navSections.map((s) => {
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
