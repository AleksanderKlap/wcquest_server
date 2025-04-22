import express from "express";
import {
  googleAuth,
  googleAuthCallback,
  register,
  login,
} from "../controllers/auth.controller";
import passport from "../config/passport";
import { validate } from "../middleware/validator.middleware";
import { loginRequest, registerRequest } from "../schemas/auth.schema";

const router = express.Router();
router.post("/register", validate(registerRequest), register);

/**
 * @openapi
 * /login:
 *  post:
 *    tags:
 *      - Login
 *    summary: Endpoint to login user, returns jwt token and user data
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/LoginInput'
 *    responses:
 *      200:
 *        description: Login succesfull
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LoginSuccessResponse'
 *      400:
 *        description: Input validation error
 */
router.post("/login", validate(loginRequest), login);
router.get("/auth/google", googleAuth);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuthCallback
);
// router.get("verify-email", verifyEmail);

export { router as authRouter };
