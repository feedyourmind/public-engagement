export interface ViewConfig {
  slug: string;
  title: string;
  subtitle?: string;
  domains: string[];
  sections: string[];
}

export const VIEWS: ViewConfig[] = [
  {
    slug: "theory-of-change",
    title: "Lethal Intelligence",
    subtitle: "The Full Vision",
    domains: ["theory-of-change.lethalintelligence.ai"],
    sections: [
      "spectrum",
      "segments",
      "funnel",
      "goals",
      "goal2",
      "grassroots",
      "comparisons",
      "strategies",
      "distribution",
      "platforms",
      "the-hub",
      "conversion-journey",
      "hub-vision",
      "ai-ends-pub",
      "takedowns",
      "youtube",
      "wild-experiments",
      "influencer-deals",
      "concerned",
      "conclusion",
    ],
  },
  {
    slug: "community",
    title: "The Community Hub",
    subtitle: "Understanding AI Risk & Building Community",
    domains: ["community.lethalintelligence.ai"],
    sections: [
      "spectrum",
      "segments",
      "funnel",
      "ai-ends-pub",
    ],
  },
  {
    slug: "social-strategy",
    title: "Social Media Strategy",
    subtitle: "YouTube, Takedowns & Influencer Engagement",
    domains: [],
    sections: [
      "youtube",
      "takedowns",
      "influencer-deals",
      "platforms",
    ],
  },
  {
    slug: "takedown-focus",
    title: "AI Takedown Strategy",
    subtitle: "Targeted Responses to AI Risk Skepticism",
    domains: [],
    sections: ["takedowns"],
  },
];

export function getViewByDomain(hostname: string): ViewConfig | undefined {
  return VIEWS.find((v) => v.domains.includes(hostname));
}

export function getViewBySlug(slug: string): ViewConfig | undefined {
  return VIEWS.find((v) => v.slug === slug);
}
