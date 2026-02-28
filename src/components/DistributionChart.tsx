"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useDistribution } from "@/context/DistributionContext";
import { genCurve } from "@/utils/math";
import type { DistributionChartProps } from "@/types";

const W = 900;
const H = 380;
const PAD = { top: 30, right: 30, bottom: 50, left: 20 };
const CW = W - PAD.left - PAD.right;
const CH = H - PAD.top - PAD.bottom;

export default function DistributionChart({
  highlightSegments,
  dimOtherSegments = false,
  annotations,
  comparisonCurve,
  showBoundaries = true,
  showLabels = true,
  interactive = true,
  height,
  className = "",
}: DistributionChartProps) {
  const {
    curveData,
    segments,
    boundaries,
    xMin,
    xMax,
    yMax,
    setBoundary,
    hoveredSegment: hovered,
    setHoveredSegment: setHovered,
  } = useDistribution();

  const ref = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<number | null>(null);

  const sx = useCallback(
    (x: number) => PAD.left + ((x - xMin) / (xMax - xMin)) * CW,
    [xMin, xMax]
  );
  const sy = useCallback(
    (y: number) => PAD.top + CH - (y / yMax) * CH,
    [yMax]
  );

  // Main curve path
  const curvePath = useMemo(
    () =>
      curveData
        .map(
          (p, i) =>
            `${i === 0 ? "M" : "L"}${sx(p.x).toFixed(2)},${sy(p.y).toFixed(2)}`
        )
        .join(" "),
    [curveData, sx, sy]
  );

  // Comparison curve path
  const comparisonPath = useMemo(() => {
    if (!comparisonCurve) return null;
    const data = genCurve(
      comparisonCurve.location,
      comparisonCurve.scale,
      comparisonCurve.shape,
      xMin,
      xMax,
      600
    );
    return data
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"}${sx(p.x).toFixed(2)},${sy(p.y).toFixed(2)}`
      )
      .join(" ");
  }, [comparisonCurve, sx, sy, xMin, xMax]);

  // Segment fills
  const fills = useMemo(() => {
    const all = [xMin, ...boundaries, xMax];
    return segments.map((seg, i) => {
      const s = all[i],
        e = all[i + 1];
      const pts = curveData.filter((p) => p.x >= s && p.x <= e);
      if (pts.length < 2) return null;
      const path =
        `M${sx(pts[0].x).toFixed(2)},${sy(0)} ` +
        pts
          .map((p) => `L${sx(p.x).toFixed(2)},${sy(p.y).toFixed(2)}`)
          .join(" ") +
        ` L${sx(pts[pts.length - 1].x).toFixed(2)},${sy(0)} Z`;
      return { ...seg, path, s, e, idx: i };
    });
  }, [segments, boundaries, curveData, sx, sy, xMin, xMax]);

  // Determine segment opacity
  const getSegmentOpacity = (segId: string) => {
    if (highlightSegments && dimOtherSegments) {
      return highlightSegments.includes(segId) ? 1 : 0.15;
    }
    if (hovered) {
      return hovered === segId ? 1 : 0.35;
    }
    return 1;
  };

  const getSegmentFill = (segId: string, color: string, colorLight: string) => {
    if (highlightSegments?.includes(segId)) return color;
    if (hovered === segId) return color;
    return colorLight;
  };

  // Drag handlers
  const onDown = (i: number) => (ev: React.MouseEvent) => {
    if (!interactive) return;
    ev.preventDefault();
    setDrag(i);
  };

  const onMove = useCallback(
    (ev: React.MouseEvent) => {
      if (drag === null || !ref.current || !interactive) return;
      const r = ref.current.getBoundingClientRect();
      const mx = (ev.clientX - r.left) * (W / r.width);
      setBoundary(drag, xMin + ((mx - PAD.left) / CW) * (xMax - xMin));
    },
    [drag, xMin, xMax, setBoundary, interactive]
  );

  const onUp = useCallback(() => setDrag(null), []);

  return (
    <div
      className={`bg-chart-bg rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.35)] ${className}`}
      style={{ padding: "24px 16px 12px" }}
    >
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full block"
        style={{ height: height ? `${height}px` : "auto" }}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        aria-label="AI X-Risk Distribution Chart"
      >
        {/* Full-column hit areas for hover (invisible, covers entire column height) */}
        {fills.map(
          (f) =>
            f && (
              <rect
                key={f.id + "_hit"}
                x={sx(f.s)}
                y={PAD.top}
                width={sx(f.e) - sx(f.s)}
                height={sy(0) - PAD.top}
                fill="transparent"
                style={{ cursor: interactive ? "pointer" : "default" }}
                onMouseEnter={() => !highlightSegments && setHovered(f.id)}
                onMouseLeave={() => !highlightSegments && setHovered(null)}
              />
            )
        )}

        {/* Segment fills */}
        {fills.map(
          (f) =>
            f && (
              <motion.path
                key={f.id}
                d={f.path}
                fill={getSegmentFill(f.id, f.color, f.colorLight)}
                stroke="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: getSegmentOpacity(f.id) }}
                transition={{ duration: 0.4 }}
                style={{ cursor: interactive ? "pointer" : "default", pointerEvents: "none" }}
              />
            )
        )}

        {/* Main curve */}
        <motion.path
          d={curvePath}
          fill="none"
          stroke="#1a1a2e"
          strokeWidth="2.5"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Comparison curve */}
        {comparisonPath && comparisonCurve && (
          <motion.path
            d={comparisonPath}
            fill="none"
            stroke={comparisonCurve.color}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeDasharray={comparisonCurve.dashed ? "8,6" : undefined}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
          />
        )}

        {/* X axis */}
        <line
          x1={sx(xMin)}
          y1={sy(0)}
          x2={sx(xMax)}
          y2={sy(0)}
          stroke="#555"
          strokeWidth="1"
        />

        {/* Axis labels */}
        <text
          x={sx(xMin) + 10}
          y={sy(0) + 38}
          textAnchor="start"
          fill="#888"
          fontSize="11"
          fontFamily="var(--font-dm-sans), sans-serif"
        >
          Zero Risk
        </text>
        <text
          x={sx(xMax) - 10}
          y={sy(0) + 38}
          textAnchor="end"
          fill="#888"
          fontSize="11"
          fontFamily="var(--font-dm-sans), sans-serif"
        >
          Existential Risk
        </text>
        <text
          x={sx((xMin + xMax) / 2)}
          y={sy(0) + 38}
          textAnchor="middle"
          fill="#aaa"
          fontSize="10"
          fontFamily="var(--font-dm-sans), sans-serif"
        >
          Perceived Level of AI Risk →
        </text>

        {/* Boundaries */}
        {showBoundaries &&
          boundaries.map((bx, i) => {
            const px = sx(bx);
            return (
              <g
                key={i}
                style={{ cursor: interactive ? "ew-resize" : "default" }}
                onMouseDown={onDown(i)}
              >
                <line
                  x1={px}
                  y1={PAD.top}
                  x2={px}
                  y2={sy(0)}
                  stroke="#1a1a2e"
                  strokeWidth="1.5"
                  strokeDasharray="6,4"
                  opacity="0.5"
                />
                {interactive && (
                  <circle
                    cx={px}
                    cy={sy(0)}
                    r="6"
                    fill="#1a1a2e"
                    stroke="#fff"
                    strokeWidth="2"
                    opacity="0.9"
                  />
                )}
              </g>
            );
          })}

        {/* Segment labels — constrained to column boundaries, wrapping when narrow */}
        {showLabels &&
          fills.map((f) => {
            if (!f) return null;
            const colLeft = sx(f.s);
            const colRight = sx(f.e);
            const colWidth = colRight - colLeft;
            const midX = (f.s + f.e) / 2;
            const midPt = curveData.reduce(
              (b, p) => (Math.abs(p.x - midX) < Math.abs(b.x - midX) ? p : b),
              curveData[0]
            );
            // Stagger labels across 3 height levels so adjacent ones never overlap
            const level = f.idx % 3;
            const staggerOffset = level * 20;
            const baseY = Math.min(sy(midPt.y * 0.35), sy(0) - 65);
            const labelY = baseY + staggerOffset;
            const isActive = hovered === f.id || highlightSegments?.includes(f.id);
            return (
              <foreignObject
                key={f.id + "_l"}
                x={colLeft}
                y={labelY - 6}
                width={colWidth}
                height={50}
                style={{ pointerEvents: "none", overflow: "visible" }}
              >
                <div
                  style={{
                    textAlign: "center",
                    color: isActive ? "#1a1a2e" : f.color,
                    fontSize: "8px",
                    fontWeight: 700,
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                    lineHeight: 1.3,
                    wordWrap: "break-word",
                    overflowWrap: "normal",
                    wordBreak: "keep-all",
                    opacity: getSegmentOpacity(f.id) * 0.85,
                    padding: "0 3px",
                    textShadow: isActive
                      ? "0 0 3px rgba(255,255,255,0.9), 0 0 6px rgba(255,255,255,0.5)"
                      : "none",
                  }}
                >
                  {f.label}
                </div>
              </foreignObject>
            );
          })}

        {/* Annotations */}
        {annotations?.map((ann, i) => {
          const px = sx(ann.x);
          return (
            <g key={`ann-${i}`}>
              <line
                x1={px}
                y1={PAD.top}
                x2={px}
                y2={sy(0)}
                stroke={ann.color}
                strokeWidth="1.5"
                strokeDasharray="4,3"
                opacity="0.7"
              />
              <text
                x={px}
                y={PAD.top - 8}
                textAnchor="middle"
                fill={ann.color}
                fontSize="10"
                fontWeight="600"
                fontFamily="var(--font-dm-sans), sans-serif"
              >
                {ann.label}
              </text>
            </g>
          );
        })}

        {/* Comparison curve label */}
        {comparisonCurve && (
          <text
            x={W - PAD.right - 10}
            y={PAD.top + 16}
            textAnchor="end"
            fill={comparisonCurve.color}
            fontSize="10"
            fontWeight="600"
            fontFamily="var(--font-dm-sans), sans-serif"
          >
            {comparisonCurve.label}
          </text>
        )}
      </svg>
    </div>
  );
}
