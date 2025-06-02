import db from "@config/database";
import { Request, Response } from "express";
import { toilet, toiletToFeatures } from "@/db/schemas/schema";
import { eq, sql } from "drizzle-orm";
import CustomError from "@error/custom-error.error";
import { v4 as uuidv4 } from "uuid";
import { uploadJPGs } from "@/api/v1/repos/bucket.repo";
import {
  arrayToiletResponseMapper,
  singleToiletResponseMapper,
} from "../../services/toilet.mapper";
import { CreateToiletRequest } from "../../schemas/toilet/toilet.request.schema";
import {
  ToiletResponse,
  ToiletResponseWithDistance,
} from "../../schemas/toilet/toilet.response.schema";
import {
  getToiletById,
  getToiletsInBBox,
  getToiletsInRadius,
  insertToiletPhotoRecord,
} from "../../repos/toilet.repo";

export const toiletById = async (req: Request, res: Response) => {
  const toiletId = parseInt(req.params.id);
  if (!toiletId) throw new CustomError("Toilet ID is required", 400);

  const found = await getToiletById(toiletId);
  if (!found) throw new CustomError("Toilet not found", 404);

  const response = singleToiletResponseMapper(found);
  res.status(200).json(response);
};

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
        location: sql`ST_SetSRID(ST_MakePoint(${data.longitude}, ${data.latitude}), 4326)`,
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
        photos: {
          with: { user: { with: { profile: true } } },
        },
      },
    });
    return inserted;
  });
  if (!created) throw new CustomError("Failed inserting new toilet", 500);
  const response: ToiletResponse | null = singleToiletResponseMapper(created);
  if (!response) throw new CustomError("Toilet not found", 404);
  res.status(200).json(response);
};

export const getInRadius = async (req: Request, res: Response) => {
  const lng = parseFloat(req.query.lng as string);
  const lat = parseFloat(req.query.lat as string);
  const radius = parseFloat(req.query.radius as string);
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const result = await getToiletsInRadius(lng, lat, radius, limit, page);
  if (!result) throw new CustomError("No toilets found in radius", 404);

  const response: ToiletResponseWithDistance[] =
    arrayToiletResponseMapper(result);
  res.status(200).json(response);
};

export const getInBoundingBox = async (req: Request, res: Response) => {
  const minlng = parseFloat(req.query.minlng as string);
  const minlat = parseFloat(req.query.minlat as string);
  const maxlng = parseFloat(req.query.maxlng as string);
  const maxlat = parseFloat(req.query.maxlat as string);
  //user location - optional
  const ulng = req.query.ulng
    ? parseFloat(req.query.ulng as string)
    : undefined;
  const ulat = req.query.ulat
    ? parseFloat(req.query.ulat as string)
    : undefined;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const result = await getToiletsInBBox(
    minlng,
    minlat,
    maxlng,
    maxlat,
    ulng,
    ulat,
    limit,
    page
  );

  const response: ToiletResponseWithDistance[] =
    arrayToiletResponseMapper(result);
  res.status(200).json(response);
};

export const uploadToiletPhotos = async (req: Request, res: Response) => {
  const userId = req.authUser!.id;

  const toiletId = req.params.id;
  if (!toiletId) throw new CustomError("Toilet ID not provided", 400);

  const toiletIdNumber = parseInt(toiletId);
  if (isNaN(toiletIdNumber)) throw new CustomError("Invalid toilet ID", 400);

  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0)
    throw new CustomError("No files uploaded", 400);

  //TODO: move this size to config
  const MAX_SIZE = 2 * 1024 * 1024;
  for (const file of files) {
    if (file.size > MAX_SIZE) {
      throw new CustomError(
        `File "${file.originalname}" exceeds 5MB size limit`,
        400
      );
    }
  }
  const insertedPhotos = [];

  for (const file of files) {
    const filename = `${toiletId}/${uuidv4()}.jpg`;

    const error = await uploadJPGs(file, filename);
    if (error) throw new CustomError("Failed at uploading file", 500);

    const photoRecord = await insertToiletPhotoRecord(
      filename,
      toiletIdNumber,
      userId
    );
    insertedPhotos.push(photoRecord[0]);
  }

  res.status(201).json(insertedPhotos);
};
