import { PrismaClient } from "@prisma/client";
import {
  CreateToiletRequest,
  CreateToiletResponse,
} from "./schemas/toilet.schema";
import CustomError from "./errors/custom-error.error";

const p = new PrismaClient();
const prisma = p.$extends({
  model: {
    toilet: {
      async create(data: CreateToiletRequest): Promise<CreateToiletResponse> {
        const point = `POINT(${data.longitude} ${data.latitude})`;
        const result = await prisma.$transaction(async (tx) => {
          const insertedToilet = await tx.$queryRaw<
            {
              id: number;
            }[]
          >`INSERT INTO "Toilet" (name, description, location, created_by, created_at, updated_at, paid) 
          VALUES (${data.name}, ${data.description}, postgis.ST_GeomFromText(${point}, 4326), ${data.created_by}, NOW(), NOW(), ${data.paid}::"Paid") RETURNING id`;
          if (!insertedToilet)
            throw new CustomError("Failed inserting new toilet", 500);
          const insertedId = insertedToilet[0].id;
          if (data.features_ids) {
            await tx.toiletFeature.createMany({
              data: data.features_ids.map((feature_id) => ({
                toilet_id: insertedId,
                feature_id: feature_id,
              })),
            });
          }
          return {
            id: insertedId,
            name: data.name,
            description: data.description,
            paid: data.paid,
            latitude: data.latitude,
            longitude: data.longitude,
            created_by: data.created_by,
            features: data.features_ids,
          };
        });
        return result;
      },
      async findAll(): Promise<CreateToiletResponse[]> {
        const toilets = await prisma.$queryRaw<
          {
            id: number;
            name: string;
            description: string;
            paid: "FREE" | "PAID";
            created_by: number;
            longitude: number;
            latitude: number;
          }[]
        >`
          SELECT 
            t.id,
            t.name,
            t.description,
            t.paid,
            t.created_by,
            ST_X(t.location::geometry) AS longitude,
            ST_Y(t.location::geometry) AS latitude
          FROM "Toilet" t
        `;
        const toiletFeatures = await prisma.toiletFeature.findMany({
          where: {
            toilet_id: { in: toilets.map((t) => t.id) },
          },
          select: {
            toilet_id: true,
            feature_id: true,
          },
        });
        const toiletsWithFeatures = toilets.map((toilet) => {
          const features = toiletFeatures
            .filter((tf) => tf.toilet_id === toilet.id)
            .map((tf) => tf.feature_id);
          return {
            ...toilet,
            features: features.length > 0 ? features : [],
          };
        });
        return toiletsWithFeatures;
      },
    },
  },
});
export default prisma;
