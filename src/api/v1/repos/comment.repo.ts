import db from "@/config/database";
import { toiletComment } from "@/db/schemas/schema";
import { desc, eq } from "drizzle-orm";

export const getCommentById = async (commentId: number) => {
  const comment = await db.query.toiletComment.findFirst({
    where: eq(toiletComment.id, commentId),
    with: {
      user: { with: { profile: true } },
    },
  });
  return comment ? comment : null;
};

export const insertToiletComment = async (
  toiletId: number,
  userId: number,
  content: string
) => {
  const inserted = await db
    .insert(toiletComment)
    .values({
      userId: userId,
      toiletId: toiletId,
      content: content,
    })
    .returning();
  return inserted[0] ? inserted[0] : null;
};

export const getUserCommentsDB = async (userId: number) => {
  const userComments = await db.query.toiletComment.findMany({
    where: eq(toiletComment.userId, userId),
    with: {
      user: { with: { profile: true } },
    },
    orderBy: desc(toiletComment.createdAt),
  });
  return userComments;
};

export const getToiletCommentsDB = async (toiletId: number) => {
  const toiletComments = await db.query.toiletComment.findMany({
    where: eq(toiletComment.toiletId, toiletId),
    with: {
      user: { with: { profile: true } },
    },
    orderBy: desc(toiletComment.createdAt),
  });
  return toiletComments;
};

export const deleteToiletCommentDB = async (commentId: number) => {
  await db.delete(toiletComment).where(eq(toiletComment.id, commentId));
};
