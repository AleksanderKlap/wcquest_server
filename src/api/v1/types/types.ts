import { getCommentById } from "../repos/comment.repo";
import { getToiletById } from "../repos/toilet.repo";

export type ToiletWithRelations = Awaited<ReturnType<typeof getToiletById>>;
export type ToiletWithRelationsAndDistance = ToiletWithRelations & {
  distance: number | null;
};

export type CommentWithRelations = Awaited<ReturnType<typeof getCommentById>>;
