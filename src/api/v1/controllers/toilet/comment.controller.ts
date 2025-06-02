import db from "@/config/database";
import { toilet, toiletComment, user } from "@/db/schemas/schema";
import CustomError from "@/errors/custom-error.error";
import { eq, sql } from "drizzle-orm";
import { Request, Response } from "express";
import {
  deleteToiletCommentDB,
  getCommentById,
  getToiletCommentsDB,
  getUserCommentsDB,
  insertToiletComment,
} from "../../repos/comment.repo";
import { mapComment } from "../../services/comment.mapper";
import { ToiletComment } from "../../schemas/toilet/toilet.entity.schema";

export const newToiletComment = async (req: Request, res: Response) => {
  const userId = req.authUser!.id;
  const toiletId = req.params.id;
  if (!toiletId) throw new CustomError("ToiletID not provided", 400);
  const toiletIdNumber = parseInt(toiletId);
  if (isNaN(toiletIdNumber)) throw new CustomError("Invalid toilet ID", 400);

  const exists = await db
    .select({ exists: sql<boolean>`1` })
    .from(toilet)
    .where(eq(toilet.id, toiletIdNumber))
    .limit(1);
  if (!exists[0]) {
    throw new CustomError("Toilet not found", 404);
  }

  const content = req.body.content;

  const rawInserted = await insertToiletComment(
    toiletIdNumber,
    userId,
    content
  );
  if (!rawInserted)
    throw new CustomError("Could not insert comment into DB", 500);
  const inserted = await getCommentById(rawInserted.id);
  if (!inserted) throw new CustomError("Could not insert comment into DB", 500);
  res.status(201).json(mapComment(inserted));
};

export const getUserComments = async (req: Request, res: Response) => {
  const userId = req.authUser!.id;
  const rawUserComments = await getUserCommentsDB(userId);
  if (!rawUserComments) throw new CustomError("Could not fetch data", 500);
  const userComments: ToiletComment[] = rawUserComments
    .map((c) => mapComment(c))
    .filter((c): c is ToiletComment => c !== null);
  res.status(200).json(userComments);
};

//TODO: add pagination
export const getToiletComments = async (req: Request, res: Response) => {
  const toiletId = req.params.id;
  if (!toiletId) throw new CustomError("ToiletID not provided", 400);
  const toiletIdNumber = parseInt(toiletId);
  if (isNaN(toiletIdNumber)) throw new CustomError("Invalid toilet ID", 400);
  const exists = await db
    .select({ exists: sql<boolean>`1` })
    .from(toilet)
    .where(eq(toilet.id, toiletIdNumber))
    .limit(1);
  if (!exists[0]) {
    throw new CustomError("Toilet not found", 404);
  }
  const rawToiletComments = await getToiletCommentsDB(toiletIdNumber);
  if (!rawToiletComments) throw new CustomError("Could not fetch data", 500);
  const toiletComments: ToiletComment[] = rawToiletComments
    .map((c) => mapComment(c))
    .filter((c): c is ToiletComment => c !== null);
  res.status(200).json(toiletComments);
};

export const deleteComment = async (req: Request, res: Response) => {
  const userId = req.authUser!.id;
  const toiletId = req.params.toiletId;
  if (!toiletId) throw new CustomError("ToiletID not provided", 400);
  const toiletIdNumber = parseInt(toiletId);
  if (isNaN(toiletIdNumber)) throw new CustomError("Invalid toilet ID", 400);
  const commentId = req.params.commentId;
  if (!commentId) throw new CustomError("Comment ID not provided", 400);
  const commentIdNumber = parseInt(commentId);
  if (isNaN(toiletIdNumber)) throw new CustomError("Invalid comment ID", 400);

  const exists = await db
    .select({ exists: sql<boolean>`1` })
    .from(toilet)
    .where(eq(toilet.id, toiletIdNumber))
    .limit(1);
  if (!exists[0]) {
    throw new CustomError("Toilet not found", 404);
  }

  await deleteToiletCommentDB(commentIdNumber);

  const deleteCheck = await db.query.toiletComment.findFirst({
    where: eq(toiletComment.id, commentIdNumber),
  });
  if (deleteCheck) throw new CustomError("Could not delete data", 500);
  res.status(204).json({ message: "Deleted sucessfully" });
};
