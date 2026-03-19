"use client";

import { Fragment, useCallback, useEffect } from "react";
import { VariationProvider, useVariation } from "@/context/VariationContext";
import { DistributionProvider } from "@/context/DistributionContext";
import { useVariationDisplay } from "@/context/VariationDisplayContext";
import SectionNav from "@/components/SectionNav";
import SectionDivider from "@/components/SectionDivider";
import { SECTION_REGISTRY, type SectionEntry } from "@/config/sections";
import type { ViewConfig } from "@/config/views";
import type { VariationWithPresets, PresetRecord } from "@/types";

interface MainPageClientProps {
  variation: VariationWithPresets | null;
  allVariations: VariationWithPresets[];
  playgroundMode?: boolean;
  basePresets?: PresetRecord[];
  viewConfig?: ViewConfig | null;
}

function getSections(viewConfig?: ViewConfig | null): SectionEntry[] {
  if (!viewConfig) return SECTION_REGISTRY;
  return viewConfig.sections
    .map((key) => SECTION_REGISTRY.find((s) => s.key === key))
    .filter((s): s is SectionEntry => s != null);
}

function PageSections({ viewConfig }: { viewConfig?: ViewConfig | null }) {
  const sections = getSections(viewConfig);
  const title = viewConfig?.title ?? "A Vision for Public Engagement";
  const subtitle =
    viewConfig?.subtitle ?? "Maximize Impact in Raising Awareness of AI\u00a0Risks";

  return (
    <>
      <SectionNav sections={sections} />
      <main className="overflow-x-clip">
        <div id="top" className="flex flex-col items-center px-4 pt-24 sm:pt-32 pb-8">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text text-center leading-tight tracking-tight mb-3">
            {title}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-text-muted text-center max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </div>
        {sections.map((entry, i) => (
          <Fragment key={entry.key}>
            {i > 0 && entry.hasDividerBefore && <SectionDivider />}
            <entry.component />
          </Fragment>
        ))}
      </main>
    </>
  );
}

/** Waits for playground localStorage to load, then renders with the active preset */
function PlaygroundGate({ viewConfig }: { viewConfig?: ViewConfig | null }) {
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
      <PageSections viewConfig={viewConfig} />
    </DistributionProvider>
  );
}

export default function MainPageClient({
  variation,
  allVariations,
  playgroundMode,
  basePresets,
  viewConfig,
}: MainPageClientProps) {
  const firstPreset = variation?.presets?.[0] ?? null;
  const { setVariationDisplayName, setIsPlaygroundView } = useVariationDisplay();

  useEffect(() => {
    if (playgroundMode) {
      setVariationDisplayName("Playground");
      setIsPlaygroundView(true);
    } else if (variation && !variation.isDefault) {
      setVariationDisplayName(variation.name);
      setIsPlaygroundView(false);
    } else {
      setVariationDisplayName(null);
      setIsPlaygroundView(false);
    }
    return () => {
      setVariationDisplayName(null);
      setIsPlaygroundView(false);
    };
  }, [variation, playgroundMode, setVariationDisplayName, setIsPlaygroundView]);

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
        <PlaygroundGate viewConfig={viewConfig} />
      ) : (
        <DistributionProvider
          initialPreset={firstPreset}
          onParamsChange={handleParamsChange}
        >
          <PageSections viewConfig={viewConfig} />
        </DistributionProvider>
      )}
    </VariationProvider>
  );
}
