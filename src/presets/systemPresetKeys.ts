import type { PresetParams } from "@/types";

/**
 * System preset keys — the labels used to identify presets in the database.
 * Code uses these keys to look up preset values from context.
 * ALL values come from the database; only the keys are defined here.
 */
export const SYSTEM_PRESET_KEYS = {
  REALITY: "Reality",
  TPOT_PERCEPTION: "TPOT Perception",
  AI_SAFETY_COMMUNITY: "AI Safety Community",
  TECH_OPTIMISTS: "Tech Optimists",
  GOAL: "Goal",
} as const;

export type SystemPresetKey =
  (typeof SYSTEM_PRESET_KEYS)[keyof typeof SYSTEM_PRESET_KEYS];

/**
 * Emergency fallbacks — used ONLY when the database is completely unreachable.
 * The database is the source of truth. Do NOT use these as defaults elsewhere.
 * If you need to update preset values, update them in the database.
 */
export const FALLBACK_PRESET_VALUES: Record<SystemPresetKey, PresetParams> = {
  [SYSTEM_PRESET_KEYS.REALITY]: {
    loc: 0.35,
    sc: 0.68,
    sh: 5.5,
    boundaries: [0.41076509987603843, 0.6199643742994642, 1.2020840944342144, 1.6326101374505397, 2.163188007365026],
    zoom: 1.0,
    pan: 0,
  },
  [SYSTEM_PRESET_KEYS.TPOT_PERCEPTION]: {
    loc: 1.2,
    sc: 0.9,
    sh: 1.5,
    boundaries: [-0.2, 0.5, 1.2, 1.8, 2.8],
    zoom: 1.0,
    pan: 0,
  },
  [SYSTEM_PRESET_KEYS.AI_SAFETY_COMMUNITY]: {
    loc: 0.5,
    sc: 1.4,
    sh: 0.0,
    boundaries: [-0.6, 0.2, 0.8, 1.4, 2.0],
    zoom: 1.0,
    pan: 0,
  },
  [SYSTEM_PRESET_KEYS.TECH_OPTIMISTS]: {
    loc: -0.2,
    sc: 0.5,
    sh: 8.0,
    boundaries: [-0.3, 0.3, 0.9, 1.4, 2.0],
    zoom: 1.0,
    pan: 0,
  },
  [SYSTEM_PRESET_KEYS.GOAL]: {
    loc: 1.4,
    sc: 0.9,
    sh: 1.5,
    boundaries: [0.15, 0.40, 0.85, 1.45, 2.30],
    zoom: 1.0,
    pan: 0,
  },
};
