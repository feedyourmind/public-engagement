"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

/* ── Community activities ── */

const ACTIVITIES = [
  {
    icon: "fireside",
    title: "Fireside Discussions",
    description:
      "Warm virtual conversations about the questions that matter most. Think deeply. Speak freely.",
    accent: "#e07a5f",
  },
  {
    icon: "pub",
    title: "Online Pub Nights",
    description:
      "Relaxed gatherings where ideas flow freely. No agenda — just good company and great conversation.",
    accent: "#f4a261",
  },
  {
    icon: "festival",
    title: "Festivals & Events",
    description:
      "Colorful celebrations that unite the community. Creative, vibrant, and full of energy.",
    accent: "#52b788",
  },
  {
    icon: "debate",
    title: "Debate Practice",
    description:
      "Sharpen your thinking and challenge assumptions. Come out wiser, ready to engage anyone.",
    accent: "#67d4e8",
  },
  {
    icon: "movie",
    title: "Movie & Screening Nights",
    description:
      "Watch together, discuss what you\u2019ve seen. Films and docs that shift perspectives.",
    accent: "#c084fc",
  },
  {
    icon: "games",
    title: "Game Nights",
    description:
      "Fun-filled evenings that build lasting bonds. Because community starts with connection.",
    accent: "#f0b429",
  },
];

/* ── Inline SVG icons ── */

function ActivityIcon({ name, color }: { name: string; color: string }) {
  const props = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "fireside":
      return (
        <svg {...props}>
          <path d="M12 22c-4.97 0-9-2.69-9-6v-1c0-2.21 2-4 4-5 0 3 2 5 5 5s5-2 5-5c2 1 4 2.79 4 5v1c0 3.31-4.03 6-9 6z" />
          <path d="M12 14c-1.5 0-3-1.5-3-3.5C9 8 12 5 12 5s3 3 3 5.5c0 2-1.5 3.5-3 3.5z" />
        </svg>
      );
    case "pub":
      return (
        <svg {...props}>
          <path d="M8 2h8l1 7H7L8 2z" />
          <path d="M7 9h10v1a5 5 0 0 1-5 5 5 5 0 0 1-5-5V9z" />
          <line x1="12" y1="15" x2="12" y2="20" />
          <line x1="8" y1="20" x2="16" y2="20" />
        </svg>
      );
    case "festival":
      return (
        <svg {...props}>
          <path d="M4.5 22v-5" />
          <path d="M19.5 22v-5" />
          <path d="M2 17h20" />
          <path d="M12 2l2 5h-4l2-5z" />
          <circle cx="7" cy="9" r="2" />
          <circle cx="17" cy="9" r="2" />
          <path d="M7 11v6" />
          <path d="M17 11v6" />
          <path d="M12 7v10" />
        </svg>
      );
    case "debate":
      return (
        <svg {...props}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M8 9h8" />
          <path d="M8 13h4" />
        </svg>
      );
    case "movie":
      return (
        <svg {...props}>
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
          <line x1="7" y1="2" x2="7" y2="22" />
          <line x1="17" y1="2" x2="17" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="2" y1="7" x2="7" y2="7" />
          <line x1="2" y1="17" x2="7" y2="17" />
          <line x1="17" y1="7" x2="22" y2="7" />
          <line x1="17" y1="17" x2="22" y2="17" />
        </svg>
      );
    case "games":
      return (
        <svg {...props}>
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <circle cx="8" cy="12" r="2" />
          <circle cx="16" cy="12" r="2" />
          <path d="M9 8v2" />
          <path d="M15 14v2" />
        </svg>
      );
    default:
      return null;
  }
}

/* ── Activity card with staggered scroll reveal ── */

