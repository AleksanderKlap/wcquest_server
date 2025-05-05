import { Request, Response } from "express";
import prisma from "../prisma";

export const addtoilet = async (req: Request, res: Response) => {
  const id = req.authUser?.id;
  const { name, description, created_by, latitude, longitude, paid } = req.body;
  const toilet = await prisma.toilet.create({
    name: name,
    description: description,
    created_by: created_by,
    latitude: latitude,
    longitude: longitude,
    paid: paid,
  });
  res.status(200).json(toilet);
};
