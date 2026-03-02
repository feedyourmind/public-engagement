"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ── Niche examples ── */

const NICHE_EXAMPLES = [
  {
    niche: "Transportation & Drivers",
    icon: "truck",
    accent: "#f4a261",
    accentBg: "rgba(244,162,97,0.08)",
    accentBorder: "rgba(244,162,97,0.2)",
    audiences: [
      "Taxi drivers",
      "Bus drivers",
      "Truck drivers",
      "Delivery drivers",
      "Ride-share communities",
    ],
    hook: "Full vehicle automation is coming. The entire transportation sector — millions of jobs — faces complete collapse within years, not decades.",
    content:
      "We create a series of posts and short videos showing the rapid progress of autonomous vehicles, the timeline to full automation, and what it means for everyone in the sector. Real data, real timelines, real consequences.",
    distribution:
      "We find popular accounts and groups with large followings in the driving and transportation community. We partner with them to post our content — reaching audiences who are directly affected but may not yet be paying attention.",
  },
  {
    niche: "Education & Schools",
    icon: "school",
    accent: "#67d4e8",
    accentBg: "rgba(103,212,232,0.08)",
    accentBorder: "rgba(103,212,232,0.2)",
    audiences: [
      "Parents",
      "Teachers",
      "School counselors",
      "University students",
      "Education influencers",
    ],
    hook: "Children today have no idea what career to prepare for. Massive disruption in the job market is making traditional education pathways increasingly meaningless.",
    content:
      "Content that speaks to parents and educators about the crisis of career planning in the age of AI. What do you tell a child studying for a profession that may not exist by the time they graduate?",
    distribution:
      "We target influencers in the education space — parenting accounts, teacher communities, education reform advocates — and have them share our content with audiences who are already anxious about the future of learning.",
  },
  {
    niche: "Software Engineering",
    icon: "code",
    accent: "#c084fc",
    accentBg: "rgba(192,132,252,0.08)",
    accentBorder: "rgba(192,132,252,0.2)",
    audiences: [
      "Software developers",
      "Bootcamp graduates",
      "CS students",
      "Tech workers",
      "Developer community leads",
    ],
    hook: "The skills software engineers have fought so hard to build are rapidly becoming irrelevant. Coding is increasingly a thing of the past — AI is already writing better code than most humans.",
    content:
      "Posts and videos showing AI coding capabilities, the shrinking demand for traditional programming skills, and what this means for millions of developers who built their careers on technical expertise.",
    distribution:
      "Big accounts in the software engineering space — dev influencers, coding tutorial channels, tech career pages — share our content with audiences who are directly experiencing this transformation.",
  },
];

/* ── Inline SVG icons ── */

function NicheIcon({ name, color }: { name: string; color: string }) {
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
    case "truck":
      return (
        <svg {...props}>
          <path d="M1 3h15v13H1z" />
          <path d="M16 8h4l3 4v5h-7V8z" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      );
    case "school":
      return (
        <svg {...props}>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" />
        </svg>
      );
    case "code":
      return (
        <svg {...props}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
          <line x1="14" y1="4" x2="10" y2="20" />
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

/* ── Niche card ── */

function NicheCard({
  example,
  index,
}: {
  example: (typeof NICHE_EXAMPLES)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className="rounded-xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderLeft: `3px solid ${example.accent}`,
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 40,
        transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div className="p-5 sm:p-7">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: example.accentBg,
              border: `1px solid ${example.accentBorder}`,
            }}
          >
            <NicheIcon name={example.icon} color={example.accent} />
          </div>
          <div>
            <h4 className="text-base font-semibold text-text">
              {example.niche}
            </h4>
            <p className="text-sm text-text-dim">
              {example.audiences.slice(0, 3).join(" \u00B7 ")}
              {example.audiences.length > 3 && " \u00B7 \u2026"}
            </p>
          </div>
        </div>

        {/* The hook — what the content says */}
        <div
          className="rounded-lg px-4 sm:px-5 py-3.5 mb-5 text-sm leading-relaxed italic text-text-muted"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderLeft: `2px solid ${example.accent}40`,
          }}
        >
          &ldquo;{example.hook}&rdquo;
        </div>

        {/* Content creation */}
        <div className="mb-4">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: example.accent }}
          >
            Content
          </p>
          <p className="text-sm text-text-muted leading-relaxed">
            {example.content}
          </p>
        </div>

        {/* Distribution */}
        <div
          className="rounded-lg px-4 sm:px-5 py-4 text-sm"
          style={{
            background: example.accentBg,
            border: `1px solid ${example.accentBorder}`,
          }}
        >
          <span className="font-semibold" style={{ color: example.accent }}>
            Distribution:
          </span>{" "}
          <span className="text-text-muted">{example.distribution}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main section ── */

