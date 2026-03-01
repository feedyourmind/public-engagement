import { db } from "@/db";
import { variations, presets } from "@/db/schema";
import { eq, asc, and, isNull } from "drizzle-orm";
import { notFound } from "next/navigation";
import { computeEffectivePresets } from "@/utils/presetMerge";
import MainPageClient from "../MainPageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const variation = await db.query.variations.findFirst({
    where: eq(variations.slug, slug),
    columns: { name: true },
  });
  return {
    title: variation
      ? `${variation.name}'s View — AI X-Risk Spectrum`
      : "Not Found",
  };
}

export default async function VariationPage({ params }: Props) {
  const { slug } = await params;

  const variation = await db.query.variations.findFirst({
    where: eq(variations.slug, slug),
    columns: { passcodeHash: false },
    with: {
      presets: {
        orderBy: [asc(presets.sortOrder)],
      },
    },
  });

  if (!variation) {
    notFound();
  }

  // For non-default variations, compute effective presets by merging with Michael's base
  if (!variation.isDefault) {
    const defaultVar = await db.query.variations.findFirst({
      where: eq(variations.isDefault, true),
      columns: { id: true },
      with: {
        presets: {
          where: isNull(presets.parentPresetId),
          orderBy: [asc(presets.sortOrder)],
        },
      },
    });
    if (defaultVar) {
      const effective = computeEffectivePresets(
        defaultVar.presets as any,
        variation.presets as any,
      );
      (variation as any).presets = effective;
    }
  }

  const allVariations = await db.query.variations.findMany({
    orderBy: [asc(variations.createdAt)],
    columns: { passcodeHash: false },
    with: {
      presets: {
        orderBy: [asc(presets.sortOrder)],
      },
    },
  });

  // Cast to match our client type (DB dates come as Date, we serialize to string)
  const serialized = JSON.parse(JSON.stringify(variation));
  const allSerialized = JSON.parse(JSON.stringify(allVariations));

  return (
    <MainPageClient variation={serialized} allVariations={allSerialized} />
  );
}
