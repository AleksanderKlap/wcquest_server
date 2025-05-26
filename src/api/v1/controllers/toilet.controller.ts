import db from "../../../config/database";
import { Request, Response } from "express";
import { toilet, toiletToFeatures } from "../../../db/schemas/schema";
import {
  CreateToiletRequest,
  CreateToiletResponse,
} from "../schemas/toilet.schema";
import { eq, getTableColumns, sql } from "drizzle-orm";
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
      },
    });
    return inserted;
  });
  if (!created) throw new CustomError("Failed inserting new toilet", 500);
  const response: CreateToiletResponse = {
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

export const getInRadius = async (req: Request, res: Response) => {
  const lng = parseFloat(req.query.lng as string);
  const lat = parseFloat(req.query.lat as string);
  const radius = parseFloat(req.query.radius as string);
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;

  const point = sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)`;

  const result = await db.query.toilet.findMany({
    where: sql`ST_DWithin(${toilet.location}::geography, ${point}, ${radius})`,
    with: {
      toiletToFeatures: {
        with: { feature: true },
      },
      user: {
        with: { profile: true },
      },
    },
    orderBy: (toilet, { sql }) =>
      sql`${toilet.location}::geography<-> ${point}`,
    extras: {
      distance: sql`ST_Distance(${toilet.location}::geography, ${point})`.as(
        "distance"
      ),
    },
    limit,
    offset,
  });

  const response = result.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    paid: t.paid,
    location: {
      latitude: t.location.y,
      longitude: t.location.x,
    },
    distance: t.distance,
    created_by: {
      id: t.user.id,
      username: t.user.profile?.username,
      bio: t.user.profile?.bio,
    },
    features: t.toiletToFeatures.map((tf) => tf.feature),
  }));
  res.status(200).json(response);
};

export const getInBoundingBox = async (req: Request, res: Response) => {
  const minlng = parseFloat(req.query.minlng as string);
  const minlat = parseFloat(req.query.minlat as string);
  const maxlng = parseFloat(req.query.maxlng as string);
  const maxlat = parseFloat(req.query.maxlat as string);
  //user location - optional
  const ulng = req.query.ulng ? parseFloat(req.query.ulng as string) : null;
  const ulat = req.query.ulat ? parseFloat(req.query.ulat as string) : null;

  const userPoint =
    ulng !== null && ulat !== null
      ? sql`ST_SetSRID(ST_MakePoint(${ulng}, ${ulat}), 4326)`
      : null;
  const bbox = sql`ST_MakeEnvelope(${minlng}, ${minlat}, ${maxlng}, ${maxlat}, 4326)`;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;
  let result;
  if (userPoint) {
    result = await db.query.toilet.findMany({
      where: sql`ST_Within(${toilet.location}, ${bbox})`,
      with: {
        toiletToFeatures: {
          with: { feature: true },
        },
        user: {
          with: { profile: true },
        },
      },
      orderBy: (toilet, { sql }) =>
        sql`${toilet.location}::geography<-> ${userPoint}`,
      extras: {
        distance:
          sql`ST_Distance(${toilet.location}::geography, ${userPoint})`.as(
            "distance"
          ),
      },
      limit,
      offset,
    });
  } else {
    result = await db.query.toilet.findMany({
      where: sql`ST_Within(${toilet.location}, ${bbox})`,
      with: {
        toiletToFeatures: {
          with: { feature: true },
        },
        user: {
          with: { profile: true },
        },
      },
      extras: {
        distance:
          sql`ST_Distance(${toilet.location}::geography, ${userPoint})`.as(
            "distance"
          ),
      },
      limit,
      offset,
    });
  }

  const response = result.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    paid: t.paid,
    location: {
      latitude: t.location.y,
      longitude: t.location.x,
    },
    distance: t.distance,
    created_by: {
      id: t.user.id,
      username: t.user.profile?.username,
      bio: t.user.profile?.bio,
    },
    features: t.toiletToFeatures.map((tf) => tf.feature),
  }));
  res.status(200).json(response);
};
