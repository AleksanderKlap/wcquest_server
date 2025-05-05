import { z } from "zod";
import { Geolocation } from "../types/express";
import { Paid } from "@prisma/client";

import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);

export const createToiletRequest = z.object({
  name: z.string(),
  description: z.string(),
  paid: z.enum(["FREE", "PAID"]),
  latitude: z.number(),
  longitude: z.number(),
  created_by: z.number(),
});
export type CreateToiletRequest = z.infer<typeof createToiletRequest>;
