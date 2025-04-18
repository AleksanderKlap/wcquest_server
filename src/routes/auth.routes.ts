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

// router.post("/register", registerSchema, validate, register);
router.post("/register", register);
router.get("/auth/google", googleAuth);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuthCallback
);

export { router as authRouter };
