"use client";

import ScrollSection from "@/components/ScrollSection";
import DistributionChart from "@/components/DistributionChart";

const CURRENT_RISKS = [
  { label: "Surveillance", description: "Mass data collection and facial recognition eroding privacy" },
  { label: "Job Displacement", description: "Automation replacing roles faster than new ones emerge" },
  { label: "Algorithmic Bias", description: "AI systems amplifying racial, gender, and socioeconomic inequality" },
  { label: "Misinformation", description: "AI-generated deepfakes and content undermining shared truth" },
];

const FUTURE_RISKS = [
  { label: "Bioterrorism", description: "AI lowering barriers to engineering novel biological threats" },
  { label: "Dystopian Control", description: "Authoritarian regimes using AI for total social control" },
  { label: "Power Oligarchy", description: "AI wealth concentrating into a handful of companies" },
  { label: "Automated Warfare", description: "Autonomous weapons making conflict perpetual and frictionless" },
];

export default function Section05_ConcernedSplit() {
  return (
    <ScrollSection
      id="concerned"
      className="px-4 sm:px-8 lg:px-16 py-20 max-w-5xl mx-auto"
    >
      <div className="mb-12">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text mb-3">
          The Concerned Split
        </h2>
        <p className="text-sm text-text-muted leading-relaxed max-w-xl">
          Not all concern is the same. Some worry about harms happening right
          now; others focus on catastrophic futures that haven&apos;t arrived
          yet. The boundary between them defines a critical fault line in AI
          policy.
        </p>
      </div>

      <DistributionChart
        highlightSegments={["concerned-current", "concerned-future"]}
        dimOtherSegments={true}
        showBoundaries={false}
        showLabels={true}
        interactive={false}
        annotations={[
          { x: 1.4, label: "The Fault Line", color: "#fff" },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {/* Current risks */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-4 h-4 rounded" style={{ background: "#e07a5f" }} />
            <h3 className="font-heading text-xl font-bold text-concerned-current">
              Current Risks
            </h3>
          </div>
          <p className="text-sm text-text-muted mb-4">
            Harms that are already measurable and documented.
          </p>
          <div className="space-y-3">
            {CURRENT_RISKS.map((risk) => (
              <div
                key={risk.label}
                className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]"
              >
                <div className="text-sm font-semibold text-concerned-current mb-1">
                  {risk.label}
                </div>
                <p className="text-xs text-text-dim leading-relaxed m-0">
                  {risk.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Future risks */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-4 h-4 rounded" style={{ background: "#c1440e" }} />
            <h3 className="font-heading text-xl font-bold text-concerned-future">
              Future Risks
            </h3>
          </div>
          <p className="text-sm text-text-muted mb-4">
            Threats that could emerge as capabilities scale.
          </p>
          <div className="space-y-3">
            {FUTURE_RISKS.map((risk) => (
              <div
                key={risk.label}
                className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]"
              >
                <div className="text-sm font-semibold text-concerned-future mb-1">
                  {risk.label}
                </div>
                <p className="text-xs text-text-dim leading-relaxed m-0">
                  {risk.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollSection>
  );
}
