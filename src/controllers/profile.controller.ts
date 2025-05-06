import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma/prisma";

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const updateUser = await prisma.profile.update({
    where: {
      user_id: req.authUser?.id,
    },
    data: {
      username: req.body.username || undefined,
      bio: req.body.bio || undefined,
    },
  });
  res.status(200).json({
    updatedProfile: {
      username: updateUser.username,
      bio: updateUser.bio,
    },
  });
};
