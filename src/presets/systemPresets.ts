import realityRaw from "./reality.json";
import goalRaw from "./goal.json";
import type { PresetParams } from "@/types";

/** The current real-world distribution — used as the default everywhere. */
export const REALITY_PRESET: PresetParams = {
  loc: realityRaw.loc,
  sc: realityRaw.sc,
  sh: realityRaw.sh,
  boundaries: realityRaw.boundaries,
  zoom: 1.0,
  pan: 0,
};

/** The goal distribution Lethal Intelligence is working toward. */
export const GOAL_PRESET: PresetParams = {
  loc: goalRaw.loc,
  sc: goalRaw.sc,
  sh: goalRaw.sh,
  boundaries: goalRaw.boundaries,
  zoom: 1.0,
  pan: 0,
};
