"use client";

import { useDistribution } from "@/context/DistributionContext";
import Panel from "./Panel";

export default function BoundaryControls() {
  const { boundaries, segments, segmentAreas, setBoundary, xMin, xMax } =
    useDistribution();

  return (
    <Panel title="Segment Boundaries" defaultOpen={true}>
      <p className="text-xs text-text-dim mb-3.5 mt-0">
        Move each boundary to resize adjacent segments. Slide right to shrink
        the left segment and grow the right.
      </p>
      {boundaries.map((b, i) => {
        const left = segments[i];
        const right = segments[i + 1];
        const min = i === 0 ? xMin + 0.05 : boundaries[i - 1] + 0.05;
        const max =
          i === boundaries.length - 1
            ? xMax - 0.05
            : boundaries[i + 1] - 0.05;

        return (
          <div
            key={i}
            className="p-2.5 px-3.5 bg-white/[0.02] rounded-xl border border-white/[0.06] mb-2"
          >
            <div className="flex justify-between items-center mb-1.5 flex-wrap gap-1">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ background: left.color }}
                />
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: left.color }}
                >
                  {left.label}
                </span>
                <span className="text-[10px] text-text-dim">←</span>
                <span className="text-[11px] font-mono text-text-muted/60">
                  B{i + 1}
                </span>
                <span className="text-[10px] text-text-dim">→</span>
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: right.color }}
                >
                  {right.label}
                </span>
                <div
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ background: right.color }}
                />
              </div>
              <span className="text-[11px] font-mono text-text-muted/80">
                {b.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              step={0.02}
              value={b}
              onChange={(e) => setBoundary(i, parseFloat(e.target.value))}
              className="w-full"
              style={{ accentColor: "#777" }}
            />
            <div className="flex justify-between mt-1">
              <span
                className="text-[10px] font-mono"
                style={{ color: left.color }}
              >
                {segmentAreas[i].toFixed(1)}%
              </span>
              <span
                className="text-[10px] font-mono"
                style={{ color: right.color }}
              >
                {segmentAreas[i + 1].toFixed(1)}%
              </span>
            </div>
          </div>
        );
      })}
    </Panel>
  );
}
