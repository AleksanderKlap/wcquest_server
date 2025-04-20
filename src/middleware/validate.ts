import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res
      .status(400)
      .json({ message: "Input validation error", errors: errors.array() });
    return;
  }
  next();
};
