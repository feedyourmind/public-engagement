"use client";

import { useRef, useEffect, useMemo, useCallback } from "react";
import { type MotionValue, useMotionValueEvent } from "framer-motion";
import type { Segment } from "@/types";
import {
  computeGridPositions,
  computeFunnelPositions,
  computeSquareSegments,
  easeInOutCubic,
  type FunnelDimensions,
  DEFAULT_FUNNEL,
} from "@/utils/funnelLayout";

const TOTAL = 1000;
const GAP = 1;

interface FunnelCanvasProps {
  segments: readonly Segment[];
  segmentAreas: number[];
  morphProgress: MotionValue<number>;
  width?: number;
  height?: number;
  funnel?: FunnelDimensions;
}

export default function FunnelCanvas({
  segments,
  segmentAreas,
  morphProgress,
  width = 600,
  height = 500,
  funnel = DEFAULT_FUNNEL,
}: FunnelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);

  const segMap = useMemo(() => computeSquareSegments(segmentAreas), [segmentAreas]);
  const colors = useMemo(() => segments.map((s) => s.color), [segments]);

  const gridPos = useMemo(
    () => computeGridPositions(width, height),
    [width, height]
  );

  // Funnel positions + auto-computed cell size
  const funnelPos = useMemo(
    () => computeFunnelPositions(segmentAreas, width, height, funnel),
    [segmentAreas, width, height, funnel]
  );

  const draw = useCallback(
    (progress: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const w = width * dpr;
      const h = height * dpr;

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.scale(dpr, dpr);

      const easedProgress = easeInOutCubic(Math.max(0, Math.min(1, progress)));

      // Interpolate cell size: grid cells → funnel cells (auto-computed)
      const gridCell = gridPos.cellSize;
      const funnelCell = funnelPos.cellSize;
      const currentCell = gridCell + (funnelCell - gridCell) * easedProgress;
      const drawSize = Math.max(1, currentCell - GAP);

      // Draw funnel border — full funnel height
      if (easedProgress > 0.05) {
        const borderAlpha = Math.min(easedProgress * 2, 0.4);
        const cxOffset = (width - funnel.centerX * 2) / 2;
        const cx = cxOffset + funnel.centerX;
        const funnelBottom = funnel.topY + funnel.height;

        const topHalf = funnel.topWidth / 2;
        const bottomHalf = funnel.bottomWidth / 2;

        ctx.strokeStyle = `rgba(255, 255, 255, ${borderAlpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - topHalf, funnel.topY);
        ctx.lineTo(cx - bottomHalf, funnelBottom);
        ctx.lineTo(cx + bottomHalf, funnelBottom);
        ctx.lineTo(cx + topHalf, funnel.topY);
        ctx.closePath();
        ctx.stroke();
      }

      // Draw 1000 squares — interpolate position and size
      for (let i = 0; i < TOTAL; i++) {
        const x = gridPos.x[i] + (funnelPos.x[i] - gridPos.x[i]) * easedProgress;
        const y = gridPos.y[i] + (funnelPos.y[i] - gridPos.y[i]) * easedProgress;

        ctx.fillStyle = colors[segMap[i]];
        ctx.fillRect(x, y, drawSize, drawSize);
      }

      ctx.restore();
    },
    [gridPos, funnelPos, segMap, colors, width, height, funnel]
  );

  useEffect(() => {
    draw(progressRef.current);
  }, [draw]);

  useEffect(() => {
    const mq = window.matchMedia(
      `(resolution: ${window.devicePixelRatio}dppx)`
    );
    const handler = () => draw(progressRef.current);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [draw]);

  useMotionValueEvent(morphProgress, "change", (v) => {
    progressRef.current = v;
    draw(v);
  });

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      className="block"
    />
  );
}
