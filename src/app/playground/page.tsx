import { db } from "@/db";
import { variations, presets } from "@/db/schema";
import { eq, asc, isNull } from "drizzle-orm";
import MainPageClient from "../MainPageClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Playground — AI X-Risk Spectrum",
};

export default async function PlaygroundPage() {
  let defaultVariation = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let allVariations: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let basePresets: any[] = [];

  try {
    const defaultVar = await db.query.variations.findFirst({
      where: eq(variations.isDefault, true),
      columns: { passcodeHash: false },
      with: {
        presets: {
          where: isNull(presets.parentPresetId),
          orderBy: [asc(presets.sortOrder)],
        },
      },
    });

    defaultVariation = defaultVar ?? null;
    basePresets = defaultVar?.presets ?? [];

    allVariations = await db.query.variations.findMany({
      orderBy: [asc(variations.createdAt)],
      columns: { passcodeHash: false },
      with: {
        presets: {
          orderBy: [asc(presets.sortOrder)],
        },
      },
    });
  } catch {
    // DB not available — fall back to defaults
  }

  const serialized = defaultVariation
    ? JSON.parse(JSON.stringify(defaultVariation))
    : null;
  const allSerialized = JSON.parse(JSON.stringify(allVariations));
  const baseSerialized = JSON.parse(JSON.stringify(basePresets));

  return (
    <MainPageClient
      variation={serialized}
      allVariations={allSerialized}
      playgroundMode
      basePresets={baseSerialized}
    />
  );
}
