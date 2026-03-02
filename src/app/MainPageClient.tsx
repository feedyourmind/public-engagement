"use client";

import { useCallback, useEffect } from "react";
import { VariationProvider, useVariation } from "@/context/VariationContext";
import { DistributionProvider } from "@/context/DistributionContext";
import { useVariationDisplay } from "@/context/VariationDisplayContext";
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
import Section10b_InfluencerDeals from "@/sections/Section10b_InfluencerDeals";
import Section11_WildExperiments from "@/sections/Section11_WildExperiments";
import type { VariationWithPresets, PresetRecord } from "@/types";

interface MainPageClientProps {
  variation: VariationWithPresets | null;
  allVariations: VariationWithPresets[];
  playgroundMode?: boolean;
  basePresets?: PresetRecord[];
}

function PageSections() {
  return (
    <>
      <SectionNav />
      <main className="overflow-x-clip">
        <div className="flex flex-col items-center px-4 pt-24 sm:pt-32 pb-8">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text text-center leading-tight tracking-tight mb-3">
            A Vision for Public Engagement
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-text-muted text-center max-w-2xl leading-relaxed">
            Maximize Impact in Raising Awareness of AI&nbsp;Risks
          </p>
        </div>
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
        <div className="h-[20vh]" />
        <SectionDivider />
        <Section08_AIEndsPub />
        <SectionDivider />
        <Section09_Takedowns />
        <SectionDivider />
        <Section10_YouTube />
        <SectionDivider />
        <Section11_WildExperiments />
        <SectionDivider />
        <Section10b_InfluencerDeals />
        <SectionDivider />
        <Section05_ConcernedSplit />
        <SectionDivider />
        <Section06_Conclusion />
      </main>
    </>
  );
}

/** Waits for playground localStorage to load, then renders with the active preset */
function PlaygroundGate() {
  const { playgroundReady, presets, activePresetId } = useVariation();
  const handleParamsChange = useCallback(() => {}, []);

  if (!playgroundReady) return null;

  const activePreset = presets.find((p) => p.id === activePresetId) ?? presets[0] ?? null;

  return (
    <DistributionProvider
      key={activePreset?.id ?? "none"}
      initialPreset={activePreset}
      onParamsChange={handleParamsChange}
    >
      <PageSections />
    </DistributionProvider>
  );
}

export default function MainPageClient({
  variation,
  allVariations,
  playgroundMode,
  basePresets,
}: MainPageClientProps) {
  const firstPreset = variation?.presets?.[0] ?? null;
  const { setVariationDisplayName } = useVariationDisplay();

  useEffect(() => {
    if (playgroundMode) {
      setVariationDisplayName("Playground");
    } else if (variation && !variation.isDefault) {
      setVariationDisplayName(variation.name);
    } else {
      setVariationDisplayName(null);
    }
    return () => setVariationDisplayName(null);
  }, [variation, playgroundMode, setVariationDisplayName]);

  // No-op for main page — debounced saves only happen on settings page
  const handleParamsChange = useCallback(() => {}, []);

  return (
    <VariationProvider
      key={playgroundMode ? "playground" : (variation?.slug ?? "default")}
      initialVariation={variation}
      initialAllVariations={allVariations}
      playgroundMode={playgroundMode}
      basePresets={basePresets}
    >
      {playgroundMode ? (
        <PlaygroundGate />
      ) : (
        <DistributionProvider
          initialPreset={firstPreset}
          onParamsChange={handleParamsChange}
        >
          <PageSections />
        </DistributionProvider>
      )}
    </VariationProvider>
  );
}
