import {
  pgTable,
  serial,
  varchar,
  boolean,
  doublePrecision,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const variations = pgTable("variations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  passcodeHash: varchar("passcode_hash", { length: 64 }).notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const presets = pgTable("presets", {
  id: serial("id").primaryKey(),
  variationId: integer("variation_id")
    .notNull()
    .references(() => variations.id, { onDelete: "cascade" }),
  parentPresetId: integer("parent_preset_id")
    .references((): any => presets.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 100 }).notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  loc: doublePrecision("loc").notNull(),
  sc: doublePrecision("sc").notNull(),
  sh: doublePrecision("sh").notNull(),
  boundaries: doublePrecision("boundaries").array().notNull(),
  zoom: doublePrecision("zoom").notNull().default(1.0),
  pan: doublePrecision("pan").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const variationsRelations = relations(variations, ({ many }) => ({
  presets: many(presets),
}));

export const presetsRelations = relations(presets, ({ one, many }) => ({
  variation: one(variations, {
    fields: [presets.variationId],
    references: [variations.id],
  }),
  parentPreset: one(presets, {
    fields: [presets.parentPresetId],
    references: [presets.id],
    relationName: "presetInheritance",
  }),
  childPresets: many(presets, {
    relationName: "presetInheritance",
  }),
}));
