import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import CustomError from "../errors/custom-error.error";

export const validate =
  (schema: ZodSchema, source: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      throw new CustomError("Validation Error", 400, result.error);
    }
    Object.assign(req[source], result.data);
    next();
  };
