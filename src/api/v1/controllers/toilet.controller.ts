import db from "../../../config/database";
import { Request, Response } from "express";
import { toilet, toiletToFeatures } from "../../../db/schemas/schema";
import { CreateToiletRequest, ToiletSchema } from "../schemas/toilet.schema";
import { eq } from "drizzle-orm";
import CustomError from "../../../errors/custom-error.error";

export const createToilet = async (req: Request, res: Response) => {
  const createdBy = req.authUser!.id;
  const data: CreateToiletRequest = {
    name: req.body.name,
    description: req.body.description,
    paid: req.body.paid,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    features_ids: req.body.features_ids || [],
  };
  const created = await db.transaction(async (tx) => {
    const [newToilet] = await tx
      .insert(toilet)
      .values({
        name: data.name,
        description: data.description,
        createdBy,
        paid: data.paid,
        location: { x: data.longitude, y: data.latitude },
      })
      .returning();

    if (data.features_ids && data.features_ids.length > 0) {
      const featureLinks = data.features_ids.map((f) => ({
        toiletId: newToilet.id,
        featureId: f,
      }));
      await tx.insert(toiletToFeatures).values(featureLinks);
    }

    const inserted = await tx.query.toilet.findFirst({
      where: eq(toilet.id, newToilet.id),
      with: {
        toiletToFeatures: {
          with: { feature: true },
        },
        user: {
          with: { profile: true },
        },
      },
    });
    return inserted;
  });
  if (!created) throw new CustomError("Failed inserting new toilet", 500);
  const response: ToiletSchema = {
    id: created.id,
    name: created.name,
    description: created.description,
    paid: created.paid,
    location: {
      latitude: created.location.y,
      longitude: created.location.x,
    },
    created_by: {
      id: created.user.id,
      username: created.user.profile!.username,
      bio: created.user.profile!.bio,
    },
    features: created.toiletToFeatures.map((t) => t.feature),
  };
  res.status(200).json(response);
};
