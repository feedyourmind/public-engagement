import type { PresetParams } from "@/types";
import { genCurve } from "./math";

const MATH_MIN = -1.5;
const MATH_MAX = 5;

/**
 * Linearly interpolate between two PresetParams at factor t (0..1).
 * t=0 returns `from`, t=1 returns `to`.
 */
export function interpolatePreset(
  from: PresetParams,
  to: PresetParams,
  t: number,
): PresetParams {
  const c = Math.max(0, Math.min(1, t));
  const lerp = (a: number, b: number) => a + (b - a) * c;

  return {
    loc: lerp(from.loc, to.loc),
    sc: lerp(from.sc, to.sc),
    sh: lerp(from.sh, to.sh),
    boundaries: from.boundaries.map((b, i) => lerp(b, to.boundaries[i] ?? b)),
    zoom: lerp(from.zoom, to.zoom),
    pan: lerp(from.pan, to.pan),
  };
}

/* ── Monotonic interpolation ────────────────────────────────────── */

/**
 * Build a cumulative distribution array from curve points.
 * Returns { xs, cdf } where cdf[i] = ∫[MATH_MIN..xs[i]] PDF dx / total.
 */
function buildCDF(
  curve: { x: number; y: number }[],
): { xs: Float64Array; cdf: Float64Array } {
  const n = curve.length;
  const xs = new Float64Array(n);
  const cdf = new Float64Array(n);

  xs[0] = curve[0].x;
  cdf[0] = 0;
  let cumulative = 0;

  for (let i = 1; i < n; i++) {
    const dx = curve[i].x - curve[i - 1].x;
    cumulative += 0.5 * (curve[i - 1].y + curve[i].y) * dx;
    xs[i] = curve[i].x;
    cdf[i] = cumulative;
  }

  // Normalize to [0, 1]
  const total = cumulative || 1;
  for (let i = 0; i < n; i++) cdf[i] /= total;

  return { xs, cdf };
}

/**
 * Binary search on pre-built CDF array to find x where CDF(x) ≈ target.
 */
function inverseCDF(
  xs: Float64Array,
  cdf: Float64Array,
  target: number,
): number {
  const t = Math.max(0, Math.min(1, target));
  let lo = 0;
  let hi = cdf.length - 1;

  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (cdf[mid] < t) lo = mid;
    else hi = mid;
  }

  const denom = cdf[hi] - cdf[lo];
  if (denom === 0) return xs[lo];
  const frac = (t - cdf[lo]) / denom;
  return xs[lo] + frac * (xs[hi] - xs[lo]);
}

/**
 * Compute cumulative CDF values at each boundary position for a preset.
 * Returns an array of 5 values in [0, 1] representing the cumulative
 * probability up to each boundary.
 */
export function computeCumulativeAreas(params: PresetParams): number[] {
  const curve = genCurve(params.loc, params.sc, params.sh, MATH_MIN, MATH_MAX, 300);
  const { xs, cdf } = buildCDF(curve);

  return params.boundaries.map((b) => {
    // Find CDF value at boundary b using linear interpolation
    if (b <= xs[0]) return 0;
    if (b >= xs[xs.length - 1]) return 1;

    let lo = 0;
    let hi = xs.length - 1;
    while (lo < hi - 1) {
      const mid = (lo + hi) >> 1;
      if (xs[mid] < b) lo = mid;
      else hi = mid;
    }
    const frac = (b - xs[lo]) / (xs[hi] - xs[lo] || 1);
    return cdf[lo] + frac * (cdf[hi] - cdf[lo]);
  });
}

/**
 * Monotonic interpolation between two presets.
 *
 * Curve shape params (loc, sc, sh) are interpolated linearly.
 * Boundary positions are computed via inverse CDF so that cumulative
 * probabilities interpolate linearly — guaranteeing that each segment
 * area changes monotonically from its reality value to its goal value.
 *
 * @param fromCumAreas  Pre-computed cumulative CDF values at `from` boundaries
 * @param toCumAreas    Pre-computed cumulative CDF values at `to` boundaries
 */
export function interpolatePresetMonotonic(
  from: PresetParams,
  to: PresetParams,
  t: number,
  fromCumAreas: number[],
  toCumAreas: number[],
): PresetParams {
  const c = Math.max(0, Math.min(1, t));
  const lerp = (a: number, b: number) => a + (b - a) * c;

  const loc = lerp(from.loc, to.loc);
  const sc = lerp(from.sc, to.sc);
  const sh = lerp(from.sh, to.sh);
  const zoom = lerp(from.zoom, to.zoom);
  const pan = lerp(from.pan, to.pan);

  // Generate curve with interpolated shape params
  const curve = genCurve(loc, sc, sh, MATH_MIN, MATH_MAX, 300);
  const { xs, cdf } = buildCDF(curve);

  // Linearly interpolate target cumulative probabilities at boundaries
  // then back-solve for boundary positions via inverse CDF
  const boundaries = fromCumAreas.map((fromCum, i) => {
    const targetCum = lerp(fromCum, toCumAreas[i]);
    return inverseCDF(xs, cdf, targetCum);
  });

  return { loc, sc, sh, boundaries, zoom, pan };
}
