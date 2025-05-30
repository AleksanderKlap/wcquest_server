import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { getToiletById } from "../services/toiletdb.util";
extendZodWithOpenApi(z);

export const Paid = {
  FREE: "FREE",
  PAID: "PAID",
} as const;
export type Paid = (typeof Paid)[keyof typeof Paid];

export const createToiletRequest = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name of toilet needs to have minimum 2 characters")
    .openapi({ example: "McDonald Toilet", description: "Name of the toilet" }),
  description: z
    .string()
    .min(2, "Description of toilet needs to have minimum 2 characters")
    .openapi({
      example: "On the second floor",
      description: "Location or details about the toilet",
    }),
  paid: z.nativeEnum(Paid).openapi({
    example: Paid.FREE,
    description: "Whether the toilet is FREE or PAID",
  }),
  latitude: z.number().min(-90).max(90).openapi({
    example: -12.04221,
    description: "Latitude of the toilet location",
  }),
  longitude: z.number().min(-180).max(180).openapi({
    example: 121.04221,
    description: "Longitude of the toilet location",
  }),
  features_ids: z
    .array(z.number().int().positive())
    .optional()
    .openapi({
      example: [1, 3, 2],
      description: "Array of feature IDs to associate with the toilet",
    }),
});
export type CreateToiletRequest = z.infer<typeof createToiletRequest>;

const featureSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: "Accessible Entrance" }),
  description: z.string().nullable().openapi({
    example: "Ramp available",
    description: "Description of the feature",
  }),
});
export type FeatureSchema = z.infer<typeof featureSchema>;

export const allFeaturesResponse = z.object({
  features: z.array(featureSchema),
});

export const boundingBoxQuerySchema = z.object({
  minlng: z.coerce.number().min(-180).max(180).openapi({
    example: 4.8951,
    description: "Minimum longitude of bounding box",
  }),
  minlat: z.coerce.number().min(-90).max(90).openapi({
    example: 52.3702,
    description: "Minimum latitude of bounding box",
  }),
  maxlng: z.coerce.number().min(-180).max(180).openapi({
    example: 4.9999,
    description: "Maximum longitude of bounding box",
  }),
  maxlat: z.coerce.number().min(-90).max(90).openapi({
    example: 52.3999,
    description: "Maximum latitude of bounding box",
  }),
  ulng: z.coerce
    .number()
    .min(-180)
    .max(180)
    .optional()
    .openapi({ example: 4.9001, description: "User longitude (optional)" }),
  ulat: z.coerce
    .number()
    .min(-90)
    .max(90)
    .optional()
    .openapi({ example: 52.37, description: "User latitude (optional)" }),
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1)
    .openapi({ example: 1, description: "Page number for pagination" }),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(1000)
    .default(20)
    .openapi({ example: 20, description: "Number of items per page" }),
});
export type BoundingBoxQuerySchema = z.infer<typeof boundingBoxQuerySchema>;

export const getInRadiusQuerySchema = z.object({
  lng: z.coerce
    .number()
    .min(-180)
    .max(180)
    .openapi({ example: 4.895168, description: "Longitude of user position" }),
  lat: z.coerce
    .number()
    .min(-90)
    .max(90)
    .openapi({ example: 52.370216, description: "Latitude of user position" }),
  radius: z.coerce.number().positive().openapi({
    example: 2000,
    description: "Radius of selecting toilets in meters",
  }),
  page: z.coerce.number().int().min(1).optional().default(1).openapi({
    example: 1,
    description: "Page number for pagination (default is 1)",
  }),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .default(20)
    .openapi({
      example: 20,
      description: "Limit of toilets per page (default is 20)",
    }),
});
export type getInRadiusQuerySchema = z.infer<typeof getInRadiusQuerySchema>;

export const photoSchema = z.object({
  id: z.number().openapi({ example: 123 }),
  url: z.string().openapi({
    example: "toilet/42/photo-uuid.jpg",
    description: "Path to photo in Supabase",
  }),
  addedBy: z.object({
    userId: z.number().openapi({ example: 12 }),
    username: z.string().openapi({ example: "Olek" }),
  }),
  createdAt: z.date().openapi({
    example: new Date().toISOString(),
    description: "Date when the photo was added",
  }),
});

export const avgRatings = z.object({
  toiletId: z.number().openapi({ example: 2 }),
  avgCleanliness: z.number().min(1).max(5).openapi({ example: 2 }),
  avgAccessibility: z.number().min(1).max(5).openapi({ example: 2 }),
  avgLocation: z.number().min(1).max(5).openapi({ example: 3 }),
  avgRating: z.number().min(1).max(5).openapi({ example: 2.33 }),
  totalRatings: z.number().openapi({ example: 3 }),
});

export const toiletResponse = z.object({
  id: z.number().openapi({ example: 42 }),
  name: z.string().openapi({ example: "McDonald Toilet" }),
  description: z.string().openapi({ example: "On the second floor" }),
  paid: z.nativeEnum(Paid).openapi({ example: Paid.FREE }),
  location: z.object({
    latitude: z.number().openapi({ example: -12.04221 }),
    longitude: z.number().openapi({ example: 121.04221 }),
  }),
  created_by: z.object({
    id: z.number().openapi({ example: 123 }),
    username: z.string().openapi({ example: "Cool user" }),
    bio: z.string().openapi({ example: "I love to pee in McDonald" }),
  }),
  features: z.array(featureSchema).openapi({
    example: [
      { id: 1, name: "Feature 1", description: null },
      { id: 2, name: "Feature 2", description: null },
      { id: 3, name: "Feature 3", description: null },
    ],
  }),
  photos: z.array(photoSchema).openapi({
    example: [
      {
        id: 1,
        url: "/uploads/photo1.jpg",
        addedBy: {
          userId: 5,
          username: "toiletFan99",
        },
        createdAt: new Date(),
      },
      {
        id: 2,
        url: "/uploads/photo2.jpg",
        addedBy: {
          userId: 7,
          username: "bathroomExplorer",
        },
        createdAt: new Date(),
      },
    ],
  }),
});
export type ToiletResponse = z.infer<typeof toiletResponse>;
export type ToiletResponseWithDistance = ToiletResponse & {
  distance: number | null;
};

//TODO: move to util for general use
export const toiletWithQuery = {
  toiletToFeatures: {
    with: { feature: true },
  },
  user: {
    with: { profile: true },
  },
  photos: {
    with: { user: { with: { profile: true } } },
  },
} as const;

export type ToiletWithRelations = Awaited<ReturnType<typeof getToiletById>>;

export const ratingRequest = z.object({
  rating_cleanliness: z.number().openapi({ example: 1 }),
  rating_accessibility: z.number().openapi({ example: 3 }),
  rating_location: z.number().openapi({ example: 5 }),
});
export type RatingRequest = z.infer<typeof ratingRequest>;
