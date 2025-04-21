import express from "express";
import { updateProfile } from "../controllers/profile.controller";
import verifyJWT from "../middleware/auth.middleware";

const router = express.Router();

router.post("/updateprofile", verifyJWT, updateProfile);

export { router as profileRouter };
