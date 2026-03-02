"use client";

import { VariationDisplayProvider } from "@/context/VariationDisplayContext";
import type { ReactNode } from "react";

export default function LayoutProviders({ children }: { children: ReactNode }) {
  return <VariationDisplayProvider>{children}</VariationDisplayProvider>;
}
