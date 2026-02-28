"use client";

import { motion } from "framer-motion";
import DistributionChart from "@/components/DistributionChart";

const words = ["The", "AI", "X-Risk", "Spectrum"];

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const wordAnim = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function Section01_Intro() {
  return (
    <section
      id="intro"
      className="min-h-screen flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-20 max-w-5xl mx-auto"
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="mb-10"
      >
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text leading-tight tracking-tight mb-6">
          {words.map((word, i) => (
            <motion.span
              key={i}
              variants={wordAnim}
              className="inline-block mr-3"
            >
              {word}
            </motion.span>
          ))}
        </h1>
        <motion.p
          variants={wordAnim}
          className="text-base sm:text-lg text-text-muted leading-relaxed max-w-2xl"
        >
          A qualitative view of how people perceive the risks posed by
          artificial intelligence — from full dismissal to existential alarm.
          Scroll to explore the spectrum.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <DistributionChart
          interactive={false}
          showBoundaries={false}
          showLabels={false}
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="text-[11px] text-text-dim mt-8 text-center italic"
      >
        This is a qualitative, perception-based visualization — not derived from
        empirical survey data.
      </motion.p>
    </section>
  );
}
