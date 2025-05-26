import { Router } from "express";
import { validate } from "../../../middleware/validator.middleware";
import {
  boundingBoxQuerySchema,
  createToiletRequest,
  getInRadiusQuerySchema,
} from "../schemas/toilet.schema";
import verifyJWT from "../../../middleware/auth.middleware";
import {
  createToilet,
  getInBoundingBox,
  getInRadius,
} from "../controllers/toilet.controller";
import { getAllFeatures } from "../controllers/feature.controller";

const router = Router();

//protected
router.post("/toilet", validate(createToiletRequest), verifyJWT, createToilet);

//not protected
router.get("/features", getAllFeatures);
router.get(
  "/toilet/inradius",
  validate(getInRadiusQuerySchema, "query"),
  getInRadius
);
router.get(
  "/toilet/bbox",
  validate(boundingBoxQuerySchema, "query"),
  getInBoundingBox
);

export { router as toiletRouter };
