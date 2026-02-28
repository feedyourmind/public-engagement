"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

interface ScrollSectionProps {
  children: ReactNode;
  id: string;
  className?: string;
}

export default function ScrollSection({
  children,
  id,
  className = "",
}: ScrollSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}
