import supabase from "../../../config/bucket";

export const uploadJPGs = async (
  file: Express.Multer.File,
  filename: string
) => {
  const { error } = await supabase.storage
    .from("toilet-photos")
    .upload(filename, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });
  return error;
};
