"use client";

import ScrollSection from "@/components/ScrollSection";
import DistributionChart from "@/components/DistributionChart";
import SegmentLegend from "@/components/SegmentLegend";
import DistributionGrid from "@/components/DistributionGrid";

export default function Section02_Spectrum() {
  return (
    <ScrollSection
      id="spectrum"
      className="px-4 sm:px-8 lg:px-16 py-20 max-w-5xl mx-auto"
    >
      <div className="mb-8">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text mb-3">
          The AI Risk Spectrum
        </h2>
        <p className="text-sm text-text-muted leading-relaxed max-w-xl">
          This chart maps the perceived spectrum of AI risk — from those who
          dismiss it entirely to those who see it as an existential threat.
          Adjust the curve shape and segment boundaries in{" "}
          <a href="/settings" className="text-cautious hover:underline">
            Settings
          </a>
          .
        </p>
      </div>

      <DistributionChart
        showBoundaries={true}
        showLabels={true}
      />

      <DistributionGrid />

      <div className="mt-8">
        <SegmentLegend />
      </div>
    </ScrollSection>
  );
}
