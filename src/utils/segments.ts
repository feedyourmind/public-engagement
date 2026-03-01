import type { Segment } from "@/types";

export const SEGMENTS: readonly Segment[] = [
  {
    id: "dismissive",
    label: "Dismissive",
    description:
      "AI risk is essentially zero — technology is neutral or inherently beneficial.",
    color: "#2d6a4f",
    colorLight: "rgba(45,106,79,0.25)",
  },
  {
    id: "unconcerned",
    label: "Unconcerned",
    description:
      "Risks exist but are manageable through existing institutions and market forces.",
    color: "#52b788",
    colorLight: "rgba(82,183,136,0.25)",
  },
  {
    id: "cautious",
    label: "Cautiously Optimistic",
    description:
      "Real risks need attention, but careful governance can keep things on track.",
    color: "#f4a261",
    colorLight: "rgba(244,162,97,0.25)",
  },
  {
    id: "concerned-current",
    label: "Concerned (Current)",
    description:
      "Worried about risks already materializing — surveillance, job displacement, algorithmic bias, misinformation.",
    color: "#e07a5f",
    colorLight: "rgba(224,122,95,0.25)",
  },
  {
    id: "concerned-future",
    label: "Concerned (Future)",
    description:
      "Worried about emerging and escalating threats — bioterrorism, dystopian control, power oligarchy, automated warfare.",
    color: "#b5280f",
    colorLight: "rgba(181,40,15,0.25)",
  },
  {
    id: "alarmed",
    label: "Alarmed / Doomer",
    description:
      "AI poses a genuine existential threat — current trajectory leads to catastrophe or human extinction.",
    color: "#6b1114",
    colorLight: "rgba(107,17,20,0.30)",
  },
] as const;
