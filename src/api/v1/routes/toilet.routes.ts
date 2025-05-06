import { Router } from "express";
import { validate } from "../../../middleware/validator.middleware";
import { createToiletRequest } from "../schemas/toilet.schema";
import verifyJWT from "../../../middleware/auth.middleware";
import { createToilet } from "../controllers/toilet.controller";

const router = Router();

router.post("/toilet", validate(createToiletRequest), verifyJWT, createToilet);

export { router as toiletRouter };
