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
        <p className="text-sm text-text-muted leading-relaxed ">
          This chart maps the perceived spectrum of AI risk — from those who
          dismiss it entirely to those who see it as an existential threat.
        </p>
        <p className="text-sm text-text-muted leading-relaxed mt-2">
          Every curve and segment boundary on this page is yours to shape. Visit{" "}
          <a
            href="/settings"
            className="inline-flex items-center gap-1 text-cautious hover:underline border border-cautious/30 rounded px-1.5 py-0.5"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Settings
          </a>{" "}
          to play with the sliders — adjust the distribution curves, shift
          where one segment ends and another begins, and craft your own
          variation of this story.
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
