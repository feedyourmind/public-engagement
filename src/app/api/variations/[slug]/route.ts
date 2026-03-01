import { NextResponse } from "next/server";
import { db } from "@/db";
import { variations } from "@/db/schema";
import { verifyPasscode, slugify, isReservedSlug } from "@/lib/auth";
import { eq, asc } from "drizzle-orm";
import { presets } from "@/db/schema";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
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
    return NextResponse.json(
      { error: "Variation not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(variation);
}

export async function PUT(
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

  const body = await request.json();
  const updates: Partial<{ name: string; slug: string }> = {};

  if (body.name && typeof body.name === "string") {
    updates.name = body.name.trim();
    const newSlug = slugify(body.name);
    if (newSlug && newSlug !== slug) {
      if (isReservedSlug(newSlug)) {
        return NextResponse.json(
          { error: "This name is reserved" },
          { status: 400 }
        );
      }
      const existing = await db.query.variations.findFirst({
        where: eq(variations.slug, newSlug),
      });
      if (existing) {
        return NextResponse.json(
          { error: "A variation with this name already exists" },
          { status: 409 }
        );
      }
      updates.slug = newSlug;
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No updates provided" }, { status: 400 });
  }

  const [updated] = await db
    .update(variations)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(variations.slug, slug))
    .returning({
      id: variations.id,
      name: variations.name,
      slug: variations.slug,
      isDefault: variations.isDefault,
      createdAt: variations.createdAt,
      updatedAt: variations.updatedAt,
    });

  return NextResponse.json(updated);
}

export async function DELETE(
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

  // Check if this is the default variation
  const variation = await db.query.variations.findFirst({
    where: eq(variations.slug, slug),
  });
  if (variation?.isDefault) {
    return NextResponse.json(
      { error: "Cannot delete the default variation" },
      { status: 400 }
    );
  }

  await db.delete(variations).where(eq(variations.slug, slug));

  return NextResponse.json({ success: true });
}
