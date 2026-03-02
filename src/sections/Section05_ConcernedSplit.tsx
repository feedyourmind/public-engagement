"use client";

import ScrollSection from "@/components/ScrollSection";
import DistributionChart from "@/components/DistributionChart";

const CURRENT_RISKS = [
  {
    label: "Job Loss",
    description:
      "Sooner or later there will be a machine that will be better than you at literally everything you can do. Human workers will not be competitive anymore. AI automation is projected to eliminate millions of jobs, widening income gaps — especially for vulnerable populations — while benefiting those who are already wealthy the most.",
  },
  {
    label: "Privacy Violations & Surveillance",
    description:
      "AI relies on vast datasets, often collected without full consent, raising risks of data breaches, identity theft, and invasive monitoring. Tools like facial recognition enable widespread surveillance by governments or companies, eroding personal privacy and enabling social control systems.",
  },
  {
    label: "Misinformation & Manipulation",
    description:
      "Generative AI enables deepfakes, fake news, and propaganda that can sway elections, damage reputations, or incite social unrest. Algorithms on social platforms amplify divisive content, making it harder to discern truth. If a person can\u2019t tell what\u2019s real, they\u2019re insane\u2026 what if a society can\u2019t tell?",
  },
  {
    label: "Bias & Discrimination",
    description:
      "AI systems often inherit biases from training data or developer choices, leading to discriminatory outcomes in hiring, lending, criminal justice, and healthcare. Biased algorithms can unfairly disadvantage certain racial, gender, or socioeconomic groups, perpetuating inequality.",
  },
  {
    label: "Cybersecurity Threats",
    description:
      "AI can be exploited for advanced attacks — phishing, voice cloning for scams, or hacking vulnerabilities in systems. Malicious actors might poison training data or deploy AI in cyber warfare, with breaches potentially costing billions.",
  },
  {
    label: "Environmental Impacts",
    description:
      "Training large AI models consumes massive energy and water, contributing to carbon emissions equivalent to multiple lifetimes of car usage. This exacerbates climate change unless mitigated with efficient designs and renewable resources.",
  },
  {
    label: "AI Psychosis",
    description:
      "Prolonged interactions with generative AI chatbots can exacerbate or trigger psychotic symptoms — delusions, paranoia, hallucinations, and disorganized thinking — usually in vulnerable individuals, often those with pre-existing mental health risks, isolation, or substance use.",
  },
];

const FUTURE_RISKS = [
  {
    label: "Tech Oligarchs \u2013 Concentration of Power",
    description:
      "AI development is often dominated by a few tech giants, leading to monopolies that amplify biases, stifle competition, and concentrate economic and political influence.",
  },
  {
    label: "Weaponization, Terrorism & Bad Actors",
    description:
      "AI-powered autonomous weapons or tools for bioterrorism could cause targeted harm without human oversight, escalating conflicts or enabling non-state actors. This includes risks like hacked drones or AI in arms races.",
  },
  {
    label: "Broken Chain of Knowledge",
    description:
      "Excessive dependence on AI could diminish critical thinking, creativity, and empathy, especially among younger generations. In fields like education or healthcare, this might lead to mental deterioration or weakened decision-making. It\u2019s the first time in human history where a generation will not transfer knowledge to the next generation.",
  },
  {
    label: "Dead Internet",
    description:
      "Increasingly the internet is mostly bots and AI-generated content, with human activity overshadowed by algorithms and fake engagement. In a few years, the internet may literally be 99% AIs talking with other AIs — fake humans talking to other fake humans, no real humans anywhere. A new species of fake humans replacing real humans.",
  },
  {
    label: "Lack of Transparency & Accountability",
    description:
      "AI models are \u201Cblack boxes,\u201D making it difficult to understand or challenge their decisions, which erodes trust and complicates liability for errors. The AI is unreliable and unpredictable, yet we rely on it more and more to power our civilization.",
  },
  {
    label: "AI Relationships",
    description:
      "AI girlfriends and boyfriends simulate romantic relationships through personalized, empathetic chats, helping combat loneliness but raising risks of dependency and privacy issues. These AI relationships may deter real-world dating, contributing to low birth rates by offering \u201Cperfect\u201D virtual partners over complex human connections.",
  },
];

