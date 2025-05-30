import { eq, sql } from "drizzle-orm";
import db from "../../../config/database";
import { toilet, toiletPhoto } from "../../../db/schemas/schema";
import {
  ToiletResponse,
  ToiletResponseWithDistance,
  toiletWithQuery,
  ToiletWithRelations,
} from "../schemas/toilet.schema";

export const getToiletById = async (id: number) => {
  const found = await db.query.toilet.findFirst({
    where: eq(toilet.id, id),
    with: toiletWithQuery,
  });
  return found;
};

export const getToiletsInRadius = async (
  x: number,
  y: number,
  radius: number,
  limit?: number,
  page?: number
): Promise<(ToiletWithRelations & { distance: number })[]> => {
  const point = sql`ST_SetSRID(ST_MakePoint(${x}, ${y}), 4326)`;
  if (page === undefined || limit === undefined) {
    limit = 20;
    page = 1;
  }
  const offset = (page - 1) * limit;

  const result = await db.query.toilet.findMany({
    where: sql`ST_DWithin(${toilet.location}::geography, ${point}, ${radius})`,
    with: toiletWithQuery,
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
  })) as (ToiletWithRelations & { distance: number })[];
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
): Promise<(ToiletWithRelations & { distance: number | null })[]> => {
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
      with: toiletWithQuery,
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
      with: toiletWithQuery,
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

  const typedResult = result.map((r) => ({
    ...r,
    distance: r.distance !== undefined ? Number(r.distance) : null,
  })) as (ToiletWithRelations & { distance: number | null })[];
  return typedResult;
};

export const singleToiletResponseMapper = (
  result: ToiletWithRelations
): ToiletResponse | null => {
  if (!result) return null;
  const response: ToiletResponse = {
    id: result.id,
    name: result.name,
    description: result.description,
    paid: result.paid,
    location: {
      latitude: result.location.y,
      longitude: result.location.x,
    },
    created_by: {
      id: result.user.id,
      username: result.user.profile!.username,
      bio: result.user.profile!.bio,
    },
    features: result.toiletToFeatures.map((tf) => tf.feature),
    photos: result.photos.map((tp) => ({
      id: tp.id,
      createdAt: tp.createdAt,
      url: tp.url,
      addedBy: {
        userId: tp.userId,
        username: tp.user.profile!.username,
      },
    })),
  };
  return response;
};

export const arrayToiletResponseMapper = (
  result: (ToiletWithRelations & { distance: number | null })[]
): ToiletResponseWithDistance[] => {
  const response = result.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    paid: t.paid,
    location: {
      latitude: t.location.y,
      longitude: t.location.x,
    },
    distance: t.distance ? t.distance : null,
    created_by: {
      id: t.user.id,
      username: t.user.profile!.username,
      bio: t.user.profile!.bio,
    },
    features: t.toiletToFeatures.map((tf) => tf.feature),
    photos: t.photos.map((tp) => ({
      id: tp.id,
      createdAt: tp.createdAt,
      url: tp.url,
      addedBy: {
        userId: tp.userId,
        username: tp.user.profile!.username,
      },
    })),
  }));
  return response;
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
