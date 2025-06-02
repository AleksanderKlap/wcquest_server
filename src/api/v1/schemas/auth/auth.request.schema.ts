import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);

//REGISTER
export const registerRequest = z
  .object({
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
  })
  .openapi({ description: "Schema for register request" });
export type RegisterRequest = z.infer<typeof registerRequest>;

//LOGIN
export const loginRequest = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email format")
    .openapi({ example: "example@gmail.com" }),
  password: z
    .string()
    .trim()
    .min(6, "Password too short")
    .openapi({ example: "StrongPass123" }),
});
export type LoginRequest = z.infer<typeof loginRequest>;

//REFRESH TOKEN
export const refreshTokenRequest = z.object({
  refreshToken: z.string().openapi({ example: "your_jwt_token_string" }),
});
export type RefreshTokenRequest = z.infer<typeof refreshTokenRequest>;
