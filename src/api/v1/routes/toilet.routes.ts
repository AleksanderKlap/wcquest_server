import { Router } from "express";
import { validate } from "../../../middleware/validator.middleware";
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
import {
  boundingBoxRequest,
  commentRequest,
  createToiletRequest,
  inRadiusRequest,
  ratingRequest,
} from "../schemas/toilet/toilet.request.schema";
import {
  deleteComment,
  getToiletComments,
  getUserComments,
  newToiletComment,
} from "../controllers/toilet/comment.controller";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

//protected
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

//comments
router.post(
  "/toilet/:id/comments",
  verifyJWT,
  validate(commentRequest),
  newToiletComment
);
router.get("/toilet/comments/my", verifyJWT, getUserComments);
router.delete(
  "/toilet/:toiletId/comments/:commentId",
  verifyJWT,
  deleteComment
);

//not protected
router.get(
  "/toilet/bbox",
  validate(boundingBoxRequest, "query"),
  getInBoundingBox
);
router.get("/features", getAllFeatures);
router.get("/toilet/:id", toiletById);
router.get("/toilet/:id/ratings", getRatingsOfToilet);
router.get("/toilet/:id/ratings/avg", getToiletAvgRating);
router.get("/toilet/inradius", validate(inRadiusRequest, "query"), getInRadius);

router.get("/toilet/:id/comments", getToiletComments);

export { router as toiletRouter };
