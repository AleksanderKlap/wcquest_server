import { Request, Response, NextFunction } from "express";
import db from "../../../../config/database";
import { FeatureSchema } from "../../schemas/toilet.schema";

export const getAllFeatures = async (req: Request, res: Response) => {
  const allFeatures: FeatureSchema[] = await db.query.feature.findMany();
  res.status(200).json(allFeatures);
};
