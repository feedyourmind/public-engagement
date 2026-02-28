"use client";

import { motion } from "framer-motion";
import ScrollSection from "@/components/ScrollSection";
import DistributionChart from "@/components/DistributionChart";

export default function Section06_Conclusion() {
  return (
    <ScrollSection
      id="conclusion"
      className="px-4 sm:px-8 lg:px-16 py-20 max-w-5xl mx-auto"
    >
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text mb-4">
          Where Do We Go From Here?
        </h2>
        <p className="text-sm text-text-muted leading-relaxed">
          The spectrum isn&apos;t static. As AI capabilities advance, as
          real-world impacts accumulate, the distribution shifts. Understanding
          where people stand — and why — is the first step toward informed,
          democratic governance of transformative technology.
        </p>
      </div>

      <DistributionChart
        showBoundaries={true}
        showLabels={true}
        interactive={false}
      />

      <motion.div
        className="mt-16 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <p className="text-xs text-text-dim italic mb-8">
          This is a qualitative, perception-based visualization — not derived
          from empirical survey data. It represents one interpretation of how
          public opinion distributes across the AI risk spectrum.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#spectrum"
            className="px-6 py-3 rounded-full border border-cautious/30 text-cautious text-sm font-medium hover:bg-cautious/10 transition-colors"
          >
            Explore Again
          </a>
          <a
            href="#intro"
            className="px-6 py-3 rounded-full border border-white/10 text-text-muted text-sm font-medium hover:bg-white/[0.05] transition-colors"
          >
            Back to Top
          </a>
        </div>
      </motion.div>
    </ScrollSection>
  );
}
