"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

/* ── Inline SVG icons ── */

function RocketIcon({ color }: { color: string }) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function PipelineIcon({ color }: { color: string }) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function PhoneIcon({ color }: { color: string }) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function MagazineIcon({ color }: { color: string }) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function GearIcon({ color }: { color: string }) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function BoltIcon({ color }: { color: string }) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export default function Section07c_HubVision() {
  return (
    <section id="hub-vision" className="relative">
      {/* ── Header ── */}
      <motion.div
        className="flex flex-col items-center px-4 pt-20 pb-6 sm:pt-28 sm:pb-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm uppercase tracking-[0.2em] text-[#e07a5f]/70 mb-3 font-body font-bold">
          What&rsquo;s Next
        </p>
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text text-center leading-tight tracking-tight mb-4">
          The Hub Is Being Re-engineered
        </h2>
        <p className="text-sm sm:text-base text-text-muted text-center max-w-2xl leading-relaxed">
          From a basic WordPress site to a{" "}
          <span className="text-text font-medium">self-sustaining content ecosystem</span>{" "}
          &mdash; deeply integrated with the Distribution Engine infrastructure &mdash;
          becomes a real-time multi-platform media presence (Digital Magazine, Mobile Apps)
          that brings AI safety content to the masses, making it a{" "}
          <span className="text-text font-medium">mainstream intellectual pursuit</span>.
        </p>
      </motion.div>

      {/* ── The Technical Leap ── */}
      <motion.div
        className="flex flex-col items-center px-4 sm:px-8 pb-10 max-w-4xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full p-6 sm:p-8 rounded-xl bg-[#e07a5f]/[0.06] border border-[#e07a5f]/20">
          <div className="flex items-center gap-3 mb-4">
            <RocketIcon color="#e07a5f" />
            <h3 className="text-lg sm:text-xl font-bold text-[#e07a5f]">
              The Technical Leap
            </h3>
          </div>
          <p className="text-sm sm:text-base text-text-muted leading-relaxed mb-4">
            The current Hub is admittedly outdated &mdash; a manual WordPress site built on
            yesterday&rsquo;s tech stack. It&rsquo;s being re-engineered from the ground up,
            transitioning from a manual repository into a{" "}
            <span className="text-text font-medium">self-sustaining content ecosystem</span>{" "}
            &mdash; unlocking frictionless publishing directly from the Creator Rooms of the
            Distribution Engine, as part of the workflow. Real-time journalism.
          </p>
        </div>
      </motion.div>

      {/* ── Pipeline + Multi-Platform ── */}
      <motion.div
        className="px-4 sm:px-8 lg:px-16 pb-12 max-w-5xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Automated Pipeline */}
          <div className="p-6 sm:p-7 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-3 mb-4">
              <PipelineIcon color="#f4a261" />
              <h4 className="text-base sm:text-lg font-semibold text-[#f4a261]">
                The Automated Pipeline
              </h4>
            </div>
            <p className="text-sm sm:text-base text-text-muted leading-relaxed mb-4">
              The Hub interfaces directly with the Distribution Engine&rsquo;s API. As the
              Engine identifies high-resonance &ldquo;Alpha&rdquo; content &mdash; viral clips
              that break through &mdash; that content is automatically funneled, formatted,
              and queued for publication.
            </p>
            <div className="flex items-center gap-2 text-sm text-text font-medium">
              <BoltIcon color="#f4a261" />
              <span>Zero-friction: from viral clip to permanent archive.</span>
            </div>
          </div>

          {/* Card 2: Content Quality */}
          <div className="p-6 sm:p-7 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-3 mb-4">
              <GearIcon color="#e07a5f" />
              <h4 className="text-base sm:text-lg font-semibold text-[#e07a5f]">
                Not Just Reposted &mdash; Refined
              </h4>
            </div>
            <p className="text-sm sm:text-base text-text-muted leading-relaxed mb-4">
              The creators working on the Distribution Engine allocate part of their bandwidth
              to The Hub. They don&rsquo;t just post &mdash; they ensure AI-discovered viral
              clips are contextualized with high-quality writing, proper sourcing, and
              magazine-ready headlines.
            </p>
            <p className="text-sm text-text-dim leading-relaxed">
              The Hub thrives on the best results from the Distribution Engine, turning raw
              viral content into polished, permanent resources.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── The "Lean-Back" Experience ── */}
      <motion.div
        className="flex flex-col items-center px-4 sm:px-8 pb-14 max-w-4xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
      >
        <h3 className="font-heading text-2xl sm:text-3xl font-bold text-text text-center mb-2">
          The &ldquo;Lean-Back&rdquo; Experience
        </h3>
        <p className="text-sm text-text-muted text-center max-w-lg mb-8">
          We aren&rsquo;t just building a website. We&rsquo;re building a media presence that
          follows you from your desk to your bed.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
          {/* Mobile Apps */}
          <motion.div
            className="p-5 sm:p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <PhoneIcon color="#52b788" />
              <h4 className="text-base sm:text-lg font-semibold text-[#52b788]">
                Mobile Apps
              </h4>
            </div>
            <p className="text-sm sm:text-base text-text-muted leading-relaxed m-0 mb-3">
              Dedicated iOS and Android apps with push notifications, offline reading, and a
              premium feel that a mobile browser can&rsquo;t replicate.
            </p>
            <p className="text-sm text-text-dim leading-relaxed m-0">
              Your daily dose of AI risk awareness &mdash; always in your pocket.
            </p>
          </motion.div>

          {/* Digital Magazine */}
          <motion.div
            className="p-5 sm:p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <MagazineIcon color="#e07a5f" />
              <h4 className="text-base sm:text-lg font-semibold text-[#e07a5f]">
                Digital Magazine
              </h4>
            </div>
            <p className="text-sm sm:text-base text-text-muted leading-relaxed m-0 mb-3">
              High-design, magazine-style layouts optimized for iPads and tablets. A weekly
              publication that turns AI safety content into a deep-dive reading experience.
            </p>
            <p className="text-sm text-text-dim leading-relaxed m-0">
              Capturing the bedtime slot &mdash; 30&ndash;60 minutes of deep reading instead
              of 15 seconds of scrolling.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* ── The Endgame: Force Multiplier ── */}
      <motion.div
        className="flex flex-col items-center px-4 sm:px-8 pt-4 pb-14 sm:pt-6 sm:pb-20 max-w-2xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
      >
        <h3 className="font-heading text-2xl sm:text-3xl font-bold text-text text-center mb-6">
          Lasting Value
        </h3>
        <div className="space-y-4 text-center">
          <p className="text-base sm:text-lg text-text-muted leading-relaxed">
            The Hub{" "}
            <span className="text-text font-medium">crystallizes and adds lasting value</span>{" "}
            to everything the Distribution Engine does.
          </p>
          <p className="text-base sm:text-lg text-text-muted leading-relaxed">
            Content that gets buried fast in social media feeds stays{" "}
            <span className="text-text font-medium">fresh and &ldquo;alive&rdquo;</span>{" "}
            here &mdash; always accessible, structured, organized, and up to date,
            thanks to the automated content pipeline.
          </p>
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { label: "Time on Site", sub: "Seconds to minutes", color: "#f4a261" },
              { label: "Always Fresh", sub: "Automated content funnel", color: "#52b788" },
              { label: "Growing Reach", sub: "Newsletter + App installs", color: "#e07a5f" },
            ].map((metric) => (
              <div
                key={metric.label}
                className="text-center px-3 py-4 rounded-lg bg-white/[0.03] border border-white/[0.06]"
              >
                <span
                  className="block text-sm sm:text-base font-semibold mb-1"
                  style={{ color: metric.color }}
                >
                  {metric.label}
                </span>
                <span className="text-xs text-text-dim">{metric.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Closing statement */}
        <div className="mt-10 px-6 py-6 rounded-xl bg-white/[0.04] border border-[#e07a5f]/20 max-w-xl">
          <p className="text-base sm:text-lg text-text leading-relaxed text-center font-medium m-0 mb-3">
            The goal: a professional, polished, and technically superior destination that
            makes AI safety content{" "}
            <span style={{ color: "#e07a5f" }}>exciting to consume</span>.
          </p>
          <p className="text-lg sm:text-xl text-text-muted leading-relaxed text-center italic m-0">
            The &ldquo;Digital Newspaper of AI Risk Awareness.&rdquo;
          </p>
        </div>
      </motion.div>
    </section>
  );
}
