"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PasscodeModalProps {
  open: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<boolean>;
  title?: string;
}

export default function PasscodeModal({
  open,
  onClose,
  onVerify,
  title = "Enter Passcode",
}: PasscodeModalProps) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input when modal opens
  useEffect(() => {
    if (open) {
      setDigits(["", "", "", ""]);
      setError(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [open]);

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d?$/.test(value)) return;

      const newDigits = [...digits];
      newDigits[index] = value;
      setDigits(newDigits);
      setError(false);

      // Auto-advance to next input
      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit when all 4 digits entered
      if (value && index === 3 && newDigits.every((d) => d)) {
        const code = newDigits.join("");
        setLoading(true);
        onVerify(code).then((valid) => {
          setLoading(false);
          if (valid) {
            onClose();
          } else {
            setError(true);
            setDigits(["", "", "", ""]);
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
          }
        });
      }
    },
    [digits, onVerify, onClose]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      if (e.key === "Escape") {
        onClose();
      }
    },
    [digits, onClose]
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl px-8 py-7 shadow-2xl w-72"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-sm font-body font-medium text-text text-center mb-5">
              {title}
            </h3>

            <div className="flex justify-center gap-3 mb-4">
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  disabled={loading}
                  className={`w-11 h-13 text-center text-xl font-mono rounded-lg border bg-white/[0.04] text-text outline-none transition-all focus:ring-2 focus:ring-[#f4a261]/50 ${
                    error
                      ? "border-red-500/60 animate-shake"
                      : "border-white/10"
                  } ${loading ? "opacity-50" : ""}`}
                />
              ))}
            </div>

            {error && (
              <p className="text-xs text-red-400 text-center mb-2">
                Incorrect passcode
              </p>
            )}

            <button
              onClick={onClose}
              className="w-full text-xs text-text-muted hover:text-text transition-colors mt-2 cursor-pointer"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
