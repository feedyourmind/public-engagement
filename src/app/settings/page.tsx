import { db } from "@/db";
import { variations, presets } from "@/db/schema";
import { eq, asc, isNull } from "drizzle-orm";
import SettingsClient from "./SettingsClient";

interface Props {
  searchParams: Promise<{ v?: string }>;
}

export default async function SettingsPage({ searchParams }: Props) {
  const { v } = await searchParams;

  const isPlayground = !v;
  let variation = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let allVariations: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let basePresets: any[] = [];

  try {
    // Always fetch the default variation's base presets (needed for inheritance)
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

    basePresets = defaultVar?.presets ?? [];

    if (v) {
      // Specific variation requested by slug
      variation = await db.query.variations.findFirst({
        where: eq(variations.slug, v),
        columns: { passcodeHash: false },
        with: {
          presets: {
            orderBy: [asc(presets.sortOrder)],
          },
        },
      });

      // If slug not found, fall back to default variation
      if (!variation) {
        variation = defaultVar ?? null;
      }
    }
    // When no v param: variation stays null (playground mode)

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
    // DB not available
  }

  const serialized = variation
    ? JSON.parse(JSON.stringify(variation))
    : null;
  const allSerialized = JSON.parse(JSON.stringify(allVariations));
  const baseSerialized = JSON.parse(JSON.stringify(basePresets));

  return (
    <SettingsClient
      variation={serialized}
      allVariations={allSerialized}
      basePresets={baseSerialized}
      playgroundMode={isPlayground}
    />
  );
}
