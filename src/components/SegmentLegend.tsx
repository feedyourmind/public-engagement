"use client";

import { useDistribution } from "@/context/DistributionContext";

export default function SegmentLegend() {
  const { segments, segmentAreas, hoveredSegment: hovered, setHoveredSegment: setHovered } = useDistribution();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-6">
      {segments.map((seg, i) => (
        <div
          key={seg.id}
          onMouseEnter={() => setHovered(seg.id)}
          onMouseLeave={() => setHovered(null)}
          className="rounded-xl p-4 cursor-pointer transition-all duration-300"
          style={{
            background:
              hovered === seg.id
                ? "rgba(255,255,255,0.08)"
                : "rgba(255,255,255,0.03)",
            border: `1px solid ${hovered === seg.id ? seg.color : "rgba(255,255,255,0.06)"}`,
            opacity: hovered && hovered !== seg.id ? 0.4 : 1,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-sm shrink-0"
              style={{ background: seg.color }}
            />
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: seg.color }}
            >
              {seg.label}
            </span>
          </div>
          <div className="font-mono text-2xl font-medium text-text mb-1.5">
            {segmentAreas[i].toFixed(1)}%
          </div>
          <p className="text-xs text-text-dim leading-relaxed m-0">
            {seg.description}
          </p>
        </div>
      ))}
    </div>
  );
}
