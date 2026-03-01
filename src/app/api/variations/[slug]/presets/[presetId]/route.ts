import { NextResponse } from "next/server";
import { db } from "@/db";
import { presets, variations } from "@/db/schema";
import { verifyPasscode } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string; presetId: string }> }
) {
  const { slug, presetId } = await params;
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

  const id = parseInt(presetId, 10);
  if (isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid preset ID" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const updates: Record<string, unknown> = {};

  if (body.label !== undefined) updates.label = body.label;
  if (body.loc !== undefined) updates.loc = body.loc;
  if (body.sc !== undefined) updates.sc = body.sc;
  if (body.sh !== undefined) updates.sh = body.sh;
  if (body.boundaries !== undefined) updates.boundaries = body.boundaries;
  if (body.zoom !== undefined) updates.zoom = body.zoom;
  if (body.pan !== undefined) updates.pan = body.pan;
  if (body.sortOrder !== undefined) updates.sortOrder = body.sortOrder;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No updates provided" }, { status: 400 });
  }

  updates.updatedAt = new Date();

  const [updated] = await db
    .update(presets)
    .set(updates)
    .where(and(eq(presets.id, id), eq(presets.variationId, variation.id)))
    .returning();

  if (!updated) {
    return NextResponse.json(
      { error: "Preset not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string; presetId: string }> }
) {
  const { slug, presetId } = await params;
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

  const id = parseInt(presetId, 10);
  if (isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid preset ID" },
      { status: 400 }
    );
  }

  const deleted = await db
    .delete(presets)
    .where(and(eq(presets.id, id), eq(presets.variationId, variation.id)))
    .returning();

  if (deleted.length === 0) {
    return NextResponse.json(
      { error: "Preset not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
