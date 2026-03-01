import type { PresetParams } from "@/types";

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
