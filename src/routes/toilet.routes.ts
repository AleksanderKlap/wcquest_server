import express from "express";
import { addtoilet } from "../controllers/toilet.controller";

const router = express.Router();

router.post("/toilet", addtoilet);

export { router as toiletRouter };
