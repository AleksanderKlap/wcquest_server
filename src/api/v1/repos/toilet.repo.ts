import db from "@/config/database";
import { toilet, toiletPhoto, toiletRating } from "@/db/schemas/schema";
import { eq, sql } from "drizzle-orm";
import {
  ToiletWithRelations,
  ToiletWithRelationsAndDistance,
} from "@v1/types/types";

export const getToiletById = async (id: number) => {
  const found = await db.query.toilet.findFirst({
    where: eq(toilet.id, id),
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
  return found;
};

export const getToiletsInRadius = async (
  x: number,
  y: number,
  radius: number,
  limit?: number,
  page?: number
): Promise<ToiletWithRelationsAndDistance[]> => {
  const point = sql`ST_SetSRID(ST_MakePoint(${x}, ${y}), 4326)`;
  if (page === undefined || limit === undefined) {
    limit = 20;
    page = 1;
  }
  const offset = (page - 1) * limit;

  const result = await db.query.toilet.findMany({
    where: sql`ST_DWithin(${toilet.location}::geography, ${point}, ${radius})`,
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

  const typedResult = result.map((r) => ({
    ...r,
    distance: Number(r.distance),
  })) as ToiletWithRelationsAndDistance[];
  return typedResult;
};

export const getToiletsInBBox = async (
  minlng: number,
  minlat: number,
  maxlng: number,
  maxlat: number,
  ulng?: number,
  ulat?: number,
  limit?: number,
  page?: number
): Promise<ToiletWithRelationsAndDistance[]> => {
  if (page === undefined || limit === undefined) {
    limit = 20;
    page = 1;
  }
  const offset = (page - 1) * limit;

  let userPoint;
  if (ulng !== undefined && ulat !== undefined) {
    userPoint =
      ulng !== null && ulat !== null
        ? sql`ST_SetSRID(ST_MakePoint(${ulng}, ${ulat}), 4326)`
        : null;
  }
  const bbox = sql`ST_MakeEnvelope(${minlng}, ${minlat}, ${maxlng}, ${maxlat}, 4326)`;

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
        photos: {
          with: { user: { with: { profile: true } } },
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
        photos: {
          with: { user: { with: { profile: true } } },
        },
      },
      extras: {
        distance: sql`NULL`.as("distance"),
      },
      limit,
      offset,
    });
  }
  // const typedResult = result.map((r) => ({
  //   ...r,
  // })) as ToiletWithRelationsAndDistance[];
  return result as ToiletWithRelationsAndDistance[];
};

export const insertToiletPhotoRecord = async (
  url: string,
  toiletId: number,
  userId: number
) => {
  const returning = await db
    .insert(toiletPhoto)
    .values({
      url: url,
      toiletId: toiletId,
      userId,
    })
    .returning();
  return returning;
};
