import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "./schema";

async function hashPasscode(code: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(code);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const SEED_PRESETS = [
  {
    label: "Reality",
    sortOrder: 0,
    loc: 0.35,
    sc: 0.68,
    sh: 5.5,
    boundaries: [0.41076509987603843, 0.6199643742994642, 1.2020840944342144, 1.6326101374505397, 2.163188007365026],
  },
  {
    label: "TPOT Perception",
    sortOrder: 1,
    loc: 1.2,
    sc: 0.9,
    sh: 1.5,
    boundaries: [-0.2, 0.5, 1.2, 1.8, 2.8],
  },
  {
    label: "AI Safety Community",
    sortOrder: 2,
    loc: 0.5,
    sc: 1.4,
    sh: 0.0,
    boundaries: [-0.6, 0.2, 0.8, 1.4, 2.0],
  },
  {
    label: "Tech Optimists",
    sortOrder: 3,
    loc: -0.2,
    sc: 0.5,
    sh: 8.0,
    boundaries: [-0.3, 0.3, 0.9, 1.4, 2.0],
  },
];

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  // Check if Michael variation already exists
  const existing = await db.query.variations.findFirst({
    where: eq(schema.variations.slug, "michael"),
  });

  if (existing) {
    console.log('Variation "Michael" already exists — skipping seed.');
    return;
  }

  const passcodeHash = await hashPasscode("0000");

  const [variation] = await db
    .insert(schema.variations)
    .values({
      name: "Michael",
      slug: "michael",
      passcodeHash,
      isDefault: true,
    })
    .returning();

  for (const p of SEED_PRESETS) {
    await db.insert(schema.presets).values({
      variationId: variation.id,
      label: p.label,
      sortOrder: p.sortOrder,
      loc: p.loc,
      sc: p.sc,
      sh: p.sh,
      boundaries: p.boundaries,
    });
  }

  console.log(
    `Seeded variation "${variation.name}" (id=${variation.id}) with ${SEED_PRESETS.length} presets.`
  );
}

seed().catch(console.error);
