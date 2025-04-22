import { z } from "zod";

export const updateProfileRequest = z.object({
  username: z
    .string()
    .trim()
    .min(2, "Username needs to have at least 2 characters")
    .optional(),
  bio: z
    .string()
    .min(2, "Bio needs to be 2 - 500 characters long")
    .max(500, "Bio needs to be 2 - 500 characters long")
    .optional(),
});
export type UpdateProfileRequest = z.infer<typeof updateProfileRequest>;

export const updateProfileResponse = z.object({
  username: z.string(),
  bio: z.string(),
});
export type UpdateProfileResponse = z.infer<typeof updateProfileResponse>;
