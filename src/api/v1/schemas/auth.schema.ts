import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);

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

export const registerResponse = z.object({
  message: z.string().openapi({
    description: "Message about the server response",
    example: "Registration Succesfull",
  }),
  user: z.object({
    email: z.string().email().openapi({ example: "example@gmail.com" }),
  }),
});
export type RegisterResponse = z.infer<typeof registerResponse>;

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

export const loginResponse = z.object({
  message: z.string().openapi({ example: "Login succesfull" }),
  token: z.string().openapi({ example: "your_jwt_token_string" }),
  refreshToken: z
    .string()
    .openapi({ example: "your_jwt_refresh_token_string" }),
  user: z.object({
    id: z.number().openapi({ example: 123 }),
    email: z.string().openapi({ example: "example@gmail.com" }),
  }),
});
export type LoginResponse = z.infer<typeof loginResponse>;

export const refreshTokenRequest = z.object({
  refreshToken: z.string().openapi({ example: "your_jwt_token_string" }),
});
export type RefreshTokenRequest = z.infer<typeof refreshTokenRequest>;

export const refreshTokenResponse = z.object({
  message: z.string().openapi({ example: "Refreshing token sucessfull" }),
  token: z.string().openapi({ example: "your new jwt access token" }),
  refreshToken: z.string().openapi({ example: "your new jwt refresh token" }),
});
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponse>;
