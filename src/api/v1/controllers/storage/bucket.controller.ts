import { Request, Response } from "express";
import CustomError from "@error/custom-error.error";
import { v4 as uuidv4 } from "uuid";
import supabase from "@config/bucket";
import db from "@config/database";
import { toiletPhoto } from "@db/schemas/schema";

// export const uploadJPG = async (req: Request, res: Response) => {
//   const toiletId = req.params.id;
//   if (!toiletId) throw new CustomError("Toilet ID not provided", 400);
//   const toiletIdNumber = parseInt(toiletId);
//   const file = req.file;

//   const userId = req.authUser!.id;
//   if (!file) throw new CustomError("File not provided", 400);

//   const filename = `${toiletId}/${uuidv4()}.jpg`;

//   const { error } = await supabase.storage
//     .from("toilet-photos")
//     .upload(filename, file.buffer, {
//       contentType: file.mimetype,
//       upsert: false,
//     });

//   if (error) throw new CustomError("Failed at uploading files", 500);

//   const { data } = supabase.storage
//     .from("toilet-photos")
//     .getPublicUrl(filename);

//   const returning = await db
//     .insert(toiletPhoto)
//     .values({
//       url: filename,
//       toiletId: toiletIdNumber,
//       userId,
//     })
//     .returning();

//   res.status(201).json(returning);
// };

// export const uploadToiletPhotos = async (req: Request, res: Response) => {
//   const toiletId = req.params.id;
//   if (!toiletId) throw new CustomError("Toilet ID not provided", 400);

//   const toiletIdNumber = parseInt(toiletId);
//   if (isNaN(toiletIdNumber)) throw new CustomError("Invalid toilet ID", 400);

//   const files = req.files as Express.Multer.File[];
//   if (!files || files.length === 0)
//     throw new CustomError("No files uploaded", 400);

//   console.log(
//     "Received files:",
//     files.map((f) => ({
//       name: f.originalname,
//       size: f.size,
//       mimetype: f.mimetype,
//     }))
//   );

//   const userId = req.authUser!.id;

//   const MAX_SIZE = 5 * 1024 * 1024;
//   for (const file of files) {
//     if (file.size > MAX_SIZE) {
//       throw new CustomError(
//         `File "${file.originalname}" exceeds 5MB size limit`,
//         400
//       );
//     }
//   }
//   const insertedPhotos = [];

//   for (const file of files) {
//     const filename = `${toiletId}/${uuidv4()}.jpg`;

//     const { error } = await supabase.storage
//       .from("toilet-photos")
//       .upload(filename, file.buffer, {
//         contentType: file.mimetype,
//         upsert: false,
//       });

//     if (error) throw new CustomError("Failed at uploading file", 500);

//     const photoRecord = await db
//       .insert(toiletPhoto)
//       .values({
//         url: filename,
//         toiletId: toiletIdNumber,
//         userId,
//       })
//       .returning();

//     insertedPhotos.push(photoRecord[0]);
//   }

//   res.status(201).json(insertedPhotos);
// };
