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
