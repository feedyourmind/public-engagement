"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVariation } from "@/context/VariationContext";
import PasscodeModal from "./PasscodeModal";

export default function VariationTabs() {
  const {
    variation,
    allVariations,
    playgroundMode,
    isAuthenticated,
    verifyPasscode,
    logout,
    createVariation,
  } = useVariation();
  const router = useRouter();

  const [showPasscode, setShowPasscode] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPasscode, setNewPasscode] = useState("");
  const [createError, setCreateError] = useState("");

  const activeSlug = variation?.slug;

  const viewHref = playgroundMode
    ? "/playground"
    : variation?.isDefault
      ? "/"
      : `/${variation?.slug}`;

  const viewLabel = playgroundMode
    ? "View Playground Variation"
    : `View ${variation?.name ?? "Default"} Variation`;

  const handleTabClick = (slug: string) => {
    if (slug === activeSlug && !playgroundMode) return;
    router.push(`/settings?v=${slug}`);
    router.refresh();
  };

  const handlePlaygroundClick = () => {
    if (playgroundMode) return;
    router.push("/settings");
    router.refresh();
  };

  const handleCreateSubmit = async () => {
    setCreateError("");
    if (!newName.trim()) {
      setCreateError("Name is required");
      return;
    }
    if (!/^\d{4}$/.test(newPasscode)) {
      setCreateError("Passcode must be exactly 4 digits");
      return;
    }

    const result = await createVariation(newName.trim(), newPasscode);
    if (result) {
      setShowCreate(false);
      setNewName("");
      setNewPasscode("");
      router.push(`/settings?v=${result.slug}`);
      router.refresh();
    } else {
      setCreateError("A variation with this name may already exist");
    }
  };

  return (
    <div className="mb-6">
      {/* Variation tabs row */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        {/* Playground tab — always first */}
        <button
          onClick={handlePlaygroundClick}
          className={`px-4 py-1.5 rounded-full text-xs font-body cursor-pointer transition-all ${
            playgroundMode
              ? "bg-white/15 text-white border border-white/20"
              : "bg-white/[0.04] text-text/60 border border-white/10 hover:bg-white/10 hover:text-white"
          }`}
        >
          Playground
        </button>

        {/* DB variation tabs */}
        {allVariations.map((v) => (
          <button
            key={v.slug}
            onClick={() => handleTabClick(v.slug)}
            className={`px-4 py-1.5 rounded-full text-xs font-body cursor-pointer transition-all ${
              !playgroundMode && v.slug === activeSlug
                ? "bg-white/15 text-white border border-white/20"
                : "bg-white/[0.04] text-text/60 border border-white/10 hover:bg-white/10 hover:text-white"
            }`}
          >
            {v.name}
            {v.isDefault && (
              <span className="ml-1 text-[10px] text-text/40">(default)</span>
            )}
          </button>
        ))}

        {/* Add variation button */}
        <button
          onClick={() => setShowCreate(true)}
          className="px-3 py-1.5 rounded-full border border-dashed border-white/15 text-text/40 text-xs font-body cursor-pointer transition-all hover:border-white/30 hover:text-text/70"
          title="Add variation"
        >
          +
        </button>

        {/* Auth button — only for DB variations, not playground */}
        {variation && !playgroundMode && (
          <div className="ml-auto">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-green-400/70 hover:text-green-400 transition-colors cursor-pointer"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Unlocked
              </button>
            ) : (
              <button
                onClick={() => setShowPasscode(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text/40 hover:text-text/70 transition-colors cursor-pointer"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Unlock to edit
              </button>
            )}
          </div>
        )}
      </div>

      {/* View Variation — prominent link, opens in new tab */}
      <a
        href={viewHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-cautious/40 bg-cautious/10 text-cautious text-sm font-body font-medium transition-all hover:bg-cautious/20 hover:border-cautious/60"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        {viewLabel}
      </a>

      {/* Passcode modal */}
      <PasscodeModal
        open={showPasscode}
        onClose={() => setShowPasscode(false)}
        onVerify={verifyPasscode}
        title={`Unlock "${variation?.name}" to edit`}
      />

      {/* Create variation modal */}
      {showCreate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreate(false)}
          />
          <div className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl px-8 py-7 shadow-2xl w-80">
            <h3 className="text-sm font-body font-medium text-text text-center mb-5">
              New Variation
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-text-muted mb-1">
                  Your name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Oliver"
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.04] text-text text-sm outline-none focus:ring-2 focus:ring-cautious/50"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs text-text-muted mb-1">
                  4-digit passcode
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={newPasscode}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    setNewPasscode(v);
                  }}
                  placeholder="0000"
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.04] text-text text-sm font-mono outline-none focus:ring-2 focus:ring-cautious/50"
                />
              </div>

              {createError && (
                <p className="text-xs text-red-400">{createError}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCreate(false);
                    setNewName("");
                    setNewPasscode("");
                    setCreateError("");
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-text/60 text-xs cursor-pointer hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSubmit}
                  className="flex-1 px-4 py-2 rounded-lg bg-cautious text-black text-xs font-medium cursor-pointer hover:bg-cautious/90 transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
