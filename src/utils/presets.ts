import type { Preset } from "@/types";
import reality from "@/presets/reality.json";
import tpotPerception from "@/presets/tpot-perception.json";
import aiSafetyCommunity from "@/presets/ai-safety-community.json";
import techOptimists from "@/presets/tech-optimists.json";

export const PRESETS: readonly Preset[] = [
  { label: "Reality", ...reality },
  { label: "TPOT Perception", ...tpotPerception },
  { label: "AI Safety Community", ...aiSafetyCommunity },
  { label: "Tech Optimists", ...techOptimists },
];
