import { Router } from "express";
import { validate } from "../../../middleware/validator.middleware";
import {
  login,
  refreshTokenEndpoint,
  register,
} from "../controllers//auth/auth.controller";
import {
  loginRequest,
  refreshTokenRequest,
  registerRequest,
} from "../schemas/auth/auth.request.schema";

const router = Router();

router.post(
  "/refreshtoken",
  validate(refreshTokenRequest),
  refreshTokenEndpoint
);
router.post("/register", validate(registerRequest), register);
router.post("/login", validate(loginRequest), login);

export { router as authRouter };
