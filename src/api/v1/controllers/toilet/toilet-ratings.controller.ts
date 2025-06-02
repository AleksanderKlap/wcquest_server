import { Request, Response } from "express";
import CustomError from "@error/custom-error.error";
import { eq, sql, desc } from "drizzle-orm";
import db from "@config/database";
import { avgRatingView, toilet, toiletRating } from "@db/schemas/schema";
import { insertToiletRatingRecord } from "../../repos/rating.repo";

export const rateToilet = async (req: Request, res: Response) => {
  //get toilet id and user id from params
  const userId = req.authUser!.id;

  const toiletId = req.params.id;
  if (!toiletId) throw new CustomError("ToiletID not provided", 400);

  const toiletIdNumber = parseInt(toiletId);
  if (isNaN(toiletIdNumber)) throw new CustomError("Invalid toilet ID", 400);

  //get ratings from the body
  const rating_cleanliness = req.body.rating_cleanliness;
  const rating_accessibility = req.body.rating_accessibility;
  const rating_location = req.body.rating_location;

  //TODO: create DB util exists()
  //check if exists
  const exists = await db
    .select({ exists: sql<boolean>`1` })
    .from(toilet)
    .where(eq(toilet.id, toiletIdNumber))
    .limit(1);
  if (!exists[0]) {
    throw new CustomError("Toilet not found", 404);
  }
  //add new toilet rating record
  const returning = await insertToiletRatingRecord(
    toiletIdNumber,
    userId,
    rating_cleanliness,
    rating_accessibility,
    rating_location
  );
  if (!returning) throw new CustomError("Could not insert rating into DB", 500);

  const avgRating = await db
    .select()
    .from(avgRatingView)
    .where(eq(avgRatingView.toiletId, toiletIdNumber));

  const response = {
    userRating: returning[0],
    avgRating: avgRating[0],
  };

  //response with just rated, and overall rating now
  res.status(201).json(response);
};

export const getToiletAvgRating = async (req: Request, res: Response) => {
  const toiletId = req.params.id;
  if (!toiletId) throw new CustomError("ToiletID not provided", 400);

  const toiletIdNumber = parseInt(toiletId);
  if (isNaN(toiletIdNumber)) throw new CustomError("Invalid toilet ID", 400);

  const exists = await db
    .select({ exists: sql<boolean>`1` })
    .from(toilet)
    .where(eq(toilet.id, toiletIdNumber))
    .limit(1);
  if (!exists[0]) {
    throw new CustomError("Toilet not found", 404);
  }

  const avgRating = await db
    .select()
    .from(avgRatingView)
    .where(eq(avgRatingView.toiletId, toiletIdNumber));

  const response = {
    avgRating: avgRating[0],
  };
  res.status(200).json(response);
};

export const getUserToiletRatings = async (req: Request, res: Response) => {
  const userId = req.authUser!.id;

  const result = await db
    .select()
    .from(toiletRating)
    .where(eq(toiletRating.userId, userId))
    .orderBy(desc(toiletRating.createdAt));

  res.status(200).json(result);
};

export const getRatingsOfToilet = async (req: Request, res: Response) => {
  const toiletId = req.params.id;
  if (!toiletId) throw new CustomError("ToiletID not provided", 400);

  const toiletIdNumber = parseInt(toiletId);
  if (isNaN(toiletIdNumber)) throw new CustomError("Invalid toilet ID", 400);

  const exists = await db
    .select({ exists: sql<boolean>`1` })
    .from(toilet)
    .where(eq(toilet.id, toiletIdNumber))
    .limit(1);
  if (!exists[0]) {
    throw new CustomError("Toilet not found", 404);
  }

  const result = await db
    .select()
    .from(toiletRating)
    .where(eq(toiletRating.toiletId, toiletIdNumber))
    .orderBy(desc(toiletRating.createdAt));

  res.status(200).json(result);
};
