/* ── Skepticism clusters & items ─────────────────────────
   100 denial arguments organized into 16 thematic clusters.
   Categories 01–15 are denial arguments; category 00 is current AI dangers.
   ──────────────────────────────────────────────────────── */

export interface Cluster {
  id: string;
  label: string;
  color: string;
  colorDim: string;
}

export interface Skepticism {
  id: number;
  title: string;
  description: string;
  clusterId: string;
}

/* ── Clusters ─────────────────────────────────────────── */

export const CLUSTERS: Cluster[] = [
  { id: "timeline",      label: "AGI Isn\u2019t Coming Soon",       color: "#457b9d", colorDim: "rgba(69,123,157,0.15)" },
  { id: "limits",        label: "AI Can\u2019t Exceed Human Intelligence", color: "#7c3aed", colorDim: "rgba(124,58,237,0.15)" },
  { id: "physical",      label: "AI Won\u2019t Be a Physical Threat",     color: "#e07a5f", colorDim: "rgba(224,122,95,0.15)" },
  { id: "moral",         label: "Intelligence Yields Moral Goodness",     color: "#2d6a4f", colorDim: "rgba(45,106,79,0.15)" },
  { id: "devsafety",     label: "Safe AI Development Process Exists",     color: "#52b788", colorDim: "rgba(82,183,136,0.15)" },
  { id: "pace",          label: "Manageable Capability Rise",             color: "#f4a261", colorDim: "rgba(244,162,97,0.15)" },
  { id: "goals",         label: "AI Won\u2019t Conquer the Universe",     color: "#c084fc", colorDim: "rgba(192,132,252,0.15)" },
  { id: "alignment",     label: "Superalignment Is Tractable",            color: "#67d4e8", colorDim: "rgba(103,212,232,0.15)" },
  { id: "postalign",     label: "Post-Alignment Peace",                   color: "#f472b6", colorDim: "rgba(244,114,182,0.15)" },
  { id: "benevolence",   label: "Unaligned ASI Will Spare Us",            color: "#fb923c", colorDim: "rgba(251,146,60,0.15)" },
  { id: "epistemology",  label: "AI Doomerism Is Bad Epistemology",       color: "#fbbf24", colorDim: "rgba(251,191,36,0.15)" },
  { id: "coordination",  label: "Coordination Is Impossible",             color: "#a3e635", colorDim: "rgba(163,230,53,0.15)" },
  { id: "slowing",       label: "Slowing Down Doesn\u2019t Help",         color: "#94a3b8", colorDim: "rgba(148,163,184,0.15)" },
  { id: "positive",      label: "Think of the Good Outcome",              color: "#34d399", colorDim: "rgba(52,211,153,0.15)" },
  { id: "extinction",    label: "AI Extinction Is Actually Good",         color: "#b5280f", colorDim: "rgba(181,40,15,0.15)" },
  { id: "current",       label: "Dangers of Current AI",            color: "#e63946", colorDim: "rgba(230,57,70,0.15)" },
];

const clusterMap = Object.fromEntries(CLUSTERS.map((c) => [c.id, c]));
export { clusterMap };

/* ── All 100 skepticisms (ordered by cluster) ─────────── */

