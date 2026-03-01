"use client";

import { useState, useRef, useEffect } from "react";
import { useDistribution } from "@/context/DistributionContext";
import { useVariation } from "@/context/VariationContext";

export default function PresetButtons() {
  const { applyPreset, location, scale, shape, boundaries, zoom, pan } = useDistribution();
  const {
    presets,
    activePresetId,
    selectPreset,
    createPreset,
    renamePreset,
    deletePreset,
    resetPresetToBase,
    resetAllPresets,
    isAuthenticated,
    isDefaultVariation,
    goalParams,
    isGoalActive,
    selectGoal,
  } = useVariation();

  const [showAdd, setShowAdd] = useState(false);
  const [addLabel, setAddLabel] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [menuId, setMenuId] = useState<number | null>(null);
  const addInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuId) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuId]);

  // Focus add input
  useEffect(() => {
    if (showAdd) addInputRef.current?.focus();
  }, [showAdd]);

  // Focus edit input
  useEffect(() => {
    if (editingId) editInputRef.current?.focus();
  }, [editingId]);

  const handleSelect = (preset: (typeof presets)[0]) => {
    selectPreset(preset.id);
    applyPreset({
      loc: preset.loc,
      sc: preset.sc,
      sh: preset.sh,
      boundaries: preset.boundaries,
      zoom: preset.zoom ?? 1.0,
      pan: preset.pan ?? 0,
    });
  };

  const handleAdd = async () => {
    if (!addLabel.trim()) return;
    await createPreset(addLabel.trim(), {
      loc: location,
      sc: scale,
      sh: shape,
      boundaries,
      zoom,
      pan,
    });
    setAddLabel("");
    setShowAdd(false);
  };

  const handleRename = async (id: number) => {
    if (!editLabel.trim()) {
      setEditingId(null);
      return;
    }
    await renamePreset(id, editLabel.trim());
    setEditingId(null);
  };

  const handleDelete = async (id: number) => {
    await deletePreset(id);
    setMenuId(null);
  };

  const handleReset = async (id: number) => {
    const eff = presets.find((p) => p.id === id);
    await resetPresetToBase(id);
    setMenuId(null);
    // After reset, apply the base preset values if available
    if (eff?.basePresetId) {
      const base = presets.find(
        (p) => p.inheritanceKind === "base" && p.basePresetId === eff.basePresetId,
      );
      if (base) {
        applyPreset({
          loc: base.loc,
          sc: base.sc,
          sh: base.sh,
          boundaries: base.boundaries,
          zoom: base.zoom ?? 1.0,
          pan: base.pan ?? 0,
        });
      }
    }
  };

  const handleResetAll = async () => {
    await resetAllPresets();
    // Apply first base preset values
    const firstBase = presets.find((p) => p.inheritanceKind === "base");
    if (firstBase) {
      applyPreset({
        loc: firstBase.loc,
        sc: firstBase.sc,
        sh: firstBase.sh,
        boundaries: firstBase.boundaries,
        zoom: firstBase.zoom ?? 1.0,
        pan: firstBase.pan ?? 0,
      });
    }
  };

  const handleSelectGoal = () => {
    selectGoal();
    applyPreset(goalParams);
  };

  // Show reset buttons in playground (or non-default variations) when there are overrides or extras
  const hasOverrides = !isDefaultVariation && presets.some(
    (p) => p.inheritanceKind === "override" || p.inheritanceKind === "extra",
  );

  return (
    <div className="flex gap-2 flex-wrap mb-5 items-center">
      {/* Reset All button */}
      {hasOverrides && (
        <>
          <button
            onClick={handleResetAll}
            className="px-3 py-1.5 rounded-full border border-cautious/20 text-cautious/60 text-xs font-body cursor-pointer transition-all hover:border-cautious/40 hover:text-cautious hover:bg-cautious/10"
            title="Reset all presets to default values"
          >
            Reset All
          </button>
          <div className="w-px h-5 bg-white/10 mx-1" />
        </>
      )}

      {presets.map((p) =>
        editingId === p.id ? (
          <form
            key={p.id}
            onSubmit={(e) => {
              e.preventDefault();
              handleRename(p.id);
            }}
            className="inline-flex"
          >
            <input
              ref={editInputRef}
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              onBlur={() => handleRename(p.id)}
              className="px-3 py-1 rounded-full border border-[#f4a261]/40 bg-white/[0.06] text-text text-xs font-body outline-none w-32"
            />
          </form>
        ) : (
          <div key={p.id} className="relative">
            <button
              onClick={() => handleSelect(p)}
              onContextMenu={(e) => {
                if (!isAuthenticated) return;
                e.preventDefault();
                setMenuId(menuId === p.id ? null : p.id);
              }}
              className={`px-4 py-1.5 rounded-full border text-xs font-body cursor-pointer transition-all ${
                p.id === activePresetId
                  ? "bg-white/15 text-white border-white/25"
                  : "bg-white/[0.04] text-text/80 border-white/10 hover:bg-white/10 hover:text-white"
              }`}
              title={
                p.inheritanceKind === "base"
                  ? "Inherited from default"
                  : p.inheritanceKind === "override"
                    ? "Overridden"
                    : undefined
              }
            >
              {p.inheritanceKind === "base" && !isDefaultVariation && (
                <span className="opacity-40 mr-1">&#8593;</span>
              )}
              {p.label}
            </button>

            {/* Inline reset button for overridden presets */}
            {p.inheritanceKind === "override" && !isDefaultVariation && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset(p.id);
                }}
                className="-ml-1 px-1.5 py-1.5 text-cautious/50 hover:text-cautious text-xs cursor-pointer transition-colors"
                title="Reset to default"
              >
                &#8635;
              </button>
            )}

            {/* Context menu */}
            {menuId === p.id && isAuthenticated && (
              <div
                ref={menuRef}
                className="absolute top-full left-0 mt-1 z-50 bg-[#222] border border-white/10 rounded-lg shadow-xl py-1 min-w-28"
              >
                <button
                  onClick={() => {
                    setEditLabel(p.label);
                    setEditingId(p.id);
                    setMenuId(null);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs text-text/70 hover:bg-white/10 hover:text-text transition-colors cursor-pointer"
                >
                  Rename
                </button>
                {/* Override: show Reset to Default */}
                {p.inheritanceKind === "override" && (
                  <button
                    onClick={() => handleReset(p.id)}
                    className="w-full px-3 py-1.5 text-left text-xs text-cautious/70 hover:bg-cautious/10 hover:text-cautious transition-colors cursor-pointer"
                  >
                    Reset to Default
                  </button>
                )}
                {/* Extra presets: show Delete */}
                {p.inheritanceKind === "extra" && (
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="w-full px-3 py-1.5 text-left text-xs text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                )}
                {/* Default variation (Michael): can delete any preset */}
                {isDefaultVariation && p.inheritanceKind === "base" && (
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="w-full px-3 py-1.5 text-left text-xs text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        )
      )}

      {/* Goal system preset — always visible */}
      <div className="w-px h-5 bg-white/10 mx-1" />
      <button
        onClick={handleSelectGoal}
        className={`px-4 py-1.5 rounded-full border text-xs font-body cursor-pointer transition-all ${
          isGoalActive
            ? "bg-[#52b788]/20 text-[#52b788] border-[#52b788]/40"
            : "bg-white/[0.04] text-[#52b788]/70 border-[#52b788]/20 hover:bg-[#52b788]/10 hover:text-[#52b788]"
        }`}
        title="Goal preset — the target distribution shape"
      >
        Goal
      </button>

      {/* Add preset */}
      {isAuthenticated &&
        (showAdd ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd();
            }}
            className="inline-flex gap-1.5"
          >
            <input
              ref={addInputRef}
              type="text"
              value={addLabel}
              onChange={(e) => setAddLabel(e.target.value)}
              onBlur={() => {
                if (!addLabel.trim()) setShowAdd(false);
              }}
              placeholder="Preset name..."
              className="px-3 py-1 rounded-full border border-[#f4a261]/30 bg-white/[0.04] text-text text-xs font-body outline-none w-32 placeholder:text-text/30"
            />
            <button
              type="submit"
              className="px-3 py-1 rounded-full bg-[#f4a261] text-black text-xs font-medium cursor-pointer hover:bg-[#f4a261]/90 transition-colors"
            >
              Save
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowAdd(true)}
            className="px-3 py-1.5 rounded-full border border-dashed border-white/15 text-text/40 text-xs font-body cursor-pointer transition-all hover:border-white/30 hover:text-text/70"
            title="Add preset with current settings"
          >
            + Preset
          </button>
        ))}

      {presets.length === 0 && (
        <span className="text-xs text-text/30 font-body">
          No presets yet.{" "}
          {isAuthenticated
            ? "Click + to create one."
            : "Unlock to add presets."}
        </span>
      )}
    </div>
  );
}
