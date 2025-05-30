import { Router } from "express";
import { validate } from "../../../middleware/validator.middleware";
import {
  boundingBoxQuerySchema,
  createToiletRequest,
  getInRadiusQuerySchema,
  ratingRequest,
} from "../schemas/toilet.schema";
import verifyJWT from "../../../middleware/auth.middleware";
import {
  createToilet,
  getInBoundingBox,
  getInRadius,
  toiletById,
  uploadToiletPhotos,
} from "../controllers/toilet/toilet.controller";
import { getAllFeatures } from "../controllers/toilet/feature.controller";
import multer from "multer";
import {
  getRatingsOfToilet,
  getToiletAvgRating,
  getUserToiletRatings,
  rateToilet,
} from "../controllers/toilet/toilet-ratings.controller";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });
router.post("/toilet", validate(createToiletRequest), verifyJWT, createToilet);
router.post(
  "/toilet/:id/photos",
  verifyJWT,
  upload.array("toilet-photos", 10),
  uploadToiletPhotos
);
router.post(
  "/toilet/:id/ratings",
  validate(ratingRequest),
  verifyJWT,
  rateToilet
);
router.get("/toilet/ratings/my", verifyJWT, getUserToiletRatings);
// router.post(
//   "/toilet/:id/photo",
//   verifyJWT,
//   upload.single("toilet-photo"),
//   uploadJPG
// );

//not protected
router.get("/features", getAllFeatures);

router.get("/toilet/:id", toiletById);
router.get("/toilet/:id/ratings", getRatingsOfToilet);
router.get("/toilet/:id/ratings/avg", getToiletAvgRating);
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

export { router as toiletRouter };
