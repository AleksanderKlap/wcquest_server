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

const createToiletResponse = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  paid: z.nativeEnum(Paid),
  latitude: z.number(),
  longitude: z.number(),
  features: z.array(featureSchema),
});
export type CreateToiletResponse = z.infer<typeof createToiletResponse>;

const toiletSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  paid: z.nativeEnum(Paid),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  created_by: z.object({
    id: z.number(),
    username: z.string(),
    bio: z.string(),
  }),
  features: z.array(featureSchema),
});
export type ToiletSchema = z.infer<typeof toiletSchema>;
