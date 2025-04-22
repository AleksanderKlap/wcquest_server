import { Request, Response, NextFunction } from "express";
import CustomError from "../errors/custom-error.error";
import { ZodError } from "zod";

export function routeNotFound(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  next(new CustomError("Route not found", 404));
}

export default function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      error: err.message,
      cause: err.cause,
    });
    return;
  }

  console.error("Unexpected error:", err);
  res.status(500).json({
    error: "Internal Server Error",
  });
}
