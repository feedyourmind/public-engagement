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
import {
  FALLBACK_PRESET_VALUES,
  SYSTEM_PRESET_KEYS,
} from "@/presets/systemPresetKeys";
import type { CurvePoint, Segment, PresetParams } from "@/types";

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
  applyPreset: (preset: PresetParams) => void;
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

const FALLBACK_DEFAULTS: PresetParams =
  FALLBACK_PRESET_VALUES[SYSTEM_PRESET_KEYS.REALITY];

interface DistributionProviderProps {
  children: ReactNode;
  initialPreset?: PresetParams | null;
  onParamsChange?: (params: PresetParams) => void;
}

export function DistributionProvider({
  children,
  initialPreset,
  onParamsChange,
}: DistributionProviderProps) {
  const init = initialPreset ?? FALLBACK_DEFAULTS;

  const [location, setLocation] = useState(init.loc);
  const [scale, setScale] = useState(init.sc);
  const [shape, setShape] = useState(init.sh);
  const [boundaries, setBoundaries] = useState([...init.boundaries]);
  const [zoom, setZoom] = useState(init.zoom ?? DEFAULT_ZOOM);
  const [pan, setPan] = useState(init.pan ?? 0);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  // Track whether this is the first render to avoid triggering onParamsChange
  const isFirstRender = useRef(true);

  // Notify parent (VariationContext) when curve params change, for debounced DB save
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onParamsChange?.({ loc: location, sc: scale, sh: shape, boundaries, zoom, pan });
  }, [location, scale, shape, boundaries, zoom, pan]); // eslint-disable-line react-hooks/exhaustive-deps

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
    (p: PresetParams) => {
      setLocation(p.loc);
      setScale(p.sc);
      setShape(p.sh);
      setBoundaries([...p.boundaries]);
      if (p.zoom != null) setZoom(p.zoom);
      if (p.pan != null) setPan(p.pan);
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
