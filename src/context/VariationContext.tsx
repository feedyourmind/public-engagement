"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import type {
  VariationWithPresets,
  PresetRecord,
  PresetParams,
  EffectivePreset,
} from "@/types";
import { computeEffectivePresets } from "@/utils/presetMerge";
import { GOAL_PRESET } from "@/presets/systemPresets";

/* ── Playground localStorage helpers ── */

const PLAYGROUND_KEY = "playground_state";

interface PlaygroundData {
  overrides: PresetRecord[];
  extras: PresetRecord[];
  activePresetId: number | null;
  nextId: number; // negative, decrementing
}

function getDefaultPlayground(): PlaygroundData {
  return {
    overrides: [],
    extras: [],
    activePresetId: null,
    nextId: -1,
  };
}

function loadPlaygroundData(): PlaygroundData {
  try {
    const raw = localStorage.getItem(PLAYGROUND_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      // New format has "overrides" key
      if (data.overrides !== undefined) {
        return data as PlaygroundData;
      }
      // Old format detected — clear and start fresh
      localStorage.removeItem(PLAYGROUND_KEY);
    }
  } catch {}
  return getDefaultPlayground();
}

function savePlaygroundData(data: PlaygroundData) {
  try {
    localStorage.setItem(PLAYGROUND_KEY, JSON.stringify(data));
  } catch {}
}

/* ── Goal preset localStorage helpers ── */

function goalStorageKey(slug: string | undefined, playground: boolean) {
  return playground ? "goal_preset_playground" : `goal_preset_${slug ?? "default"}`;
}

function loadGoalPreset(slug: string | undefined, playground: boolean): PresetParams {
  try {
    const raw = localStorage.getItem(goalStorageKey(slug, playground));
    if (raw) return JSON.parse(raw) as PresetParams;
  } catch {}
  return { ...GOAL_PRESET };
}

function saveGoalPreset(slug: string | undefined, playground: boolean, params: PresetParams) {
  try {
    localStorage.setItem(goalStorageKey(slug, playground), JSON.stringify(params));
  } catch {}
}

/* ── Context ── */

interface VariationState {
  /* Data */
  variation: VariationWithPresets | null;
  allVariations: VariationWithPresets[];
  presets: EffectivePreset[];
  activePresetId: number | null;
  playgroundMode: boolean;
  playgroundReady: boolean;
  isDefaultVariation: boolean;

  /* Auth */
  isAuthenticated: boolean;
  sessionPasscode: string | null;
  verifyPasscode: (code: string) => Promise<boolean>;
  logout: () => void;

  /* Preset CRUD */
  selectPreset: (id: number | null) => void;
  createPreset: (
    label: string,
    params: PresetParams,
  ) => Promise<PresetRecord | null>;
  renamePreset: (id: number, label: string) => Promise<void>;
  deletePreset: (id: number) => Promise<void>;
  resetPresetToBase: (id: number) => Promise<void>;
  savePresetParams: (id: number, params: PresetParams) => void;

  /* Goal preset (system preset, per-variation) */
  goalParams: PresetParams;
  isGoalActive: boolean;
  selectGoal: () => void;
  updateGoalParams: (params: PresetParams) => void;

  /* Variation CRUD */
  createVariation: (
    name: string,
    passcode: string,
  ) => Promise<VariationWithPresets | null>;
  renameVariation: (name: string) => Promise<void>;
  deleteVariation: () => Promise<boolean>;
  refreshVariations: () => Promise<void>;
}

const VariationContext = createContext<VariationState | null>(null);

interface VariationProviderProps {
  initialVariation: VariationWithPresets | null;
  initialAllVariations: VariationWithPresets[];
  basePresets?: PresetRecord[];
  playgroundMode?: boolean;
  children: ReactNode;
}

