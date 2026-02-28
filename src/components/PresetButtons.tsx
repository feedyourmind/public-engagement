"use client";

import { useDistribution } from "@/context/DistributionContext";
import { PRESETS } from "@/utils/presets";

export default function PresetButtons() {
  const { applyPreset } = useDistribution();

  return (
    <div className="flex gap-2 flex-wrap mb-5">
      {PRESETS.map((p) => (
        <button
          key={p.label}
          onClick={() => applyPreset(p)}
          className="px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-text/80 text-xs font-body cursor-pointer transition-all hover:bg-white/10 hover:text-white"
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
