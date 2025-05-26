import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
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
    .openapi({ example: "McDonald Toilet" }),
  description: z
    .string()
    .min(2, "Description of toilet needs to have minimum 2 characters")
    .openapi({ example: "On the second floor" }),
  paid: z.nativeEnum(Paid).openapi({ example: Paid.FREE }),
  latitude: z.number().min(-90).max(90).openapi({ example: -12.04221 }),
  longitude: z.number().min(-180).max(180).openapi({ example: 121.04221 }),
  features_ids: z
    .array(z.number().int().positive())
    .optional()
    .openapi({ example: [1, 3, 2] }),
});
export type CreateToiletRequest = z.infer<typeof createToiletRequest>;

const featureSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
});
export type FeatureSchema = z.infer<typeof featureSchema>;

export const allFeaturesResponse = z.object({
  features: z.array(featureSchema),
});

export const createToiletResponse = z.object({
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
      {
        id: 1,
        name: "Feature 1",
        description: null,
      },
      {
        id: 2,
        name: "Feature 2",
        description: null,
      },
      {
        id: 3,
        name: "Feature 3",
        description: null,
      },
    ],
  }),
});
export type CreateToiletResponse = z.infer<typeof createToiletResponse>;

export const boundingBoxQuerySchema = z.object({
  minlng: z.coerce.number().min(-180).max(180),
  minlat: z.coerce.number().min(-90).max(90),
  maxlng: z.coerce.number().min(-180).max(180),
  maxlat: z.coerce.number().min(-90).max(90),
  ulng: z.coerce.number().min(-180).max(180).optional(),
  ulat: z.coerce.number().min(-90).max(90).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(1000).default(20),
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
    example: 4,
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
      example: 50,
      description: "Limit of toilets per page (default is 20)",
    }),
});
export type getInRadiusQuerySchema = z.infer<typeof getInRadiusQuerySchema>;

export const getToiletsResponse = z.array(createToiletResponse);
export type getToiletsResponse = z.infer<typeof getToiletsResponse>;
