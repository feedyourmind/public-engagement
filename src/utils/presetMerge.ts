import type { PresetRecord, EffectivePreset } from "@/types";

/**
 * Compute effective presets for a variation by merging Michael's base presets
 * with the variation's overrides and extras.
 *
 * - Base presets with no override → inherited ("base" kind), uses Michael's values
 * - Base presets with an override → "override" kind, uses the override's values
 * - Variation presets with no parentPresetId → "extra" kind (variation-only)
 */
export function computeEffectivePresets(
  basePresets: PresetRecord[],
  variationPresets: PresetRecord[],
): EffectivePreset[] {
  const overridesByParent = new Map<number, PresetRecord>();
  const extras: PresetRecord[] = [];

  for (const p of variationPresets) {
    if (p.parentPresetId != null) {
      overridesByParent.set(p.parentPresetId, p);
    } else {
      extras.push(p);
    }
  }

  const effective: EffectivePreset[] = basePresets.map((base) => {
    const override = overridesByParent.get(base.id);
    if (override) {
      return {
        ...override,
        inheritanceKind: "override" as const,
        basePresetId: base.id,
      };
    }
    return {
      ...base,
      inheritanceKind: "base" as const,
      basePresetId: base.id,
    };
  });

  for (const extra of extras) {
    effective.push({
      ...extra,
      inheritanceKind: "extra" as const,
      basePresetId: null,
    });
  }

  return effective;
}
