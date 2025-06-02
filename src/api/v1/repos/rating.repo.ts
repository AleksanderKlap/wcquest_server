import db from "@/config/database";
import { toiletRating } from "@/db/schemas/schema";

export const insertToiletRatingRecord = async (
  toiletId: number,
  userId: number,
  rating_cleanliness: number,
  rating_accessibility: number,
  rating_location: number
) => {
  const returning = await db
    .insert(toiletRating)
    .values({
      userId,
      toiletId,
      rating_cleanliness,
      rating_accessibility,
      rating_location,
    })
    .returning();
  return returning ? returning : null;
};
