"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface VariationDisplayState {
  variationDisplayName: string | null;
  setVariationDisplayName: (name: string | null) => void;
  isPlaygroundView: boolean;
  setIsPlaygroundView: (v: boolean) => void;
}

const VariationDisplayContext = createContext<VariationDisplayState>({
  variationDisplayName: null,
  setVariationDisplayName: () => {},
  isPlaygroundView: false,
  setIsPlaygroundView: () => {},
});

export function VariationDisplayProvider({ children }: { children: ReactNode }) {
  const [variationDisplayName, setVariationDisplayName] = useState<string | null>(null);
  const [isPlaygroundView, setIsPlaygroundView] = useState(false);
  return (
    <VariationDisplayContext.Provider value={{ variationDisplayName, setVariationDisplayName, isPlaygroundView, setIsPlaygroundView }}>
      {children}
    </VariationDisplayContext.Provider>
  );
}

export function useVariationDisplay() {
  return useContext(VariationDisplayContext);
}
