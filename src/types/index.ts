export interface CurvePoint {
  x: number;
  y: number;
}

export interface Segment {
  id: string;
  label: string;
  description: string;
  color: string;
  colorLight: string;
}

export interface Preset {
  label: string;
  loc: number;
  sc: number;
  sh: number;
  boundaries: number[];
}

export interface Annotation {
  x: number;
  label: string;
  color: string;
}

export interface ComparisonCurve {
  location: number;
  scale: number;
  shape: number;
  label: string;
  color: string;
  dashed: boolean;
}

export interface DistributionChartProps {
  highlightSegments?: string[];
  dimOtherSegments?: boolean;
  annotations?: Annotation[];
  comparisonCurve?: ComparisonCurve;
  showBoundaries?: boolean;
  showLabels?: boolean;
  interactive?: boolean;
  height?: number;
  className?: string;
}

/* ── Variation / Preset DB records ── */

export interface VariationRecord {
  id: number;
  name: string;
  slug: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PresetRecord {
  id: number;
  variationId: number;
  parentPresetId: number | null;
  label: string;
  sortOrder: number;
  loc: number;
  sc: number;
  sh: number;
  boundaries: number[];
  zoom: number;
  pan: number;
  createdAt: string;
  updatedAt: string;
}

export type InheritanceKind = "base" | "override" | "extra";

export interface EffectivePreset extends PresetRecord {
  inheritanceKind: InheritanceKind;
  basePresetId: number | null;
}

/** The set of parameters that get saved per preset (used in onParamsChange, savePresetParams, etc.) */
export interface PresetParams {
  loc: number;
  sc: number;
  sh: number;
  boundaries: number[];
  zoom: number;
  pan: number;
}

export interface VariationWithPresets extends VariationRecord {
  presets: PresetRecord[];
}
