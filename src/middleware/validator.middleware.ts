import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import CustomError from "../errors/custom-error.error";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    req.body = result;
    if (!result.success) {
      throw new CustomError("Validation Error", 400, result.error);
    }
    next();
  };
