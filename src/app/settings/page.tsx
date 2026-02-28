"use client";

import { useState } from "react";
import DistributionChart from "@/components/DistributionChart";
import PresetButtons from "@/components/PresetButtons";
import SegmentLegend from "@/components/SegmentLegend";
import BoundaryControls from "@/components/BoundaryControls";
import CurveControls from "@/components/CurveControls";
import { useDistribution } from "@/context/DistributionContext";

export default function SettingsPage() {
  const { location, scale, shape, boundaries } = useDistribution();
  const [copied, setCopied] = useState(false);

  const exportSettings = () => {
    const json = JSON.stringify(
      { loc: location, sc: scale, sh: shape, boundaries },
      null,
      2
    );
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <main className="px-4 sm:px-8 lg:px-12 py-8 max-w-350 mx-auto">
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text mb-3">
              Chart Settings
            </h1>
            <p className="text-sm text-text-muted leading-relaxed max-w-xl">
              Configure the distribution curve and segment boundaries. Changes
              are saved automatically and reflected across all visualizations.
            </p>
          </div>
          <button
            onClick={exportSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/4 text-text/80 text-xs font-body cursor-pointer transition-all hover:bg-white/10 hover:text-white whitespace-nowrap"
            title="Copy settings as JSON"
          >
            {copied ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
            )}
            {copied ? "Copied!" : "JSON"}
          </button>
        </div>
      </div>

      <PresetButtons />

      <div className="lg:relative">
        {/* Right — chart and legend (defines section height) */}
        <div className="lg:ml-91">
          <DistributionChart
            interactive={true}
            showBoundaries={true}
            showLabels={true}
          />
          <div className="mt-8">
            <SegmentLegend />
          </div>
        </div>

        {/* Left sidebar — independently scrollable controls */}
        <div className="mt-6 lg:mt-0 lg:absolute lg:top-0 lg:bottom-0 lg:left-0 lg:w-85 lg:overflow-y-auto lg:pr-6">
          <CurveControls />
          <BoundaryControls />
        </div>
      </div>
    </main>
  );
}
