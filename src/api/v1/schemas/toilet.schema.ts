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

// const createToiletResponse = z.object({
//   id: z.number(),
//   name: z.string(),
//   description: z.string(),
//   paid: z.nativeEnum(Paid),
//   latitude: z.number(),
//   longitude: z.number(),
//   features: z.array(featureSchema),
// });
// export type CreateToiletResponse = z.infer<typeof createToiletResponse>;

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
