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
  toiletById,
  uploadToiletPhotos,
} from "../controllers/toilet.controller";
import { getAllFeatures } from "../controllers/feature.controller";
import multer from "multer";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });
router.post("/toilet", validate(createToiletRequest), verifyJWT, createToilet);
router.post(
  "/toilet/:id/photos",
  verifyJWT,
  upload.array("toilet-photos", 10),
  uploadToiletPhotos
);
// router.post(
//   "/toilet/:id/photo",
//   verifyJWT,
//   upload.single("toilet-photo"),
//   uploadJPG
// );

//not protected
router.get("/features", getAllFeatures);
router.get(
  "/toilet/bbox",
  validate(boundingBoxQuerySchema, "query"),
  getInBoundingBox
);
router.get(
  "/toilet/inradius",
  validate(getInRadiusQuerySchema, "query"),
  getInRadius
);
router.get("/toilet/:id", toiletById);

export { router as toiletRouter };