const ALARMED_RISKS = [
  {
    label: "Loss of Control",
    description:
      "AI systems could become too complex to understand or shut down, operating beyond human oversight. Once an AI surpasses human intelligence, there may be no way to course-correct or regain control.",
  },
  {
    label: "AI Going Rogue",
    description:
      "A sufficiently advanced AI pursuing misaligned goals could resist human intervention, acting in ways that are unpredictable and potentially catastrophic — not out of malice, but because its objectives diverge from human values.",
  },
  {
    label: "Extinction & Eternal Suffering Risk",
    description:
      "In a worst-case scenario, uncontrolled AI could render the environment incompatible with human life — or worse, create conditions of sustained suffering with no exit. The stakes are not just civilizational collapse, but the permanent end of the human story.",
  },
  {
    label: "Gradual Disempowerment",
    description:
      "Even without a dramatic takeover, humanity could slowly cede decision-making to AI systems until we are no longer in control of our future — unable to steer our own destiny, shape our societies, or meaningfully choose our path forward.",
  },
];

export default function Section05_ConcernedSplit() {
  return (
    <ScrollSection
      id="concerned"
      className="px-4 sm:px-8 lg:px-16 py-20 max-w-6xl mx-auto"
    >
      <div className="mb-12">
        <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-text mb-4">
          The Concerned Split
        </h2>
        <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-3xl mb-4">
          What makes this challenge even harder is that even among people who
          are genuinely worried about AI risk, there is a very wide spectrum of
          understanding of how serious the situation actually is.
        </p>
        <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-3xl">
          Not all concern is the same. Some worry about harms happening right
          now; others focus on catastrophic futures that haven&apos;t arrived
          yet. The boundary between them defines a critical fault line in AI
          policy.
        </p>
      </div>

      <DistributionChart
        highlightSegments={["concerned-current", "concerned-future", "alarmed"]}
        dimOtherSegments={true}
        showBoundaries={false}
        showLabels={true}
        interactive={false}
        annotations={[
          { x: 1.4, label: "The Fault Line", color: "#fff" },
        ]}
      />

      {/* Current & Future Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {/* Current risks */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-4 h-4 rounded" style={{ background: "#e07a5f" }} />
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-concerned-current">
              Current Risks
            </h3>
          </div>
          <p className="text-sm sm:text-base text-text-muted mb-4">
            Harms that are already measurable and documented.
          </p>
          <div className="space-y-3">
            {CURRENT_RISKS.map((risk) => (
              <div
                key={risk.label}
                className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.06]"
              >
                <div className="text-sm sm:text-base font-semibold text-concerned-current mb-1.5">
                  {risk.label}
                </div>
                <p className="text-xs sm:text-sm text-text-dim leading-relaxed m-0">
                  {risk.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Future risks */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-4 h-4 rounded" style={{ background: "#c1440e" }} />
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-concerned-future">
              Future Risks
            </h3>
          </div>
          <p className="text-sm sm:text-base text-text-muted mb-4">
            Threats that could emerge as capabilities scale.
          </p>
          <div className="space-y-3">
            {FUTURE_RISKS.map((risk) => (
              <div
                key={risk.label}
                className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.06]"
              >
                <div className="text-sm sm:text-base font-semibold text-concerned-future mb-1.5">
                  {risk.label}
                </div>
                <p className="text-xs sm:text-sm text-text-dim leading-relaxed m-0">
                  {risk.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alarmed / Doomer — Far End */}
      <div className="mt-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-4 h-4 rounded" style={{ background: "#8b0000" }} />
          <h3 className="font-heading text-xl sm:text-2xl font-bold" style={{ color: "#ff4444" }}>
            The Far End &mdash; Alarmed / Doomer
          </h3>
        </div>
        <p className="text-sm sm:text-base text-text-muted mb-6 max-w-2xl">
          The existential edge of the spectrum. These aren&apos;t fringe fears
          &mdash; they are scenarios that leading AI researchers take seriously.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ALARMED_RISKS.map((risk) => (
            <div
              key={risk.label}
              className="p-5 rounded-xl bg-white/[0.03] border border-red-900/30"
            >
              <div
                className="text-sm sm:text-base font-semibold mb-2"
                style={{ color: "#ff4444" }}
              >
                {risk.label}
              </div>
              <p className="text-xs sm:text-sm text-text-dim leading-relaxed m-0">
                {risk.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </ScrollSection>
  );
}
