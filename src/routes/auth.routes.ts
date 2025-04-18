import express from "express";
import {
  googleAuth,
  googleAuthCallback,
  register,
} from "../controllers/auth.controller";
import { registerSchema } from "../validation_schemas/register.schema";
import { validate } from "../middleware/validate";
import passport from "../config/passport";

const router = express.Router();
/**
 * @openapi
 * /register:
 *  post:
 *    tags:
 *      - Register
 *    summary: Endpoint to register user with email and password
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/RegisterInput'
 *    responses:
 *      201:
 *        description: Registration succesfull
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RegisterSuccessResponse'
 *      400:
 *        description: Email is already in use OR email is not in email format OR password is less than 6 characters OR password do not contain at least 1 uppercase letter OR password do not contain at least 1 number
 */
router.post("/register", registerSchema, validate, register);
router.get("/auth/google", googleAuth);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuthCallback
);

export { router as authRouter };
