"use client";

import ComparisonChart from "@/components/TPotChart";
import { useVariation } from "@/context/VariationContext";
import {
  SYSTEM_PRESET_KEYS,
  FALLBACK_PRESET_VALUES,
} from "@/presets/systemPresetKeys";
import type { PresetParams } from "@/types";

function presetToParams(preset: { loc: number; sc: number; sh: number; boundaries: number[]; zoom: number; pan: number } | null, key: keyof typeof FALLBACK_PRESET_VALUES): PresetParams {
  if (preset) return { loc: preset.loc, sc: preset.sc, sh: preset.sh, boundaries: preset.boundaries, zoom: preset.zoom, pan: preset.pan };
  return FALLBACK_PRESET_VALUES[key];
}

export default function Section04_Comparisons() {
  const { getPresetByKey } = useVariation();

  const realityParams = presetToParams(getPresetByKey(SYSTEM_PRESET_KEYS.REALITY), SYSTEM_PRESET_KEYS.REALITY);
  const tpotParams = presetToParams(getPresetByKey(SYSTEM_PRESET_KEYS.TPOT_PERCEPTION), SYSTEM_PRESET_KEYS.TPOT_PERCEPTION);
  const aiSafetyParams = presetToParams(getPresetByKey(SYSTEM_PRESET_KEYS.AI_SAFETY_COMMUNITY), SYSTEM_PRESET_KEYS.AI_SAFETY_COMMUNITY);

  return (
    <div id="comparisons">
      {/* Intro heading and TPOT explanatory text — normal flow */}
      <div className="relative z-10 px-4 sm:px-8 lg:px-16 pt-0 pb-0 max-w-5xl mx-auto">
        <div className="mb-6">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text mb-1">
            Perceptions Disconnect
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            Comparing perspectives: the same distribution looks different through
            different lenses.
          </p>
        </div>


        <div id="comparisons-tpot">
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-text mb-1">
            TPOT{" "}
            <span className="text-text-muted font-normal text-base">
              (this part of Twitter)
            </span>
          </h3>
          <p className="text-sm text-text-muted leading-relaxed mb-2">
            A few thousand smart people spend their days in a filter-bubble,
            preaching to the choir about how powerful AI is, how disruptive
            this technology will be, how it will reshape everything. We
            assume this is just general knowledge — that everyone sees
            what&apos;s coming.
          </p>
          <p className="text-sm text-text-muted leading-relaxed mb-6">
            In reality, the vast majority of people{" "}
            <span className="font-bold text-text">have no idea</span>.
            They know something is happening with AI, but they think
            it&apos;s a glorified search engine and a fun trick for generating
            fake videos.
          </p>
          <p className="text-sm text-text-muted leading-relaxed">
            They don&apos;t realize it&apos;s about to
            completely disrupt all human value, human labor, and human
            decision-making. (Exposure to Reddit or just touching grass and
            speaking to &ldquo;normies&rdquo; makes this very obvious — we
            basically live in a different reality.)
          </p>
        </div>
      </div>

      {/* Sticky TPOT chart — self-contained scroll section */}
      <ComparisonChart
        realityParams={realityParams}
        comparisonParams={tpotParams}
        titleMain="TPOT"
        titlePart1="What everyone really thinks"
        titlePart2="vs. what TPOT thinks everyone thinks"
        accentColor="#3b82f6"
        comparisonLabel="TPOT Perception"
      />

      {/* AI Safety Community text — normal flow */}
      <div className="relative z-10 px-4 sm:px-8 lg:px-16 pt-0 pb-0 max-w-5xl mx-auto">
        <div id="comparisons-aisafety">
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-text mb-1">
            AI Safety Community
          </h3>
          <p className="text-sm text-text-muted leading-relaxed mb-2">
            If TPOT lives in a bubble, the AI safety community lives in
            a bunker. Most volunteers at AI Safety organizations
            live and breath AI Risk. They&apos;ve read the papers, they&apos;ve run the scenarios,
            and they&apos;re genuinely terrified.
          </p>
          <p className="text-sm text-text-muted leading-relaxed mb-6">
            The problem? To the average person on the street, they look like{" "}
conspiracy theorists. <span className="font-bold text-text">Tinfoil-hat</span> types warning about a robot apocalypse.
            The disconnect between how safety advocates see themselves — as
            informed, rational people sounding a necessary alarm — and how
            the public sees them is{" "}
            <span className="font-bold text-text">staggering</span>.
          </p>
          <p className="text-sm text-text-muted leading-relaxed">
            Most people don&apos;t even know these movements exist. And when
            they do encounter the message, the framing feels so alien to their
            everyday experience that it gets dismissed outright. This isn&apos;t
            a knowledge problem — it&apos;s a{" "}
            <span className="font-bold text-text">communication chasm</span>.
          </p>
        </div>
      </div>

      {/* Sticky AI Safety Community chart — self-contained scroll section */}
      <ComparisonChart
        realityParams={realityParams}
        comparisonParams={aiSafetyParams}
        titleMain="AI Safety"
        titlePart1="What everyone really thinks"
        titlePart2="vs. what AI Safety thinks everyone thinks"
        accentColor="#8b5cf6"
        comparisonLabel="AI Safety Community"
      />

    </div>
  );
}
