import { NextResponse } from "next/server";
import { db } from "@/db";
import { variations, presets } from "@/db/schema";
import { hashPasscode, isReservedSlug, slugify } from "@/lib/auth";
import { asc } from "drizzle-orm";

export async function GET() {
  const all = await db.query.variations.findMany({
    orderBy: [asc(variations.createdAt)],
    columns: { passcodeHash: false },
    with: {
      presets: {
        orderBy: [asc(presets.sortOrder)],
      },
    },
  });
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, passcode } = body as { name?: string; passcode?: string };

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!passcode || typeof passcode !== "string" || !/^\d{4}$/.test(passcode)) {
    return NextResponse.json(
      { error: "Passcode must be exactly 4 digits" },
      { status: 400 }
    );
  }

  const slug = slugify(name);
  if (!slug) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }
  if (isReservedSlug(slug)) {
    return NextResponse.json(
      { error: "This name is reserved" },
      { status: 400 }
    );
  }

  const existing = await db.query.variations.findFirst({
    where: (v, { eq }) => eq(v.slug, slug),
  });
  if (existing) {
    return NextResponse.json(
      { error: "A variation with this name already exists" },
      { status: 409 }
    );
  }

  const passcodeHash = await hashPasscode(passcode);

  const [variation] = await db
    .insert(variations)
    .values({
      name: name.trim(),
      slug,
      passcodeHash,
      isDefault: false,
    })
    .returning({
      id: variations.id,
      name: variations.name,
      slug: variations.slug,
      isDefault: variations.isDefault,
      createdAt: variations.createdAt,
      updatedAt: variations.updatedAt,
    });

  return NextResponse.json(variation, { status: 201 });
}
