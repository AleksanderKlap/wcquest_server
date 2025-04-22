import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);

export const registerRequest = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email format")
    .openapi({ example: "example@gmail.com" }),
  password: z
    .string()
    .trim()
    .min(6, "Password needs to be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .openapi({ example: "StrongPassword123" }),
});
export type RegisterRequest = z.infer<typeof registerRequest>;

export const registerResponse = z.object({
  message: z.string().openapi({
    description: "Message about the server response",
    example: "Registration Succesfull",
  }),
  user: z.object({
    id: z.number().openapi({ example: 132 }),
    email: z.string().email().openapi({ example: "example@gmail.com" }),
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
