import { relations, sql } from "drizzle-orm";
import { QueryBuilder } from "drizzle-orm/gel-core";
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
  check,
  pgView,
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

export const toiletRating = pgTable(
  "ToiletRating",
  {
    id: serial("id").primaryKey(),
    toiletId: integer("toilet_id")
      .notNull()
      .references(() => toilet.id),
    userId: integer("user_id")
      .notNull()
      .references(() => user.id),
    rating_cleanliness: integer().notNull(),
    rating_accessibility: integer().notNull(),
    rating_location: integer().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (rating) => [
    check(
      "rating_cleanliness_boundry",
      sql`${rating.rating_cleanliness} BETWEEN 1 AND 5`
    ),
    check(
      "rating_accessibility_boundry",
      sql`${rating.rating_accessibility} BETWEEN 1 AND 5`
    ),
    check(
      "rating_location_boundry",
      sql`${rating.rating_location} BETWEEN 1 AND 5`
    ),
  ]
);

export const feature = pgTable("Feature", {
  id: serial("id").primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  description: text("description"),
});

export const toiletPhoto = pgTable("ToiletPhoto", {
  id: serial("id").primaryKey(),
  url: varchar("url").notNull(),
  toiletId: integer("toilet_id")
    .notNull()
    .references(() => toilet.id),
  userId: integer("created_by")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
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
  toiletPhoto: many(toiletPhoto),
  ratings: many(toiletRating),
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
  photos: many(toiletPhoto),
  ratings: many(toiletRating),
}));

export const toiletRatingRelations = relations(toiletRating, ({ one }) => ({
  user: one(user, {
    fields: [toiletRating.userId],
    references: [user.id],
  }),
  toilet: one(toilet, {
    fields: [toiletRating.toiletId],
    references: [toilet.id],
  }),
}));

export const toiletPhotoRelations = relations(toiletPhoto, ({ one }) => ({
  user: one(user, { fields: [toiletPhoto.userId], references: [user.id] }),
  toilet: one(toilet, {
    fields: [toiletPhoto.toiletId],
    references: [toilet.id],
  }),
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

// views

export const avgRatingView = pgView("avg_rating_view").as((qb) =>
  qb
    .select({
      toiletId: toiletRating.toiletId,
      avgCleanliness:
        sql<number>`ROUND(AVG(${toiletRating.rating_cleanliness}::numeric), 2)`.as(
          "avg_cleanliness"
        ),
      avgAccessibility:
        sql<number>`ROUND(AVG(${toiletRating.rating_accessibility}::numeric), 2)`.as(
          "avg_accessibility"
        ),
      avgLocation:
        sql<number>`ROUND(AVG(${toiletRating.rating_location}::numeric), 2)`.as(
          "avg_location"
        ),
      averageRating:
        sql<number>`ROUND(AVG((${toiletRating.rating_cleanliness} + ${toiletRating.rating_accessibility} + ${toiletRating.rating_location})::numeric / 3), 2)`.as(
          "avg_rating_overall"
        ),
      totalRatings: sql<number>`COUNT(*)`.as("total_ratings"),
    })
    .from(toiletRating)
);
