import express from "express";
import { addtoilet } from "../controllers/toilet.controller";
import { validate } from "../middleware/validator.middleware";
import { createToiletRequest } from "../schemas/toilet.schema";
import verifyJWT from "../middleware/auth.middleware";

const router = express.Router();

router.post("/toilet", validate(createToiletRequest), verifyJWT, addtoilet);

export { router as toiletRouter };
