"use client";

import { useCallback } from "react";
import { VariationProvider } from "@/context/VariationContext";
import { DistributionProvider } from "@/context/DistributionContext";
import SectionNav from "@/components/SectionNav";
import Section02_Spectrum from "@/sections/Section02_Spectrum";
import Section03_ZoomedSegments from "@/sections/Section03_ZoomedSegments";
import Section03b_Funnel from "@/sections/Section03b_Funnel";
import Section03c_Goals from "@/sections/Section03c_Goals";
import Section04_Comparisons from "@/sections/Section04_Comparisons";
import Section05_ConcernedSplit from "@/sections/Section05_ConcernedSplit";
import Section06_Conclusion from "@/sections/Section06_Conclusion";
import type { VariationWithPresets } from "@/types";

interface MainPageClientProps {
  variation: VariationWithPresets | null;
  allVariations: VariationWithPresets[];
}

export default function MainPageClient({
  variation,
  allVariations,
}: MainPageClientProps) {
  const firstPreset = variation?.presets?.[0] ?? null;

  // No-op for main page — debounced saves only happen on settings page
  const handleParamsChange = useCallback(() => {}, []);

  return (
    <VariationProvider
      initialVariation={variation}
      initialAllVariations={allVariations}
    >
      <DistributionProvider
        initialPreset={firstPreset}
        onParamsChange={handleParamsChange}
      >
        <SectionNav />
        <main>
          <Section02_Spectrum />
          <Section03_ZoomedSegments />
          <Section03b_Funnel />
          <Section03c_Goals />
          <Section04_Comparisons />
          <Section05_ConcernedSplit />
          <Section06_Conclusion />
        </main>
      </DistributionProvider>
    </VariationProvider>
  );
}
