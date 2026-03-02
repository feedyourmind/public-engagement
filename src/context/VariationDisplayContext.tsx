"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface VariationDisplayState {
  variationDisplayName: string | null;
  setVariationDisplayName: (name: string | null) => void;
}

const VariationDisplayContext = createContext<VariationDisplayState>({
  variationDisplayName: null,
  setVariationDisplayName: () => {},
});

export function VariationDisplayProvider({ children }: { children: ReactNode }) {
  const [variationDisplayName, setVariationDisplayName] = useState<string | null>(null);
  return (
    <VariationDisplayContext.Provider value={{ variationDisplayName, setVariationDisplayName }}>
      {children}
    </VariationDisplayContext.Provider>
  );
}

export function useVariationDisplay() {
  return useContext(VariationDisplayContext);
}
