"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useVariationDisplay } from "@/context/VariationDisplayContext";
import type { VariationWithPresets } from "@/types";

export default function TopNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isSettings = pathname === "/settings";

  const isPlayground = pathname === "/playground";

  // Derive variation slug from the current URL
  // - On /settings?v=oliver → slug is "oliver"
  // - On /oliver → slug is "oliver"
  // - On / or /playground → no slug
  let variationSlug: string | null = null;
  if (isSettings) {
    variationSlug = searchParams.get("v");
  } else if (pathname !== "/" && !isPlayground && !pathname.startsWith("/api")) {
    variationSlug = pathname.slice(1); // Remove leading "/"
  }

  const settingsHref = isPlayground
    ? "/settings"
    : variationSlug
      ? `/settings?v=${variationSlug}`
      : "/settings";

  const backHref = variationSlug ? `/${variationSlug}` : "/";

  const { variationDisplayName, isPlaygroundView } = useVariationDisplay();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Only apply variation styling after hydration to avoid mismatch
  const showVariationBadge = mounted && !!variationDisplayName;
  const showPlaygroundNav = mounted && isPlaygroundView;

  // Variation dropdown state
  const [showDropdown, setShowDropdown] = useState(false);
  const [variationsList, setVariationsList] = useState<VariationWithPresets[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showDropdown) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showDropdown]);

  const handleUserIconClick = async () => {
    if (!showDropdown) {
      try {
        const res = await fetch("/api/variations");
        if (res.ok) {
          const data: VariationWithPresets[] = await res.json();
          setVariationsList(data);
        }
      } catch {}
    }
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-12 flex items-center justify-between px-4 sm:px-8 backdrop-blur-md border-b transition-colors ${
      showPlaygroundNav
        ? "bg-[#7f1d1d]/90 border-red-500/30"
        : showVariationBadge
          ? "bg-[#1a1520]/85 border-cautious/15"
          : "bg-bg/80 border-white/6"
    }`}>
      {/* Left: title or back link */}
      {isSettings ? (
        <Link
          href={backHref}
          className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 12L6 8l4-4" />
          </svg>
          Back
        </Link>
      ) : (
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              history.replaceState(null, "", "#top");
            }}
            className="p-1.5 -ml-1.5 rounded-lg text-text-muted hover:text-text transition-colors cursor-pointer bg-transparent border-none"
            aria-label="Scroll to top"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7" />
              <path d="M9 22V12h6v10" />
            </svg>
          </button>
          {[
            { id: "spectrum", label: "Spectrum", offset: 56 },
            { id: "goals", label: "Mission", offset: 350 },
            { id: "strategies", label: "Strategies", offset: 56 },
          ].map((link) => (
            <button
              key={link.id}
              onClick={() => {
                const el = document.getElementById(link.id);
                if (!el) return;
                const y = el.getBoundingClientRect().top + window.scrollY - link.offset;
                window.scrollTo({ top: y, behavior: "smooth" });
              }}
              className="text-xs text-text/50 hover:text-text transition-colors font-body cursor-pointer bg-transparent border-none"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}

      {/* Right: variation label + user icon + settings gear */}
      {!isSettings && (
        <div className="flex items-center gap-1">
          {/* Variation name badge */}
          {showVariationBadge && (
            showPlaygroundNav ? (
              <span className="text-xs text-white font-body font-semibold mr-2 px-2.5 py-1 rounded-lg border border-white/40 bg-white/15">
                Playground Mode
              </span>
            ) : (
              <span className="text-xs text-cautious/80 font-body mr-2 px-2.5 py-1 rounded-lg border border-cautious/20 bg-cautious/5">
                {variationDisplayName}&apos;s View
              </span>
            )
          )}

          {/* Exit playground button */}
          {showPlaygroundNav && (
            <Link
              href="/"
              className="text-xs text-white font-body font-semibold mr-2 px-3 py-1 rounded-lg bg-white/20 border border-white/30 hover:bg-white/30 transition-colors"
            >
              Exit
            </Link>
          )}

          {/* User / Variations dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleUserIconClick}
              className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-white/[0.06] transition-colors cursor-pointer"
              aria-label="Switch variation"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute top-full right-0 mt-1 z-50 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl py-1 min-w-44">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-text/30 font-body">
                  Variations
                </div>

                {variationsList.map((v) => {
                  const href = v.isDefault ? "/" : `/${v.slug}`;
                  const isActive = v.isDefault
                    ? !variationSlug
                    : variationSlug === v.slug;
                  return (
                    <Link
                      key={v.slug}
                      href={href}
                      onClick={() => setShowDropdown(false)}
                      className={`block px-3 py-2 text-xs font-body transition-colors ${
                        isActive
                          ? "text-white bg-white/10"
                          : "text-text/60 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      {v.name}
                      {v.isDefault && (
                        <span className="ml-1.5 text-[10px] text-text/30">
                          default
                        </span>
                      )}
                    </Link>
                  );
                })}

                {variationsList.length === 0 && (
                  <div className="px-3 py-2 text-xs text-text/30">
                    Loading...
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Settings gear */}
          <Link
            href={settingsHref}
            className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-white/[0.06] transition-colors"
            aria-label="Settings"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </Link>
        </div>
      )}
    </nav>
  );
}
