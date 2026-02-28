"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { genCurve, integrate } from "@/utils/math";
import { SEGMENTS } from "@/utils/segments";
import defaultPreset from "@/presets/reality.json";
import type { CurvePoint, Segment } from "@/types";

interface DistributionState {
  location: number;
  scale: number;
  shape: number;
  boundaries: number[];
  curveData: CurvePoint[];
  yMax: number;
  segmentAreas: number[];
  segments: readonly Segment[];
  xMin: number;
  xMax: number;
  setLocation: (v: number) => void;
  setScale: (v: number) => void;
  setShape: (v: number) => void;
  setBoundary: (index: number, value: number) => void;
  applyPreset: (preset: {
    loc: number;
    sc: number;
    sh: number;
    boundaries: number[];
  }) => void;
  zoom: number;
  setZoom: (v: number) => void;
  pan: number;
  setPan: (v: number) => void;
  hoveredSegment: string | null;
  setHoveredSegment: (id: string | null) => void;
}

const DistributionContext = createContext<DistributionState | null>(null);

// Fixed range for math (integration, boundary clamping, segment areas)
const MATH_MIN = -1.5;
const MATH_MAX = 5;
// Default half-width at zoom=1
const VIEW_HALF = (MATH_MAX - MATH_MIN) / 2;
const DEFAULT_ZOOM = 1.0;
const STORAGE_KEY = "xrisk-chart-settings";

const DEFAULTS = {
  location: defaultPreset.loc,
  scale: defaultPreset.sc,
  shape: defaultPreset.sh,
  boundaries: defaultPreset.boundaries,
};

function loadSettings() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed.location === "number" &&
      typeof parsed.scale === "number" &&
      typeof parsed.shape === "number" &&
      Array.isArray(parsed.boundaries)
    ) {
      return parsed as typeof DEFAULTS & { zoom?: number; pan?: number };
    }
  } catch {}
  return null;
}

export function DistributionProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState(DEFAULTS.location);
  const [scale, setScale] = useState(DEFAULTS.scale);
  const [shape, setShape] = useState(DEFAULTS.shape);
  const [boundaries, setBoundaries] = useState([...DEFAULTS.boundaries]);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [pan, setPan] = useState(0);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const hydrated = useRef(false);

  // Compute the centroid (center of mass) of the curve to center zoom on it
  const baseCurve = useMemo(
    () => genCurve(location, scale, shape, MATH_MIN, MATH_MAX, 300),
    [location, scale, shape]
  );
  const centroid = useMemo(() => {
    let sumXY = 0, sumY = 0;
    for (const p of baseCurve) {
      sumXY += p.x * p.y;
      sumY += p.y;
    }
    return sumY > 0 ? sumXY / sumY : (MATH_MIN + MATH_MAX) / 2;
  }, [baseCurve]);

  // Visible range centered on centroid + pan offset, scaled by zoom
  const viewCenter = centroid + pan;
  const xMin = viewCenter - VIEW_HALF * zoom;
  const xMax = viewCenter + VIEW_HALF * zoom;

  // Restore from localStorage after hydration (avoids SSR mismatch)
  useEffect(() => {
    const saved = loadSettings();
    if (saved) {
      setLocation(saved.location);
      setScale(saved.scale);
      setShape(saved.shape);
      setBoundaries([...saved.boundaries]);
      if (typeof saved.zoom === "number") setZoom(saved.zoom);
      if (typeof saved.pan === "number") setPan(saved.pan);
    }
    hydrated.current = true;
  }, []);

  // Persist to localStorage on change (skip the initial hydration restore)
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ location, scale, shape, boundaries, zoom, pan })
      );
    } catch {}
  }, [location, scale, shape, boundaries, zoom, pan]);

  // Generate curve data covering visible range (may be wider than math range when zoomed out)
  const dataMin = Math.min(MATH_MIN, xMin);
  const dataMax = Math.max(MATH_MAX, xMax);
  const curveData = useMemo(
    () => genCurve(location, scale, shape, dataMin, dataMax, 600),
    [location, scale, shape, dataMin, dataMax]
  );

  const yMax = useMemo(
    () => Math.max(...curveData.map((p) => p.y)) * 1.15,
    [curveData]
  );

  const total = useMemo(
    () => integrate(curveData, MATH_MIN, MATH_MAX),
    [curveData]
  );

  const segmentAreas = useMemo(() => {
    const all = [MATH_MIN, ...boundaries, MATH_MAX];
    return SEGMENTS.map((_, i) => {
      const a = integrate(curveData, all[i], all[i + 1]);
      return total > 0 ? (a / total) * 100 : 0;
    });
  }, [curveData, boundaries, total]);

  const setBoundary = useCallback((idx: number, val: number) => {
    setBoundaries((prev) => {
      const n = [...prev];
      const lo = idx === 0 ? MATH_MIN + 0.05 : prev[idx - 1] + 0.05;
      const hi =
        idx === prev.length - 1 ? MATH_MAX - 0.05 : prev[idx + 1] - 0.05;
      n[idx] = Math.min(Math.max(val, lo), hi);
      return n;
    });
  }, []);

  const applyPreset = useCallback(
    (p: { loc: number; sc: number; sh: number; boundaries: number[] }) => {
      setLocation(p.loc);
      setScale(p.sc);
      setShape(p.sh);
      setBoundaries([...p.boundaries]);
    },
    []
  );

  const value: DistributionState = {
    location,
    scale,
    shape,
    boundaries,
    curveData,
    yMax,
    segmentAreas,
    segments: SEGMENTS,
    xMin,
    xMax,
    setLocation,
    setScale,
    setShape,
    setBoundary,
    applyPreset,
    zoom,
    setZoom,
    pan,
    setPan,
    hoveredSegment,
    setHoveredSegment,
  };

  return (
    <DistributionContext.Provider value={value}>
      {children}
    </DistributionContext.Provider>
  );
}

export function useDistribution() {
  const ctx = useContext(DistributionContext);
  if (!ctx)
    throw new Error(
      "useDistribution must be used within a DistributionProvider"
    );
  return ctx;
}