export function VariationProvider({
  initialVariation,
  initialAllVariations,
  basePresets: basePresetsProp,
  playgroundMode: playgroundProp,
  children,
}: VariationProviderProps) {
  const isPlayground = playgroundProp ?? false;
  const isDefaultVariation = initialVariation?.isDefault === true;
  const hasBasePresets = (basePresetsProp?.length ?? 0) > 0;

  const [variation, setVariation] = useState(initialVariation);
  const [allVariations, setAllVariations] = useState(initialAllVariations);

  // Michael's base presets (mutable if editing Michael)
  const [basePresetsState, setBasePresetsState] = useState<PresetRecord[]>(
    basePresetsProp ?? [],
  );

  // Variation's own presets: overrides + extras (empty for Michael, loaded from LS for playground)
  const [rawPresets, setRawPresets] = useState<PresetRecord[]>(() => {
    if (isPlayground) return []; // loaded from localStorage later
    if (isDefaultVariation) return []; // Michael's presets come from basePresetsState
    if (!hasBasePresets) return initialVariation?.presets ?? []; // read-only pages (no merge)
    return initialVariation?.presets ?? [];
  });

  // Compute effective presets from base + raw
  const effectivePresets = useMemo<EffectivePreset[]>(() => {
    if (!hasBasePresets) {
      // No base presets provided (read-only page) — use raw presets directly
      return rawPresets.map((p) => ({
        ...p,
        inheritanceKind: "extra" as const,
        basePresetId: null,
      }));
    }
    if (isDefaultVariation) {
      // Michael: base presets ARE the effective presets
      return basePresetsState.map((p) => ({
        ...p,
        inheritanceKind: "base" as const,
        basePresetId: p.id,
      }));
    }
    return computeEffectivePresets(basePresetsState, rawPresets);
  }, [hasBasePresets, isDefaultVariation, basePresetsState, rawPresets]);

  const [activePresetId, setActivePresetId] = useState<number | null>(() => {
    if (isPlayground) return null; // set after localStorage load
    return effectivePresets[0]?.id ?? null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(isPlayground);
  const [sessionPasscode, setSessionPasscode] = useState<string | null>(null);
  const [playgroundReady, setPlaygroundReady] = useState(!isPlayground);

  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const nextIdRef = useRef(-1);
  const pendingOverrides = useRef(new Set<number>());

  const slug = variation?.slug;

  /* ── Goal preset state ── */
  const [goalParams, setGoalParams] = useState<PresetParams>({ ...GOAL_PRESET });
  const [isGoalActive, setIsGoalActive] = useState(false);

  // Load goal preset from localStorage on mount
  useEffect(() => {
    setGoalParams(loadGoalPreset(slug, isPlayground));
  }, [slug, isPlayground]);

  const selectGoal = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setIsGoalActive(true);
    setActivePresetId(null);
  }, []);

  const updateGoalParams = useCallback(
    (params: PresetParams) => {
      setGoalParams(params);
      saveGoalPreset(slug, isPlayground, params);
    },
    [slug, isPlayground],
  );

  /* ── Playground: load from localStorage on mount ── */
  useEffect(() => {
    if (!isPlayground) return;
    const data = loadPlaygroundData();
    setRawPresets([...data.overrides, ...data.extras]);
    setActivePresetId(
      data.activePresetId ?? basePresetsState[0]?.id ?? null,
    );
    nextIdRef.current = data.nextId;
    setPlaygroundReady(true);
  }, [isPlayground]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Playground: persist changes to localStorage ── */
  const pgMounted = useRef(false);
  useEffect(() => {
    if (!isPlayground) return;
    if (!pgMounted.current) {
      pgMounted.current = true;
      return;
    }
    const overrides = rawPresets.filter((p) => p.parentPresetId != null);
    const extras = rawPresets.filter((p) => p.parentPresetId == null);
    savePlaygroundData({
      overrides,
      extras,
      activePresetId,
      nextId: nextIdRef.current,
    });
  }, [rawPresets, activePresetId, isPlayground]);

  /* ── Auth ── */
  const verifyPasscode = useCallback(
    async (code: string) => {
      if (isPlayground) return true;
      if (!slug) return false;
      try {
        const res = await fetch(`/api/variations/${slug}/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ passcode: code }),
        });
        const data = await res.json();
        if (data.valid) {
          setIsAuthenticated(true);
          setSessionPasscode(code);
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [isPlayground, slug],
  );

  const logout = useCallback(() => {
    if (isPlayground) return;
    setIsAuthenticated(false);
    setSessionPasscode(null);
  }, [isPlayground]);

  /* ── Preset selection ── */
  const selectPreset = useCallback((id: number | null) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setIsGoalActive(false);
    setActivePresetId(id);
  }, []);

  /* ── Helper: debounced DB save ── */
  const debouncedDBSave = useCallback(
    (id: number, params: PresetParams) => {
      if (!slug || !sessionPasscode) return;
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(async () => {
        try {
          await fetch(`/api/variations/${slug}/presets/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "X-Passcode": sessionPasscode,
            },
            body: JSON.stringify(params),
          });
        } catch {}
      }, 500);
    },
    [slug, sessionPasscode],
  );

  /* ── Preset CRUD ── */
  const createPreset = useCallback(
    async (label: string, params: PresetParams) => {
      if (isPlayground) {
        const newId = nextIdRef.current--;
        const preset: PresetRecord = {
          id: newId,
          variationId: 0,
          parentPresetId: null,
          label,
          sortOrder: 0,
          ...params,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setRawPresets((prev) => [...prev, preset]);
        setActivePresetId(newId);
        return preset;
      }

      if (!slug || !sessionPasscode) return null;
      try {
        const res = await fetch(`/api/variations/${slug}/presets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Passcode": sessionPasscode,
          },
          body: JSON.stringify({ label, ...params }),
        });
        if (!res.ok) return null;
        const preset: PresetRecord = await res.json();
        if (isDefaultVariation) {
          setBasePresetsState((prev) => [...prev, preset]);
        } else {
          setRawPresets((prev) => [...prev, preset]);
        }
        setActivePresetId(preset.id);
        return preset;
      } catch {
        return null;
      }
    },
    [isPlayground, isDefaultVariation, slug, sessionPasscode],
  );

  const renamePreset = useCallback(
    async (id: number, label: string) => {
      const eff = effectivePresets.find((p) => p.id === id);
      if (!eff) return;

      // Inherited preset: copy-on-write
      if (eff.inheritanceKind === "base" && !isDefaultVariation) {
        if (isPlayground) {
          const newId = nextIdRef.current--;
          const override: PresetRecord = {
            id: newId,
            variationId: 0,
            parentPresetId: eff.basePresetId!,
            label,
            sortOrder: eff.sortOrder,
            loc: eff.loc,
            sc: eff.sc,
            sh: eff.sh,
            boundaries: eff.boundaries,
            zoom: eff.zoom,
            pan: eff.pan,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setRawPresets((prev) => [...prev, override]);
          setActivePresetId(newId);
          return;
        }
        if (!slug || !sessionPasscode) return;
        try {
          const res = await fetch(`/api/variations/${slug}/presets`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Passcode": sessionPasscode,
            },
            body: JSON.stringify({
              parentPresetId: eff.basePresetId,
              label,
              loc: eff.loc,
              sc: eff.sc,
              sh: eff.sh,
              boundaries: eff.boundaries,
              zoom: eff.zoom,
              pan: eff.pan,
            }),
          });
          if (!res.ok) return;
          const dbPreset: PresetRecord = await res.json();
          setRawPresets((prev) => [...prev, dbPreset]);
          setActivePresetId(dbPreset.id);
        } catch {}
        return;
      }

      // Michael base preset: rename directly
      if (eff.inheritanceKind === "base" && isDefaultVariation) {
        setBasePresetsState((prev) =>
          prev.map((p) =>
            p.id === id
              ? { ...p, label, updatedAt: new Date().toISOString() }
              : p,
          ),
        );
        if (slug && sessionPasscode) {
          try {
            await fetch(`/api/variations/${slug}/presets/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "X-Passcode": sessionPasscode,
              },
              body: JSON.stringify({ label }),
            });
          } catch {}
        }
        return;
      }

      // Override or extra: normal rename
      if (isPlayground) {
        setRawPresets((prev) =>
          prev.map((p) =>
            p.id === id
              ? { ...p, label, updatedAt: new Date().toISOString() }
              : p,
          ),
        );
        return;
      }
      if (!slug || !sessionPasscode) return;
      try {
        const res = await fetch(`/api/variations/${slug}/presets/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Passcode": sessionPasscode,
          },
          body: JSON.stringify({ label }),
        });
        if (!res.ok) return;
        const updated: PresetRecord = await res.json();
        setRawPresets((prev) => prev.map((p) => (p.id === id ? updated : p)));
      } catch {}
    },
    [effectivePresets, isDefaultVariation, isPlayground, slug, sessionPasscode],
  );

  const deletePreset = useCallback(
    async (id: number) => {
      const eff = effectivePresets.find((p) => p.id === id);
      if (!eff) return;

      if (isPlayground) {
        if (eff.inheritanceKind === "base") return; // can't delete inherited
        setRawPresets((prev) => prev.filter((p) => p.id !== id));
        setActivePresetId((prev) =>
          prev === id ? (eff.basePresetId ?? null) : prev,
        );
        return;
      }

      if (!slug || !sessionPasscode) return;

      if (isDefaultVariation) {
        // Michael deleting a base preset — CASCADE handles overrides
        try {
          const res = await fetch(`/api/variations/${slug}/presets/${id}`, {
            method: "DELETE",
            headers: { "X-Passcode": sessionPasscode },
          });
          if (!res.ok) return;
          setBasePresetsState((prev) => prev.filter((p) => p.id !== id));
          setActivePresetId((prev) => (prev === id ? null : prev));
        } catch {}
      } else {
        // Non-Michael: can only delete extras (overrides use resetPresetToBase)
        if (eff.inheritanceKind === "base") return;
        if (eff.inheritanceKind === "override") return; // use resetPresetToBase instead
        try {
          const res = await fetch(`/api/variations/${slug}/presets/${id}`, {
            method: "DELETE",
            headers: { "X-Passcode": sessionPasscode },
          });
          if (!res.ok) return;
          setRawPresets((prev) => prev.filter((p) => p.id !== id));
          setActivePresetId((prev) => (prev === id ? null : prev));
        } catch {}
      }
    },
    [effectivePresets, isPlayground, isDefaultVariation, slug, sessionPasscode],
  );

  const resetPresetToBase = useCallback(
    async (id: number) => {
      const eff = effectivePresets.find((p) => p.id === id);
      if (!eff || eff.inheritanceKind !== "override") return;

      if (isPlayground) {
        setRawPresets((prev) => prev.filter((p) => p.id !== id));
        setActivePresetId(eff.basePresetId);
        return;
      }

      if (!slug || !sessionPasscode) return;
      try {
        const res = await fetch(`/api/variations/${slug}/presets/${id}`, {
          method: "DELETE",
          headers: { "X-Passcode": sessionPasscode },
        });
        if (!res.ok) return;
        setRawPresets((prev) => prev.filter((p) => p.id !== id));
        setActivePresetId(eff.basePresetId);
      } catch {}
    },
    [effectivePresets, isPlayground, slug, sessionPasscode],
  );

  const savePresetParams = useCallback(
    (id: number, params: PresetParams) => {
      const eff = effectivePresets.find((p) => p.id === id);
      if (!eff) return;

      // Copy-on-write for inherited presets on non-default variations
      if (eff.inheritanceKind === "base" && !isDefaultVariation) {
        if (isPlayground) {
          const newId = nextIdRef.current--;
          const override: PresetRecord = {
            id: newId,
            variationId: 0,
            parentPresetId: eff.basePresetId!,
            label: eff.label,
            sortOrder: eff.sortOrder,
            ...params,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setRawPresets((prev) => [...prev, override]);
          setActivePresetId(newId);
          return;
        }

        // DB mode: create override via API (with dedup guard)
        if (!slug || !sessionPasscode) return;
        const baseId = eff.basePresetId!;
        if (pendingOverrides.current.has(baseId)) return;
        pendingOverrides.current.add(baseId);

        (async () => {
          try {
            const res = await fetch(`/api/variations/${slug}/presets`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Passcode": sessionPasscode,
              },
              body: JSON.stringify({
                parentPresetId: baseId,
                label: eff.label,
                ...params,
              }),
            });
            if (!res.ok) return;
            const dbPreset: PresetRecord = await res.json();
            setRawPresets((prev) => [...prev, dbPreset]);
            setActivePresetId(dbPreset.id);
          } finally {
            pendingOverrides.current.delete(baseId);
          }
        })();
        return;
      }

      // Michael editing own base preset
      if (isDefaultVariation && eff.inheritanceKind === "base") {
        setBasePresetsState((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...params } : p)),
        );
        debouncedDBSave(id, params);
        return;
      }

      // Override or extra: normal save
      if (isPlayground) {
        setRawPresets((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...params } : p)),
        );
        return;
      }

      setRawPresets((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...params } : p)),
      );
      debouncedDBSave(id, params);
    },
    [
      effectivePresets,
      isDefaultVariation,
      isPlayground,
      slug,
      sessionPasscode,
      debouncedDBSave,
    ],
  );

  /* ── Variation CRUD ── */
  const createVariation = useCallback(
    async (name: string, passcode: string) => {
      try {
        const res = await fetch("/api/variations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, passcode }),
        });
        if (!res.ok) return null;
        const created = await res.json();
        const full: VariationWithPresets = { ...created, presets: [] };
        setAllVariations((prev) => [...prev, full]);
        return full;
      } catch {
        return null;
      }
    },
    [],
  );

  const renameVariation = useCallback(
    async (name: string) => {
      if (isPlayground || !slug || !sessionPasscode) return;
      try {
        const res = await fetch(`/api/variations/${slug}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Passcode": sessionPasscode,
          },
          body: JSON.stringify({ name }),
        });
        if (!res.ok) return;
        const updated = await res.json();
        setVariation((prev) => (prev ? { ...prev, ...updated } : prev));
        setAllVariations((prev) =>
          prev.map((v) => (v.slug === slug ? { ...v, ...updated } : v)),
        );
      } catch {}
    },
    [isPlayground, slug, sessionPasscode],
  );

  const deleteVariation = useCallback(async () => {
    if (isPlayground || !slug || !sessionPasscode) return false;
    try {
      const res = await fetch(`/api/variations/${slug}`, {
        method: "DELETE",
        headers: { "X-Passcode": sessionPasscode },
      });
      return res.ok;
    } catch {
      return false;
    }
  }, [isPlayground, slug, sessionPasscode]);

  const refreshVariations = useCallback(async () => {
    try {
      const res = await fetch("/api/variations");
      if (res.ok) {
        const data: VariationWithPresets[] = await res.json();
        setAllVariations(data);
      }
    } catch {}
  }, []);

  const value: VariationState = {
    variation,
    allVariations,
    presets: effectivePresets,
    activePresetId,
    playgroundMode: isPlayground,
    playgroundReady,
    isDefaultVariation,
    isAuthenticated,
    sessionPasscode,
    verifyPasscode,
    logout,
    selectPreset,
    createPreset,
    renamePreset,
    deletePreset,
    resetPresetToBase,
    savePresetParams,
    goalParams,
    isGoalActive,
    selectGoal,
    updateGoalParams,
    createVariation,
    renameVariation,
    deleteVariation,
    refreshVariations,
  };

  return (
    <VariationContext.Provider value={value}>
      {children}
    </VariationContext.Provider>
  );
}

export function useVariation() {
  const ctx = useContext(VariationContext);
  if (!ctx)
    throw new Error("useVariation must be used within a VariationProvider");
  return ctx;
}