export default function Section10b_InfluencerDeals() {
  return (
    <section id="influencer-deals" className="relative">
      {/* ── Hero ── */}
      <motion.div
        className="flex flex-col items-center justify-center px-4 pt-24 pb-6 sm:pt-32 sm:pb-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm sm:text-base uppercase tracking-[0.2em] text-cautious/70 mb-4 font-body font-bold">
          High-Leverage Strategy
        </p>
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text text-center leading-tight tracking-tight mb-4">
          Influencer Deals
        </h2>
        <p className="text-base sm:text-lg text-text-muted text-center max-w-2xl leading-relaxed mb-6">
          Once the infrastructure is in place &mdash; or even in parallel
          &mdash; we pursue an additional high-leverage strategy: targeting
          specific niche communities with content that speaks directly to their
          reality.
        </p>

        {/* The strategy explained */}
        <div className="max-w-2xl w-full space-y-4">
          <div
            className="rounded-xl p-5 sm:p-6"
            style={{
              background: "rgba(244,162,97,0.08)",
              border: "1px solid rgba(244,162,97,0.2)",
            }}
          >
            <h4
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: "#f4a261" }}
            >
              The Playbook
            </h4>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span
                  className="text-sm font-mono font-bold shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(244,162,97,0.2)",
                    color: "#f4a261",
                  }}
                >
                  1
                </span>
                <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                  <span className="text-text font-medium">
                    Identify a niche community
                  </span>{" "}
                  &mdash; drivers, teachers, software engineers, nurses, artists,
                  factory workers &mdash; any group whose livelihood is directly
                  threatened by AI.
                </p>
              </div>
              <div className="flex gap-3">
                <span
                  className="text-sm font-mono font-bold shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(244,162,97,0.2)",
                    color: "#f4a261",
                  }}
                >
                  2
                </span>
                <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                  <span className="text-text font-medium">
                    Find popular accounts
                  </span>{" "}
                  with large followings in that community &mdash; pages, groups,
                  influencers who already have the audience&rsquo;s trust.
                </p>
              </div>
              <div className="flex gap-3">
                <span
                  className="text-sm font-mono font-bold shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(244,162,97,0.2)",
                    color: "#f4a261",
                  }}
                >
                  3
                </span>
                <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                  <span className="text-text font-medium">
                    Create targeted content
                  </span>{" "}
                  &mdash; videos, posts, articles &mdash; showing exactly how AI
                  disrupts that specific sector. Real data, real consequences.
                </p>
              </div>
              <div className="flex gap-3">
                <span
                  className="text-sm font-mono font-bold shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(244,162,97,0.2)",
                    color: "#f4a261",
                  }}
                >
                  4
                </span>
                <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                  <span className="text-text font-medium">
                    Pay those accounts to post and distribute
                  </span>{" "}
                  our content. The content includes links back to the hub and our
                  assets &mdash; driving organic inbound traffic from audiences
                  who are personally affected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Niche Example Cards ── */}
      <div className="relative z-10 px-4 sm:px-8 lg:px-16 pt-6 pb-10 max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-text mb-3">
            Example Niches
          </h3>
          <p className="text-base text-text-muted leading-relaxed max-w-xl mx-auto">
            An endless stream of communities to target &mdash; each one a new
            funnel into AI risk awareness.
          </p>
        </motion.div>

        <div className="flex flex-col gap-6">
          {NICHE_EXAMPLES.map((example, i) => (
            <NicheCard key={example.niche} example={example} index={i} />
          ))}
        </div>
      </div>

      {/* ── Scaling & Resources ── */}
      <motion.div
        className="flex flex-col items-center px-4 sm:px-8 pt-10 pb-20 sm:pb-28 max-w-2xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
      >
        <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-text text-center mb-6 leading-tight">
          An Endless Stream of Opportunities
        </h3>
        <div className="space-y-4 text-center">
          <p className="text-base sm:text-lg text-text-muted leading-relaxed">
            Drivers, teachers, software engineers &mdash; these are just the
            beginning. Every profession, every community touched by AI
            disruption is a potential channel.
          </p>
          <p className="text-base sm:text-lg text-text-muted leading-relaxed">
            With dedicated resources, we can{" "}
            <span className="text-text font-medium">
              consistently explore new opportunities
            </span>
            , create targeted content, build relationships with niche accounts,
            and drive organic inbound traffic &mdash; every single day.
          </p>
        </div>

        {/* Key operations */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 w-full">
          <div
            className="text-center px-4 py-4 rounded-lg"
            style={{
              background: "rgba(82,183,136,0.08)",
              border: "1px solid rgba(82,183,136,0.2)",
            }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-1 font-semibold"
              style={{ color: "#52b788" }}
            >
              Scout
            </p>
            <p className="text-sm text-text-muted">
              Identify niches &amp; find popular accounts
            </p>
          </div>
          <div
            className="text-center px-4 py-4 rounded-lg"
            style={{
              background: "rgba(244,162,97,0.08)",
              border: "1px solid rgba(244,162,97,0.2)",
            }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-1 font-semibold"
              style={{ color: "#f4a261" }}
            >
              Create
            </p>
            <p className="text-sm text-text-muted">
              Produce targeted content for each sector
            </p>
          </div>
          <div
            className="text-center px-4 py-4 rounded-lg"
            style={{
              background: "rgba(192,132,252,0.08)",
              border: "1px solid rgba(192,132,252,0.2)",
            }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-1 font-semibold"
              style={{ color: "#c084fc" }}
            >
              Partner
            </p>
            <p className="text-sm text-text-muted">
              Build deals with accounts to distribute
            </p>
          </div>
        </div>

        <div
          className="mt-8 px-6 py-5 rounded-xl w-full"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p className="text-base sm:text-lg text-text leading-relaxed text-center font-medium m-0">
            Every piece of content links back to the hub. Every viewer becomes a
            potential convert. Every niche is a new front in the movement.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
