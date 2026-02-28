import type { CurvePoint } from "@/types";

export function erf(x: number): number {
  const a1 = 0.254829592,
    a2 = -0.284496736,
    a3 = 1.421413741;
  const a4 = -1.453152027,
    a5 = 1.061405429,
    p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  const t = 1.0 / (1.0 + p * Math.abs(x));
  const y =
    1.0 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

export function normalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

export function normalCDF(x: number): number {
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

export function skewNormalPDF(
  x: number,
  location: number,
  scale: number,
  shape: number
): number {
  const z = (x - location) / scale;
  return (2 / scale) * normalPDF(z) * normalCDF(shape * z);
}

export function genCurve(
  location: number,
  scale: number,
  shape: number,
  xMin: number,
  xMax: number,
  steps: number = 600
): CurvePoint[] {
  const data: CurvePoint[] = [];
  const dx = (xMax - xMin) / steps;
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    data.push({ x, y: skewNormalPDF(x, location, scale, shape) });
  }
  return data;
}

export function integrate(
  data: CurvePoint[],
  a: number,
  b: number
): number {
  let s = 0;
  for (let i = 1; i < data.length; i++) {
    const x0 = data[i - 1].x,
      y0 = data[i - 1].y,
      x1 = data[i].x,
      y1 = data[i].y;
    if (x1 < a || x0 > b) continue;
    const ca = Math.max(x0, a),
      cb = Math.min(x1, b);
    if (cb <= ca) continue;
    const ta = (ca - x0) / (x1 - x0),
      tb = (cb - x0) / (x1 - x0);
    s += 0.5 * (y0 + ta * (y1 - y0) + y0 + tb * (y1 - y0)) * (cb - ca);
  }
  return s;
}
