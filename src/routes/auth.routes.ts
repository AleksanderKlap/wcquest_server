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
router.post("/login", validate(loginRequest), login);
router.get("/auth/google", googleAuth);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuthCallback
);

export { router as authRouter };
