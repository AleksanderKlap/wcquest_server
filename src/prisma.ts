import { PrismaClient } from "@prisma/client";
import {
  CreateToiletRequest,
  CreateToiletResponse,
} from "./schemas/toilet.schema";
import CustomError from "./errors/custom-error.error";

export const p = new PrismaClient();
const prisma = p.$extends({
  model: {
    toilet: {
      async create(
        data: CreateToiletRequest & { created_by: number }
      ): Promise<CreateToiletResponse> {
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

          const features =
            data.features_ids && data.features_ids.length > 0
              ? await tx.feature.findMany({
                  where: { id: { in: data.features_ids } },
                  select: { id: true, name: true, description: true },
                })
              : [];

          return {
            id: insertedId,
            name: data.name,
            description: data.description,
            paid: data.paid,
            latitude: data.latitude,
            longitude: data.longitude,
            created_by: data.created_by,
            features,
          };
        });
        return result;
      },
    },
  },
});
export default prisma;
