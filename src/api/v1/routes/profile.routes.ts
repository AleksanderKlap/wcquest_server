import { Router } from "express";
import { validate } from "../../../middleware/validator.middleware";
import { updateProfileRequest } from "../schemas/user/profile.schema";
import verifyJWT from "../../../middleware/auth.middleware";
import { updateProfile } from "../controllers/user/profile.controller";

const router = Router();

router.patch(
  "/profile",
  validate(updateProfileRequest),
  verifyJWT,
  updateProfile
);

export { router as profileRouter };
