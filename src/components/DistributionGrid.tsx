"use client";

import { useMemo, useState, useRef } from "react";
import { useDistribution } from "@/context/DistributionContext";

const TOTAL = 1000;
const COLS = 100;
const ROWS = 10;

interface DistributionGridProps {
  highlightSegmentId?: string;
  interactive?: boolean;
}

export default function DistributionGrid({
  highlightSegmentId,
  interactive = true,
}: DistributionGridProps) {
  const { segments, segmentAreas, hoveredSegment, setHoveredSegment } =
    useDistribution();

  const effectiveHighlight = highlightSegmentId ?? hoveredSegment;

  const gridRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    label: string;
    pct: string;
    x: number;
    y: number;
  } | null>(null);

  // Build flat array of 1000 segment indices based on percentages
  const squares = useMemo(() => {
    const counts = segmentAreas.map((pct) => Math.round((pct / 100) * TOTAL));
    // Fix rounding so total is exactly 1000
    let diff = TOTAL - counts.reduce((a, b) => a + b, 0);
    // Add/remove from the largest segment
    const largest = counts.indexOf(Math.max(...counts));
    counts[largest] += diff;

    const arr: number[] = [];
    segments.forEach((_, i) => {
      for (let j = 0; j < counts[i]; j++) arr.push(i);
    });
    return arr;
  }, [segmentAreas, segments]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!gridRef.current) return;
    const target = e.target as HTMLElement;
    const idx = target.dataset.seg;
    if (idx === undefined) {
      setTooltip(null);
      setHoveredSegment(null);
      return;
    }
    const segIdx = parseInt(idx);
    const seg = segments[segIdx];
    const rect = gridRef.current.getBoundingClientRect();
    setTooltip({
      label: seg.label,
      pct: segmentAreas[segIdx].toFixed(1) + "%",
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setHoveredSegment(seg.id);
  };

  const handleMouseLeave = () => {
    setTooltip(null);
    setHoveredSegment(null);
  };

  return (
    <div className="relative" ref={gridRef}>
      <div className="rounded-b-xl overflow-hidden bg-white">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          }}
          onMouseMove={interactive ? handleMouseMove : undefined}
          onMouseLeave={interactive ? handleMouseLeave : undefined}
        >
          {squares.map((segIdx, i) => {
            const seg = segments[segIdx];
            const isHovered = effectiveHighlight === seg.id;
            const isDimmed = effectiveHighlight !== null && !isHovered;
            return (
              <div
                key={i}
                data-seg={segIdx}
                className="aspect-square transition-opacity duration-150"
                style={{
                  backgroundColor: seg.color,
                  opacity: isDimmed ? 0.2 : isHovered ? 1 : 0.7,
                  border: "1px solid #fff",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Tooltip — outside overflow-hidden so it's never clipped */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 px-3 py-1.5 rounded-md bg-[#1a1a2e] text-white text-xs font-semibold shadow-lg whitespace-nowrap"
          style={{
            left: tooltip.x,
            top: tooltip.y - 40,
            transform: "translateX(-50%)",
          }}
        >
          {tooltip.label} — {tooltip.pct}
        </div>
      )}
    </div>
  );
}
