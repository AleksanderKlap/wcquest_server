import { z } from "zod";

export const registerRequest = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email format"),
  password: z
    .string()
    .trim()
    .min(6, "Password needs to be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});
export type RegisterRequest = z.infer<typeof registerRequest>;

export const registerResponse = z.object({
  message: z.string(),
  user: z.object({
    id: z.number(),
    email: z.string().email(),
  }),
});
export type RegisterResponse = z.infer<typeof registerResponse>;

export const loginRequest = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email format"),
  password: z.string().trim().min(6, "Password too short"),
});
export type LoginRequest = z.infer<typeof loginRequest>;

export const loginResponse = z.object({
  message: z.string(),
  token: z.string(),
  user: z.object({
    id: z.number(),
    email: z.string(),
  }),
});
export type LoginResponse = z.infer<typeof loginResponse>;
