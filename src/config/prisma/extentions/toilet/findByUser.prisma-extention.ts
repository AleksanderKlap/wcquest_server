import { Prisma, PrismaClient } from "@prisma/client";
import { ToiletSchema } from "../../../../schemas/toilet.schema";

const prisma = new PrismaClient();

export const findByUserExtention = Prisma.defineExtension({
  name: "findToiletByUserExtention",
  model: {
    toilet: {
      //   async findByUser(userId: number) {
      //     const toilets = prisma.$queryRaw<Omit<ToiletSchema, "features">>`
      //     SELECT
      //     t.id,
      //     t.name,
      //     t.description,
      //     t.paid,
      //     postgis.ST_Y(t.location::postgis.geometry) as latitude
      //     postgis.ST_X(t.location::postgis.geometry) as longitude
      //     t.created_by
      //     FROM "Toilet" t
      //     WHERE t.created_by == ${userId}`;
      //   },
    },
  },
});
