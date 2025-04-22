import { Router } from "express";
import { updateProfile } from "../controllers/profile.controller";
import verifyJWT from "../middleware/auth.middleware";

const router = Router();

router.post("/updateprofile", verifyJWT, updateProfile);

export { router as profileRouter };
