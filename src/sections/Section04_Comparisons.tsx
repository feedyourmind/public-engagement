"use client";

import ScrollSection from "@/components/ScrollSection";
import DistributionChart from "@/components/DistributionChart";

const COMPARISONS = [
  {
    title: "Tech Workers vs General Public",
    description:
      "Tech industry workers tend to cluster toward the optimistic end of the spectrum. Their direct experience with AI capabilities makes them more likely to see it as a tool under human control — while the broader public weighs societal impact more heavily.",
    comparisonCurve: {
      location: -0.2,
      scale: 0.5,
      shape: 8.0,
      label: "Tech Workers",
      color: "#60a5fa",
      dashed: true,
    },
  },
  {
    title: "2024 Perception vs 2030 Projection",
    description:
      "As AI capabilities advance and real-world impacts become harder to ignore, the distribution is likely to shift rightward. More people may move from casual optimism toward genuine concern — the question is whether the shift happens fast enough to drive policy.",
    comparisonCurve: {
      location: 1.2,
      scale: 0.9,
      shape: 1.5,
      label: "2030 Projection",
      color: "#f472b6",
      dashed: true,
    },
  },
];

export default function Section04_Comparisons() {
  return (
    <section
      id="comparisons"
      className="px-4 sm:px-8 lg:px-16 py-20 max-w-5xl mx-auto"
    >
      <div className="mb-12">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text mb-3">
          Comparing Perspectives
        </h2>
        <p className="text-sm text-text-muted leading-relaxed max-w-xl">
          The same distribution looks different through different lenses. Overlay
          alternative curves to see how perceptions might vary across groups and
          over time.
        </p>
      </div>

      <div className="space-y-20">
        {COMPARISONS.map((comp) => (
          <ScrollSection
            key={comp.title}
            id={`comp-${comp.title.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-text mb-3">
              {comp.title}
            </h3>
            <p className="text-sm text-text-muted leading-relaxed max-w-xl mb-6">
              {comp.description}
            </p>
            <DistributionChart
              comparisonCurve={comp.comparisonCurve}
              showBoundaries={false}
              showLabels={true}
              interactive={false}
            />
          </ScrollSection>
        ))}
      </div>
    </section>
  );
}
