import { Router } from "express";
import { updateProfile } from "../controllers/profile.controller";
import verifyJWT from "../middleware/auth.middleware";
import { validate } from "../middleware/validator.middleware";
import { updateProfileRequest } from "../schemas/profile.schema";

const router = Router();

router.patch(
  "/updateprofile",
  validate(updateProfileRequest),
  verifyJWT,
  updateProfile
);

export { router as profileRouter };
