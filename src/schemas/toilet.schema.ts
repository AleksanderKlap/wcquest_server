import { z } from "zod";
import { Paid } from "@prisma/client";

import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);

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
  created_by: z.number().int().positive().openapi({ example: 141 }),
  features_ids: z
    .array(z.number().int().positive())
    .optional()
    .openapi({ example: [1, 4, 2] }),
});
export type CreateToiletRequest = z.infer<typeof createToiletRequest>;
