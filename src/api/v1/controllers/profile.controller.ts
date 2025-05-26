import { Request, Response, NextFunction } from "express";
import db from "../../../config/database";
import { profile } from "../../../db/schemas/schema";
import { eq } from "drizzle-orm";
import { UpdateProfileResponse } from "../schemas/profile.schema";

export const updateProfile = async (req: Request, res: Response) => {
  const [updateUser] = await db
    .update(profile)
    .set({
      username: req.body.username || undefined,
      bio: req.body.bio || undefined,
    })
    .where(eq(profile.userId, req.authUser!.id))
    .returning();
  const toReturn: UpdateProfileResponse = {
    username: updateUser.username,
    bio: updateUser.bio,
  };
  res.status(200).json(toReturn);
};