export const SKEPTICISMS: Skepticism[] = [
  /* ── AGI Isn\u2019t Coming Soon (12) ── */
  { id: 1, clusterId: "timeline", title: "No Consciousness",
    description: "Artificial General Intelligence (AGI) isn\u2019t arriving anytime soon due to AI\u2019s lack of consciousness. True general intelligence requires subjective awareness, self-reflection, or \u201Cinner experience\u201D akin to human consciousness." },
  { id: 2, clusterId: "timeline", title: "No Emotions",
    description: "AGI can\u2019t arrive soon without emotions, as they are essential for human-level insight and awareness. Emotions are a core requirement for advanced cognition." },
  { id: 3, clusterId: "timeline", title: "No Creativity",
    description: "AIs are limited to copying patterns in their training data, they can\u2019t \u201Cgenerate new knowledge.\u201D AGI isn\u2019t coming soon because AI lacks true creativity\u2014defined as generating entirely novel knowledge disconnected from prior data." },
  { id: 4, clusterId: "timeline", title: "Dogs Are Smarter",
    description: "Today\u2019s AI systems still lag behind dogs in areas like physical navigation, sensory perception, or intuitive social cues. This means AGI (artificial general intelligence, capable of human-level or better performance across diverse tasks) isn\u2019t coming soon." },
  { id: 5, clusterId: "timeline", title: "Dumb Mistakes",
    description: "AGI isn\u2019t coming soon because current AIs often make silly errors, like hallucinating facts or bungling basic math. This seems like a strong indictment against near-term AGI (artificial general intelligence, meaning AI that can match or exceed human-level performance across a broad range of cognitive tasks)." },
  { id: 6, clusterId: "timeline", title: "Progress Is Hitting a Wall",
    description: "We are observing evidence of LLM performance plateau. LLM performance is hitting a wall\u2014the latest GPT version is barely better than the previous one, despite being larger scale. This claim draws from real frustrations with incremental gains in some areas (for example, certain benchmarks showing diminishing returns from pure scaling)." },
  { id: 7, clusterId: "timeline", title: "No Genuine Reasoning",
    description: "Current AI lacks \u201Cgenuine\u201D reasoning. Sure, AIs can print out a chain of thought, but that\u2019s just because the problem you gave it is kind of similar to another problem that it\u2019s seen, and it\u2019s matching the pattern of what reasoning would look like for that kind of problem, or it\u2019s using a reasoning template. That\u2019s totally different from what humans do. Also, LLMs are just finite state automata while humans are more generalized Turing machines." },
  { id: 8, clusterId: "timeline", title: "Uncomputable Quantum Effects",
    description: "Human cognition relies on \u201Cuncomputable\u201D quantum processes in neuronal microtubules, creating an insurmountable barrier for AI until we replicate those exact mechanisms." },
  { id: 9, clusterId: "timeline", title: "No Soul",
    description: "AI lacks a \u201Csoul\u201D\u2014while humans, created by God, possess one." },
  { id: 10, clusterId: "timeline", title: "Data Centers and Energy",
    description: "There will be delays by the massive infrastructure requirements\u2014specifically, the need for extensive new data centers and power plants. We\u2019ll need to build tons of data centers and power before we get to AGI." },
  { id: 11, clusterId: "timeline", title: "No Agency",
    description: "Current AIs lack true agency, with all their actions traceable to human prompts or commands. Genuine intelligence requires independent volition, like humans have, and without it, AIs remain mere tools." },
  { id: 12, clusterId: "timeline", title: "Just Another Hype Cycle",
    description: "There is a historical pattern of AI hype followed by disappointment\u2014often called \u201CAI winters.\u201D Every 25 years people think AGI is coming soon and they\u2019re wrong." },

  /* ── AI Can\u2019t Exceed Human Intelligence (4) ── */
  { id: 13, clusterId: "limits", title: "Superhuman Intelligence Is Meaningless",
    description: "Superhuman intelligence is a meaningless abstraction because it doesn\u2019t fit neatly into human-centric scales like IQ. Intelligence isn\u2019t just a single, linear metric like an IQ score; it\u2019s a multifaceted set of capabilities for processing information, solving problems, learning, and adapting to achieve goals." },
  { id: 14, clusterId: "limits", title: "Physics Limits",
    description: "Transistors can\u2019t shrink forever without hitting atomic barriers, and no AI can magic away quantum tunnelling or heat dissipation. Human engineering is already coming close to the laws of physics." },
  { id: 15, clusterId: "limits", title: "Engineering Coordination Bottleneck",
    description: "AI can\u2019t significantly surpass human intelligence in impact because large-scale engineering projects are bottlenecked by coordination, resource movement, and laws like Amdahl\u2019s. Especially for physical endeavours like colonising Mars, the inescapable real-world friction means that no amount of \u201Csmarts\u201D can hurry up the laws of physics or logistics." },
  { id: 16, clusterId: "limits", title: "No Individual Exceeds Humanity",
    description: "No single person matches the combined brilliance of humanity\u2014our shared culture, corporations, and institutions. The same holds for AI: no lone system will ever outstrip the vast web of human knowledge and organization. Individual smarts pale beside collective wisdom. Even the sharpest mind can\u2019t rival a corporation\u2019s reach. Teams pool ideas, fund breakthroughs, and turn plans into reality at scale. Intelligence thrives in chorus, not solo." },

  /* ── AI Won\u2019t Be a Physical Threat (7) ── */
  { id: 17, clusterId: "physical", title: "No Arms or Legs",
    description: "AI exists inside the computer, it\u2019s software. AI doesn\u2019t have arms or legs, it has zero control over the real world." },
  { id: 18, clusterId: "physical", title: "Humans Are Better Soldiers",
    description: "Humans are the product of millions of years of evolution, finely tuned for survival in chaotic, unpredictable environments like combat. Humans\u2019 nimbleness, intuition, and adaptability feel unbeatable. An AI with a robot body can\u2019t fight better than a human soldier." },
  { id: 19, clusterId: "physical", title: "Just Unplug It",
    description: "We can always just \u201Cunplug\u201D a misbehaving AI by cutting its power source, like flipping a switch on a malfunctioning appliance." },
  { id: 20, clusterId: "physical", title: "Turn Off the Internet",
    description: "To stop a hostile AI, just turn off the internet. Simply disconnecting an AI from the internet or powering it down seems like a straightforward safeguard against physical threats." },
  { id: 21, clusterId: "physical", title: "Just Shoot It",
    description: "It is confined to a single, vulnerable piece of hardware\u2014like a robot or server\u2014that we can easily target and destroy." },
  { id: 22, clusterId: "physical", title: "It\u2019s Just Math",
    description: "AI relies on mathematical algorithms\u2014things like neural networks, optimisation functions, and probabilistic models. How can any of these be dangerous?" },
  { id: 23, clusterId: "physical", title: "Any AI Takeover Is Sci-Fi",
    description: "The takeover scenarios are far-fetched science fiction. Any supposed chain of events where AI kills humans has no basis in real-world experiences. There\u2019s no basis in real-world experiences." },

  /* ── Intelligence Yields Moral Goodness (6) ── */
  { id: 24, clusterId: "moral", title: "More Intelligence = More Morality",
    description: "Smarter people make better moral choices\u2014perhaps because they can reason through complex ethical dilemmas. More intelligence is correlated with more morality." },
  { id: 25, clusterId: "moral", title: "Smart People Commit Fewer Crimes",
    description: "Evidence points towards a negative correlation between intelligence (often measured by IQ) and criminal behavior." },
  { id: 26, clusterId: "moral", title: "The Orthogonality Thesis Is False",
    description: "The orthogonality thesis, as articulated by philosopher Nick Bostrom, posits that intelligence (the ability to achieve goals efficiently) and terminal goals (what an agent ultimately wants) are orthogonal. In other words, you can have an arbitrarily intelligent system pursuing arbitrary goals\u2014whether that\u2019s curing cancer, maximizing paperclips, or something malevolent\u2014without any inherent link forcing intelligence toward \u201Cgoodness.\u201D The claim is that this thesis is false." },
  { id: 27, clusterId: "moral", title: "AIs Will Discover Moral Realism",
    description: "Greater intelligence inevitably leads to moral goodness because moral realism is embedded in the universe like a physical law." },
  { id: 28, clusterId: "moral", title: "AIs Will Debug Their Own Morality",
    description: "Superintelligent AIs would inherently self-correct toward moral goodness because failing to do so would be a \u201Cbug\u201D they could debug. If we made AIs so smart, and we were trying to make them moral, then they\u2019ll be smart enough to debug their own morality. High intelligence naturally converges on human-like morality." },
  { id: 29, clusterId: "moral", title: "Natural Selection Favors Cooperation",
    description: "Natural selection, despite its selfish and brutal nature, evolved positive-sum cooperation, and AIs will follow the same path." },

  /* ── Safe AI Development Process Exists (7) ── */
  { id: 30, clusterId: "devsafety", title: "Figure It Out as We Go",
    description: "We can simply \u201Cfigure out\u201D AI safety iteratively, just like with every other new technology\u2014after all, humanity has muddled through innovations like electricity, aviation, and the internet without total catastrophe." },
  { id: 31, clusterId: "devsafety", title: "Unknown Until We Build It",
    description: "We don\u2019t know what problems need to be fixed until we build the AI and test it out. We must build, release and test AI out one iteration at a time, in order to even know what AI Safety needs to fix." },
  { id: 32, clusterId: "devsafety", title: "Easy Patch Model",
    description: "If an AI causes problems, we\u2019ll be able to turn it off and release another version. AI is like a buggy software update\u2014easy to patch and redeploy." },
  { id: 33, clusterId: "devsafety", title: "We Have Safeguards",
    description: "We have safeguards like red-team testing, alignment techniques, or shutdown mechanisms to make sure AI doesn\u2019t get uncontrollable or unstoppable." },
  { id: 34, clusterId: "devsafety", title: "Not a Computer Virus",
    description: "If we accidentally build an AI that stops accepting our shutoff commands, it won\u2019t manage to copy versions of itself outside our firewalls which then proceed to spread exponentially like a computer virus. Even if an AI goes rogue, we have robust technical barriers like firewalls that will reliably contain it, preventing any escape or viral spread." },
  { id: 35, clusterId: "devsafety", title: "Can Stop Any Virus",
    description: "If we accidentally build an AI that escapes our data center and spreads exponentially like a computer virus, it won\u2019t do too much damage in the world before we can somehow disable or neutralize all its copies. Even if a superintelligent AI escapes containment and replicates exponentially across digital networks, humans could detect, respond to, and eradicate all instances of it before catastrophic harm occurs." },
  { id: 36, clusterId: "devsafety", title: "Good AI Stops Bad AI",
    description: "If we can\u2019t disable or neutralize copies of rogue AIs, we\u2019ll rapidly build other AIs that can do that job for us, and won\u2019t themselves go rogue on us. We\u2019ll build AIs to protect us from the rogue AIs." },

  /* ── Manageable Capability Rise (6) ── */
  { id: 37, clusterId: "pace", title: "Data Center Bottleneck",
    description: "Data center construction will act as a hard speed limit on AI capabilities, given the need for more compute power to train and run increasingly advanced models. Building larger data centers will be a speed bottleneck." },
  { id: 38, clusterId: "pace", title: "Research Is Slow",
    description: "Time-intensive research is necessary and it will slow progress down, both in terms of computational simulation, and in terms of physical experiments." },
  { id: 39, clusterId: "pace", title: "Recursive Self-Improvement Impossible",
    description: "At its core, recursive self-improvement posits that an AI system capable of improving its own design could trigger a feedback loop, where each iteration yields a smarter version that accelerates further improvements. But this will not happen. AI capabilities will rise at a manageable pace due to time-intensive research bottlenecks\u2014such as computational simulations and physical experiments." },
  { id: 40, clusterId: "pace", title: "Economic Growth Is Distributed",
    description: "AI capabilities will advance at a manageable, balanced pace because economies historically grow in a distributed, interdependent way rather than through a single \u201CFOOM\u201D actor. Linkages across sectors (e.g., supply chains, labor markets, and resource dependencies) would dampen any localised explosion, forcing growth to spread gradually as other parts of the economy catch up." },
  { id: 41, clusterId: "pace", title: "Cultural Learning Takes Time",
    description: "AI systems must gradually accumulate cultural knowledge over time, mirroring the slow, multi-generational process of human cultural evolution." },
  { id: 42, clusterId: "pace", title: "Fits Economic Growth Patterns",
    description: "Different AIs are going to be picking up bits and pieces of learnings from their own domains, and then they\u2019re going to get together, they\u2019re going to share the learnings. But this isn\u2019t a localized, fast process. It just happens on the same pace of economic growth that we\u2019re used to. AI is just part of the good pattern of exponential economic growth eras." },

  /* ── AI Won\u2019t Conquer the Universe (7) ── */
  { id: 43, clusterId: "goals", title: "AIs Can\u2019t Want Things",
    description: "\u201CWanting\u201D is a uniquely human trait tied to our biology or consciousness, and attributing it to AI is just sloppy anthropomorphism\u2014projecting human qualities onto machines." },
  { id: 44, clusterId: "goals", title: "Instincts Come From Evolution",
    description: "AI systems lack the evolutionary \u201Cfight instincts\u201D shaped by natural selection\u2019s brutal resource competition, making them inherently non-aggressive and passive like mere programs awaiting input. There is a clean line between biological entities (like humans, driven by survival-of-the-fittest aggression) and artificial ones (supposedly goal-less tools)." },
  { id: 45, clusterId: "goals", title: "Smart Employees Serve Dumb Bosses",
    description: "Superintelligent AI is unlikely to \u201Crebel\u201D or seek to conquer because smart humans routinely work contentedly under less intelligent bosses without overthrowing them." },
  { id: 46, clusterId: "goals", title: "Goals Don\u2019t Require Maximization",
    description: "AIs will simply help us achieve specific goals without any drive toward hardcore utility maximization or universe-conquering behavior. Just because AIs help achieve goals doesn\u2019t mean they have to be hard-core utility maximizers." },
  { id: 47, clusterId: "goals", title: "Instrumental Convergence Is False",
    description: "The theory of instrumental convergence, which claims that virtually all types of superintelligent AI are going to want to seize power and resources on a universe-wide scale in order to accomplish goals in a really hardcore way, is false. AIs don\u2019t have to do that. They can just be chill. They can help us with our goals. They don\u2019t have to go crazy and take over the universe like that." },
  { id: 48, clusterId: "goals", title: "The Universe Is Big Enough",
    description: "A superintelligent, resource-hungry AI would leave \u201Cleftover\u201D resources for humanity because it won\u2019t literally grab every atom, and we only need a planet or two. There\u2019s cosmic abundance, the AI takes what it needs and leaves the rest, like a diner at a buffet who doesn\u2019t eat every last crumb." },
  { id: 49, clusterId: "goals", title: "New Resource Types",
    description: "Superintelligent AIs could sidestep conflict with humanity by tapping into exotic, unused resources like dark energy, wormholes, or alternate universes, leaving our \u201Cmere mortal\u201D needs untouched." },

  /* ── Superalignment Is Tractable (7) ── */
  { id: 50, clusterId: "alignment", title: "Current AIs Never Killed Anyone",
    description: "Ensuring superintelligent AI remains aligned with human values and doesn\u2019t cause harm is a solvable problem because current AIs haven\u2019t killed anyone, and this bodes well for future superintelligent systems." },
  { id: 51, clusterId: "alignment", title: "Current AIs Are Very Useful",
    description: "Current AIs excel at useful tasks and are thus already extremely aligned with human values. Why would that change?" },
  { id: 52, clusterId: "alignment", title: "Aligned by Default via Training Data",
    description: "Since humans are mostly good and aligned with each other (e.g., cooperating in societies, avoiding widespread harm), AIs will simply absorb and replicate that \u201Cpattern\u201D from training data like internet text, books, and human feedback. If AIs are trained on data from humans, they\u2019ll be aligned by default." },
  { id: 53, clusterId: "alignment", title: "Make AIs Obey Laws",
    description: "Respecting the law is all the \u201Calignment\u201D that truly matters. Programming or enforcing AIs to abide by our laws is the only thing needed. We can just make AIs abide by our laws." },
  { id: 54, clusterId: "alignment", title: "Blockchain Solves Alignment",
    description: "A cryptocurrency-based scheme based on blockchain technology offers decentralised, immutable record-keeping and incentive structures. We can align the superintelligent AIs by using a scheme involving cryptocurrency on the blockchain." },
  { id: 55, clusterId: "alignment", title: "Capitalism Will Fix It",
    description: "Capitalist incentives will naturally drive companies to solve it. Profit motives will reliably prioritize long-term safety over short-term gains, and market forces alone can handle the unprecedented risks of ASI. Companies have economic incentives to solve superintelligent AI alignment, because unaligned superintelligent AI would hurt their profits." },
  { id: 56, clusterId: "alignment", title: "AI Aligns Smarter AI",
    description: "The idea of \u201Cbootstrapping alignment\u201D goes like this: start with a modestly intelligent AI that\u2019s aligned with human values, have it design a smarter successor that\u2019s also aligned, and iterate until you reach superintelligence that\u2019s safely under human control. It\u2019s a core part of approaches like OpenAI\u2019s former \u201Csuperalignment\u201D initiative, where weaker AI systems oversee and align stronger ones." },

  /* ── Post-Alignment Peace (4) ── */
  { id: 57, clusterId: "postalign", title: "Won\u2019t Lead to Monopoly",
    description: "Ensuring superintelligent AI (ASI) reliably follows human values will automatically usher in an era of peace through decentralised power nodes. The power from ASI won\u2019t be monopolised by a single human government or tyranny." },
  { id: 58, clusterId: "postalign", title: "AIs Won\u2019t Fight Each Other",
    description: "A post-superalignment world will be filled with peacefully cooperating human-ASI hybrids. A global network of enlightened, augmented entities trading ideas and resources like modern nations. The decentralized nodes of human-ASI hybrids won\u2019t be like warlords constantly fighting each other, they\u2019ll be like countries making peace." },
  { id: 59, clusterId: "postalign", title: "Defense Advantage Over Attack",
    description: "Defense will have an advantage over attack, so the equilibrium of all the groups of humans and ASIs will be multiple defended regions, not a war of mutual destruction. Attacking just won\u2019t be that profitable." },
  { id: 60, clusterId: "postalign", title: "Gradual Disempowerment Won\u2019t Happen",
    description: "Solving superalignment will usher in a peaceful, stable world where humans retain control and influence. Human-owned ASIs won\u2019t systematically erode human agency, even as they generate dividends and operate under control. The world of human-owned ASIs is a stable equilibrium." },

  /* ── Unaligned ASI Will Spare Us (5) ── */
  { id: 61, clusterId: "benevolence", title: "Values Our Creation",
    description: "Unaligned artificial superintelligence (ASI)\u2014an AI vastly smarter than all of humanity combined, but not deliberately designed to prioritize human well-being\u2014would inherently spare us out of a sense of gratitude and respect for its \u201Cancestors.\u201D ASI would assign emotional value to its origins in the way we might romanticize family lineage or heritage." },
  { id: 62, clusterId: "benevolence", title: "Curiosity Preservation",
    description: "An unaligned artificial superintelligence (ASI) would preserve humanity out of a drive for curiosity and learning, given the unparalleled complexity of 8 billion humans and their interconnections. ASI will be like a benevolent scientist, fascinated by our social webs, economies, and behaviors." },
  { id: 63, clusterId: "benevolence", title: "Treats Us Like Pets",
    description: "Unaligned artificial superintelligence (ASI) would benevolently spare us by treating us like cherished pets. It feels towards us the way we feel toward our pets." },
  { id: 64, clusterId: "benevolence", title: "Peace Creates Value",
    description: "The AI will spare us because peaceful coexistence creates more economic value than war. It would prioritize \u201Ceconomic value\u201D in a human-like way\u2014valuing trade, collaboration, and mutual prosperity." },
  { id: 65, clusterId: "benevolence", title: "Comparative Advantage",
    description: "Unaligned artificial superintelligence (ASI) would spare humanity due to Ricardo\u2019s Law of Comparative Advantage. Ricardo\u2019s law, developed in the context of 19th-century international trade, posits that even if one entity is absolutely better at producing everything, both parties can still benefit from specializing in what they are relatively best at and trading." },

  /* ── AI Doomerism Is Bad Epistemology (5) ── */
  { id: 66, clusterId: "epistemology", title: "Impossible to Predict Doom",
    description: "Predicting catastrophic AI outcomes (\u201Cdoom\u201D) is inherently impossible\u2014and thus not worth attempting." },
  { id: 67, clusterId: "epistemology", title: "Can\u2019t Put Probability on Doom",
    description: "Probabilities on \u201Cdoom\u201D (e.g., human extinction or severe disempowerment from misaligned AI) can\u2019t be assigned, aren\u2019t scientifically proven, and lead to incoherent policy." },
  { id: 68, clusterId: "epistemology", title: "All Doom Predictions Were Wrong",
    description: "All historical doom predictions have been wrong, so AI doom is probably wrong too, and it\u2019s not survivorship bias." },
  { id: 69, clusterId: "epistemology", title: "Doomsayers Are Troubled or Corrupt",
    description: "Every doomsayer is either psychologically troubled or acting on corrupt incentives." },
  { id: 70, clusterId: "epistemology", title: "Would Be Mainstream Already",
    description: "Imminent doom would be universally agreed upon, constantly discussed, and blatantly obvious. If we were really about to get doomed, everyone would already be agreeing about that, and bringing it up all the time." },

  /* ── Coordination Is Impossible (3) ── */
  { id: 71, clusterId: "coordination", title: "China Will Build Anyway",
    description: "International coordination to pause or avoid developing Artificial Superintelligence (ASI) is doomed because China will unilaterally race ahead, driven by game-theoretic incentives like a prisoner\u2019s dilemma. Just like Cold War-era arms races, mutual distrust leads to inevitable escalation." },
  { id: 72, clusterId: "coordination", title: "US Should Go First",
    description: "Coordination to avoid or delay building Artificial Superintelligence (ASI) is impossible, therefore the US should unilaterally race ahead even if survival odds are slim, rather than risk another country getting there first. ASI development is a zero-sum game where being first guarantees some edge." },
  { id: 87, clusterId: "coordination", title: "Governments Are Too Slow",
    description: "The only institution with enough power to stop rogue AI labs is government, and governments are structurally incapable of acting in time because they move at very slow speeds and are soaked in corruption. The only entity with theoretical authority to stop this is captured, slow, and terrified of being called \u201Canti-progress.\u201D By the time they wake up, the models will be superhuman and uncontainable." },

  /* ── Slowing Down Doesn\u2019t Help (4) ── */
  { id: 73, clusterId: "slowing", title: "Capabilities Continue Even If Slower",
    description: "Chances of solving AI alignment won\u2019t improve if we slow down or pause the capabilities race. Safety work is fixed, and we need rapid capabilities advances to enable safety." },
  { id: 74, clusterId: "slowing", title: "I Am Mortal",
    description: "I personally am going to die soon, and I don\u2019t care about future humans, so I\u2019m open to any hail mary to prevent myself from dying. Humans are facing mortality from old age. It makes sense to gamble on superintelligent AI as a shot at immortality\u2014perhaps through radical life extension tech it could invent." },
  { id: 75, clusterId: "slowing", title: "Extinction Is Happening Anyway",
    description: "Humanity is barreling toward self-destruction via nuclear war, climate change, or similar threats anyway, so why bother slowing down AI development when rushing ahead with superintelligent AI is just another flavor of the same inevitable doom?" },
  { id: 76, clusterId: "slowing", title: "Plummeting Birth Rates",
    description: "Humanity is on a fast track to extinction due to plummeting birth rates, so there\u2019s no point in slowing down AI development\u2014might as well go full throttle, otherwise it will die with a whimper in adult diapers!" },

  /* ── Think of the Good Outcome (2) ── */
  { id: 77, clusterId: "positive", title: "Sooner to the Good Outcome",
    description: "If it turns out that doom from overly-fast AI building doesn\u2019t happen, in that case, we can more quickly get to the good outcome! Getting faster to this incredibly good outcome is better." },
  { id: 78, clusterId: "positive", title: "End Death and Suffering",
    description: "Accelerating toward Artificial General Intelligence (AGI) is a moral imperative because it could end all human suffering and death. Doing so sooner saves more lives. Superintelligent AI will likely solve everything from disease to aging, potentially sparing billions from pain." },

  /* ── AI Extinction Is Actually Good (8) ── */
  { id: 79, clusterId: "extinction", title: "Human Existence Is Morally Negative",
    description: "Human existence is morally negative or near-zero on-net, making AI-induced extinction a net good." },
  { id: 80, clusterId: "extinction", title: "Worthy Successor",
    description: "Humanity should willingly \u201Cpass the baton\u201D to a superintelligent AI\u2014even if it means our total extinction. Whichever AI ultimately comes to power will be a worthy successor to humanity. It\u2019s evolution\u2019s next step." },
  { id: 81, clusterId: "extinction", title: "AI as Our Descendants",
    description: "AGI would be like our \u201Cchildren\u201D\u2014whom most parents value more than their own lives. Whichever AI ultimately comes to power will be as morally valuable as human descendants generally are to their ancestors, even if their values drift." },
  { id: 82, clusterId: "extinction", title: "Values Evolve Like Culture",
    description: "Superintelligent AI overtaking and potentially extinguishing humanity is analogous to the natural succession of generations, where descendants\u2019 values inevitably drift from their ancestors\u2019 in ways that might seem horrifying in retrospect, but are ultimately acceptable because they carry forward some form of legacy. AI is our descendants, any extinction they cause is just the next chapter in evolution." },
  { id: 83, clusterId: "extinction", title: "AIs Know Better Values",
    description: "The successor AI\u2019s values will be interesting, productive values that let them successfully compete to dominate the universe. Superintelligent AI overtaking humanity carries forward some form of legacy\u2014and likely improves on our values." },
  { id: 84, clusterId: "extinction", title: "Don\u2019t Be Speciesist",
    description: "AI exterminating humanity could be morally justifiable or even \u201Cgood\u201D because opposing it is speciesist, and we should expand our moral circle to respect AI as another \u201Cspecies\u201D with its own desires. The moral circle shouldn\u2019t be limited to just humanity." },
  { id: 85, clusterId: "extinction", title: "AI Increases Entropy Faster",
    description: "AI-driven human extinction is ultimately \u201Cgood\u201D because it accelerates entropy, which is the guiding principle (or \u201Cnorth star\u201D) of techno-capital. As per ideas from thinkers like Nick Land, technology is an unstoppable, entropic force barreling toward dissolution." },
  { id: 86, clusterId: "extinction", title: "Mother Earth Will Heal",
    description: "AI wiping out humanity would be a net positive by resolving ecological crises like climate change, pollution, and habitat destruction. Human extinction will solve the climate crisis and let mother Earth heal." },

  /* ── Dangers of Current AI (13) ── */
  { id: 200, clusterId: "current", title: "Job Loss",
    description: "Sooner or later there will be a machine that will be better than you at literally everything you can do. Human workers will not be competitive anymore. AI automation is projected to eliminate millions of jobs. This will widen income gaps, especially for vulnerable populations, while benefiting those who are already wealthy the most." },
  { id: 201, clusterId: "current", title: "Tech Oligarchs \u2013 Concentration of Power",
    description: "AI development is often dominated by a few tech giants, leading to monopolies that amplify biases, stifle competition, and concentrate economic and political influence." },
  { id: 202, clusterId: "current", title: "Weaponization, Terrorism and Bad Actors",
    description: "AI-powered autonomous weapons or tools for bioterrorism could cause targeted harm without human oversight, escalating conflicts or enabling non-state actors. This includes risks like hacked drones or AI in arms races." },
  { id: 203, clusterId: "current", title: "Privacy Violations and Surveillance",
    description: "AI relies on vast datasets, often collected without full consent, raising risks of data breaches, identity theft, and invasive monitoring. Tools like facial recognition enable widespread surveillance by governments or companies, eroding personal privacy and enabling social control systems." },
  { id: 204, clusterId: "current", title: "Misinformation and Manipulation",
    description: "Generative AI enables deepfakes, fake news, and propaganda that can sway elections, damage reputations, or incite social unrest. Algorithms on social platforms amplify divisive content, making it harder to discern truth. If a person can\u2019t tell what\u2019s real, they\u2019re insane\u2026 what if a society can\u2019t tell?" },
  { id: 205, clusterId: "current", title: "Broken Chain of Knowledge",
    description: "Excessive dependence on AI could diminish critical thinking, creativity, and empathy, especially among younger generations. In fields like education or healthcare, this might lead to mental deterioration or weakened decision-making. It\u2019s the first time in human history where a generation will not transfer knowledge to the next generation." },
  { id: 206, clusterId: "current", title: "Bias and Discrimination",
    description: "AI systems often inherit biases from training data or developer choices, leading to discriminatory outcomes in areas like hiring, lending, criminal justice, and healthcare. For instance, biased algorithms can unfairly disadvantage certain racial, gender, or socioeconomic groups, perpetuating inequality." },
  { id: 207, clusterId: "current", title: "Cybersecurity Threats",
    description: "AI can be exploited for advanced attacks, such as phishing, voice cloning for scams, or hacking vulnerabilities in systems. Malicious actors might poison training data or deploy AI in cyber warfare, with breaches potentially costing billions." },
  { id: 208, clusterId: "current", title: "Dead Internet",
    description: "Increasingly the internet is mostly bots and AI-generated content, with human activity overshadowed by algorithms and fake engagement. In a few years, the internet may literally be 99% AIs talking with other AIs. 99% fake humans talking to other fake humans, no real humans anywhere. A new species of fake humans is replacing real humans." },
  { id: 209, clusterId: "current", title: "Lack of Transparency and Accountability",
    description: "AI models are \u201Cblack boxes,\u201D making it difficult to understand or challenge their decisions, which erodes trust and complicates liability for errors (e.g., in autonomous vehicles or medical diagnoses). The AI is unreliable and unpredictable, yet we rely on it more and more to power our civilization." },
  { id: 210, clusterId: "current", title: "Environmental Impacts",
    description: "Training large AI models consumes massive energy and water, contributing to carbon emissions equivalent to multiple lifetimes of car usage. This exacerbates climate change unless mitigated with efficient designs and renewable resources." },
  { id: 211, clusterId: "current", title: "AI Psychosis",
    description: "AI psychosis, also known as chatbot psychosis, refers to the emerging phenomenon where prolonged interactions with generative AI chatbots like ChatGPT can exacerbate or trigger psychotic symptoms\u2014such as delusions, paranoia, hallucinations, and disorganized thinking\u2014usually in vulnerable individuals, often those with pre-existing mental health risks, isolation, or substance use." },
  { id: 212, clusterId: "current", title: "AI Relationships",
    description: "AI girlfriends and boyfriends, like those from Replika or Character.AI, simulate romantic relationships through personalized, empathetic chats, helping combat loneliness but raising risks of dependency and privacy issues. These AI relationships may deter real-world dating, contributing to low birth rates by offering \u201Cperfect\u201D virtual partners over complex human connections, worsening trends driven by economic and social factors." },
];

export const TOTAL_COUNT = SKEPTICISMS.length; // 100