function ActivityCard({
  activity,
  index,
  scrollYProgress,
}: {
  activity: (typeof ACTIVITIES)[number];
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const cardStart = 0.48 + index * 0.015;
  const cardOpacity = useTransform(
    scrollYProgress,
    [cardStart, cardStart + 0.04],
    [0, 1],
    { clamp: true }
  );
  const cardY = useTransform(
    scrollYProgress,
    [cardStart, cardStart + 0.04],
    [30, 0],
    { clamp: true }
  );

  return (
    <motion.div
      className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
      style={{ opacity: cardOpacity, y: cardY }}
    >
      <div className="flex items-center gap-3 mb-2">
        <ActivityIcon name={activity.icon} color={activity.accent} />
        <h4
          className="text-sm font-semibold"
          style={{ color: activity.accent }}
        >
          {activity.title}
        </h4>
      </div>
      <p className="text-xs text-text-dim leading-relaxed m-0">
        {activity.description}
      </p>
    </motion.div>
  );
}

/* ── Main section ── */

export default function Section08_AIEndsPub() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  /* Section envelope */
  const sectionOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.04, 0.93, 0.98],
    [0, 1, 1, 0]
  );

  /* Phase A: Hero with pub image */
  const heroOpacity = useTransform(
    scrollYProgress,
    [0.02, 0.06, 0.22, 0.28],
    [0, 1, 1, 0]
  );
  const heroY = useTransform(scrollYProgress, [0.02, 0.06], [40, 0]);
  const imageScale = useTransform(
    scrollYProgress,
    [0.02, 0.12],
    [0.92, 1],
    { clamp: true }
  );
  const taglineOpacity = useTransform(
    scrollYProgress,
    [0.09, 0.14],
    [0, 1],
    { clamp: true }
  );

  /* Phase B: Value proposition */
  const valueOpacity = useTransform(
    scrollYProgress,
    [0.25, 0.31, 0.38, 0.44],
    [0, 1, 1, 0]
  );
  const valueY = useTransform(scrollYProgress, [0.25, 0.31], [40, 0]);

  /* Phase C: Activities grid */
  const gridOpacity = useTransform(
    scrollYProgress,
    [0.44, 0.50, 0.64, 0.70],
    [0, 1, 1, 0]
  );
  const gridTitleOpacity = useTransform(
    scrollYProgress,
    [0.44, 0.50],
    [0, 1],
    { clamp: true }
  );
  const gridTitleY = useTransform(scrollYProgress, [0.44, 0.50], [30, 0]);

  /* Phase D: Crusader connection */
  const crusaderOpacity = useTransform(
    scrollYProgress,
    [0.63, 0.69, 0.81, 0.87],
    [0, 1, 1, 0]
  );
  const crusaderY = useTransform(scrollYProgress, [0.63, 0.69], [40, 0]);

  /* Phase E: CTA */
  const ctaOpacity = useTransform(
    scrollYProgress,
    [0.84, 0.89, 0.93, 0.97],
    [0, 1, 1, 0]
  );
  const ctaY = useTransform(scrollYProgress, [0.84, 0.89], [40, 0]);

  return (
    <section
      ref={sectionRef}
      id="ai-ends-pub"
      className="relative"
      style={{ height: "500vh" }}
    >
      <motion.div
        className="sticky top-12 h-[calc(100vh-3rem)] flex items-center justify-center overflow-hidden"
        style={{ opacity: sectionOpacity }}
      >
        {/* ── Phase A: Hero ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-4"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          {/* Pub sign image with warm glow */}
          <motion.div
            className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg mb-6 rounded-2xl overflow-hidden"
            style={{ scale: imageScale }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent z-10" />
            <div className="absolute -inset-4 bg-[#f4a261]/10 blur-3xl rounded-full z-0" />
            <Image
              src="/AIEndsPub.png"
              alt="AI Ends Pub — a warm community gathering place"
              width={800}
              height={500}
              className="relative z-[1] w-full h-auto object-cover rounded-2xl shadow-2xl"
              priority
            />
          </motion.div>

          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text text-center leading-tight tracking-tight mb-3">
            AI Ends Pub
          </h2>
          <motion.p
            className="text-base sm:text-lg text-text-muted text-center max-w-xl leading-relaxed"
            style={{ opacity: taglineOpacity }}
          >
            Join the debates. The lowest-effort, highest-impact thing you can do.
          </motion.p>
          <motion.p
            className="text-sm text-text-dim text-center max-w-lg leading-relaxed mt-3"
            style={{ opacity: taglineOpacity }}
          >
            A Discord server on a mission to foster vibrant discussions and
            clash worldviews between those who worry about AI and those who
            don&rsquo;t &mdash; in a productive dialog, from which we will all
            come out wiser.
          </motion.p>
          <motion.p
            className="text-sm text-text-dim text-center max-w-lg leading-relaxed mt-2"
            style={{ opacity: taglineOpacity }}
          >
            A place to find belonging, amplify your voice, and connect with
            friends who want to spread AI risk awareness just like you.
          </motion.p>
        </motion.div>

        {/* ── Phase B: Value Proposition ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8"
          style={{ opacity: valueOpacity, y: valueY }}
        >
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-text text-center mb-6">
            A community that is NOT about volunteering or unpaid work.
          </h3>
          <div className="max-w-2xl space-y-4">
            <p className="text-base sm:text-lg text-text-muted text-center leading-relaxed">
              It&rsquo;s not about assigning tasks or extracting value from you.
            </p>
            <p className="text-lg sm:text-xl text-text text-center leading-relaxed font-medium">
              It&rsquo;s a community that delivers value{" "}
              <em className="text-cautious not-italic font-bold">to&nbsp;you</em>.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
              {[
                { text: "Empowering you", color: "#f4a261" },
                { text: "Amplifying your reach", color: "#e07a5f" },
                { text: "Helping you make friends", color: "#52b788" },
                { text: "Sense of belonging", color: "#67d4e8" },
                { text: "Resources & tools", color: "#c084fc" },
                { text: "On your own terms", color: "#f0b429" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="text-center px-4 py-3.5 rounded-lg bg-white/[0.03] border border-white/[0.06]"
                >
                  <span
                    className="text-sm sm:text-base font-medium"
                    style={{ color: item.color }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Phase C: Activities Grid ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16"
          style={{ opacity: gridOpacity }}
        >
          <motion.h3
            className="font-heading text-2xl sm:text-3xl font-bold text-text text-center mb-2"
            style={{ opacity: gridTitleOpacity, y: gridTitleY }}
          >
            What awaits you inside
          </motion.h3>
          <motion.p
            className="text-sm text-text-muted text-center max-w-lg mb-8"
            style={{ opacity: gridTitleOpacity }}
          >
            Find inspiration. Draw strength. Build confidence. Get equipped.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl w-full">
            {ACTIVITIES.map((act, i) => (
              <ActivityCard
                key={act.title}
                activity={act}
                index={i}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </motion.div>

        {/* ── Phase D: Crusader Connection ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-4"
          style={{ opacity: crusaderOpacity, y: crusaderY }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-cautious/70 mb-4 font-body">
            The AI Risk Awareness Force
          </p>
          <h3 className="font-heading text-3xl sm:text-4xl font-bold text-text text-center mb-6 max-w-3xl leading-tight">
            Every advocate starts as a visitor.
          </h3>
          <div className="max-w-2xl space-y-4 text-center">
            <p className="text-base sm:text-lg text-text-muted leading-relaxed">
              You walk in curious. You sit down at the table. You listen, you
              question, you debate &mdash; and somewhere along the way, something
              clicks.
            </p>
            <p className="text-base sm:text-lg text-text leading-relaxed font-medium">
              You don&rsquo;t need to be an expert. You just need to care enough
              to share the message in your own way, within your own sphere of
              influence.
            </p>
            <p className="text-sm text-text-dim leading-relaxed italic mt-6">
              The pub doesn&rsquo;t create crusaders through assignments or
              obligations. It creates them through belonging, confidence, and the
              simple realization that your voice matters.
            </p>
          </div>
        </motion.div>

        {/* ── Phase E: CTA ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-4"
          style={{ opacity: ctaOpacity, y: ctaY }}
        >
          <h3 className="font-heading text-3xl sm:text-4xl font-bold text-text text-center mb-4">
            Pull up a chair.
          </h3>
          <p className="text-base text-text-muted text-center max-w-lg mb-8 leading-relaxed">
            AI Ends Pub is where the AI risk awareness movement finds its
            people. All the action paths are designed for you &mdash; on your
            own terms.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <a
              href="https://lethalintelligence.ai/ai-ends-pub/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-full bg-cautious text-bg text-sm font-semibold hover:brightness-110 transition-all text-center"
            >
              Enter the Pub
            </a>
            <a
              href="https://lethalintelligence.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full border border-white/10 text-text-muted text-sm font-medium hover:bg-white/[0.05] transition-colors text-center"
            >
              Visit The Hub
            </a>
          </div>

          <p className="text-xs text-text-dim italic text-center max-w-md">
            From which we will all come out wiser.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
