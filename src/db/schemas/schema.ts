import { relations } from "drizzle-orm";
import {
  integer,
  primaryKey,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  geometry,
  index,
} from "drizzle-orm/pg-core";

//enums
export const paidEnum = pgEnum("Paid", ["FREE", "PAID"]);

//tables
export const user = pgTable("User", {
  id: serial("id").primaryKey(),
  email: varchar({ length: 255 }).notNull().unique(),
  googleId: varchar({ length: 255 }),
  password: varchar({ length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .$onUpdate(() => new Date()),
});

export const refreshToken = pgTable("RefreshToken", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  refreshToken: varchar("refresh_token", { length: 512 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .$onUpdate(() => new Date()),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const profile = pgTable("Profile", {
  id: serial("id").primaryKey(),
  username: varchar({ length: 255 }).notNull().default("WCQuest_User;)"),
  bio: varchar({ length: 1000 }).notNull().default("I love this app!"),
  userId: integer("user_id")
    .notNull()
    .unique()
    .references(() => user.id),
});

export const toilet = pgTable(
  "Toilet",
  {
    id: serial("id").primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    description: text("description").notNull(),
    location: geometry("location", {
      type: "point",
      mode: "xy",
      srid: 4326,
    }).notNull(),
    createdBy: integer("created_by")
      .notNull()
      .references(() => user.id),
    paid: paidEnum("paid").default("FREE").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("spatial_index").using("gist", t.location)]
);

export const feature = pgTable("Feature", {
  id: serial("id").primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  description: text("description"),
});

export const toiletToFeatures = pgTable(
  "ToiletToFeature",
  {
    toiletId: integer("toilet_id")
      .notNull()
      .references(() => toilet.id),
    featureId: integer("feature_id")
      .notNull()
      .references(() => feature.id),
  },
  (t) => [primaryKey({ columns: [t.toiletId, t.featureId] })]
);

//relations

export const userRelations = relations(user, ({ one, many }) => ({
  profile: one(profile),
  toilet: many(toilet),
  refreshToken: many(refreshToken),
}));

export const refreshTokenRelations = relations(refreshToken, ({ one }) => ({
  user: one(user, { fields: [refreshToken.userId], references: [user.id] }),
}));

export const profileRelations = relations(profile, ({ one }) => ({
  user: one(user, { fields: [profile.userId], references: [user.id] }),
}));

export const toiletRelations = relations(toilet, ({ one, many }) => ({
  user: one(user, { fields: [toilet.createdBy], references: [user.id] }),
  toiletToFeatures: many(toiletToFeatures),
}));

export const featureRelations = relations(feature, ({ one, many }) => ({
  toiletToFeatures: many(toiletToFeatures),
}));

export const toiletToFeaturesRelations = relations(
  toiletToFeatures,
  ({ one }) => ({
    toilet: one(toilet, {
      fields: [toiletToFeatures.toiletId],
      references: [toilet.id],
    }),
    feature: one(feature, {
      fields: [toiletToFeatures.featureId],
      references: [feature.id],
    }),
  })
);
