import { Router } from "express";
import { updateProfile } from "../controllers/profile.controller";
import verifyJWT from "../middleware/auth.middleware";
import { updateProfileSchema } from "../validation/profile.validation";
import { validate } from "../middleware/validate.middleware";

const router = Router();

router.post(
  "/updateprofile",
  updateProfileSchema,
  validate,
  verifyJWT,
  updateProfile
);

export { router as profileRouter };
