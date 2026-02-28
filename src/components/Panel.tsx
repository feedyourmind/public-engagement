"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PanelProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export default function Panel({
  title,
  defaultOpen = true,
  children,
}: PanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl mb-4 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-5 py-3.5 bg-transparent border-none cursor-pointer text-text-muted"
      >
        <span className="text-xs uppercase tracking-widest font-medium font-body">
          {title}
        </span>
        <span
          className="text-lg text-text-dim transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}
        >
          ▾
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
