import { NextResponse } from "next/server";
import { verifyPasscode } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await request.json();
  const { passcode } = body as { passcode?: string };

  if (!passcode || typeof passcode !== "string") {
    return NextResponse.json(
      { error: "Passcode is required" },
      { status: 400 }
    );
  }

  const valid = await verifyPasscode(slug, passcode);

  return NextResponse.json({ valid });
}
