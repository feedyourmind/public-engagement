"use client";

import { useCallback } from "react";
import { VariationProvider } from "@/context/VariationContext";
import { DistributionProvider } from "@/context/DistributionContext";
import SectionNav from "@/components/SectionNav";
import SectionDivider from "@/components/SectionDivider";
import Section02_Spectrum from "@/sections/Section02_Spectrum";
import Section03_ZoomedSegments from "@/sections/Section03_ZoomedSegments";
import Section03b_Funnel from "@/sections/Section03b_Funnel";
import Section03c_Goals from "@/sections/Section03c_Goals";
import Section03d_Goal2 from "@/sections/Section03d_Goal2";
import Section03e_Grassroots from "@/sections/Section03e_Grassroots";
import Section04_Comparisons from "@/sections/Section04_Comparisons";
import Section04a_Strategies from "@/sections/Section04a_Strategies";
import Section04b_Distribution from "@/sections/Section04b_Distribution";
import Section04c_Platforms from "@/sections/Section04c_Platforms";
import Section05_ConcernedSplit from "@/sections/Section05_ConcernedSplit";
import Section06_Conclusion from "@/sections/Section06_Conclusion";
import Section07_TheHub from "@/sections/Section07_TheHub";
import Section07b_ConversionJourney from "@/sections/Section07b_ConversionJourney";
import Section08_AIEndsPub from "@/sections/Section08_AIEndsPub";
import Section09_Takedowns from "@/sections/Section09_Takedowns";
import Section10_YouTube from "@/sections/Section10_YouTube";
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
        <main className="overflow-x-clip">
          <Section02_Spectrum />
          <SectionDivider />
          <Section03_ZoomedSegments />
          <SectionDivider />
          <Section03b_Funnel />
          <SectionDivider />
          <Section03c_Goals />
          <Section03d_Goal2 />
          <SectionDivider />
          <Section03e_Grassroots />
          <SectionDivider />
          <Section04_Comparisons />
          <SectionDivider />
          <Section04a_Strategies />
          <SectionDivider />
          <Section04b_Distribution />
          <Section04c_Platforms />
          <SectionDivider />
          <Section07_TheHub />
          <Section07b_ConversionJourney />
          <SectionDivider />
          <Section08_AIEndsPub />
          <SectionDivider />
          <Section09_Takedowns />
          <SectionDivider />
          <Section10_YouTube />
          <SectionDivider />
          <Section05_ConcernedSplit />
          <SectionDivider />
          <Section06_Conclusion />
        </main>
      </DistributionProvider>
    </VariationProvider>
  );
}
