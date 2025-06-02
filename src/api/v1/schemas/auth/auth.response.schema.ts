import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);

//REGISTER
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

//LOGIN
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

//REFRESH TOKEN
export const refreshTokenResponse = z.object({
  message: z.string().openapi({ example: "Refreshing token sucessfull" }),
  token: z.string().openapi({ example: "your new jwt access token" }),
  refreshToken: z.string().openapi({ example: "your new jwt refresh token" }),
});
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponse>;
