import { NextResponse } from "next/server";
import { db } from "@/db";
import { presets, variations } from "@/db/schema";
import { verifyPasscode } from "@/lib/auth";
import { eq, asc, sql } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const variation = await db.query.variations.findFirst({
    where: eq(variations.slug, slug),
  });
  if (!variation) {
    return NextResponse.json(
      { error: "Variation not found" },
      { status: 404 }
    );
  }

  const result = await db.query.presets.findMany({
    where: eq(presets.variationId, variation.id),
    orderBy: [asc(presets.sortOrder)],
  });

  return NextResponse.json(result);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const passcode = request.headers.get("X-Passcode");

  if (!passcode) {
    return NextResponse.json(
      { error: "Passcode required" },
      { status: 401 }
    );
  }

  const valid = await verifyPasscode(slug, passcode);
  if (!valid) {
    return NextResponse.json(
      { error: "Invalid passcode" },
      { status: 403 }
    );
  }

  const variation = await db.query.variations.findFirst({
    where: eq(variations.slug, slug),
  });
  if (!variation) {
    return NextResponse.json(
      { error: "Variation not found" },
      { status: 404 }
    );
  }

  const body = await request.json();
  const { label, loc, sc, sh, boundaries, zoom, pan, parentPresetId } = body;

  if (!label || typeof label !== "string") {
    return NextResponse.json(
      { error: "Label is required" },
      { status: 400 }
    );
  }
  if (
    typeof loc !== "number" ||
    typeof sc !== "number" ||
    typeof sh !== "number" ||
    !Array.isArray(boundaries)
  ) {
    return NextResponse.json(
      { error: "loc, sc, sh (numbers) and boundaries (array) are required" },
      { status: 400 }
    );
  }

  // Get next sort order
  const maxOrder = await db
    .select({ max: sql<number>`coalesce(max(${presets.sortOrder}), -1)` })
    .from(presets)
    .where(eq(presets.variationId, variation.id));
  const sortOrder = (maxOrder[0]?.max ?? -1) + 1;

  const [preset] = await db
    .insert(presets)
    .values({
      variationId: variation.id,
      parentPresetId:
        typeof parentPresetId === "number" ? parentPresetId : null,
      label: label.trim(),
      sortOrder,
      loc,
      sc,
      sh,
      boundaries,
      zoom: typeof zoom === "number" ? zoom : 1.0,
      pan: typeof pan === "number" ? pan : 0,
    })
    .returning();

  return NextResponse.json(preset, { status: 201 });
}
