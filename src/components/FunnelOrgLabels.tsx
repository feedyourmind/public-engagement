"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

interface OrgGroup {
  names: { label: string; color: string }[];
  braceColor: string;
  segFrom: number;
  segTo: number;
  staggerDelay: number;
}

const ORG_GROUPS: OrgGroup[] = [
  {
    names: [{ label: "Lethal Intelligence", color: "#52b788" }],
    braceColor: "#52b788",
    segFrom: 0, segTo: 2, staggerDelay: 0,
  },
  {
    names: [{ label: "Humans First", color: "#e07a5f" }],
    braceColor: "#e07a5f",
    segFrom: 3, segTo: 3, staggerDelay: 0.20,
  },
  {
    names: [
      { label: "Control AI", color: "#b5280f" },
      { label: "Pause AI", color: "#6b1114" },
    ],
    braceColor: "#b5280f",
    segFrom: 4, segTo: 5, staggerDelay: 0.40,
  },
];

function BraceRight({ height, color }: { height: number; color: string }) {
  const w = 20;
  const h = height;
  const mid = h / 2;
  const d = `M 0,0 C ${w * 0.5},0 ${w * 0.5},${mid} ${w},${mid} C ${w * 0.5},${mid} ${w * 0.5},${h} 0,${h}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <path d={d} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}

function OrgGroupItem({
  group,
  labelProgress,
  bandBoundaries,
}: {
  group: OrgGroup;
  labelProgress: MotionValue<number>;
  bandBoundaries: number[];
}) {
  const bandTop = bandBoundaries[group.segFrom] ?? 0;
  const bandBottom = bandBoundaries[group.segTo + 1] ?? bandTop + 30;
  const spanHeight = Math.max(20, bandBottom - bandTop);

  const opacity = useTransform(
    labelProgress,
    [group.staggerDelay, group.staggerDelay + 0.2],
    [0, 1],
    { clamp: true }
  );
  const translateX = useTransform(
    labelProgress,
    [group.staggerDelay, group.staggerDelay + 0.2],
    [20, 0],
    { clamp: true }
  );

  return (
    <motion.div
      className="absolute flex items-center gap-2"
      style={{
        top: bandTop,
        height: spanHeight,
        left: "100%",
        marginLeft: 4,
        opacity,
        x: translateX,
      }}
    >
      <BraceRight height={spanHeight} color={group.braceColor} />
      <div className="flex flex-col justify-center gap-1">
        {group.names.map((n) => (
          <span
            key={n.label}
            className="text-xs sm:text-sm font-bold whitespace-nowrap font-body"
            style={{ color: n.color }}
          >
            {n.label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

interface FunnelOrgLabelsProps {
  labelProgress: MotionValue<number>;
  bandBoundaries: number[];
  funnelWidth: number;
  funnelHeight: number;
}

export default function FunnelOrgLabels({
  labelProgress,
  bandBoundaries,
  funnelWidth,
  funnelHeight,
}: FunnelOrgLabelsProps) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ width: funnelWidth, height: funnelHeight }}
    >
      {ORG_GROUPS.map((group) => (
        <OrgGroupItem
          key={group.names[0].label}
          group={group}
          labelProgress={labelProgress}
          bandBoundaries={bandBoundaries}
        />
      ))}
    </div>
  );
}
