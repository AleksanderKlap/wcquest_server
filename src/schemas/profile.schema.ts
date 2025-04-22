import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);

export const updateProfileRequest = z.object({
  username: z
    .string()
    .trim()
    .min(2, "Username needs to have at least 2 characters")
    .optional()
    .openapi({ description: "Min 2 characters", example: "Cool_Username" }),
  bio: z
    .string()
    .min(2, "Bio needs to be 2 - 500 characters long")
    .max(500, "Bio needs to be 2 - 500 characters long")
    .optional()
    .openapi({
      description: "Between 2 and 500 characters",
      example: "This is my bio",
    }),
});
export type UpdateProfileRequest = z.infer<typeof updateProfileRequest>;

export const updateProfileResponse = z.object({
  username: z.string().openapi({ example: "Cool_Username" }),
  bio: z.string().openapi({
    example: "This is my bio",
  }),
});
export type UpdateProfileResponse = z.infer<typeof updateProfileResponse>;
