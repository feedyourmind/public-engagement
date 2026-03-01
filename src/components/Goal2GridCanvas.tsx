"use client";

import { useRef, useEffect, useMemo, useCallback } from "react";
import { type MotionValue, useMotionValueEvent } from "framer-motion";
import type { Segment } from "@/types";
import { computeSquareSegments } from "@/utils/funnelLayout";

const TOTAL = 1000;
const COLS = 100;
const GAP = 1;

interface Goal2GridCanvasProps {
  segments: readonly Segment[];
  segmentAreas: number[];
  morphProgress: MotionValue<number>;
  width: number;
  height: number;
}

export default function Goal2GridCanvas({
  segments,
  segmentAreas,
  morphProgress,
  width,
  height,
}: Goal2GridCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const segMap = useMemo(
    () => computeSquareSegments(segmentAreas),
    [segmentAreas],
  );
  const colors = useMemo(() => segments.map((s) => s.color), [segments]);

  const draw = useCallback(() => {
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

    const cellSize = width / COLS;
    const drawSize = Math.max(1, cellSize - GAP);

    for (let i = 0; i < TOTAL; i++) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const x = col * cellSize;
      const y = row * cellSize;

      ctx.fillStyle = colors[segMap[i]];
      ctx.fillRect(x, y, drawSize, drawSize);
    }

    ctx.restore();
  }, [width, height, segMap, colors]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const mq = window.matchMedia(
      `(resolution: ${window.devicePixelRatio}dppx)`,
    );
    const handler = () => draw();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [draw]);

  useMotionValueEvent(morphProgress, "change", () => {
    draw();
  });

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      className="block"
    />
  );
}
