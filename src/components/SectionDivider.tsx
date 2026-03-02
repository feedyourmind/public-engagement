"use client";

export default function SectionDivider() {
  return (
    <div className="relative py-12 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-cautious/40 to-transparent" />
      <div className="absolute w-2 h-2 rounded-full bg-cautious/50" />
    </div>
  );
}
