import { ComponentType } from "react";
import Section02_Spectrum from "@/sections/Section02_Spectrum";
import Section03_ZoomedSegments from "@/sections/Section03_ZoomedSegments";
import Section03b_Funnel from "@/sections/Section03b_Funnel";
import Section03c_Goals from "@/sections/Section03c_Goals";
import Section03d_Goal2 from "@/sections/Section03d_Goal2";
import Section03e_Grassroots from "@/sections/Section03e_Grassroots";
import Section04_Comparisons from "@/sections/Section04_Comparisons";
import Section04a_Strategies from "@/sections/Section04a_Strategies";
import Section04b_Distribution from "@/sections/Section04b_Distribution";
import Section04c_Platforms from "@/sections/Section04c_Platforms";
import Section05_ConcernedSplit from "@/sections/Section05_ConcernedSplit";
import Section06_Conclusion from "@/sections/Section06_Conclusion";
import Section07_TheHub from "@/sections/Section07_TheHub";
import Section07b_ConversionJourney from "@/sections/Section07b_ConversionJourney";
import Section07c_HubVision from "@/sections/Section07c_HubVision";
import Section08_AIEndsPub from "@/sections/Section08_AIEndsPub";
import Section09_Takedowns from "@/sections/Section09_Takedowns";
import Section10_YouTube from "@/sections/Section10_YouTube";
import Section10b_InfluencerDeals from "@/sections/Section10b_InfluencerDeals";
import Section11_WildExperiments from "@/sections/Section11_WildExperiments";

export interface SectionEntry {
  key: string;
  component: ComponentType;
  navLabel: string;
  navId: string;
  subIds: string[];
  hasDividerBefore: boolean;
}

export const SECTION_REGISTRY: SectionEntry[] = [
  {
    key: "spectrum",
    component: Section02_Spectrum,
    navLabel: "Spectrum",
    navId: "spectrum",
    subIds: ["spectrum"],
    hasDividerBefore: true,
  },
  {
    key: "segments",
    component: Section03_ZoomedSegments,
    navLabel: "Segments",
    navId: "segments",
    subIds: ["segments"],
    hasDividerBefore: true,
  },
  {
    key: "funnel",
    component: Section03b_Funnel,
    navLabel: "Funnel",
    navId: "funnel",
    subIds: ["funnel"],
    hasDividerBefore: true,
  },
  {
    key: "goals",
    component: Section03c_Goals,
    navLabel: "Goals",
    navId: "goals",
    subIds: ["goals"],
    hasDividerBefore: true,
  },
  {
    key: "goal2",
    component: Section03d_Goal2,
    navLabel: "",
    navId: "goal2",
    subIds: ["goal2"],
    hasDividerBefore: false,
  },
  {
    key: "grassroots",
    component: Section03e_Grassroots,
    navLabel: "Grassroots",
    navId: "grassroots",
    subIds: ["grassroots"],
    hasDividerBefore: true,
  },
  {
    key: "comparisons",
    component: Section04_Comparisons,
    navLabel: "Perceptions",
    navId: "comparisons",
    subIds: ["comparisons", "comparisons-tpot", "comparisons-aisafety"],
    hasDividerBefore: true,
  },
  {
    key: "strategies",
    component: Section04a_Strategies,
    navLabel: "Strategies",
    navId: "strategies",
    subIds: ["strategies", "engagement-tradeoff", "meet-people"],
    hasDividerBefore: true,
  },
  {
    key: "distribution",
    component: Section04b_Distribution,
    navLabel: "Distribution",
    navId: "distribution",
    subIds: ["distribution", "resonance-intelligence", "production-pipeline", "aidangers"],
    hasDividerBefore: true,
  },
  {
    key: "platforms",
    component: Section04c_Platforms,
    navLabel: "",
    navId: "platforms",
    subIds: ["platforms", "twitter", "instagram", "all-platforms"],
    hasDividerBefore: false,
  },
  {
    key: "the-hub",
    component: Section07_TheHub,
    navLabel: "The Hub",
    navId: "the-hub",
    subIds: ["the-hub", "hub-gap", "hub-content"],
    hasDividerBefore: true,
  },
  {
    key: "conversion-journey",
    component: Section07b_ConversionJourney,
    navLabel: "Conversion",
    navId: "conversion-journey",
    subIds: ["conversion-journey"],
    hasDividerBefore: false,
  },
  {
    key: "hub-vision",
    component: Section07c_HubVision,
    navLabel: "",
    navId: "hub-vision",
    subIds: ["hub-vision"],
    hasDividerBefore: false,
  },
  {
    key: "ai-ends-pub",
    component: Section08_AIEndsPub,
    navLabel: "The Community",
    navId: "ai-ends-pub",
    subIds: [
      "ai-ends-pub",
      "pub-value",
      "pub-activities",
      "pub-color-coding",
      "pub-tables",
      "pub-name",
      "pub-grab-a-chair",
    ],
    hasDividerBefore: true,
  },
  {
    key: "takedowns",
    component: Section09_Takedowns,
    navLabel: "Takedowns",
    navId: "takedowns",
    subIds: [
      "takedowns",
      "targeted-skepticisms",
      "100-sticking-points",
      "organic-engine",
      "persona-stories",
      "story-paul",
      "story-peter",
      "story-organizations",
      "story-the-movement",
      "story-elon-musk",
      "story-emmanuel-macron",
    ],
    hasDividerBefore: true,
  },
  {
    key: "youtube",
    component: Section10_YouTube,
    navLabel: "YouTube",
    navId: "youtube",
    subIds: ["youtube", "animated-content", "xrisk-paradox", "podcasting", "content-engine"],
    hasDividerBefore: true,
  },
  {
    key: "wild-experiments",
    component: Section11_WildExperiments,
    navLabel: "Experiments",
    navId: "wild-experiments",
    subIds: [
      "wild-experiments",
      "no-plot-armor",
      "exp-2030",
      "reality-is-broken",
      "dystopian-intelligence",
      "experiments-summary",
    ],
    hasDividerBefore: true,
  },
  {
    key: "influencer-deals",
    component: Section10b_InfluencerDeals,
    navLabel: "Influencers",
    navId: "influencer-deals",
    subIds: [
      "influencer-deals",
      "niche-truck",
      "niche-school",
      "niche-code",
      "endless-opportunities",
    ],
    hasDividerBefore: true,
  },
  {
    key: "concerned",
    component: Section05_ConcernedSplit,
    navLabel: "Concerned",
    navId: "concerned",
    subIds: ["concerned"],
    hasDividerBefore: true,
  },
  {
    key: "conclusion",
    component: Section06_Conclusion,
    navLabel: "Conclusion",
    navId: "conclusion",
    subIds: ["conclusion"],
    hasDividerBefore: true,
  },
];
