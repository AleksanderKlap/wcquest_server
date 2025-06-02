import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);

export const Paid = {
  FREE: "FREE",
  PAID: "PAID",
} as const;
export type Paid = (typeof Paid)[keyof typeof Paid];

//CREATE TOILET
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

//GET TOILET IN BOUNDING BOX QUERY REQUEST
export const boundingBoxRequest = z.object({
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
export type BoundingBoxRequest = z.infer<typeof boundingBoxRequest>;

//GET TOILETS IN RADIUS REQUEST QUERY
export const inRadiusRequest = z.object({
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
export type InRadiusRequest = z.infer<typeof inRadiusRequest>;

//RATING REQUEST BODY
export const ratingRequest = z.object({
  rating_cleanliness: z.number().openapi({ example: 1 }),
  rating_accessibility: z.number().openapi({ example: 3 }),
  rating_location: z.number().openapi({ example: 5 }),
});
export type RatingRequest = z.infer<typeof ratingRequest>;

//ADD COMMENT REQUEST BODY
export const commentRequest = z.object({
  content: z.string().min(5).max(500).openapi({
    example:
      "This is example comment and it needs to have from 5 to 500 characters",
  }),
});
