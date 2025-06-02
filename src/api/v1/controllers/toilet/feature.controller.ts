import { Request, Response, NextFunction } from "express";
import db from "@config/database";
import { ToiletFeature } from "../../schemas/toilet/toilet.entity.schema";

export const getAllFeatures = async (req: Request, res: Response) => {
  const allFeatures: ToiletFeature[] = await db.query.feature.findMany();
  res.status(200).json(allFeatures);
};
