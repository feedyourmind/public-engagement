import { db } from "@/db";
import { variations } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function hashPasscode(code: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(code);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPasscode(
  slug: string,
  code: string
): Promise<boolean> {
  const variation = await db.query.variations.findFirst({
    where: eq(variations.slug, slug),
  });
  if (!variation) return false;
  const hash = await hashPasscode(code);
  return hash === variation.passcodeHash;
}

/** Slugs that conflict with existing routes */
const RESERVED_SLUGS = new Set([
  "settings",
  "api",
  "_next",
  "favicon.ico",
  "public",
]);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
