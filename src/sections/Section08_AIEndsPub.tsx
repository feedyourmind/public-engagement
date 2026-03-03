"use client";

import Image from "next/image";
import { motion } from "framer-motion";

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
    width: 24,
    height: 24,
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

/* ── Fade-in-on-scroll wrapper ── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

/* ── Main section ── */

export default function Section08_AIEndsPub() {
  return (
    <section id="ai-ends-pub" className="relative">
      {/* ── Phase A: Hero ── */}
      <motion.div
        className="flex flex-col items-center justify-center px-4 pt-24 pb-4 sm:pt-32 sm:pb-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
      >
        <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg mb-6 rounded-2xl overflow-hidden">
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
        </div>

        <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text text-center leading-tight tracking-tight mb-1">
          AI Ends Pub
        </h2>
        <p className="text-lg sm:text-xl lg:text-2xl font-medium text-center max-w-xl leading-relaxed mb-3 tracking-wide whitespace-nowrap" style={{ color: '#f4a261' }}>
          Where the AI Risk Awareness Force finds its people.
        </p>
        <p className="text-base sm:text-lg text-text-muted text-center max-w-xl leading-relaxed mb-0">
          Join the debates, currently on Discord.<br />The lowest-effort, highest-impact thing you can do.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2 max-w-3xl w-full">
          <div className="p-6 sm:p-7 rounded-xl bg-[#f4a261]/[0.07] border border-[#f4a261]/20">
            <h4 className="text-sm uppercase tracking-widest text-[#f4a261] font-semibold mb-3">
              The Debates
            </h4>
            <p className="text-base sm:text-lg text-text-muted leading-relaxed m-0">
              A community on a mission to foster vibrant discussions and
              clash worldviews between those who worry about AI and those who
              don&rsquo;t &mdash; in a productive dialog, from which we will
              all come out wiser.
            </p>
          </div>
          <div className="p-6 sm:p-7 rounded-xl bg-[#67d4e8]/[0.07] border border-[#67d4e8]/20">
            <h4 className="text-sm uppercase tracking-widest text-[#67d4e8] font-semibold mb-3">
              The Belonging
            </h4>
            <p className="text-base sm:text-lg text-text-muted leading-relaxed m-0">
              A place to find belonging, amplify your voice, and connect with
              friends who want to spread AI risk awareness just like you.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Phase B: Value Proposition ── */}
      <motion.div
        id="pub-value"
        className="flex flex-col items-center justify-center px-4 sm:px-8 pt-14 pb-8 sm:pt-20 sm:pb-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
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
          <p className="text-base sm:text-lg text-text-muted text-center leading-relaxed">
            Giving you all the resources you need to be as effective an AI risk awareness crusader as you can.
          </p>
          <div className="mt-2 px-6 py-5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <p className="text-sm sm:text-base text-text-muted text-center leading-relaxed m-0">
              We don&rsquo;t tell you how to do it &mdash; we just help you spread the message to your own{" "}
              <em className="text-text font-bold not-italic">circle of influence</em>, in your own way.
            </p>
          </div>
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
        id="pub-activities"
        className="flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16 pt-8 pb-10 sm:pt-10 sm:pb-14"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
      >
        <h3 className="font-heading text-2xl sm:text-3xl font-bold text-text text-center mb-2">
          What awaits you inside
        </h3>
        <p className="text-sm text-text-muted text-center max-w-lg mb-8">
          Find inspiration. Draw strength. Build confidence. Get equipped.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-5xl w-full">
          {ACTIVITIES.map((act, i) => (
            <motion.div
              key={act.title}
              className="p-5 sm:p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <ActivityIcon name={act.icon} color={act.accent} />
                <h4
                  className="text-base sm:text-lg font-semibold"
                  style={{ color: act.accent }}
                >
                  {act.title}
                </h4>
              </div>
              <p className="text-sm sm:text-base text-text-dim leading-relaxed m-0">
                {act.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Color-coding ── */}
      <motion.div
        id="pub-color-coding"
        className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-14 px-4 sm:px-8 lg:px-16 py-12 sm:py-16 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
      >
        {/* Image */}
        <div className="w-full max-w-sm lg:max-w-md flex-shrink-0 rounded-2xl overflow-hidden">
          <Image
            src="/color-coding.png"
            alt="Color-coded badges — AINotKillEveryoneist or AI-Risk Denier"
            width={600}
            height={400}
            className="w-full h-auto object-cover rounded-2xl"
          />
        </div>

        {/* Text */}
        <div className="flex-1">
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-text mb-3">
            Color-coding
          </h3>
          <p className="text-sm sm:text-base text-text-muted leading-relaxed mb-4">
            Upon joining, you&rsquo;ll be asked to share your stance on AI risk.
            Based on your response, you&rsquo;ll receive a unique colour badge,
            instantly signalling your perspective to others during conversations.
          </p>
          <div className="space-y-2 mb-4">
            <p className="text-sm sm:text-base font-medium" style={{ color: "#e07a5f" }}>
              RED 🔥 If you are an AINotKillEveryoneist{" "}
              <span className="text-text-dim font-normal">(You worry about upcoming AI)</span>
            </p>
            <p className="text-sm sm:text-base font-medium" style={{ color: "#52b788" }}>
              Green 😏 If you are an AI-Risk denier{" "}
              <span className="text-text-dim font-normal">(You believe it will all be fine)</span>
            </p>
          </div>
          <p className="text-sm text-text-dim leading-relaxed">
            You can update your stance anytime via &ldquo;Channels &amp; Roles&rdquo; in the sidebar.
          </p>
        </div>
      </motion.div>

      {/* ── Tables ── */}
      <motion.div
        id="pub-tables"
        className="flex flex-col lg:flex-row-reverse items-center lg:items-start gap-8 lg:gap-14 px-4 sm:px-8 lg:px-16 py-12 sm:py-16 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
      >
        {/* Image */}
        <div className="w-full max-w-sm lg:max-w-md flex-shrink-0 rounded-2xl overflow-hidden">
          <Image
            src="/channels-tables.png"
            alt="100+ channels covering AI-Risk skepticisms and topics"
            width={600}
            height={400}
            className="w-full h-auto object-cover rounded-2xl"
          />
        </div>

        {/* Text */}
        <div className="flex-1">
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-text mb-3">
            Tables
          </h3>
          <p className="text-sm sm:text-base text-text-muted leading-relaxed mb-3">
            There is a table (text-channel) for each documented common
            skepticism, organised in categories. If you don&rsquo;t believe in
            AI risk, chances are the deep reason can be found in one or more of
            those tables.
          </p>
          <p className="text-sm sm:text-base text-text-muted leading-relaxed mb-3">
            Share your thoughts there, and the other side will respond and
            provide their rebuttal to your argument.
          </p>
          <p className="text-sm sm:text-base text-text-muted leading-relaxed">
            Each category also has its own voice channel, so there can be live
            discussions in parallel debating the arguments.
          </p>
        </div>
      </motion.div>

      {/* ── The "AI Ends" Name ── */}
      <motion.div
        id="pub-name"
        className="flex flex-col items-center px-4 sm:px-8 py-14 sm:py-20 max-w-2xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Image
            src="/AIEndsPub.png"
            alt="AI Ends Pub sign"
            width={56}
            height={56}
            className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg object-cover"
          />
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-text">
            The &ldquo;AI Ends&rdquo; name
          </h3>
        </div>

        <p className="text-sm sm:text-base text-text-muted leading-relaxed text-center mb-3">
          The name draws inspiration from London&rsquo;s famous World&rsquo;s End
          pub.
          <br />
          <span className="text-text font-medium">AI will mark the end of many things</span> &mdash; the
          hope is it ends disease, suffering, and poverty. It will also end
          society in its current form, potentially ushering in the end of
          drudgery and scarcity.
        </p>
        <p className="text-sm sm:text-base text-text-muted leading-relaxed text-center mb-3">
          But it will also signal the end of a long era where humans reigned as
          the apex intelligence. And as it heralds the close of an age, some
          fear it could literally lead to the end of the world &mdash; which
          ties back neatly to the World&rsquo;s End pub.
        </p>
        <p className="text-sm sm:text-base text-text leading-relaxed text-center font-medium italic">
          The AI Ends pub is a safe place where we can gather to discuss AI &mdash;
          by far the most interesting phenomenon of our time.
        </p>
      </motion.div>

      {/* ── Crusader Connection + CTA (merged) ── */}
      <motion.div
        id="pub-grab-a-chair"
        className="flex flex-col items-center justify-center px-4 py-20 sm:py-28"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm sm:text-base uppercase tracking-[0.2em] text-cautious/70 mb-4 font-body font-bold">
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

          {/* Emphasized quote block */}
          <div className="mt-8 mx-auto max-w-xl px-6 py-6 rounded-xl bg-white/[0.04] border border-cautious/20">
            <p className="text-base sm:text-lg text-cautious leading-relaxed font-medium m-0">
              The pub doesn&rsquo;t create crusaders through assignments or
              obligations. It creates them through belonging, confidence, and the
              simple realization that your voice matters.
            </p>
          </div>
        </div>

        {/* Pull up a chair — merged in */}
        <div className="mt-16 text-center">
          <h3 className="font-heading text-3xl sm:text-4xl font-bold text-text text-center mb-4">
            Pull up a chair.
          </h3>
          <p className="text-base text-text-muted text-center max-w-lg mx-auto leading-relaxed">
            AI Ends Pub is where the AI Risk Awareness Force finds its
            people. All the action paths are designed for the community
            &mdash; on their own terms.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
