import { PrismaClient } from "@prisma/client";
import { CreateToiletRequest } from "./schemas/toilet.schema";
const p = new PrismaClient();
const prisma = p.$extends({
  model: {
    toilet: {
      async create(data: CreateToiletRequest) {
        const toilet: CreateToiletRequest = {
          name: data.name,
          description: data.description,
          paid: data.paid,
          latitude: data.latitude,
          longitude: data.longitude,
          created_by: data.created_by,
        };

        const point = `POINT(${toilet.longitude} ${toilet.latitude})`;
        await prisma.$queryRaw`
        INSERT INTO "Toilet" (name, description, created_by, paid, location, updated_at) VALUES (
            ${toilet.name},
            ${toilet.description},
            ${toilet.created_by},
            ${toilet.paid}::"Paid",
            postgis.ST_GeomFromText(${point}, 4326),
            NOW()
        )`;
        return toilet;
      },
    },
  },
});
export const geoPrisma = new PrismaClient();

export default prisma;
