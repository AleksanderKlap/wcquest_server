import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);

export const Paid = {
  FREE: "FREE",
  PAID: "PAID",
} as const;
export type Paid = (typeof Paid)[keyof typeof Paid];

//TOILET FEATURE
export const toiletFeature = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: "Accessible Entrance" }),
  description: z.string().nullable().openapi({
    example: "Ramp available",
    description: "Description of the feature",
  }),
});
export type ToiletFeature = z.infer<typeof toiletFeature>;

//TOILET PHOTO SCHEMA
export const toiletPhoto = z.object({
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
export type ToiletPhoto = z.infer<typeof toiletPhoto>;

//AVERAGE RATINGS OF TOILET
export const avgToiletRatings = z.object({
  toiletId: z.number().openapi({ example: 2 }),
  avgCleanliness: z.number().min(1).max(5).openapi({ example: 2 }),
  avgAccessibility: z.number().min(1).max(5).openapi({ example: 2 }),
  avgLocation: z.number().min(1).max(5).openapi({ example: 3 }),
  avgRating: z.number().min(1).max(5).openapi({ example: 2.33 }),
  totalRatings: z.number().openapi({ example: 3 }),
});
export type AvgToiletRatings = z.infer<typeof avgToiletRatings>;
