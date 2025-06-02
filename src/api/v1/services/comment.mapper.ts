import { ToiletComment } from "../schemas/toilet/toilet.entity.schema";
import { CommentWithRelations } from "../types/types";

export const mapComment = (
  rawComment: CommentWithRelations
): ToiletComment | null => {
  if (!rawComment) return null;
  return {
    id: rawComment.id,
    created_at: rawComment.createdAt,
    toiletId: rawComment.toiletId,
    content: rawComment.content,
    created_by: {
      userId: rawComment.user.id,
      username: rawComment.user.profile!.username,
    },
  };
};
