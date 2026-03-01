import { db } from "@/db";
import { variations, presets } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import MainPageClient from "./MainPageClient";

export default async function Home() {
  let defaultVariation = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let allVariations: any[] = [];

  try {
    defaultVariation = await db.query.variations.findFirst({
      where: eq(variations.isDefault, true),
      columns: { passcodeHash: false },
      with: {
        presets: {
          orderBy: [asc(presets.sortOrder)],
        },
      },
    });

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
    // DB not available — fall back to null (uses hardcoded defaults)
  }

  const serialized = defaultVariation
    ? JSON.parse(JSON.stringify(defaultVariation))
    : null;
  const allSerialized = JSON.parse(JSON.stringify(allVariations));

  return (
    <MainPageClient variation={serialized} allVariations={allSerialized} />
  );
}
