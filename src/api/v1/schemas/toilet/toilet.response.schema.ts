import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { Paid, toiletFeature, toiletPhoto } from "./toilet.entity.schema";
extendZodWithOpenApi(z);

export const allFeaturesResponse = z.object({
  features: z.array(toiletFeature),
});

//GET TOILET RESPONSE
export const toiletResponse = z.object({
  id: z.number().openapi({ example: 42 }),
  name: z.string().openapi({ example: "McDonald Toilet" }),
  description: z.string().openapi({ example: "On the second floor" }),
  paid: z.nativeEnum(Paid).openapi({ example: Paid.FREE }),
  location: z.object({
    latitude: z.number().openapi({ example: -12.04221 }),
    longitude: z.number().openapi({ example: 121.04221 }),
  }),
  created_by: z.object({
    id: z.number().openapi({ example: 123 }),
    username: z.string().openapi({ example: "Cool user" }),
    bio: z.string().openapi({ example: "I love to pee in McDonald" }),
  }),
  features: z.array(toiletFeature).openapi({
    example: [
      { id: 1, name: "Feature 1", description: null },
      { id: 2, name: "Feature 2", description: null },
      { id: 3, name: "Feature 3", description: null },
    ],
  }),
  photos: z.array(toiletPhoto).openapi({
    example: [
      {
        id: 1,
        url: "/uploads/photo1.jpg",
        addedBy: {
          userId: 5,
          username: "toiletFan99",
        },
        createdAt: new Date(),
      },
      {
        id: 2,
        url: "/uploads/photo2.jpg",
        addedBy: {
          userId: 7,
          username: "bathroomExplorer",
        },
        createdAt: new Date(),
      },
    ],
  }),
});
export type ToiletResponse = z.infer<typeof toiletResponse>;
export type ToiletResponseWithDistance = ToiletResponse & {
  distance: number | null;
};
