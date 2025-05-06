import { Request, Response } from "express";
import prisma, { p } from "../prisma";
import { Paid } from "@prisma/client";

export const addtoilet = async (req: Request, res: Response) => {
  const id = req.authUser!.id;
  const { name, description, latitude, longitude, paid, features_ids } =
    req.body;
  const toilet = await prisma.toilet.create({
    name: name,
    description: description,
    latitude: latitude,
    created_by: id,
    longitude: longitude,
    paid: paid,
    features_ids: features_ids,
  });
  res.status(200).json(toilet);
};
